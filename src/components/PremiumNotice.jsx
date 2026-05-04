"use client";
import { C, FN, MN } from "../lib/theme";

const COPY = {
  comparador: { tag: "PREMIUM", title: "Mais comparações, mais clareza.", desc: "Desbloqueie comparações ilimitadas e análises mais completas." },
  rendaFixa: { tag: "PREMIUM", title: "Toda renda fixa, lado a lado.", desc: "Compare títulos, prazos e cenários sem travas." },
  gestaoAtiva: { tag: "PREMIUM", title: "Gestão completa do seu mês.", desc: "Categorias ilimitadas, diagnóstico e relatórios completos." },
  meuNegocio: { tag: "PREMIUM", title: "Diagnóstico cruzado dos seus negócios.", desc: "Benchmark, ações recomendadas e leitura executiva." },
  carteira: { tag: "PREMIUM", title: "Carteira sem teto.", desc: "Simule mais ativos e veja sua estratégia completa." },
  saudeFinanceira: { tag: "PREMIUM", title: "Extrato futuro e relatório completo.", desc: "Transforme seu mapa financeiro em plano de ação." },
  default: { tag: "PREMIUM", title: "Desbloqueie a visão completa.", desc: "Acesse recursos avançados do comparainvest." },
};

export default function PremiumNotice({ context = "default", onClick, style = {} }) {
  const copy = COPY[context] || COPY.default;

  return (
    <button type="button" onClick={onClick} style={{ width: "100%", textAlign: "left", cursor: "pointer", border: `1px solid ${C.borderGold || "rgba(200,164,93,0.26)"}`, background: "linear-gradient(135deg, rgba(8,27,51,0.96) 0%, rgba(6,16,25,0.98) 68%, rgba(12,24,37,0.96) 100%)", borderRadius: 20, padding: "14px 15px", marginBottom: 14, display: "flex", alignItems: "center", gap: 13, position: "relative", overflow: "hidden", boxShadow: "0 14px 42px rgba(0,0,0,0.22)", ...style }}>
      <div aria-hidden="true" style={{ position: "absolute", right: -24, bottom: -34, width: 118, height: 118, backgroundImage: "url('/icon-512.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", opacity: 0.065, filter: "grayscale(1)", pointerEvents: "none" }} />
      <div style={{ width: 38, height: 38, borderRadius: 14, display: "grid", placeItems: "center", flexShrink: 0, background: "rgba(200,164,93,0.075)", border: `1px solid ${C.borderGold || "rgba(200,164,93,0.24)"}`, color: C.gold || C.yellow, fontFamily: MN, fontWeight: 900, fontSize: 11, position: "relative", zIndex: 1 }}>◆</div>
      <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: FN, fontSize: 14, fontWeight: 850, color: C.white }}>{copy.title}</span>
          <span style={{ fontFamily: MN, fontSize: 9, fontWeight: 900, color: C.gold || C.yellow, background: "rgba(200,164,93,0.075)", border: `1px solid ${C.borderGold || "rgba(200,164,93,0.24)"}`, borderRadius: 999, padding: "3px 8px", letterSpacing: "0.6px" }}>{copy.tag}</span>
        </div>
        <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.45, marginTop: 4 }}>{copy.desc}</div>
      </div>
      <span style={{ color: C.gold || C.yellow, fontSize: 17, position: "relative", zIndex: 1 }}>→</span>
    </button>
  );
}
