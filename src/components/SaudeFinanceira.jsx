"use client";
import { useEffect, useMemo, useState } from "react";
import { C, FN, heroStyle } from "../lib/theme";
import { BLOCOS_SAUDE, carregarSaudeFinanceira, salvarSaudeFinanceira } from "./SaudeFinanceiraModel";
import SaudeFinanceiraEntradas from "./SaudeFinanceiraEntradas";
import SaudeFinanceiraMoradia from "./SaudeFinanceiraMoradia";
import SaudeFinanceiraEstiloVida from "./SaudeFinanceiraEstiloVida";
import SaudeFinanceiraCartoes from "./SaudeFinanceiraCartoes";
import SaudeFinanceiraDividas from "./SaudeFinanceiraDividas";
import SaudeFinanceiraSaldo from "./SaudeFinanceiraSaldo";
import SaudeFinanceiraResumo from "./SaudeFinanceiraResumo";
import SaudeFinanceiraDashboard from "./SaudeFinanceiraDashboard";

const ORDEM = BLOCOS_SAUDE.map((b) => b.id);

export default function SaudeFinanceira({ onBack, user }) {
  const [data, setData] = useState(() => carregarSaudeFinanceira());
  const idx = Math.max(0, ORDEM.indexOf(data.stepAtual || "entradas"));
  const blocoAtual = ORDEM[idx] || "entradas";
  const progresso = Math.round(((idx + 1) / ORDEM.length) * 100);

  useEffect(() => { salvarSaudeFinanceira(data); }, [data]);

  const setStep = (step) => setData((p) => ({ ...p, stepAtual: step }));
  const next = () => setStep(ORDEM[Math.min(idx + 1, ORDEM.length - 1)]);
  const back = () => setStep(ORDEM[Math.max(idx - 1, 0)]);

  const conteudo = useMemo(() => {
    const props = { data, setData, onNext: next, onBack: back, user };
    if (blocoAtual === "entradas") return <SaudeFinanceiraEntradas {...props} />;
    if (blocoAtual === "moradia") return <SaudeFinanceiraMoradia {...props} />;
    if (blocoAtual === "estilo") return <SaudeFinanceiraEstiloVida {...props} />;
    if (blocoAtual === "cartoes") return <SaudeFinanceiraCartoes {...props} />;
    if (blocoAtual === "dividas") return <SaudeFinanceiraDividas {...props} />;
    if (blocoAtual === "saldo") return <SaudeFinanceiraSaldo {...props} />;
    return <SaudeFinanceiraResumo data={data} setData={setData} onBack={back} user={user} />;
  }, [blocoAtual, data, user]);

  return <div style={{ padding: "24px 28px", width: "100%", boxSizing: "border-box", fontFamily: FN }}>
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 20 }}>← Voltar para Educação Financeira</button>
      <div style={{ marginBottom: 18 }}>
        <h2 style={heroStyle}>Saúde Financeira</h2>
        <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, margin: "8px 0 0" }}>Um mapa financeiro guiado para enxergar entradas, gastos, dívidas e saldo do mês com clareza.</p>
      </div>
    {data.questionarioCompleto ? (
      <SaudeFinanceiraDashboard
        data={data}
        setData={setData}
        onEdit={() => setData((p) => ({ ...p, questionarioCompleto: false, stepAtual: "entradas" }))}
      />
    ) : (
      <>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: C.textMuted, fontSize: 11 }}>Bloco {idx + 1} de {ORDEM.length}</span>
            <span style={{ color: C.accent, fontSize: 11 }}>{progresso}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: C.border, overflow: "hidden" }}><div style={{ width: `${progresso}%`, height: "100%", background: `linear-gradient(90deg, ${C.accent}, #BFA46A)`, borderRadius: 999 }} /></div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {BLOCOS_SAUDE.map((b, i) => <button key={b.id} onClick={() => setStep(b.id)} style={{ padding: "5px 8px", borderRadius: 999, border: `1px solid ${i === idx ? C.accentBorder : C.border}`, background: i === idx ? `${C.accent}12` : "transparent", color: i === idx ? C.accent : C.textMuted, cursor: "pointer", fontSize: 10 }}>{b.label}</button>)}
          </div>
        </div>
        {conteudo}
      </>
    )}
    </div>
  </div>;
}
