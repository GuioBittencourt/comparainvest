import { calcularSaudeFinanceira } from "./SaudeFinanceiraEngine";
import { calcularScoreSaude } from "./SaudeFinanceiraScore";

function item(tipo, titulo, impacto, direcao, prioridade = 2) {
  return { tipo, titulo, impacto, direcao, prioridade };
}

export function gerarInsightsSaude(data) {
  const s = calcularSaudeFinanceira(data);
  const score = calcularScoreSaude(data);
  const insights = [];

  if (s.entradas <= 0) {
    return [item("incompleto", "Falta informar a renda líquida.", "Sem esse dado, o app não consegue medir sua capacidade real de pagamento.", "Volte ao bloco de entradas e confirme o valor que cai na conta.", 1)];
  }

  if (s.percentuais.fixas > 70) {
    insights.push(item(
      "critico",
      `Custo fixo em ${s.percentuais.fixas.toFixed(0)}% da renda.`,
      "Quando o essencial passa de 70%, a vida financeira perde margem de manobra e qualquer imprevisto tende a virar dívida.",
      "Priorize revisar moradia, mercado, transporte e recorrentes antes de buscar novos investimentos.",
      1
    ));
  } else if (s.percentuais.fixas > 60) {
    insights.push(item(
      "atencao",
      `Essenciais acima dos 60% saudáveis.`,
      "A estrutura ainda funciona, mas sobra pouco espaço para reserva, educação, curto prazo e independência.",
      "Reduzir poucos custos fixos pode liberar fluxo sem depender de renda extra imediatamente.",
      2
    ));
  }

  if (s.saldoMes < 0) {
    insights.push(item(
      "critico",
      "O mês fecha negativo na projeção atual.",
      "Isso indica zona de arrebentação: a conta não fecha mesmo antes de pensar em investir.",
      "O primeiro objetivo é parar o vazamento mensal e escolher uma quitação que libere fluxo rápido.",
      1
    ));
  }

  if (s.agiotas.quantidade > 0) {
    insights.push(item(
      "critico",
      "Há dívida informal ou agiota no cadastro.",
      "Juros informais drenam caixa sem reduzir o principal e podem prender a pessoa em ciclo de pagamento infinito.",
      "Trate isso como prioridade estratégica, separando valor de quitação e juros pagos por mês.",
      1
    ));
  }

  if (s.cartoes.total > s.entradas * 0.3) {
    insights.push(item(
      "atencao",
      "Cartão de crédito está pesando no mês.",
      "Fatura alta reduz previsibilidade e costuma esconder gastos recorrentes que parecem pequenos isoladamente.",
      "Separe recorrentes do cartão e avalie suspender novas compras parceladas até o fluxo respirar.",
      2
    ));
  }

  if (score.reservaMeses < 1) {
    insights.push(item(
      "atencao",
      "Reserva financeira ainda está frágil.",
      "Sem pelo menos um mês de proteção, qualquer imprevisto pode empurrar a pessoa para crédito caro.",
      "Antes de acelerar investimentos, construa proteção mínima de caixa.",
      3
    ));
  }

  if (insights.length === 0) {
    insights.push(item(
      "saudavel",
      "Sua estrutura inicial parece controlada.",
      "O mês mostra capacidade de organização. O próximo ganho vem de direcionar excedentes com método.",
      "Use a distribuição saudável para separar curto prazo, independência, educação e diversão.",
      3
    ));
  }

  return insights.sort((a, b) => a.prioridade - b.prioridade).slice(0, 5);
}
