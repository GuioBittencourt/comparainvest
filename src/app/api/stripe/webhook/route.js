/**
 * /api/stripe/webhook — endpoint que recebe eventos do Stripe.
 *
 * URL pública: https://comparainvest.vercel.app/api/stripe/webhook
 *
 * Eventos tratados:
 *   checkout.session.completed       → libera Premium pelo plano comprado
 *   customer.subscription.updated    → ajusta plano se cliente trocou
 *   customer.subscription.deleted    → revoga Premium ao cancelar
 *   invoice.payment_succeeded        → renovação recorrente — estende expira
 *   invoice.payment_failed           → mantém Premium até expirar (graça)
 *
 * Segurança:
 *   - Valida assinatura HMAC do Stripe (impede webhook forjado)
 *   - Idempotência via processed_webhooks (não processa 2x mesmo evento)
 *   - Usa SUPABASE_SERVICE_ROLE_KEY (bypassa RLS pra atualizar profiles)
 *
 * Variáveis de ambiente necessárias no Vercel:
 *   STRIPE_SECRET_KEY            (sk_live_... ou sk_test_...)
 *   STRIPE_WEBHOOK_SECRET        (whsec_...)
 *   NEXT_PUBLIC_SUPABASE_URL     (URL do Supabase)
 *   SUPABASE_SERVICE_ROLE_KEY    (chave admin — NÃO a anon)
 */

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { detectarPlano, calcularExpiracao } from "../../../../lib/stripe";

// Stripe e Supabase clients (instanciados 1x por cold start)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Webhook precisa do raw body (não pode ser parsed JSON) pra validar assinatura.
// Esse export força o Next.js a entregar o body cru.


/* ══════════════════════════════════════════════════════════
   IDEMPOTÊNCIA
   ══════════════════════════════════════════════════════════ */

/**
 * Tenta marcar um evento como processado.
 * Se já existia (return false), o webhook deve sair sem fazer nada.
 */
async function marcarComoProcessado(eventId, eventType) {
  const { error } = await supabase
    .from("processed_webhooks")
    .insert({ event_id: eventId, event_type: eventType });

  // Erro 23505 = unique violation = evento JÁ processado antes
  if (error && error.code === "23505") return false;
  if (error) {
    console.error("[webhook] erro ao marcar processado:", error);
    // Em caso de outro erro, continua processando — duplicar é melhor que perder
    return true;
  }
  return true;
}

/* ══════════════════════════════════════════════════════════
   AÇÕES DE NEGÓCIO
   ══════════════════════════════════════════════════════════ */

/**
 * Encontra o profile pelo email OU stripe_customer_id.
 * Tenta primeiro pelo customer_id (mais confiável), depois email.
 */
async function encontrarProfile({ customerId, email }) {
  if (customerId) {
    const { data: byCustomer } = await supabase
      .from("profiles")
      .select("id, email, is_premium")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    if (byCustomer) return byCustomer;
  }

  if (email) {
    const { data: byEmail } = await supabase
      .from("profiles")
      .select("id, email, is_premium")
      .ilike("email", email)
      .maybeSingle();
    if (byEmail) return byEmail;
  }

  return null;
}

/**
 * Libera Premium pra um perfil — usado em checkout completo e renovação.
 */
async function liberarPremium({ profile, plano, customerId, subscriptionId, expira }) {
  const update = {
    is_premium: true,
    premium_plano: plano,
    premium_inicio: new Date().toISOString(),
    premium_expira: expira,
  };
  if (customerId) update.stripe_customer_id = customerId;
  if (subscriptionId) update.stripe_subscription_id = subscriptionId;

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", profile.id);

  if (error) throw error;
  console.log(`[webhook] ✅ Premium liberado: ${profile.email} → ${plano} expira ${expira}`);
}

/**
 * Revoga Premium — usado em cancelamento/expiração.
 * Mantém stripe_customer_id pra histórico (não apaga).
 */
async function revogarPremium({ profile }) {
  const { error } = await supabase
    .from("profiles")
    .update({
      is_premium: false,
      premium_plano: null,
      premium_expira: null,
      stripe_subscription_id: null,
    })
    .eq("id", profile.id);

  if (error) throw error;
  console.log(`[webhook] ⛔ Premium revogado: ${profile.email}`);
}

/* ══════════════════════════════════════════════════════════
   HANDLERS POR TIPO DE EVENTO
   ══════════════════════════════════════════════════════════ */

async function handleCheckoutCompleted(session) {
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const email = session.customer_email || session.customer_details?.email;

  if (!subscriptionId) {
    console.warn("[webhook] checkout sem subscription — ignorando");
    return;
  }

  // Busca subscription completa pra pegar Price/intervalo
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const item = subscription.items.data[0];
  const intervalo = item?.price?.recurring?.interval;
  const intervaloCount = item?.price?.recurring?.interval_count;

  const plano = detectarPlano(intervalo, intervaloCount);
  if (!plano) {
    console.error("[webhook] plano não identificado:", intervalo, intervaloCount);
    return;
  }

  // Busca o perfil
  const profile = await encontrarProfile({ customerId, email });
  if (!profile) {
    console.error(`[webhook] perfil não encontrado: customer=${customerId} email=${email}`);
    return;
  }

  // current_period_end vem do Stripe — usa como expiração oficial
  const expira = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : calcularExpiracao(plano);

  await liberarPremium({ profile, plano, customerId, subscriptionId, expira });
}

async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;
  const profile = await encontrarProfile({ customerId });
  if (!profile) {
    console.error(`[webhook] subscription updated sem perfil: customer=${customerId}`);
    return;
  }

  // Se foi cancelada (vai virar deleted depois), só atualiza expira
  // Se cliente trocou de plano, atualiza tudo
  const item = subscription.items.data[0];
  const plano = detectarPlano(item?.price?.recurring?.interval, item?.price?.recurring?.interval_count);
  const expira = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  // Se subscription ainda está ativa, mantém Premium
  if (subscription.status === "active" || subscription.status === "trialing") {
    await liberarPremium({
      profile, plano, customerId,
      subscriptionId: subscription.id, expira,
    });
  }
}

async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;
  const profile = await encontrarProfile({ customerId });
  if (!profile) {
    console.error(`[webhook] subscription deleted sem perfil: customer=${customerId}`);
    return;
  }
  await revogarPremium({ profile });
}

async function handleInvoicePaid(invoice) {
  // Renovação recorrente (mês 2, 3, etc)
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return; // pagamento avulso, não é renovação

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const item = subscription.items.data[0];
  const plano = detectarPlano(item?.price?.recurring?.interval, item?.price?.recurring?.interval_count);

  const profile = await encontrarProfile({ customerId });
  if (!profile) {
    console.error(`[webhook] invoice paid sem perfil: customer=${customerId}`);
    return;
  }

  const expira = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : calcularExpiracao(plano);

  await liberarPremium({ profile, plano, customerId, subscriptionId, expira });
}

/* ══════════════════════════════════════════════════════════
   ROUTE HANDLER PRINCIPAL
   ══════════════════════════════════════════════════════════ */

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[webhook] assinatura inválida:", err.message);
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
  }

  // IDEMPOTÊNCIA — se já processou esse evento, sai aqui
  const novo = await marcarComoProcessado(event.id, event.type);
  if (!novo) {
    console.log(`[webhook] evento já processado: ${event.id}`);
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ROTEAMENTO POR TIPO DE EVENTO
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaid(event.data.object);
        break;

      case "invoice.payment_failed":
        // Não revoga ainda — Stripe tenta de novo. Premium continua até subscription.deleted.
        console.log(`[webhook] payment_failed — aguardando retry: ${event.id}`);
        break;

      default:
        console.log(`[webhook] evento ignorado: ${event.type}`);
    }
  } catch (err) {
    console.error(`[webhook] erro processando ${event.type}:`, err);
    // Retorna 500 — Stripe vai tentar de novo automaticamente
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
