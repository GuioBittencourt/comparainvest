"use client";
import { useEffect, useState, useRef } from "react";
import { C, FN, MN, premiumButton, btnSecondary, heroStyle } from "../../../lib/theme";
import { LogoSymbol } from "../../../components/Icons";
import { supabase } from "../../../lib/supabase";
import { nomePlano } from "../../../lib/stripe";

/**
 * /premium/sucesso — página de retorno do checkout Stripe.
 *
 * COM WEBHOOK: faz polling no Supabase a cada 3s (até 60s) verificando
 * se o webhook já liberou Premium pro usuário logado.
 *
 * Estados visuais:
 *   processando → "Aguardando confirmação do pagamento..."
 *   liberado    → "Premium ativo! Vamos lá"
 *   timeout     → "Demorou mais que o esperado, contate suporte"
 *   sem_login   → "Faça login pra ver seu status"
 */

const POLL_INTERVAL = 3000;        // 3 segundos
const MAX_TENTATIVAS = 20;         // 20 × 3s = 60 segundos

export default function SucessoPage() {
  const [status, setStatus] = useState("processando");
  const [perfil, setPerfil] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const tentativasRef = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    if (sid) setSessionId(sid);

    let intervalo;
    let cancelado = false;

    async function checar() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.email) {
          if (!cancelado) setStatus("sem_login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("email, is_premium, premium_plano, premium_expira")
          .eq("id", session.user.id)
          .maybeSingle();

        if (cancelado) return;

        if (profile?.is_premium) {
          setPerfil(profile);
          setStatus("liberado");
          if (intervalo) clearInterval(intervalo);
          return;
        }

        tentativasRef.current += 1;
        if (tentativasRef.current >= MAX_TENTATIVAS) {
          setStatus("timeout");
          if (intervalo) clearInterval(intervalo);
        }
      } catch (e) {
        console.error("[sucesso] erro ao checar status:", e);
      }
    }

    checar();
    intervalo = setInterval(checar, POLL_INTERVAL);

    return () => {
      cancelado = true;
      if (intervalo) clearInterval(intervalo);
    };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top right, rgba(0,212,126,0.075), transparent 34%), #071018",
      color: C.text,
      fontFamily: FN,
      padding: "40px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        maxWidth: 460,
        width: "100%",
        background: "linear-gradient(180deg, rgba(13,24,36,0.98), rgba(8,15,24,0.98))",
        border: `1px solid ${C.borderLight}`,
        borderRadius: 22,
        padding: "40px 28px 30px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: status === "liberado"
            ? "radial-gradient(circle at top, rgba(0,212,126,0.18), transparent 50%)"
            : "radial-gradient(circle at top, rgba(0,212,126,0.08), transparent 50%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <span style={{ color: C.accent, display: "inline-flex" }}>
              <LogoSymbol size={28} />
            </span>
            <span style={{ fontFamily: FN, fontWeight: 600, fontSize: 16, color: C.white, letterSpacing: "-0.2px" }}>
              compara<span style={{ color: C.accent }}>invest</span>
            </span>
          </div>

          {status === "processando" && (
            <>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                border: `3px solid ${C.border}`,
                borderTopColor: C.accent,
                margin: "0 auto 20px",
                animation: "spin 1s linear infinite",
              }} />
              <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: C.accent, fontWeight: 600, marginBottom: 10 }}>
                Processando
              </div>
              <h1 style={{ ...heroStyle, fontSize: 22, marginBottom: 12 }}>
                Confirmando seu pagamento
              </h1>
              <p style={{ fontSize: 14, color: C.textDim, lineHeight: 1.7, margin: "0 0 26px" }}>
                Estamos validando com o Stripe. Geralmente leva alguns segundos. Não feche esta página.
              </p>
            </>
          )}

          {status === "liberado" && (
            <>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(16,185,129,0.10)",
                border: `2px solid ${C.accent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L19 8" stroke={C.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: C.accent, fontWeight: 600, marginBottom: 10 }}>
                Premium ativo
              </div>
              <h1 style={{ ...heroStyle, fontSize: 24, marginBottom: 12 }}>
                Seu acesso foi liberado
              </h1>
              <p style={{ fontSize: 14, color: C.textDim, lineHeight: 1.7, margin: "0 0 20px" }}>
                {perfil?.premium_plano
                  ? <><strong style={{ color: C.text }}>{nomePlano(perfil.premium_plano)}</strong> ativo. Aproveite tudo o que o app oferece.</>
                  : "Acesso completo liberado. Aproveite tudo o que o app oferece."}
              </p>
              {perfil?.premium_expira && (
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: MN, marginBottom: 20 }}>
                  Próxima renovação: {new Date(perfil.premium_expira).toLocaleDateString("pt-BR")}
                </div>
              )}
              <a href="/" style={{ textDecoration: "none", display: "block" }}>
                <button style={{ ...premiumButton, width: "100%", padding: "13px 16px", minHeight: 48 }}>
                  Começar a usar →
                </button>
              </a>
            </>
          )}

          {status === "timeout" && (
            <>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: `${C.yellow}15`,
                border: `2px solid ${C.yellow}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 26, color: C.yellow, fontWeight: 700,
                fontFamily: MN,
              }}>
                !
              </div>
              <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: C.yellow, fontWeight: 600, marginBottom: 10 }}>
                Demorando mais que o normal
              </div>
              <h1 style={{ ...heroStyle, fontSize: 22, marginBottom: 12 }}>
                Confirmação ainda não chegou
              </h1>
              <p style={{ fontSize: 14, color: C.textDim, lineHeight: 1.7, margin: "0 0 22px" }}>
                Seu pagamento foi recebido, mas a sincronização está demorando. Pode levar alguns minutos. Tente recarregar esta página em instantes ou entre em contato.
              </p>
              <button onClick={() => window.location.reload()} style={{ ...premiumButton, width: "100%", marginBottom: 10 }}>
                Verificar novamente
              </button>
              <a href="mailto:guilherme_fvb@hotmail.com?subject=Premium n%C3%A3o liberado">
                <button style={{ ...btnSecondary, width: "100%" }}>
                  Falar com suporte
                </button>
              </a>
            </>
          )}

          {status === "sem_login" && (
            <>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(16,185,129,0.10)",
                border: `2px solid ${C.accent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L19 8" stroke={C.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: C.accent, fontWeight: 600, marginBottom: 10 }}>
                Pagamento recebido
              </div>
              <h1 style={{ ...heroStyle, fontSize: 22, marginBottom: 12 }}>
                Faça login para ativar
              </h1>
              <p style={{ fontSize: 14, color: C.textDim, lineHeight: 1.7, margin: "0 0 26px" }}>
                Recebemos seu pagamento. Entre com a mesma conta usada no checkout para liberar o acesso completo.
              </p>
              <a href="/" style={{ textDecoration: "none", display: "block" }}>
                <button style={{ ...premiumButton, width: "100%", padding: "13px 16px", minHeight: 48 }}>
                  Fazer login
                </button>
              </a>
            </>
          )}

          <p style={{ fontSize: 11, color: C.textMuted, margin: "20px 0 0", lineHeight: 1.6 }}>
            Algum problema? Entre em contato pelo e-mail
            <br />
            <a href="mailto:guilherme_fvb@hotmail.com" style={{ color: C.accent, textDecoration: "none" }}>
              guilherme_fvb@hotmail.com
            </a>
          </p>

          {sessionId && (
            <div style={{
              marginTop: 20,
              padding: "8px 12px",
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              fontSize: 9,
              color: C.textMuted,
              fontFamily: MN,
              wordBreak: "break-all",
            }}>
              Ref: {sessionId}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
