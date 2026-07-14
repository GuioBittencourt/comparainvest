"use client";
import { useState } from "react";
import { C, MN, FN } from "../lib/theme";
import { formatarBRL } from "./SaudeFinanceiraModel";

const mesAtual = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
};

function CheckPago({ label, valor, pago, onChange, tag = null }) {
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
          {label}
          {tag && <span style={{ fontSize: 9, color: C.textMuted, marginLeft: 6, fontFamily: MN }}>({tag})</span>}
        </span>
      </div>
      <span style={{ fontFamily: MN, fontSize: 12, color: pago ? C.accent : C.textDim, whiteSpace: "nowrap" }}>
        {formatarBRL(valor)}
      </span>
    </div>
  );
}

export default function SaudeFinanceiraMesVigente({ data, linhaMesVigente, readOnly = false }) {
  const mes = mesAtual();
  const [pagamentos, setPagamentos] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`sf_pagamentos_${mes}`) || "{}"); } catch { return {}; }
  });

  const setPago = (chave, valor) => {
    const novo = { ...pagamentos, [chave]: valor };
    setPagamentos(novo);
    try { localStorage.setItem(`sf_pagamentos_${mes}`, JSON.stringify(novo)); } catch {}
  };

  const fixas = data.contasFixas || {};
  const num = (v) => Number(v) || 0;

  // Calcula total pago
  let totalPago = 0;
  const contasList = [
    // Contas fixas padrão
    { chave: "moradia", label: `Moradia (${fixas.moradia?.tipo || ""})`, valor: num(fixas.moradia?.valor) },
    { chave: "condominio", label: "Condomínio", valor: num(fixas.condominio) },
    { chave: "agua", label: "Água", valor: num(fixas.agua) },
    { chave: "luz", label: "Luz", valor: num(fixas.luz) },
    { chave: "gas", label: "Gás", valor: num(fixas.gas) },
    { chave: "mercado", label: "Mercado", valor: num(fixas.mercado) },
    { chave: "transporte", label: `Transporte (${fixas.transporte?.tipo || ""})`, valor: num(fixas.transporte?.valor) },
    { chave: "uber", label: "Uber / apps", valor: num(fixas.uber) },
    { chave: "celular", label: "Celular", valor: num(fixas.celular) },
    { chave: "internet", label: "Internet", valor: num(fixas.internet) },
    { chave: "streaming", label: "Streaming", valor: num(fixas.streaming?.valor), tag: fixas.streaming?.noCartao ? "cartão" : null },
    { chave: "academia", label: "Academia", valor: num(fixas.academia?.valor), tag: fixas.academia?.noCartao ? "cartão" : null },
    { chave: "seguro", label: "Seguro", valor: num(fixas.seguro?.valor), tag: fixas.seguro?.noCartao ? "cartão" : null },
    { chave: "convenio", label: "Convênio / Plano de saúde", valor: fixas.convenio?.descontaFolha ? 0 : num(fixas.convenio?.valor) },
    { chave: "farmacia", label: "Farmácia", valor: num(fixas.farmacia) },
    { chave: "pet", label: "Pet", valor: num(fixas.pet?.valor) },
    { chave: "cabelo", label: "Cabelo / Estética", valor: num(fixas.cabelo) },
    { chave: "pensao", label: "Pensão paga", valor: num(fixas.pensao) },
    // Extras
    ...(fixas.contasExtras || []).map(e => ({ chave: `extra_${e.id}`, label: e.nome || "Conta extra", valor: num(e.valor), tag: e.noCartao ? "cartão" : null })),
  ].filter(c => c.valor > 0);

  // Cartões
  const cartoesList = (data.cartoes || []).filter(c => num(c.faturaAtual) > 0).map(c => ({
    chave: `cartao_${c.id}`, label: c.nome || "Cartão", valor: num(c.faturaAtual)
  }));

  // Outras contas do mês
  const outrasContasMes = (data.outrasContas || [])
    .filter(o => !o.mesPagamento || o.mesPagamento === mes)
    .filter(o => num(o.parcela) > 0)
    .map(o => ({ chave: `outra_${o.id}`, label: o.nome || o.tipo || "Conta", valor: num(o.parcela) }));

  // Calcula total pago de todas as listas
  [...contasList, ...cartoesList, ...outrasContasMes].forEach(c => {
    if (pagamentos[c.chave]) totalPago += c.valor;
  });

  const saldoInicial = num(linhaMesVigente?.saldoInicial) || 0;
  const entradas = num(linhaMesVigente?.entradas) || 0;
  const gestaoAtiva = num(linhaMesVigente?.gestaoAtiva) || 0;
  const totalFixasOrcamento = num(linhaMesVigente?.fixas) + num(linhaMesVigente?.cartoes) + num(linhaMesVigente?.outrasContas);
  const emAberto = totalFixasOrcamento - totalPago;
  const disponivelAtual = saldoInicial + entradas - totalPago - gestaoAtiva;

  return (
    <div style={{ marginTop: 16 }}>
      {/* Card saldo estimado */}
      <div style={{
        background: disponivelAtual >= 0 ? "linear-gradient(135deg,#0D3320,#0D1117)" : "linear-gradient(135deg,#3d0d0d,#0D1117)",
        border: `1px solid ${disponivelAtual >= 0 ? C.accentBorder : C.red+"40"}`,
        borderRadius: 16, padding: 18, marginBottom: 14,
      }}>
        <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, letterSpacing: 1 }}>
          SALDO ESTIMADO — {new Date().toLocaleString("pt-BR", { month: "long", year: "numeric" }).toUpperCase()}
        </div>
        <div style={{ fontFamily: MN, fontSize: 28, fontWeight: 800, color: disponivelAtual >= 0 ? C.accent : C.red, marginTop: 4 }}>
          {formatarBRL(disponivelAtual)}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: C.textDim }}>Já pago: {formatarBRL(totalPago)}</span>
          <span style={{ fontSize: 10, color: C.textDim }}>Gestão Ativa gasto: {formatarBRL(gestaoAtiva)}</span>
          <span style={{ fontSize: 10, color: C.textMuted }}>Em aberto: {formatarBRL(Math.max(0, emAberto))}</span>
          <span style={{ fontSize: 10, color: C.textMuted }}>Disponível atual: {formatarBRL(disponivelAtual)}</span>
        </div>
      </div>

      {/* Contas fixas */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, letterSpacing: 1, marginBottom: 10 }}>
          CONTAS FIXAS — MARQUE O QUE JÁ PAGOU
        </div>
        {contasList.map(c => (
          <CheckPago key={c.chave} label={c.label} valor={c.valor} pago={pagamentos[c.chave]} onChange={v => setPago(c.chave, v)} tag={c.tag} />
        ))}
      </div>

      {/* Cartões */}
      {cartoesList.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, letterSpacing: 1, marginBottom: 10 }}>CARTÕES</div>
          {cartoesList.map(c => (
            <CheckPago key={c.chave} label={c.label} valor={c.valor} pago={pagamentos[c.chave]} onChange={v => setPago(c.chave, v)} />
          ))}
        </div>
      )}

      {/* Outras contas do mês */}
      {outrasContasMes.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, letterSpacing: 1, marginBottom: 10 }}>OUTRAS CONTAS</div>
          {outrasContasMes.map(c => (
            <CheckPago key={c.chave} label={c.label} valor={c.valor} pago={pagamentos[c.chave]} onChange={v => setPago(c.chave, v)} />
          ))}
        </div>
      )}

      {/* Gestão Ativa */}
      {gestaoAtiva > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, letterSpacing: 1, marginBottom: 6 }}>GESTÃO ATIVA — VARIÁVEIS DO MÊS</div>
          {Object.entries((data._gestaoAtivaResumo || {})).map(([cat, val]) => (
            <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.textDim }}>{cat}</span>
              <span style={{ fontFamily: MN, fontSize: 12, color: C.textDim }}>{formatarBRL(val)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8 }}>
            <span style={{ fontSize: 12, color: C.white, fontWeight: 700 }}>Total gasto</span>
            <span style={{ fontFamily: MN, fontSize: 13, fontWeight: 800, color: C.red }}>{formatarBRL(gestaoAtiva)}</span>
          </div>
          <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>
            Limite: {formatarBRL(num(linhaMesVigente?.diversao))}
          </div>
        </div>
      )}
    </div>
  );
}
