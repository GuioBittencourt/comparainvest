"use client";
import { Card, TituloBloco, Dica, CampoMoeda, CampoTexto, OpcaoSimNao, BotaoAcao } from "./SaudeFinanceiraUI";
import { novoId, cruzarRecorrentesComCartoes } from "./SaudeFinanceiraModel";
import { C, MN } from "../lib/theme";

export default function SaudeFinanceiraCartoes({ data, setData, onNext, onBack }) {
  const cartoes = data.cartoes || [];
  const addCartao = () => setData((p) => ({ ...p, cartoes: [...cartoes, { id: novoId("cartao"), nome: "", limite: 0, faturaAtual: 0, veFaturasApp: false, faturasProxMeses: {}, parcelasFixas: [], recorrentes: [] }] }));
  const updateCartao = (id, patch) => setData((p) => ({ ...p, cartoes: cartoes.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const removeCartao = (id) => setData((p) => ({ ...p, cartoes: cartoes.filter((c) => c.id !== id) }));
  const addParcela = (id) => updateCartao(id, { parcelasFixas: [...(cartoes.find((c) => c.id === id)?.parcelasFixas || []), { id: novoId("parcela"), descricao: "", valorParcela: 0, mesesRestantes: 0 }] });
  const updateParcela = (cardId, parcelaId, patch) => updateCartao(cardId, { parcelasFixas: cartoes.find((c) => c.id === cardId).parcelasFixas.map((p) => (p.id === parcelaId ? { ...p, ...patch } : p)) });

  const finalizar = () => {
    setData((p) => cruzarRecorrentesComCartoes(p));
    onNext();
  };

  return <Card><TituloBloco etapa="Bloco 4 de 7" titulo="Cartões de crédito" subtitulo="Aqui o mais importante é o total da fatura por mês. Se o app do banco mostra os próximos meses, ótimo. Se não mostra, usamos parcelas fixas." />
    <Dica>Com a fatura de um mês já roda o saldo. Mas quanto mais meses preencher depois, mais preciso fica o Extrato Futuro.</Dica>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><strong style={{ color: C.white, fontSize: 13 }}>Cartões</strong><button onClick={addCartao} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.accent, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontFamily: MN, fontSize: 10 }}>+ cartão</button></div>
    {cartoes.length === 0 && <Dica>Nenhum cartão cadastrado. Se não usa cartão, pode continuar.</Dica>}
    {cartoes.map((c, idx) => <div key={c.id} style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><CampoTexto label={`Cartão ${idx + 1}`} value={c.nome} onChange={(v) => updateCartao(c.id, { nome: v })} placeholder="Ex.: Nubank" /><CampoMoeda label="Limite" value={c.limite} onChange={(v) => updateCartao(c.id, { limite: v })} /></div><CampoMoeda label="Fatura do mês atual" value={c.faturaAtual} onChange={(v) => updateCartao(c.id, { faturaAtual: v })} /><OpcaoSimNao label="Consegue ver faturas futuras no app do cartão?" value={c.veFaturasApp} onChange={(v) => updateCartao(c.id, { veFaturasApp: v })} />{c.veFaturasApp ? <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>{[1,2,3,4,5,6].map((m) => <CampoMoeda key={m} label={`Mês +${m}`} value={c.faturasProxMeses?.[m] || 0} onChange={(v) => updateCartao(c.id, { faturasProxMeses: { ...(c.faturasProxMeses || {}), [m]: v } })} />)}</div> : <><Dica>Se não vê faturas futuras, cadastre as compras parceladas que ainda vão rodar.</Dica>{(c.parcelasFixas || []).map((p) => <div key={p.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, marginBottom: 8 }}><CampoTexto label="Descrição" value={p.descricao} onChange={(v) => updateParcela(c.id, p.id, { descricao: v })} placeholder="Ex.: geladeira" /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><CampoMoeda label="Valor parcela" value={p.valorParcela} onChange={(v) => updateParcela(c.id, p.id, { valorParcela: v })} /><CampoTexto label="Meses restantes" type="number" value={p.mesesRestantes} onChange={(v) => updateParcela(c.id, p.id, { mesesRestantes: Number(v) || 0 })} /></div></div>)}<button onClick={() => addParcela(c.id)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 11 }}>+ parcela fixa</button></>}<button onClick={() => removeCartao(c.id)} style={{ display: "block", marginTop: 10, background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 11 }}>Remover cartão</button></div>)}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}><BotaoAcao variant="secondary" onClick={onBack}>Voltar</BotaoAcao><BotaoAcao onClick={finalizar}>Continuar</BotaoAcao></div>
  </Card>;
}
