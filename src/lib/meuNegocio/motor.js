/**
 * motor.js
 *
 * Orquestrador único do diagnóstico financeiro.
 * Entrada: objeto `negocio` (mesmo formato do localStorage atual) + mês alvo.
 * Saída: objeto `analise` com tudo pronto pra renderizar:
 *   {
 *     totals:      { totalR, totalD, lucro, margem, custoPct },
 *     classes:     { margem: 'saudavel'|'alerta'|'critico', custo: ... },
 *     bench:       { ...benchmark do segmento },
 *     segLabel:    string,
 *     insights:    [...regras disparadas, ordenadas por severidade],
 *     resumo:      { critico: N, alerta: N, saudavel: bool },
 *   }
 */

import { BENCHMARKS, classificar } from './benchmarks';
import { avaliar } from './regras';

function calcTotals(receitas, despesas, mes) {
  const rec  = (receitas || []).filter(r => (r.month || mes) === mes);
  const desp = (despesas || []).filter(d => (d.month || mes) === mes);

  const totalR = rec.reduce((s, r) => s + Number(r.valor || 0), 0);
  const totalD = desp.reduce((s, d) => s + Number(d.valor || 0), 0);
  const lucro  = totalR - totalD;
  const margem = totalR > 0 ? (lucro / totalR) * 100 : 0;
  const custoPct = totalR > 0 ? (totalD / totalR) * 100 : 0;

  // Agrupa por categoria
  const recCat = {};
  rec.forEach(r => { recCat[r.categoria] = (recCat[r.categoria] || 0) + Number(r.valor || 0); });
  const recPorCat = Object.entries(recCat).sort((a, b) => b[1] - a[1]);

  const despCat = {};
  desp.forEach(d => { despCat[d.categoria] = (despCat[d.categoria] || 0) + Number(d.valor || 0); });
  const despPorCat = Object.entries(despCat).sort((a, b) => b[1] - a[1]);

  return { totalR, totalD, lucro, margem, custoPct, recPorCat, despPorCat };
}

/**
 * Função principal.
 *   negocio: { segmento, receitas, despesas, ... }
 *   mes:     'YYYY-MM'
 */
export function analisar(negocio, mes) {
  if (!negocio) {
    return { vazio: true, motivo: 'Nenhum negócio selecionado.' };
  }

  const bench = BENCHMARKS[negocio.segmento] || BENCHMARKS.outro;
  const segLabel = bench.label;

  const totals = calcTotals(negocio.receitas, negocio.despesas, mes);

  if (totals.totalR === 0 && totals.totalD === 0) {
    return {
      vazio: true,
      motivo: 'Sem lançamentos no mês selecionado. Cadastre receitas e despesas para liberar o diagnóstico.',
      bench,
      segLabel,
      totals,
    };
  }

  const classes = {
    margem: classificar(totals.margem, bench.margemLiquida, true),  // maior = melhor
    custo:  classificar(totals.custoPct, bench.custoTotal, false),  // menor = melhor
  };

  const insights = avaliar(totals, bench, segLabel);

  const resumo = {
    critico:  insights.filter(i => i.severidade === 'critico').length,
    alerta:   insights.filter(i => i.severidade === 'alerta').length,
    saudavel: insights.length === 0 && totals.totalR > 0,
  };

  return { vazio: false, totals, classes, bench, segLabel, insights, resumo };
}
