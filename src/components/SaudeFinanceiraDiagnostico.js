import { calcularSaudeFinanceira } from "./SaudeFinanceiraEngine";
import { calcularDistribuicaoSaude } from "./SaudeFinanceiraDistribuicao";
import { calcularScoreSaude } from "./SaudeFinanceiraScore";
import { gerarInsightsSaude } from "./SaudeFinanceiraInsights";

export function gerarDiagnosticoSaude(data) {
  const base = calcularSaudeFinanceira(data);
  const distribuicao = calcularDistribuicaoSaude(data);
  const score = calcularScoreSaude(data);
  const insights = gerarInsightsSaude(data);

  const pontosCriticos = insights.filter((i) => i.tipo === "critico");
  const atencoes = insights.filter((i) => i.tipo === "atencao");

  const oportunidades = [];
  if (base.percentuais.fixas > 60) oportunidades.push("Reduzir custos fixos para recuperar margem mensal.");
  if (base.cartoes.total > 0) oportunidades.push("Separar recorrentes do cartão e reduzir dependência de fatura.");
  if (base.dividas.parcelaMensal > 0) oportunidades.push("Mapear quitações que liberem fluxo de caixa mais rápido.");
  if (base.saldoMes > 0) oportunidades.push("Direcionar sobra mensal para reserva e curto prazo antes de acelerar risco.");

  return {
    base,
    distribuicao,
    score,
    insights,
    relatorio: {
      panorama: score.label,
      resumo: base.saldoMes >= 0
        ? "A estrutura mostra algum fôlego mensal. O ponto principal agora é transformar sobra em proteção e avanço patrimonial."
        : "A estrutura atual pressiona o mês. Antes de falar em investimentos, o foco é recuperar fluxo e reduzir vazamentos.",
      pontosCriticos,
      atencoes,
      oportunidades: oportunidades.slice(0, 4),
      direcao: base.saldoMes < 0
        ? "Prioridade: estabilizar o mês, reduzir pressão de parcelas e criar clareza sobre o que pode ou não ser pago agora."
        : "Prioridade: proteger caixa, organizar reservas e escolher uma estratégia de quitação/investimento que aumente liberdade mensal.",
    },
  };
}
