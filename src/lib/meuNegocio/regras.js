/**
 * regras.js
 *
 * Banco de regras de diagnóstico financeiro.
 *
 * Cada regra avalia uma condição sobre os dados financeiros do negócio
 * e, se disparada, produz um INSIGHT com:
 *   id           identificador único
 *   tipo         categoria (margem/custo/concentracao/etc) — usado pra agrupar
 *   severidade   'saudavel' | 'alerta' | 'critico'
 *   area         nome curto pra mostrar no Free
 *   diagnostico  texto explicativo (Premium)
 *   acao         sugestão concreta (Premium)
 *   impacto      estimativa de R$ ou % de melhoria (Premium, opcional)
 *
 * Categorias detectadas por palavra-chave porque o usuário pode digitar
 * "Combustível", "combustivel", "GASOLINA" etc. O matcher é tolerante.
 */

/* ══════════════════════════════════════════════════════════════
   MATCHERS — agrupa categorias livres do usuário em tipos canônicos.
   Cada tipo é um conjunto de keywords (sem acento, lowercase).
   ══════════════════════════════════════════════════════════════ */
const TIPOS_CATEGORIA = {
  combustivel:  ['combustivel', 'gasolina', 'etanol', 'diesel', 'posto'],
  manutencao:   ['manutencao', 'oleo', 'pneu', 'freio', 'revisao', 'mecanico', 'mecanica', 'oficina'],
  taxa_app:     ['app', 'ifood', 'uber', 'rappi', 'plataforma', 'taxa de aplicativo', '99'],
  ingredientes: ['ingrediente', 'cmv', 'mercadoria', 'insumo', 'compra de produto', 'materia prima', 'materia-prima'],
  pessoal:      ['salario', 'funcionario', 'comissao', 'folha', 'pro-labore', 'prolabore', 'estagiario', 'ajudante'],
  ocupacao:     ['aluguel', 'condominio', 'iptu', 'agua', 'luz', 'energia', 'internet', 'gas', 'telefone'],
  marketing:    ['marketing', 'trafego', 'anuncio', 'ads', 'publicidade', 'instagram', 'panfleto', 'google'],
  impostos:     ['imposto', 'das', 'mei', 'simples', 'tributo', 'pis', 'cofins', 'iss', 'irpj'],
  taxa_card:    ['maquininha', 'cartao', 'pix', 'gateway', 'stone', 'pagseguro', 'mercado pago', 'cielo'],
  embalagens:   ['embalagem', 'caixa', 'sacola', 'descartavel'],
  marketing_d:  ['hotmart', 'eduzz', 'kiwify', 'monetizze', 'braip'],
};

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Detecta a qual tipo canônico uma categoria livre pertence.
 * Retorna null se não encaixar em nenhum.
 */
export function detectarTipoCategoria(nomeCategoria) {
  const norm = normalizar(nomeCategoria);
  for (const [tipo, keywords] of Object.entries(TIPOS_CATEGORIA)) {
    if (keywords.some(kw => norm.includes(kw))) return tipo;
  }
  return null;
}

/* ══════════════════════════════════════════════════════════════
   FORMATADORES
   ══════════════════════════════════════════════════════════════ */
const fmtBRL = (v) =>
  `R$ ${Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtPct = (v) => `${Number(v || 0).toFixed(1)}%`;

/* ══════════════════════════════════════════════════════════════
   REGRAS — cada uma é uma função pura que recebe (dados, benchmark)
   e devolve um insight ou null.
   ══════════════════════════════════════════════════════════════ */

/**
 * Regra 1: MARGEM LÍQUIDA
 * Compara margem real com a faixa saudável do segmento.
 */
function regraMargem({ totalR, lucro, margem }, bench, segLabel) {
  if (totalR === 0) return null;
  const m = bench.margemLiquida;
  let severidade = 'saudavel';
  if (margem < m.critico) severidade = 'critico';
  else if (margem < m.alerta) severidade = 'critico'; // abaixo de alerta vira crítico
  else if (margem < m.saudavel) severidade = 'alerta';
  if (severidade === 'saudavel') return null;

  // Estimativa de impacto: quanto subiria o lucro se atingisse o saudável.
  const lucroSaudavel = totalR * (m.saudavel / 100);
  const ganhoPotencial = lucroSaudavel - lucro;

  return {
    id: 'margem_baixa',
    tipo: 'margem',
    severidade,
    area: 'Margem Líquida',
    diagnostico: `Sua margem líquida está em ${fmtPct(margem)}. A referência saudável para ${segLabel} é a partir de ${m.saudavel}%. ${severidade === 'critico' ? 'Operação no limite de sustentabilidade.' : 'Há espaço para melhorar.'}`,
    acao: 'Revise as 3 categorias de despesa que mais consomem seu faturamento. Pequenos cortes nos maiores grupos têm impacto maior do que muitos cortes pequenos.',
    impacto: ganhoPotencial > 0 ? `Atingir margem saudável significaria +${fmtBRL(ganhoPotencial)}/mês de lucro líquido.` : null,
  };
}

/**
 * Regra 2: CUSTO TOTAL
 * Quanto do faturamento está sendo consumido por todas as despesas.
 */
function regraCustoTotal({ totalR, totalD, custoPct }, bench, segLabel) {
  if (totalR === 0) return null;
  const c = bench.custoTotal;
  let severidade = 'saudavel';
  if (custoPct > c.critico) severidade = 'critico';
  else if (custoPct > c.alerta) severidade = 'critico';
  else if (custoPct > c.saudavel) severidade = 'alerta';
  if (severidade === 'saudavel') return null;

  const economiaAlvo = ((custoPct - c.saudavel) / 100) * totalR;

  return {
    id: 'custo_total_alto',
    tipo: 'custo',
    severidade,
    area: 'Custos Totais',
    diagnostico: `Seus custos consomem ${fmtPct(custoPct)} do faturamento. A referência saudável para ${segLabel} é até ${c.saudavel}%.`,
    acao: 'Identifique as categorias maiores que o benchmark do segmento — geralmente 1 ou 2 categorias respondem pela maior parte do excedente.',
    impacto: economiaAlvo > 0 ? `Trazer custos para a faixa saudável liberaria cerca de ${fmtBRL(economiaAlvo)}/mês.` : null,
  };
}

/**
 * Regra 3: CATEGORIA ESPECÍFICA ACIMA DO BENCHMARK
 * Para cada categoria de despesa, compara % com o benchmark (se existir).
 * Gera insight por categoria classificada como alerta/crítico.
 */
function regraCategorias({ totalR, despPorCat }, bench, segLabel) {
  if (totalR === 0) return [];
  const insights = [];
  const benchCats = bench.categorias || {};

  // Para cada categoria do usuário, vê se há benchmark direto ou via tipo.
  despPorCat.forEach(([nomeCat, valor]) => {
    const pct = (valor / totalR) * 100;

    // 1) tenta match direto pelo label do benchmark
    let benchCat = null;
    let benchKey = null;

    for (const [key, b] of Object.entries(benchCats)) {
      if (normalizar(key) === normalizar(nomeCat)) {
        benchCat = b; benchKey = key; break;
      }
    }

    // 2) tenta via tipo canônico (combustivel, ocupacao etc)
    if (!benchCat) {
      const tipo = detectarTipoCategoria(nomeCat);
      if (tipo) {
        // mapa tipo → labels comuns que podem aparecer no benchmark
        const TIPO_PARA_LABEL = {
          combustivel:  'Combustível',
          manutencao:   'Manutenção',
          taxa_app:     'Taxa do App',
          ingredientes: 'Ingredientes/CMV',
          pessoal:      ['Folha/Pessoal', 'Comissão/Pessoal'],
          ocupacao:     ['Aluguel/Ocupação', 'Aluguel/Ponto'],
          marketing:    'Marketing',
          impostos:     ['Impostos', 'Impostos/MEI'],
          taxa_card:    'Taxa Maquininha',
          embalagens:   'Embalagens',
        };
        const possiveis = [].concat(TIPO_PARA_LABEL[tipo] || []);
        for (const label of possiveis) {
          if (benchCats[label]) { benchCat = benchCats[label]; benchKey = label; break; }
        }
      }
    }

    if (!benchCat) {
      // Sem benchmark direto: aplica regra genérica de "categoria > 30% é sinal"
      if (pct > 30) {
        insights.push({
          id: `categoria_genérica_${nomeCat}`,
          tipo: 'categoria',
          severidade: 'alerta',
          area: nomeCat,
          diagnostico: `"${nomeCat}" consome ${fmtPct(pct)} do faturamento (${fmtBRL(valor)}/mês). Como categoria isolada, isso costuma indicar concentração excessiva.`,
          acao: 'Detalhe esta categoria em sub-itens (ex: "Combustível: gasolina + diesel") para diagnóstico mais preciso.',
          impacto: null,
        });
      }
      return;
    }

    // Tem benchmark: classifica
    let severidade = 'saudavel';
    if (pct > benchCat.critico) severidade = 'critico';
    else if (pct > benchCat.alerta) severidade = 'alerta';
    if (severidade === 'saudavel') return;

    const economiaAlvo = ((pct - benchCat.saudavel) / 100) * totalR;

    insights.push({
      id: `categoria_${benchKey}`,
      tipo: 'categoria',
      severidade,
      area: benchKey,
      diagnostico: `${benchKey} representa ${fmtPct(pct)} do faturamento (${fmtBRL(valor)}/mês). Para ${segLabel}, a referência saudável é até ${benchCat.saudavel}% ${severidade === 'critico' ? `(crítico acima de ${benchCat.critico}%)` : `(alerta acima de ${benchCat.alerta}%)`}.`,
      acao: gerarAcao(benchKey, severidade),
      impacto: economiaAlvo > 0 ? `Reduzir esta categoria ao patamar saudável liberaria cerca de ${fmtBRL(economiaAlvo)}/mês.` : null,
      fonte: benchCat.nota,
    });
  });

  return insights;
}

/**
 * Banco de ações sugeridas por categoria.
 * Gestor financeiro/de negócios fala aqui — não inventei nada que não
 * seja prática de mercado consolidada.
 */
function gerarAcao(benchKey, severidade) {
  const acoes = {
    'Combustível': 'Revise rotas (apps de otimização ajudam), avalie troca para moto se hoje for carro, considere posto fixo com desconto de fidelidade. Em caso crítico, calcule se está aceitando entregas com R$/km abaixo do seu custo operacional.',
    'Manutenção': 'Manutenção preventiva sai mais barata que corretiva. Faça revisão a cada 5-10 mil km, troque óleo no prazo, mantenha pneus calibrados. Reserve mensalmente em conta separada.',
    'Taxa do App': 'Diversifique plataformas para reduzir dependência. Considere migrar do Plano Entrega (23%) para Básico (12%) se sua operação suportar entregar por conta. Comece a captar clientes diretos para reduzir % de pedidos via app.',
    'Ingredientes/CMV': 'Faça ficha técnica de cada prato e calcule o CMV individual. Negocie com 3 fornecedores diferentes a cada trimestre. Revise porções (gramatura) e desperdício na cozinha. Itens com CMV > 35% individual: ou suba o preço ou troque o ingrediente.',
    'Folha/Pessoal': 'Avalie produtividade média por funcionário (faturamento / nº funcionários). Considere terceirizar tarefas pontuais em vez de contratar fixo. Cuidado: cortar pessoal sem reorganizar processo derruba receita junto com custo.',
    'Comissão/Pessoal': 'Revise modelo de comissão: comissão sobre lucro (não sobre receita) protege sua margem. Avalie se aluguel de cadeira faria mais sentido que comissão para profissionais autônomos no salão.',
    'Aluguel/Ocupação': 'Renegocie no fim do contrato (mostre o histórico de pontualidade). Avalie alternativas: home office, espaço compartilhado/coworking, ponto menor com mais delivery. Em alguns segmentos, mudar de bairro corta 30-50% do aluguel.',
    'Aluguel/Ponto': 'O ponto comercial precisa gerar receita proporcional. Calcule sua "venda por m²/mês". Se baixa, ou aumenta movimento ou muda de ponto.',
    'Energia/Gás/Água': 'Audite equipamentos antigos (geladeira, freezer, fritadeira). Substituição de 1 freezer antigo paga em 18-24 meses. LED em todas as lâmpadas. Tarifa branca pode ajudar dependendo do horário de operação.',
    'Energia/Água': 'LED em todas as luzes, secadores eficientes, monitorar consumo de água (lavatório). Em estados com tarifa branca, avaliar horários de operação.',
    'Energia': 'Audite freezers/refrigeradores antigos — costumam ser vilões silenciosos. Substituição se paga em 18-24 meses. LED em todas as lâmpadas.',
    'Marketing': 'Defina ROI mínimo: cada R$ 1 investido deve retornar R$ 3 ou mais. Se está abaixo, pause campanhas ruins. Google Meu Negócio + Instagram orgânico têm ROI altíssimo se bem geridos.',
    'Taxa Maquininha': 'Renegocie taxas com sua adquirente (Stone/PagSeguro/Cielo brigam por isso). Estimule PIX (taxa zero ou baixíssima). Cuidado com antecipação de recebíveis: taxa real pode chegar a 4-5% a.m.',
    'Embalagens': 'Compre em volume direto do fornecedor (corte intermediários). Padronize embalagens — variedade demais aumenta estoque parado. Avalie se a embalagem reflete o ticket: cliente paga premium, embalagem precisa acompanhar.',
    'Tráfego Pago': 'Calcule CAC (custo de aquisição) e LTV (lifetime value). LTV/CAC < 3x = pare e reformule funil. Teste 2-3 criativos por semana, mate os que não performam em 5-7 dias. Audiências segmentadas batem audiências amplas.',
    'Plataformas': 'Avalie migrar para plataforma com taxa menor se volume justificar. Hotmart, Eduzz e Kiwify têm condições diferentes — vale renegociar acima de R$50k/mês.',
    'Ferramentas/SaaS': 'Audite assinaturas trimestralmente. Cancele o que não usa há 30 dias. Negocie planos anuais (15-20% desconto). Versão grátis cobre 80% das necessidades de quem está começando.',
    'Equipe/Freelancers': 'Diferencie tarefa pontual (freelancer por projeto) de função recorrente (CLT/contratado). Erro caro: contratar fixo o que era pontual. Plataformas como Workana/Fiverr cortam 30-50% do custo vs agência.',
    'Impostos': 'Conferir se está no regime tributário ótimo. MEI (até R$81k/ano) é o mais barato mas restrito. Acima disso, Simples Nacional Anexo III (6%) vs Anexo V (15.5%) faz diferença brutal — folha > 28% do faturamento sobe pro Anexo III.',
    'Impostos/MEI': 'DAS-MEI fixo (~R$76-87/mês). Ao ultrapassar R$81k/ano (R$6.750/mês), precisa migrar pra ME/Simples — planeje contábil 6 meses antes pra evitar multa.',
    'Materiais/Insumos': 'Compre em volume com 2-3 fornecedores rotativos. Estoque parado é dinheiro parado: gire em até 30 dias. Para materiais que o cliente não vê (parafuso, fita), marca genérica corta custo sem afetar valor percebido.',
    'Transporte': 'Calcule custo real por km (combustível + desgaste + manutenção + seguro / km mês). Cobre o ciente por km a partir desse número + margem.',
    'Ferramentas': 'Compre por necessidade real, não por desejo. Aluguel de equipamento caro sai mais barato pra uso pontual. Mantenha lista de depreciação — sua "ferramenta nova" virou custo no mês 25.',
    'Mercadoria/CMV': 'Negocie volume + prazo com fornecedores principais. Itens com baixo giro: pare de repor ou venda em queima. Análise ABC: 20% dos produtos geram 80% da receita — foque neles.',
  };
  const acao = acoes[benchKey];
  if (!acao) return 'Compare seus números mensalmente. Foque na maior categoria primeiro — pequenas reduções nos grandes itens têm mais impacto que grandes esforços nos pequenos.';
  return severidade === 'critico' ? `🔴 Ação urgente. ${acao}` : acao;
}

/**
 * Regra 4: RECEITA CONCENTRADA
 * Detecta quando 1 fonte de receita (categoria) representa > 70% do total.
 */
function regraConcentracaoReceita({ totalR, recPorCat }, bench, segLabel) {
  if (totalR === 0 || !recPorCat || recPorCat.length === 0) return null;
  const [topCat, topVal] = recPorCat[0];
  const pctTop = (topVal / totalR) * 100;
  if (pctTop < 70) return null;

  let severidade = 'alerta';
  if (pctTop > 85) severidade = 'critico';

  return {
    id: 'receita_concentrada',
    tipo: 'concentracao',
    severidade,
    area: 'Concentração de Receita',
    diagnostico: `${fmtPct(pctTop)} da sua receita vem de uma única fonte ("${topCat}"). Em ${segLabel}, alta concentração é risco operacional sério.`,
    acao: 'Comece a desenvolver 1-2 fontes complementares já no próximo trimestre. Não precisa substituir a principal — só ter alternativa pronta caso ela caia. Diversificar reduz risco de quebra súbita.',
    impacto: null,
  };
}

/**
 * Regra 5: DESPESAS FINANCEIRAS ALTAS
 * Taxas + juros consumindo > 5% da receita.
 */
function regraDespesasFinanceiras({ totalR, despPorCat }, bench, segLabel) {
  if (totalR === 0) return null;
  const tipos_financeiros = ['taxa_card', 'taxa_app'];
  let totalFin = 0;
  let categorias = [];

  despPorCat.forEach(([nome, val]) => {
    const tipo = detectarTipoCategoria(nome);
    const norm = normalizar(nome);
    if (tipos_financeiros.includes(tipo) || norm.includes('juros') || norm.includes('financiamento') || norm.includes('emprestimo')) {
      totalFin += val;
      categorias.push(nome);
    }
  });

  const pct = (totalFin / totalR) * 100;
  if (pct < 5) return null;

  let severidade = 'alerta';
  if (pct > 8) severidade = 'critico';

  return {
    id: 'despesas_financeiras_altas',
    tipo: 'financeiras',
    severidade,
    area: 'Despesas Financeiras',
    diagnostico: `Taxas, juros e custos financeiros somam ${fmtPct(pct)} do faturamento (${categorias.join(', ')}). Em qualquer segmento, acima de 5% já compromete margem.`,
    acao: 'Renegocie taxas da maquininha (mercado é competitivo, vale ligar pra 3 adquirentes). Quitar dívida cara primeiro, mesmo que seja menor. Capital de giro caro pode estar virando juros sobre juros — reestruture com banco se necessário.',
    impacto: null,
  };
}

/* ══════════════════════════════════════════════════════════════
   MOTOR DE AVALIAÇÃO
   Recebe dados consolidados + benchmark do segmento.
   Devolve lista ordenada de insights por severidade.
   ══════════════════════════════════════════════════════════════ */
const ORDEM_SEVERIDADE = { critico: 0, alerta: 1, saudavel: 2, sem_dados: 3 };

export function avaliar(dados, bench, segLabel) {
  const insights = [];

  const r1 = regraMargem(dados, bench, segLabel);            if (r1) insights.push(r1);
  const r2 = regraCustoTotal(dados, bench, segLabel);        if (r2) insights.push(r2);
  insights.push(...regraCategorias(dados, bench, segLabel));
  const r4 = regraConcentracaoReceita(dados, bench, segLabel); if (r4) insights.push(r4);
  const r5 = regraDespesasFinanceiras(dados, bench, segLabel); if (r5) insights.push(r5);

  // Ordena: crítico primeiro, depois alerta. Dentro de cada nível, mantém ordem original.
  insights.sort((a, b) => ORDEM_SEVERIDADE[a.severidade] - ORDEM_SEVERIDADE[b.severidade]);

  return insights;
}
