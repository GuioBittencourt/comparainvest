"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import SaudeFinanceiraMesVigente from "./SaudeFinanceiraMesVigente";
import { C, FN, MN } from "../lib/theme";
import { formatarBRL } from "./SaudeFinanceiraModel";
import { gerarExtratoFuturo, resumoExtratoFuturo } from "./ExtratoFuturoEngine";

const ROWS = [
  { key: "saldoInicial", label: "Saldo inicial", editavel: false },
  { key: "entradas", label: "Entradas", editavel: true },
  { key: "fixas", label: "Contas fixas", editavel: false },
  { key: "cartoes", label: "Cartões", editavel: false },
  { key: "outrasContas", label: "Outras contas", editavel: false },
  { key: "diversao", label: "Diversão", editavel: true },
  { key: "valorQuitacoes", label: "Quitações", editavel: false },
  { key: "investimento", label: "Investimento", editavel: false },
  { key: "saldoFinal", label: "Saldo final", editavel: false },
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

function MesFiltradoCard({ linha, ajustes, setInvestimentoManual, setEntradasManual, setDiversaoManual }) {
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
        {ROWS.map((row) => (
          <div key={row.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 13, color: isBold(row.key) ? C.white : C.textDim, fontWeight: isBold(row.key) ? 700 : 400 }}>
              {row.label}
            </span>
            {row.editavel ? (
              <input
                type="number"
                defaultValue={Math.round(linha[row.key] || 0)}
                onChange={(e) => {
                  if (row.key === "entradas") setEntradasManual(linha.mes, e.target.value);
                  if (row.key === "diversao") setDiversaoManual(linha.mes, e.target.value);
                }}
                style={{ width: 110, background: C.bg, border: `1px solid ${C.accentBorder}`, borderRadius: 8, color: C.accent, padding: "5px 8px", fontFamily: MN, fontSize: 13, textAlign: "right" }}
              />
            ) : (
              <span style={{ fontFamily: MN, fontSize: 13, fontWeight: isBold(row.key) ? 700 : 500, color: getCellColor(row.key, linha[row.key]) }}>
                {formatarBRL(linha[row.key])}
              </span>
            )}
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
            style={{ width: 110, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, padding: "5px 8px", fontFamily: MN, fontSize: 13, textAlign: "right" }}
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

export default function ExtratoFuturo({ data, readOnly = false, isAdmin = false, isAluno = false, targetUserId = null, userId = null }) {
  const [ajustes, setAjustes] = useState({});
  const [ajustesCarregados, setAjustesCarregados] = useState(false);
  const uid = userId || targetUserId;

  useEffect(() => {
    if (!uid) return;
    import("../lib/supabase").then(({ supabase }) => {
      supabase.from("profiles").select("extrato_ajustes").eq("id", uid).single().then(({ data: p }) => {
        if (p?.extrato_ajustes && Object.keys(p.extrato_ajustes).length > 0) {
          setAjustes(p.extrato_ajustes);
        }
        setAjustesCarregados(true);
      });
    });
  }, [uid]);

  const salvarAjustes = useCallback(async (novosAjustes) => {
    if (!uid || !ajustesCarregados) return;
    const { supabase } = await import("../lib/supabase");
    await supabase.from("profiles").update({ extrato_ajustes: novosAjustes }).eq("id", uid);
  }, [uid, ajustesCarregados]);

  const [filtroMes, setFiltroMes] = useState(null);
const [linhasExtras, setLinhasExtras] = useState([]);
const [editandoLinhas, setEditandoLinhas] = useState(false);

  useEffect(() => {
    if (!isAdmin || !targetUserId) return;
    import("../lib/supabase").then(({ supabase }) => {
      supabase.from("extrato_linhas_extras").select("*").eq("user_id", targetUserId).then(({ data: rows }) => {
        if (rows?.length) setLinhasExtras(rows);
      });
    });
  }, [isAdmin, targetUserId]);

  const salvarLinhasExtras = async (novas) => {
    if (!isAdmin || !targetUserId) return;
    const { supabase } = await import("../lib/supabase");
    await supabase.from("extrato_linhas_extras").delete().eq("user_id", targetUserId);
    if (novas.length > 0) await supabase.from("extrato_linhas_extras").insert(novas.map(l => ({ ...l, user_id: targetUserId })));
  };

  const adicionarLinhaExtra = () => {
    const nova = { id: `extra_${Date.now()}`, nome: "Nova linha", valores: {}, tipo: "despesa" };
    const novas = [...linhasExtras, nova];
    setLinhasExtras(novas);
    salvarLinhasExtras(novas);
  };

  const removerLinhaExtra = (id) => {
    const novas = linhasExtras.filter(l => l.id !== id);
    setLinhasExtras(novas);
    salvarLinhasExtras(novas);
  };

  const atualizarLinhaExtra = (id, campo, valor) => {
    const novas = linhasExtras.map(l => l.id === id ? { ...l, [campo]: valor } : l);
    setLinhasExtras(novas);
    salvarLinhasExtras(novas);
  };

  const atualizarValorMes = (id, mes, valor) => {
    const novas = linhasExtras.map(l => l.id === id ? { ...l, valores: { ...l.valores, [mes]: Number(valor) || 0 } } : l);
    setLinhasExtras(novas);
    salvarLinhasExtras(novas);
  };

  const ajustesComExtras = useMemo(() => ({ ...ajustes, __linhasExtras: linhasExtras }), [ajustes, linhasExtras]);
  const linhas = useMemo(() => gerarExtratoFuturo(data, ajustesComExtras), [data, ajustesComExtras]);
  const resumo = useMemo(() => resumoExtratoFuturo(data, ajustesComExtras), [data, ajustesComExtras]);

  const setInvestimentoManual = (mes, valor) => {
  setAjustes((p) => {
    const novo = { ...p, [mes]: { ...(p[mes] || {}), investimento: Number(valor) || 0, investimentoManual: true } };
    salvarAjustes(novo);
    return novo;
  });
};
const setEntradasManual = (mes, valor) => {
  setAjustes((p) => {
    const novo = { ...p, [mes]: { ...(p[mes] || {}), entradas: Number(valor) || 0, entradasManual: true } };
    salvarAjustes(novo);
    return novo;
  });
};
const setDiversaoManual = (mes, valor) => {
  setAjustes((p) => {
    const novo = { ...p, [mes]: { ...(p[mes] || {}), diversao: Number(valor) || 0, diversaoManual: true } };
    salvarAjustes(novo);
    return novo;
  });
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

      {/* Painel linhas extras — ADM */}
      {isAdmin && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, textTransform: "uppercase", letterSpacing: 1 }}>Linhas extras ({linhasExtras.length})</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setEditandoLinhas(e => !e)} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 10, fontFamily: MN, cursor: "pointer", background: editandoLinhas ? `${C.accent}15` : "transparent", color: editandoLinhas ? C.accent : C.textMuted, border: `1px solid ${editandoLinhas ? C.accentBorder : C.border}` }}>
                {editandoLinhas ? "Fechar" : "Editar"}
              </button>
              {editandoLinhas && (
                <button onClick={adicionarLinhaExtra} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 10, fontFamily: MN, cursor: "pointer", background: `${C.accent}15`, color: C.accent, border: `1px solid ${C.accentBorder}` }}>+ Linha</button>
              )}
            </div>
          </div>
          {editandoLinhas && linhasExtras.length > 0 && (
            <div style={{ overflowX: "auto", marginBottom: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800, fontFamily: MN }}>
                <thead>
                  <tr>
                    <th style={{ ...thLeft, fontSize: 9 }}>Nome</th>
                    <th style={{ ...th, fontSize: 9 }}>Tipo</th>
                    {linhas.map(l => <th key={l.mes} style={{ ...th, fontSize: 9 }}>{l.label}</th>)}
                    <th style={{ ...th, fontSize: 9 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {linhasExtras.map(linha => (
                    <tr key={linha.id}>
                      <td style={tdLeft}>
                        <input value={linha.nome} onChange={e => atualizarLinhaExtra(linha.id, "nome", e.target.value)} style={{ width: 140, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, color: C.white, padding: "4px 6px", fontFamily: FN, fontSize: 11 }} />
                      </td>
                      <td style={td}>
                        <select value={linha.tipo || "despesa"} onChange={e => atualizarLinhaExtra(linha.id, "tipo", e.target.value)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, color: C.white, padding: "4px 6px", fontFamily: MN, fontSize: 10 }}>
                          <option value="despesa">Despesa</option>
                          <option value="receita">Receita</option>
                          <option value="quitacao">Quitação</option>
                        </select>
                      </td>
                      {linhas.map(l => (
                        <td key={`${linha.id}-${l.mes}`} style={td}>
                          <input type="number" value={linha.valores?.[l.mes] || ""} onChange={e => atualizarValorMes(linha.id, l.mes, e.target.value)} placeholder="0" style={{ ...inputMini, width: 70 }} />
                        </td>
                      ))}
                      <td style={td}>
                        <button onClick={() => { if (confirm(`Remover "${linha.nome}"?`)) removerLinhaExtra(linha.id); }} style={{ padding: "3px 7px", borderRadius: 5, fontSize: 9, cursor: "pointer", background: `${C.red}15`, color: C.red, border: `1px solid ${C.red}30` }}>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!editandoLinhas && linhasExtras.length > 0 && (
            <div style={{ fontSize: 11, color: C.textDim }}>{linhasExtras.map(l => l.nome).join(", ")} — clique em Editar para ajustar valores</div>
          )}
        </div>
      )}

      {/* Botões filtro */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 16, paddingBottom: 4 }}>
        <button onClick={() => setFiltroMes(null)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 999, cursor: "pointer", border: `1px solid ${filtroMes === null ? C.accentBorder : C.border}`, background: filtroMes === null ? `${C.accent}14` : "transparent", color: filtroMes === null ? C.accent : C.textMuted, fontSize: 11, fontFamily: MN, fontWeight: 700, whiteSpace: "nowrap" }}>
          Panorama completo
        </button>
        {linhas.map((l) => (
          <button key={l.mes} onClick={() => setFiltroMes(l.mes)} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 999, cursor: "pointer", border: `1px solid ${filtroMes === l.mes ? C.accentBorder : l.zonaArrebentacao ? C.yellow+"50" : C.border}`, background: filtroMes === l.mes ? `${C.accent}14` : "transparent", color: filtroMes === l.mes ? C.accent : l.zonaArrebentacao ? C.yellow : C.textMuted, fontSize: 11, fontFamily: MN, whiteSpace: "nowrap" }}>
            {l.label}{l.zonaArrebentacao ? " !" : ""}
          </button>
        ))}
      </div>

      {linhas[0]?.precisaExtra && (
        <div style={{ marginTop: 12, padding: "12px 16px", background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(10,18,28,0.96))", border: `1px solid ${C.red}40`, borderRadius: 14 }}>
          <div style={{ fontFamily: MN, fontSize: 10, color: C.red, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>⚠ PRECISA DE EXTRA</div>
          <p style={{ fontSize: 12, color: C.white, margin: 0, lineHeight: 1.6 }}>Os gastos deste mês ultrapassaram o orçamento. Você precisa fazer uma renda extra.</p>
        </div>
      )}

      {linhaFiltrada ? (
        <div>
          <MesFiltradoCard
            linha={linhaFiltrada}
            ajustes={ajustes}
            setInvestimentoManual={setInvestimentoManual}
            setEntradasManual={setEntradasManual}
            setDiversaoManual={setDiversaoManual}
          />
          {filtroMes === linhas[0]?.mes && (
            <SaudeFinanceiraMesVigente data={data} linhaMesVigente={linhaFiltrada} readOnly={readOnly} />
          )}
        </div>
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
                    <td key={`${row.key}-${l.mes}`} style={{ ...td, color: getCellColor(row.key, l[row.key]), padding: row.editavel ? "4px 8px" : "10px 8px" }}>
                      {row.editavel ? (
                        <input
                          type="number"
                          defaultValue={Math.round(l[row.key] || 0)}
                          onChange={(e) => {
                            if (row.key === "entradas") setEntradasManual(l.mes, e.target.value);
                            if (row.key === "diversao") setDiversaoManual(l.mes, e.target.value);
                          }}
                          style={{ ...inputMini, width: 82, borderColor: C.accentBorder + "60", color: C.accent }}
                        />
                      ) : (
                        formatarBRL(l[row.key])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td style={tdLeft}>Ajustar investimento</td>
                {linhas.map((l) => (
                  <td key={`input-${l.mes}`} style={{ ...td, padding: "4px 8px" }}>
                    <input type="number" value={ajustes[l.mes]?.investimentoManual ? ajustes[l.mes]?.investimento : ""} onChange={(e) => setInvestimentoManual(l.mes, e.target.value)} placeholder={String(Math.round(l.investimento || 0))} style={inputMini} />
                  </td>
                ))}
              </tr>
              {linhasExtras.length > 0 && linhasExtras.map(le => (
                <tr key={`extra-${le.id}`}>
                  <td style={{ ...tdLeft, color: le.tipo === "receita" ? C.accent : le.tipo === "quitacao" ? C.yellow : C.textDim }}>{le.nome} {le.tipo === "receita" ? "↑" : "↓"}</td>
                  {linhas.map(l => (
                    <td key={`${le.id}-${l.mes}`} style={{ ...td, color: le.tipo === "receita" ? C.accent : C.textDim }}>{le.valores?.[l.mes] ? formatarBRL(le.valores[l.mes]) : "—"}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td style={tdLeft}>Ação estratégica</td>
                {linhas.map((l) => (
                  <td key={`acao-${l.mes}`} style={{ ...td, whiteSpace: "normal", minWidth: 110 }}>
                    {l.quitacoes?.length ? <span style={{ color: C.accent }}>{l.quitacoes.map((q) => q.nome).join(", ")}</span>
                      : l.investimento > 0 ? <span style={{ color: C.blue }}>investir sobra</span>
                      : <span style={{ color: C.textMuted }}>segurar caixa</span>}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 14, border: `1px solid ${C.border}`, background: C.cardAlt, borderRadius: 14, padding: 12, color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>
        O motor já faz quitações automaticamente quando há caixa suficiente e direciona a sobra para investimento, mantendo uma reserva mínima.
      </div>
    </div>
  );
}

const th = { textAlign: "right", color: C.textMuted, fontFamily: MN, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, padding: "10px 8px", borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" };
const thLeft = { ...th, textAlign: "left", position: "sticky", left: 0, background: C.card, zIndex: 2 };
const td = { textAlign: "right", padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", color: C.textDim, fontSize: 12, whiteSpace: "nowrap" };
const tdLeft = { ...td, textAlign: "left", color: C.white, fontWeight: 800, position: "sticky", left: 0, background: C.card, zIndex: 1 };
const inputMini = { width: 82, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, color: C.white, padding: "8px 8px", fontFamily: MN, fontSize: 12, textAlign: "right" };
const FN_var = "var(--font-sans, sans-serif)";