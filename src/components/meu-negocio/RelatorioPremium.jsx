"use client";
import { C, MN, FN, heroStyle, moneyCompactStyle } from "../../lib/theme";
import { analisar } from "../../lib/meuNegocio/motor";

/**
 * RelatorioPremium
 *
 * Renderiza a seção "Relatório do Mês" no dashboard do MeuNegocio.
 *
 * Props:
 *   negocio        objeto do negócio ativo (mesmo do localStorage)
 *   mes            'YYYY-MM' do mês a analisar
 *   isPremium      boolean — controla nível de detalhe revelado
 *   onUpgrade      callback quando free clica em "Ver diagnóstico"
 *
 * Comportamento:
 *   FREE: vê resumo numérico (margem, lucro), severidade e ÁREA dos insights,
 *         mas SEM diagnóstico/ação/impacto detalhado. Cada insight tem CTA pra Premium.
 *   PREMIUM: vê tudo — diagnóstico, ação concreta, impacto em R$, fonte do benchmark.
 */

// ═══════════════════════════════════════════════════════
// PALETA DE SEVERIDADE — bordas finas, sem fundo berrante
// ═══════════════════════════════════════════════════════
function corSeveridade(sev) {
  switch (sev) {
    case 'critico':  return C.red;
    case 'alerta':   return C.yellow;
    case 'saudavel': return C.accent;
    default:         return C.textMuted;
  }
}
function labelSeveridade(sev) {
  switch (sev) {
    case 'critico':  return 'CRÍTICO';
    case 'alerta':   return 'ATENÇÃO';
    case 'saudavel': return 'SAUDÁVEL';
    default:         return '—';
  }
}

const fmtBRL = (v) =>
  `R$ ${Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtPct = (v) => `${Number(v || 0).toFixed(1)}%`;

// ═══════════════════════════════════════════════════════
// ÍNDICE DE SAÚDE (header sumário)
// ═══════════════════════════════════════════════════════
function IndiceSaude({ resumo, classes }) {
  let icone, label, cor;
  if (resumo.saudavel) {
    cor = C.accent; label = 'Operação saudável'; icone = '●';
  } else if (resumo.critico > 0) {
    cor = C.red; label = `${resumo.critico} ponto${resumo.critico > 1 ? 's' : ''} crítico${resumo.critico > 1 ? 's' : ''}`; icone = '●';
  } else if (resumo.alerta > 0) {
    cor = C.yellow; label = `${resumo.alerta} ponto${resumo.alerta > 1 ? 's' : ''} de atenção`; icone = '●';
  } else {
    cor = C.textMuted; label = 'Sem dados suficientes'; icone = '○';
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: cor, fontSize: 11 }}>{icone}</span>
      <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CARD DE INSIGHT (free vs premium)
// ═══════════════════════════════════════════════════════
function InsightCard({ insight, isPremium, onUpgrade }) {
  const cor = corSeveridade(insight.severidade);

  return (
    <div style={{
      padding: 14,
      borderRadius: 12,
      background: 'rgba(255,255,255,0.015)',
      border: `1px solid ${C.border}`,
      borderLeft: `2px solid ${cor}`,
      marginBottom: 10,
    }}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span style={{
            fontFamily: MN, fontSize: 9, fontWeight: 700, color: cor, letterSpacing: '1px',
            padding: '2px 6px', border: `1px solid ${cor}40`, borderRadius: 4, flexShrink: 0,
          }}>
            {labelSeveridade(insight.severidade)}
          </span>
          <span style={{
            fontSize: 13, color: C.text, fontWeight: 500,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {insight.area}
          </span>
        </div>
      </div>

      {/* corpo: free vs premium */}
      {isPremium ? (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.65 }}>
            {insight.diagnostico}
          </div>
          {insight.acao && (
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.65, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
              <span style={{ color: cor, fontFamily: MN, fontSize: 9, letterSpacing: '1px', display: 'block', marginBottom: 4 }}>
                AÇÃO RECOMENDADA
              </span>
              {insight.acao}
            </div>
          )}
          {insight.impacto && (
            <div style={{
              fontSize: 11, color: C.accent, fontFamily: MN,
              padding: '6px 10px', background: `${C.accent}10`, borderRadius: 6,
              border: `1px solid ${C.accent}25`,
            }}>
              {insight.impacto}
            </div>
          )}
          {insight.fonte && (
            <div style={{ fontSize: 9, color: C.textMuted, fontStyle: 'italic', marginTop: 2 }}>
              {insight.fonte}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: C.textDim, flex: 1, minWidth: 0 }}>
            Ponto de melhoria identificado em {insight.area}.
          </span>
          <button onClick={onUpgrade} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 11, fontFamily: MN,
            cursor: 'pointer', background: 'rgba(255,255,255,0.030)',
            color: C.accent, border: `1px solid ${C.accentBorder}`, whiteSpace: 'nowrap',
          }}>
            Ver diagnóstico
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════
export default function RelatorioPremium({ negocio, mes, isPremium, onUpgrade }) {
  const analise = analisar(negocio, mes);

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 18, padding: 20, marginBottom: 16,
    }}>
      {/* HEADER */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: 12, marginBottom: 16, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, fontFamily: MN, letterSpacing: '1px', marginBottom: 4 }}>
            RELATÓRIO DO MÊS
          </div>
          <div style={{ ...heroStyle, fontSize: 18 }}>
            Diagnóstico financeiro
          </div>
        </div>
        {!analise.vazio && <IndiceSaude resumo={analise.resumo} classes={analise.classes} />}
      </div>

      {/* CASO VAZIO */}
      {analise.vazio && (
        <div style={{
          padding: 16, borderRadius: 12,
          background: 'rgba(255,255,255,0.015)', border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.65 }}>
            {analise.motivo}
          </div>
        </div>
      )}

      {/* SUMÁRIO NUMÉRICO (sempre visível, free e premium) */}
      {!analise.vazio && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14,
        }}>
          <div style={{ padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.015)', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, letterSpacing: '1px', marginBottom: 4 }}>MARGEM</div>
            <div style={{ ...moneyCompactStyle, fontSize: "clamp(13px, 3.4vw, 16px)", color: corSeveridade(analise.classes.margem) }}>
              {fmtPct(analise.totals.margem)}
            </div>
            <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>
              ref: {analise.bench.margemLiquida.saudavel}%
            </div>
          </div>
          <div style={{ padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.015)', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, letterSpacing: '1px', marginBottom: 4 }}>LUCRO</div>
            <div style={{ ...moneyCompactStyle, fontSize: "clamp(13px, 3.4vw, 16px)", color: analise.totals.lucro >= 0 ? C.accent : C.red }}>
              {fmtBRL(analise.totals.lucro)}
            </div>
            <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>
              receita: {fmtBRL(analise.totals.totalR)}
            </div>
          </div>
          <div style={{ padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.015)', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, letterSpacing: '1px', marginBottom: 4 }}>CUSTOS</div>
            <div style={{ ...moneyCompactStyle, fontSize: "clamp(13px, 3.4vw, 16px)", color: corSeveridade(analise.classes.custo) }}>
              {fmtPct(analise.totals.custoPct)}
            </div>
            <div style={{ fontSize: 9, color: C.textMuted, marginTop: 2 }}>
              ref: até {analise.bench.custoTotal.saudavel}%
            </div>
          </div>
        </div>
      )}

      {/* CONTEXTO DO SEGMENTO (premium-only — explicação narrativa) */}
      {!analise.vazio && isPremium && analise.bench.contexto && (
        <div style={{
          padding: 12, borderRadius: 10, marginBottom: 12,
          background: 'rgba(255,255,255,0.015)', border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, letterSpacing: '1px', marginBottom: 6 }}>
            CONTEXTO DO SEGMENTO — {analise.segLabel.toUpperCase()}
          </div>
          <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.65 }}>
            {analise.bench.contexto}
          </div>
        </div>
      )}

      {/* INSIGHTS */}
      {!analise.vazio && analise.insights.length > 0 && (
        <div>
          <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, letterSpacing: '1px', marginBottom: 8 }}>
            PONTOS IDENTIFICADOS ({analise.insights.length})
          </div>
          {analise.insights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              isPremium={isPremium}
              onUpgrade={onUpgrade}
            />
          ))}
        </div>
      )}

      {/* CASO TUDO SAUDÁVEL */}
      {!analise.vazio && analise.insights.length === 0 && (
        <div style={{
          padding: 16, borderRadius: 12,
          background: `${C.accent}08`, border: `1px solid ${C.accentBorder}`,
        }}>
          <div style={{ fontSize: 12, color: C.accent, fontWeight: 500, marginBottom: 4 }}>
            Operação dentro das referências de mercado
          </div>
          <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.6 }}>
            Nenhum ponto de atenção identificado neste mês para {analise.segLabel}. Continue monitorando — disciplina sustenta resultado.
          </div>
        </div>
      )}

      {/* FONTE — sempre discreto no rodapé */}
      {!analise.vazio && (
        <div style={{
          fontSize: 9, color: C.textMuted, fontStyle: 'italic',
          marginTop: 14, paddingTop: 10, borderTop: `1px solid ${C.border}`,
        }}>
          Referências: {analise.bench.fonte}. Valores são benchmarks de mercado, não substitutos de acompanhamento contábil profissional.
        </div>
      )}
    </div>
  );
}
