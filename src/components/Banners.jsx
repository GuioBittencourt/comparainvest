"use client";
import { C, MN, FN, TN, WA_FINANCEIRO, WA_RIQUEZA } from "../lib/theme";

export function BannerFinanceiro() {
  return (
    <a href={WA_FINANCEIRO} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", marginBottom: 20 }}>
      <div style={{
        background: "linear-gradient(135deg, #0D3320 0%, #0D1117 100%)",
        border: `1px solid ${C.accentBorder}`,
        borderRadius: 14, padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 14,
        cursor: "pointer", transition: "all 0.2s",
      }}>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: TN, fontSize: 15, fontWeight: 400, color: C.accent }}>
            Diagnóstico Financeiro
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
            Saúde financeira + sobrar grana todo mês — fale com um especialista
          </div>
        </div>
        <span style={{ fontSize: 20, color: C.accent }}>→</span>
      </div>
    </a>
  );
}

export function BannerRiqueza() {
  return (
    <a href={WA_RIQUEZA} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", marginBottom: 20 }}>
      <div style={{
        background: "linear-gradient(135deg, #0D1920 0%, #0D1117 100%)",
        border: `1px solid ${C.accentBorder}`,
        borderRadius: 14, padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 14,
        cursor: "pointer", transition: "all 0.2s",
      }}>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: TN, fontSize: 15, fontWeight: 400, color: C.accent }}>
            Diagnóstico da Riqueza
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
            Alavanque seu patrimônio já existente — consultoria gratuita
          </div>
        </div>
        <span style={{ fontSize: 20, color: C.accent }}>→</span>
      </div>
    </a>
  );
}
