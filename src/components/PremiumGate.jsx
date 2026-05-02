"use client";
import { C, FN, MN, btnGradient, btnGradientBlue, btnGradientAmber, btnSecondary } from "../lib/theme";

const PREMIUM_PAGE_URL = "/premium";

const CONTEXTS = {
  comparador: {
    accent: C.blue,
    button: btnGradientBlue,
    badge: "PREMIUM",
    title: "Comparação sem limites",
    subtitle: "Veja padrões invisíveis para investidores comuns.",
    bullets: [
      ["Comparações avançadas", "Compare múltiplos ativos e indicadores com profundidade profissional."],
      ["Carteira estratégica", "Monte e simule carteiras otimizadas com visão de longo prazo."],
      ["Diagnóstico patrimonial", "Entenda pontos fortes e oportunidades da sua carteira."],
      ["Insights premium", "Receba análises exclusivas que vão além do óbvio."],
    ],
  },
  batalha: {
    accent: C.blue,
    button: btnGradientBlue,
    badge: "PREMIUM",
    title: "Mais batalhas, mais clareza",
    subtitle: "Compare sem travas quando estiver decidindo onde colocar o próximo aporte.",
    bullets: [
      ["Batalhas ilimitadas", "Compare ativos sem esperar a janela gratuita renovar."],
      ["Mais ativos por análise", "Amplie a visão antes de tomar uma decisão."],
      ["Histórico de decisões", "Acompanhe suas comparações anteriores."],
      ["Compartilhamento premium", "Transforme análises em cards mais profissionais."],
    ],
  },
  rendaFixa: {
    accent: C.blue,
    button: btnGradientBlue,
    badge: "PREMIUM",
    title: "Renda fixa sem achismo",
    subtitle: "Compare títulos, prazos, liquidez e retorno líquido com mais precisão.",
    bullets: [
      ["Comparações ilimitadas", "CDB, LCI, LCA, Tesouro e outros títulos lado a lado."],
      ["Cenários macro", "Entenda o impacto de Selic, inflação e prazo."],
      ["Rentabilidade líquida", "Veja o que realmente sobra depois das condições."],
      ["Decisão mais objetiva", "Menos promessa comercial, mais critério."],
    ],
  },
  carteira: {
    accent: C.blue,
    button: btnGradientBlue,
    badge: "PREMIUM",
    title: "Carteira com visão profissional",
    subtitle: "Simule alocações completas e enxergue sua estratégia como patrimônio.",
    bullets: [
      ["Carteira sem limites", "Adicione mais ativos e veja a alocação real."],
      ["Estratégia por classe", "Renda fixa, FIIs, ações e outros ativos no mesmo mapa."],
      ["Evolução patrimonial", "Acompanhe crescimento e composição."],
      ["Mais clareza", "Decida com visão de conjunto, não no impulso."],
    ],
  },
  gestaoAtiva: {
    accent: C.accent,
    button: btnGradient,
    badge: "ACESSO PREMIUM",
    title: "Controle antes da liberdade",
    subtitle: "Entenda seus gastos, elimine desperdícios e construa uma vida financeira saudável.",
    bullets: [
      ["Categorias ilimitadas", "Classifique todas as despesas reais do seu mês."],
      ["Diagnóstico financeiro", "Veja onde o dinheiro vaza e receba ações recomendadas."],
      ["Relatórios mensais", "Acompanhe sua evolução com relatórios completos."],
      ["Planejamento estratégico", "Defina metas, acompanhe objetivos e conquiste liberdade."],
    ],
  },
  diagnostico: {
    accent: C.accent,
    button: btnGradient,
    badge: "ACESSO PREMIUM",
    title: "Veja exatamente onde melhorar",
    subtitle: "O diagnóstico completo mostra o problema, a causa provável, a ação recomendada e o impacto estimado em reais.",
    bullets: [
      ["Diagnóstico financeiro completo", "Entenda o que está travando seu resultado."],
      ["Ações por categoria", "Receba recomendações práticas para ajustar o mês."],
      ["Economia estimada", "Veja o impacto potencial em reais."],
      ["Comparação com referência", "Tenha uma régua para avaliar sua situação."],
    ],
  },
  meuNegocio: {
    accent: C.orange,
    button: btnGradientAmber,
    badge: "ACESSO PREMIUM",
    title: "Caixa saudável, negócio forte",
    subtitle: "Tenha clareza do seu negócio, aumente margens e tome decisões com segurança.",
    bullets: [
      ["Diagnóstico do negócio", "Veja a saúde financeira da sua empresa com análise completa."],
      ["Benchmark do segmento", "Compare seus indicadores com empresas do seu segmento."],
      ["Estimativa de economia", "Descubra oportunidades reais para aumentar seu lucro."],
      ["Estratégias de margem", "Receba recomendações práticas para melhorar seus resultados."],
    ],
  },
  saudeFinanceira: {
    accent: C.accent,
    button: btnGradient,
    badge: "ACESSO PREMIUM",
    title: "Clareza financeira muda tudo",
    subtitle: "Você já tem o mapa. O Premium transforma esse mapa em plano de ação com direções concretas, ajustes e projeção do seu futuro.",
    bullets: [
      ["Relatório completo", "Veja o diagnóstico detalhado: causa, impacto em reais e ação recomendada para cada ponto."],
      ["Extrato Futuro ajustável", "Simule quitações e ajuste investimentos mês a mês para ver como suas decisões mudam o futuro."],
      ["Projeção de independência", "Visualize seu patrimônio e renda mensal estimada em 1, 5, 10 e até 35 anos."],
      ["Estratégia de quitação", "O app ordena suas dívidas pelo melhor caminho para liberar fluxo de caixa mais rápido."],
    ],
  },
  default: {
    accent: C.accent,
    button: btnGradient,
    badge: "ACESSO PREMIUM",
    title: "Use o comparainvest sem travas",
    subtitle: "Desbloqueie recursos avançados e acompanhe suas decisões com mais clareza.",
    bullets: [
      ["Comparações ilimitadas", "Analise sem restrições."],
      ["Ferramentas completas", "Use todos os módulos do app."],
      ["Relatórios premium", "Acompanhe evolução com profundidade."],
      ["Novas features", "Acesse melhorias futuras incluídas."],
    ],
  },
};

function BenefitItem({ item, accent }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        padding: "13px 14px",
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${C.border}`,
        borderLeft: `2px solid ${accent}`,
        borderRadius: 13,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${accent}12`,
          border: `1px solid ${accent}26`,
          color: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: MN,
          fontSize: 13,
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        ✓
      </div>
      <div style={{ textAlign: "left" }}>
        <div style={{ color: C.white, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item[0]}</div>
        <div style={{ color: C.textDim, fontSize: 12.5, lineHeight: 1.45 }}>{item[1]}</div>
      </div>
    </div>
  );
}

export default function PremiumGate({ onClose, context = "default", message }) {
  const copy = CONTEXTS[context] || CONTEXTS.default;
  const accent = copy.accent;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(3,7,12,0.78)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 18,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 440,
          maxHeight: "90vh",
          overflowY: "auto",
          background: `radial-gradient(circle at top, ${accent}18, transparent 36%), linear-gradient(180deg, rgba(10,19,30,0.985), rgba(5,10,16,0.99))`,
          border: `1px solid ${C.borderLight}`,
          borderRadius: 24,
          padding: "30px 24px 22px",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 34px 100px rgba(0,0,0,0.52)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: "absolute",
            right: 14,
            top: 12,
            background: "rgba(255,255,255,0.035)",
            border: `1px solid ${C.border}`,
            color: C.textDim,
            width: 30,
            height: 30,
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, border: `1px solid ${accent}55`, color: accent, borderRadius: 9, padding: "5px 10px", fontSize: 10, fontFamily: MN, fontWeight: 800, letterSpacing: "0.08em", marginBottom: 18 }}>
          ★ {copy.badge}
        </div>

        <h3 style={{ fontFamily: FN, fontSize: "clamp(24px, 6vw, 31px)", lineHeight: 1.08, fontWeight: 650, letterSpacing: "-0.035em", color: C.white, margin: "0 0 12px" }}>
          {copy.title}
        </h3>

        <p style={{ fontSize: 14, color: C.textDim, lineHeight: 1.65, margin: "0 auto 22px", maxWidth: 360 }}>
          {message || copy.subtitle}
        </p>

        <div style={{ display: "grid", gap: 9, marginBottom: 20 }}>
          {copy.bullets.map((item) => <BenefitItem key={item[0]} item={item} accent={accent} />)}
        </div>

        <a href={PREMIUM_PAGE_URL} style={{ textDecoration: "none", display: "block" }}>
          <button style={{ ...copy.button, width: "100%", marginBottom: 10 }}>
            Ver planos <span style={{ float: "right" }}>→</span>
          </button>
        </a>

        <button onClick={onClose} style={{ ...btnSecondary, width: "100%", minHeight: 46, color: C.textDim }}>
          Agora não
        </button>
      </div>
    </div>
  );
}
