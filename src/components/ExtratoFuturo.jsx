"use client";
import { useMemo, useState } from "react";
import { C, FN, MN } from "../lib/theme";
import { formatarBRL } from "./SaudeFinanceiraModel";
import { gerarExtratoFuturo, resumoExtratoFuturo } from "./ExtratoFuturoEngine";

const ROWS = [
  { key: "saldoInicial", label: "Saldo inicial" },
  { key: "entradas", label: "Entradas" },
  { key: "fixas", label: "Contas fixas" },
  { key: "cartoes", label: "Cartões" },
  { key: "outrasContas", label: "Outras contas" },
  { key: "diversao", label: "Diversão" },
  { key: "valorQuitacoes", label: "Quitações" },
  { key: "investimento", label: "Investimento" },
  { key: "saldoFinal", label: "Saldo final" },
];

function MiniCard({ label, value }) {
  return (
    <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: 13 }}>
      <div style={{ color: C.textMuted, fontSize: 10, fontFamily: MN, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ color: C.white, fontSize: 18, fontWeight: 800, marginTop: 4 }}>{value}</div>
    </div>
  );
}

// ── View mobile: cards mês a mês ───────────────────────────────────────────────
function ExtratoMobile({ linhas, ajustes, setInvestimentoManual }) {
  const [mesIdx, setMesIdx] = useState(0);
  const l = linhas[mesIdx];
  if (!l) return null;

  const rows = [
    { key: "saldoInicial", label: "Saldo inicial", isSaldo: true },
    { key: "entradas", label: "Entradas" },
    { key: "fixas", label: "Contas fixas", danger: true },
    { key: "cartoes", label: "Cartões", danger: true },
    { key: "outrasContas", label: "Outras contas", danger: true },
    { key: "diversao", label: "Diversão", danger: true },
    { key: "valorQuitacoes", label: "Quitações", isQuitacao: true },
    { key: "investimento", label: "Investimento" },
    { key: "saldoFinal", label: "Saldo final", isSaldo: true },
  ];

  return (
    <div style={{ marginTop: 16 }}>
      {/* Navegação meses */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }}>
        {linhas.map((m, i) => (
          <button
            key={m.mes}
            onClick={() => setMesIdx(i)}
            style={{
              flexShrink: 0,
              padding: "6px 12px",
              borderRadius: 999,
              border: `1px solid ${i === mesIdx ? C.accentBorder : C.border}`,
              background: i === mesIdx ? `${C.accent}14` : "transparent",
              color: i === mesIdx ? C.accent : C.textMuted,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: MN,
            }}
          >
            {m.label}
            {m.zonaArrebentacao && <span style={{ color: C.yellow, marginLeft: 4, fontSize: 9 }}>!</span>}
          </button>
        ))}
      </div>

      {/* Card do mês */}
      <div style={{ background: C.cardAlt, border: `1px solid ${l.zonaArrebentacao ? C.yellow + "40" : C.border}`, borderRadius: 16, padding: 16 }}>
        <div style={{ fontSize: 12, color: C.textMuted, fontFamily: MN, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
          {l.label} {l.zonaArrebentacao && <span style={{ color: C.yellow }}>— ATENÇÃO</span>}
        </div>
        {rows.map((row) => {
          const value = l[row.key];
          const color = row.isQuitacao && Number(value) > 0
            ? C.accent
            : row.isSaldo
              ? (Number(value) < 0 ? C.red : C.accent)
              : row.danger && Number(value) > 0
                ? C.textDim
                : C.white;
          return (
            <div key={row.key} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 13, color: row.isSaldo ? C.white : C.textDim, fontWeight: row.isSaldo ? 700 : 400 }}>{row.label}</span>
              <span style={{ fontFamily: MN, fontSize: 13, color, fontWeight: row.isSaldo ? 700 : 400 }}>{formatarBRL(value)}</span>
            </div>
          );
        })}

        {/* Ajuste investimento */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 13, color: C.textDim }}>Ajustar investimento</span>
          <input
            type="number"
            value={ajustes[l.mes]?.investimentoManual ? ajustes[l.mes]?.investimento : ""}
            onChange={(e) => setInvestimentoManual(l.mes, e.target.value)}
            placeholder={String(Math.round(l.investimento || 0))}
            style={{ width: 90, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, color: C.white, padding: "7px 8px", fontFamily: MN, fontSize: 12, textAlign: "right" }}
          />
        </div>

        {/* Ação estratégica */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
          <span style={{ fontSize: 13, color: C.textDim }}>Ação estratégica</span>
          <span style={{ fontSize: 13, color: l.quitacoes?.length ? C.accent : l.investimento > 0 ? C.blue : C.textMuted }}>
            {l.quitacoes?.length
              ? l.quitacoes.map((q) => q.nome).join(", ")
              : l.investimento > 0
                ? "investir sobra"
                : "segurar caixa"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── View desktop: tabela completa ─────────────────────────────────────────────
function ExtratoDesktop({ linhas, ajustes, setInvestimentoManual }) {
  return (
    <div style={{ overflowX: "auto", marginTop: 16 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1400, fontFamily: FN }}>
        <thead>
          <tr>
            <th style={thLeft}>Categoria</th>
            {linhas.map((l, idx) => (
              <th key={l.mes} style={{ ...th, background: idx < 3 ? `${C.yellow}0D` : "transparent" }}>
                {l.label}
                {l.zonaArrebentacao && <div style={{ color: C.yellow, fontSize: 9, marginTop: 3 }}>atenção</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key}>
              <td style={tdLeft}>{row.label}</td>
              {linhas.map((l) => {
                const value = l[row.key];
                const danger = ["fixas", "cartoes", "outrasContas", "diversao", "valorQuitacoes"].includes(row.key);
                const isSaldo = ["saldoInicial", "saldoFinal"].includes(row.key);
                const color = row.key === "valorQuitacoes" && Number(value) > 0
                  ? C.accent
                  : isSaldo
                    ? (Number(value) < 0 ? C.red : C.accent)
                    : danger && Number(value) > 0
                      ? C.textDim
                      : C.white;
                return (
                  <td key={`${row.key}-${l.mes}`} style={{ ...td, color }}>
                    {formatarBRL(value)}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <td style={tdLeft}>Ajustar investimento</td>
            {linhas.map((l) => (
              <td key={`input-${l.mes}`} style={td}>
                <input
                  type="number"
                  value={ajustes[l.mes]?.investimentoManual ? ajustes[l.mes]?.investimento : ""}
                  onChange={(e) => setInvestimentoManual(l.mes, e.target.value)}
                  placeholder={String(Math.round(l.investimento || 0))}
                  style={inputMini}
                />
              </td>
            ))}
          </tr>
          <tr>
            <td style={tdLeft}>Ação estratégica</td>
            {linhas.map((l) => (
              <td key={`acao-${l.mes}`} style={{ ...td, whiteSpace: "normal", minWidth: 110 }}>
                {l.quitacoes?.length ? (
                  <span style={{ color: C.accent }}>{l.quitacoes.map((q) => q.nome).join(", ")}</span>
                ) : l.investimento > 0 ? (
                  <span style={{ color: C.blue }}>investir sobra</span>
                ) : (
                  <span style={{ color: C.textMuted }}>segurar caixa</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function ExtratoFuturo({ data }) {
  const [ajustes, setAjustes] = useState({});
  const linhas = useMemo(() => gerarExtratoFuturo(data, ajustes), [data, ajustes]);
  const resumo = useMemo(() => resumoExtratoFuturo(data, ajustes), [data, ajustes]);

  const setInvestimentoManual = (mes, valor) => {
    setAjustes((p) => ({
      ...p,
      [mes]: { ...(p[mes] || {}), investimento: Number(valor) || 0, investimentoManual: true },
    }));
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    // No desktop: quebra o maxWidth do pai para usar mais da tela
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18, boxSizing: "border-box" }}>
        <h3 style={{ color: C.white, margin: 0, fontSize: 22 }}>Extrato Futuro</h3>
        <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, marginTop: 6 }}>
          Projeção estratégica de 13 meses. O saldo final de um mês vira automaticamente o saldo inicial do mês seguinte.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginTop: 14 }}>
          <MiniCard label="Quitações planejadas" value={formatarBRL(resumo.totalQuitado)} />
          <MiniCard label="Investido ao final" value={formatarBRL(resumo.totalInvestido)} />
          <MiniCard label="Virada financeira" value={resumo.primeiroMesPositivo || "ainda não"} />
        </div>

        <div style={{ marginTop: 14, border: `1px solid ${C.yellow}35`, background: `${C.yellow}10`, borderRadius: 14, padding: 12, color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>
          <strong style={{ color: C.yellow, fontFamily: MN, fontSize: 11, letterSpacing: 1 }}>ZONA DE ARREBENTAÇÃO</strong>
          <div style={{ marginTop: 4 }}>Os 3 primeiros meses exigem atenção máxima. É a fase de ajuste, corte de vazamentos e organização das primeiras quitações.</div>
        </div>

        {/* Mobile: cards | Desktop: tabela */}
        <div className="extrato-mobile" style={{ display: "none" }}>
          <ExtratoMobile linhas={linhas} ajustes={ajustes} setInvestimentoManual={setInvestimentoManual} />
        </div>
        <div className="extrato-desktop">
          <ExtratoDesktop linhas={linhas} ajustes={ajustes} setInvestimentoManual={setInvestimentoManual} />
        </div>

        <div style={{ marginTop: 14, border: `1px solid ${C.border}`, background: C.cardAlt, borderRadius: 14, padding: 12, color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>
          O motor já faz quitações automaticamente quando há caixa suficiente e direciona a sobra para investimento, mantendo uma reserva mínima. Se você remover uma quitação no futuro, ela volta a virar parcela normal no financeiro.
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .extrato-mobile { display: block !important; }
          .extrato-desktop { display: none !important; }
        }
        @media (min-width: 768px) {
          .extrato-mobile { display: none !important; }
          .extrato-desktop { display: block !important; }
        }
      `}</style>
    </div>
  );
}

const th = { textAlign: "right", color: C.textMuted, fontFamily: MN, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, padding: "10px 8px", borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" };
const thLeft = { ...th, textAlign: "left", position: "sticky", left: 0, background: C.card, zIndex: 2 };
const td = { textAlign: "right", padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", color: C.textDim, fontSize: 12, whiteSpace: "nowrap" };
const tdLeft = { ...td, textAlign: "left", color: C.white, fontWeight: 800, position: "sticky", left: 0, background: C.card, zIndex: 1 };
const inputMini = { width: 82, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, color: C.white, padding: "8px 8px", fontFamily: MN, fontSize: 12, textAlign: "right" };
