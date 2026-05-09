"use client";
// src/components/SaudeFinanceiraMesVigente.jsx
// View do mês vigente dentro do Extrato Futuro:
// - Contas fixas com check "Pago/Em aberto"
// - Categorias do Gestão Ativa em tempo real
// - Saldo atualizado em cadeia
// - Banner "Precisa de extra" se excesso não cabe

import { useState, useEffect } from "react";
import { C, FN, MN } from "../lib/theme";
import { formatarBRL } from "./SaudeFinanceiraModel";
import { lerGestaoAtivaMesAtual, calcularResumoGA } from "../lib/gestaoAtivaIntegracao";

const CHECKS_KEY = "comparai_sf_checks_mes";

function curMes() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function carregarChecks() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CHECKS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    // Só usa se for o mês atual
    if (parsed.mes !== curMes()) return { mes: curMes(), pagas: {} };
    return parsed;
  } catch {
    return { mes: curMes(), pagas: {} };
  }
}

function salvarChecks(checks) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(CHECKS_KEY, JSON.stringify(checks)); } catch {}
}

function CardConta({ label, valor, paga, onToggle, readOnly }) {
  return (
    <div
      onClick={readOnly ? undefined : onToggle}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "11px 14px",
        background: paga ? "rgba(16,185,129,0.06)" : C.cardAlt,
        border: `1px solid ${paga ? C.accentBorder : C.border}`,
        borderRadius: 10,
        cursor: readOnly ? "default" : "pointer",
        transition: "all 0.15s ease",
        marginBottom: 6,
        opacity: paga ? 0.7 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 18, height: 18, borderRadius: 4,
          border: `2px solid ${paga ? C.accent : C.border}`,
          background: paga ? C.accent : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {paga && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#03130D" strokeWidth="2" strokeLinecap="round"/></svg>}
        </div>
        <span style={{ fontSize: 13, color: paga ? C.textMuted : C.white, textDecoration: paga ? "line-through" : "none" }}>{label}</span>
      </div>
      <span style={{ fontFamily: MN, fontSize: 13, color: paga ? C.textMuted : C.text }}>{formatarBRL(valor)}</span>
    </div>
  );
}

function CardGA({ cat, gasto, limite }) {
  const restante = limite - gasto;
  const pct = limite > 0 ? Math.min((gasto / limite) * 100, 150) : 0;
  const estourado = restante < 0;

  return (
    <div style={{
      padding: "11px 14px",
      background: C.cardAlt,
      border: `1px solid ${estourado ? C.red + "40" : C.border}`,
      borderRadius: 10,
      marginBottom: 6,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: C.white }}>{cat.label}</span>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: MN, fontSize: 13, color: estourado ? C.red : C.accent }}>
            {estourado ? `-${formatarBRL(Math.abs(restante))}` : formatarBRL(restante)}
          </span>
          <div style={{ fontSize: 9, color: C.textMuted }}>{estourado ? "estourado" : "restante"}</div>
        </div>
      </div>
      <div style={{ height: 3, background: C.border, borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 2,
          background: pct > 90 ? C.red : pct > 70 ? C.yellow : C.accent,
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 9, color: C.textMuted }}>Gasto: {formatarBRL(gasto)}</span>
        <span style={{ fontSize: 9, color: C.textMuted }}>Limite: {formatarBRL(limite)}</span>
      </div>
    </div>
  );
}

export default function SaudeFinanceiraMesVigente({ data, linhaMesVigente, readOnly = false }) {
  const [checks, setChecks] = useState(() => carregarChecks());
  const [gaData, setGaData] = useState(null);

  useEffect(() => {
    setGaData(lerGestaoAtivaMesAtual());
  }, []);

  const togglePago = (contaId) => {
    if (readOnly) return;
    setChecks((prev) => {
      const novas = {
        ...prev,
        pagas: { ...prev.pagas, [contaId]: !prev.pagas?.[contaId] },
      };
      salvarChecks(novas);
      return novas;
    });
  };

  const pagas = checks.pagas || {};

  // Monta lista de contas fixas a partir dos dados do questionário
  const cf = data?.contasFixas || {};
  const n = (v) => typeof v === "object" && v !== null && "valor" in v ? Number(v.valor) || 0 : Number(v || 0);

  const contasFixasLista = [
    { id: "moradia", label: cf.moradia?.tipo === "financiamento" ? "Financiamento" : "Aluguel / Moradia", valor: n(cf.moradia) },
    { id: "condominio", label: "Condomínio", valor: n(cf.condominio) },
    { id: "agua", label: "Água", valor: n(cf.agua) },
    { id: "luz", label: "Luz", valor: n(cf.luz) },
    { id: "gas", label: "Gás", valor: n(cf.gas) },
    { id: "celular", label: "Celular", valor: n(cf.celular) },
    { id: "internet", label: "Internet", valor: n(cf.internet) },
    { id: "convenio", label: "Convênio / Plano de saúde", valor: cf.convenio?.descontaFolha ? 0 : n(cf.convenio) },
    { id: "streaming", label: "Streaming", valor: cf.streaming?.noCartao ? 0 : n(cf.streaming) },
    { id: "academia", label: "Academia", valor: cf.academia?.noCartao ? 0 : n(cf.academia) },
    { id: "pensao", label: "Pensão alimentícia", valor: n(cf.pensaoPaga) },
    { id: "educacao", label: cf.educacao?.descricao || "Educação / Curso", valor: n(cf.educacao) },
    { id: "seguro", label: "Seguro", valor: cf.seguro?.noCartao ? 0 : n(cf.seguro) },
    ...(cf.outros || []).filter((o) => !o.quitavel && !o.noCartao && n(o.valor) > 0).map((o) => ({
      id: o.id, label: o.nome || "Conta fixa", valor: n(o.valor),
    })),
  ].filter((c) => c.valor > 0);

  // Resumo GA
  const gaResumo = calcularResumoGA(gaData);
  const gaAtivo = gaData && (gaData.categories || []).length > 0;

  // Cálculo do saldo em cadeia
  const entradas = linhaMesVigente?.entradas || 0;
  const saldoInicial = linhaMesVigente?.saldoInicial || 0;

  const totalFixasPagas = contasFixasLista.filter((c) => pagas[c.id]).reduce((s, c) => s + c.valor, 0);
  const totalFixasEmAberto = contasFixasLista.filter((c) => !pagas[c.id]).reduce((s, c) => s + c.valor, 0);
  const totalGA = gaAtivo ? gaResumo.totalGasto : 0;
  const outrasContas = linhaMesVigente?.outrasContas || 0;
  const diversao = linhaMesVigente?.diversao || 0;
  const quitacoes = linhaMesVigente?.valorQuitacoes || 0;
  const investimento = linhaMesVigente?.investimento || 0;

  const saldoAtualizado = saldoInicial + entradas - totalFixasPagas - totalGA - outrasContas;
  const comprometimentoTotal = totalFixasEmAberto + outrasContas + diversao + quitacoes + investimento;
  const saldoFinalEstimado = saldoAtualizado - comprometimentoTotal;
  const precisaExtra = linhaMesVigente?.precisaExtra || false;

  const mesAtual = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div style={{ marginTop: 16 }}>
      {/* Banner precisa de extra */}
      {precisaExtra && (
        <div style={{
          padding: "14px 16px", marginBottom: 16,
          background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(10,18,28,0.96))",
          border: `1px solid ${C.red}40`, borderRadius: 14,
        }}>
          <div style={{ fontFamily: MN, fontSize: 10, color: C.red, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
            ⚠ ATENÇÃO — PRECISA DE EXTRA
          </div>
          <p style={{ fontSize: 13, color: C.white, margin: "0 0 6px", lineHeight: 1.6 }}>
            Os gastos deste mês ultrapassaram o orçamento e não foi possível cobrir nem cortando diversão e investimentos.
          </p>
          <p style={{ fontSize: 12, color: C.textDim, margin: 0, lineHeight: 1.6 }}>
            Você precisa fazer uma renda extra este mês — vender algo, fazer um bico, revender. É urgente.
          </p>
        </div>
      )}

      {/* Saldo em cadeia */}
      <div style={{
        padding: "16px 18px", marginBottom: 16,
        background: saldoFinalEstimado >= 0
          ? "linear-gradient(135deg, rgba(16,185,129,0.10), rgba(10,18,28,0.96))"
          : "linear-gradient(135deg, rgba(239,68,68,0.10), rgba(10,18,28,0.96))",
        border: `1px solid ${saldoFinalEstimado >= 0 ? C.accentBorder : C.red + "40"}`,
        borderRadius: 14,
      }}>
        <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
          Saldo estimado — {mesAtual}
        </div>
        <div style={{ fontFamily: MN, fontSize: 28, fontWeight: 800, color: saldoFinalEstimado >= 0 ? C.accent : C.red, letterSpacing: -0.5 }}>
          {formatarBRL(saldoFinalEstimado)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
          <div style={{ fontSize: 11, color: C.textDim }}>Já paguei: <strong style={{ color: C.white }}>{formatarBRL(totalFixasPagas + totalGA)}</strong></div>
          <div style={{ fontSize: 11, color: C.textDim }}>Em aberto: <strong style={{ color: C.yellow }}>{formatarBRL(totalFixasEmAberto)}</strong></div>
          <div style={{ fontSize: 11, color: C.textDim }}>Gestão Ativa gasto: <strong style={{ color: gaResumo.excesso > 0 ? C.red : C.white }}>{formatarBRL(totalGA)}</strong></div>
          <div style={{ fontSize: 11, color: C.textDim }}>Disponível atual: <strong style={{ color: saldoAtualizado >= 0 ? C.accent : C.red }}>{formatarBRL(saldoAtualizado)}</strong></div>
        </div>
      </div>

      {/* Contas fixas com check */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Contas Fixas — marque o que já pagou
        </div>
        {contasFixasLista.map((conta) => (
          <CardConta
            key={conta.id}
            label={conta.label}
            valor={conta.valor}
            paga={!!pagas[conta.id]}
            onToggle={() => togglePago(conta.id)}
            readOnly={readOnly}
          />
        ))}
        {contasFixasLista.length === 0 && (
          <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center", padding: 16 }}>Nenhuma conta fixa cadastrada.</div>
        )}
      </div>

      {/* Gestão Ativa em tempo real */}
      {gaAtivo && (
        <div>
          <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            Gestão Ativa — variáveis do mês
          </div>
          {(gaData.categories || []).map((cat) => {
            const gasto = (gaData.expenses || []).filter((e) => e.categoryId === cat.id).reduce((s, e) => s + e.value, 0);
            return <CardGA key={cat.id} cat={cat} gasto={gasto} limite={cat.limit || 0} />;
          })}
          {gaResumo.excesso > 0 && (
            <div style={{ padding: "10px 14px", background: `${C.red}0D`, border: `1px solid ${C.red}30`, borderRadius: 10, fontSize: 12, color: C.red, marginTop: 4 }}>
              Excesso de {formatarBRL(gaResumo.excesso)} nas variáveis — abatendo de diversão e investimentos.
            </div>
          )}
        </div>
      )}

      {!gaAtivo && (
        <div style={{ padding: "12px 14px", background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12, color: C.textDim }}>
          Nenhuma categoria no Gestão Ativa ainda. Adicione categorias para controlar seus gastos variáveis em tempo real.
        </div>
      )}
    </div>
  );
}
