"use client";
import { C, FN, premiumButton, btnSecondary } from "../lib/theme";

const PREMIUM_PAGE_URL = "/premium";

export default function UpgradeModal({ onClose, message }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(3,7,12,0.78)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 430,
          background: "linear-gradient(180deg, rgba(13,24,36,0.98), rgba(8,15,24,0.98))",
          border: `1px solid ${C.borderLight}`,
          borderRadius: 22,
          padding: "34px 28px 26px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at top, rgba(0,212,126,0.13), transparent 42%)", pointerEvents: "none" }} />

        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: C.accent, fontWeight: 800, marginBottom: 10 }}>
            Acesso Premium
          </div>

          <h3 style={{ fontFamily: FN, fontSize: 24, lineHeight: 1.15, fontWeight: 900, color: C.white, margin: "0 0 10px" }}>
            Remova limites e compare com mais liberdade.
          </h3>

          <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: "0 0 22px" }}>
            {message || "Continue sua análise com comparações ilimitadas, mais ativos por batalha e acesso completo às próximas ferramentas."}
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              borderRadius: 16,
              padding: "16px 18px",
              border: `1px solid ${C.border}`,
              marginBottom: 20,
              textAlign: "left",
            }}
          >
            {["Comparações ilimitadas", "Mais ativos por análise", "Carteira simulada sem travas", "Novas features incluídas"].map((item) => (
              <div key={item} style={{ fontSize: 13, color: C.text, padding: "6px 0", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: C.accent, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>

          <a href={PREMIUM_PAGE_URL} style={{ textDecoration: "none", display: "block" }}>
            <button style={{ ...premiumButton, width: "100%", marginBottom: 10 }}>
              Liberar acesso completo
            </button>
          </a>

          <button onClick={onClose} style={{ ...btnSecondary, width: "100%" }}>
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
