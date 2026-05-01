"use client";
import { Card, TituloBloco, Dica, CampoMoeda, CampoTexto, SelectCampo, OpcaoSimNao, BotaoAcao } from "./SaudeFinanceiraUI";
import { novoId } from "./SaudeFinanceiraModel";
import { C, MN } from "../lib/theme";

function CartaoSelect({ data, value, onChange }) {
  return <SelectCampo label="Cartão" value={value || ""} onChange={onChange} options={[{ value: "", label: "Selecione" }, ...(data.cartoes || []).map((c, i) => ({ value: c.id, label: c.nome || `Cartão ${i + 1}` }))]} />;
}

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

    {["streaming", "academia", "seguro"].map((key) => <div key={key} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, marginBottom: 10 }}><CampoMoeda label={key === "streaming" ? "Streaming" : key === "academia" ? "Academia" : "Seguros"} value={fixas[key].valor} onChange={(v) => updateItem(key, { valor: v })} /><OpcaoSimNao label="Paga isso no cartão?" value={fixas[key].noCartao} onChange={(v) => updateItem(key, { noCartao: v, cartaoId: v ? fixas[key].cartaoId : null })} />{fixas[key].noCartao && <CartaoSelect data={data} value={fixas[key].cartaoId} onChange={(v) => updateItem(key, { cartaoId: v })} />}</div>)}

    <CampoMoeda label="Pensão paga" value={fixas.pensaoPaga} onChange={(v) => updateFixas({ pensaoPaga: v })} />
    <CampoTexto label="Educação / escola / faculdade" value={fixas.educacao.descricao} onChange={(v) => updateFixas({ educacao: { ...fixas.educacao, descricao: v } })} placeholder="Ex.: faculdade, escola, curso" />
    <CampoMoeda label="Valor educação" value={fixas.educacao.valor} onChange={(v) => updateFixas({ educacao: { ...fixas.educacao, valor: v } })} />

    <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}><strong style={{ color: C.white, fontSize: 13 }}>Outras contas</strong><button onClick={addOutro} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.accent, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontFamily: MN, fontSize: 10 }}>+ adicionar</button></div>
    {(fixas.outros || []).map((o) => <div key={o.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, marginTop: 10 }}><CampoTexto label="Nome" value={o.nome} onChange={(v) => updateOutro(o.id, { nome: v })} /><CampoMoeda label="Valor mensal" value={o.valor} onChange={(v) => updateOutro(o.id, { valor: v })} /><OpcaoSimNao label="Essa conta tem prazo para acabar?" value={o.quitavel} onChange={(v) => updateOutro(o.id, { quitavel: v })} />{o.quitavel && <><Dica>Contas com prazo definido entram em Outras Contas, porque podem ser quitadas e liberar orçamento.</Dica><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><CampoMoeda label="Parcela" value={o.parcela} onChange={(v) => updateOutro(o.id, { parcela: v })} /><CampoTexto label="Restantes" type="number" value={o.restantes} onChange={(v) => updateOutro(o.id, { restantes: Number(v) || 0 })} /></div><CampoMoeda label="Valor total" value={o.valorTotal} onChange={(v) => updateOutro(o.id, { valorTotal: v })} /></>}<OpcaoSimNao label="Paga no cartão?" value={o.noCartao} onChange={(v) => updateOutro(o.id, { noCartao: v })} />{o.noCartao && <CartaoSelect data={data} value={o.cartaoId} onChange={(v) => updateOutro(o.id, { cartaoId: v })} />}<button onClick={() => removeOutro(o.id)} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 11 }}>Remover</button></div>)}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}><BotaoAcao variant="secondary" onClick={onBack}>Voltar</BotaoAcao><BotaoAcao onClick={onNext}>Continuar</BotaoAcao></div>
  </Card>;
}
