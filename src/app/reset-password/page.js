"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { C, MN, FN, inputStyle, labelStyle, btnPrimary } from "../../lib/theme";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    setErro("");
    setSucesso("");

    if (senha.length < 6) {
      setErro("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: senha,
    });

    if (error) {
      setErro("Erro ao atualizar senha: " + error.message);
      setLoading(false);
      return;
    }

    setSucesso("Senha atualizada com sucesso. Redirecionando...");
    setLoading(false);

    setTimeout(() => {
      router.push("/");
    }, 1800);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: "36px 32px",
        }}
      >
        <h1
          style={{
            fontFamily: MN,
            fontSize: 22,
            fontWeight: 800,
            color: C.white,
            margin: "0 0 8px",
            textAlign: "center",
          }}
        >
          Redefinir senha
        </h1>

        <p
          style={{
            textAlign: "center",
            color: C.textDim,
            fontSize: 13,
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          Digite sua nova senha para concluir a recuperação da conta.
        </p>

        {erro && (
          <div
            style={{
              padding: "10px 14px",
              background: `${C.red}15`,
              border: `1px solid ${C.red}30`,
              borderRadius: 10,
              color: C.red,
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            {erro}
          </div>
        )}

        {sucesso && (
          <div
            style={{
              padding: "10px 14px",
              background: `${C.accent}15`,
              border: `1px solid ${C.accent}30`,
              borderRadius: 10,
              color: C.accent,
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            {sucesso}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Nova senha</label>
          <input
            style={inputStyle}
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Confirmar nova senha</label>
          <input
            style={inputStyle}
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Repita sua nova senha"
            onKeyDown={(e) => e.key === "Enter" && handleUpdatePassword()}
          />
        </div>

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          style={{
            ...btnPrimary,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </div>
    </div>
  );
}
