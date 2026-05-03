"use client";
import { Card, TituloBloco, Dica, CampoMoeda, CampoTexto, SelectCampo, OpcaoSimNao, BotaoAcao } from "./SaudeFinanceiraUI";

export default function SaudeFinanceiraMoradia({ data, setData, onNext, onBack }) {
  const fixas = data.contasFixas;
  const updateFixas = (patch) => setData((p) => ({ ...p, contasFixas: { ...p.contasFixas, ...patch } }));
  const updateMoradia = (patch) => updateFixas({ moradia: { ...fixas.moradia, ...patch } });
  const updateTransporte = (patch) => updateFixas({ transporte: { ...fixas.transporte, ...patch } });

  return <Card><TituloBloco etapa="Bloco 2 de 7" titulo="Moradia e essenciais" subtitulo="Aqui entram os gastos que normalmente sustentam o mês: casa, alimentação, transporte e comunicação." />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><SelectCampo label="Moradia" value={fixas.moradia.tipo} onChange={(v) => updateMoradia({ tipo: v })} options={[{ value: "aluguel", label: "Aluguel" }, { value: "financiamento", label: "Financiamento" }, { value: "quitada", label: "Casa quitada" }, { value: "pais", label: "Moro com pais/família" }, { value: "cedida", label: "Cedida" }]} /><CampoMoeda label="Valor da moradia" value={fixas.moradia.valor} onChange={(v) => updateMoradia({ valor: v })} /></div>
    {Number(fixas.moradia.valor) === 0 && <Dica tone="warn">Moradia zerada precisa ser real: casa quitada, mora com família ou cedida. Se existe boleto, ele precisa entrar.</Dica>}
    <CampoMoeda label="Condomínio" value={fixas.condominio} onChange={(v) => updateFixas({ condominio: v })} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><CampoMoeda label="Água" value={fixas.agua} onChange={(v) => updateFixas({ agua: v })} /><CampoMoeda label="Luz" value={fixas.luz} onChange={(v) => updateFixas({ luz: v })} /><CampoMoeda label="Gás" value={fixas.gas} onChange={(v) => updateFixas({ gas: v })} /><CampoMoeda label="Mercado" value={fixas.mercado} onChange={(v) => updateFixas({ mercado: v })} /></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><SelectCampo label="Transporte" value={fixas.transporte.tipo} onChange={(v) => updateTransporte({ tipo: v })} options={[{ value: "gasolina", label: "Gasolina" }, { value: "publico", label: "Transporte público" }, { value: "app", label: "App/Uber" }, { value: "misto", label: "Misto" }, { value: "zero", label: "Não gasto" }]} /><CampoMoeda label="Valor transporte" value={fixas.transporte.valor} onChange={(v) => updateTransporte({ valor: v })} /></div>
    {Number(fixas.transporte.valor) === 0 && <Dica>Transporte zerado é possível, mas confirme: home office, vai a pé, carona ou veículo da empresa.</Dica>}
    <CampoMoeda label="Uber / apps avulsos" value={fixas.uber} onChange={(v) => updateFixas({ uber: v })} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><CampoMoeda label="Celular" value={fixas.celular} onChange={(v) => updateFixas({ celular: v })} /><CampoMoeda label="Internet" value={fixas.internet} onChange={(v) => updateFixas({ internet: v })} /></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}><BotaoAcao variant="secondary" onClick={onBack}>Voltar</BotaoAcao><BotaoAcao onClick={onNext}>Continuar</BotaoAcao></div>
  </Card>;
}
