// Motor financeiro do módulo Saúde Financeira.
// Mantém a lógica em funções puras para facilitar testes e futura migração Supabase.

const pct = (parte, total) => (total > 0 ? (parte / total) * 100 : 0);
const n = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const cleaned = value.replace(/\./g, "").replace(",", ".").replace(/[^0-9.-]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object" && "valor" in value) return n(value.valor);
  return 0;
};

export const DISTRIBUICAO_SAUDE = {
  essencial: 0.6,
  independencia: 0.1,
  curtoPrazo: 0.15,
  educacao: 0.05,
  diversao: 0.1,
};

export const LABELS_DISTRIBUICAO_SAUDE = {
  essencial: "Essencial",
  independencia: "Independência",
  curtoPrazo: "Curto prazo",
  educacao: "Educação",
  diversao: "Diversão",
};

export function valorSeguro(value) {
  return n(value);
}

export function calcularEntradasTotais(data = {}) {
  const e = data.entradas || {};
  const vaVrDinheiro = e.vaVr?.tipo === "dinheiro" ? n(e.vaVr?.valor) : 0;
  const outrasFontes = (e.outrasFontes || []).reduce((s, f) => s + n(f.valor), 0);

  return (
    n(e.salario1) +
    n(e.salario2) +
    n(e.adiantamento1) +
    n(e.adiantamento2) +
    n(e.bonus) +
    vaVrDinheiro +
    outrasFontes
  );
}

export function calcularEntradasAnuaisExtras(data = {}) {
  const e = data.entradas || {};
  return {
    decimoTerceiro: e.tem13 ? n(e.decimoTerceiro?.valor) : 0,
    plr: n(e.plr?.valor),
    bonus: n(e.bonus?.valor ?? e.bonus),
  };
}

export function recorrentesNoCartao(data = {}) {
  const fixas = data.contasFixas || {};
  const itens = [];

  const push = (nome, item) => {
    if (!item || !item.noCartao || !item.cartaoId) return;
    itens.push({ nome, valor: n(item.valor), cartaoId: item.cartaoId });
  };

  push("Streaming", fixas.streaming);
  push("Academia", fixas.academia);
  push("Seguro", fixas.seguro);

  (fixas.outros || []).forEach((item) => {
    if (!item.quitavel) push(item.nome || "Outra conta fixa", item);
  });

  return itens;
}

export function calcularContasFixas(data = {}) {
  const f = data.contasFixas || {};
  const outrosFixos = (f.outros || [])
    .filter((item) => !item.quitavel && !item.noCartao)
    .reduce((s, item) => s + n(item.valor), 0);

  return (
    n(f.moradia) +
    n(f.condominio) +
    n(f.agua) +
    n(f.luz) +
    n(f.gas) +
    n(f.mercado) +
    n(f.transporte) +
    n(f.celular) +
    n(f.internet) +
    (f.convenio?.descontaFolha ? 0 : n(f.convenio)) +
    n(f.uber) +
    (f.streaming?.noCartao ? 0 : n(f.streaming)) +
    n(f.pet) +
    n(f.farmacia) +
    n(f.cabelo) +
    (f.academia?.noCartao ? 0 : n(f.academia)) +
    n(f.pensaoPaga) +
    n(f.educacao) +
    (f.seguro?.noCartao ? 0 : n(f.seguro)) +
    outrosFixos
  );
}

export function calcularCartoes(data = {}) {
  const recorrentes = recorrentesNoCartao(data);
  const totalRecorrentes = recorrentes.reduce((s, item) => s + n(item.valor), 0);
  const totalFaturaAtual = (data.cartoes || []).reduce((s, cartao) => s + n(cartao.faturaAtual), 0);

  return {
    total: totalFaturaAtual + totalRecorrentes,
    faturaAtual: totalFaturaAtual,
    recorrentes: totalRecorrentes,
    recorrentesItens: recorrentes,
    quantidade: (data.cartoes || []).length,
  };
}

export function calcularConsignados(data = {}) {
  const todos = data.consignados || [];
  return {
    descontadosFolha: todos.filter((c) => c.descontaFolha).reduce((s, c) => s + n(c.parcela), 0),
    foraFolha: todos.filter((c) => !c.descontaFolha).reduce((s, c) => s + n(c.parcela), 0),
    valorQuitacao: todos.reduce((s, c) => s + n(c.valorQuitacao), 0),
    quantidade: todos.length,
  };
}

export function calcularAgiotas(data = {}) {
  const itens = data.agiotas || [];
  return {
    jurosMensais: itens.reduce((s, agiota) => {
      if (agiota.juros?.tipo === "percentual") return s + (n(agiota.valorQuitacao) * n(agiota.juros.valor)) / 100;
      return s + n(agiota.juros?.valor);
    }, 0),
    valorQuitacao: itens.reduce((s, agiota) => s + n(agiota.valorQuitacao), 0),
    quantidade: itens.length,
  };
}

export function calcularOutrasContas(data = {}) {
  const outras = data.outrasContas || [];
  const fixasQuitaveis = (data.contasFixas?.outros || []).filter((item) => item.quitavel);
  const todas = [...outras, ...fixasQuitaveis];
  return {
    parcelaMensal: todas.reduce((s, item) => s + n(item.parcela || item.valor), 0),
    valorTotal: todas.reduce((s, item) => s + (n(item.valorTotal) || (n(item.parcela || item.valor) * n(item.restantes))), 0),
    quantidade: todas.length,
  };
}

export function calcularContasAtrasadas(data = {}) {
  const atrasadas = data.contasAtrasadas || [];
  return {
    valorConta: atrasadas.reduce((s, item) => s + n(item.valorConta), 0),
    valorTotal: atrasadas.reduce((s, item) => s + n(item.valorTotal), 0),
    quantidade: atrasadas.length,
  };
}

export function calcularSaldoAtual(data = {}) {
  const especie = n(data.saldo?.especie);
  const bancos = (data.saldo?.bancos || []).reduce((s, banco) => s + n(banco.valor), 0);
  return especie + bancos;
}

export function calcularInvestimentos(data = {}) {
  return (data.investimentos || []).reduce((s, inv) => s + n(inv.valor), 0);
}

export function calcularDividasTotais(data = {}) {
  const consignados = calcularConsignados(data);
  const outras = calcularOutrasContas(data);
  const agiotas = calcularAgiotas(data);
  const atrasadas = calcularContasAtrasadas(data);

  return {
    valorTotal: consignados.valorQuitacao + outras.valorTotal + agiotas.valorQuitacao + atrasadas.valorTotal,
    parcelaMensal: consignados.foraFolha + outras.parcelaMensal + agiotas.jurosMensais + atrasadas.valorConta,
    quantidade: consignados.quantidade + outras.quantidade + agiotas.quantidade + atrasadas.quantidade,
  };
}

export function calcularSaudeFinanceira(data = {}) {
  const entradas = calcularEntradasTotais(data);
  const fixas = calcularContasFixas(data);
  const cartoes = calcularCartoes(data);
  const consignados = calcularConsignados(data);
  const outrasContas = calcularOutrasContas(data);
  const agiotas = calcularAgiotas(data);
  const atrasadas = calcularContasAtrasadas(data);
  const saldoAtual = calcularSaldoAtual(data);
  const investimentos = calcularInvestimentos(data);
  const dividas = calcularDividasTotais(data);
  const diversao = entradas * DISTRIBUICAO_SAUDE.diversao;

  const saidas =
    fixas +
    cartoes.total +
    consignados.foraFolha +
    outrasContas.parcelaMensal +
    agiotas.jurosMensais +
    atrasadas.valorConta +
    diversao;

  const saldoMes = entradas - saidas;
  const patrimonioLiquido = saldoAtual + investimentos - dividas.valorTotal;

  return {
    entradas,
    fixas,
    cartoes,
    consignados,
    outrasContas,
    agiotas,
    atrasadas,
    diversao,
    saidas,
    saldoMes,
    saldoAtual,
    investimentos,
    dividas,
    patrimonioLiquido,
    percentuais: {
      fixas: pct(fixas, entradas),
      cartoes: pct(cartoes.total, entradas),
      dividasMensais: pct(dividas.parcelaMensal, entradas),
      diversao: pct(diversao, entradas),
      saldoMes: pct(saldoMes, entradas),
    },
  };
}

export function prepararBaseExtratoFuturo(data = {}, meses = 13) {
  const s = calcularSaudeFinanceira(data);
  const hoje = new Date();
  return Array.from({ length: meses }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    return {
      mes: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      entradas: s.entradas,
      fixas: s.fixas,
      cartoes: i === 0 ? s.cartoes.total : 0,
      dividas: s.dividas.parcelaMensal,
      diversao: s.diversao,
      investimento: 0,
      quitar: 0,
      saldo: s.entradas - s.fixas - (i === 0 ? s.cartoes.total : 0) - s.dividas.parcelaMensal - s.diversao,
    };
  });
}
