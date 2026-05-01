"use client";
import { C, FN, MN, WA_FINANCEIRO, WA_RIQUEZA, diagnosticCardStyle } from "../lib/theme";

/**
 * Cards de diagnóstico via WhatsApp.
 * Padrão único para Investimentos, Educação Financeira e Meu Negócio.
 * Visual: institucional, azul petróleo, com linha lateral discreta.
 */

function DiagnosticBanner({ title, subtitle, href, mark = "DF" }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", marginBottom: 20 }}>
      <div
        style={{
          ...diagnosticCardStyle,
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          cursor: "pointer",
          transition: "border-color 0.18s ease, background 0.18s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.38)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.24)"; }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 9,
            background: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.32)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontFamily: MN,
            fontSize: 14,
            fontWeight: 800,
            color: C.blue,
            letterSpacing: "0.4px",
          }}
        >
          {mark}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FN, fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 4, lineHeight: 1.2 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.45 }}>
            {subtitle}
          </div>
        </div>

        <span style={{ fontSize: 20, color: C.textMuted, lineHeight: 1, flexShrink: 0 }}>
          →
        </span>
      </div>
    </a>
  );
}

export function BannerFinanceiro() {
  return (
    <DiagnosticBanner
      href={WA_FINANCEIRO}
      mark="DF"
      title="Diagnóstico Financeiro"
      subtitle="Análise 1:1 com especialista. Saúde financeira, gastos e sobra mensal."
    />
  );
}

export function BannerRiqueza() {
  return (
    <DiagnosticBanner
      href={WA_RIQUEZA}
      mark="DR"
      title="Diagnóstico da Riqueza"
      subtitle="Estratégia objetiva pra alavancar seu patrimônio com método."
    />
  );
}

export function BannerNegocio() {
  return (
    <DiagnosticBanner
      href={WA_FINANCEIRO}
      mark="DF"
      title="Diagnóstico Financeiro"
      subtitle="Como acumular 2x seu faturamento mensal em 12 meses."
    />
  );
}
