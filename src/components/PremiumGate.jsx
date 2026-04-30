"use client";
import { C, FN, premiumButton, btnSecondary } from "../lib/theme";

/**
 * PremiumGate — modal único de upgrade Premium do app.
 *
 * Substitui o UpgradeModal antigo. Copy é contextual: muda título,
 * subtítulo e bullets conforme o ponto onde o usuário está.
 *
 * Props:
 *   onClose       fn obrigatória — fecha o modal
 *   context       string opcional — escolhe a copy. Default: "default"
 *                 Valores: "comparador" | "rendaFixa" | "carteira" |
 *                          "gestaoAtiva" | "meuNegocio" | "batalha" |
 *                          "diagnostico" | "default"
 *   message       string opcional — sobrescreve o subtítulo do contexto
 *
 * Comportamento: clica em "Ver planos" → vai pra /premium (página com 3 planos).
 */

const PREMIUM_PAGE_URL = "/premium";

const COPY = {
  default: {
    title: "Remova limites e use o app sem travas.",
    subtitle: "Continue com comparações ilimitadas, mais ativos por análise e acesso completo às próximas ferramentas.",
    bullets: [
      "Comparações ilimitadas",
      "Mais ativos por análise",
      "Carteira simulada sem travas",
      "Novas features incluídas",
    ],
  },
  comparador: {
    title: "Compare quantos ativos quiser.",
    subtitle: "Hoje você analisou 2. Plataformas sérias mostram dezenas. Decida com base no mercado todo, não com base num punhado.",
    bullets: [
      "Comparações ilimitadas",
      "Mais ativos lado a lado",
      "Histórico das suas análises",
      "Filtros avançados por indicadores",
    ],
  },
  rendaFixa: {
    title: "Toda renda fixa, lado a lado.",
    subtitle: "CDB, LCI, LCA, Tesouro, debêntures — compare tudo sem limite. Quem encontra o melhor título paga menos taxa e ganha mais por ano.",
    bullets: [
      "Comparações ilimitadas de RF",
      "Cenários macro detalhados",
      "Sinais de mercado em tempo real",
      "Simulador de rentabilidade líquida",
    ],
  },
  carteira: {
    title: "Sua carteira, sem teto.",
    subtitle: "Free permite só 3 ativos na simulação. Investidor de verdade tem 8, 10, 15 posições. Use a carteira fictícia como ela foi feita pra ser usada.",
    bullets: [
      "Carteira simulada sem limites",
      "Acompanhe rentabilidade real",
      "Compare cenários hipotéticos",
      "Histórico completo de evolução",
    ],
  },
  gestaoAtiva: {
    title: "Gestão completa do seu mês.",
    subtitle: "Free libera 4 categorias. Mas suas despesas reais são moradia, alimentação, transporte, saúde, lazer, educação, pets, assinaturas, dívidas... Controle TUDO pra ver onde o dinheiro vaza.",
    bullets: [
      "Categorias ilimitadas",
      "Diagnóstico mensal completo",
      "Comparação com benchmarks",
      "Relatório de saúde financeira",
    ],
  },
  meuNegocio: {
    title: "Diagnóstico cruzado dos seus negócios.",
    subtitle: "Premium analisa todos os seus negócios juntos, identifica padrões entre eles e mostra qual está puxando ou drenando seu resultado total.",
    bullets: [
      "Diagnóstico cruzado entre negócios",
      "Relatório completo por segmento",
      "Comparação com benchmarks reais",
      "Recomendações priorizadas",
    ],
  },
  batalha: {
    title: "Batalhe sem limites.",
    subtitle: "Free libera 3 batalhas a cada 15 dias. Quando você tá decidindo pra onde vai a próxima parcela do salário, 3 não é o suficiente.",
    bullets: [
      "Batalhas ilimitadas",
      "Mais ativos por batalha",
      "Histórico das batalhas anteriores",
      "Compartilhamento dos resultados",
    ],
  },
  diagnostico: {
    title: "Veja exatamente onde melhorar.",
    subtitle: "O diagnóstico completo mostra o problema, a causa provável, a ação recomendada e o impacto estimado em reais. É a diferença entre saber que tem algo errado e saber o que fazer.",
    bullets: [
      "Diagnóstico financeiro completo",
      "Ações recomendadas por categoria",
      "Estimativa de economia em R$",
      "Comparação com seu segmento",
    ],
  },
};

export default function PremiumGate({ onClose, context = "default", message }) {
  const copy = COPY[context] || COPY.default;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(3,7,12,0.78)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 430,
          background: "linear-gradient(180deg, rgba(13,24,36,0.98), rgba(8,15,24,0.98))",
          border: `1px solid ${C.borderLight}`,
          borderRadius: 22,
          padding: "34px 28px 26px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at top, rgba(0,212,126,0.13), transparent 42%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative" }}>
          <div style={{
            fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase",
            color: C.accent, fontWeight: 700, marginBottom: 10,
          }}>
            Acesso Premium
          </div>

          <h3 style={{
            fontFamily: FN, fontSize: 22, lineHeight: 1.2,
            fontWeight: 600, letterSpacing: "-0.3px",
            color: C.white, margin: "0 0 12px",
          }}>
            {copy.title}
          </h3>

          <p style={{
            fontSize: 13, color: C.textDim, lineHeight: 1.7,
            margin: "0 0 22px",
          }}>
            {message || copy.subtitle}
          </p>

          <div style={{
            background: "rgba(255,255,255,0.025)",
            borderRadius: 14,
            padding: "14px 16px",
            border: `1px solid ${C.border}`,
            marginBottom: 20,
            textAlign: "left",
          }}>
            {copy.bullets.map((item) => (
              <div key={item} style={{
                fontSize: 13, color: C.text, padding: "5px 0",
                display: "flex", gap: 10, alignItems: "center",
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: 999,
                  background: C.accent, flexShrink: 0,
                }} />
                {item}
              </div>
            ))}
          </div>

          <a href={PREMIUM_PAGE_URL} style={{ textDecoration: "none", display: "block" }}>
            <button style={{ ...premiumButton, width: "100%", marginBottom: 10 }}>
              Ver planos
            </button>
          </a>

          <button onClick={onClose} style={{ ...btnSecondary, width: "100%" }}>
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
