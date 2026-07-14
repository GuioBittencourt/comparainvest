// src/components/ExtratoFuturoEngine.js
import { calcularSaudeFinanceira } from "./SaudeFinanceiraEngine";

const n = (v) => Number(v) || 0;

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
function labelMes(date) {
  return `${MESES[date.getMonth()]} de ${date.getFullYear()}`;
}
function mesKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
}

function calcularBaseDoMes(data, offset) {
  const s = calcularSaudeFinanceira(data);
  const cartoes = data.cartoes || [];
  const outrasContas = data.outrasContas || [];
  const consignados = data.consignados || [];
  const agiotas = data.agiotas || [];
  const contasAtrasadas = data.contasAtrasadas || [];
  const fixas = data.contasFixas || {};

  // Entradas
  const entradas = n(s.entradas);

  // Fixas
  const totalFixas = n(s.fixas);

  // Cartões — fatura do mês atual ou parcelas
  let totalCartoes = 0;
  cartoes.forEach((c) => {
    if (offset === 0) {
      totalCartoes += n(c.faturaAtual);
    } else if (c.veFaturasApp && c.faturasProxMeses?.[offset]) {
      totalCartoes += n(c.faturasProxMeses[offset]);
    } else {
      const parcelasFixas = c.parcelasFixas || [];
      parcelasFixas.forEach((p) => {
        if (offset <= n(p.mesesRestantes)) {
          totalCartoes += n(p.valorParcela);
        }
      });
      // Recorrentes do cartão
      const recorrentes = c.recorrentes || [];
      recorrentes.forEach((r) => { totalCartoes += n(r.valor); });
    }
  });

  // Outras contas — respeita mesPagamento
  let totalOutras = 0;
  const hoje = new Date();
  const mesRef = new Date(hoje.getFullYear(), hoje.getMonth() + offset, 1);
  const mesRefKey = mesKey(mesRef);

  outrasContas.forEach((o) => {
    const restantes = n(o.restantes);
    if (restantes <= 1 && o.mesPagamento) {
      // Conta sem parcela — só entra no mês correto
      if (o.mesPagamento === mesRefKey) {
        totalOutras += n(o.parcela) || n(o.valorTotal);
      }
    } else if (restantes === 0 || offset <= restantes) {
      totalOutras += n(o.parcela);
    }
  });

  // Consignados
  let totalConsignados = 0;
  consignados.forEach((c) => {
    if (!c.descontaFolha && offset <= n(c.restantes)) {
      totalConsignados += n(c.parcela);
    }
  });

  // Agiotas
  let totalAgiotas = 0;
  agiotas.forEach((a) => {
    if (a.juros?.tipo === "percentual") {
      totalAgiotas += (n(a.valorQuitacao) * n(a.juros.valor)) / 100;
    } else {
      totalAgiotas += n(a.juros?.valor);
    }
  });

  // Atrasadas
  let totalAtrasadas = 0;
  contasAtrasadas.forEach((c) => { totalAtrasadas += n(c.valorConta); });

  const totalOutrasContas = totalOutras + totalConsignados + totalAgiotas + totalAtrasadas;

  // Diversão
  const diversao = n(s.diversao) || entradas * 0.1;

  // Gestão Ativa
  const gestaoAtiva = n(s.gestaoAtiva);

  return {
    entradas,
    fixas: totalFixas,
    cartoes: totalCartoes,
    outrasContas: totalOutrasContas,
    diversao,
    gestaoAtiva,
  };
}

export function gerarExtratoFuturo(data, ajustes = {}) {
  const MESES_TOTAL = 13;
  const linhas = [];
  const hoje = new Date();
  let saldoRolando = n(data.saldo?.especie) + (data.saldo?.bancos || []).reduce((s, b) => s + n(b.valor), 0);
  const linhasExtras = ajustes.__linhasExtras || [];

  // Reserva mínima = 1 mês de fixas
  const base0 = calcularBaseDoMes(data, 0);
  const reservaMinima = base0.fixas * 0.5;

  // Dívidas quitáveis ordenadas por menor valor
  const quitaveis = [
    ...(data.outrasContas || []).filter(o => !o.mesPagamento || true).map(o => ({ id: o.id, nome: o.nome || o.tipo, valorQuitacao: n(o.valorTotal) || n(o.parcela) * n(o.restantes), parcela: n(o.parcela), restantes: n(o.restantes) })),
    ...(data.consignados || []).map(c => ({ id: c.id, nome: c.nome || "Consignado", valorQuitacao: n(c.valorQuitacao), parcela: n(c.parcela), restantes: n(c.restantes) })),
  ].filter(q => q.valorQuitacao > 0 && q.restantes > 0).sort((a, b) => a.valorQuitacao - b.valorQuitacao);

  const quitadas = new Set();

  for (let i = 0; i < MESES_TOTAL; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    const mes = mesKey(d);
    const label = labelMes(d);
    const aj = ajustes[mes] || {};

    const base = calcularBaseDoMes(data, i);

    // Aplica ajustes manuais
    const entradas = aj.entradasManual ? n(aj.entradas) : base.entradas;
    const diversao = aj.diversaoManual ? n(aj.diversao) : base.diversao;
    const fixas = base.fixas;
    const cartoes = base.cartoes;
    const outrasContas = base.outrasContas;
    const gestaoAtiva = base.gestaoAtiva;

    // Linhas extras do ADM
    let extraReceita = 0, extraDespesa = 0, extraQuitacao = 0;
    linhasExtras.forEach((le) => {
      const val = n(le.valores?.[mes]);
      if (!val) return;
      if (le.tipo === "receita") extraReceita += val;
      else if (le.tipo === "quitacao") extraQuitacao += val;
      else extraDespesa += val;
    });

    // Saldo antes de quitações e investimento
    const saldoAntesQuit = saldoRolando + entradas + extraReceita - fixas - cartoes - outrasContas - diversao - gestaoAtiva - extraDespesa;

    // Quitações automáticas
    let valorQuitacoes = extraQuitacao;
    const quitacoesDoMes = [];
    if (saldoAntesQuit > reservaMinima) {
      let saldoDisp = saldoAntesQuit - reservaMinima;
      for (const q of quitaveis) {
        if (quitadas.has(q.id)) continue;
        if (saldoDisp >= q.valorQuitacao) {
          saldoDisp -= q.valorQuitacao;
          valorQuitacoes += q.valorQuitacao;
          quitacoesDoMes.push(q);
          quitadas.add(q.id);
        }
      }
    }

    // Investimento
    let investimento = 0;
    const saldoAposQuit = saldoAntesQuit - valorQuitacoes;
    if (aj.investimentoManual) {
      investimento = Math.min(n(aj.investimento), Math.max(0, saldoAposQuit - reservaMinima));
    } else if (saldoAposQuit > reservaMinima) {
      investimento = saldoAposQuit - reservaMinima;
    }

    const saldoFinal = saldoAposQuit - investimento;

    // Precisou de extra?
    const precisaExtra = saldoFinal < 0;

    linhas.push({
      mes,
      label,
      offset: i,
      zonaArrebentacao: i < 3,
      saldoInicial: saldoRolando,
      entradas,
      fixas,
      cartoes,
      outrasContas,
      diversao,
      gestaoAtiva,
      valorQuitacoes,
      investimento,
      saldoFinal,
      quitacoes: quitacoesDoMes,
      precisaExtra,
    });

    saldoRolando = saldoFinal;
  }

  return linhas;
}

export function resumoExtratoFuturo(data, ajustes = {}) {
  const linhas = gerarExtratoFuturo(data, ajustes);
  const totalQuitado = linhas.reduce((s, l) => s + l.valorQuitacoes, 0);
  const totalInvestido = linhas.reduce((s, l) => s + l.investimento, 0);
  const primeiroMesPositivo = linhas.find((l) => l.saldoFinal >= 0 && l.offset > 0);
  return {
    totalQuitado,
    totalInvestido,
    primeiroMesPositivo: primeiroMesPositivo ? primeiroMesPositivo.label : null,
  };
}