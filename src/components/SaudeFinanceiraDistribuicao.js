import { calcularSaudeFinanceira, DISTRIBUICAO_SAUDE, LABELS_DISTRIBUICAO_SAUDE } from "./SaudeFinanceiraEngine";

const statusFaixa = (diffPct) => {
  if (diffPct <= 0) return { status: "saudavel", label: "Dentro do saudável" };
  if (diffPct <= 10) return { status: "atencao", label: "Atenção" };
  return { status: "critico", label: "Crítico" };
};

export function calcularDistribuicaoSaude(data) {
  const s = calcularSaudeFinanceira(data);
  const entradas = s.entradas;

  const real = {
    essencial: s.fixas,
    independencia: 0,
    curtoPrazo: 0,
    educacao: 0,
    diversao: s.diversao,
  };

  const linhas = Object.entries(DISTRIBUICAO_SAUDE).map(([key, percentual]) => {
    const ideal = entradas * percentual;
    const atual = real[key] || 0;
    const diferenca = atual - ideal;
    const diffPct = entradas > 0 ? (diferenca / entradas) * 100 : 0;
    const status = key === "essencial" ? statusFaixa(diffPct) : { status: atual >= ideal ? "saudavel" : "atencao", label: atual >= ideal ? "No caminho" : "Abaixo do ideal" };

    return {
      key,
      label: LABELS_DISTRIBUICAO_SAUDE[key],
      percentual,
      ideal,
      atual,
      diferenca,
      diffPct,
      ...status,
    };
  });

  return {
    entradas,
    linhas,
    essencial: linhas.find((l) => l.key === "essencial"),
    diversao: linhas.find((l) => l.key === "diversao"),
  };
}
