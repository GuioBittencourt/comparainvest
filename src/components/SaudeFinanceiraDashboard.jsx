"use client";
import { useMemo, useState } from "react";
import { C, FN, MN } from "../lib/theme";
import { formatarBRL, salvarSnapshotSaude } from "./SaudeFinanceiraModel";
import { gerarDiagnosticoSaude } from "./SaudeFinanceiraDiagnostico";
import { DISTRIBUICAO_SAUDE } from "./SaudeFinanceiraEngine";
import ExtratoFuturo from "./ExtratoFuturo";
import { gerarExtratoFuturo, listarDividasQuitaveis, projetarIndependencia } from "./ExtratoFuturoEngine";

const ABAS = [
  { id: "financeiro", label: "Financeiro" },
  { id: "distribuicao", label: "Distribuição" },
  { id: "extrato", label: "Extrato Futuro" },
  { id: "dividas", label: "Dívidas" },
  { id: "independencia", label: "Independência" },
  { id: "relatorio", label: "Relatório" },
];

function statusColor(tipo) {
  if (tipo === "critico") return C.red;
  if (tipo === "atencao") return C.yellow;
  if (tipo === "saudavel") return C.accent;
  return C.blue;
}

function Card({ children, style }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18, ...style }}>{children}</div>;
}

function Metric({ label, value, hint, color = C.white }) {
  return (
    <Card style={{ padding: 16 }}>
      <div style={{ fontSize: 10, fontFamily: MN, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: "clamp(20px, 5vw, 30px)", fontWeight: 750, color, marginTop: 4, letterSpacing: -0.5 }}>{value}</div>
      {hint && <div style={{ color: C.textDim, fontSize: 11, marginTop: 4 }}>{hint}</div>}
    </Card>
  );
}

function Linha({ label, value, danger }) {
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
    <span style={{ color: C.textDim, fontSize: 13 }}>{label}</span>
    <strong style={{ color: danger ? C.red : C.white, fontFamily: MN, fontSize: 13 }}>{typeof value === "number" ? formatarBRL(value) : value}</strong>
  </div>;
}

function Financeiro({ data, setData, onEdit }) {
  const diagnostico = useMemo(() => gerarDiagnosticoSaude(data), [data]);
  const r = diagnostico.base;
  const negativo = r.saldoMes < 0;
  return <div style={{ display: "grid", gap: 14 }}>
    <Card style={{ background: negativo ? "linear-gradient(135deg, rgba(226,109,109,.12), rgba(10,18,28,.96))" : "linear-gradient(135deg, rgba(16,185,129,.12), rgba(10,18,28,.96))", border: `1px solid ${negativo ? C.red + "40" : C.accentBorder}` }}>
      <div style={{ fontSize: 10, fontFamily: MN, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Saldo projetado do mês</div>
      <div style={{ fontSize: "clamp(30px, 8vw, 46px)", color: negativo ? C.red : C.accent, fontWeight: 800, marginTop: 6, letterSpacing: -1 }}>{formatarBRL(r.saldoMes)}</div>
      <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, margin: "8px 0 0" }}>{negativo ? "Zona de arrebentação. Agora o problema está visível — e o que fica visível pode ser resolvido." : "O mês respira. Agora o próximo passo é proteger o caixa e direcionar o excedente com estratégia."}</p>
    </Card>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
      <Metric label="Entradas" value={formatarBRL(r.entradas)} color={C.accent} />
      <Metric label="Saídas" value={formatarBRL(r.saidas)} color={r.saidas > r.entradas ? C.red : C.text} />
      <Metric label="Score" value={diagnostico.score.score} hint={diagnostico.score.label} color={statusColor(diagnostico.score.nivel)} />
      <Metric label="Essenciais" value={`${r.percentuais.fixas.toFixed(0)}%`} hint="meta até 60%" color={r.percentuais.fixas > 60 ? C.yellow : C.accent} />
    </div>

    <Card>
      <Linha label="Contas fixas" value={r.fixas} />
      <Linha label="Cartões" value={r.cartoes.total} />
      <Linha label="Outras contas" value={r.outrasContas.parcelaMensal} />
      <Linha label="Consignados fora da folha" value={r.consignados.foraFolha} />
      <Linha label="Agiotas / juros mensais" value={r.agiotas.jurosMensais} danger={r.agiotas.jurosMensais > 0} />
      <Linha label="Diversão calculada (10%)" value={r.diversao} />
      <Linha label="Saldo atual em bancos/espécie" value={r.saldoAtual} />
      <Linha label="Investido/guardado" value={r.investimentos} />
      <Linha label="Patrimônio líquido estimado" value={r.patrimonioLiquido} danger={r.patrimonioLiquido < 0} />
    </Card>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <button onClick={onEdit} style={{ border: `1px solid ${C.border}`, background: C.cardAlt, color: C.text, borderRadius: 14, padding: "13px 16px", cursor: "pointer", fontFamily: FN, fontWeight: 700 }}>Revisar financeiro</button>
      <button onClick={() => salvarSnapshotSaude(data)} style={{ border: `1px solid ${C.accentBorder}`, background: `linear-gradient(135deg, ${C.accent}, #059669)`, color: "#03130D", borderRadius: 14, padding: "13px 16px", cursor: "pointer", fontFamily: FN, fontWeight: 800 }}>Salvar diagnóstico</button>
    </div>
  </div>;
}

function Distribuicao({ data }) {
  const diagnostico = gerarDiagnosticoSaude(data);
  const r = diagnostico.base;
  const itens = [
    ["Essencial", r.fixas, r.entradas * DISTRIBUICAO_SAUDE.essencial, "Contas fixas e estrutura do mês"],
    ["Independência", r.investimentos, r.entradas * DISTRIBUICAO_SAUDE.independencia, "Construção patrimonial de longo prazo"],
    ["Curto prazo", Math.max(r.saldoMes, 0), r.entradas * DISTRIBUICAO_SAUDE.curtoPrazo, "Reserva, objetivos e segurança"],
    ["Educação", 0, r.entradas * DISTRIBUICAO_SAUDE.educacao, "Aprendizado e evolução"],
    ["Diversão", r.diversao, r.entradas * DISTRIBUICAO_SAUDE.diversao, "Uso consciente, sem culpa e sem descontrole"],
  ];
  return <Card>
    <h3 style={{ color: C.white, margin: 0, fontSize: 22 }}>Distribuição saudável</h3>
    <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7 }}>Referência atual: 60% essencial, 10% independência, 15% curto prazo, 5% educação e 10% diversão.</p>
    <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
      {itens.map(([nome, atual, ideal, desc]) => {
        const pct = ideal > 0 ? Math.min((atual / ideal) * 100, 180) : 0;
        const acima = atual > ideal;
        return <div key={nome} style={{ background: C.cardAlt, border: `1px solid ${acima && nome === "Essencial" ? C.red + "35" : C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><strong style={{ color: C.white }}>{nome}</strong><span style={{ color: acima && nome === "Essencial" ? C.red : C.textDim, fontFamily: MN }}>{formatarBRL(atual)} / {formatarBRL(ideal)}</span></div>
          <div style={{ color: C.textDim, fontSize: 12, marginTop: 4 }}>{desc}</div>
          <div style={{ height: 7, background: C.border, borderRadius: 999, marginTop: 10, overflow: "hidden" }}><div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: acima && nome === "Essencial" ? C.red : C.accent, borderRadius: 999 }} /></div>
        </div>;
      })}
    </div>
  </Card>;
}

function Dividas({ data }) {
  const lista = listarDividasQuitaveis(data);
  return <Card>
    <h3 style={{ color: C.white, margin: 0, fontSize: 22 }}>Dívidas e contas quitáveis</h3>
    <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7 }}>
      Tudo que tem prazo para acabar entra aqui: cartão, financiamento, faculdade parcelada, consignado, empréstimo, agiota, carnê, Serasa e contas atrasadas.
    </p>
    {lista.length === 0 ? <p style={{ color: C.textDim }}>Nenhuma conta quitável registrada.</p> : lista.map((d, idx) => <div key={`${d.id}-${idx}`} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center", borderBottom: `1px solid ${C.border}`, padding: "12px 0" }}>
      <div style={{ width: 28, height: 28, borderRadius: 10, background: idx === 0 ? `${C.accent}18` : C.cardAlt, color: idx === 0 ? C.accent : C.textDim, display: "grid", placeItems: "center", fontFamily: MN }}>{idx + 1}</div>
      <div><strong style={{ color: C.white }}>{d.nome}</strong><div style={{ color: C.textDim, fontSize: 12 }}>{d.tipo}</div></div>
      <div style={{ textAlign: "right", fontFamily: MN, fontSize: 12 }}><div style={{ color: C.accent }}>{formatarBRL(d.parcela)}</div><div style={{ color: C.textDim }}>{formatarBRL(d.valorQuitacao)}</div></div>
    </div>)}
    <div style={{ marginTop: 12, border: `1px solid ${C.border}`, background: C.cardAlt, borderRadius: 14, padding: 12, color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>
      A ordem prioriza liberação de fluxo: parcela alta, quitação viável e impacto rápido no mês seguinte. No Premium, o app executa essa estratégia automaticamente e você só altera se quiser.
    </div>
  </Card>;
}

function Independencia({ data }) {
  const extrato = gerarExtratoFuturo(data);
  const ultimo = extrato[extrato.length - 1] || {};
  const aporteInicial = Math.max(0, Number(ultimo.investimentoAcumulado || 0));
  const aporteMensal = Math.max(0, Number(ultimo.investimento || 0));
  const projecao = projetarIndependencia({ aporteInicial, aporteMensal, taxaAnual: 15, anos: 35 });
  const destaques = [1, 5, 10, 20, 30, 35].map((ano) => projecao.find((p) => p.ano === ano)).filter(Boolean);

  return <Card>
    <h3 style={{ color: C.white, margin: 0, fontSize: 22 }}>Independência financeira</h3>
    <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7 }}>
      O aporte inicial usa o total investido ao final dos 13 meses do Extrato Futuro. O aporte mensal usa a sobra investida no último mês projetado.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
      <Metric label="Aporte inicial" value={formatarBRL(aporteInicial)} color={C.accent} />
      <Metric label="Aporte mensal" value={formatarBRL(aporteMensal)} color={aporteMensal > 0 ? C.accent : C.red} />
      <Metric label="Taxa padrão" value="15% a.a." hint="ajustável futuramente" />
    </div>

    <div style={{ overflowX: "auto", marginTop: 16 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
        <thead>
          <tr>
            {["Ano", "Patrimônio projetado", "Renda mensal estimada"].map((h) => <th key={h} style={{ textAlign: h === "Ano" ? "left" : "right", color: C.textMuted, fontFamily: MN, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, padding: "10px 8px", borderBottom: `1px solid ${C.border}` }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {destaques.map((p) => <tr key={p.ano}>
            <td style={{ color: C.white, fontWeight: 800, padding: "11px 8px", borderBottom: `1px solid ${C.border}` }}>{p.ano} anos</td>
            <td style={{ color: C.accent, fontFamily: MN, textAlign: "right", padding: "11px 8px", borderBottom: `1px solid ${C.border}` }}>{formatarBRL(p.patrimonio)}</td>
            <td style={{ color: C.textDim, fontFamily: MN, textAlign: "right", padding: "11px 8px", borderBottom: `1px solid ${C.border}` }}>{formatarBRL(p.rendaMensal)}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </Card>;
}

function Relatorio({ data }) {
  const diagnostico = gerarDiagnosticoSaude(data);
  return <Card>
    <h3 style={{ color: C.white, margin: 0, fontSize: 22 }}>Relatório da Saúde Financeira</h3>
    <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7 }}>Diagnóstico inicial com leitura objetiva, impacto e direção prática.</p>
    <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
      {diagnostico.insights.map((insight, idx) => <div key={`${insight.titulo}-${idx}`} style={{ border: `1px solid ${statusColor(insight.tipo)}30`, background: `${statusColor(insight.tipo)}0D`, borderRadius: 14, padding: 14 }}>
        <div style={{ color: C.white, fontWeight: 800 }}>{insight.titulo}</div>
        <div style={{ color: C.textDim, fontSize: 13, lineHeight: 1.65, marginTop: 6 }}>{insight.impacto}</div>
        <div style={{ color: statusColor(insight.tipo), fontSize: 13, lineHeight: 1.65, marginTop: 8 }}>{insight.direcao}</div>
      </div>)}
    </div>
  </Card>;
}

export default function SaudeFinanceiraDashboard({ data, setData, onEdit }) {
  const [aba, setAba] = useState("financeiro");
  const content = {
    financeiro: <Financeiro data={data} setData={setData} onEdit={onEdit} />,
    distribuicao: <Distribuicao data={data} />,
    extrato: <ExtratoFuturo data={data} />,
    dividas: <Dividas data={data} />,
    independencia: <Independencia data={data} />,
    relatorio: <Relatorio data={data} />,
  }[aba];

  return <div style={{ display: "grid", gap: 16 }}>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
      {ABAS.map((a) => <button key={a.id} onClick={() => setAba(a.id)} style={{ border: `1px solid ${aba === a.id ? C.accentBorder : C.border}`, background: aba === a.id ? `${C.accent}14` : "transparent", color: aba === a.id ? C.accent : C.textDim, borderRadius: 999, padding: "8px 11px", cursor: "pointer", fontFamily: FN, fontSize: 12, fontWeight: 700 }}>{a.label}</button>)}
    </div>
    {content}
  </div>;
}
