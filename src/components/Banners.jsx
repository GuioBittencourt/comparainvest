"use client";
import { C, FN, MN, WA_FINANCEIRO, WA_RIQUEZA } from "../lib/theme";

const WA_NEGOCIO = "https://wa.me/5512988890312?text=Ol%C3%A1%2C%20vim%20pelo%20comparainvest.%20Quero%20um%20diagn%C3%B3stico%20para%20meu%20neg%C3%B3cio.";

function DiagnosticBanner({ title, subtitle, href, mark = "DF", tag = "DIAGNÓSTICO", tone = "gold" }) {
  const color = tone === "blue" ? (C.blueSoft || C.blue) : (C.gold || C.yellow);
  const border = tone === "blue" ? (C.borderBlue || C.border) : (C.borderGold || C.border);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", marginBottom: 16 }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, rgba(8,27,51,0.96) 0%, rgba(6,16,25,0.98) 70%, rgba(12,24,37,0.96) 100%)",
          border: `1px solid ${border}`,
          borderRadius: 20,
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          cursor: "pointer",
          minHeight: 94,
          boxShadow: "0 14px 42px rgba(0,0,0,0.22)",
        }}
      >
        <div aria-hidden="true" style={{ position: "absolute", right: -24, bottom: -36, width: 120, height: 120, backgroundImage: "url('/icon-512.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", opacity: 0.07, filter: "grayscale(1)", pointerEvents: "none" }} />
        <div style={{ width: 40, height: 40, borderRadius: 14, display: "grid", placeItems: "center", background: "rgba(200,164,93,0.075)", border: `1px solid ${border}`, color, fontFamily: MN, fontSize: 12, fontWeight: 900, flexShrink: 0, position: "relative", zIndex: 1 }}>{mark}</div>
        <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: MN, fontSize: 9.5, fontWeight: 900, letterSpacing: "1.1px", color, textTransform: "uppercase", marginBottom: 5 }}>{tag}</div>
          <div style={{ fontFamily: FN, fontSize: 15.5, fontWeight: 850, color: C.white, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.45 }}>{subtitle}</div>
        </div>
        <span style={{ color, fontSize: 18, position: "relative", zIndex: 1 }}>→</span>
      </div>
    </a>
  );
}

export function BannerFinanceiro() {
  return (
    <DiagnosticBanner
      title="Diagnóstico Financeiro"
      subtitle="Análise 1:1 com especialista. Saúde financeira, gastos e sobra mensal."
      href={WA_FINANCEIRO}
      mark="DF"
      tag="Saúde financeira"
      tone="blue"
    />
  );
}

export function BannerRiqueza() {
  return (
    <DiagnosticBanner
      title="Diagnóstico da Riqueza"
      subtitle="Estratégia objetiva para alavancar seu patrimônio com método."
      href={WA_RIQUEZA}
      mark="DR"
      tag="Investimentos"
      tone="gold"
    />
  );
}

export function BannerNegocio() {
  return (
    <DiagnosticBanner
      title="Diagnóstico do Negócio"
      subtitle="Entenda margem, despesas e pontos críticos do seu negócio."
      href={WA_NEGOCIO}
      mark="DN"
      tag="Meu negócio"
      tone="gold"
    />
  );
}
