"use client";

import { C, MN, FN, cardStyle, premiumButton } from "../lib/theme";
import SponsorSlot from "./SponsorSlot";
import { IconCarteira, IconAcoes, IconNegocio, IconProteger, IconControle } from "./Icons";

function QuickCard({ title, desc, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="ci-home-quick-card"
      style={{
        width: "100%",
        textAlign: "left",
        padding: "11px 12px",
        background: "rgba(255,255,255,0.024)",
        border: `1px solid ${C.border}`,
        borderRadius: 13,
        color: C.text,
        cursor: "pointer",
        display: "flex",
        gap: 10,
        alignItems: "center",
        minHeight: 62,
        transition: "transform .18s ease, border-color .18s ease, background .18s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.borderColor = C.borderGold || C.borderLight;
        e.currentTarget.style.background = "rgba(200,164,93,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.background = "rgba(255,255,255,0.024)";
      }}
    >
      <span style={{ color: C.gold || C.accent, width: 22, flexShrink: 0 }}>
        <Icon size={19} />
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13, fontWeight: 720, color: C.white, marginBottom: 2 }}>
          {title}
        </span>
        <span style={{ display: "block", fontSize: 11, color: C.textDim, lineHeight: 1.3 }}>
          {desc}
        </span>
      </span>
    </button>
  );
}

function TrackCard({ title, description, eyebrow, mark, tone = "green", onClick }) {
  const tones = {
    green: {
      color: C.accent,
      bg: "rgba(19,185,129,0.055)",
      border: "rgba(19,185,129,0.20)",
      card: "linear-gradient(135deg, rgba(19,185,129,0.040), rgba(9,20,32,0.96) 58%)",
    },
    blue: {
      color: C.blueSoft || C.blue,
      bg: "rgba(61,131,230,0.055)",
      border: "rgba(61,131,230,0.20)",
      card: "linear-gradient(135deg, rgba(61,131,230,0.040), rgba(9,20,32,0.96) 58%)",
    },
    amber: {
      color: C.gold || C.yellow,
      bg: "rgba(200,164,93,0.060)",
      border: "rgba(200,164,93,0.23)",
      card: "linear-gradient(135deg, rgba(200,164,93,0.045), rgba(9,20,32,0.96) 58%)",
    },
  };
  const t = tones[tone] || tones.green;

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "14px 15px",
        marginBottom: 10,
        background: t.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 13,
        transition: "border-color 0.2s, transform 0.2s",
        boxShadow: "0 12px 34px rgba(0,0,0,0.14)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.border;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 13,
          border: `1px solid ${t.border}`,
          background: t.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontFamily: MN,
          fontSize: 13,
          fontWeight: 850,
          color: t.color,
          letterSpacing: "0.2px",
        }}
      >
        {mark}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 850, color: C.textMuted, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 4 }}>
          {eyebrow}
        </div>
        <div style={{ fontFamily: FN, fontSize: 15, fontWeight: 720, color: C.white, marginBottom: 3 }}>
          {title}
        </div>
        <div style={{ fontSize: 11.5, color: C.textDim, lineHeight: 1.45 }}>
          {description}
        </div>
      </div>
      <span style={{ fontSize: 18, color: t.color, lineHeight: 1, opacity: 0.72 }}>→</span>
    </button>
  );
}

export default function HomePage({ user, onTrack }) {
  return (
    <div className="ci-home-wrap">
      <style jsx>{`
        .ci-home-wrap {
          width: 100%;
          padding: 16px 12px 0;
        }
        .ci-home-grid {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 14px;
        }
        .ci-home-main, .ci-home-aside {
          min-width: 0;
        }
        .ci-quick-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }
        @media (min-width: 900px) {
          .ci-home-wrap {
            padding: 22px 20px 0;
          }
          .ci-home-grid {
            grid-template-columns: minmax(0, 1fr) 300px;
            align-items: start;
            gap: 18px;
          }
          .ci-quick-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        @media (min-width: 1200px) {
          .ci-home-grid {
            max-width: 1180px;
            grid-template-columns: minmax(0, 1fr) 320px;
          }
        }
      `}</style>

      <div className="ci-home-grid">
        <main className="ci-home-main">
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: C.textDim, fontSize: 12, margin: "0 0 7px" }}>
              Bem-vindo de volta, {user?.nome || "investidor"}
            </p>
            <h1 style={{ fontFamily: FN, color: C.white, fontSize: "clamp(27px, 5vw, 40px)", fontWeight: 650, letterSpacing: "-0.045em", lineHeight: 1.05, margin: 0 }}>
              Sua central de decisão financeira.
            </h1>
            <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.55, maxWidth: 560, margin: "10px 0 0" }}>
              Compare ativos, organize gastos e acompanhe negócios com uma visão mais clara do seu dinheiro.
            </p>
          </div>

          <div
            style={{
              ...cardStyle,
              background: "radial-gradient(circle at top right, rgba(200,164,93,0.10), transparent 34%), linear-gradient(135deg, rgba(11,24,38,0.98), rgba(6,16,25,0.98))",
              padding: 18,
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: C.gold || C.yellow, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 7, fontFamily: MN, fontWeight: 850 }}>
                  Visão rápida
                </div>
                <div style={{ fontFamily: FN, fontSize: "clamp(22px, 5vw, 31px)", fontWeight: 620, letterSpacing: "-0.045em", color: C.white, lineHeight: 1.06 }}>
                  Clareza para decidir melhor.
                </div>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: "rgba(200,164,93,0.070)", border: `1px solid ${C.borderGold || C.borderLight}`, color: C.gold || C.yellow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconProteger size={20} />
              </div>
            </div>

            <div className="ci-quick-grid">
              <QuickCard title="Carteira" desc="Visão completa" icon={IconCarteira} onClick={() => onTrack?.("carteira")} />
              <QuickCard title="Investir" desc="Comparadores B3" icon={IconAcoes} onClick={() => onTrack?.("investimentos")} />
              <QuickCard title="Controle" desc="Saúde e gestão" icon={IconControle} onClick={() => onTrack?.("educacao")} />
              <QuickCard title="Negócio" desc="DRE e caixa" icon={IconNegocio} onClick={() => onTrack?.("meu-negocio")} />
            </div>
          </div>

          <div style={{ ...cardStyle, background: "linear-gradient(135deg, rgba(18,58,99,0.20), rgba(9,20,32,0.96) 64%)", border: `1px solid ${C.borderBlue || C.borderLight}`, padding: "16px 17px", marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: C.gold || C.yellow, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 7, fontFamily: MN, fontWeight: 850 }}>
              Diagnóstico
            </div>
            <div style={{ fontSize: 18, lineHeight: 1.2, color: C.white, fontWeight: 720, marginBottom: 6 }}>
              Comece pelo seu perfil financeiro.
            </div>
            <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5, marginBottom: 13 }}>
              Use sua filosofia de investidor para comparar ativos com mais critério.
            </div>
            <button onClick={() => onTrack?.("quiz")} style={{ ...premiumButton, width: "100%", minHeight: 40, padding: "10px 14px" }}>
              Fazer diagnóstico <span style={{ float: "right" }}>→</span>
            </button>
          </div>

          <TrackCard eyebrow="Investimentos" mark="IV" tone="green" title="Comparadores e carteira" description="Compare ações, FIIs e renda fixa, e simule sua carteira com mais clareza." onClick={() => onTrack?.("investimentos")} />
          <TrackCard eyebrow="Educação financeira" mark="EF" tone="blue" title="Controle e aprendizado" description="Organize gastos, saúde financeira e ferramentas práticas no dia a dia." onClick={() => onTrack?.("educacao")} />
          <TrackCard eyebrow="Empreendedorismo" mark="MN" tone="amber" title="Meu negócio" description="DRE simplificado, receitas, despesas e diagnóstico por segmento." onClick={() => onTrack?.("meu-negocio")} />
        </main>

        <aside className="ci-home-aside">
          <SponsorSlot id="home-top" compact />
          <SponsorSlot id="home-bottom" compact />
          <div style={{ textAlign: "center", padding: "13px", borderTop: `1px solid ${C.border}`, marginTop: 4 }}>
            <p style={{ fontSize: 10.5, color: C.textMuted, margin: 0 }}>
              comparainvest — Simulação educativa, não constitui recomendação de investimento.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
