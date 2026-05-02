"use client";
import { C, MN, FN } from "../lib/theme";

const SPONSOR_LABELS = {
  "home-top": "Parceiro estratégico",
  "home-bottom": "Espaço premium",
  "edu-top": "Educação com parceiros",
  "edu-bottom": "Ferramenta parceira",
  "carteira-middle": "Parceiro de carteira",
  "carteira-bottom": "Solução parceira",
  "rf-bottom": "Renda fixa com parceiro",
  "comparator-bottom": "Parceiro de análise",
  "gestao-bottom": "Organização financeira",
  "negocio-bottom": "Parceiro para negócios",
  "quiz-result": "Próximo passo",
};

export default function SponsorSlot({ id, compact = false }) {
  const label = SPONSOR_LABELS[id] || "Espaço de parceria";

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: compact ? 16 : 20,
        padding: compact ? "16px 16px" : "20px 22px",
        margin: compact ? "12px 0" : "18px 0",
        background: "linear-gradient(135deg, rgba(8,27,51,0.88), rgba(7,16,25,0.95))",
        border: `1px solid ${C.borderGold}`,
        boxShadow: "0 18px 54px rgba(0,0,0,0.18)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: -28,
          top: -34,
          width: 140,
          height: 140,
          borderRadius: 38,
          border: `1px solid rgba(200,164,93,0.10)`,
          transform: "rotate(18deg)",
          opacity: 0.9,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: 22,
          bottom: -28,
          fontFamily: FN,
          fontSize: 58,
          lineHeight: 1,
          fontWeight: 900,
          color: "rgba(200,164,93,0.045)",
          letterSpacing: "-0.08em",
        }}
      >
        ci
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: MN, fontSize: 10, fontWeight: 800, letterSpacing: "1.1px", textTransform: "uppercase", color: C.gold, marginBottom: 7 }}>
            {label}
          </div>
          <div style={{ color: C.white, fontSize: compact ? 14 : 16, fontWeight: 800, letterSpacing: "-0.2px", marginBottom: 4 }}>
            Espaço reservado para patrocinador
          </div>
          <div style={{ color: C.textDim, fontSize: 12, lineHeight: 1.55, maxWidth: 520 }}>
            Área nativa para arte, link ou campanha de parceiro — sem poluir a experiência do usuário.
          </div>
        </div>

        <div
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 12px",
            borderRadius: 999,
            border: `1px solid ${C.borderGold}`,
            color: C.gold,
            fontSize: 11,
            fontFamily: MN,
            fontWeight: 800,
            letterSpacing: "0.4px",
            background: "rgba(200,164,93,0.055)",
          }}
        >
          PARCERIA
          <span style={{ color: C.textMuted }}>→</span>
        </div>
      </div>
    </div>
  );
}
