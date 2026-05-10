/**
 * stripe.js — helpers reutilizáveis para integração Stripe + Supabase
 *
 * Funções:
 *   detectarPlano(intervalo, intervaloCount) → 'mensal' | 'trimestral' | 'anual' | null
 *   calcularExpiracao(plano, dataInicio) → Date
 *
 * Por que aqui (e não no webhook direto): se algum dia quisermos exibir
 * "expira em X dias" no app, esses helpers ficam disponíveis client-side.
 *
 * IMPORTANTE: detecção de plano usa os campos `interval` e `interval_count`
 * que vêm direto do Price/Subscription do Stripe. Mudar produto/preço NÃO
 * quebra essa lógica — só mudar o INTERVALO de cobrança quebraria.
 */

/**
 * Mapeia o intervalo/contagem do Stripe pra um nome de plano nosso.
 *
 *   Stripe:                       Nosso plano:
 *   ───────────────────────       ────────────
 *   month, count=1            →   mensal
 *   month, count=3            →   trimestral
 *   year,  count=1            →   anual
 *   (tudo que não bater)      →   null
 */
export function detectarPlano(intervalo, intervaloCount = 1) {
  if (!intervalo) return null;
  const i = String(intervalo).toLowerCase();
  const c = Number(intervaloCount) || 1;

  if (i === "month" && c === 1) return "mensal";
  if (i === "month" && c === 3) return "trimestral";
  if (i === "year"  && c === 1) return "anual";

  return null;
}

/**
 * Calcula data de expiração com base no plano e data de início.
 * Retorna ISO string pronta pra salvar no Supabase (timestamptz).
 */
export function calcularExpiracao(plano, dataInicio = new Date()) {
  const inicio = new Date(dataInicio);
  const expira = new Date(inicio);

  switch (plano) {
    case "mensal":
      expira.setMonth(expira.getMonth() + 1);
      break;
    case "trimestral":
      expira.setMonth(expira.getMonth() + 3);
      break;
    case "anual":
      expira.setFullYear(expira.getFullYear() + 1);
      break;
    default:
      // fallback seguro: 30 dias
      expira.setDate(expira.getDate() + 30);
  }

  return expira.toISOString();
}

/**
 * Formata o nome do plano para exibição (ex: "Plano Anual").
 */
export function nomePlano(plano) {
  switch (plano) {
    case "mensal":     return "Plano Mensal";
    case "trimestral": return "Plano Trimestral";
    case "anual":      return "Plano Anual";
    default:           return "Plano Premium";
  }
}
