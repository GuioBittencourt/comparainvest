import { calcularSaudeFinanceira, valorSeguro } from "./SaudeFinanceiraEngine";

function mesLabel(date) {
  return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }).replace(".", "");
}

function mesKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function n(value) {
  return valorSeguro ? valorSeguro(value) : Number(value || 0);
}

function valorQuitacaoEstimado(item = {}) {
  return n(item.valorQuitacao) || n(item.valorTotal) || (n(item.parcela) || n(item.valor)) * n(item.restantes || item.mesesRestantes || 1);
}

function parcelaMensal(item = {}) {
  return n(item.parcela) || n(item.valorConta) || n(item.valor) || n(item.valorParcela);
}

export function listarDividasQuitaveis(data = {}) {
  const quitaveis = [];

  (data.outrasContas || []).forEach((d, idx) => {
    const valor = valorQuitacaoEstimado(d);
    if (valor > 0 || parcelaMensal(d) > 0) {
      quitaveis.push({
        id: d.id || `outra-${idx}`,
        nome: d.nome || d.tipo || "Conta quitável",
        tipo: d.tipo || "outra conta",
        parcela: parcelaMensal(d),
        valorQuitacao: valor,
        prioridade: 2,
        origem: "outrasContas",
      });
    }
  });

  (data.contasFixas?.outros || []).filter((d) => d.quitavel).forEach((d, idx) => {
    const valor = valorQuitacaoEstimado(d);
    quitaveis.push({
      id: d.id || `fixa-quitavel-${idx}`,
      nome: d.nome || "Conta com prazo para acabar",
      tipo: "fixa quitável",
      parcela: parcelaMensal(d),
      valorQuitacao: valor,
      prioridade: 2,
      origem: "contasFixas.outros",
    });
  });

  (data.consignados || []).forEach((d, idx) => {
    const valor = valorQuitacaoEstimado(d);
    quitaveis.push({
      id: d.id || `consignado-${idx}`,
      nome: d.nome || "Consignado",
      tipo: d.descontaFolha ? "consignado em folha" : "consignado",
      parcela: parcelaMensal(d),
      valorQuitacao: valor,
      prioridade: d.descontaFolha ? 1 : 2,
      origem: "consignados",
      descontaFolha: !!d.descontaFolha,
    });
  });

  (data.agiotas || []).forEach((d, idx) => {
    const jurosMensal = d.juros?.tipo === "percentual" ? (n(d.valorQuitacao) * n(d.juros.valor)) / 100 : n(d.juros?.valor);
    quitaveis.push({
      id: d.id || `agiota-${idx}`,
      nome: d.nome || "Agiota",
      tipo: "agiota / juros mensais",
      parcela: jurosMensal,
      valorQuitacao: n(d.valorQuitacao),
      prioridade: 0,
      origem: "agiotas",
    });
  });

  (data.contasAtrasadas || []).forEach((d, idx) => {
    const valor = n(d.valorTotal) || n(d.valorConta);
    if (valor > 0) {
      quitaveis.push({
        id: d.id || `atrasada-${idx}`,
        nome: d.nome || "Conta atrasada",
        tipo: "conta atrasada",
        parcela: n(d.valorConta),
        valorQuitacao: valor,
        prioridade: 1,
        origem: "contasAtrasadas",
      });
    }
  });

  (data.cartoes || []).forEach((cartao, idx) => {
    const valor = n(cartao.faturaAtual);
    if (valor > 0) {
      quitaveis.push({
        id: cartao.id || `cartao-${idx}`,
        nome: cartao.nome || `Cartão ${idx + 1}`,
        tipo: "cartão de crédito",
        parcela: valor,
        valorQuitacao: valor,
        prioridade: 1,
        origem: "cartoes",
      });
    }
  });

  return quitaveis
    .filter((d) => n(d.valorQuitacao) > 0 || n(d.parcela) > 0)
    .sort((a, b) => {
      if (a.prioridade !== b.prioridade) return a.prioridade - b.prioridade;
      const liberacaoA = n(a.parcela) / Math.max(n(a.valorQuitacao), 1);
      const liberacaoB = n(b.parcela) / Math.max(n(b.valorQuitacao), 1);
      return liberacaoB - liberacaoA || n(a.valorQuitacao) - n(b.valorQuitacao);
    });
}

function projetarCartoesFuturos(data = {}, mesIndex = 0, dividasQuitadasIds = new Set()) {
  return (data.cartoes || []).reduce((total, cartao, idx) => {
    const idCartao = cartao.id || `cartao-${idx}`;
    if (dividasQuitadasIds.has(idCartao)) return total;

    const faturas = cartao.faturasProxMeses || {};
    const keys = Object.keys(faturas).sort();
    if (keys[mesIndex]) return total + n(faturas[keys[mesIndex]]);

    const parcelas = (cartao.parcelasFixas || []).reduce((s, p) => {
      return s + (n(p.mesesRestantes) > mesIndex ? n(p.valorParcela) : 0);
    }, 0);

    const recorrentes = (cartao.recorrentes || []).reduce((s, r) => s + n(r.valor), 0);
    return total + parcelas + recorrentes;
  }, 0);
}

function parcelaDividasAtivas(dividas = [], quitadas = new Set()) {
  return dividas.reduce((s, d) => {
    if (quitadas.has(d.id)) return s;
    // Consignado descontado em folha já está embutido no salário líquido.
    // Ele não deve entrar como saída mensal duplicada; ao quitar, aumenta a entrada do mês seguinte.
    if (d.descontaFolha) return s;
    return s + n(d.parcela);
  }, 0);
}

export function gerarExtratoFuturo(data = {}, ajustes = {}, quantidadeMeses = 13) {
  const base = calcularSaudeFinanceira(data);
  const hoje = new Date();
  const reservaMinima = n(ajustes.__config?.reservaMinima) || 200;
  let saldoInicial = base.saldoAtual || 0;
  let investimentoAcumulado = base.investimentos || 0;
  const quitadas = new Set();
  let aumentoFolhaMensal = 0;
  const dividas = listarDividasQuitaveis(data);

  return Array.from({ length: quantidadeMeses }, (_, i) => {
    const dataMes = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    const mes = mesKey(dataMes);
    const a = ajustes[mes] || {};

    const entradas = base.entradas + aumentoFolhaMensal;
    const fixas = base.fixas;
    const cartoes = projetarCartoesFuturos(data, i, quitadas);
    const outrasContas = parcelaDividasAtivas(dividas.filter((d) => d.origem !== "cartoes"), quitadas);
    const diversao = base.diversao;

    let saldoAntesEstrategia = saldoInicial + entradas - fixas - cartoes - outrasContas - diversao;

    let quitacoes = [];
    let valorQuitacoes = 0;

    if (Array.isArray(a.quitarIds) && a.quitarIds.length) {
      a.quitarIds.forEach((id) => {
        const d = dividas.find((item) => item.id === id);
        if (d && !quitadas.has(d.id)) {
          quitadas.add(d.id);
          valorQuitacoes += n(d.valorQuitacao);
          quitacoes.push(d);
        }
      });
    } else if (n(a.quitar) > 0) {
      valorQuitacoes = n(a.quitar);
    } else {
      const disponivelParaQuitar = saldoAntesEstrategia - reservaMinima;
      const candidata = dividas.find((d) => !quitadas.has(d.id) && n(d.valorQuitacao) > 0 && n(d.valorQuitacao) <= disponivelParaQuitar);
      if (candidata) {
        quitadas.add(candidata.id);
        valorQuitacoes = n(candidata.valorQuitacao);
        quitacoes.push(candidata);
      }
    }

    const saldoAposQuitacao = saldoAntesEstrategia - valorQuitacoes;
    let investimento = n(a.investimento);

    if (!a.investimentoManual) {
      const sobraParaInvestir = saldoAposQuitacao - reservaMinima;
      investimento = sobraParaInvestir > 0 ? Math.floor(sobraParaInvestir / 50) * 50 : 0;
    }

    const saldoFinal = saldoAposQuitacao - investimento;
    investimentoAcumulado += investimento;

    const aumentoFolhaGerado = quitacoes.reduce((s, q) => s + (q.descontaFolha ? n(q.parcela) : 0), 0);

    const linha = {
      mes,
      label: mesLabel(dataMes),
      saldoInicial,
      entradas,
      fixas,
      cartoes,
      outrasContas,
      diversao,
      quitacoes,
      valorQuitacoes,
      investimento,
      saldoFinal,
      investimentoAcumulado,
      zonaArrebentacao: i < 3,
      virada: saldoInicial < 0 && saldoFinal >= 0,
    };

    saldoInicial = saldoFinal;
    // A parcela de consignado quitado volta para o salário líquido a partir do mês seguinte.
    aumentoFolhaMensal += aumentoFolhaGerado;
    return linha;
  });
}

export function resumoExtratoFuturo(data = {}, ajustes = {}) {
  const linhas = gerarExtratoFuturo(data, ajustes);
  const ultimo = linhas[linhas.length - 1] || {};
  const primeiroMesPositivo = linhas.find((l) => l.saldoFinal >= 0)?.label || null;
  const totalQuitado = linhas.reduce((s, l) => s + n(l.valorQuitacoes), 0);
  const totalInvestido = Math.max(0, n(ultimo.investimentoAcumulado));
  return { linhas, ultimo, primeiroMesPositivo, totalQuitado, totalInvestido };
}

export function projetarIndependencia({ aporteInicial = 0, aporteMensal = 0, taxaAnual = 15, anos = 35 } = {}) {
  const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
  return Array.from({ length: anos }, (_, i) => {
    const ano = i + 1;
    const meses = ano * 12;
    const futuroInicial = n(aporteInicial) * Math.pow(1 + taxaMensal, meses);
    const futuroAportes = taxaMensal > 0 ? n(aporteMensal) * ((Math.pow(1 + taxaMensal, meses) - 1) / taxaMensal) : n(aporteMensal) * meses;
    const patrimonio = futuroInicial + futuroAportes;
    return {
      ano,
      patrimonio,
      rendaMensal: patrimonio * taxaMensal,
    };
  });
}
