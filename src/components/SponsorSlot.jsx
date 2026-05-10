"use client";
import { useState } from "react";
import { C, MN, FN, WA_FINANCEIRO, WA_RIQUEZA } from "../lib/theme";
import PremiumGate from "./PremiumGate";

const WA_NEGOCIO = "https://wa.me/5512988890312?text=Ol%C3%A1%2C%20vim%20pelo%20comparainvest.%20Quero%20um%20diagn%C3%B3stico%20para%20meu%20neg%C3%B3cio.";

const CAMPAIGNS = {
  "home-top": { tag: "CENTRAL COMPARAINVEST", title: "Invista com mais clareza.", desc: "Compare ativos, organize decisões e transforme dados em estratégia.", cta: "Explorar", context: "comparador", tone: "gold" },
  "home-bottom": { tag: "SAÚDE FINANCEIRA", title: "Veja o futuro antes de decidir.", desc: "Monte seu mapa financeiro e entenda onde o dinheiro está travando.", cta: "Conhecer", context: "saudeFinanceira", tone: "blue" },
  "edu-top": { tag: "DIAGNÓSTICO FINANCEIRO", title: "Organize seu dinheiro com método.", desc: "Entenda para onde o dinheiro vai e quais ajustes fazem diferença.", cta: "Falar no WhatsApp", href: WA_FINANCEIRO, tone: "gold" },
  "edu-bottom": { tag: "SAÚDE FINANCEIRA", title: "Transforme controle em plano.", desc: "Use o Premium para liberar relatório, extrato futuro e estratégia de quitação.", cta: "Ver benefícios", context: "saudeFinanceira", tone: "blue" },
  "gestao-bottom": { tag: "CONTROLE PREMIUM", title: "Controle antes da liberdade.", desc: "Categorias ilimitadas, relatórios e leitura do mês com mais clareza.", cta: "Ver benefícios", context: "gestaoAtiva", tone: "gold" },
  "comparator-bottom": { tag: "ANÁLISE ESTRATÉGICA", title: "Não compare só preço.", desc: "Indicadores ajudam a enxergar qualidade, risco e eficiência.", cta: "Ver análise", context: "comparador", tone: "gold" },
  "invest-top": { tag: "ANÁLISE ESTRATÉGICA", title: "Invista com método.", desc: "Compare, filtre e decida com mais critério antes do aporte.", cta: "Ver benefícios", context: "comparador", tone: "gold" },
  "rf-bottom": { tag: "RENDA FIXA", title: "Liquidez, prazo e retorno no mesmo mapa.", desc: "Compare títulos com visão clara de cenário.", cta: "Ver benefícios", context: "rendaFixa", tone: "gold" },
  "carteira-middle": { tag: "CARTEIRA", title: "Sua estratégia em visão completa.", desc: "Monte uma carteira simulada e veja a composição com mais clareza.", cta: "Ver benefícios", context: "carteira", tone: "gold" },
  "carteira-bottom": { tag: "PATRIMÔNIO", title: "Decisão boa nasce do conjunto.", desc: "Compare sua carteira como estratégia, não como ativos soltos.", cta: "Ver benefícios", context: "carteira", tone: "blue" },
  "negocio-bottom": { tag: "MEU NEGÓCIO", title: "Caixa saudável sustenta crescimento.", desc: "Entenda margem, despesas e pontos críticos do negócio.", cta: "Falar no WhatsApp", href: WA_NEGOCIO, tone: "gold" },
  "quiz-result": { tag: "PRÓXIMO PASSO", title: "Compare sua filosofia com a prática.", desc: "Use seu perfil para montar uma carteira mais coerente.", cta: "Explorar", context: "comparador", tone: "gold" },
};

function getTone(tone) {
  if (tone === "blue") return { border: C.borderBlue || C.border, color: C.blueSoft || C.blue, glow: "rgba(61,131,230,0.12)" };
  return { border: C.borderGold || C.border, color: C.gold || C.yellow, glow: "rgba(200,164,93,0.13)" };
}

export default function SponsorSlot({ id, compact = false }) {
  const [showGate, setShowGate] = useState(false);
  const item = CAMPAIGNS[id] || CAMPAIGNS["home-top"];
  const tone = getTone(item.tone);

  const handleClick = () => {
    if (item.href && typeof window !== "undefined") {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (item.context) setShowGate(true);
  };

  return (
    <>
      {showGate && <PremiumGate context={item.context || "default"} onClose={() => setShowGate(false)} />}
      <button
        type="button"
        onClick={handleClick}
        style={{
          width: "100%",
          textAlign: "left",
          position: "relative",
          overflow: "hidden",
          borderRadius: compact ? 16 : 20,
          padding: compact ? "15px 16px" : "18px 20px",
          margin: compact ? "10px 0" : "16px 0",
          minHeight: compact ? 92 : 112,
          background: "linear-gradient(135deg, rgba(8,27,51,0.96) 0%, rgba(6,16,25,0.98) 70%, rgba(12,24,37,0.96) 100%)",
          border: `1px solid ${tone.border}`,
          boxShadow: "0 14px 42px rgba(0,0,0,0.22)",
          cursor: "pointer",
        }}
      >
        <div aria-hidden="true" style={{ position: "absolute", right: compact ? -28 : -22, bottom: compact ? -36 : -44, width: compact ? 120 : 150, height: compact ? 120 : 150, backgroundImage: "url('/icon-512.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", opacity: 0.07, filter: "grayscale(1) blur(0.2px)", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 86% 20%, ${tone.glow}, transparent 36%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: MN, fontSize: compact ? 9 : 10, fontWeight: 900, letterSpacing: "1.5px", color: tone.color, textTransform: "uppercase", marginBottom: 8 }}>
            {item.tag}
          </div>
          <div style={{ color: C.white, fontFamily: FN, fontSize: compact ? 17 : 20, lineHeight: 1.15, fontWeight: 850, letterSpacing: "-0.35px", marginBottom: 7 }}>
            {item.title}
          </div>
          <div style={{ color: C.textDim, fontFamily: FN, fontSize: compact ? 12 : 13, lineHeight: 1.55, maxWidth: 560 }}>
            {item.desc}
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14, padding: "8px 13px", borderRadius: 999, border: `1px solid ${tone.border}`, color: tone.color, fontFamily: MN, fontSize: 11, fontWeight: 900, background: "rgba(255,255,255,0.025)" }}>
            {item.cta} <span>→</span>
          </div>
        </div>
      </button>
    </>
  );
}
