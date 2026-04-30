"use client";
import { C, MN, FN, cardStyle, premiumButton } from "../lib/theme";
import SponsorSlot from "./SponsorSlot";

function TrackCard({ title, description, eyebrow, onClick, active = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "24px 24px",
        marginBottom: 16,
        background: active
          ? "linear-gradient(135deg, rgba(16,185,129,0.085), rgba(10,18,28,0.96))"
          : "rgba(10,18,28,0.92)",
        border: `1px solid ${active ? C.accentBorder : C.border}`,
        borderRadius: 20,
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 18,
        transition: "all 0.2s",
        boxShadow: active ? "0 18px 48px rgba(16,185,129,0.06)" : "0 18px 50px rgba(0,0,0,0.16)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accentBorder; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = active ? C.accentBorder : C.border; }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          border: `1px solid ${C.accentBorder}`,
          background: "rgba(16,185,129,0.055)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ width: 14, height: 14, borderRadius: 999, background: active ? C.accent : C.textMuted }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>
          {eyebrow}
        </div>
        <div style={{ fontFamily: FN, fontSize: 18, fontWeight: 700, color: active ? C.accent : C.white, marginBottom: 5 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: C.textDim, lineHeight: 1.6 }}>
          {description}
        </div>
      </div>
      <span style={{ fontSize: 24, color: C.accent, lineHeight: 1 }}>→</span>
    </button>
  );
}

export default function HomePage({ user, onTrack }) {
  return (
    <div style={{ padding: "34px 28px", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 10 }}>
          comparainvest
        </div>
        <h2 style={{ fontFamily: FN, fontSize: 22, lineHeight: 1.2, fontWeight: 500, letterSpacing: "-0.3px", color: "rgba(235,241,248,0.92)", margin: "0 0 10px" }}>
          Bem-vindo de volta
        </h2>
        <p style={{ color: C.textDim, fontSize: 15, lineHeight: 1.7, margin: 0 }}>
          Compare, organize e acompanhe suas decisões financeiras com clareza.
        </p>
      </div>

      <div
        style={{
          ...cardStyle,
          background: "linear-gradient(135deg, rgba(16,185,129,0.075), rgba(10,18,28,0.96))",
          border: `1px solid ${C.accentBorder}`,
          padding: "24px 22px",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10 }}>
          Comece por aqui
        </div>
        <div style={{ fontSize: 18, color: C.white, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>
          Descubra sua filosofia de investidor em menos de 1 minuto.
        </div>
        <div style={{ display: "grid", gap: 7, marginBottom: 18 }}>
          {["Entenda seu perfil", "Compare ativos com mais critério", "Monte uma estratégia mais consistente"].map((item) => (
            <div key={item} style={{ fontSize: 13, color: C.textDim, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: C.accent }} />
              {item}
            </div>
          ))}
        </div>
        <button onClick={() => onTrack("investimentos")} style={{ ...premiumButton, width: "auto" }}>
          Começar agora
        </button>
      </div>

      <SponsorSlot id="home-top" />

      <TrackCard
        active
        eyebrow="Investimentos"
        title="Comparadores e carteira"
        description="Descubra sua filosofia, compare ações, FIIs e renda fixa, e simule sua carteira com mais clareza."
        onClick={() => onTrack("investimentos")}
      />

      <TrackCard
        eyebrow="Educação financeira"
        title="Controle e aprendizado"
        description="Organize seus gastos, entenda sua distribuição financeira e use ferramentas práticas no dia a dia."
        onClick={() => onTrack("educacao")}
      />

      <TrackCard
        eyebrow="Empreendedorismo"
        title="Meu negócio"
        description="DRE simplificado, controle de receitas e despesas e diagnóstico por segmento."
        onClick={() => onTrack("meu-negocio")}
      />

      <SponsorSlot id="home-bottom" />

      <div style={{ textAlign: "center", padding: "18px", borderTop: `1px solid ${C.border}`, marginTop: 10 }}>
        <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>
          comparainvest — Simulação educativa, não constitui recomendação de investimento.
        </p>
      </div>
    </div>
  );
}
