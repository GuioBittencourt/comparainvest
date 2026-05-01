"use client";
import { C, FN, MN, premiumNoticeStyle } from "../lib/theme";

const COPY = {
  comparador: {
    title: "Mais comparações, mais insights",
    text: "Compare sem restrições e descubra padrões mais profundos.",
  },
  rendaFixa: {
    title: "Mais cenários, mais precisão",
    text: "Compare títulos, prazos e rentabilidade líquida sem travas.",
  },
  gestaoAtiva: {
    title: "Mais categorias, mais controle",
    text: "Desbloqueie categorias ilimitadas e gestão avançada.",
  },
};

export default function PremiumNotice({ context = "comparador", onClick }) {
  const copy = COPY[context] || COPY.comparador;
  return (
    <div
      style={{
        ...premiumNoticeStyle,
        padding: "14px 16px",
        marginBottom: 16,
      }}
    >
      <style>{`
        @media (min-width: 680px) {
          .premium-notice-inner { flex-direction: row !important; align-items: center !important; }
          .premium-notice-button { width: auto !important; }
        }
      `}</style>
      <div
        className="premium-notice-inner"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.10em",
                color: C.red,
                border: `1px solid ${C.red}55`,
                borderRadius: 6,
                padding: "3px 8px",
                fontFamily: MN,
                lineHeight: 1,
              }}
            >
              LIMITADO
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.white, lineHeight: 1.22, fontFamily: FN }}>
              {copy.title}
            </span>
          </div>
          <div style={{ fontSize: 13, color: C.textDim, lineHeight: 1.55, maxWidth: 520 }}>
            {copy.text}
          </div>
        </div>

        <button
          className="premium-notice-button"
          onClick={onClick}
          style={{
            alignSelf: "stretch",
            width: "100%",
            padding: "10px 16px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 700,
            fontFamily: FN,
            cursor: "pointer",
            background: "rgba(16,185,129,0.060)",
            color: C.accent2,
            border: `1px solid rgba(16,185,129,0.25)`,
            whiteSpace: "nowrap",
            transition: "transform .18s ease, border-color .18s ease, background .18s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.46)"; e.currentTarget.style.background = "rgba(16,185,129,0.095)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.25)"; e.currentTarget.style.background = "rgba(16,185,129,0.060)"; }}
        >
          Ver benefícios
        </button>
      </div>
    </div>
  );
}
