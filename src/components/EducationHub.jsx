"use client";
import { useState } from "react";
import { C, MN, FN, TN, heroStyle } from "../lib/theme";
import { BannerFinanceiro } from "./Banners";
import SponsorSlot from "./SponsorSlot";
import GestaoAtiva from "./GestaoAtiva";

export default function EducationHub({ onBack, onTrack, user }) {
  const [subTab, setSubTab] = useState("hub");

  if (subTab === "gestao") {
    return (
      <div style={{ padding: "24px 28px", maxWidth: 700, margin: "0 auto" }}>
        <button onClick={() => setSubTab("hub")} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 20 }}>← Voltar</button>
        <GestaoAtiva user={user} />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 28px", maxWidth: 700, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 20 }}>← Voltar ao início</button>
      <BannerFinanceiro />
      <h2 style={heroStyle}>Educação Financeira</h2>
      <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>Aprenda a cuidar do seu dinheiro.</p>
      <SponsorSlot id="edu-top" />

      <button
        onClick={() => onTrack?.("saude-financeira")}
        style={{
          width: "100%",
          textAlign: "left",
          cursor: "pointer",
          background: "linear-gradient(135deg, rgba(37,99,235,0.16) 0%, rgba(13,17,23,0.98) 100%)",
          border: `1px solid ${C.blue || "#3B82F6"}55`,
          borderRadius: 16,
          padding: "20px 22px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 16,
          transition: "all .18s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = C.blue || "#3B82F6";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${C.blue || "#3B82F6"}55`;
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: TN, fontSize: 16, fontWeight: 400, color: C.blue || "#3B82F6" }}>Saúde Financeira</span>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: `${C.accent}15`, color: C.accent, fontFamily: MN }}>Disponível</span>
          </div>
          <p style={{ fontSize: 12, color: C.textDim, margin: "4px 0 0", lineHeight: 1.6 }}>Mapeie suas finanças pessoais, entenda para onde vai seu dinheiro e organize sua vida financeira.</p>
        </div>
        <span style={{ color: C.accent, fontSize: 18 }}>→</span>
      </button>

      <button onClick={() => setSubTab("gestao")} style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "linear-gradient(135deg, #0D3320 0%, #0D1117 100%)", border: `1px solid ${C.accentBorder}`, borderRadius: 16, padding: "20px 22px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontFamily: TN, fontSize: 16, fontWeight: 400, color: C.accent }}>Gestão Ativa</span><span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: `${C.accent}15`, color: C.accent, fontFamily: MN }}>Disponível</span></div>
          <p style={{ fontSize: 12, color: C.textDim, margin: "4px 0 0", lineHeight: 1.6 }}>Controle despesas variáveis, defina limites e acompanhe em tempo real.</p>
        </div>
        <span style={{ color: C.accent, fontSize: 18 }}>→</span>
      </button>
      {[
        { icon: "", title: "Conceitos Básicos", desc: "Renda fixa vs variável, juros compostos, inflação, Selic.", level: "Iniciante", color: C.green, tag: "Em breve" },
        { icon: "", title: "Análise de Investimentos", desc: "Indicadores fundamentalistas, balanços, setores.", level: "Intermediário", color: C.textDim, tag: "Em breve" },
        { icon: "", title: "Estratégias Avançadas", desc: "Cenários macro, marcação a mercado, hedge.", level: "Avançado", color: C.textDim, tag: "Em breve" },
      ].map((c) => (
        <div key={c.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 22px", marginBottom: 12, display: "flex", alignItems: "center", gap: 16, opacity: 0.6 }}>
          <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontFamily: FN, fontSize: 14, fontWeight: 600, color: C.white }}>{c.title}</span><span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: `${c.color}15`, color: c.color, fontFamily: MN }}>{c.level}</span><span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: `${C.yellow}15`, color: C.yellow, fontFamily: MN }}>{c.tag}</span></div><p style={{ fontSize: 12, color: C.textDim, margin: "4px 0 0", lineHeight: 1.6 }}>{c.desc}</p></div>
        </div>
      ))}
      <SponsorSlot id="edu-bottom" />
      <div style={{ textAlign: "center", padding: 20 }}><p style={{ fontSize: 11, color: C.textMuted }}>Cursos, e-book e ferramentas em desenvolvimento.</p></div>
    </div>
  );
}
