"use client";
import { C, MN, FN, cardStyle, btnGradientBlue } from "../lib/theme";
import SponsorSlot from "./SponsorSlot";
import { IconCarteira, IconAcoes, IconCompare, IconNegocio, IconProteger } from "./Icons";

function QuickCard({ title, desc, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "15px 14px",
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        color: C.text,
        cursor: "pointer",
        display: "flex",
        gap: 12,
        alignItems: "center",
        transition: "transform .18s ease, border-color .18s ease, background .18s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = C.accentBorder; e.currentTarget.style.background = "rgba(16,185,129,0.035)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
    >
      <span style={{ color: C.accent, width: 24 }}><Icon size={21} /></span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14, fontWeight: 650, color: C.white, marginBottom: 2 }}>{title}</span>
        <span style={{ display: "block", fontSize: 11.5, color: C.textDim, lineHeight: 1.35 }}>{desc}</span>
      </span>
    </button>
  );
}

function TrackCard({ title, description, eyebrow, mark, tone = "green", onClick }) {
  const tones = {
    green: { color: C.accent, bg: "rgba(16,185,129,0.075)", border: "rgba(16,185,129,0.30)", card: "linear-gradient(135deg, rgba(16,185,129,0.055), rgba(10,18,28,0.96) 54%)" },
    blue: { color: C.blue, bg: "rgba(59,130,246,0.075)", border: "rgba(59,130,246,0.30)", card: "linear-gradient(135deg, rgba(59,130,246,0.055), rgba(10,18,28,0.96) 54%)" },
    amber: { color: C.orange, bg: "rgba(217,119,6,0.075)", border: "rgba(217,119,6,0.30)", card: "linear-gradient(135deg, rgba(217,119,6,0.050), rgba(10,18,28,0.96) 54%)" },
  };
  const t = tones[tone] || tones.green;
  return (
    <button
      onClick={onClick}
      style={{ width: "100%", padding: "22px 22px", marginBottom: 14, background: t.card, border: `1px solid ${C.border}`, borderRadius: 20, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 18, transition: "border-color 0.2s, transform 0.2s", boxShadow: "0 18px 50px rgba(0,0,0,0.16)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ width: 50, height: 50, borderRadius: 14, border: `1px solid ${t.border}`, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: MN, fontSize: 18, fontWeight: 800, color: t.color, letterSpacing: "0.3px" }}>
        {mark}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>{eyebrow}</div>
        <div style={{ fontFamily: FN, fontSize: 18, fontWeight: 650, color: C.white, marginBottom: 5 }}>{title}</div>
        <div style={{ fontSize: 13, color: C.textDim, lineHeight: 1.6 }}>{description}</div>
      </div>
      <span style={{ fontSize: 24, color: t.color, lineHeight: 1, opacity: 0.76 }}>→</span>
    </button>
  );
}

export default function HomePage({ user, onTrack }) {
  return (
    <div style={{ padding: "32px 22px 28px", maxWidth: 920, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 8px" }}>Olá, {user?.nome || "investidor"}</p>
        <h1 style={{ fontFamily: FN, color: C.white, fontSize: "clamp(28px, 7vw, 44px)", fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1.05, margin: 0 }}>
          Sua central de decisão financeira.
        </h1>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.65, maxWidth: 560, margin: "12px 0 0" }}>
          Compare ativos, organize gastos e acompanhe negócios com uma visão mais clara do seu dinheiro.
        </p>
      </div>

      <div style={{ ...cardStyle, background: "radial-gradient(circle at top right, rgba(16,185,129,0.13), transparent 32%), linear-gradient(135deg, rgba(11,24,36,0.98), rgba(7,16,24,0.98))", padding: 22, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, fontFamily: MN }}>Visão rápida</div>
            <div style={{ fontFamily: FN, fontSize: "clamp(24px, 7vw, 36px)", fontWeight: 500, letterSpacing: "-0.045em", color: C.white, lineHeight: 1.06 }}>
              Clareza para decidir melhor.
            </div>
          </div>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(16,185,129,0.075)", border: `1px solid ${C.accentBorder}`, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconProteger size={22} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
          <QuickCard title="Carteira" desc="Visão completa" icon={IconCarteira} onClick={() => onTrack("investimentos")} />
          <QuickCard title="Investir" desc="Comparadores B3" icon={IconAcoes} onClick={() => onTrack("investimentos")} />
          <QuickCard title="Controle" desc="Gestão ativa" icon={IconCompare} onClick={() => onTrack("educacao")} />
          <QuickCard title="Negócio" desc="DRE e caixa" icon={IconNegocio} onClick={() => onTrack("meu-negocio")} />
        </div>
      </div>

      <div style={{ ...cardStyle, background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(10,18,28,0.96) 62%)", border: "1px solid rgba(59,130,246,0.20)", padding: "20px 20px", marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: C.blue, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, fontFamily: MN, fontWeight: 800 }}>Diagnóstico</div>
        <div style={{ fontSize: 20, lineHeight: 1.2, color: C.white, fontWeight: 650, marginBottom: 8 }}>Comece pelo seu perfil financeiro.</div>
        <div style={{ fontSize: 13, color: C.textDim, lineHeight: 1.6, marginBottom: 16 }}>Use sua filosofia de investidor para comparar ativos com mais critério.</div>
        <button onClick={() => onTrack("investimentos")} style={{ ...btnGradientBlue, width: "100%" }}>Fazer diagnóstico <span style={{ float: "right" }}>→</span></button>
      </div>

      <SponsorSlot id="home-top" />

      <TrackCard eyebrow="Investimentos" mark="IV" tone="green" title="Comparadores e carteira" description="Descubra sua filosofia, compare ações, FIIs e renda fixa, e simule sua carteira com mais clareza." onClick={() => onTrack("investimentos")} />
      <TrackCard eyebrow="Educação financeira" mark="EF" tone="blue" title="Controle e aprendizado" description="Organize seus gastos, entenda sua distribuição financeira e use ferramentas práticas no dia a dia." onClick={() => onTrack("educacao")} />
      <TrackCard eyebrow="Empreendedorismo" mark="MN" tone="amber" title="Meu negócio" description="DRE simplificado, controle de receitas e despesas e diagnóstico por segmento." onClick={() => onTrack("meu-negocio")} />

      <SponsorSlot id="home-bottom" />
      <div style={{ textAlign: "center", padding: "18px", borderTop: `1px solid ${C.border}`, marginTop: 10 }}>
        <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>comparainvest — Simulação educativa, não constitui recomendação de investimento.</p>
      </div>
    </div>
  );
}
