"use client";
import { Card, TituloBloco, Dica, CampoMoeda, CampoTexto, CampoNumero, SelectCampo, OpcaoSimNao, BotaoAcao } from "./SaudeFinanceiraUI";
import { novoId } from "./SaudeFinanceiraModel";
import { C, MN, FN } from "../lib/theme";

// Gera lista de meses futuros (13 meses a partir do atual)
function proximosMeses() {
  const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const hoje = new Date();
  const lista = [];
  for (let i = 0; i <= 12; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    const valor = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const label = i === 0 ? `${meses[d.getMonth()]} (este mês)` : meses[d.getMonth()] + " " + d.getFullYear();
    lista.push({ value: valor, label });
  }
  return lista;
}

export default function SaudeFinanceiraDividas({ data, setData, onNext, onBack }) {
  const add = (key, item) => setData((p) => ({ ...p, [key]: [...(p[key] || []), { id: novoId(key), ...item }] }));
  const update = (key, id, patch) => setData((p) => ({ ...p, [key]: p[key].map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
  const remove = (key, id) => setData((p) => ({ ...p, [key]: p[key].filter((i) => i.id !== id) }));

  const mesList = proximosMeses();
  const mesAtual = mesList[0]?.value;

  return (
    <Card>
      <TituloBloco etapa="Bloco 5 de 7" titulo="Dívidas e atrasos" subtitulo="Sem julgamento. Dívida bem mapeada perde força. Dívida escondida manda no mês." />
      <Dica>Consignado precisa de atenção: se desconta em folha, ao quitar ele aumenta o salário líquido disponível.</Dica>

      {/* CONSIGNADOS */}
      <Secao title="Consignados" onAdd={() => add("consignados", { nome: "", parcela: 0, restantes: 0, valorQuitacao: 0, descontaFolha: true })} />
      {(data.consignados || []).map((d) => (
        <div key={d.id} style={box()}>
          <CampoTexto label="Nome" value={d.nome} onChange={(v) => update("consignados", d.id, { nome: v })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <CampoMoeda label="Parcela" value={d.parcela} onChange={(v) => update("consignados", d.id, { parcela: v })} />
            <CampoNumero label="Restantes" value={d.restantes} onChange={(v) => update("consignados", d.id, { restantes: v === "" ? 0 : v })} />
          </div>
          <CampoMoeda label="Valor para quitar" value={d.valorQuitacao} onChange={(v) => update("consignados", d.id, { valorQuitacao: v })} />
          <OpcaoSimNao label="Desconta em folha?" value={d.descontaFolha} onChange={(v) => update("consignados", d.id, { descontaFolha: v })} />
          <Remover onClick={() => remove("consignados", d.id)} />
        </div>
      ))}

      {/* OUTRAS CONTAS QUITÁVEIS */}
      <Secao title="Outras contas quitáveis" onAdd={() => add("outrasContas", { tipo: "emprestimo", nome: "", parcela: 0, restantes: 0, valorTotal: 0, mesPagamento: mesAtual })} />
      {(data.outrasContas || []).map((d) => {
        const semParcela = !d.restantes || Number(d.restantes) <= 1;
        return (
          <div key={d.id} style={box()}>
            <SelectCampo label="Tipo" value={d.tipo} onChange={(v) => update("outrasContas", d.id, { tipo: v })}
              options={["emprestimo","financiamento_auto","financiamento_imovel","consorcio","cartao_loja","boleto_carne","amigo_familia","serasa","outro"].map((v) => ({ value: v, label: v.replaceAll("_"," ") }))} />
            <CampoTexto label="Nome" value={d.nome} onChange={(v) => update("outrasContas", d.id, { nome: v })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <CampoMoeda label="Parcela / valor" value={d.parcela} onChange={(v) => update("outrasContas", d.id, { parcela: v })} />
              <CampoNumero label="Parcelas restantes" value={d.restantes} onChange={(v) => update("outrasContas", d.id, { restantes: v === "" ? 0 : v })} />
            </div>
            <CampoMoeda label="Valor total" value={d.valorTotal} onChange={(v) => update("outrasContas", d.id, { valorTotal: v })} />

            {/* Mês de pagamento — aparece quando não tem parcelas */}
            {semParcela && (
              <div style={{ marginTop: 4 }}>
                <SelectCampo
                  label="Em qual mês será paga?"
                  value={d.mesPagamento || mesAtual}
                  onChange={(v) => update("outrasContas", d.id, { mesPagamento: v })}
                  options={mesList}
                />
                {d.mesPagamento && d.mesPagamento !== mesAtual && (
                  <Dica>Esta conta só entra no extrato em {mesList.find(m => m.value === d.mesPagamento)?.label || d.mesPagamento}. Não afeta o mês atual.</Dica>
                )}
              </div>
            )}

            <Remover onClick={() => remove("outrasContas", d.id)} />
          </div>
        );
      })}

      {/* AGIOTAS */}
      <Secao title="Agiotas / juros por fora" onAdd={() => add("agiotas", { nome: "", valorQuitacao: 0, pagaJurosMensais: true, juros: { tipo: "percentual", valor: 0 } })} />
      {(data.agiotas || []).map((a) => (
        <div key={a.id} style={box()}>
          <CampoTexto label="Nome / referência" value={a.nome} onChange={(v) => update("agiotas", a.id, { nome: v })} />
          <CampoMoeda label="Valor para quitar" value={a.valorQuitacao} onChange={(v) => update("agiotas", a.id, { valorQuitacao: v })} />
          <SelectCampo label="Tipo de juros mensal" value={a.juros.tipo} onChange={(v) => update("agiotas", a.id, { juros: { ...a.juros, tipo: v } })}
            options={[{value:"percentual",label:"Percentual (%)"},{value:"fixo",label:"Valor fixo"}]} />
          <CampoMoeda label={a.juros.tipo === "percentual" ? "Juros % ao mês" : "Juros fixo ao mês"} value={a.juros.valor} onChange={(v) => update("agiotas", a.id, { juros: { ...a.juros, valor: v } })} />
          <Dica tone="danger">Juro de agiota costuma ser uma emergência financeira. O plano precisa tratar isso com prioridade.</Dica>
          <Remover onClick={() => remove("agiotas", a.id)} />
        </div>
      ))}

      {/* CONTAS ATRASADAS */}
      <Secao title="Contas atrasadas" onAdd={() => add("contasAtrasadas", { nome: "", valorTotal: 0, valorConta: 0 })} />
      {(data.contasAtrasadas || []).map((c) => (
        <div key={c.id} style={box()}>
          <CampoTexto label="Conta" value={c.nome} onChange={(v) => update("contasAtrasadas", c.id, { nome: v })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <CampoMoeda label="Valor total" value={c.valorTotal} onChange={(v) => update("contasAtrasadas", c.id, { valorTotal: v })} />
            <CampoMoeda label="Valor mensal" value={c.valorConta} onChange={(v) => update("contasAtrasadas", c.id, { valorConta: v })} />
          </div>
          <Remover onClick={() => remove("contasAtrasadas", c.id)} />
        </div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
        <BotaoAcao variant="secondary" onClick={onBack}>Voltar</BotaoAcao>
        <BotaoAcao onClick={onNext}>Continuar</BotaoAcao>
      </div>
    </Card>
  );
}

function box() { return { border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }; }
function Secao({ title, onAdd }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 10px" }}>
      <strong style={{ color: C.white, fontSize: 13 }}>{title}</strong>
      <button onClick={onAdd} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.accent, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontFamily: MN, fontSize: 10 }}>+ adicionar</button>
    </div>
  );
}
function Remover({ onClick }) {
  return <button onClick={onClick} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 11, fontFamily: FN }}>Remover</button>;
}