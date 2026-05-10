"use client";
import { Card, TituloBloco, CampoMoeda, CampoTexto, SelectCampo, BotaoAcao } from "./SaudeFinanceiraUI";
import { novoId } from "./SaudeFinanceiraModel";
import { C, MN } from "../lib/theme";

export default function SaudeFinanceiraSaldo({ data, setData, onNext, onBack }) {
  const saldo = data.saldo;
  const bancos = saldo.bancos || [];
  const investimentos = data.investimentos || [];
  const updateSaldo = (patch) => setData((p) => ({ ...p, saldo: { ...p.saldo, ...patch } }));
  const addBanco = () => updateSaldo({ bancos: [...bancos, { id: novoId("banco"), nome: "", valor: 0 }] });
  const updateBanco = (id, patch) => updateSaldo({ bancos: bancos.map((b) => (b.id === id ? { ...b, ...patch } : b)) });
  const removeBanco = (id) => updateSaldo({ bancos: bancos.filter((b) => b.id !== id) });
  const addInvestimento = () => setData((p) => ({ ...p, investimentos: [...investimentos, { id: novoId("inv"), tipo: "poupanca", onde: "", valor: 0 }] }));
  const updateInvestimento = (id, patch) => setData((p) => ({ ...p, investimentos: investimentos.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
  const removeInvestimento = (id) => setData((p) => ({ ...p, investimentos: investimentos.filter((i) => i.id !== id) }));

  return <Card><TituloBloco etapa="Bloco 6 de 7" titulo="Saldo e investimentos" subtitulo="Agora vamos ver o que existe hoje: dinheiro parado, saldo em banco e investimentos já acumulados." />
    <CampoMoeda label="Dinheiro em espécie" value={saldo.especie} onChange={(v) => updateSaldo({ especie: v })} />
    <Secao title="Bancos" onAdd={addBanco} />
    {bancos.length === 0 && <p style={{ color: C.textDim, fontSize: 12 }}>Nenhum banco cadastrado ainda.</p>}
    {bancos.map((b) => <div key={b.id} style={box()}><CampoTexto label="Nome do banco" value={b.nome} onChange={(v) => updateBanco(b.id, { nome: v })} /><CampoMoeda label="Saldo" value={b.valor} onChange={(v) => updateBanco(b.id, { valor: v })} /><Remover onClick={() => removeBanco(b.id)} /></div>)}
    <Secao title="Investimentos / dinheiro guardado" onAdd={addInvestimento} />
    {investimentos.map((i) => <div key={i.id} style={box()}><SelectCampo label="Tipo" value={i.tipo} onChange={(v) => updateInvestimento(i.id, { tipo: v })} options={["poupanca","cdb","tesouro","acoes","fii","fundo","cripto","outro"].map((v)=>({value:v,label:v.toUpperCase()}))} /><CampoTexto label="Onde está" value={i.onde} onChange={(v) => updateInvestimento(i.id, { onde: v })} placeholder="Ex.: Nubank, XP, banco..." /><CampoMoeda label="Valor" value={i.valor} onChange={(v) => updateInvestimento(i.id, { valor: v })} /><Remover onClick={() => removeInvestimento(i.id)} /></div>)}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}><BotaoAcao variant="secondary" onClick={onBack}>Voltar</BotaoAcao><BotaoAcao onClick={onNext}>Ver resumo</BotaoAcao></div>
  </Card>;
}
function box(){return{border:`1px solid ${C.border}`,borderRadius:14,padding:14,marginBottom:12};}
function Secao({title,onAdd}){return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 0 10px"}}><strong style={{color:C.white,fontSize:13}}>{title}</strong><button onClick={onAdd} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.accent,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontFamily:MN,fontSize:10}}>+ adicionar</button></div>}
function Remover({onClick}){return <button onClick={onClick} style={{background:"transparent",border:"none",color:C.textMuted,cursor:"pointer",fontSize:11}}>Remover</button>}
