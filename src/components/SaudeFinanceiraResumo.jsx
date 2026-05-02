"use client";
import { Card, TituloBloco, Dica, LinhaResumo, BotaoAcao } from "./SaudeFinanceiraUI";
import { formatarBRL } from "./SaudeFinanceiraModel";
import { gerarDiagnosticoSaude } from "./SaudeFinanceiraDiagnostico";
import { C, MN } from "../lib/theme";

function statusColor(tipo) {
  if (tipo === "critico") return C.red;
  if (tipo === "atencao") return C.yellow;
  if (tipo === "saudavel") return C.accent;
  return C.blue;
}

export default function SaudeFinanceiraResumo({ data, setData, onBack }) {
  const diagnostico = gerarDiagnosticoSaude(data);
  const r = diagnostico.base;
  const score = diagnostico.score;
  const negativo = r.saldoMes < 0;

  const concluir = () => setData((p) => ({ ...p, questionarioCompleto: true, stepAtual: "resumo" }));

  return (
    <Card>
      <TituloBloco
        etapa="Bloco 7 de 7"
        titulo="Resumo da sua saúde financeira"
        subtitulo="Esse é o primeiro raio-x. Agora o app já consegue mostrar saldo, distribuição, riscos e próximos passos."
      />

      <div
        style={{
          background: negativo
            ? "linear-gradient(135deg, rgba(226,109,109,.12), rgba(10,18,28,.96))"
            : "linear-gradient(135deg, rgba(16,185,129,.12), rgba(10,18,28,.96))",
          border: `1px solid ${negativo ? C.red + "40" : C.accentBorder}`,
          borderRadius: 18,
          padding: 18,
          marginBottom: 14,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 10, fontFamily: MN, color: C.textMuted, letterSpacing: 1.1, textTransform: "uppercase" }}>
          Saldo projetado do mês
        </div>
        <div style={{ fontSize: "clamp(28px, 7vw, 42px)", color: negativo ? C.red : C.accent, fontWeight: 750, letterSpacing: -1, marginTop: 4 }}>
          {formatarBRL(r.saldoMes)}
        </div>
        <p style={{ margin: "8px 0 0", color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>
          {negativo
            ? "Zona de arrebentação. Não é bom, mas agora está visível — e o que fica visível pode ser resolvido."
            : "O mês respira. Agora o próximo passo é proteger o caixa e direcionar o excedente com estratégia."}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 10, fontFamily: MN, color: C.textMuted, textTransform: "uppercase" }}>Score</div>
          <div style={{ fontSize: 30, fontWeight: 760, color: statusColor(score.nivel), letterSpacing: -1 }}>{score.score}</div>
          <div style={{ fontSize: 11, color: C.textDim }}>{score.label}</div>
        </div>
        <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 10, fontFamily: MN, color: C.textMuted, textTransform: "uppercase" }}>Essenciais</div>
          <div style={{ fontSize: 30, fontWeight: 760, color: r.percentuais.fixas > 60 ? C.yellow : C.accent, letterSpacing: -1 }}>
            {r.percentuais.fixas.toFixed(0)}%
          </div>
          <div style={{ fontSize: 11, color: C.textDim }}>Meta saudável: até 60%</div>
        </div>
      </div>

      <LinhaResumo label="Entradas" value={r.entradas} />
      <LinhaResumo label="Contas fixas" value={r.fixas} />
      <LinhaResumo label="Cartões" value={r.cartoes.total} />
      <LinhaResumo label="Outras contas" value={r.outrasContas.parcelaMensal} />
      <LinhaResumo label="Consignados fora da folha" value={r.consignados.foraFolha} />
      <LinhaResumo label="Agiotas / juros mensais" value={r.agiotas.jurosMensais} danger={r.agiotas.jurosMensais > 0} />
      <LinhaResumo label="Diversão calculada (10%)" value={r.diversao} />
      <LinhaResumo label="Saldo atual em bancos/espécie" value={r.saldoAtual} />
      <LinhaResumo label="Investido/guardado" value={r.investimentos} />
      <LinhaResumo label="Patrimônio líquido estimado" value={r.patrimonioLiquido} danger={r.patrimonioLiquido < 0} />

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 10, fontFamily: MN, color: C.textMuted, textTransform: "uppercase", marginBottom: 8 }}>
          Insights principais
        </div>
        {diagnostico.insights.map((insight, idx) => (
          <div key={`${insight.titulo}-${idx}`} style={{ border: `1px solid ${statusColor(insight.tipo)}28`, background: `${statusColor(insight.tipo)}0D`, borderRadius: 14, padding: 12, marginBottom: 8 }}>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>{insight.titulo}</div>
            <div style={{ color: C.textDim, fontSize: 12, lineHeight: 1.55, marginTop: 5 }}>{insight.impacto}</div>
            <div style={{ color: statusColor(insight.tipo), fontSize: 12, lineHeight: 1.55, marginTop: 7 }}>{insight.direcao}</div>
          </div>
        ))}
      </div>

      <Dica>
        Premium: relatório completo, estratégia de quitação, extrato futuro e plano de independência financeira.
      </Dica>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
        <BotaoAcao variant="secondary" onClick={onBack}>Voltar</BotaoAcao>
        <BotaoAcao onClick={concluir}>Salvar diagnóstico</BotaoAcao>
      </div>
    </Card>
  );
}
