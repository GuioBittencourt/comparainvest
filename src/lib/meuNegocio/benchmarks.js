/**
 * benchmarks.js
 *
 * Banco de referências reais por segmento.
 *
 * MARGEM LÍQUIDA — % do faturamento que sobra como lucro líquido após TODAS as despesas.
 * CUSTOS TOTAIS — % do faturamento consumido por todas as despesas (1 - margem).
 * CATEGORIAS DE CUSTO — referência por categoria específica (% sobre o faturamento).
 *
 * Cada métrica tem 3 zonas:
 *   saudavel: até este valor é considerado bom
 *   alerta:   entre saudavel e alerta = atenção (precisa monitorar)
 *   critico:  acima deste valor = ação urgente
 *
 * fonte: link/referência primária (Sebrae, Abrasel, Cebrap, ABRAS etc)
 *        Quando categoria foi inferida do conhecimento geral do segmento
 *        sem referência direta, marcamos com "estimativa" no campo nota.
 *
 * IMPORTANTE: estes valores são REFERÊNCIAS DE MERCADO. O sistema NUNCA
 * deve apresentá-los como verdade absoluta — apenas como ponto de partida
 * para reflexão do empreendedor.
 */

export const BENCHMARKS = {

  // ═══════════════════════════════════════════════════════════════
  // ENTREGAS / MOTORISTA DE APP
  // Fontes: Cebrap 2023 (renda líquida média), Incla/Portal6 2024-2026
  //         (combustível 20-30%), iFood institucional (taxas 12-23%)
  // ═══════════════════════════════════════════════════════════════
  entregas: {
    label: "Entregas / Motorista de App",
    fonte: "Cebrap 2023, iFood Institucional, Incla 2024",
    margemLiquida: { saudavel: 30, alerta: 20, critico: 10 },
    custoTotal:    { saudavel: 70, alerta: 80, critico: 90 },
    contexto: "Margem fica espremida entre combustível volátil e taxa de app fixa. Reserva técnica para troca de pneus/óleo a cada 10 mil km é crucial. Diversificar plataformas reduz risco de bloqueio repentino.",
    categorias: {
      "Combustível":      { saudavel: 25, alerta: 32, critico: 40, nota: "Cebrap/Incla: combustível costuma ser 20-30% dos ganhos brutos." },
      "Manutenção":       { saudavel: 8,  alerta: 12, critico: 18, nota: "Inclui óleo, pneus, freios, revisões. Estimativa de mercado." },
      "Taxa do App":      { saudavel: 25, alerta: 30, critico: 35, nota: "iFood Plano Básico: 12% + mensalidade R$110. Plano Entrega: 23% + R$150. Em alguns casos motoboy paga taxa indireta via repasse menor." },
      "Seguro/IPVA":      { saudavel: 5,  alerta: 8,  critico: 12, nota: "Estimativa de mercado para moto/carro popular." },
      "Alimentação fora": { saudavel: 5,  alerta: 8,  critico: 12, nota: "Estimativa: rota longa força almoço/lanche fora." },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // ALIMENTAÇÃO (lanchonete/restaurante/marmitaria/delivery próprio)
  // Fontes: Abrasel via Sebrae (CMV 25-40%), Stone, F360, OlaClick
  // ═══════════════════════════════════════════════════════════════
  alimentacao: {
    label: "Alimentação",
    fonte: "Abrasel, Sebrae RS, Stone 2026",
    margemLiquida: { saudavel: 15, alerta: 8,  critico: 3  },
    custoTotal:    { saudavel: 85, alerta: 92, critico: 97 },
    contexto: "CMV (Custo de Mercadoria Vendida = ingredientes/insumos) é o principal indicador. Acima de 35% já liga alerta. Ficha técnica por prato e controle de desperdício são as duas alavancas mais relevantes. Em delivery, taxa do app pode chegar a 23%, comprimindo a margem.",
    categorias: {
      "Ingredientes/CMV":  { saudavel: 30, alerta: 35, critico: 40, nota: "Abrasel/Sebrae: CMV ideal 25-40%. Acima de 35% costuma indicar desperdício, precificação ou compras mal negociadas." },
      "Folha/Pessoal":     { saudavel: 25, alerta: 30, critico: 35, nota: "Estimativa: cozinha + atendimento. Para operações com chef especializado pode ser maior." },
      "Aluguel/Ocupação":  { saudavel: 8,  alerta: 12, critico: 18, nota: "Estimativa: ponto comercial pesa. Dark kitchen reduz drasticamente." },
      "Taxa Delivery":     { saudavel: 12, alerta: 18, critico: 23, nota: "iFood Básico 12% / Entrega 23%. Diversificar canais (próprio + outros) ajuda." },
      "Energia/Gás/Água":  { saudavel: 4,  alerta: 6,  critico: 10, nota: "Estimativa: cozinha consome muito. Equipamentos antigos elevam." },
      "Embalagens":        { saudavel: 3,  alerta: 5,  critico: 8,  nota: "Estimativa: alta em delivery puro." },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // BELEZA (salão/barbearia/manicure/estética)
  // Fontes: Sebrae (Beleza/Bem-Estar), Negócios Brasil 2025 (lucro 20-30%)
  // ═══════════════════════════════════════════════════════════════
  beleza: {
    label: "Beleza / Estética",
    fonte: "Sebrae Beleza, Negócios Brasil 2025",
    margemLiquida: { saudavel: 25, alerta: 15, critico: 8  },
    custoTotal:    { saudavel: 75, alerta: 85, critico: 92 },
    contexto: "Negócios bem geridos operam com 20-30% de lucro. O ponto de equilíbrio costuma ser ~80% dos custos. Receita recorrente (assinaturas, pacotes, planos) eleva muito a saúde financeira. Comissão de profissionais e desperdício de produtos são as duas armadilhas mais comuns.",
    categorias: {
      "Comissão/Pessoal":    { saudavel: 35, alerta: 45, critico: 55, nota: "Frizzar/Sebrae: profissionais geralmente recebem 40-60% por serviço. Vai depender se é regime de aluguel de cadeira, comissão pura ou CLT." },
      "Produtos/Insumos":    { saudavel: 12, alerta: 18, critico: 25, nota: "Sebrae: tintura, esmalte, descartáveis. Desperdício é o principal elevador." },
      "Aluguel/Ocupação":    { saudavel: 10, alerta: 15, critico: 22, nota: "Sebrae lista aluguel + IPTU como custo fixo principal." },
      "Energia/Água":        { saudavel: 4,  alerta: 7,  critico: 10, nota: "Estimativa: secadores e luzes consomem moderadamente." },
      "Marketing":           { saudavel: 5,  alerta: 8,  critico: 12, nota: "Estimativa: tráfego pago para captação cresceu muito." },
      "Taxa Maquininha":     { saudavel: 2.5,alerta: 4,  critico: 6,  nota: "Estimativa: 1.5-3% débito, 3-5% crédito. Renegociável." },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // SERVIÇOS GERAIS (autônomo: pintor, eletricista, encanador, jardineiro,
  //                  diarista, técnico de manutenção, chaveiro etc)
  // Fontes: Sebrae (margem serviços 20%), Calculadora Brasil 2026
  // ═══════════════════════════════════════════════════════════════
  servicos_gerais: {
    label: "Serviços Gerais",
    fonte: "Sebrae (média serviços 20%), referência mercado autônomo",
    margemLiquida: { saudavel: 30, alerta: 20, critico: 10 },
    custoTotal:    { saudavel: 70, alerta: 80, critico: 90 },
    contexto: "Sebrae aponta margem média de 20% para serviços. O grande risco aqui é não computar custo da hora real (deslocamento + tempo improdutivo + ferramentas). Quem cobra só pelas horas trabalhadas perde 20-30% do valor real.",
    categorias: {
      "Materiais/Insumos":   { saudavel: 25, alerta: 35, critico: 45, nota: "Estimativa: varia muito por tipo de serviço. Pintor com tinta inclusa difere de eletricista que cobra material à parte." },
      "Transporte":          { saudavel: 8,  alerta: 12, critico: 18, nota: "Estimativa: combustível + desgaste do veículo. Calcular por km rodado." },
      "Ferramentas":         { saudavel: 5,  alerta: 8,  critico: 12, nota: "Estimativa: depreciação + reposição. Costuma ser subestimado." },
      "Marketing":           { saudavel: 4,  alerta: 7,  critico: 12, nota: "Estimativa: tráfego pago + Google Meu Negócio para captação." },
      "Impostos/MEI":        { saudavel: 6,  alerta: 8,  critico: 12, nota: "DAS-MEI ~R$76-87/mês fixo. Como % varia conforme faturamento. Acima R$81k/ano sai do MEI." },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // COMÉRCIO (loja física pequena, mercadinho, papelaria, conveniência)
  // Fontes: Sebrae (10-15% comércio), Cielo (5-10% varejo BR), ABRAS
  //         (1-3% supermercado), Nextar (10-20%)
  // ═══════════════════════════════════════════════════════════════
  comercio: {
    label: "Comércio",
    fonte: "Sebrae, Cielo Varejo, ABRAS",
    margemLiquida: { saudavel: 12, alerta: 6,  critico: 2  },
    custoTotal:    { saudavel: 88, alerta: 94, critico: 98 },
    contexto: "Comércio popular trabalha com margens enxertas (Sebrae: 10-15%; Cielo: 5-10% no varejo BR). Margem bruta de 15-25% é comum, mas custos operacionais consomem boa parte. Volume é o segredo. Supermercados extremos operam com 1-3%.",
    categorias: {
      "Mercadoria/CMV":      { saudavel: 70, alerta: 78, critico: 85, nota: "Cielo: margem bruta varejo 15-30%. Logo CMV típico 70-85%." },
      "Aluguel/Ponto":       { saudavel: 6,  alerta: 10, critico: 16, nota: "Estimativa: ponto comercial bem localizado pesa." },
      "Folha/Pessoal":       { saudavel: 8,  alerta: 13, critico: 20, nota: "Estimativa: caixa, repositor, balconista. Pequeno comércio às vezes opera só com proprietário." },
      "Energia":             { saudavel: 2,  alerta: 4,  critico: 7,  nota: "Estimativa: sobe muito se tiver muito refrigerador (mercadinho/conveniência)." },
      "Taxa Maquininha":     { saudavel: 2.5,alerta: 4,  critico: 6,  nota: "Estimativa: cliente cada vez mais paga em cartão/PIX. PIX é grátis." },
      "Marketing":           { saudavel: 3,  alerta: 5,  critico: 9,  nota: "Estimativa: panfletagem + redes sociais para clientela do bairro." },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // DIGITAL (infoprodutor, freelancer remoto, dropshipping, SaaS solo)
  // Fontes: Entrega Digital 2025 (margem 80%+), Soluzione (Lucro Presumido)
  // ═══════════════════════════════════════════════════════════════
  digital: {
    label: "Digital / Infoprodutor",
    fonte: "Entrega Digital 2025, Soluzione Negócios Digitais",
    margemLiquida: { saudavel: 50, alerta: 30, critico: 15 },
    custoTotal:    { saudavel: 50, alerta: 70, critico: 85 },
    contexto: "Modelo de negócio com maior margem possível: sem estoque, sem aluguel, alta escalabilidade (Entrega Digital: margens podem passar de 80%). Risco principal: tráfego pago consumindo a margem se ROI não for monitorado. Plataformas (Hotmart, Eduzz, Kiwify) cobram 7-10%. Infraestrutura é barata.",
    categorias: {
      "Tráfego Pago":        { saudavel: 20, alerta: 35, critico: 50, nota: "Estimativa de mercado: principal alavanca e principal armadilha. ROAS abaixo de 2x já é vermelho." },
      "Plataformas":         { saudavel: 8,  alerta: 12, critico: 18, nota: "Hotmart/Eduzz/Kiwify cobram 7-10%. Soma com gateway de pagamento (~3%)." },
      "Ferramentas/SaaS":    { saudavel: 5,  alerta: 10, critico: 15, nota: "Estimativa: hospedagem, e-mail marketing, automação. Tende a inflar com o tempo." },
      "Equipe/Freelancers":  { saudavel: 10, alerta: 20, critico: 35, nota: "Estimativa: editor de vídeo, designer, copywriter, gestor de tráfego. Cresce conforme escala." },
      "Impostos":            { saudavel: 6,  alerta: 10, critico: 16, nota: "MEI 5%, Simples ~6-15.5%, Lucro Presumido ~13.3% (ebook) ou ~16.3% (curso/mentoria)." },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // OUTRO — fallback genérico
  // Fontes: Sebrae (médias setoriais), Cielo (varejo BR)
  // ═══════════════════════════════════════════════════════════════
  outro: {
    label: "Outro",
    fonte: "Sebrae (médias gerais)",
    margemLiquida: { saudavel: 20, alerta: 10, critico: 5  },
    custoTotal:    { saudavel: 80, alerta: 90, critico: 95 },
    contexto: "Sem benchmark específico para este segmento. Usamos a referência média do Sebrae para serviços (~20%). Recomendamos cadastrar com mais precisão o segmento principal para diagnóstico mais afinado.",
    categorias: {
      "Custos Operacionais": { saudavel: 60, alerta: 75, critico: 85, nota: "Faixa genérica. Inclua aqui o principal grupo de despesas." },
      "Folha/Pessoal":       { saudavel: 20, alerta: 30, critico: 40, nota: "Estimativa generalista." },
      "Aluguel/Ocupação":    { saudavel: 8,  alerta: 14, critico: 20, nota: "Estimativa generalista." },
      "Marketing":           { saudavel: 5,  alerta: 8,  critico: 12, nota: "Estimativa generalista." },
      "Impostos":            { saudavel: 6,  alerta: 10, critico: 16, nota: "Depende do regime tributário." },
    },
  },
};

/**
 * Helper: classifica um valor em uma das 3 zonas com base nos thresholds.
 * Para métricas onde MAIOR é melhor (margem):
 *   >= saudavel  → 'saudavel'
 *   >= alerta    → 'alerta'
 *   <  alerta    → 'critico'
 * Para métricas onde MENOR é melhor (custos):
 *   <= saudavel  → 'saudavel'
 *   <= alerta    → 'alerta'
 *   >  alerta    → 'critico'
 */
export function classificar(valor, thresholds, maiorMelhor = false) {
  if (valor == null || isNaN(valor)) return 'sem_dados';

  if (maiorMelhor) {
    if (valor >= thresholds.saudavel) return 'saudavel';
    if (valor >= thresholds.alerta)   return 'alerta';
    return 'critico';
  } else {
    if (valor <= thresholds.saudavel) return 'saudavel';
    if (valor <= thresholds.alerta)   return 'alerta';
    return 'critico';
  }
}
