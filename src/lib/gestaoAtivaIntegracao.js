// src/lib/gestaoAtivaIntegracao.js
// Ponte entre GestaoAtiva e ExtratoFuturo/Financeiro

const STORAGE_KEY = "comparai_gestao";

/**
 * Lê os dados atuais do Gestão Ativa do localStorage.
 * Retorna null se não houver dados ou mês diferente.
 */
export function lerGestaoAtivaMesAtual() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    const hoje = new Date();
    const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
    // Só usa se for o mês vigente
    if (d.month !== mesAtual) return { ...d, expenses: [], month: mesAtual };
    return d;
  } catch {
    return null;
  }
}

/**
 * Dado os dados do GA, calcula:
 * - totalLimite: soma dos limites das categorias
 * - totalGasto: soma de todos os gastos lançados
 * - excesso: quanto ultrapassou o limite (0 se dentro)
 * - saldoRestante: limite - gasto (pode ser negativo)
 * - porCategoria: { [catId]: { label, limite, gasto, restante, excesso } }
 */
export function calcularResumoGA(gaData) {
  if (!gaData) return { totalLimite: 0, totalGasto: 0, excesso: 0, saldoRestante: 0, porCategoria: {} };

  const categories = gaData.categories || [];
  const expenses = gaData.expenses || [];

  const porCategoria = {};
  categories.forEach((cat) => {
    const gasto = expenses.filter((e) => e.categoryId === cat.id).reduce((s, e) => s + Number(e.value || 0), 0);
    const restante = (cat.limit || 0) - gasto;
    porCategoria[cat.id] = {
      label: cat.label,
      limite: cat.limit || 0,
      gasto,
      restante,
      excesso: restante < 0 ? Math.abs(restante) : 0,
    };
  });

  const totalLimite = categories.reduce((s, c) => s + (c.limit || 0), 0);
  const totalGasto = expenses.reduce((s, e) => s + Number(e.value || 0), 0);
  const excesso = Math.max(0, totalGasto - totalLimite);
  const saldoRestante = totalLimite - totalGasto;

  return { totalLimite, totalGasto, excesso, saldoRestante, porCategoria };
}

/**
 * Aplica a integração GA → dados do mês vigente do Extrato Futuro.
 * Retorna os valores ajustados para o mês 0 (vigente).
 *
 * Regras:
 * 1. Se GA tem categorias → totalLimite substitui o campo "fixas" variáveis
 * 2. totalGasto já lançado deduz do saldoInicial (o que saiu do bolso)
 * 3. Se excesso > 0 → abate proporcionalmente de diversao e investimento
 * 4. Se não cabe → flag "precisaExtra" = true
 */
export function aplicarIntegracaoGA(base, gaData, diversaoBase, investimentoBase) {
  const ga = calcularResumoGA(gaData);

  if (!gaData || (gaData.categories || []).length === 0) {
    return { gaAtivo: false, totalGA: 0, gastoGA: 0, excesso: 0, ajusteDiversao: 0, ajusteInvestimento: 0, precisaExtra: false };
  }

  const excesso = ga.excesso;
  let ajusteDiversao = 0;
  let ajusteInvestimento = 0;
  let precisaExtra = false;

  if (excesso > 0) {
    // Abate proporcionalmente: metade de cada
    const metade = excesso / 2;
    ajusteDiversao = Math.min(metade, diversaoBase);
    ajusteInvestimento = Math.min(excesso - ajusteDiversao, investimentoBase);

    // Se não cobriu tudo
    const totalAbatido = ajusteDiversao + ajusteInvestimento;
    if (totalAbatido < excesso) {
      precisaExtra = true;
    }
  }

  return {
    gaAtivo: true,
    totalGA: ga.totalLimite,      // substitui variáveis no extrato
    gastoGA: ga.totalGasto,       // já saiu do bolso este mês
    excesso,
    ajusteDiversao,
    ajusteInvestimento,
    precisaExtra,
    saldoRestanteGA: ga.saldoRestante,
    porCategoria: ga.porCategoria,
  };
}

/**
 * Chave do mês atual no formato YYYY-MM
 */
export function mesCurrent() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
