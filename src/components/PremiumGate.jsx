"use client";
import { C, FN, MN } from "../lib/theme";

const COPY = {
  comparador: {
    tag: "ANÁLISE PREMIUM",
    title: "Compare sem limites.",
    desc: "Veja mais ativos, mais indicadores e mais combinações para decidir com clareza.",
    cta: "Ver planos",
  },
  rendaFixa: {
    tag: "RENDA FIXA PREMIUM",
    title: "Toda renda fixa, lado a lado.",
    desc: "Compare títulos, prazos e cenários com leitura mais completa.",
    cta: "Ver planos",
  },
  carteira: {
    tag: "CARTEIRA PREMIUM",
    title: "Sua carteira, sem teto.",
    desc: "Simule, organize e acompanhe seu patrimônio com mais profundidade.",
    cta: "Ver planos",
  },
  gestaoAtiva: {
    tag: "CONTROLE PREMIUM",
    title: "Gestão completa do seu mês.",
    desc: "Categorias ilimitadas, relatórios e mais clareza sobre para onde o dinheiro está indo.",
    cta: "Ver planos",
  },
  meuNegocio: {
    tag: "NEGÓCIO PREMIUM",
    title: "Diagnóstico cruzado dos seus negócios.",
    desc: "Entenda margem, faturamento, custos e pontos críticos com visão executiva.",
    cta: "Ver planos",
  },
  batalha: {
    tag: "BATALHA PREMIUM",
    title: "Batalhe sem limites.",
    desc: "Compare ativos com liberdade e descubra padrões com mais profundidade.",
    cta: "Ver planos",
  },
  diagnostico: {
    tag: "DIAGNÓSTICO PREMIUM",
    title: "Veja exatamente onde melhorar.",
    desc: "Receba uma leitura objetiva do problema, da causa provável e da ação recomendada.",
    cta: "Ver planos",
  },
  saudeFinanceira: {
    tag: "SAÚDE FINANCEIRA PREMIUM",
    title: "Clareza para transformar sua vida financeira.",
    desc: "Desbloqueie relatório completo, extrato futuro, estratégia de quitação e plano de independência.",
    cta: "Ver planos",
  },
  default: {
    tag: "COMPARAINVEST PREMIUM",
    title: "Desbloqueie uma visão mais completa.",
    desc: "Acesse recursos avançados para comparar, organizar e decidir melhor.",
    cta: "Ver planos",
  },
};

export default function PremiumGate({
  context = "default",
  title,
  desc,
  cta,
  onClick,
  compact = false,
  style = {},
}) {
  const copy = COPY[context] || COPY.default;
  const finalTitle = title || copy.title;
  const finalDesc = desc || copy.desc;
  const finalCta = cta || copy.cta;

  const handleClick = () => {
    if (onClick) return onClick();
    if (typeof window !== "undefined") window.location.href = "/premium";
  };

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: compact ? 18 : 22,
        padding: compact ? "15px 16px" : "20px 22px",
        background:
          "linear-gradient(135deg, rgba(8,27,51,0.96) 0%, rgba(6,16,25,0.98) 62%, rgba(12,24,37,0.96) 100%)",
        border: `1px solid ${C.borderGold || "rgba(200,164,93,0.24)"}`,
        boxShadow: "0 18px 54px rgba(0,0,0,0.26)",
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: compact ? -24 : -18,
          bottom: compact ? -32 : -42,
          width: compact ? 120 : 165,
          height: compact ? 120 : 165,
          backgroundImage: "url('/icon-512.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.075,
          filter: "grayscale(1) blur(0.2px)",
          transform: "rotate(-5deg)",
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 92% 18%, rgba(200,164,93,0.11), transparent 34%), radial-gradient(circle at 4% 0%, rgba(19,185,129,0.045), transparent 30%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontFamily: MN,
            fontSize: compact ? 9 : 10,
            fontWeight: 900,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            color: C.gold || C.yellow,
            marginBottom: compact ? 7 : 9,
          }}
        >
          {copy.tag}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: compact ? "center" : "flex-start",
            justifyContent: "space-between",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0, flex: "1 1 260px" }}>
            <h3
              style={{
                margin: 0,
                color: C.white,
                fontFamily: FN,
                fontSize: compact ? 16 : 19,
                lineHeight: 1.16,
                fontWeight: 850,
                letterSpacing: "-0.35px",
              }}
            >
              {finalTitle}
            </h3>

            <p
              style={{
                margin: compact ? "5px 0 0" : "7px 0 0",
                color: C.textDim,
                fontFamily: FN,
                fontSize: compact ? 11.5 : 12.5,
                lineHeight: 1.55,
                maxWidth: 620,
              }}
            >
              {finalDesc}
            </p>
          </div>

          <button
            onClick={handleClick}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              border: `1px solid ${C.borderGold || "rgba(200,164,93,0.30)"}`,
              background: "rgba(200,164,93,0.075)",
              color: C.gold2 || C.gold || C.yellow,
              borderRadius: 999,
              padding: compact ? "8px 12px" : "9px 14px",
              fontFamily: MN,
              fontSize: compact ? 10 : 11,
              fontWeight: 900,
              letterSpacing: "0.2px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {finalCta}
            <span style={{ fontSize: 13, lineHeight: 1 }}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
