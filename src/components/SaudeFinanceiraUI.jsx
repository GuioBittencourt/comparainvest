"use client";
import { C, MN, FN } from "../lib/theme";
import { moedaParaNumero, formatarBRL } from "./SaudeFinanceiraModel";

export function Card({ children, style = {} }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18, marginBottom: 14, boxShadow: "0 10px 34px rgba(0,0,0,0.18)", ...style }}>{children}</div>;
}

export function TituloBloco({ etapa, titulo, subtitulo }) {
  return <div style={{ marginBottom: 18 }}><div style={{ fontFamily: MN, fontSize: 10, color: C.accent, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{etapa}</div><h3 style={{ margin: 0, fontSize: 22, fontWeight: 650, letterSpacing: -0.3, color: C.white }}>{titulo}</h3>{subtitulo && <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.7, color: C.textDim }}>{subtitulo}</p>}</div>;
}

export function Dica({ children, tone = "info" }) {
  const color = tone === "warn" ? C.yellow : tone === "danger" ? C.red : C.blue || C.accent;
  return <div style={{ border: `1px solid ${color}30`, background: `${color}10`, borderRadius: 12, padding: "10px 12px", color: C.textDim, fontSize: 12, lineHeight: 1.6, margin: "10px 0" }}>{children}</div>;
}

export function CampoTexto({ label, value, onChange, placeholder = "", type = "text" }) {
  return <label style={{ display: "block", marginBottom: 10 }}><span style={{ display: "block", fontSize: 10, fontFamily: MN, color: C.textMuted, marginBottom: 4, textTransform: "uppercase" }}>{label}</span><input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", boxSizing: "border-box", padding: "11px 13px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.cardAlt || "rgba(255,255,255,0.03)", color: C.text, outline: "none", fontFamily: FN, fontSize: 13 }} /></label>;
}

export function CampoMoeda({ label, value, onChange, placeholder = "0,00" }) {
  const display = value === 0 || value === null || value === undefined ? "" : value;
  return <CampoTexto label={label} value={display} onChange={(v) => onChange(moedaParaNumero(v))} placeholder={placeholder} type="text" />;
}

export function CampoNumero({ label, value, onChange, placeholder = "" }) {
  const display = value === 0 || value === null || value === undefined ? "" : value;
  return <CampoTexto label={label} value={display} onChange={(v) => onChange(v === "" ? "" : Number(v))} placeholder={placeholder} type="number" />;
}

export function SelectCampo({ label, value, onChange, options = [] }) {
  return <label style={{ display: "block", marginBottom: 10 }}><span style={{ display: "block", fontSize: 10, fontFamily: MN, color: C.textMuted, marginBottom: 4, textTransform: "uppercase" }}>{label}</span><select value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.cardAlt || "#101A26", color: C.text, outline: "none", fontFamily: FN, fontSize: 13 }}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>;
}

export function OpcaoSimNao({ label, value, onChange }) {
  return <div style={{ marginBottom: 12 }}><div style={{ fontSize: 12, color: C.textDim, marginBottom: 8 }}>{label}</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><button onClick={() => onChange(true)} style={botaoEscolha(value === true)}>Sim</button><button onClick={() => onChange(false)} style={botaoEscolha(value === false)}>Não</button></div></div>;
}

function botaoEscolha(active) { return { padding: "10px 12px", borderRadius: 10, border: `1px solid ${active ? C.accentBorder : C.border}`, background: active ? `${C.accent}14` : "transparent", color: active ? C.accent : C.textDim, fontFamily: FN, fontWeight: 650, cursor: "pointer" }; }

export function BotaoAcao({ children, onClick, variant = "primary", disabled = false }) {
  const primary = variant === "primary";
  return <button disabled={disabled} onClick={onClick} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: primary ? "none" : `1px solid ${C.border}`, background: primary ? `linear-gradient(135deg, ${C.accent}, #059669)` : "transparent", color: primary ? "#06130E" : C.textDim, fontFamily: FN, fontWeight: 750, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}>{children}</button>;
}

export function LinhaResumo({ label, value, danger = false }) {
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}><span style={{ color: C.textDim, fontSize: 12 }}>{label}</span><strong style={{ color: danger ? C.red : C.white, fontSize: 12, fontFamily: MN, whiteSpace: "nowrap" }}>{typeof value === "number" ? formatarBRL(value) : value}</strong></div>;
}
