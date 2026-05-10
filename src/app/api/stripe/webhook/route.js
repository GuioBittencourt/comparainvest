import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { detectarPlano, calcularExpiracao } from "../../../../lib/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function marcarComoProcessado(eventId, eventType) {
  const { error } = await supabase
    .from("processed_webhooks")
    .insert({ event_id: eventId, event_type: eventType });
  if (error && error.code === "23505") return false;
  if (error) console.error("[webhook] erro ao marcar processado:", error);
  return true;
}

/**
 * Busca perfil em cascata:
 * 1. client_reference_id = user_id direto
 * 2. stripe_customer_id salvo no perfil
 * 3. email → auth.users (via RPC security definer) → profiles.id
 */
async function encontrarProfile({ userId, customerId, email }) {
  // 1. userId direto
  if (userId) {
    const { data } = await supabase
      .from("profiles")
      .select("id, is_premium")
      .eq("id", userId)
      .maybeSingle();
    if (data) { console.log(`[webhook] encontrado por userId`); return data; }
  }

  // 2. stripe_customer_id
  if (customerId) {
    const { data } = await supabase
      .from("profiles")
      .select("id, is_premium")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    if (data) { console.log(`[webhook] encontrado por customerId`); return data; }
  }

  // 3. email via RPC (função SQL security definer que acessa auth.users)
  if (email) {
    const { data: rpcData } = await supabase
      .rpc("get_user_id_by_email", { user_email: email.trim() });
    const foundId = rpcData?.[0]?.id;
    if (foundId) {
      const { data } = await supabase
        .from("profiles")
        .select("id, is_premium")
        .eq("id", foundId)
        .maybeSingle();
      if (data) { console.log(`[webhook] encontrado por email`); return data; }
    }
  }

  console.error(`[webhook] perfil não encontrado — userId=${userId} customer=${customerId} email=${email}`);
  return null;
}

async function liberarPremium({ profile, plano, customerId, subscriptionId, expira }) {
  const update = {
    is_premium: true,
    premium_plano: plano,
    premium_inicio: new Date().toISOString(),
    premium_until: expira,
    premium_expira: expira,
  };
  if (customerId) update.stripe_customer_id = customerId;
  if (subscriptionId) update.stripe_subscription_id = subscriptionId;

  const { error } = await supabase.from("profiles").update(update).eq("id", profile.id);
  if (error) throw error;
  console.log(`[webhook] ✅ Premium liberado: ${profile.id} → ${plano} expira ${expira}`);
}

async function revogarPremium({ profile }) {
  const { error } = await supabase
    .from("profiles")
    .update({ is_premium: false, premium_plano: null, premium_until: null, premium_expira: null, stripe_subscription_id: null })
    .eq("id", profile.id);
  if (error) throw error;
  console.log(`[webhook] ⛔ Premium revogado: ${profile.id}`);
}

async function handleCheckoutCompleted(session) {
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const email = session.customer_email || session.customer_details?.email;
  const userId = session.client_reference_id || null;

  if (!subscriptionId) { console.warn("[webhook] sem subscription"); return; }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const item = subscription.items.data[0];
  const plano = detectarPlano(item?.price?.recurring?.interval, item?.price?.recurring?.interval_count);
  if (!plano) { console.error("[webhook] plano não identificado"); return; }

  const profile = await encontrarProfile({ userId, customerId, email });
  if (!profile) return;

  const expira = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : calcularExpiracao(plano);

  await liberarPremium({ profile, plano, customerId, subscriptionId, expira });
}

async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;
  const profile = await encontrarProfile({ customerId });
  if (!profile) return;
  const item = subscription.items.data[0];
  const plano = detectarPlano(item?.price?.recurring?.interval, item?.price?.recurring?.interval_count);
  const expira = subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null;
  if (subscription.status === "active" || subscription.status === "trialing") {
    await liberarPremium({ profile, plano, customerId, subscriptionId: subscription.id, expira });
  }
}

async function handleSubscriptionDeleted(subscription) {
  const profile = await encontrarProfile({ customerId: subscription.customer });
  if (!profile) return;
  await revogarPremium({ profile });
}

async function handleInvoicePaid(invoice) {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const item = subscription.items.data[0];
  const plano = detectarPlano(item?.price?.recurring?.interval, item?.price?.recurring?.interval_count);
  const profile = await encontrarProfile({ customerId });
  if (!profile) return;
  const expira = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : calcularExpiracao(plano);
  await liberarPremium({ profile, plano, customerId, subscriptionId, expira });
}

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature header", { status: 400 });

  let event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] assinatura inválida:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const novo = await marcarComoProcessado(event.id, event.type);
  if (!novo) return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200, headers: { "Content-Type": "application/json" } });

  try {
    switch (event.type) {
      case "checkout.session.completed": await handleCheckoutCompleted(event.data.object); break;
      case "customer.subscription.updated": await handleSubscriptionUpdated(event.data.object); break;
      case "customer.subscription.deleted": await handleSubscriptionDeleted(event.data.object); break;
      case "invoice.payment_succeeded": await handleInvoicePaid(event.data.object); break;
      case "invoice.payment_failed": console.log(`[webhook] payment_failed — retry pendente`); break;
      default: console.log(`[webhook] ignorado: ${event.type}`);
    }
  } catch (err) {
    console.error(`[webhook] erro ${event.type}:`, err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}
