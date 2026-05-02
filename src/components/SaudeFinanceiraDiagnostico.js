import { calcularSaudeFinanceira } from "./SaudeFinanceiraEngine";
import { calcularDistribuicaoSaude } from "./SaudeFinanceiraDistribuicao";
import { calcularScoreSaude } from "./SaudeFinanceiraScore";
import { gerarInsightsSaude } from "./SaudeFinanceiraInsights";

function fmtBRL(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function fmtPct(v) {
  return `${Number(v || 0).toFixed(0)}%`;
}

function gerarPanorama(base, score) {
  if (base.entradas <= 0) return "Cadastro incompleto";
  if (score.score >= 75) return "Saúde financeira boa";
  if (score.score >= 55) return "Atenção necessária em alguns pontos";
  if (score.score >= 35) return "Risco financeiro relevante";
  return "Situação crítica — ação imediata necessária";
}

function gerarResumo(base, insights) {
  if (base.entradas <= 0) {
    return "Informe sua renda líquida para liberar o diagnóstico completo e calcular sua capacidade real de pagamento.";
  }

  if (base.agiotas.quantidade > 0) {
    const juros = base.agiotas.jurosMensais;
    return `Há dívida informal ativa gerando ${fmtBRL(juros)} só em juros por mês, sem reduzir o principal. Segundo o Banco Central, o rotativo do cartão já chega a 428% ao ano — empréstimo informal costuma ser ainda pior. Isso é prioridade absoluta antes de qualquer outra estratégia.`;
  }

  if (base.saldoMes < 0) {
    const deficit = Math.abs(base.saldoMes);
    return `Com a estrutura atual, o mês fecha negativo em ${fmtBRL(deficit)} — zona de arrebentação. A CNC aponta que 12,6% das famílias brasileiras declararam não ter condições de pagar suas dívidas. O trabalho agora é identificar e eliminar os vazamentos antes de pensar em investir.`;
  }

  if (base.percentuais.fixas > 70) {
    return `As contas fixas estão consumindo ${fmtPct(base.percentuais.fixas)} da renda — acima do limite saudável de 60%. Com tão pouca margem, qualquer imprevisto vira dívida. O caminho começa por recuperar espaço no orçamento fixo.`;
  }

  if (base.cartoes.total > base.entradas * 0.3) {
    return `O cartão de crédito está pesando ${fmtPct(base.percentuais.cartoes)} do orçamento. Segundo a CNC/Peic (2025), 85,1% das famílias endividadas no Brasil têm dívida no cartão — a modalidade com os juros mais altos do mercado. Antes de avançar, é preciso controlar esse vazamento.`;
  }

  const criticos = insights.filter((i) => i.tipo === "critico");
  if (criticos.length > 0) {
    return `Há pontos que precisam de atenção antes de avançar. O mês fecha positivo, mas a estrutura ainda tem pressão. Resolver os pontos críticos primeiro cria a base para um crescimento real.`;
  }

  if (base.saldoMes > 0 && base.saldoMes < base.entradas * 0.05) {
    return `O mês fecha positivo, mas com margem muito estreita. A estrutura funciona, mas não aguenta variações. Ajustar alguns custos fixos vai dar a solidez que ainda está faltando.`;
  }

  return `A estrutura mostra equilíbrio e controle. O próximo passo é transformar a sobra mensal em construção patrimonial — reserva, curto prazo e independência financeira. Segundo o Sebrae, guardar pelo menos 6 meses de custo fixo como reserva é o primeiro passo antes de qualquer investimento de risco.`;
}

function gerarDirecaoPrincipal(base, insights) {
  if (base.entradas <= 0) {
    return "Complete o questionário com sua renda líquida para liberar o diagnóstico completo.";
  }

  // 1. Agiota — prioridade máxima
  if (base.agiotas.quantidade > 0) {
    return `Prioridade 1: substituir a dívida informal por uma linha formal (banco, cooperativa de crédito). Qualquer taxa bancária tende a ser menor que empréstimo informal — e com dívida formalizada você passa a amortizar o principal, não só pagar juros.`;
  }

  // 2. Mês negativo
  if (base.saldoMes < 0) {
    return "Prioridade: estabilizar o mês. Mapeie as dívidas por fluxo de caixa — quite primeiro a que tem maior parcela com menos tempo restante. Não comece a investir antes de o mês fechar no positivo.";
  }

  // 3. Fixas acima do limite
  if (base.percentuais.fixas > 70) {
    return `Foco em reduzir custos fixos: revisar recorrentes, assinaturas e contratos. Uma redução de R$ 300-500 no fixo mensal muda completamente o equilíbrio do orçamento.`;
  }

  // 4. Cartão pesado
  if (base.percentuais.cartoes > 30) {
    return "Suspenda novos parcelamentos e pague o máximo possível da fatura. Mova recorrentes (academia, streaming, seguros) para débito automático — elimina surpresa mensal e reduz dependência do cartão.";
  }

  // 5. Dívidas altas
  if (base.percentuais.dividasMensais > 30) {
    return "Mapeie todas as dívidas: valor total, parcela e meses restantes. A quitação estratégica começa pela que libera mais fluxo rápido — maior parcela com menor prazo restante. Cada dívida quitada libera margem para atacar a próxima.";
  }

  // 6. Sem reserva
  if (base.saldoAtual < base.fixas) {
    return "Construa reserva antes de investir em risco. Meta mínima: 3 meses de custo fixo em aplicação com liquidez diária (Tesouro Selic ou CDB liquidez imediata). Isso protege o orçamento de imprevistos sem criar nova dívida.";
  }

  // 7. Tudo ok
  return "Direcione o excedente mensal com intenção: 10% independência (longo prazo), 15% curto prazo (reserva e metas), 5% educação, 10% diversão. O crescimento patrimonial começa com consistência — não com valor.";
}

function gerarOportunidades(base, insights) {
  const ops = [];

  if (base.percentuais.fixas > 60) {
    const potencial = base.fixas - base.entradas * 0.6;
    ops.push(`Reduzir contas fixas para 60% liberaria ${fmtBRL(potencial)}/mês — ${fmtBRL(potencial * 12)} por ano.`);
  }
  if (base.cartoes.total > 0) {
    ops.push("Mover recorrentes (streaming, academia, seguros) do cartão para débito elimina surpresas na fatura e reduz dependência de crédito.");
  }
  if (base.outrasContas.parcelaMensal > 0) {
    ops.push("Identificar a dívida com maior parcela e menor prazo restante e quitá-la primeiro libera fluxo de caixa mais rápido.");
  }
  if (base.consignados.descontadosFolha > 0) {
    ops.push(`Quando o consignado terminar, ${fmtBRL(base.consignados.descontadosFolha)}/mês volta para o salário — definir o destino agora evita que suma no consumo.`);
  }
  if (base.saldoMes > base.entradas * 0.1 && base.agiotas.quantidade === 0) {
    ops.push("A sobra mensal pode ser automatizada: no dia do salário, um valor fixo vai direto para reserva/investimento antes de qualquer gasto.");
  }
  if (base.agiotas.quantidade > 0) {
    ops.push(`Substituir a dívida informal por empréstimo formal pouparia parte dos ${fmtBRL(base.agiotas.jurosMensais)}/mês pagos só em juros.`);
  }

  return ops.slice(0, 4);
}

export function gerarDiagnosticoSaude(data) {
  const base = calcularSaudeFinanceira(data);
  const distribuicao = calcularDistribuicaoSaude(data);
  const score = calcularScoreSaude(data);
  const insights = gerarInsightsSaude(data);

  const pontosCriticos = insights.filter((i) => i.tipo === "critico");
  const atencoes = insights.filter((i) => i.tipo === "atencao");
  const dicas = insights.filter((i) => i.tipo === "dica");
  const positivos = insights.filter((i) => i.tipo === "saudavel");

  return {
    base,
    distribuicao,
    score,
    insights,
    relatorio: {
      panorama: gerarPanorama(base, score),
      resumo: gerarResumo(base, insights),
      direcao: gerarDirecaoPrincipal(base, insights),
      oportunidades: gerarOportunidades(base, insights),
      pontosCriticos,
      atencoes,
      dicas,
      positivos,
    },
  };
}
