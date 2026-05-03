"use client";
import { C, MN, FN } from "../lib/theme";

const CAMPAIGNS = {
  "home-top": {
    kicker: "Central Comparainvest",
    title: "Invista com mais clareza.",
    desc: "Compare ativos, organize decisões e transforme dados em estratégia.",
    cta: "Explorar",
    tone: "gold",
  },
  "home-bottom": {
    kicker: "Saúde Financeira",
    title: "Veja o futuro antes de decidir.",
    desc: "Monte seu mapa financeiro e entenda onde o dinheiro está travando.",
    cta: "Conhecer",
    tone: "blue",
  },
  "edu-top": {
    kicker: "Controle pessoal",
    title: "Organização antes da liberdade.",
    desc: "A clareza do mês é o primeiro passo para sobrar dinheiro.",
    cta: "Ver ferramenta",
    tone: "blue",
  },
  "edu-bottom": {
    kicker: "Método financeiro",
    title: "Construa patrimônio com rotina.",
    desc: "Pequenos ajustes mensais mudam o ano inteiro.",
    cta: "Avançar",
    tone: "gold",
  },
  "carteira-middle": {
    kicker: "Carteira inteligente",
    title: "Sua alocação precisa fazer sentido.",
    desc: "Compare, simule e ajuste sua carteira com mais consciência.",
    cta: "Comparar",
    tone: "green",
  },
  "carteira-bottom": {
    kicker: "Próximo passo",
    title: "Transforme carteira em plano.",
    desc: "Use dados para tomar decisões mais consistentes.",
    cta: "Abrir",
    tone: "gold",
  },
  "rf-bottom": {
    kicker: "Renda fixa",
    title: "Taxa boa é taxa entendida.",
    desc: "Compare prazos, liquidez e rendimento real antes de investir.",
    cta: "Comparar",
    tone: "blue",
  },
  "comparator-bottom": {
    kicker: "Análise estratégica",
    title: "Não compare só preço.",
    desc: "Indicadores ajudam a enxergar qualidade, risco e eficiência.",
    cta: "Ver análise",
    tone: "gold",
  },
  "gestao-bottom": {
    kicker: "Gestão ativa",
    title: "O vazamento aparece nos detalhes.",
    desc: "Acompanhe categorias e veja onde ajustar primeiro.",
    cta: "Organizar",
    tone: "green",
  },
  "negocio-bottom": {
    kicker: "Meu negócio",
    title: "Caixa saudável sustenta crescimento.",
    desc: "Entenda margem, despesas e pontos críticos do negócio.",
    cta: "Analisar",
    tone: "gold",
  },
  "quiz-result": {
    kicker: "Diagnóstico",
    title: "Perfil entendido. Agora vem a estratégia.",
    desc: "Use sua filosofia para orientar comparações e carteira.",
    cta: "Continuar",
    tone: "blue",
  },
};

const TONES = {
  gold: { border: C.borderGold, color: C.gold, glow: "rgba(200,164,93,0.11)" },
  blue: { border: C.borderBlue, color: C.blueSoft || C.blue, glow: "rgba(61,131,230,0.10)" },
  green: { border: C.accentBorder, color: C.accent, glow: "rgba(19,185,129,0.10)" },
};

export default function SponsorSlot({ id, compact = false }) {
  const campaign = CAMPAIGNS[id] || CAMPAIGNS["home-top"];
  const tone = TONES[campaign.tone] || TONES.gold;

  return (
    <div
      className="ci-sponsor-slot"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: compact ? 16 : 18,
        padding: compact ? "15px 15px" : "17px 18px",
        margin: compact ? "10px 0" : "14px 0",
        background: "linear-gradient(135deg, rgba(8,27,51,0.90), rgba(6,16,25,0.96))",
        border: `1px solid ${tone.border}`,
        boxShadow: "0 14px 42px rgba(0,0,0,0.18)",
        minHeight: compact ? 128 : 136,
      }}
    >
      <img
        src="/icon-512.png"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          right: compact ? -22 : -18,
          bottom: compact ? -28 : -34,
          width: compact ? 112 : 138,
          height: "auto",
          opacity: 0.055,
          filter: "blur(0.2px) grayscale(1)",
          transform: "rotate(-8deg)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 14% 0%, ${tone.glow}, transparent 34%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: MN, fontSize: 9, fontWeight: 850, letterSpacing: "1.15px", textTransform: "uppercase", color: tone.color, marginBottom: 7 }}>
          {campaign.kicker}
        </div>
        <div style={{ color: C.white, fontSize: compact ? 15 : 16, fontWeight: 780, letterSpacing: "-0.25px", marginBottom: 5, maxWidth: 430 }}>
          {campaign.title}
        </div>
        <div style={{ color: C.textDim, fontSize: 11.5, lineHeight: 1.45, maxWidth: 500 }}>
          {campaign.desc}
        </div>
        <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 10px", borderRadius: 999, border: `1px solid ${tone.border}`, color: tone.color, fontSize: 10, fontFamily: MN, fontWeight: 850, letterSpacing: "0.35px", background: "rgba(255,255,255,0.025)" }}>
          {campaign.cta}
          <span style={{ color: C.textMuted }}>→</span>
        </div>
      </div>
    </div>
  );
}
