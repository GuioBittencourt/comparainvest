import { calcularSaudeFinanceira } from "./SaudeFinanceiraEngine";

function mesLabel(date) {
  return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }).replace(".", "");
}

function mesKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function gerarExtratoFuturo(data = {}, ajustes = {}, quantidadeMeses = 13) {
  const base = calcularSaudeFinanceira(data);
  const hoje = new Date();
  let saldoAcumulado = base.saldoAtual || 0;

  return Array.from({ length: quantidadeMeses }, (_, i) => {
    const dataMes = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    const mes = mesKey(dataMes);
    const a = ajustes[mes] || {};

    const entradas = base.entradas;
    const fixas = base.fixas;
    const cartoes = i === 0 ? base.cartoes.total : projetarCartoesFuturos(data, i);
    const dividas = base.dividas.parcelaMensal;
    const diversao = base.diversao;
    const quitar = Number(a.quitar || 0);
    const investimento = Number(a.investimento || 0);
    const saldoMes = entradas - fixas - cartoes - dividas - diversao - quitar - investimento;
    saldoAcumulado += saldoMes;

    return {
      mes,
      label: mesLabel(dataMes),
      entradas,
      fixas,
      cartoes,
      dividas,
      diversao,
      quitar,
      investimento,
      saldoMes,
      saldoAcumulado,
    };
  });
}

function projetarCartoesFuturos(data = {}, mesIndex = 0) {
  return (data.cartoes || []).reduce((total, cartao) => {
    const faturas = cartao.faturasProxMeses || {};
    const keys = Object.keys(faturas).sort();
    if (keys[mesIndex]) return total + (Number(faturas[keys[mesIndex]]) || 0);

    const parcelas = (cartao.parcelasFixas || []).reduce((s, p) => {
      return s + (Number(p.mesesRestantes || 0) > mesIndex ? Number(p.valorParcela || 0) : 0);
    }, 0);

    const recorrentes = (cartao.recorrentes || []).reduce((s, r) => s + Number(r.valor || 0), 0);
    return total + parcelas + recorrentes;
  }, 0);
}
