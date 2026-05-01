"use client";
import { useMemo } from "react";
import { Card, TituloBloco, Dica, CampoMoeda, CampoTexto, SelectCampo, OpcaoSimNao, BotaoAcao } from "./SaudeFinanceiraUI";
import { novoId } from "./SaudeFinanceiraModel";
import { C, MN } from "../lib/theme";

export default function SaudeFinanceiraEntradas({ data, setData, onNext }) {
  const entradas = data.entradas;
  const liquidoOk = entradas.salario1.confirmadoLiquido;

  const totalPrevio = useMemo(() => {
    const fonte = (entradas.outrasFontes || []).reduce((s, f) => s + (Number(f.valor) || 0), 0);
    return (Number(entradas.salario1.valor) || 0) + (Number(entradas.salario2.valor) || 0) + (Number(entradas.adiantamento1.valor) || 0) + (Number(entradas.adiantamento2.valor) || 0) + (entradas.vaVr.tipo === "dinheiro" ? Number(entradas.vaVr.valor) || 0 : 0) + fonte;
  }, [entradas]);

  const updateEntradas = (patch) => setData((p) => ({ ...p, entradas: { ...p.entradas, ...patch } }));
  const addFonte = () => updateEntradas({ outrasFontes: [...(entradas.outrasFontes || []), { id: novoId("of"), tipo: "beneficio", valor: 0, abateFinanciamento: false, financiamentoRef: null }] });
  const updateFonte = (id, patch) => updateEntradas({ outrasFontes: entradas.outrasFontes.map((f) => (f.id === id ? { ...f, ...patch } : f)) });
  const removeFonte = (id) => updateEntradas({ outrasFontes: entradas.outrasFontes.filter((f) => f.id !== id) });

  return <Card><TituloBloco etapa="Bloco 1 de 7" titulo="Entradas" subtitulo="Vamos começar pelo que realmente entra na sua conta. O salário precisa ser líquido: o valor depois dos descontos." />
    <CampoMoeda label="Salário líquido principal" value={entradas.salario1.valor} onChange={(v) => updateEntradas({ salario1: { ...entradas.salario1, valor: v, confirmadoLiquido: false } })} />
    <OpcaoSimNao label="Esse é o valor líquido mesmo, o que cai na conta?" value={entradas.salario1.confirmadoLiquido} onChange={(v) => updateEntradas({ salario1: { ...entradas.salario1, confirmadoLiquido: v } })} />
    {!liquidoOk && <Dica tone="warn">Confirme no holerite ou no extrato. Se usar valor bruto, o diagnóstico nasce torto — igual régua empenada.</Dica>}

    <OpcaoSimNao label="Tem segunda renda fixa? (cônjuge, segundo emprego ou renda familiar recorrente)" value={(entradas.salario2.valor || 0) > 0} onChange={(v) => updateEntradas({ salario2: { ...entradas.salario2, valor: v ? entradas.salario2.valor || 0 : 0, confirmadoLiquido: false } })} />
    {(entradas.salario2.valor || 0) > 0 && <><CampoMoeda label="Valor líquido da segunda renda" value={entradas.salario2.valor} onChange={(v) => updateEntradas({ salario2: { ...entradas.salario2, valor: v } })} /><OpcaoSimNao label="Essa segunda renda também é líquida?" value={entradas.salario2.confirmadoLiquido} onChange={(v) => updateEntradas({ salario2: { ...entradas.salario2, confirmadoLiquido: v } })} /></>}

    <CampoMoeda label="Adiantamento 1, se houver" value={entradas.adiantamento1.valor} onChange={(v) => updateEntradas({ adiantamento1: { ...entradas.adiantamento1, valor: v } })} />
    <CampoMoeda label="Adiantamento 2, se houver" value={entradas.adiantamento2.valor} onChange={(v) => updateEntradas({ adiantamento2: { ...entradas.adiantamento2, valor: v } })} />

    <OpcaoSimNao label="Tem 13º salário?" value={entradas.tem13} onChange={(v) => updateEntradas({ tem13: v, decimoTerceiro: v ? entradas.decimoTerceiro : { valor: 0, mes: 12 } })} />
    {entradas.tem13 && <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 8 }}><CampoMoeda label="Valor médio do 13º" value={entradas.decimoTerceiro.valor} onChange={(v) => updateEntradas({ decimoTerceiro: { ...entradas.decimoTerceiro, valor: v } })} /><CampoTexto label="Mês" value={entradas.decimoTerceiro.mes} onChange={(v) => updateEntradas({ decimoTerceiro: { ...entradas.decimoTerceiro, mes: Number(v) || 12 } })} /></div>}

    <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 8 }}><CampoMoeda label="PLR, se houver" value={entradas.plr.valor} onChange={(v) => updateEntradas({ plr: { ...entradas.plr, valor: v } })} /><CampoTexto label="Mês" value={entradas.plr.mes || ""} onChange={(v) => updateEntradas({ plr: { ...entradas.plr, mes: Number(v) || null } })} /></div>
    <CampoMoeda label="Bônus médio mensal, se houver" value={entradas.bonus.valor} onChange={(v) => updateEntradas({ bonus: { valor: v } })} />

    <div style={{ display: "grid", gridTemplateColumns: "1fr 150px", gap: 8 }}><CampoMoeda label="VA/VR" value={entradas.vaVr.valor} onChange={(v) => updateEntradas({ vaVr: { ...entradas.vaVr, valor: v } })} /><SelectCampo label="Tipo" value={entradas.vaVr.tipo} onChange={(v) => updateEntradas({ vaVr: { ...entradas.vaVr, tipo: v } })} options={[{ value: "cartao", label: "Cartão" }, { value: "dinheiro", label: "Dinheiro/conta" }]} /></div>
    {entradas.vaVr.valor > 0 && entradas.vaVr.tipo === "cartao" && <Dica>VA/VR em cartão ajuda na alimentação, mas não conta como dinheiro sobrando.</Dica>}

    <div style={{ marginTop: 14, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}><strong style={{ color: C.white, fontSize: 13 }}>Outras fontes</strong><button onClick={addFonte} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.accent, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontFamily: MN, fontSize: 10 }}>+ adicionar</button></div>
    {(entradas.outrasFontes || []).map((f) => <div key={f.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, marginBottom: 10 }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><SelectCampo label="Tipo" value={f.tipo} onChange={(v) => updateFonte(f.id, { tipo: v })} options={[{ value: "aluguel", label: "Aluguel recebido" }, { value: "pensao", label: "Pensão recebida" }, { value: "beneficio", label: "Benefício" }, { value: "auxilio", label: "Auxílio" }, { value: "conjuge", label: "Cônjuge" }, { value: "outro", label: "Outro" }]} /><CampoMoeda label="Valor" value={f.valor} onChange={(v) => updateFonte(f.id, { valor: v })} /></div>{f.tipo === "aluguel" && <OpcaoSimNao label="Esse aluguel abate algum financiamento?" value={f.abateFinanciamento} onChange={(v) => updateFonte(f.id, { abateFinanciamento: v })} />}<button onClick={() => removeFonte(f.id)} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 11 }}>Remover fonte</button></div>)}

    <Dica>Entrada mensal estimada: <strong>{totalPrevio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></Dica>
    <BotaoAcao onClick={onNext} disabled={!liquidoOk || !(entradas.salario1.valor > 0)}>Continuar</BotaoAcao>
  </Card>;
}
