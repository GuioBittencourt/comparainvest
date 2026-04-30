"use client";
import { useState, useEffect } from "react";
import { C, FN, MN, premiumButton, btnSecondary, heroStyle } from "../lib/theme";
import { LogoSymbol } from "../components/Icons";
import { supabase } from "../lib/supabase";

/**
 * /premium — página de seleção de plano Premium.
 *
 * Mostra 3 planos (Mensal, Trimestral, Anual com destaque "Melhor valor").
 * Usuário seleciona um → botão "Continuar" leva direto pro Stripe checkout
 * correspondente, passando email do usuário como client_reference_id pra
 * o backend conseguir associar o pagamento ao perfil.
 *
 * IMPORTANTE: Os links Stripe abaixo são placeholders. Quando o Guilherme
 * gerar os novos com os preços corretos, basta atualizar STRIPE_LINKS.
 */

const STRIPE_LINKS = {
  mensal:     "https://buy.stripe.com/cNi28rfaP0QXgnedpZ0Fi04",
  trimestral: "https://buy.stripe.com/28EeVd0fV57d3As1Hh0Fi05",
  anual:      "https://buy.stripe.com/dRm6oH4wbdDJfja3Pp0Fi06",
};

const PLANOS = [
  {
    id: "mensal",
    nome: "Mensal",
    descricao: "Sem compromisso",
    precoMes: "29,90",
    precoTotalLabel: null,
    economia: null,
    destaque: false,
  },
  {
    id: "trimestral",
    nome: "Trimestral",
    descricao: "Mais flexível",
    precoMes: "19,90",
    precoTotalLabel: "R$ 59,70 cobrados a cada 3 meses",
    economia: "Economize 33% vs mensal",
    destaque: false,
  },
  {
    id: "anual",
    nome: "Anual",
    descricao: "Maior economia",
    precoMes: "9,90",
    precoTotalLabel: "R$ 118,80 cobrados anualmente",
    economia: "Economize 67% vs mensal",
    destaque: true, // MELHOR VALOR
  },
];

export default function PremiumPage() {
  const [selecionado, setSelecionado] = useState("anual"); // default: anual destacado
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Tenta pegar email do usuário logado pra passar pro Stripe
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) setUserEmail(session.user.email);
      } catch {
        // Sem sessão é OK — Stripe ainda funciona, só não associa automático
      }
    })();
  }, []);

  // Adiciona client_reference_id ao link Stripe pra match no webhook
  function buildStripeLink(planoId) {
    const base = STRIPE_LINKS[planoId];
    if (!base) return "/";
    if (!userEmail) return base;
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}prefilled_email=${encodeURIComponent(userEmail)}&client_reference_id=${encodeURIComponent(userEmail)}`;
  }

  const planoAtual = PLANOS.find((p) => p.id === selecionado) || PLANOS[2];

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top right, rgba(0,212,126,0.075), transparent 34%), #071018",
      color: C.text,
      fontFamily: FN,
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        {/* Header com logo */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <span style={{ color: C.accent, display: "inline-flex" }}>
            <LogoSymbol size={28} />
          </span>
          <span style={{ fontFamily: FN, fontWeight: 600, fontSize: 16, color: C.white, letterSpacing: "-0.2px" }}>
            compara<span style={{ color: C.accent }}>invest</span>
          </span>
        </div>

        {/* Título */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: C.accent, fontWeight: 600, marginBottom: 10 }}>
            Escolha seu plano
          </div>
          <h1 style={{ ...heroStyle, fontSize: 26, marginBottom: 10 }}>
            3 caminhos. Mesma liberdade.
          </h1>
          <p style={{ fontSize: 14, color: C.textDim, lineHeight: 1.65, margin: 0 }}>
            Acesso completo ao app, sem limites de comparações, ativos ou batalhas. Cancele quando quiser.
          </p>
        </div>

        {/* Cards de planos */}
        <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
          {PLANOS.map((p) => {
            const ativo = selecionado === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelecionado(p.id)}
                style={{
                  textAlign: "left",
                  background: p.destaque
                    ? "linear-gradient(180deg, rgba(16,185,129,0.10), rgba(16,185,129,0.04))"
                    : ativo ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.02)",
                  border: ativo
                    ? `2px solid ${C.accent}`
                    : p.destaque
                      ? `1px solid ${C.accent}45`
                      : `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.15s ease",
                  fontFamily: FN,
                }}
              >
                {p.destaque && (
                  <div style={{
                    position: "absolute", top: -8, right: 14,
                    background: C.accent, color: "#06110C",
                    fontSize: 9, padding: "3px 8px", borderRadius: 4,
                    fontWeight: 700, letterSpacing: "0.5px",
                    fontFamily: MN,
                  }}>
                    MELHOR VALOR
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 600,
                      color: p.destaque ? C.white : C.text,
                      marginBottom: 3,
                    }}>
                      {p.nome}
                    </div>
                    <div style={{ fontSize: 11, color: p.economia ? C.accent : C.textDim, lineHeight: 1.4 }}>
                      {p.economia || p.descricao}
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{
                      fontFamily: MN, fontSize: 16, fontWeight: 700,
                      color: p.destaque || ativo ? C.accent : C.text,
                      lineHeight: 1.1,
                    }}>
                      R$ {p.precoMes}
                      <span style={{ fontSize: 9, color: C.textMuted, marginLeft: 2 }}>/mês</span>
                    </div>
                    {p.precoTotalLabel && (
                      <div style={{ fontSize: 9, color: C.textMuted, marginTop: 3 }}>
                        {p.precoTotalLabel}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Botão principal — vira link conforme seleção */}
        <a
          href={buildStripeLink(planoAtual.id)}
          style={{ textDecoration: "none", display: "block", marginBottom: 10 }}
        >
          <button style={{ ...premiumButton, width: "100%", padding: "13px 16px", minHeight: 48, fontSize: 15 }}>
            Continuar com {planoAtual.nome} →
          </button>
        </a>

        <a href="/" style={{ textDecoration: "none", display: "block" }}>
          <button style={{ ...btnSecondary, width: "100%" }}>
            Voltar
          </button>
        </a>

        {/* Confiança */}
        <div style={{
          marginTop: 24, padding: "16px 14px",
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 11, color: C.textDim, lineHeight: 1.7,
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            <div>
              <span style={{ color: C.accent, fontWeight: 600 }}>●</span> Pagamento seguro via Stripe
            </div>
            <div>
              <span style={{ color: C.accent, fontWeight: 600 }}>●</span> Cancele quando quiser, sem multa
            </div>
            <div>
              <span style={{ color: C.accent, fontWeight: 600 }}>●</span> Acesso liberado automaticamente após pagamento
            </div>
          </div>
        </div>

        {/* Disclaimer pequeno */}
        <div style={{
          fontSize: 10, color: C.textMuted, textAlign: "center",
          marginTop: 18, lineHeight: 1.6, fontStyle: "italic",
        }}>
          Os preços são por mês equivalente. Cobranças trimestrais e anuais são feitas em uma única parcela do período. Renovação automática.
        </div>

      </div>
    </div>
  );
}
