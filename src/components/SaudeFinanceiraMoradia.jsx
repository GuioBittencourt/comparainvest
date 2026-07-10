"use client";
import { C, MN, FN } from "../lib/theme";
import { novoId } from "./SaudeFinanceiraModel";
import { Card, TituloBloco, Dica, CampoMoeda, CampoTexto, SelectCampo, OpcaoSimNao, BotaoAcao } from "./SaudeFinanceiraUI";

export default function SaudeFinanceiraMoradia({ data, setData, onNext, onBack }) {
  const fixas = data.contasFixas;
  const extras = fixas.contasExtras || [];

  const updateFixas = (patch) => setData((p) => ({ ...p, contasFixas: { ...p.contasFixas, ...patch } }));
  const updateMoradia = (patch) => updateFixas({ moradia: { ...fixas.moradia, ...patch } });
  const updateTransporte = (patch) => updateFixas({ transporte: { ...fixas.transporte, ...patch } });

  const addExtra = () => updateFixas({
    contasExtras: [...extras, {
      id: novoId("extra"),
      nome: "",
      valor: 0,
      descontaFolha: false,
      noCartao: false,
      cartaoId: null,
    }]
  });

  const updateExtra = (id, patch) => updateFixas({
    contasExtras: extras.map((e) => e.id === id ? { ...e, ...patch } : e)
  });

  const removeExtra = (id) => updateFixas({
    contasExtras: extras.filter((e) => e.id !== id)
  });

  return (
    <Card>
      <TituloBloco etapa="Bloco 2 de 7" titulo="Moradia e essenciais" subtitulo="Aqui entram os gastos que normalmente sustentam o mês: casa, alimentação, transporte e comunicação." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <SelectCampo label="Moradia" value={fixas.moradia.tipo} onChange={(v) => updateMoradia({ tipo: v })} options={[{ value: "aluguel", label: "Aluguel" }, { value: "financiamento", label: "Financiamento" }, { value: "quitada", label: "Casa quitada" }, { value: "pais", label: "Moro com pais/família" }, { value: "cedida", label: "Cedida" }]} />
        <CampoMoeda label="Valor da moradia" value={fixas.moradia.valor} onChange={(v) => updateMoradia({ valor: v })} />
      </div>
      {Number(fixas.moradia.valor) === 0 && <Dica tone="warn">Moradia zerada precisa ser real: casa quitada, mora com família ou cedida. Se existe boleto, ele precisa entrar.</Dica>}

      <CampoMoeda label="Condomínio" value={fixas.condominio} onChange={(v) => updateFixas({ condominio: v })} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <CampoMoeda label="Água" value={fixas.agua} onChange={(v) => updateFixas({ agua: v })} />
        <CampoMoeda label="Luz" value={fixas.luz} onChange={(v) => updateFixas({ luz: v })} />
        <CampoMoeda label="Gás" value={fixas.gas} onChange={(v) => updateFixas({ gas: v })} />
        <CampoMoeda label="Mercado" value={fixas.mercado} onChange={(v) => updateFixas({ mercado: v })} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <SelectCampo label="Transporte" value={fixas.transporte.tipo} onChange={(v) => updateTransporte({ tipo: v })} options={[{ value: "gasolina", label: "Gasolina" }, { value: "publico", label: "Transporte público" }, { value: "app", label: "App/Uber" }, { value: "misto", label: "Misto" }, { value: "zero", label: "Não gasto" }]} />
        <CampoMoeda label="Valor transporte" value={fixas.transporte.valor} onChange={(v) => updateTransporte({ valor: v })} />
      </div>
      {Number(fixas.transporte.valor) === 0 && <Dica>Transporte zerado é possível, mas confirme: home office, vai a pé, carona ou veículo da empresa.</Dica>}

      <CampoMoeda label="Uber / apps avulsos" value={fixas.uber} onChange={(v) => updateFixas({ uber: v })} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <CampoMoeda label="Celular" value={fixas.celular} onChange={(v) => updateFixas({ celular: v })} />
        <CampoMoeda label="Internet" value={fixas.internet} onChange={(v) => updateFixas({ internet: v })} />
      </div>

      {/* ── CONTAS FIXAS EXTRAS ─────────────────────────────── */}
      {extras.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 10, fontFamily: MN, color: C.textMuted, letterSpacing: "1px", marginBottom: 10 }}>OUTRAS CONTAS FIXAS</div>
          {extras.map((extra) => (
            <div key={extra.id} style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <CampoTexto label="Nome da conta" value={extra.nome} onChange={(v) => updateExtra(extra.id, { nome: v })} placeholder="Ex: Escola, IPTU..." />
                <CampoMoeda label="Valor mensal" value={extra.valor} onChange={(v) => updateExtra(extra.id, { valor: v })} />
              </div>
              <OpcaoSimNao label="Desconta em folha?" value={extra.descontaFolha} onChange={(v) => updateExtra(extra.id, { descontaFolha: v })} />
              <OpcaoSimNao label="Costuma vir no cartão?" value={extra.noCartao} onChange={(v) => updateExtra(extra.id, { noCartao: v })} />
              <button
                onClick={() => removeExtra(extra.id)}
                style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 11, fontFamily: FN, marginTop: 4 }}
              >
                Remover conta
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={addExtra}
        style={{
          width: "100%", padding: "10px", marginTop: 8, marginBottom: 16,
          borderRadius: 10, border: `1px dashed ${C.border}`,
          background: "transparent", color: C.textDim,
          fontFamily: FN, fontSize: 13, cursor: "pointer",
          transition: "border-color 0.18s, color 0.18s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accentBorder; e.currentTarget.style.color = C.accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}
      >
        + Adicionar conta fixa
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
        <BotaoAcao variant="secondary" onClick={onBack}>Voltar</BotaoAcao>
        <BotaoAcao onClick={onNext}>Continuar</BotaoAcao>
      </div>
    </Card>
  );
}