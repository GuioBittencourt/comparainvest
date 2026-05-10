"use client";
import { C, FN, MN } from "../lib/theme";

const PREMIUM_PAGE_URL = "/premium";

const CONTEXTS = {
  comparador: {
    accent: C.gold || C.blue,
    badge: "ANÁLISE PREMIUM",
    title: "Compare sem limites",
    subtitle: "Veja mais ativos, mais indicadores e mais combinações para decidir com clareza.",
    bullets: [
      ["Comparações avançadas", "Compare múltiplos ativos e indicadores com profundidade profissional."],
      ["Carteira estratégica", "Monte e simule carteiras com visão de longo prazo."],
      ["Diagnóstico patrimonial", "Entenda pontos fortes e oportunidades da sua carteira."],
      ["Insights premium", "Receba análises que vão além do óbvio."],
    ],
  },
  batalha: {
    accent: C.gold || C.blue,
    badge: "BATALHA PREMIUM",
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
    accent: C.gold || C.blue,
    badge: "RENDA FIXA PREMIUM",
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
    accent: C.gold || C.blue,
    badge: "CARTEIRA PREMIUM",
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
    accent: C.gold || C.accent,
    badge: "CONTROLE PREMIUM",
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
    accent: C.gold || C.accent,
    badge: "DIAGNÓSTICO PREMIUM",
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
    accent: C.gold || C.orange,
    badge: "NEGÓCIO PREMIUM",
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
    accent: C.gold || C.accent,
    badge: "SAÚDE FINANCEIRA PREMIUM",
    title: "Clareza financeira muda tudo",
    subtitle: "Você já tem o mapa. O Premium transforma esse mapa em plano de ação com direção concreta.",
    bullets: [
      ["Relatório completo", "Veja causa, impacto em reais e ação recomendada para cada ponto."],
      ["Extrato Futuro ajustável", "Simule quitações e investimentos mês a mês."],
      ["Projeção de independência", "Visualize patrimônio e renda mensal estimada de 1 a 35 anos."],
      ["Estratégia de quitação", "O app ordena suas dívidas para liberar fluxo de caixa mais rápido."],
    ],
  },
  default: {
    accent: C.gold || C.accent,
    badge: "COMPARAINVEST PREMIUM",
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
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 13px", background: "rgba(255,255,255,0.028)", border: `1px solid ${C.border}`, borderLeft: `2px solid ${accent}`, borderRadius: 14 }}>
      <div style={{ width: 32, height: 32, borderRadius: 12, background: "rgba(200,164,93,0.075)", border: `1px solid ${C.borderGold || "rgba(200,164,93,0.24)"}`, color: accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MN, fontSize: 12, fontWeight: 900, flexShrink: 0 }}>✓</div>
      <div style={{ textAlign: "left" }}>
        <div style={{ color: C.white, fontSize: 13.5, fontWeight: 800, marginBottom: 3 }}>{item[0]}</div>
        <div style={{ color: C.textDim, fontSize: 12, lineHeight: 1.45 }}>{item[1]}</div>
      </div>
    </div>
  );
}

export default function PremiumGate({ onClose, context = "default", message }) {
  const copy = CONTEXTS[context] || CONTEXTS.default;
  const accent = copy.accent || C.gold || C.accent;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(2, 7, 13, 0.78)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 470, maxHeight: "90vh", overflowY: "auto", background: "linear-gradient(135deg, rgba(8,27,51,0.985) 0%, rgba(6,16,25,0.99) 58%, rgba(12,24,37,0.985) 100%)", border: `1px solid ${C.borderGold || "rgba(200,164,93,0.26)"}`, borderRadius: 26, padding: "28px 22px 20px", textAlign: "center", position: "relative", boxShadow: "0 34px 110px rgba(0,0,0,0.58)", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", right: -32, top: -28, width: 170, height: 170, backgroundImage: "url('/icon-512.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", opacity: 0.07, filter: "grayscale(1) blur(0.2px)", transform: "rotate(-7deg)", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 92% 8%, rgba(200,164,93,0.14), transparent 36%), radial-gradient(circle at 4% 0%, rgba(19,185,129,0.05), transparent 30%)", pointerEvents: "none" }} />
        <button onClick={onClose} aria-label="Fechar" style={{ position: "absolute", right: 14, top: 12, background: "rgba(255,255,255,0.035)", border: `1px solid ${C.border}`, color: C.textDim, width: 31, height: 31, borderRadius: 999, cursor: "pointer", zIndex: 2 }}>×</button>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, border: `1px solid ${C.borderGold || "rgba(200,164,93,0.34)"}`, background: "rgba(200,164,93,0.075)", color: accent, borderRadius: 999, padding: "6px 11px", fontSize: 10, fontFamily: MN, fontWeight: 900, letterSpacing: "0.1em", marginBottom: 17 }}>◆ {copy.badge}</div>
          <h3 style={{ fontFamily: FN, fontSize: "clamp(24px, 6vw, 31px)", lineHeight: 1.08, fontWeight: 850, letterSpacing: "-0.045em", color: C.white, margin: "0 0 12px" }}>{copy.title}</h3>
          <p style={{ fontSize: 13.5, color: C.textDim, lineHeight: 1.65, margin: "0 auto 20px", maxWidth: 370 }}>{message || copy.subtitle}</p>
          <div style={{ display: "grid", gap: 9, marginBottom: 20 }}>{copy.bullets.map((item) => <BenefitItem key={item[0]} item={item} accent={accent} />)}</div>
          <a href={PREMIUM_PAGE_URL} style={{ textDecoration: "none", display: "block" }}>
            <button style={{ width: "100%", minHeight: 45, borderRadius: 999, border: `1px solid ${C.borderGold || "rgba(200,164,93,0.34)"}`, background: "rgba(200,164,93,0.085)", color: C.gold2 || C.gold || C.yellow, fontFamily: MN, fontSize: 12, fontWeight: 900, letterSpacing: "0.2px", cursor: "pointer", marginBottom: 10, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}>Ver planos <span style={{ float: "right", paddingRight: 3 }}>→</span></button>
          </a>
          <button onClick={onClose} style={{ width: "100%", minHeight: 43, borderRadius: 999, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.026)", color: C.textDim, fontFamily: FN, fontSize: 12.5, cursor: "pointer" }}>Agora não</button>
        </div>
      </div>
    </div>
  );
}
