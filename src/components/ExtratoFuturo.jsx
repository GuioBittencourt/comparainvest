"use client";
import { useMemo, useState } from "react";
import { C, FN, MN } from "../lib/theme";
import { formatarBRL } from "./SaudeFinanceiraModel";
import { gerarExtratoFuturo } from "./ExtratoFuturoEngine";

export default function ExtratoFuturo({ data }) {
  const [ajustes, setAjustes] = useState({});
  const linhas = useMemo(() => gerarExtratoFuturo(data, ajustes), [data, ajustes]);

  const setCampo = (mes, campo, valor) => {
    setAjustes((p) => ({ ...p, [mes]: { ...(p[mes] || {}), [campo]: Number(valor) || 0 } }));
  };

  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18 }}>
    <h3 style={{ color: C.white, margin: 0, fontSize: 22 }}>Extrato Futuro</h3>
    <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, marginTop: 6 }}>Projeção inicial de 13 meses. Por enquanto, você pode ajustar investimento e quitação manualmente; depois entra o motor inteligente de quitação.</p>

    <div style={{ overflowX: "auto", marginTop: 16 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760, fontFamily: FN }}>
        <thead>
          <tr>
            {["Mês", "Entradas", "Fixas", "Cartões", "Dívidas", "Diversão", "Quitar", "Investir", "Saldo", "Acumulado"].map((h) => <th key={h} style={{ textAlign: h === "Mês" ? "left" : "right", color: C.textMuted, fontFamily: MN, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, padding: "10px 8px", borderBottom: `1px solid ${C.border}` }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => <tr key={l.mes}>
            <td style={tdLeft}>{l.label}</td>
            <td style={td}>{formatarBRL(l.entradas)}</td>
            <td style={td}>{formatarBRL(l.fixas)}</td>
            <td style={td}>{formatarBRL(l.cartoes)}</td>
            <td style={td}>{formatarBRL(l.dividas)}</td>
            <td style={td}>{formatarBRL(l.diversao)}</td>
            <td style={td}><input type="number" value={ajustes[l.mes]?.quitar || ""} onChange={(e) => setCampo(l.mes, "quitar", e.target.value)} placeholder="0" style={inputMini} /></td>
            <td style={td}><input type="number" value={ajustes[l.mes]?.investimento || ""} onChange={(e) => setCampo(l.mes, "investimento", e.target.value)} placeholder="0" style={inputMini} /></td>
            <td style={{ ...td, color: l.saldoMes < 0 ? C.red : C.accent }}>{formatarBRL(l.saldoMes)}</td>
            <td style={{ ...td, color: l.saldoAcumulado < 0 ? C.red : C.white }}>{formatarBRL(l.saldoAcumulado)}</td>
          </tr>)}
        </tbody>
      </table>
    </div>

    <div style={{ marginTop: 14, border: `1px solid ${C.border}`, background: C.cardAlt, borderRadius: 14, padding: 12, color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>
      O Extrato Futuro é a visão de antecipação. Ele mostra onde o mês quebra antes de quebrar de verdade. Na próxima fase, o app vai sugerir quitações automáticas para liberar fluxo mais rápido.
    </div>
  </div>;
}

const td = { textAlign: "right", padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", color: C.textDim, fontSize: 12, whiteSpace: "nowrap" };
const tdLeft = { ...td, textAlign: "left", color: C.white, fontWeight: 700 };
const inputMini = { width: 88, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, color: C.white, padding: "8px 8px", fontFamily: MN, fontSize: 12, textAlign: "right" };
