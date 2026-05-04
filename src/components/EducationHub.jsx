"use client";
import { useState } from "react";
import { C, MN, FN, TN, heroStyle } from "../lib/theme";
import { BannerFinanceiro } from "./Banners";
import SponsorSlot from "./SponsorSlot";
import GestaoAtiva from "./GestaoAtiva";

function HubCard({ title, desc, badge = "Disponível", tone = "gold", onClick, disabled = false }) {
  const tones = {
    gold: { color: C.gold || C.yellow, border: C.borderGold || C.border, bg: "linear-gradient(135deg, rgba(200,164,93,0.055), rgba(9,20,32,0.96) 58%)" },
    green: { color: C.accent, border: C.accentBorder, bg: "linear-gradient(135deg, rgba(19,185,129,0.055), rgba(9,20,32,0.96) 58%)" },
    blue: { color: C.blueSoft || C.blue, border: C.borderBlue || C.border, bg: "linear-gradient(135deg, rgba(61,131,230,0.055), rgba(9,20,32,0.96) 58%)" },
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
        border: `1px solid ${t.border}`,
        borderRadius: 18,
        padding: "16px 17px",
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: disabled ? 0.65 : 1,
        position: "relative",
        overflow: "hidden",
        minHeight: 92,
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", right: -30, bottom: -38, width: 120, height: 120, backgroundImage: "url('/icon-512.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", opacity: disabled ? 0.03 : 0.055, filter: "grayscale(1)", pointerEvents: "none" }} />
      <div style={{ width: 38, height: 38, borderRadius: 14, display: "grid", placeItems: "center", flexShrink: 0, background: `${t.color}10`, border: `1px solid ${t.color}24`, color: t.color, fontFamily: MN, fontWeight: 900, fontSize: 11, position: "relative", zIndex: 1 }}>
        {title.split(" ").map(p => p[0]).join("").slice(0,2)}
      </div>
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: TN, fontSize: 15, fontWeight: 800, color: disabled ? C.textDim : C.white }}>{title}</span>
          <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 999, background: `${t.color}12`, color: t.color, fontFamily: MN, fontWeight: 900 }}>{badge}</span>
        </div>
        <p style={{ fontSize: 12, color: C.textDim, margin: "5px 0 0", lineHeight: 1.5 }}>{desc}</p>
      </div>
      {!disabled && <span style={{ color: t.color, fontSize: 18, position: "relative", zIndex: 1 }}>→</span>}
    </Comp>
  );
}

export default function EducationHub({ onBack, onTrack, user }) {
  const [subTab, setSubTab] = useState("hub");

  if (subTab === "gestao") {
    return (
      <div style={{ padding: "8px 0 0", maxWidth: 960, margin: "0 auto" }}>
        <button onClick={() => setSubTab("hub")} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 16 }}>← Voltar</button>
        <GestaoAtiva user={user} />
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 0 0", maxWidth: 1040, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 16 }}>← Voltar</button>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)", gap: 14, alignItems: "stretch", marginBottom: 14 }} className="ci-responsive-2col">
        <div style={{ background: "linear-gradient(135deg, rgba(8,27,51,0.95), rgba(7,16,25,0.97))", border: `1px solid ${C.borderGold || C.border}`, borderRadius: 22, padding: "20px 20px", boxShadow: "0 18px 54px rgba(0,0,0,0.24)", position: "relative", overflow: "hidden" }}>
          <div style={{ fontFamily: MN, fontSize: 10, fontWeight: 900, color: C.gold || C.yellow, letterSpacing: "1.1px", textTransform: "uppercase", marginBottom: 8 }}>Controle financeiro</div>
          <h2 style={{ ...heroStyle, fontSize: 25 }}>Educação Financeira</h2>
          <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.65, margin: "8px 0 0", maxWidth: 560 }}>Organize sua vida financeira, acompanhe seus gastos e transforme informação em decisão.</p>
        </div>
        <SponsorSlot id="edu-top" compact />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginBottom: 12 }} className="ci-responsive-grid">
        <HubCard
          title="Saúde Financeira"
          desc="Mapa completo das suas finanças pessoais, com diagnóstico, extrato futuro e plano de clareza."
          tone="gold"
          onClick={() => onTrack ? onTrack("saude-financeira") : null}
        />
        <HubCard
          title="Gestão Ativa"
          desc="Controle despesas variáveis, defina limites e acompanhe seu mês em tempo real."
          tone="green"
          onClick={() => setSubTab("gestao")}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 14 }} className="ci-responsive-grid-3">
        <HubCard title="Conceitos Básicos" desc="Renda fixa, variável, juros compostos, inflação e Selic." badge="Em breve" tone="muted" disabled />
        <HubCard title="Análise de Investimentos" desc="Indicadores, balanços, setores e leitura fundamentalista." badge="Em breve" tone="muted" disabled />
        <HubCard title="Estratégias Avançadas" desc="Cenários macro, marcação a mercado, hedge e alocação." badge="Em breve" tone="muted" disabled />
      </div>

      <SponsorSlot id="edu-bottom" />
      <div style={{ textAlign: "center", padding: "14px 10px 2px" }}><p style={{ fontSize: 10.5, color: C.textMuted, margin: 0 }}>Cursos, ferramentas e trilhas em desenvolvimento.</p></div>
    </div>
  );
}
