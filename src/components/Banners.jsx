"use client";
import { C, MN, FN, WA_FINANCEIRO, WA_RIQUEZA } from "../lib/theme";

/**
 * Banners de consultoria avulsa via WhatsApp.
 *
 * Estes NÃO são CTAs Premium — são serviços externos
 * (Diagnóstico Financeiro / Riqueza) prestados pelo Guilherme.
 *
 * Visual sóbrio: sem ponto brilhando, sem glow neon. Só borda discreta
 * e ícone monogramado em quadrado pra dar peso institucional.
 */

function PremiumBanner({ title, subtitle, href, mark = "F" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "block", marginBottom: 20 }}
    >
      <div
        style={{
          background: "rgba(10,18,28,0.94)",
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          cursor: "pointer",
          transition: "border-color 0.18s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${C.accent}40`; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
      >
        {/* Mark institucional (não é "ícone bonitinho") */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "rgba(16,185,129,0.06)",
            border: `1px solid ${C.accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontFamily: MN,
            fontSize: 14,
            fontWeight: 700,
            color: C.accent,
            letterSpacing: "0.5px",
          }}
        >
          {mark}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FN, fontSize: 14, fontWeight: 600,
            color: C.white, marginBottom: 3,
          }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>
            {subtitle}
          </div>
        </div>

        <span style={{ fontSize: 18, color: C.textMuted, lineHeight: 1, flexShrink: 0 }}>
          →
        </span>
      </div>
    </a>
  );
}

export function BannerFinanceiro() {
  return (
    <PremiumBanner
      href={WA_FINANCEIRO}
      mark="DF"
      title="Diagnóstico Financeiro"
      subtitle="Análise 1:1 com especialista. Saúde financeira, gastos e sobra mensal."
    />
  );
}

export function BannerRiqueza() {
  return (
    <PremiumBanner
      href={WA_RIQUEZA}
      mark="DR"
      title="Diagnóstico da Riqueza"
      subtitle="Estratégia objetiva pra alavancar seu patrimônio com método."
    />
  );
}
