/**
 * SaudeFinanceiraInsights.js
 *
 * Banco de diagnósticos do módulo Saúde Financeira.
 * Fontes: Banco Central, Serasa, SPC/CNDL, CNC/Peic, Sebrae
 * Filosofia: princípios do educador financeiro (filtro final)
 */

import { calcularSaudeFinanceira } from "./SaudeFinanceiraEngine";

function insight(tipo, area, titulo, impacto, direcao, prioridade = 2, regra = null) {
  return { tipo, area, titulo, impacto, direcao, prioridade, regra };
}

function fmtBRL(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function fmtPct(v) {
  return `${Number(v || 0).toFixed(0)}%`;
}

// ─── REGRAS ───────────────────────────────────────────────────────────────────

function regraEntradas(s) {
  if (s.entradas <= 0) {
    return insight(
      "critico", "entradas",
      "Renda não informada",
      "Sem saber o que entra, é impossível saber o que sobra. Nenhum diagnóstico funciona sem esse dado.",
      "Volte ao bloco de entradas e confirme o valor líquido que cai na conta — o que você recebe de verdade, após todos os descontos.",
      1, "Base do planejamento"
    );
  }
  return null;
}

function regraContasFixas(s) {
  const pct = s.percentuais.fixas;

  if (pct > 80) {
    return insight(
      "critico", "fixas",
      `Contas fixas em ${fmtPct(pct)} da renda — zona crítica`,
      "Quando o essencial passa de 80%, qualquer imprevisto vira dívida nova. Segundo o Sebrae, profissionais nessa situação chegam a ser 20% menos produtivos pelo estresse financeiro.",
      "Revisão urgente. Três alvos fáceis: streaming, celular e internet — todos renegociáveis por telefone em minutos. Cada R$ 100 cortado nas fixas libera R$ 1.200 por ano.",
      1, "Regra dos 60% — contas fixas"
    );
  }
  if (pct > 70) {
    return insight(
      "critico", "fixas",
      `Contas fixas em ${fmtPct(pct)} — acima do limite`,
      "Acima de 70% no essencial, o orçamento não aguenta variação. Investimento, reserva e educação ficam fora da equação.",
      "Identifique 2 contas para cortar ou renegociar nos próximos 30 dias. Internet, celular e assinaturas têm as maiores chances de desconto imediato.",
      1, "Regra dos 60% — contas fixas"
    );
  }
  if (pct > 60) {
    return insight(
      "atencao", "fixas",
      `Essenciais em ${fmtPct(pct)} — acima dos 60% saudáveis`,
      "A meta é manter o essencial em até 60% da renda. Acima disso, os outros pilares (reserva, investimento, educação, diversão) ficam espremidos.",
      "Não precisa cortar tudo de uma vez. Identifique a conta que mais pesa e comece por ela. Reduzir R$ 200/mês muda o equilíbrio do orçamento inteiro.",
      2, "Regra dos 60% — contas fixas"
    );
  }
  if (pct > 0 && pct <= 55) {
    return insight(
      "saudavel", "fixas",
      `Contas fixas em ${fmtPct(pct)} — dentro do ideal`,
      "Suas contas fixas estão bem calibradas. Isso é a base de um planejamento sólido.",
      "Mantenha esse equilíbrio ao renovar contratos. Reajustes de aluguel, plano de celular e assinaturas são as maiores ameaças ao longo do tempo.",
      5, "Regra dos 60% — contas fixas"
    );
  }
  return null;
}

function regraAgiotas(s) {
  if (s.agiotas.quantidade === 0) return null;
  const juros = s.agiotas.jurosMensais;
  const quitacao = s.agiotas.valorQuitacao;
  return insight(
    "critico", "agiotas",
    `Dívida informal — ${fmtBRL(juros)}/mês só de juros`,
    `Empréstimo informal não amortiza o principal. Você paga ${fmtBRL(juros)} todo mês e a dívida continua em ${fmtBRL(quitacao)}. Em 12 meses: ${fmtBRL(juros * 12)} pagos sem reduzir nada. Os juros do cartão rotativo chegam a 428% ao ano (Banco Central, 2026) — informal costuma ser ainda pior.`,
    "Prioridade máxima: substituir essa dívida por uma linha formal (banco, cooperativa de crédito). Qualquer taxa bancária, mesmo alta, tende a ser menor que empréstimo informal. Com a dívida formalizada, você passa a amortizar o principal.",
    1, "Regra 2 — não fazer empréstimos sem avaliar o custo real"
  );
}

function regraCartoes(s, data) {
  const cartoes = data?.cartoes || [];
  const qtd = cartoes.length;
  const pct = s.percentuais.cartoes;

  if (s.agiotas.quantidade > 0 && s.cartoes.total > 0) {
    return insight(
      "critico", "cartoes",
      "Cartão de crédito + dívida informal simultaneamente",
      "Essa é a combinação mais perigosa em finanças pessoais. Segundo o SPC Brasil, dependência de crédito rotativo e empréstimos informais ao mesmo tempo é o principal gatilho do superendividamento.",
      "Pare de usar o cartão agora. Apenas débito ou dinheiro enquanto a dívida informal não for quitada. Nenhuma compra parcelada nova.",
      1, "Regra 1 — não usar cartão de crédito até ter controle"
    );
  }
  if (pct > 40) {
    return insight(
      "critico", "cartoes",
      `Fatura do cartão em ${fmtPct(pct)} da renda`,
      "Segundo a CNC, 85,1% das famílias endividadas no Brasil têm dívida no cartão — a modalidade mais cara do mercado. Quem paga só o mínimo entra no rotativo: 428% ao ano (Banco Central, abr/2026).",
      "Suspenda novos parcelamentos. Pague o máximo possível da fatura agora. Pagar o mínimo é transformar o cartão em agiota com CNPJ.",
      1, "Regra 1 — não usar cartão de crédito até ter controle"
    );
  }
  if (pct > 25) {
    return insight(
      "atencao", "cartoes",
      `Cartão pesa ${fmtPct(pct)} do orçamento`,
      "Fatura acima de 25% da renda esconde gastos que parecem pequenos mas somados pressionam o mês e reduzem previsibilidade.",
      "Liste o que está sendo pago no cartão. Separe recorrentes (academia, streaming) de compras avulsas. Mova recorrentes para débito — elimina surpresa na fatura.",
      2, "Regra 1 — não usar cartão de crédito até ter controle"
    );
  }
  if (qtd >= 3 && s.cartoes.total > 0) {
    return insight(
      "atencao", "cartoes",
      `${qtd} cartões ativos`,
      "Múltiplos cartões distorcem a percepção de quanto realmente está comprometido. Limite disponível não é dinheiro que você tem.",
      "Concentre em 1 ou 2 cartões no máximo. Cancele os de menor uso. Limite disponível = crédito do banco, não sua renda.",
      3, "Regra 1 — não usar cartão de crédito até ter controle"
    );
  }
  return null;
}

function regraSaldoMes(s) {
  if (s.saldoMes < 0) {
    const deficit = Math.abs(s.saldoMes);
    return insight(
      "critico", "saldo",
      `Mês fecha negativo em ${fmtBRL(deficit)}`,
      "Zona de arrebentação. O orçamento não fecha — todo mês o buraco cresce. Segundo a CNC/Peic (2025), 12,6% das famílias endividadas declararam não ter condições de pagar suas dívidas. Você está próximo desse limite.",
      "O objetivo agora não é investir — é parar o sangramento. Identifique a dívida com maior parcela e menor prazo restante e quite primeiro. Cada R$ liberado em parcela mensal é oxigênio para o orçamento.",
      1, "Princípio da estabilidade antes do crescimento"
    );
  }
  if (s.saldoMes > 0 && s.saldoMes < s.entradas * 0.05) {
    return insight(
      "atencao", "saldo",
      `Sobra apenas ${fmtPct(s.percentuais.saldoMes)} no mês`,
      "O mês fecha positivo, mas com margem mínima. Um imprevisto médio já desequilibra.",
      "Identifique o que está consumindo mais que o previsto. Pequenos cortes em 3 ou 4 linhas criam a margem mínima de segurança.",
      2, "Princípio da reserva antes do investimento"
    );
  }
  return null;
}

function regraEmprestimos(s, data) {
  const outras = data?.outrasContas || [];
  const qtdEmp = outras.filter((o) => ["emprestimo", "financ_carro"].includes(o.tipo)).length;
  const pct = s.percentuais.dividasMensais;

  if (qtdEmp >= 2 && pct > 30) {
    return insight(
      "critico", "dividas",
      `${qtdEmp} empréstimos simultâneos + ${fmtPct(pct)} da renda em parcelas`,
      "Segundo o SPC Brasil, a crescente dependência de crédito pessoal é um dos principais fatores do superendividamento. Cada empréstimo novo compra tempo mas aumenta o comprometimento mensal.",
      "Nenhuma dívida nova antes de quitar ao menos uma das atuais. Estratégia: quite primeiro a com maior parcela e menor prazo — libera caixa mais rápido para atacar a próxima.",
      1, "Regra 2 — não fazer empréstimos sem avaliar o custo real"
    );
  }
  if (pct > 35) {
    return insight(
      "critico", "dividas",
      `${fmtPct(pct)} da renda comprometida em parcelas`,
      "Acima de 35% em parcelas sobra menos de 65% para tudo — fixas, alimentação, saúde, investimento. O Banco Central aponta 29,7% como média nacional (abr/2026) — você está acima disso.",
      "Mapeie todas as dívidas: valor total, parcela e meses restantes. A quitação estratégica começa pela que libera mais fluxo mais rápido — não necessariamente a de menor saldo.",
      1, "Princípio da quitação inteligente"
    );
  }
  if (pct > 20) {
    return insight(
      "atencao", "dividas",
      `${fmtPct(pct)} da renda em parcelas`,
      "Ainda gerenciável, mas restringe capacidade de construir reserva e investir.",
      "Não faça novos parcelamentos enquanto esse percentual não baixar. Quando uma parcela terminar, direcione parte desse valor para acelerar a próxima quitação.",
      2, "Princípio da quitação inteligente"
    );
  }
  return null;
}

function regraAtrasadas(s, data) {
  const atrasadas = data?.contasAtrasadas || [];
  if (atrasadas.length === 0) return null;
  const totalAtrasado = atrasadas.reduce((acc, c) => acc + Number(c.valorTotal || 0), 0);
  return insight(
    "atencao", "atrasadas",
    `${atrasadas.length} conta(s) em atraso — ${fmtBRL(totalAtrasado)} registrados`,
    "Conta parada já foi provisionada pelo banco (PDD — Provisão para Devedores Duvidosos). Os juros que aparecem são artificiais. Não faz sentido renegociar agora e assumir dívida nova maior com a vida desorganizada.",
    "Deixa parada por enquanto. Primeiro: arrumar a casa — sobrar dinheiro mês a mês e construir reserva. Quando tiver um montante, ofereça à vista 50% do valor original diretamente ao gerente, preferencialmente no final do mês quando ele está fechando caixa. Nome negativado não é o problema — é proteção para você não se enforcar em nova dívida enquanto reorganiza.",
    3, "Princípio: saúde financeira antes do nome limpo"
  );
}

function regraVencimentos(s, data) {
  const fixas = data?.contasFixas || {};
  const totalLinhas = Object.values(fixas).filter((v) =>
    typeof v === "number" ? v > 0 : v?.valor > 0
  ).length;
  if (totalLinhas >= 5 && s.fixas > 0) {
    return insight(
      "dica", "organizacao",
      "Mude o vencimento das contas para o dia 20",
      "Contas espalhadas pelo mês criam a sensação de que o dinheiro nunca é suficiente. Quem recebe salário no dia 5 e concentra as contas no dia 20 tem 15 dias para organizar o caixa e tomar decisões com clareza.",
      "Ligue para operadoras (celular, internet, academia, seguros) e peça mudança de vencimento para o dia 20. A maioria aceita sem custo. Isso cria uma janela entre receber e pagar — e elimina aquela sensação de estar sempre no limite.",
      3, "Regra 3 — vencimento das contas no dia 20"
    );
  }
  return null;
}

function regraReserva(s) {
  const reservaMeses = s.fixas > 0 ? s.saldoAtual / s.fixas : 0;

  if (reservaMeses < 0.5 && s.saldoMes > 0) {
    return insight(
      "atencao", "reserva",
      "Sem reserva de emergência",
      "Saldo positivo sem reserva é andar sem estepe. O Sebrae recomenda guardar pelo menos o equivalente a 6 meses de custo fixo. Sem isso, qualquer imprevisto puxa para dívida nova.",
      "Antes de investir em qualquer coisa, construa a reserva. Meta mínima: 3 meses de custo fixo em aplicação com liquidez diária (Tesouro Selic ou CDB liquidez diária). Isso é proteção, não investimento.",
      2, "Princípio da reserva de emergência"
    );
  }
  if (reservaMeses >= 0.5 && reservaMeses < 2) {
    return insight(
      "atencao", "reserva",
      `Reserva para ${reservaMeses.toFixed(1)} mês — ainda frágil`,
      "Protege de imprevistos pequenos, mas não de um mês de renda perdida ou um problema de saúde.",
      "Continue construindo antes de acelerar investimentos de risco. Meta: 3 a 6 meses de custos fixos guardados.",
      3, "Princípio da reserva de emergência"
    );
  }
  return null;
}

function regraAutonomo(s, data) {
  const entradas = data?.entradas || {};
  const salario1 = Number(entradas.salario1?.valor || entradas.salario1 || 0);
  const totalOutras = (entradas.outrasFontes || []).reduce((acc, f) => acc + Number(f.valor || 0), 0);

  if (salario1 === 0 && totalOutras > 0) {
    return insight(
      "dica", "autonomo",
      "Renda variável: acumule antes de gastar",
      "Autônomo que gasta no ritmo dos dias bons aperta nos dias fracos — ciclo que impede crescimento patrimonial. Segundo o Sebrae, separar finanças pessoais das profissionais é o primeiro passo para quem tem renda variável.",
      "Defina um 'salário' fixo para você — valor conservador baseado nos meses mais fracos. Acumule tudo no mês em conta separada e no dia 20 transfira só o seu salário para a conta de pagamentos. Excedente vai para reserva.",
      3, "Princípio do pró-labore para autônomos"
    );
  }
  return null;
}

function regraConsignado(s, data) {
  const consignados = (data?.consignados || []).filter((c) => c.descontaFolha);
  if (consignados.length === 0) return null;
  const total = consignados.reduce((acc, c) => acc + Number(c.parcela || 0), 0);

  if (consignados.length >= 2) {
    return insight(
      "atencao", "consignado",
      `${consignados.length} consignados — ${fmtBRL(total)}/mês descontados na folha`,
      "Consignado tem taxa menor que empréstimo pessoal, mas acumular mais de um reduz o salário líquido silenciosamente a cada mês.",
      `Ao quitar qualquer consignado, não deixe o valor sumir no orçamento. Use exatamente ${fmtBRL(total > 0 ? total / consignados.length : 0)}/mês para acelerar o próximo ou construir reserva.`,
      3, "Princípio do fluxo de caixa liberado"
    );
  }
  return insight(
    "dica", "consignado",
    `Ao quitar o consignado, ${fmtBRL(total)}/mês volta para você`,
    "Quando o consignado acabar, seu salário líquido sobe automaticamente. Oportunidade — mas só se você decidir o destino antes que suma no consumo.",
    `Decida agora: com os ${fmtBRL(total)}/mês liberados, metade vai para reserva e metade para acelerar a próxima dívida ou investir.`,
    4, "Princípio do fluxo de caixa liberado"
  );
}

function regraInvestimentos(s, data) {
  const totalInvestido = (data?.investimentos || []).reduce((acc, i) => acc + Number(i.valor || 0), 0);

  if (totalInvestido > 0 && s.agiotas.quantidade > 0) {
    return insight(
      "atencao", "investimentos",
      "Investindo enquanto tem dívida informal",
      "Dinheiro investido a 12-15% ao ano enquanto paga juros informais de 10-20% ao mês — a matemática trabalha contra você.",
      "Use parte do que está investido para quitar a dívida informal. Depois de zerar os juros altos, o investimento rende de verdade.",
      2, "Princípio do custo de oportunidade"
    );
  }
  if (totalInvestido > 0 && s.saldoMes < 0) {
    return insight(
      "atencao", "investimentos",
      "Investido mas mês negativo",
      "Ter dinheiro aplicado enquanto o mês fecha negativo geralmente significa pagar juros de dívida mais caros do que o investimento rende.",
      "Avalie resgatar parte para quitar a dívida mais cara e equilibrar o mês. Depois reconstrói a reserva.",
      2, "Princípio do custo de oportunidade"
    );
  }
  if (s.saldoMes > s.entradas * 0.15 && totalInvestido === 0 && s.agiotas.quantidade === 0) {
    return insight(
      "dica", "investimentos",
      "Sobra mensal sem destino estratégico",
      "Dinheiro que sobra sem destino definido tende a ser consumido. Automatizar o investimento elimina a tentação.",
      "No dia do salário, transfira automaticamente um valor fixo para reserva/investimento antes de qualquer gasto. Começa pequeno — a consistência importa mais que o valor.",
      3, "Regra 10 — investir em ativos que geram renda passiva"
    );
  }
  return null;
}

function regraCartaoCorreto(s, data) {
  // Usuário com saldo positivo e investimentos — orienta sobre uso correto do cartão
  const totalInvestido = (data?.investimentos || []).reduce((acc, i) => acc + Number(i.valor || 0), 0);
  if (
    s.saldoMes > s.entradas * 0.2 &&
    totalInvestido > s.entradas * 2 &&
    s.agiotas.quantidade === 0 &&
    s.percentuais.dividasMensais < 15 &&
    s.cartoes.quantidade > 0
  ) {
    return insight(
      "dica", "cartoes",
      "Você pode usar o cartão a seu favor",
      "Com reserva formada e controle do orçamento, o cartão pode trabalhar para você: deixa o dinheiro investido rendendo e parcela sem juros.",
      "Regra: o dinheiro da compra já está na conta. O item custa mais de R$ 2-3 mil. Não há desconto à vista. Nesse caso, parcele sem juros e mantenha o dinheiro rendendo no investimento. Fora disso — débito ou dinheiro.",
      4, "Regra 8 — uso correto do cartão de crédito"
    );
  }
  return null;
}

function regraEquilibrada(s) {
  if (
    s.saldoMes > 0 &&
    s.percentuais.fixas <= 60 &&
    s.agiotas.quantidade === 0 &&
    s.percentuais.dividasMensais <= 20 &&
    s.entradas > 0
  ) {
    return insight(
      "saudavel", "geral",
      "Estrutura financeira equilibrada",
      "Seu mapa mostra controle: entradas bem distribuídas, custos fixos dentro do limite, sem dívidas caras pressionando o caixa.",
      "Agora o foco é multiplicar. Direcione o excedente: 10% independência (longo prazo), 15% curto prazo (reserva e metas), 5% educação, 10% diversão. O crescimento patrimonial começa com consistência.",
      5, "Princípio do crescimento a partir da estabilidade"
    );
  }
  return null;
}

// ─── EXPORT PRINCIPAL ─────────────────────────────────────────────────────────

export function gerarInsightsSaude(data) {
  const s = calcularSaudeFinanceira(data);
  const insights = [];

  const regras = [
    () => regraEntradas(s),
    () => regraAtrasadas(s, data),
    () => regraAgiotas(s),
    () => regraCartoes(s, data),
    () => regraSaldoMes(s),
    () => regraEmprestimos(s, data),
    () => regraContasFixas(s),
    () => regraConsignado(s, data),
    () => regraReserva(s),
    () => regraVencimentos(s, data),
    () => regraAutonomo(s, data),
    () => regraInvestimentos(s, data),
    () => regraCartaoCorreto(s, data),
    () => regraEquilibrada(s),
  ];

  for (const regra of regras) {
    try {
      const r = regra();
      if (r) insights.push(r);
    } catch {}
  }

  const ordemTipo = { critico: 0, atencao: 1, dica: 2, saudavel: 3 };
  insights.sort((a, b) => {
    const d = (ordemTipo[a.tipo] ?? 9) - (ordemTipo[b.tipo] ?? 9);
    return d !== 0 ? d : a.prioridade - b.prioridade;
  });

  return insights;
}
