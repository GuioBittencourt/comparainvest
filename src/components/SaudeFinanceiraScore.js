import { calcularSaudeFinanceira } from "./SaudeFinanceiraEngine";

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function calcularScoreSaude(data) {
  const s = calcularSaudeFinanceira(data);
  let score = 100;
  const motivos = [];

  if (s.entradas <= 0) {
    return { score: 0, nivel: "incompleto", label: "Cadastro incompleto", motivos: ["Informe suas entradas para calcular a saúde financeira."] };
  }

  const fixasPct = s.percentuais.fixas;
  if (fixasPct > 80) { score -= 35; motivos.push("Custo fixo acima de 80% da renda."); }
  else if (fixasPct > 70) { score -= 25; motivos.push("Custo fixo acima de 70% da renda."); }
  else if (fixasPct > 60) { score -= 14; motivos.push("Custo fixo acima dos 60% saudáveis."); }

  const dividasPct = s.percentuais.dividasMensais;
  if (dividasPct > 35) { score -= 25; motivos.push("Parcelas e dívidas pressionam fortemente o mês."); }
  else if (dividasPct > 20) { score -= 15; motivos.push("Dívidas relevantes dentro do orçamento."); }

  if (s.cartoes.total > s.entradas * 0.3) { score -= 12; motivos.push("Fatura do cartão consome parte grande da renda."); }
  if (s.agiotas.quantidade > 0) { score -= 22; motivos.push("Há agiota ou juros informais no cadastro."); }
  if (s.saldoMes < 0) { score -= 18; motivos.push("O mês fecha negativo pela projeção atual."); }

  const reservaMeses = s.fixas > 0 ? (s.saldoAtual + s.investimentos) / s.fixas : 0;
  if (reservaMeses < 1) { score -= 12; motivos.push("Reserva financeira inferior a 1 mês de custos fixos."); }
  else if (reservaMeses < 3) { score -= 7; motivos.push("Reserva ainda frágil para imprevistos."); }

  const final = clamp(score);
  const nivel = final >= 75 ? "saudavel" : final >= 55 ? "atencao" : final >= 35 ? "risco" : "critico";
  const label = {
    saudavel: "Saúde financeira boa",
    atencao: "Atenção necessária",
    risco: "Risco financeiro relevante",
    critico: "Situação crítica",
    incompleto: "Cadastro incompleto",
  }[nivel];

  return { score: final, nivel, label, motivos, reservaMeses };
}
