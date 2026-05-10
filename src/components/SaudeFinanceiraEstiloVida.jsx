"use client";
import { Card, TituloBloco, Dica, CampoMoeda, CampoTexto, CampoNumero, OpcaoSimNao, BotaoAcao } from "./SaudeFinanceiraUI";
import { novoId } from "./SaudeFinanceiraModel";
import { C, MN } from "../lib/theme";

export default function SaudeFinanceiraEstiloVida({ data, setData, onNext, onBack }) {
  const fixas = data.contasFixas;
  const updateFixas = (patch) => setData((p) => ({ ...p, contasFixas: { ...p.contasFixas, ...patch } }));
  const updateItem = (key, patch) => updateFixas({ [key]: { ...fixas[key], ...patch } });
  const addOutro = () => updateFixas({ outros: [...(fixas.outros || []), { id: novoId("cf"), nome: "", valor: 0, quitavel: false, parcela: 0, restantes: 0, valorTotal: 0, noCartao: false, cartaoId: null }] });
  const updateOutro = (id, patch) => updateFixas({ outros: fixas.outros.map((o) => (o.id === id ? { ...o, ...patch } : o)) });
  const removeOutro = (id) => updateFixas({ outros: fixas.outros.filter((o) => o.id !== id) });

  return <Card><TituloBloco etapa="Bloco 3 de 7" titulo="Saúde, recorrentes e estilo de vida" subtitulo="Alguns gastos parecem pequenos, mas somados viram vazamento. Aqui vamos organizar sem drama." />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><CampoMoeda label="Convênio / plano de saúde" value={fixas.convenio.valor} onChange={(v) => updateFixas({ convenio: { ...fixas.convenio, valor: v } })} /><OpcaoSimNao label="Desconta em folha?" value={fixas.convenio.descontaFolha} onChange={(v) => updateFixas({ convenio: { ...fixas.convenio, descontaFolha: v } })} /></div>
    {fixas.convenio.descontaFolha && <Dica>Se já desconta no salário, não vamos somar de novo nas contas fixas.</Dica>}

    <CampoMoeda label="Pet" value={fixas.pet} onChange={(v) => updateFixas({ pet: v })} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><CampoMoeda label="Farmácia" value={fixas.farmacia} onChange={(v) => updateFixas({ farmacia: v })} /><CampoMoeda label="Cabelo / estética" value={fixas.cabelo} onChange={(v) => updateFixas({ cabelo: v })} /></div>

    {["streaming", "academia", "seguro"].map((key) => <div key={key} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, marginBottom: 10 }}><CampoMoeda label={key === "streaming" ? "Streaming" : key === "academia" ? "Academia" : "Seguros"} value={fixas[key].valor} onChange={(v) => updateItem(key, { valor: v })} /><OpcaoSimNao label="Costuma vir no cartão?" value={fixas[key].noCartao} onChange={(v) => updateItem(key, { noCartao: v, cartaoId: null })} />{fixas[key].noCartao && <Dica>No bloco de cartões, depois de cadastrar os cartões, você escolhe em qual cartão essa conta entra. Assim não precisamos adivinhar agora.</Dica>}</div>)}

    <CampoMoeda label="Pensão paga" value={fixas.pensaoPaga} onChange={(v) => updateFixas({ pensaoPaga: v })} />
    <CampoTexto label="Educação / escola / faculdade" value={fixas.educacao.descricao} onChange={(v) => updateFixas({ educacao: { ...fixas.educacao, descricao: v } })} placeholder="Ex.: faculdade, escola, curso" />
    <CampoMoeda label="Valor educação" value={fixas.educacao.valor} onChange={(v) => updateFixas({ educacao: { ...fixas.educacao, valor: v } })} />

    <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}><strong style={{ color: C.white, fontSize: 13 }}>Outras contas</strong><button onClick={addOutro} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.accent, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontFamily: MN, fontSize: 10 }}>+ adicionar</button></div>
    {(fixas.outros || []).map((o) => <div key={o.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, marginTop: 10 }}><CampoTexto label="Nome" value={o.nome} onChange={(v) => updateOutro(o.id, { nome: v })} /><CampoMoeda label="Valor mensal" value={o.valor} onChange={(v) => updateOutro(o.id, { valor: v, parcela: o.quitavel ? v : o.parcela })} /><OpcaoSimNao label="Essa conta tem prazo para acabar?" value={o.quitavel} onChange={(v) => updateOutro(o.id, { quitavel: v, parcela: v ? o.valor : 0, noCartao: v ? false : o.noCartao, cartaoId: null })} />{o.quitavel ? <><Dica>O valor mensal acima já será tratado como a parcela. Contas com prazo definido entram em Outras Contas, porque podem ser quitadas e liberar orçamento.</Dica><CampoNumero label="Parcelas restantes" value={o.restantes} onChange={(v) => updateOutro(o.id, { restantes: v === "" ? 0 : v })} /><CampoMoeda label="Valor para quitar hoje, se souber" value={o.valorTotal} onChange={(v) => updateOutro(o.id, { valorTotal: v })} /><Dica>Se não souber o valor de quitação, pode deixar em branco. O app estima pelo valor mensal vezes as parcelas restantes.</Dica></> : <><OpcaoSimNao label="Costuma vir no cartão?" value={o.noCartao} onChange={(v) => updateOutro(o.id, { noCartao: v, cartaoId: null })} />{o.noCartao && <Dica>No bloco de cartões, você escolhe em qual cartão essa conta entra.</Dica>}</>}<button onClick={() => removeOutro(o.id)} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 11 }}>Remover</button></div>)}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}><BotaoAcao variant="secondary" onClick={onBack}>Voltar</BotaoAcao><BotaoAcao onClick={onNext}>Continuar</BotaoAcao></div>
  </Card>;
}
