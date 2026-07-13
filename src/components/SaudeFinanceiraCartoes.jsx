"use client";
import { useState } from "react";
import { Card, TituloBloco, Dica, CampoMoeda, CampoTexto, CampoNumero, SelectCampo, OpcaoSimNao, BotaoAcao } from "./SaudeFinanceiraUI";
import { novoId, cruzarRecorrentesComCartoes } from "./SaudeFinanceiraModel";
import { C, MN, FN } from "../lib/theme";

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
function labelMes(offset) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return `${MESES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
}

export default function SaudeFinanceiraCartoes({ data, setData, onNext, onBack }) {
  const cartoes = data.cartoes || [];
  // Controla quantos meses futuros cada cartão está mostrando
  const [mesesVisiveis, setMesesVisiveis] = useState({});

  const getMesesVisiveis = (id) => mesesVisiveis[id] || 2;
  const addMes = (id) => setMesesVisiveis((p) => ({ ...p, [id]: Math.min((p[id] || 2) + 1, 12) }));

  const addCartao = () => setData((p) => ({
    ...p,
    cartoes: [...cartoes, { id: novoId("cartao"), nome: "", limite: 0, faturaAtual: 0, veFaturasApp: false, faturasProxMeses: {}, parcelasFixas: [], recorrentes: [] }]
  }));
  const updateCartao = (id, patch) => setData((p) => ({ ...p, cartoes: cartoes.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const removeCartao = (id) => setData((p) => ({ ...p, cartoes: cartoes.filter((c) => c.id !== id) }));
  const addParcela = (id) => updateCartao(id, { parcelasFixas: [...(cartoes.find((c) => c.id === id)?.parcelasFixas || []), { id: novoId("parcela"), descricao: "", valorParcela: 0, mesesRestantes: 0 }] });
  const updateParcela = (cardId, parcelaId, patch) => updateCartao(cardId, { parcelasFixas: cartoes.find((c) => c.id === cardId).parcelasFixas.map((p) => (p.id === parcelaId ? { ...p, ...patch } : p)) });
  const removeParcela = (cardId, parcelaId) => updateCartao(cardId, { parcelasFixas: cartoes.find((c) => c.id === cardId).parcelasFixas.filter((p) => p.id !== parcelaId) });

  const recorrentes = [
    { key: "streaming", nome: "Streaming", item: data.contasFixas?.streaming },
    { key: "academia", nome: "Academia", item: data.contasFixas?.academia },
    { key: "seguro", nome: "Seguro", item: data.contasFixas?.seguro },
    ...((data.contasFixas?.contasExtras || []).filter((o) => o.noCartao).map((o) => ({ key: `extra:${o.id}`, nome: o.nome || "Conta extra", item: o }))),
    ...((data.contasFixas?.outros || []).filter((o) => !o.quitavel).map((o) => ({ key: `outro:${o.id}`, nome: o.nome || "Outra conta", item: o }))),
  ].filter((r) => r.item?.noCartao && (Number(r.item?.valor) || 0) > 0);

  const updateRecorrenteCartao = (key, cartaoId) => {
    setData((p) => {
      const fixas = p.contasFixas || {};
      if (key.startsWith("extra:")) {
        const id = key.split(":")[1];
        return { ...p, contasFixas: { ...fixas, contasExtras: (fixas.contasExtras || []).map((o) => (o.id === id ? { ...o, cartaoId } : o)) } };
      }
      if (key.startsWith("outro:")) {
        const id = key.split(":")[1];
        return { ...p, contasFixas: { ...fixas, outros: (fixas.outros || []).map((o) => (o.id === id ? { ...o, cartaoId } : o)) } };
      }
      return { ...p, contasFixas: { ...fixas, [key]: { ...fixas[key], cartaoId } } };
    });
  };

  const finalizar = () => {
    setData((p) => cruzarRecorrentesComCartoes(p));
    onNext();
  };

  return (
    <Card>
      <TituloBloco etapa="Bloco 4 de 7" titulo="Cartões de crédito" subtitulo="Aqui o mais importante é o total da fatura por mês. Se o app do banco mostra os próximos meses, ótimo. Se não mostra, usamos parcelas fixas." />
      <Dica>Com a fatura de um mês já roda o saldo. Mas quanto mais meses preencher depois, mais preciso fica o Extrato Futuro.</Dica>

      {/* Recorrentes no cartão */}
      {recorrentes.length > 0 && cartoes.length > 0 && (
        <div style={{ border: `1px solid ${C.accentBorder}`, background: `${C.accent}0D`, borderRadius: 14, padding: 12, marginBottom: 12 }}>
          <strong style={{ color: C.white, fontSize: 13 }}>Contas recorrentes que vêm no cartão</strong>
          <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.6, margin: "6px 0 10px" }}>Associe cada uma ao cartão correto para evitar soma duplicada.</p>
          {recorrentes.map((r) => (
            <div key={r.key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, alignItems: "end" }}>
              <CampoTexto label="Conta" value={`${r.nome} — ${(Number(r.item.valor) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`} onChange={() => {}} />
              <SelectCampo label="Entram em qual cartão?" value={r.item.cartaoId || ""} onChange={(v) => updateRecorrenteCartao(r.key, v)}
                options={[{ value: "", label: "Selecione" }, ...cartoes.map((c, i) => ({ value: c.id, label: c.nome || `Cartão ${i + 1}` }))]} />
            </div>
          ))}
        </div>
      )}
      {recorrentes.length > 0 && cartoes.length === 0 && (
        <Dica tone="warn">Você marcou contas recorrentes como pagas no cartão, mas ainda não cadastrou nenhum cartão.</Dica>
      )}

      {/* Lista de cartões */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <strong style={{ color: C.white, fontSize: 13 }}>Cartões</strong>
        <button onClick={addCartao} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.accent, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontFamily: MN, fontSize: 10 }}>+ cartão</button>
      </div>
      {cartoes.length === 0 && <Dica>Nenhum cartão cadastrado. Se não usa cartão, pode continuar.</Dica>}

      {cartoes.map((c, idx) => {
        const qtdMeses = getMesesVisiveis(c.id);
        return (
          <div key={c.id} style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <CampoTexto label={`Cartão ${idx + 1}`} value={c.nome} onChange={(v) => updateCartao(c.id, { nome: v })} placeholder="Ex.: Nubank" />
              <CampoMoeda label="Limite" value={c.limite} onChange={(v) => updateCartao(c.id, { limite: v })} />
            </div>
            <CampoMoeda label="Fatura do mês atual" value={c.faturaAtual} onChange={(v) => updateCartao(c.id, { faturaAtual: v })} />
            <OpcaoSimNao label="Consegue ver faturas futuras no app do cartão?" value={c.veFaturasApp} onChange={(v) => updateCartao(c.id, { veFaturasApp: v })} />

            {c.veFaturasApp ? (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                  {Array.from({ length: qtdMeses }, (_, i) => i + 1).map((m) => (
                    <CampoMoeda
                      key={m}
                      label={`Mês +${m} (${labelMes(m)})`}
                      value={c.faturasProxMeses?.[m] || 0}
                      onChange={(v) => updateCartao(c.id, { faturasProxMeses: { ...(c.faturasProxMeses || {}), [m]: v } })}
                    />
                  ))}
                </div>
                {qtdMeses < 12 && (
                  <button
                    onClick={() => addMes(c.id)}
                    style={{ width: "100%", padding: "8px", marginTop: 4, borderRadius: 8, border: `1px dashed ${C.border}`, background: "transparent", color: C.textDim, fontFamily: FN, fontSize: 12, cursor: "pointer", transition: "color 0.18s, border-color 0.18s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accentBorder; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = C.textDim; e.currentTarget.style.borderColor = C.border; }}
                  >
                    + Adicionar mês seguinte ({labelMes(qtdMeses + 1)})
                  </button>
                )}
              </div>
            ) : (
              <>
                <Dica>Se não vê faturas futuras, cadastre as compras parceladas que ainda vão rodar.</Dica>
                {(c.parcelasFixas || []).map((p) => (
                  <div key={p.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, marginBottom: 8 }}>
                    <CampoTexto label="Descrição" value={p.descricao} onChange={(v) => updateParcela(c.id, p.id, { descricao: v })} placeholder="Ex.: geladeira" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <CampoMoeda label="Valor parcela" value={p.valorParcela} onChange={(v) => updateParcela(c.id, p.id, { valorParcela: v })} />
                      <CampoNumero label="Meses restantes" value={p.mesesRestantes} onChange={(v) => updateParcela(c.id, p.id, { mesesRestantes: v === "" ? 0 : v })} />
                    </div>
                    <button onClick={() => removeParcela(c.id, p.id)} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 11, fontFamily: FN }}>Remover parcela</button>
                  </div>
                ))}
                <button onClick={() => addParcela(c.id)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 11 }}>+ parcela fixa</button>
              </>
            )}

            <button onClick={() => removeCartao(c.id)} style={{ display: "block", marginTop: 10, background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 11, fontFamily: FN }}>Remover cartão</button>
          </div>
        );
      })}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
        <BotaoAcao variant="secondary" onClick={onBack}>Voltar</BotaoAcao>
        <BotaoAcao onClick={finalizar}>Continuar</BotaoAcao>
      </div>
    </Card>
  );
}