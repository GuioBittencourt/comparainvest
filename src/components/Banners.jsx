"use client";
import { C, MN, FN, WA_FINANCEIRO, WA_RIQUEZA } from "../lib/theme";

function PremiumBanner({ title, subtitle, href, tone = "green" }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", marginBottom: 20 }}>
      <div
        style={{
          background: tone === "blue"
            ? "linear-gradient(135deg, rgba(56,189,248,0.10), rgba(10,18,28,0.96))"
            : "linear-gradient(135deg, rgba(0,212,126,0.11), rgba(10,18,28,0.96))",
          border: `1px solid ${C.accentBorder}`,
          borderRadius: 18,
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            border: `1px solid ${C.accentBorder}`,
            background: "rgba(0,212,126,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: 999, background: C.accent, boxShadow: "0 0 24px rgba(0,212,126,0.35)" }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FN, fontSize: 15, fontWeight: 800, color: C.white, marginBottom: 4 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.55 }}>
            {subtitle}
          </div>
        </div>

        <span style={{ fontSize: 22, color: C.accent, lineHeight: 1 }}>→</span>
      </div>
    </a>
  );
}

export function BannerFinanceiro() {
  return (
    <PremiumBanner
      href={WA_FINANCEIRO}
      title="Diagnóstico Financeiro"
      subtitle="Saúde financeira, clareza de gastos e sobra mensal — fale com um especialista."
    />
  );
}

export function BannerRiqueza() {
  return (
    <PremiumBanner
      href={WA_RIQUEZA}
      tone="blue"
      title="Diagnóstico da Riqueza"
      subtitle="Alavanque seu patrimônio com uma análise objetiva e orientada a estratégia."
    />
  );
}
