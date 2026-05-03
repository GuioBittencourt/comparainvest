"use client";
import { useState } from "react";
import { C, MN, FN, TN, heroStyle } from "../lib/theme";
import { BannerFinanceiro } from "./Banners";
import SponsorSlot from "./SponsorSlot";
import GestaoAtiva from "./GestaoAtiva";
import SaudeFinanceira from "./SaudeFinanceira";

const backBtn = {
  background: "none",
  border: "none",
  color: C.textDim,
  fontSize: 12,
  cursor: "pointer",
  fontFamily: FN,
  marginBottom: 16,
};

function Badge({ children, color = C.accent, muted = false }) {
  return (
    <span
      style={{
        fontSize: 9,
        padding: "3px 8px",
        borderRadius: 999,
        background: muted ? `${C.yellow}12` : `${color}14`,
        color: muted ? C.yellow : color,
        fontFamily: MN,
        fontWeight: 800,
        letterSpacing: "0.4px",
        border: `1px solid ${muted ? `${C.yellow}22` : `${color}22`}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function ModuleButton({ title, desc, badge, color = C.accent, onClick, premium = false, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        background: premium
          ? "linear-gradient(135deg, rgba(8,27,51,0.95), rgba(7,16,25,0.97))"
          : "linear-gradient(180deg, rgba(11,24,38,0.94), rgba(7,16,25,0.94))",
        border: `1px solid ${premium ? C.borderGold : `${color}22`}`,
        borderRadius: 18,
        padding: "16px 17px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 14px 42px rgba(0,0,0,0.20)",
        position: "relative",
        overflow: "hidden",
        minHeight: 92,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -22,
          top: -26,
          width: 118,
          height: 118,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${premium ? "rgba(200,164,93,0.11)" : `${color}13`}, transparent 66%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 14,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          background: `${color}10`,
          border: `1px solid ${color}24`,
          color,
          fontFamily: MN,
          fontWeight: 900,
          fontSize: 12,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: TN, fontSize: 15, fontWeight: 700, color: C.white }}>{title}</span>
          {badge}
        </div>
        <p style={{ fontSize: 12, color: C.textDim, margin: "5px 0 0", lineHeight: 1.55 }}>{desc}</p>
      </div>
      <span style={{ color, fontSize: 17, position: "relative", zIndex: 1 }}>→</span>
    </button>
  );
}

function SoonCard({ title, desc, level, color = C.textDim }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(11,24,38,0.72), rgba(7,16,25,0.76))",
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: "15px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: 0.72,
        minHeight: 82,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
          <span style={{ fontFamily: FN, fontSize: 13, fontWeight: 700, color: C.white }}>{title}</span>
          <Badge color={color}>{level}</Badge>
          <Badge muted>Em breve</Badge>
        </div>
        <p style={{ fontSize: 11.5, color: C.textDim, margin: "5px 0 0", lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}

export default function EducationHub({ onBack, user }) {
  const [subTab, setSubTab] = useState("hub");

  if (subTab === "saude") {
    return (
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "4px 0 0" }}>
        <button onClick={() => setSubTab("hub")} style={backBtn}>← Voltar para Educação Financeira</button>
        <SaudeFinanceira user={user} onBack={() => setSubTab("hub")} />
      </div>
    );
  }

  if (subTab === "gestao") {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "4px 0 0" }}>
        <button onClick={() => setSubTab("hub")} style={backBtn}>← Voltar para Educação Financeira</button>
        <GestaoAtiva user={user} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "2px 0 0" }}>
      <button onClick={onBack} style={backBtn}>← Voltar ao início</button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.25fr) minmax(280px, 0.75fr)",
          gap: 14,
          alignItems: "stretch",
          marginBottom: 14,
        }}
        className="ci-responsive-2col"
      >
        <div
          style={{
            background: "linear-gradient(135deg, rgba(8,27,51,0.95), rgba(7,16,25,0.97))",
            border: `1px solid ${C.borderGold}`,
            borderRadius: 22,
            padding: "20px 20px",
            boxShadow: "0 18px 54px rgba(0,0,0,0.24)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -38,
              bottom: -45,
              width: 170,
              height: 170,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,164,93,0.12), transparent 64%)",
            }}
          />
          <div style={{ fontFamily: MN, fontSize: 10, fontWeight: 900, color: C.gold, letterSpacing: "1.1px", textTransform: "uppercase", marginBottom: 8 }}>
            Controle financeiro
          </div>
          <h2 style={{ ...heroStyle, fontSize: 25 }}>Educação Financeira</h2>
          <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.65, margin: "8px 0 0", maxWidth: 560 }}>
            Organize sua vida financeira, acompanhe seus gastos e transforme informação em decisão.
          </p>
        </div>

        <SponsorSlot id="edu-top" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 12,
        }}
        className="ci-responsive-grid"
      >
        <ModuleButton
          title="Saúde Financeira"
          desc="Mapa completo das suas finanças pessoais, com diagnóstico, extrato futuro e plano de clareza."
          color={C.gold}
          premium
          badge={<Badge color={C.gold}>Disponível</Badge>}
          onClick={() => setSubTab("saude")}
        >
          SF
        </ModuleButton>

        <ModuleButton
          title="Gestão Ativa"
          desc="Controle despesas variáveis, defina limites e acompanhe seu mês em tempo real."
          color={C.accent}
          badge={<Badge color={C.accent}>Disponível</Badge>}
          onClick={() => setSubTab("gestao")}
        >
          GA
        </ModuleButton>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
          marginBottom: 14,
        }}
        className="ci-responsive-grid-3"
      >
        <SoonCard title="Conceitos Básicos" desc="Renda fixa, variável, juros compostos, inflação e Selic." level="Iniciante" color={C.green} />
        <SoonCard title="Análise de Investimentos" desc="Indicadores, balanços, setores e leitura fundamentalista." level="Intermediário" color={C.blue} />
        <SoonCard title="Estratégias Avançadas" desc="Cenários macro, marcação a mercado, hedge e alocação." level="Avançado" color={C.gold} />
      </div>

      <SponsorSlot id="edu-bottom" />

      <div style={{ textAlign: "center", padding: "14px 10px 2px" }}>
        <p style={{ fontSize: 10.5, color: C.textMuted, margin: 0 }}>Cursos, ferramentas e trilhas em desenvolvimento.</p>
      </div>
    </div>
  );
}
