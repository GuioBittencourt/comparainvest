import {
  syncSaudeFinanceira,
  carregarSaudeFinanceiraRemoto,
  syncSnapshotSaude,
} from "../lib/supabaseSync";

export const SAUDE_STORAGE_KEY = "comparai_saude_financeira";
export const SAUDE_HISTORICO_KEY = "comparai_saude_financeira_historico";

export function carregarHistoricoSaude() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAUDE_HISTORICO_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function salvarSnapshotSaude(data, userId = null) {
  if (typeof window === "undefined") return null;
  const snapshot = {
    id: novoId("snapshot"),
    criadoEm: new Date().toISOString(),
    dados: data,
  };
  // Salva local imediatamente
  const historico = carregarHistoricoSaude();
  const atualizado = [snapshot, ...historico].slice(0, 24);
  localStorage.setItem(SAUDE_HISTORICO_KEY, JSON.stringify(atualizado));
  // Sync Supabase em background
  if (userId) syncSnapshotSaude(userId, snapshot);
  return snapshot;
}

export const BLOCOS_SAUDE = [
  { id: "entradas", label: "Entradas" },
  { id: "moradia", label: "Essenciais" },
  { id: "estilo", label: "Estilo" },
  { id: "cartoes", label: "Cartões" },
  { id: "dividas", label: "Dívidas" },
  { id: "saldo", label: "Saldo" },
  { id: "resumo", label: "Resumo" },
];

export function novoId(prefixo = "id") {
  return `${prefixo}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export function novoModeloSaude() {
  const now = new Date().toISOString();
  return {
    versao: 1,
    criadoEm: now,
    atualizadoEm: now,
    questionarioCompleto: false,
    stepAtual: "entradas",
    entradas: {
      salario1: { valor: 0, confirmadoLiquido: false },
      temSalario2: false,
      salario2: { valor: 0, confirmadoLiquido: false },
      adiantamento1: { valor: 0, deSalario: 1 },
      adiantamento2: { valor: 0, deSalario: 2 },
      tem13: false,
      decimoTerceiro: { valor: 0, mes: 12 },
      plr: { valor: 0, mes: null },
      bonus: { valor: 0 },
      vaVr: { tipo: "cartao", valor: 0 },
      outrasFontes: [],
    },
    consignados: [],
    contasFixas: {
      moradia: { tipo: "aluguel", valor: 0, motivoZero: null },
      condominio: 0,
      agua: 0,
      luz: 0,
      gas: 0,
      mercado: 0,
      transporte: { tipo: "gasolina", valor: 0, motivoZero: null },
      celular: 0,
      internet: 0,
      convenio: { valor: 0, descontaFolha: false },
      uber: 0,
      streaming: { valor: 0, noCartao: false, cartaoId: null },
      pet: 0,
      farmacia: 0,
      cabelo: 0,
      academia: { valor: 0, noCartao: false, cartaoId: null },
      pensaoPaga: 0,
      educacao: { valor: 0, descricao: "" },
      seguro: { valor: 0, noCartao: false, cartaoId: null },
      outros: [],
    },
    cartoes: [],
    outrasContas: [],
    agiotas: [],
    contasAtrasadas: [],
    saldo: { especie: 0, bancos: [] },
    investimentos: [],
  };
}

// Carrega: tenta Supabase primeiro, fallback localStorage
export async function carregarSaudeFinanceiraAsync(userId = null) {
  const base = novoModeloSaude();
  // Tenta Supabase se usuário logado
  if (userId) {
    const remoto = await carregarSaudeFinanceiraRemoto(userId);
    if (remoto) {
      // Atualiza cache local
      try { localStorage.setItem(SAUDE_STORAGE_KEY, JSON.stringify(remoto)); } catch {}
      return { ...base, ...remoto, entradas: { ...base.entradas, ...(remoto.entradas || {}) }, contasFixas: { ...base.contasFixas, ...(remoto.contasFixas || {}) }, saldo: { ...base.saldo, ...(remoto.saldo || {}) } };
    }
  }
  // Fallback localStorage
  return carregarSaudeFinanceira();
}

export function carregarSaudeFinanceira() {
  if (typeof window === "undefined") return novoModeloSaude();
  try {
    const raw = localStorage.getItem(SAUDE_STORAGE_KEY);
    if (!raw) return novoModeloSaude();
    const parsed = JSON.parse(raw);
    const base = novoModeloSaude();
    return {
      ...base,
      ...parsed,
      entradas: { ...base.entradas, ...(parsed.entradas || {}) },
      contasFixas: { ...base.contasFixas, ...(parsed.contasFixas || {}) },
      saldo: { ...base.saldo, ...(parsed.saldo || {}) },
    };
  } catch {
    return novoModeloSaude();
  }
}

export function salvarSaudeFinanceira(data, userId = null) {
  if (typeof window === "undefined") return;
  const payload = { ...data, atualizadoEm: new Date().toISOString() };
  // Salva local imediatamente (não bloqueia UI)
  try { localStorage.setItem(SAUDE_STORAGE_KEY, JSON.stringify(payload)); } catch {}
  // Sync Supabase em background
  if (userId) syncSaudeFinanceira(userId, payload);
}

export function moedaParaNumero(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const cleaned = String(value).replace(/\./g, "").replace(",", ".").replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatarBRL(value) {
  const n = Number(value) || 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function numero(v) {
  if (typeof v === "object" && v !== null && "valor" in v) return Number(v.valor) || 0;
  return Number(v) || 0;
}

export function calcularResumoSaude(data) {
  const entradas = data?.entradas || {};
  const fixas = data?.contasFixas || {};
  const vaVrDinheiro = entradas.vaVr?.tipo === "dinheiro" ? numero(entradas.vaVr.valor) : 0;
  const outrasFontes = (entradas.outrasFontes || []).reduce((s, f) => s + numero(f.valor), 0);
  const totalEntradas = numero(entradas.salario1) + numero(entradas.salario2) + numero(entradas.adiantamento1) + numero(entradas.adiantamento2) + numero(entradas.bonus) + vaVrDinheiro + outrasFontes;
  const outrosFixos = (fixas.outros || []).filter((i) => !i.quitavel).reduce((s, i) => s + numero(i.valor), 0);
  const totalFixas = numero(fixas.moradia) + numero(fixas.condominio) + numero(fixas.agua) + numero(fixas.luz) + numero(fixas.gas) + numero(fixas.mercado) + numero(fixas.transporte) + numero(fixas.celular) + numero(fixas.internet) + (fixas.convenio?.descontaFolha ? 0 : numero(fixas.convenio)) + numero(fixas.uber) + (fixas.streaming?.noCartao ? 0 : numero(fixas.streaming)) + numero(fixas.pet) + numero(fixas.farmacia) + numero(fixas.cabelo) + (fixas.academia?.noCartao ? 0 : numero(fixas.academia)) + numero(fixas.pensaoPaga) + numero(fixas.educacao) + (fixas.seguro?.noCartao ? 0 : numero(fixas.seguro)) + outrosFixos;
  const totalCartoes = (data.cartoes || []).reduce((s, c) => s + numero(c.faturaAtual), 0);
  const totalOutrasContas = (data.outrasContas || []).reduce((s, d) => s + numero(d.parcela), 0) + (fixas.outros || []).filter((i) => i.quitavel).reduce((s, i) => s + numero(i.valor), 0);
  const totalConsignados = (data.consignados || []).filter((c) => !c.descontaFolha).reduce((s, c) => s + numero(c.parcela), 0);
  const totalAgiotas = (data.agiotas || []).reduce((s, a) => { if (a.juros?.tipo === "percentual") return s + (numero(a.valorQuitacao) * numero(a.juros.valor)) / 100; return s + numero(a.juros?.valor); }, 0);
  const totalAtrasadas = (data.contasAtrasadas || []).reduce((s, c) => s + numero(c.valorConta), 0);
  const diversao = totalEntradas * 0.1;
  const saldoAtual = numero(data.saldo?.especie) + (data.saldo?.bancos || []).reduce((s, b) => s + numero(b.valor), 0);
  const patrimonioInvestido = (data.investimentos || []).reduce((s, i) => s + numero(i.valor), 0);
  const saidas = totalFixas + totalCartoes + totalOutrasContas + totalConsignados + totalAgiotas + totalAtrasadas + diversao;
  const saldoMes = totalEntradas - saidas;
  return { totalEntradas, totalFixas, totalCartoes, totalOutrasContas, totalConsignados, totalAgiotas, totalAtrasadas, diversao, saidas, saldoMes, saldoAtual, patrimonioInvestido, essencialPct: totalEntradas > 0 ? (totalFixas / totalEntradas) * 100 : 0 };
}

export function cruzarRecorrentesComCartoes(data) {
  const cartoes = [...(data.cartoes || [])].map((c) => ({ ...c, recorrentes: [] }));
  const fixas = data.contasFixas || {};
  const candidatos = [["streaming", fixas.streaming], ["academia", fixas.academia], ["seguro", fixas.seguro], ...(fixas.outros || []).map((o) => [o.nome || "Outro", o])];
  candidatos.forEach(([nome, item]) => {
    if (!item?.noCartao || !item?.cartaoId) return;
    const idx = cartoes.findIndex((c) => c.id === item.cartaoId);
    if (idx >= 0) cartoes[idx].recorrentes.push({ id: `rec_${item.id || nome}`, nome, valor: numero(item.valor) });
  });
  return { ...data, cartoes };
}
