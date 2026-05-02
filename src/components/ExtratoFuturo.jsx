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

function getCellColor(rowKey, value) {
  if (rowKey === "valorQuitacoes" && Number(value) > 0) return C.accent;
  if (["saldoInicial", "saldoFinal"].includes(rowKey)) return Number(value) < 0 ? C.red : C.accent;
  if (["fixas","cartoes","outrasContas","diversao","valorQuitacoes"].includes(rowKey) && Number(value) > 0) return C.textDim;
  return C.white;
}

function MiniCard({ label, value }) {
  return (
    <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: 13 }}>
      <div style={{ color: C.textMuted, fontSize: 10, fontFamily: MN, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ color: C.white, fontSize: 18, fontWeight: 800, marginTop: 4 }}>{value}</div>
    </div>
  );
}

// Mês isolado — lista simples nome | valor, igual imagem 4
function MesFiltradoCard({ linha, ajustes, setInvestimentoManual }) {
  const isSaldo = (k) => ["saldoInicial","saldoFinal"].includes(k);
  const isBold = (k) => ["saldoInicial","saldoFinal"].includes(k);

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{
        display: "inline-block", marginBottom: 12,
        padding: "4px 12px", borderRadius: 999,
        background: linha.zonaArrebentacao ? `${C.yellow}15` : `${C.accent}10`,
        border: `1px solid ${linha.zonaArrebentacao ? C.yellow+"50" : C.accentBorder}`,
        color: linha.zonaArrebentacao ? C.yellow : C.accent,
        fontSize: 11, fontFamily: MN, fontWeight: 700,
      }}>
        {linha.label}{linha.zonaArrebentacao ? " — ATENÇÃO" : ""}
      </div>

      <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
        {ROWS.map((row, i) => (
          <div key={row.key} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "11px 16px",
            borderBottom: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 13, color: isBold(row.key) ? C.white : C.textDim, fontWeight: isBold(row.key) ? 700 : 400 }}>
              {row.label}
            </span>
            <span style={{ fontFamily: MN, fontSize: 13, fontWeight: isBold(row.key) ? 700 : 500, color: getCellColor(row.key, linha[row.key]) }}>
              {formatarBRL(linha[row.key])}
            </span>
          </div>
        ))}

        {/* Ajustar investimento */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 13, color: C.textDim }}>Ajustar investimento</span>
          <input
            type="number"
            value={ajustes[linha.mes]?.investimentoManual ? ajustes[linha.mes]?.investimento : ""}
            onChange={(e) => setInvestimentoManual(linha.mes, e.target.value)}
            placeholder={String(Math.round(linha.investimento || 0))}
            style={{
              width: 100, background: C.bg, border: `1px solid ${C.border}`,
              borderRadius: 8, color: C.white, padding: "5px 8px",
              fontFamily: MN, fontSize: 13, textAlign: "right",
            }}
          />
        </div>

        {/* Ação estratégica */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px" }}>
          <span style={{ fontSize: 13, color: C.textDim }}>Ação estratégica</span>
          <span style={{ fontSize: 13, fontFamily: MN, color: linha.quitacoes?.length ? C.accent : linha.investimento > 0 ? C.blue : C.textMuted, textAlign: "right", maxWidth: "60%" }}>
            {linha.quitacoes?.length
              ? `Quitar ${linha.quitacoes.map((q) => q.nome).join(", ")}${linha.investimento > 0 ? ` e Investir ${formatarBRL(linha.investimento)}` : ""}`
              : linha.investimento > 0
                ? `Investir ${formatarBRL(linha.investimento)}`
                : "Segurar caixa"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ExtratoFuturo({ data }) {
  const [ajustes, setAjustes] = useState({});
  const [filtroMes, setFiltroMes] = useState(null);

  const linhas = useMemo(() => gerarExtratoFuturo(data, ajustes), [data, ajustes]);
  const resumo = useMemo(() => resumoExtratoFuturo(data, ajustes), [data, ajustes]);

  const setInvestimentoManual = (mes, valor) => {
    setAjustes((p) => ({
      ...p,
      [mes]: { ...(p[mes] || {}), investimento: Number(valor) || 0, investimentoManual: true },
    }));
  };

  const linhaFiltrada = filtroMes ? linhas.find((l) => l.mes === filtroMes) : null;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18, boxSizing: "border-box", width: "100%", overflow: "hidden" }}>
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

      {/* Botões de filtro */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 16, paddingBottom: 4 }}>
        <button onClick={() => setFiltroMes(null)} style={{
          flexShrink: 0, padding: "6px 14px", borderRadius: 999, cursor: "pointer",
          border: `1px solid ${filtroMes === null ? C.accentBorder : C.border}`,
          background: filtroMes === null ? `${C.accent}14` : "transparent",
          color: filtroMes === null ? C.accent : C.textMuted,
          fontSize: 11, fontFamily: MN, fontWeight: 700, whiteSpace: "nowrap",
        }}>
          Panorama completo
        </button>
        {linhas.map((l) => (
          <button key={l.mes} onClick={() => setFiltroMes(l.mes)} style={{
            flexShrink: 0, padding: "6px 12px", borderRadius: 999, cursor: "pointer",
            border: `1px solid ${filtroMes === l.mes ? C.accentBorder : l.zonaArrebentacao ? C.yellow+"50" : C.border}`,
            background: filtroMes === l.mes ? `${C.accent}14` : "transparent",
            color: filtroMes === l.mes ? C.accent : l.zonaArrebentacao ? C.yellow : C.textMuted,
            fontSize: 11, fontFamily: MN, whiteSpace: "nowrap",
          }}>
            {l.label}{l.zonaArrebentacao ? " !" : ""}
          </button>
        ))}
      </div>

      {/* Panorama completo (tabela) OU mês isolado (lista) */}
      {linhaFiltrada ? (
        <MesFiltradoCard
          linha={linhaFiltrada}
          ajustes={ajustes}
          setInvestimentoManual={setInvestimentoManual}
        />
      ) : (
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1180, fontFamily: FN }}>
            <thead>
              <tr>
                <th style={thLeft}>Categoria</th>
                {linhas.map((l) => (
                  <th key={l.mes} style={{ ...th, background: l.zonaArrebentacao ? `${C.yellow}0D` : "transparent" }}>
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
                  {linhas.map((l) => (
                    <td key={`${row.key}-${l.mes}`} style={{ ...td, color: getCellColor(row.key, l[row.key]) }}>
                      {formatarBRL(l[row.key])}
                    </td>
                  ))}
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
      )}

      <div style={{ marginTop: 14, border: `1px solid ${C.border}`, background: C.cardAlt, borderRadius: 14, padding: 12, color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>
        O motor já faz quitações automaticamente quando há caixa suficiente e direciona a sobra para investimento, mantendo uma reserva mínima. Se você remover uma quitação no futuro, ela volta a virar parcela normal no financeiro.
      </div>
    </div>
  );
}

const th = { textAlign: "right", color: C.textMuted, fontFamily: MN, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, padding: "10px 8px", borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" };
const thLeft = { ...th, textAlign: "left", position: "sticky", left: 0, background: C.card, zIndex: 2 };
const td = { textAlign: "right", padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", color: C.textDim, fontSize: 12, whiteSpace: "nowrap" };
const tdLeft = { ...td, textAlign: "left", color: C.white, fontWeight: 800, position: "sticky", left: 0, background: C.card, zIndex: 1 };
const inputMini = { width: 82, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, color: C.white, padding: "8px 8px", fontFamily: MN, fontSize: 12, textAlign: "right" };
