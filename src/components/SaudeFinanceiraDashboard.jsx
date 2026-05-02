"use client";
import { useMemo, useState } from "react";
import { C, FN, MN } from "../lib/theme";
import { formatarBRL, salvarSnapshotSaude } from "./SaudeFinanceiraModel";
import { gerarDiagnosticoSaude } from "./SaudeFinanceiraDiagnostico";
import { DISTRIBUICAO_SAUDE } from "./SaudeFinanceiraEngine";
import ExtratoFuturo from "./ExtratoFuturo";
import { gerarExtratoFuturo, listarDividasQuitaveis, projetarIndependencia } from "./ExtratoFuturoEngine";
import PremiumGate from "./PremiumGate";

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
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ color: C.textDim, fontSize: 13 }}>{label}</span>
      <strong style={{ color: danger ? C.red : C.white, fontFamily: MN, fontSize: 13 }}>
        {typeof value === "number" ? formatarBRL(value) : value}
      </strong>
    </div>
  );
}

// Bloco chamariz Premium — padrão do app
function BlocoUpgrade({ onUpgrade }) {
  return (
    <div style={{
      marginTop: 20,
      padding: "22px 20px",
      background: `linear-gradient(135deg, ${C.accent}10, rgba(10,18,28,0.96) 60%)`,
      border: `1px solid ${C.accentBorder}`,
      borderRadius: 16,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 10, fontFamily: MN, color: C.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
        ACESSO PREMIUM
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: C.white, marginBottom: 8, lineHeight: 1.3 }}>
        Clareza financeira muda tudo
      </div>
      <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.65, marginBottom: 16, maxWidth: 340, margin: "0 auto 16px" }}>
        Você já tem o mapa. O Premium transforma esse mapa em plano de ação — com direções concretas, ajustes e projeção do seu futuro.
      </p>
      <button
        onClick={onUpgrade}
        style={{
          width: "100%",
          padding: "13px 0",
          borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accent}, #059669)`,
          border: "none",
          color: "#03130D",
          fontFamily: FN,
          fontSize: 14,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Ver planos →
      </button>
    </div>
  );
}

function Financeiro({ data, setData, onEdit }) {
  const diagnostico = useMemo(() => gerarDiagnosticoSaude(data), [data]);
  const r = diagnostico.base;
  const negativo = r.saldoMes < 0;
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Card style={{
        background: negativo
          ? "linear-gradient(135deg, rgba(226,109,109,.12), rgba(10,18,28,.96))"
          : "linear-gradient(135deg, rgba(16,185,129,.12), rgba(10,18,28,.96))",
        border: `1px solid ${negativo ? C.red + "40" : C.accentBorder}`,
      }}>
        <div style={{ fontSize: 10, fontFamily: MN, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Saldo projetado do mês</div>
        <div style={{ fontSize: "clamp(30px, 8vw, 46px)", color: negativo ? C.red : C.accent, fontWeight: 800, marginTop: 6, letterSpacing: -1 }}>{formatarBRL(r.saldoMes)}</div>
        <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, margin: "8px 0 0" }}>
          {negativo ? "Zona de arrebentação. Agora o problema está visível — e o que fica visível pode ser resolvido." : "O mês respira. Agora o próximo passo é proteger o caixa e direcionar o excedente com estratégia."}
        </p>
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
    </div>
  );
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
  return (
    <Card>
      <h3 style={{ color: C.white, margin: 0, fontSize: 22 }}>Distribuição saudável</h3>
      <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7 }}>Referência atual: 60% essencial, 10% independência, 15% curto prazo, 5% educação e 10% diversão.</p>
      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {itens.map(([nome, atual, ideal, desc]) => {
          const pct = ideal > 0 ? Math.min((atual / ideal) * 100, 180) : 0;
          const acima = atual > ideal;
          return (
            <div key={nome} style={{ background: C.cardAlt, border: `1px solid ${acima && nome === "Essencial" ? C.red + "35" : C.border}`, borderRadius: 14, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <strong style={{ color: C.white }}>{nome}</strong>
                <span style={{ color: acima && nome === "Essencial" ? C.red : C.textDim, fontFamily: MN }}>{formatarBRL(atual)} / {formatarBRL(ideal)}</span>
              </div>
              <div style={{ color: C.textDim, fontSize: 12, marginTop: 4 }}>{desc}</div>
              <div style={{ height: 7, background: C.border, borderRadius: 999, marginTop: 10, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: acima && nome === "Essencial" ? C.red : C.accent, borderRadius: 999 }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Extrato Futuro: free vê tabela somente leitura, premium ajusta investimentos
function ExtratoFuturoWrapper({ data, isPremium, onUpgrade }) {
  const [showGate, setShowGate] = useState(false);
  return (
    <div>
      {showGate && <PremiumGate context="saudeFinanceira" onClose={() => setShowGate(false)} />}
      <ExtratoFuturo
        data={data}
        isPremium={isPremium}
        onBloqueioClick={() => setShowGate(true)}
      />
    </div>
  );
}

// Dívidas: free vê lista, premium vê a nota de estratégia completa
function Dividas({ data, isPremium, onUpgrade }) {
  const [showGate, setShowGate] = useState(false);
  const lista = listarDividasQuitaveis(data);
  return (
    <Card>
      {showGate && <PremiumGate context="saudeFinanceira" onClose={() => setShowGate(false)} />}
      <h3 style={{ color: C.white, margin: 0, fontSize: 22 }}>Dívidas e contas quitáveis</h3>
      <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7 }}>
        Tudo que tem prazo para acabar entra aqui: cartão, financiamento, faculdade parcelada, consignado, empréstimo, agiota, carnê, Serasa e contas atrasadas.
      </p>
      {lista.length === 0
        ? <p style={{ color: C.textDim }}>Nenhuma conta quitável registrada.</p>
        : lista.map((d, idx) => (
          <div key={`${d.id}-${idx}`} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center", borderBottom: `1px solid ${C.border}`, padding: "12px 0" }}>
            <div style={{ width: 28, height: 28, borderRadius: 10, background: idx === 0 ? `${C.accent}18` : C.cardAlt, color: idx === 0 ? C.accent : C.textDim, display: "grid", placeItems: "center", fontFamily: MN }}>{idx + 1}</div>
            <div><strong style={{ color: C.white }}>{d.nome}</strong><div style={{ color: C.textDim, fontSize: 12 }}>{d.tipo}</div></div>
            <div style={{ textAlign: "right", fontFamily: MN, fontSize: 12 }}>
              <div style={{ color: C.accent }}>{formatarBRL(d.parcela)}</div>
              <div style={{ color: C.textDim }}>{formatarBRL(d.valorQuitacao)}</div>
            </div>
          </div>
        ))
      }
      {isPremium ? (
        <div style={{ marginTop: 12, border: `1px solid ${C.border}`, background: C.cardAlt, borderRadius: 14, padding: 12, color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>
          A ordem prioriza liberação de fluxo: parcela alta, quitação viável e impacto rápido no mês seguinte. O Extrato Futuro executa essa estratégia automaticamente — você só altera se quiser.
        </div>
      ) : (
        <div
          onClick={() => setShowGate(true)}
          style={{ marginTop: 12, border: `1px solid ${C.accentBorder}`, background: `${C.accent}08`, borderRadius: 14, padding: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>Ver estratégia de quitação e simulação automática</span>
          <span style={{ fontSize: 11, fontFamily: MN, color: C.accent, flexShrink: 0, marginLeft: 10 }}>Premium →</span>
        </div>
      )}
    </Card>
  );
}

// Independência: free vê preview parcial (1 e 5 anos), premium vê tudo
function Independencia({ data, isPremium, onUpgrade }) {
  const [showGate, setShowGate] = useState(false);
  const extrato = gerarExtratoFuturo(data);
  const ultimo = extrato[extrato.length - 1] || {};
  const aporteInicial = Math.max(0, Number(ultimo.investimentoAcumulado || 0));
  const aporteMensal = Math.max(0, Number(ultimo.investimento || 0));
  const projecao = projetarIndependencia({ aporteInicial, aporteMensal, taxaAnual: 15, anos: 35 });
  const todosPeriodos = [1, 5, 10, 20, 30, 35];
  const periodosFree = [1, 5];
  const destaques = todosPeriodos.map((ano) => projecao.find((p) => p.ano === ano)).filter(Boolean);

  return (
    <Card>
      {showGate && <PremiumGate context="saudeFinanceira" onClose={() => setShowGate(false)} />}
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
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
          <thead>
            <tr>
              {["Ano", "Patrimônio projetado", "Renda mensal estimada"].map((h) => (
                <th key={h} style={{ textAlign: h === "Ano" ? "left" : "right", color: C.textMuted, fontFamily: MN, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, padding: "10px 8px", borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {destaques.map((p) => {
              const bloqueado = !isPremium && !periodosFree.includes(p.ano);
              return (
                <tr key={p.ano} onClick={bloqueado ? () => setShowGate(true) : undefined} style={{ cursor: bloqueado ? "pointer" : "default" }}>
                  <td style={{ color: C.white, fontWeight: 800, padding: "11px 8px", borderBottom: `1px solid ${C.border}` }}>{p.ano} anos</td>
                  <td style={{ fontFamily: MN, textAlign: "right", padding: "11px 8px", borderBottom: `1px solid ${C.border}`, color: bloqueado ? "transparent", textShadow: bloqueado ? "0 0 10px rgba(255,255,255,0.4)" : "none", userSelect: bloqueado ? "none" : "auto" }}>
                    {bloqueado ? "••••••" : <span style={{ color: C.accent }}>{formatarBRL(p.patrimonio)}</span>}
                  </td>
                  <td style={{ fontFamily: MN, textAlign: "right", padding: "11px 8px", borderBottom: `1px solid ${C.border}`, color: bloqueado ? "transparent", textShadow: bloqueado ? "0 0 10px rgba(255,255,255,0.3)" : "none", userSelect: bloqueado ? "none" : "auto" }}>
                    {bloqueado ? "••••" : <span style={{ color: C.textDim }}>{formatarBRL(p.rendaMensal)}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!isPremium && (
        <div
          onClick={() => setShowGate(true)}
          style={{ marginTop: 12, border: `1px solid ${C.accentBorder}`, background: `${C.accent}08`, borderRadius: 14, padding: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span style={{ fontSize: 12, color: C.textDim }}>Ver projeção completa: 10, 20, 30 e 35 anos</span>
          <span style={{ fontSize: 11, fontFamily: MN, color: C.accent, flexShrink: 0, marginLeft: 10 }}>Premium →</span>
        </div>
      )}
    </Card>
  );
}

// Relatório: free vê panorama + pontos críticos sem direção; premium vê tudo
function Relatorio({ data, isPremium, onUpgrade }) {
  const [showGate, setShowGate] = useState(false);
  const diagnostico = useMemo(() => gerarDiagnosticoSaude(data), [data]);
  const { relatorio, insights } = diagnostico;

  return (
    <Card>
      {showGate && <PremiumGate context="saudeFinanceira" onClose={() => setShowGate(false)} />}
      <h3 style={{ color: C.white, margin: 0, fontSize: 22 }}>Relatório da Saúde Financeira</h3>
      <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7 }}>
        {isPremium
          ? "Diagnóstico completo com leitura objetiva, impacto e direção prática."
          : "Panorama geral da sua situação financeira atual."}
      </p>

      {/* Panorama — todos veem */}
      <div style={{ padding: "14px 16px", background: `${C.accent}08`, border: `1px solid ${C.accentBorder}`, borderRadius: 14, marginTop: 14 }}>
        <div style={{ fontSize: 10, fontFamily: MN, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Panorama</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 6 }}>{relatorio.panorama}</div>
        <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.65, margin: 0 }}>{relatorio.resumo}</p>
      </div>

      {/* Pontos críticos — todos veem o título, free não vê a direção */}
      {relatorio.pontosCriticos.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, fontFamily: MN, color: C.red, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            Pontos críticos ({relatorio.pontosCriticos.length})
          </div>
          {relatorio.pontosCriticos.map((insight, idx) => (
            <div key={idx} style={{ border: `1px solid ${C.red}30`, background: `${C.red}0D`, borderRadius: 14, padding: 14, marginBottom: 8 }}>
              <div style={{ color: C.white, fontWeight: 800, marginBottom: 6 }}>{insight.titulo}</div>
              <div style={{ color: C.textDim, fontSize: 13, lineHeight: 1.65 }}>{insight.impacto}</div>
              {isPremium ? (
                <div style={{ color: C.red, fontSize: 13, lineHeight: 1.65, marginTop: 8 }}>{insight.direcao}</div>
              ) : (
                <div
                  onClick={() => setShowGate(true)}
                  style={{ marginTop: 8, padding: "8px 12px", background: `${C.accent}08`, border: `1px solid ${C.accentBorder}`, borderRadius: 10, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ fontSize: 12, color: C.textDim }}>Ver o que fazer para resolver</span>
                  <span style={{ fontSize: 11, color: C.accent, fontFamily: MN }}>Premium →</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Atenções — só premium */}
      {isPremium && relatorio.atencoes.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, fontFamily: MN, color: C.yellow, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Atenção</div>
          {relatorio.atencoes.map((insight, idx) => (
            <div key={idx} style={{ border: `1px solid ${C.yellow}30`, background: `${C.yellow}0D`, borderRadius: 14, padding: 14, marginBottom: 8 }}>
              <div style={{ color: C.white, fontWeight: 800, marginBottom: 6 }}>{insight.titulo}</div>
              <div style={{ color: C.textDim, fontSize: 13, lineHeight: 1.65 }}>{insight.impacto}</div>
              <div style={{ color: C.yellow, fontSize: 13, lineHeight: 1.65, marginTop: 8 }}>{insight.direcao}</div>
            </div>
          ))}
        </div>
      )}

      {/* Dicas e positivos — só premium */}
      {isPremium && (relatorio.dicas.length > 0 || relatorio.positivos.length > 0) && (
        <div style={{ marginTop: 14 }}>
          {[...relatorio.dicas, ...relatorio.positivos].map((insight, idx) => (
            <div key={idx} style={{ border: `1px solid ${statusColor(insight.tipo)}30`, background: `${statusColor(insight.tipo)}0D`, borderRadius: 14, padding: 14, marginBottom: 8 }}>
              <div style={{ color: C.white, fontWeight: 800, marginBottom: 6 }}>{insight.titulo}</div>
              <div style={{ color: C.textDim, fontSize: 13, lineHeight: 1.65 }}>{insight.impacto}</div>
              <div style={{ color: statusColor(insight.tipo), fontSize: 13, lineHeight: 1.65, marginTop: 8 }}>{insight.direcao}</div>
            </div>
          ))}
        </div>
      )}

      {/* Direção principal — só premium */}
      {isPremium && (
        <div style={{ marginTop: 14, padding: "14px 16px", background: `${C.accent}08`, border: `1px solid ${C.accentBorder}`, borderRadius: 14 }}>
          <div style={{ fontSize: 10, fontFamily: MN, color: C.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Próximo passo</div>
          <p style={{ fontSize: 13, color: C.white, lineHeight: 1.65, margin: 0 }}>{relatorio.direcao}</p>
        </div>
      )}

      {/* Oportunidades — só premium */}
      {isPremium && relatorio.oportunidades.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, fontFamily: MN, color: C.blue, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Oportunidades identificadas</div>
          {relatorio.oportunidades.map((op, idx) => (
            <div key={idx} style={{ padding: "10px 14px", background: C.cardAlt, border: `1px solid ${C.border}`, borderLeft: `2px solid ${C.blue}`, borderRadius: 12, marginBottom: 8, fontSize: 13, color: C.textDim, lineHeight: 1.6 }}>
              {op}
            </div>
          ))}
        </div>
      )}

      {/* Chamariz para free */}
      {!isPremium && <BlocoUpgrade onUpgrade={() => setShowGate(true)} />}
    </Card>
  );
}

export default function SaudeFinanceiraDashboard({ data, setData, onEdit, user }) {
  const [aba, setAba] = useState("financeiro");
  const [showGate, setShowGate] = useState(false);
  const isPremium = user?.is_premium || user?.is_admin || false;

  const content = {
    financeiro: <Financeiro data={data} setData={setData} onEdit={onEdit} />,
    distribuicao: <Distribuicao data={data} />,
    extrato: <ExtratoFuturoWrapper data={data} isPremium={isPremium} onUpgrade={() => setShowGate(true)} />,
    dividas: <Dividas data={data} isPremium={isPremium} onUpgrade={() => setShowGate(true)} />,
    independencia: <Independencia data={data} isPremium={isPremium} onUpgrade={() => setShowGate(true)} />,
    relatorio: <Relatorio data={data} isPremium={isPremium} onUpgrade={() => setShowGate(true)} />,
  }[aba];

  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {showGate && <PremiumGate context="saudeFinanceira" onClose={() => setShowGate(false)} />}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {ABAS.map((a) => (
          <button key={a.id} onClick={() => setAba(a.id)} style={{ border: `1px solid ${aba === a.id ? C.accentBorder : C.border}`, background: aba === a.id ? `${C.accent}14` : "transparent", color: aba === a.id ? C.accent : C.textDim, borderRadius: 999, padding: "8px 11px", cursor: "pointer", fontFamily: FN, fontSize: 12, fontWeight: 700 }}>
            {a.label}
          </button>
        ))}
      </div>
      {content}
    </div>
  );
}
