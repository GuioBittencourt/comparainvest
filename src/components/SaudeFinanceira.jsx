"use client";
import { useEffect, useMemo, useState } from "react";
import { C, FN, heroStyle } from "../lib/theme";
import { BLOCOS_SAUDE, carregarSaudeFinanceira, carregarSaudeFinanceiraAsync, salvarSaudeFinanceira } from "./SaudeFinanceiraModel";
import SaudeFinanceiraEntradas from "./SaudeFinanceiraEntradas";
import SaudeFinanceiraMoradia from "./SaudeFinanceiraMoradia";
import SaudeFinanceiraEstiloVida from "./SaudeFinanceiraEstiloVida";
import SaudeFinanceiraCartoes from "./SaudeFinanceiraCartoes";
import SaudeFinanceiraDividas from "./SaudeFinanceiraDividas";
import SaudeFinanceiraSaldo from "./SaudeFinanceiraSaldo";
import SaudeFinanceiraResumo from "./SaudeFinanceiraResumo";
import SaudeFinanceiraDashboard from "./SaudeFinanceiraDashboard";

const ORDEM = BLOCOS_SAUDE.map((b) => b.id);

export default function SaudeFinanceira({ onBack, user, targetUser = null, adminMode = false, initialDashboardTab = "financeiro" }) {
  const effectiveUser = targetUser ? { ...targetUser, is_admin: user?.is_admin } : user;
  const userId = effectiveUser?.id || null;
  const canEdit = !adminMode || (user?.is_admin && targetUser?.is_aluno);
  const readOnly = adminMode && !canEdit;
  // Inicia com localStorage (rápido), depois tenta Supabase
  const [data, setData] = useState(() => carregarSaudeFinanceira());
  const [carregado, setCarregado] = useState(false);

  // Carrega do Supabase na montagem (se logado)
  useEffect(() => {
    carregarSaudeFinanceiraAsync(userId).then((remoto) => {
      setData(remoto);
      setCarregado(true);
    });
  }, [userId]);

  const idx = Math.max(0, ORDEM.indexOf(data.stepAtual || "entradas"));
  const blocoAtual = ORDEM[idx] || "entradas";
  const progresso = Math.round(((idx + 1) / ORDEM.length) * 100);

  // Salva local + Supabase a cada mudança
  useEffect(() => {
    if (!carregado || readOnly) return;
    salvarSaudeFinanceira(data, userId);
  }, [data, userId, carregado, readOnly]);

  const setStep = (step) => setData((p) => ({ ...p, stepAtual: step }));
  const next = () => setStep(ORDEM[Math.min(idx + 1, ORDEM.length - 1)]);
  const back = () => setStep(ORDEM[Math.max(idx - 1, 0)]);

  const conteudo = useMemo(() => {
    const props = { data, setData: readOnly ? () => {} : setData, onNext: next, onBack: back, user: effectiveUser };
    if (blocoAtual === "entradas") return <SaudeFinanceiraEntradas {...props} />;
    if (blocoAtual === "moradia") return <SaudeFinanceiraMoradia {...props} />;
    if (blocoAtual === "estilo") return <SaudeFinanceiraEstiloVida {...props} />;
    if (blocoAtual === "cartoes") return <SaudeFinanceiraCartoes {...props} />;
    if (blocoAtual === "dividas") return <SaudeFinanceiraDividas {...props} />;
    if (blocoAtual === "saldo") return <SaudeFinanceiraSaldo {...props} />;
    return <SaudeFinanceiraResumo data={data} setData={readOnly ? () => {} : setData} onBack={back} user={effectiveUser} />;
  }, [blocoAtual, data, effectiveUser, readOnly]);

  return (
    <div style={{ fontFamily: FN }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 20 }}>← {adminMode ? "Voltar ao ADM" : "Voltar para Educação Financeira"}</button>
      <div style={{ marginBottom: 18 }}>
        <h2 style={heroStyle}>Saúde Financeira</h2>
        <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, margin: "8px 0 0" }}>Um mapa financeiro guiado para enxergar entradas, gastos, dívidas e saldo do mês com clareza.</p>
      </div>
      {adminMode && (
        <div style={{ marginBottom: 14, padding: "10px 12px", borderRadius: 12, border: `1px solid ${canEdit ? C.accentBorder : C.border}`, background: canEdit ? `${C.accent}0D` : "rgba(255,255,255,0.030)", color: C.textDim, fontSize: 12, lineHeight: 1.55 }}>
          Visualizando dados de <strong style={{ color: C.white }}>{targetUser?.nome} {targetUser?.sobrenome || ""}</strong>. {canEdit ? "Modo edição liberado por ser aluno." : "Somente leitura: usuário não marcado como aluno."}
        </div>
      )}
      {readOnly && !data.questionarioCompleto ? (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, color: C.textDim, fontSize: 13, lineHeight: 1.7 }}>
          Este usuário ainda não concluiu o questionário de Saúde Financeira. Como ele não está marcado como aluno, o acesso do ADM fica apenas em modo observação.
        </div>
      ) : data.questionarioCompleto ? (
        <SaudeFinanceiraDashboard
          data={data}
          setData={readOnly ? () => {} : setData}
          user={effectiveUser}
          initialTab={initialDashboardTab}
          readOnly={readOnly}
          onEdit={canEdit ? () => setData((p) => ({ ...p, questionarioCompleto: false, stepAtual: "entradas" })) : undefined}
        />
      ) : (
        <>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ color: C.textMuted, fontSize: 11 }}>Bloco {idx + 1} de {ORDEM.length}</span>
              <span style={{ color: C.accent, fontSize: 11 }}>{progresso}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: C.border, overflow: "hidden" }}>
              <div style={{ width: `${progresso}%`, height: "100%", background: `linear-gradient(90deg, ${C.accent}, #BFA46A)`, borderRadius: 999 }} />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              {BLOCOS_SAUDE.map((b, i) => (
                <button key={b.id} onClick={() => setStep(b.id)} style={{ padding: "5px 8px", borderRadius: 999, border: `1px solid ${i === idx ? C.accentBorder : C.border}`, background: i === idx ? `${C.accent}12` : "transparent", color: i === idx ? C.accent : C.textMuted, cursor: "pointer", fontSize: 10 }}>{b.label}</button>
              ))}
            </div>
          </div>
          {conteudo}
        </>
      )}
    </div>
  );
}
