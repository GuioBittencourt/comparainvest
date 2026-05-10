"use client";
// src/components/ViradasMes.jsx
// Virada de Mês: ADM gera imagem do resumo + texto personalizado e envia no WhatsApp do aluno

import { useRef, useState, useCallback } from "react";
import { C, FN, MN } from "../lib/theme";
import { formatarBRL } from "./SaudeFinanceiraModel";
import { gerarExtratoFuturo } from "./ExtratoFuturoEngine";

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function gerarImagem(ref) {
  if (!ref) return null;
  try {
    const html2canvas = (await import("html2canvas")).default;
    await wait(200);
    const canvas = await html2canvas(ref, { backgroundColor: "#071018", scale: 2.5, useCORS: true });
    return new Promise(resolve => canvas.toBlob(blob => resolve(blob), "image/png"));
  } catch (e) {
    console.error("erro ao gerar imagem:", e);
    return null;
  }
}

function n(v) { return Number(v || 0); }

function fmtBRL(v) { return n(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

function gerarTexto(linha, nome, linhasExtras = []) {
  if (!linha) return "";
  const partes = [];
  partes.push(`Aqui está nosso mês de ${linha.label} 🗓️`);
  partes.push("\nVamos:");
  partes.push(`* Iniciar hoje com ${fmtBRL(linha.saldoInicial)}`);
  partes.push(`* Receber ${fmtBRL(linha.entradas)} durante o mês`);
  partes.push(`\n* Pagar Contas Fixas (${fmtBRL(linha.fixas)})`);
  if (n(linha.cartoes) > 0) partes.push(`* Pagar Cartões (${fmtBRL(linha.cartoes)})`);
  if (n(linha.outrasContas) > 0) partes.push(`* Pagar Outras Contas (${fmtBRL(linha.outrasContas)})`);
  linhasExtras.forEach(le => {
    const val = n(le.valores?.[linha.mes] || 0);
    if (val > 0) partes.push(`* ${le.tipo === "quitacao" ? "QUITAR" : le.tipo === "receita" ? "Receber" : "Pagar"} ${le.nome} (${fmtBRL(val)})`);
  });
  if (n(linha.valorQuitacoes) > 0 && linha.quitacoes?.length > 0) {
    partes.push(`* QUITAR ${linha.quitacoes.map(q => q.nome).join(", ")} (${fmtBRL(linha.valorQuitacoes)})`);
  }
  partes.push(`* ${fmtBRL(linha.diversao)} de diversão`);
  if (n(linha.investimento) > 0) partes.push(`* INVESTIR ${fmtBRL(linha.investimento)}`);
  partes.push(`* Terminar o mês com ${fmtBRL(linha.saldoFinal)} na conta`);
  return partes.join("\n");
}

// Card visual que será capturado como imagem
function CartaoMes({ linha, linhasExtras = [], nomeAluno }) {
  if (!linha) return null;
  const rows = [
    { label: "Saldo Anterior", valor: linha.saldoInicial, cor: "#fff" },
    { label: "Entrada", valor: linha.entradas, cor: "#fff" },
    { label: "Total de Entrada", valor: linha.saldoInicial + linha.entradas, cor: C.accent, bold: true, bg: "#0D3320" },
    { label: "Contas Fixas", valor: linha.fixas, cor: C.textDim },
    ...(n(linha.cartoes) > 0 ? [{ label: "Cartões", valor: linha.cartoes, cor: C.textDim }] : []),
    ...(n(linha.outrasContas) > 0 ? [{ label: "Outras Contas", valor: linha.outrasContas, cor: C.textDim }] : []),
    ...linhasExtras.filter(le => n(le.valores?.[linha.mes]) > 0).map(le => ({
      label: le.nome,
      valor: le.valores[linha.mes],
      cor: le.tipo === "receita" ? C.accent : le.tipo === "quitacao" ? C.yellow : C.textDim,
      highlight: le.tipo === "quitacao",
    })),
    ...(n(linha.valorQuitacoes) > 0 ? [{ label: "Quitações", valor: linha.valorQuitacoes, cor: C.yellow }] : []),
    { label: "Diversão", valor: linha.diversao, cor: C.textDim },
    { label: "Total de Saídas", valor: linha.fixas + n(linha.cartoes) + n(linha.outrasContas) + n(linha.valorQuitacoes) + linha.diversao, cor: C.red, bold: true, bg: "rgba(239,68,68,0.12)" },
    { label: "Investimento", valor: linha.investimento, cor: C.blue },
    { label: "SALDO", valor: linha.saldoFinal, cor: linha.saldoFinal >= 0 ? C.accent : C.red, bold: true, bg: linha.saldoFinal >= 0 ? "#0D3320" : "rgba(239,68,68,0.15)", upper: true },
  ];

  return (
    <div style={{ background: "#071018", borderRadius: 20, padding: 20, width: 340, fontFamily: FN }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, letterSpacing: 1 }}>VIRADA DE MÊS</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.white }}>{linha.label.toUpperCase()}</div>
          {nomeAluno && <div style={{ fontSize: 11, color: C.textDim }}>{nomeAluno}</div>}
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: C.accent, fontFamily: MN }}>CI</div>
      </div>

      {/* Tabela */}
      {rows.map((row, idx) => (
        <div key={idx} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "7px 10px",
          background: row.bg || "transparent",
          borderRadius: row.bg ? 8 : 0,
          borderBottom: row.bg ? "none" : `1px solid rgba(255,255,255,0.06)`,
          marginBottom: row.bg ? 4 : 0,
        }}>
          <span style={{ fontSize: row.bold ? 12 : 11, color: row.cor || C.textDim, fontWeight: row.bold ? 700 : 400, textTransform: row.upper ? "uppercase" : "none", letterSpacing: row.upper ? 0.5 : 0 }}>
            {row.label}
          </span>
          <span style={{ fontFamily: MN, fontSize: row.bold ? 13 : 11, fontWeight: row.bold ? 700 : 400, color: row.cor || C.textDim }}>
            {fmtBRL(row.valor)}
          </span>
        </div>
      ))}

      {/* Rodapé */}
      <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${C.border}`, fontSize: 9, color: C.textMuted, textAlign: "center", fontFamily: MN }}>
        COMPARAINVEST • {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default function ViradasMes({ data, targetUser, linhasExtras = [], ajustes = {}, onClose }) {
  const cardRef = useRef(null);
  const [mesIdx, setMesIdx] = useState(1); // padrão: próximo mês
  const [textoEditado, setTextoEditado] = useState(null);
  const [gerando, setGerando] = useState(false);
  const [imagemGerada, setImagemGerada] = useState(null);

  const linhas = gerarExtratoFuturo(data, { ...ajustes, __linhasExtras: linhasExtras });
  const linha = linhas[mesIdx] || null;
  const nomeAluno = targetUser ? `${targetUser.nome || ""} ${targetUser.sobrenome || ""}`.trim() : "";
  const celular = targetUser?.celular?.replace(/\D/g, "") || "";

  const textoBase = linha ? gerarTexto(linha, nomeAluno, linhasExtras) : "";
  const textoFinal = textoEditado !== null ? textoEditado : textoBase;

  const handleGerarImagem = useCallback(async () => {
    setGerando(true);
    const blob = await gerarImagem(cardRef.current);
    setImagemGerada(blob);
    setGerando(false);
  }, []);

  const handleEnviarWhats = useCallback(async () => {
    if (!celular) { alert("Usuário sem número de WhatsApp cadastrado."); return; }
    const texto = encodeURIComponent(textoFinal);
    const url = `https://wa.me/55${celular}?text=${texto}`;

    // Tenta compartilhar imagem via Web Share API
    if (imagemGerada && navigator.canShare) {
      const file = new File([imagemGerada], "virada-mes.png", { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ text: textoFinal, files: [file] });
          return;
        } catch {}
      }
    }
    // Fallback: abre WhatsApp com texto
    window.open(url, "_blank");
  }, [celular, textoFinal, imagemGerada]);

  const handleCompartilharImagem = useCallback(async () => {
    if (!imagemGerada) { alert("Gere a imagem primeiro."); return; }
    const file = new File([imagemGerada], "virada-mes.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file] });
    } else {
      // Download fallback
      const url = URL.createObjectURL(imagemGerada);
      const a = document.createElement("a");
      a.href = url; a.download = "virada-mes.png"; a.click();
      URL.revokeObjectURL(url);
    }
  }, [imagemGerada]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.90)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ background: C.bg, borderRadius: 20, border: `1px solid ${C.border}`, width: "100%", maxWidth: 780, maxHeight: "90vh", overflowY: "auto", padding: 24 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.white }}>Virada de Mês</div>
            {nomeAluno && <div style={{ fontSize: 12, color: C.textDim }}>{nomeAluno} {celular && `• WhatsApp: (${celular.slice(2,4)}) ${celular.slice(4,9)}-${celular.slice(9)}`}</div>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textDim, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        {/* Seletor de mês */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
          {linhas.map((l, idx) => (
            <button key={l.mes} onClick={() => { setMesIdx(idx); setTextoEditado(null); setImagemGerada(null); }}
              style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 999, cursor: "pointer", fontSize: 11, fontFamily: MN, whiteSpace: "nowrap",
                border: `1px solid ${mesIdx === idx ? C.accentBorder : C.border}`,
                background: mesIdx === idx ? `${C.accent}14` : "transparent",
                color: mesIdx === idx ? C.accent : C.textMuted,
              }}>
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Coluna esquerda: card + botões imagem */}
          <div>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              Preview da imagem
            </div>
            <div ref={cardRef} style={{ display: "inline-block" }}>
              <CartaoMes linha={linha} linhasExtras={linhasExtras} nomeAluno={nomeAluno} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={handleGerarImagem} disabled={gerando}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 12, fontFamily: MN, cursor: "pointer", background: `${C.accent}15`, color: C.accent, border: `1px solid ${C.accentBorder}`, fontWeight: 700 }}>
                {gerando ? "Gerando..." : imagemGerada ? "✓ Imagem pronta" : "Gerar imagem"}
              </button>
              {imagemGerada && (
                <button onClick={handleCompartilharImagem}
                  style={{ padding: "10px 14px", borderRadius: 10, fontSize: 12, fontFamily: MN, cursor: "pointer", background: C.cardAlt, color: C.textDim, border: `1px solid ${C.border}` }}>
                  Baixar
                </button>
              )}
            </div>
          </div>

          {/* Coluna direita: texto + enviar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, textTransform: "uppercase", letterSpacing: 1 }}>
              Texto da mensagem
            </div>
            <textarea
              value={textoFinal}
              onChange={e => setTextoEditado(e.target.value)}
              rows={16}
              style={{ width: "100%", background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 12, color: C.white, padding: 12, fontFamily: FN, fontSize: 12, lineHeight: 1.7, resize: "vertical", outline: "none", boxSizing: "border-box" }}
            />
            <button onClick={() => setTextoEditado(textoBase)}
              style={{ padding: "6px 0", borderRadius: 8, fontSize: 11, fontFamily: MN, cursor: "pointer", background: "transparent", color: C.textMuted, border: `1px solid ${C.border}` }}>
              Restaurar texto automático
            </button>

            <button onClick={handleEnviarWhats}
              style={{ padding: "14px 0", borderRadius: 12, fontSize: 14, fontFamily: MN, fontWeight: 800, cursor: "pointer", background: "linear-gradient(135deg, #25D166, #1aaa54)", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Enviar no WhatsApp
            </button>

            {!celular && (
              <div style={{ fontSize: 11, color: C.yellow, textAlign: "center" }}>
                ⚠ Sem número cadastrado — o botão abrirá o WhatsApp sem destinatário
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
