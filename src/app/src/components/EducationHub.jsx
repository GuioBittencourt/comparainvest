"use client";
import { useState } from "react";
import { C, MN, FN, TN, heroStyle } from "../lib/theme";
import { BannerFinanceiro } from "./Banners";
import SponsorSlot from "./SponsorSlot";
import GestaoAtiva from "./GestaoAtiva";

function HubCard({ title, desc, badge = "Disponível", tone = "gold", onClick, disabled = false }) {
  const tones = {
    gold: { color: C.gold, border: C.borderGold, bg: "linear-gradient(135deg, rgba(200,164,93,0.055), rgba(9,20,32,0.96) 58%)" },
    green: { color: C.accent, border: C.accentBorder, bg: "linear-gradient(135deg, rgba(19,185,129,0.055), rgba(9,20,32,0.96) 58%)" },
    blue: { color: C.blueSoft || C.blue, border: C.borderBlue, bg: "linear-gradient(135deg, rgba(61,131,230,0.055), rgba(9,20,32,0.96) 58%)" },
    muted: { color: C.textMuted, border: C.border, bg: C.card },
  };
  const t = tones[tone] || tones.gold;
  const Comp = disabled ? "div" : "button";

  return (
    <Comp
      onClick={disabled ? undefined : onClick}
      style={{
        width: "100%",
        textAlign: "left",
        cursor: disabled ? "default" : "pointer",
        background: t.bg,
        border: `1px solid ${disabled ? C.border : t.border}`,
        borderRadius: 15,
        padding: "15px 16px",
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        gap: 13,
        opacity: disabled ? 0.58 : 1,
        transition: "transform .18s ease, border-color .18s ease",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: TN, fontSize: 15, fontWeight: 650, color: disabled ? C.white : t.color }}>{title}</span>
          <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 999, background: `${t.color}15`, color: t.color, fontFamily: MN, fontWeight: 850 }}>{badge}</span>
        </div>
        <p style={{ fontSize: 11.5, color: C.textDim, margin: "4px 0 0", lineHeight: 1.5 }}>{desc}</p>
      </div>
      {!disabled && <span style={{ color: t.color, fontSize: 18 }}>→</span>}
    </Comp>
  );
}

export default function EducationHub({ onBack, onTrack, user }) {
  const [subTab, setSubTab] = useState("hub");

  if (subTab === "gestao") {
    return (
      <div style={{ padding: "20px 0", maxWidth: 760, margin: "0 auto" }}>
        <button onClick={() => setSubTab("hub")} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 16 }}>← Voltar</button>
        <GestaoAtiva user={user} />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 0", maxWidth: 760, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 16 }}>← Voltar ao início</button>
      <BannerFinanceiro />
      <h2 style={heroStyle}>Educação Financeira</h2>
      <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.55, marginBottom: 18 }}>Ferramentas práticas para organizar, entender e melhorar sua vida financeira.</p>
      <SponsorSlot id="edu-top" compact />

      <HubCard
        title="Saúde Financeira"
        desc="Mapeie suas finanças pessoais, veja seu saldo real e avance para o extrato futuro."
        badge="Disponível"
        tone="gold"
        onClick={() => onTrack?.("saude-financeira")}
      />

      <HubCard
        title="Gestão Ativa"
        desc="Controle despesas variáveis, defina limites e acompanhe em tempo real."
        badge="Disponível"
        tone="green"
        onClick={() => setSubTab("gestao")}
      />

      <HubCard title="Conceitos Básicos" desc="Renda fixa vs variável, juros compostos, inflação, Selic." badge="Em breve" tone="muted" disabled />
      <HubCard title="Análise de Investimentos" desc="Indicadores fundamentalistas, balanços, setores." badge="Em breve" tone="muted" disabled />
      <HubCard title="Estratégias Avançadas" desc="Cenários macro, marcação a mercado, hedge." badge="Em breve" tone="muted" disabled />

      <SponsorSlot id="edu-bottom" compact />
      <div style={{ textAlign: "center", padding: 16 }}><p style={{ fontSize: 11, color: C.textMuted }}>Cursos, ferramentas e trilhas em desenvolvimento.</p></div>
    </div>
  );
}
