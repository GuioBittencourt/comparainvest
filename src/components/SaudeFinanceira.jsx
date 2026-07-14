"use client";
import { useState, useEffect, useCallback } from "react";
import { C, MN, FN } from "../lib/theme";
import { novoModeloSaude } from "./SaudeFinanceiraModel";
import { supabase } from "../lib/supabase";
import SaudeFinanceiraEntradas from "./SaudeFinanceiraEntradas";
import SaudeFinanceiraMoradia from "./SaudeFinanceiraMoradia";
import SaudeFinanceiraEstiloVida from "./SaudeFinanceiraEstiloVida";
import SaudeFinanceiraCartoes from "./SaudeFinanceiraCartoes";
import SaudeFinanceiraDividas from "./SaudeFinanceiraDividas";
import SaudeFinanceiraSaldo from "./SaudeFinanceiraSaldo";
import SaudeFinanceiraResumo from "./SaudeFinanceiraResumo";
import SaudeFinanceiraDashboard from "./SaudeFinanceiraDashboard";

const ETAPAS = ["entradas","moradia","estilo","cartoes","dividas","saldo","resumo","dashboard"];

export default function SaudeFinanceira({ user, targetUser = null, adminMode = false, readOnly = false }) {
  const effectiveUser = targetUser || user;
  const userId = effectiveUser?.id || null;
  const isAdmin = !!(user?.is_admin && adminMode);
  const isAluno = !!(effectiveUser?.is_aluno && !user?.is_admin);
  const targetUserId = targetUser?.id || null;

  const [etapa, setEtapa] = useState("dashboard");
  const [sfData, setSfData] = useState(() => novoModeloSaude());
  const [carregado, setCarregado] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Carrega da tabela saude_financeira
  useEffect(() => {
    if (!userId) { setCarregado(true); return; }
    supabase
      .from("saude_financeira")
      .select("dados")
      .eq("user_id", userId)
      .single()
      .then(({ data: row }) => {
        if (row?.dados && Object.keys(row.dados).length > 0) {
          setSfData(row.dados);
        }
        setCarregado(true);
      });
  }, [userId]);

  // Salva na tabela saude_financeira (upsert)
  const salvar = useCallback(async (dados) => {
    if (!userId || readOnly) return;
    setSalvando(true);
    await supabase
      .from("saude_financeira")
      .upsert({ user_id: userId, dados, atualizado_em: new Date().toISOString() }, { onConflict: "user_id" });
    setSalvando(false);
  }, [userId, readOnly]);

  const setSfDataESalvar = useCallback((fn) => {
    setSfData((prev) => {
      const novo = typeof fn === "function" ? fn(prev) : fn;
      salvar(novo);
      return novo;
    });
  }, [salvar]);

  const avancar = () => {
    const idx = ETAPAS.indexOf(etapa);
    if (idx < ETAPAS.length - 1) setEtapa(ETAPAS[idx + 1]);
  };

  const voltar = () => {
    const idx = ETAPAS.indexOf(etapa);
    if (idx > 0) setEtapa(ETAPAS[idx - 1]);
  };

  if (!carregado) {
    return <div style={{ textAlign: "center", padding: 40, color: C.textDim, fontSize: 13 }}>Carregando...</div>;
  }

  if (etapa === "dashboard") {
    return (
      <SaudeFinanceiraDashboard
        data={sfData}
        setData={setSfDataESalvar}
        onEdit={() => setEtapa("entradas")}
        readOnly={readOnly}
        isAdmin={isAdmin}
        isAluno={isAluno}
        targetUserId={targetUserId}
        userId={user?.id}
      />
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {salvando && (
        <div style={{ textAlign: "center", padding: "6px", fontSize: 10, color: C.textMuted, fontFamily: "monospace" }}>
          salvando...
        </div>
      )}
      {etapa === "entradas" && <SaudeFinanceiraEntradas data={sfData} setData={setSfDataESalvar} onNext={avancar} onBack={() => setEtapa("dashboard")} />}
      {etapa === "moradia" && <SaudeFinanceiraMoradia data={sfData} setData={setSfDataESalvar} onNext={avancar} onBack={voltar} />}
      {etapa === "estilo" && <SaudeFinanceiraEstiloVida data={sfData} setData={setSfDataESalvar} onNext={avancar} onBack={voltar} />}
      {etapa === "cartoes" && <SaudeFinanceiraCartoes data={sfData} setData={setSfDataESalvar} onNext={avancar} onBack={voltar} />}
      {etapa === "dividas" && <SaudeFinanceiraDividas data={sfData} setData={setSfDataESalvar} onNext={avancar} onBack={voltar} />}
      {etapa === "saldo" && <SaudeFinanceiraSaldo data={sfData} setData={setSfDataESalvar} onNext={avancar} onBack={voltar} />}
      {etapa === "resumo" && <SaudeFinanceiraResumo data={sfData} onNext={avancar} onBack={voltar} />}
    </div>
  );
}