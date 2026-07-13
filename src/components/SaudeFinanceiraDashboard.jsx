"use client";
import { useState, useEffect, useCallback } from "react";
import { C, MN, FN } from "../lib/theme";
import { formatarBRL, calcularScoreSaude, novoModeloSaude } from "./SaudeFinanceiraModel";
import { gerarExtratoFuturo } from "./ExtratoFuturoEngine";
import SaudeFinanceiraScore from "./SaudeFinanceiraScore";
import SaudeFinanceiraInsights from "./SaudeFinanceiraInsights";
import SaudeFinanceiraDiagnostico from "./SaudeFinanceiraDiagnostico";
import SaudeFinanceiraDistribuicao from "./SaudeFinanceiraDistribuicao";
import ExtratoFuturo from "./ExtratoFuturo";
import SaudeFinanceiraResumo from "./SaudeFinanceiraResumo";

const ABAS = [
  { id: "financeiro", label: "Financeiro" },
  { id: "distribuicao", label: "Análise" },
  { id: "extrato", label: "Extrato Futuro" },
  { id: "resumo", label: "Resumo" },
];

const mesAtual = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
};

function CheckPago({ label, valor, pago, onChange, cartao = false }) {
  return (
    <div
      onClick={() => onChange(!pago)}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 14px", borderRadius: 10, cursor: "pointer",
        background: pago ? `${C.accent}0D` : C.cardAlt,
        border: `1px solid ${pago ? C.accentBorder : C.border}`,
        marginBottom: 6, transition: "all 0.18s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 18, height: 18, borderRadius: 5, flexShrink: 0,
          border: `2px solid ${pago ? C.accent : C.border}`,
          background: pago ? C.accent : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {pago && <span style={{ color: C.bg, fontSize: 11, fontWeight: 800, lineHeight: 1 }}>✓</span>}
        </div>
        <span style={{ fontSize: 12, color: pago ? C.white : C.textDim, textDecoration: pago ? "line-through" : "none" }}>
          {label}{cartao && <span style={{ fontSize: 9, color: C.textMuted, marginLeft: 4, fontFamily: MN }}>(cartão)</span>}
        </span>
      </div>
      <span style={{ fontFamily: MN, fontSize: 12, color: pago ? C.accent : C.textDim, whiteSpace: "nowrap" }}>
        {formatarBRL(valor)}
      </span>
    </div>
  );
}

export default function SaudeFinanceiraDashboard({
  data, setData, onEdit,
  readOnly = false, isAdmin = false, isAluno = false, targetUserId = null,
}) {
  const [aba, setAba] = useState("financeiro");
  const mes = mesAtual();

  const pagamentos = data.pagamentos?.[mes] || {};
  const setPago = (chave, valor) => {
    setData((p) => ({
      ...p,
      pagamentos: {
        ...(p.pagamentos || {}),
        [mes]: { ...(p.pagamentos?.[mes] || {}), [chave]: valor },
      },
    }));
  };

  const extrato = gerarExtratoFuturo(data, {});
  const linhaMes = extrato[0] || {};

  // Calcula saldo estimado descontando pagamentos já feitos
  const calcularSaldoEstimado = () => {
    const entradas = linhaMes.entradas || 0;
    const fixas = data.contasFixas || {};

    let pago = 0;
    // Contas fixas padrão
    if (pagamentos["moradia"]) pago += Number(fixas.moradia?.valor || 0);
    if (pagamentos["condominio"]) pago += Number(fixas.condominio || 0);
    if (pagamentos["agua"]) pago += Number(fixas.agua || 0);
    if (pagamentos["luz"]) pago += Number(fixas.luz || 0);
    if (pagamentos["gas"]) pago += Number(fixas.gas || 0);
    if (pagamentos["mercado"]) pago += Number(fixas.mercado || 0);
    if (pagamentos["celular"]) pago += Number(fixas.celular || 0);
    if (pagamentos["internet"]) pago += Number(fixas.internet || 0);
    if (pagamentos["uber"]) pago += Number(fixas.uber || 0);
    if (pagamentos["transporte"]) pago += Number(fixas.transporte?.valor || 0);
    if (pagamentos["streaming"]) pago += Number(fixas.streaming?.valor || 0);
    if (pagamentos["academia"]) pago += Number(fixas.academia?.valor || 0);
    if (pagamentos["seguro"]) pago += Number(fixas.seguro?.valor || 0);
    if (pagamentos["convenio"]) pago += Number(fixas.convenio?.valor || 0);
    if (pagamentos["farmacia"]) pago += Number(fixas.farmacia?.valor || 0);
    if (pagamentos["pet"]) pago += Number(fixas.pet?.valor || 0);
    if (pagamentos["cabelo"]) pago += Number(fixas.cabelo?.valor || 0);
    if (pagamentos["pensao"]) pago += Number(fixas.pensao?.valor || 0);
    // Extras
    (fixas.contasExtras || []).forEach((e) => {
      if (pagamentos[`extra_${e.id}`]) pago += Number(e.valor || 0);
    });
    // Cartões
    (data.cartoes || []).forEach((c) => {
      if (pagamentos[`cartao_${c.id}`]) pago += Number(c.faturaAtual || 0);
    });
    // Outras contas do mês vigente
    (data.outrasContas || []).filter(o => !o.mesPagamento || o.mesPagamento === mes).forEach((o) => {
      if (pagamentos[`outra_${o.id}`]) pago += Number(o.parcela || 0);
    });

    const saldoInicial = Number(data.saldoInicial || 0);
    const gestaoAtiva = linhaMes.gestaoAtiva || 0;
    return saldoInicial + entradas - pago - gestaoAtiva;
  };

  const saldoEstimado = calcularSaldoEstimado();
  const fixas = data.contasFixas || {};

  // Contas do mês vigente (outras contas sem data futura)
  const outrasContasMes = (data.outrasContas || []).filter(o => !o.mesPagamento || o.mesPagamento === mes);

  return (
    <div>
      {/* Score */}
      <SaudeFinanceiraScore score={calcularScoreSaude(data)} />


      {/* Abas */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
        {ABAS.map((a) => (
          <button key={a.id} onClick={() => setAba(a.id)} style={{
            flexShrink: 0, padding: "7px 16px", borderRadius: 999, cursor: "pointer",
            border: `1px solid ${aba === a.id ? C.accentBorder : C.border}`,
            background: aba === a.id ? `${C.accent}14` : "transparent",
            color: aba === a.id ? C.accent : C.textMuted,
            fontSize: 12, fontFamily: MN, fontWeight: 700,
          }}>{a.label}</button>
        ))}
        {!readOnly && (
          <button onClick={onEdit} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 999, cursor: "pointer", border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, fontSize: 11, fontFamily: MN }}>Revisar →</button>
        )}
      </div>

      {/* ABA FINANCEIRO */}
      {aba === "financeiro" && (
        <div>
          {/* Saldo estimado */}
          <div style={{ background: saldoEstimado >= 0 ? "linear-gradient(135deg,#0D3320,#0D1117)" : "linear-gradient(135deg,#3d0d0d,#0D1117)", border: `1px solid ${saldoEstimado >= 0 ? C.accentBorder : C.red+"40"}`, borderRadius: 16, padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, letterSpacing: 1 }}>SALDO ESTIMADO — {new Date().toLocaleString("pt-BR", { month: "long", year: "numeric" }).toUpperCase()}</div>
            <div style={{ fontFamily: MN, fontSize: 28, fontWeight: 800, color: saldoEstimado >= 0 ? C.accent : C.red, marginTop: 4 }}>{formatarBRL(saldoEstimado)}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: C.textDim }}>Já pago: {formatarBRL(Object.keys(pagamentos).filter(k => pagamentos[k]).length > 0 ? calcularPago(pagamentos, data, mes) : 0)}</span>
              <span style={{ fontSize: 10, color: C.textDim }}>Gestão Ativa gasto: {formatarBRL(linhaMes.gestaoAtiva || 0)}</span>
              <span style={{ fontSize: 10, color: C.textMuted }}>Em aberto: {formatarBRL(linhaMes.fixas || 0)}</span>
              <span style={{ fontSize: 10, color: C.textMuted }}>Disponível atual: {formatarBRL(saldoEstimado)}</span>
            </div>
          </div>

          {/* RECEITAS */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, letterSpacing: 1 }}>RECEITAS</span>
              <span style={{ fontFamily: MN, fontSize: 13, color: C.accent }}>{formatarBRL(linhaMes.entradas || 0)}</span>
            </div>
            <CheckPago label="Salário / renda principal" valor={data.entradas?.salario || 0} pago={pagamentos["salario"]} onChange={(v) => setPago("salario", v)} />
            {(data.entradas?.extras || []).map((e) => (
              <CheckPago key={e.id} label={e.descricao || "Renda extra"} valor={e.valor || 0} pago={pagamentos[`entrada_${e.id}`]} onChange={(v) => setPago(`entrada_${e.id}`, v)} />
            ))}
          </div>

          {/* CONTAS FIXAS */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, letterSpacing: 1, marginBottom: 10 }}>CONTAS FIXAS — MARQUE O QUE JÁ PAGOU</div>
            {Number(fixas.moradia?.valor) > 0 && <CheckPago label={`Moradia (${fixas.moradia?.tipo || ""})`} valor={fixas.moradia?.valor || 0} pago={pagamentos["moradia"]} onChange={(v) => setPago("moradia", v)} />}
            {Number(fixas.condominio) > 0 && <CheckPago label="Condomínio" valor={fixas.condominio} pago={pagamentos["condominio"]} onChange={(v) => setPago("condominio", v)} />}
            {Number(fixas.agua) > 0 && <CheckPago label="Água" valor={fixas.agua} pago={pagamentos["agua"]} onChange={(v) => setPago("agua", v)} />}
            {Number(fixas.luz) > 0 && <CheckPago label="Luz" valor={fixas.luz} pago={pagamentos["luz"]} onChange={(v) => setPago("luz", v)} />}
            {Number(fixas.gas) > 0 && <CheckPago label="Gás" valor={fixas.gas} pago={pagamentos["gas"]} onChange={(v) => setPago("gas", v)} />}
            {Number(fixas.mercado) > 0 && <CheckPago label="Mercado" valor={fixas.mercado} pago={pagamentos["mercado"]} onChange={(v) => setPago("mercado", v)} />}
            {Number(fixas.transporte?.valor) > 0 && <CheckPago label={`Transporte (${fixas.transporte?.tipo || ""})`} valor={fixas.transporte?.valor || 0} pago={pagamentos["transporte"]} onChange={(v) => setPago("transporte", v)} />}
            {Number(fixas.uber) > 0 && <CheckPago label="Uber / apps" valor={fixas.uber} pago={pagamentos["uber"]} onChange={(v) => setPago("uber", v)} />}
            {Number(fixas.celular) > 0 && <CheckPago label="Celular" valor={fixas.celular} pago={pagamentos["celular"]} onChange={(v) => setPago("celular", v)} />}
            {Number(fixas.internet) > 0 && <CheckPago label="Internet" valor={fixas.internet} pago={pagamentos["internet"]} onChange={(v) => setPago("internet", v)} />}
            {Number(fixas.streaming?.valor) > 0 && <CheckPago label="Streaming" valor={fixas.streaming?.valor || 0} pago={pagamentos["streaming"]} onChange={(v) => setPago("streaming", v)} cartao={fixas.streaming?.noCartao} />}
            {Number(fixas.academia?.valor) > 0 && <CheckPago label="Academia" valor={fixas.academia?.valor || 0} pago={pagamentos["academia"]} onChange={(v) => setPago("academia", v)} cartao={fixas.academia?.noCartao} />}
            {Number(fixas.seguro?.valor) > 0 && <CheckPago label="Seguro" valor={fixas.seguro?.valor || 0} pago={pagamentos["seguro"]} onChange={(v) => setPago("seguro", v)} cartao={fixas.seguro?.noCartao} />}
            {Number(fixas.convenio?.valor) > 0 && !fixas.convenio?.descontaFolha && <CheckPago label="Convênio / Plano de saúde" valor={fixas.convenio?.valor || 0} pago={pagamentos["convenio"]} onChange={(v) => setPago("convenio", v)} />}
            {Number(fixas.farmacia) > 0 && <CheckPago label="Farmácia" valor={fixas.farmacia} pago={pagamentos["farmacia"]} onChange={(v) => setPago("farmacia", v)} />}
            {Number(fixas.pet?.valor) > 0 && <CheckPago label="Pet" valor={fixas.pet?.valor || 0} pago={pagamentos["pet"]} onChange={(v) => setPago("pet", v)} />}
            {Number(fixas.cabelo) > 0 && <CheckPago label="Cabelo / Estética" valor={fixas.cabelo} pago={pagamentos["cabelo"]} onChange={(v) => setPago("cabelo", v)} />}
            {Number(fixas.pensao) > 0 && <CheckPago label="Pensão paga" valor={fixas.pensao} pago={pagamentos["pensao"]} onChange={(v) => setPago("pensao", v)} />}
            {(fixas.contasExtras || []).map((e) => (
              Number(e.valor) > 0 && <CheckPago key={e.id} label={e.nome || "Conta extra"} valor={e.valor || 0} pago={pagamentos[`extra_${e.id}`]} onChange={(v) => setPago(`extra_${e.id}`, v)} cartao={e.noCartao} />
            ))}
          </div>

          {/* CARTÕES */}
          {(data.cartoes || []).length > 0 && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, letterSpacing: 1, marginBottom: 10 }}>CARTÕES</div>
              {(data.cartoes || []).map((c) => (
                Number(c.faturaAtual) > 0 && <CheckPago key={c.id} label={c.nome || "Cartão"} valor={c.faturaAtual || 0} pago={pagamentos[`cartao_${c.id}`]} onChange={(v) => setPago(`cartao_${c.id}`, v)} />
              ))}
            </div>
          )}

          {/* OUTRAS CONTAS DO MÊS */}
          {outrasContasMes.length > 0 && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, letterSpacing: 1, marginBottom: 10 }}>OUTRAS CONTAS</div>
              {outrasContasMes.map((o) => (
                Number(o.parcela) > 0 && <CheckPago key={o.id} label={o.nome || o.tipo || "Conta"} valor={o.parcela || 0} pago={pagamentos[`outra_${o.id}`]} onChange={(v) => setPago(`outra_${o.id}`, v)} />
              ))}
            </div>
          )}

          {/* DIAGNÓSTICO */}
          <SaudeFinanceiraDiagnostico data={data} linhaMes={linhaMes} />
        </div>
      )}

      {aba === "distribuicao" && <SaudeFinanceiraDistribuicao data={data} />}
      {aba === "extrato" && <ExtratoFuturo data={data} readOnly={readOnly} isAdmin={isAdmin} isAluno={isAluno} targetUserId={targetUserId} />}
      {aba === "resumo" && <SaudeFinanceiraResumo data={data} />}
    </div>
  );
}

// Helper pra calcular total já pago
function calcularPago(pagamentos, data, mes) {
  const fixas = data.contasFixas || {};
  let total = 0;
  const map = {
    "moradia": fixas.moradia?.valor,
    "condominio": fixas.condominio,
    "agua": fixas.agua,
    "luz": fixas.luz,
    "gas": fixas.gas,
    "mercado": fixas.mercado,
    "celular": fixas.celular,
    "internet": fixas.internet,
    "uber": fixas.uber,
    "transporte": fixas.transporte?.valor,
    "streaming": fixas.streaming?.valor,
    "academia": fixas.academia?.valor,
    "seguro": fixas.seguro?.valor,
    "convenio": fixas.convenio?.valor,
    "farmacia": fixas.farmacia,
    "pet": fixas.pet?.valor,
    "cabelo": fixas.cabelo,
    "pensao": fixas.pensao,
    "salario": data.entradas?.salario,
  };
  Object.entries(map).forEach(([k, v]) => { if (pagamentos[k]) total += Number(v || 0); });
  (fixas.contasExtras || []).forEach((e) => { if (pagamentos[`extra_${e.id}`]) total += Number(e.valor || 0); });
  (data.cartoes || []).forEach((c) => { if (pagamentos[`cartao_${c.id}`]) total += Number(c.faturaAtual || 0); });
  (data.outrasContas || []).filter(o => !o.mesPagamento || o.mesPagamento === mes).forEach((o) => { if (pagamentos[`outra_${o.id}`]) total += Number(o.parcela || 0); });
  (data.entradas?.extras || []).forEach((e) => { if (pagamentos[`entrada_${e.id}`]) total += Number(e.valor || 0); });
  return total;
}