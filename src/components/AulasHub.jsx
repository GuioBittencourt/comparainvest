"use client";
import { C, MN, FN, TN } from "../lib/theme";

export const AULAS = [
  {
    id: "intro-ef",
    numero: 1,
    titulo: "Introdução à Educação Financeira",
    descricao: "Entenda o que é educação financeira, por que ela importa e como ela pode transformar sua relação com o dinheiro a partir de hoje.",
    youtubeId: "sJvEYECwznE",
    duracao: "21:49",
  },
  {
    id: "relacao-dinheiro",
    numero: 2,
    titulo: "Minha Relação com o Dinheiro",
    descricao: "Descubra como suas crenças e comportamentos moldam suas decisões financeiras — e como mudar esse padrão.",
    youtubeId: "Pe11Xu3J4GM",
    duracao: "13:29",
  },
  {
    id: "tipos-conta",
    numero: 3,
    titulo: "Tipos e Níveis de Conta",
    descricao: "Contas corrente, poupança, investimento — entenda as diferenças e qual usar em cada momento da sua vida financeira.",
    youtubeId: "6QtSQAtwy2Q",
    duracao: "4:29",
  },
  {
    id: "orcamento",
    numero: 4,
    titulo: "Entendendo Meu Orçamento",
    descricao: "Aprenda a montar um orçamento real, identificar para onde vai seu dinheiro e criar um plano que funciona na prática.",
    youtubeId: "Bd1BszMvnnI",
    duracao: "2:46",
  },
  {
    id: "intro-invest",
    numero: 5,
    titulo: "Introdução a Investimentos",
    descricao: "Primeiros passos no mundo dos investimentos: renda fixa, renda variável, risco e como começar com o que você tem.",
    youtubeId: "l4VeEssrxZM",
    duracao: "6:18",
  },
];

export default function AulasHub({ onAula, onBack }) {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 20 }}>← Voltar</button>

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: FN, fontSize: 26, fontWeight: 700, color: C.white, margin: "0 0 6px", letterSpacing: "-0.03em" }}>Aulas</h2>
        <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, margin: 0 }}>Curso de Educação Financeira e Investimentos — por Guilherme Bittencourt</p>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {AULAS.map((aula) => (
          <button
            key={aula.id}
            onClick={() => onAula(aula.id)}
            style={{
              width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            <div
              style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
                overflow: "hidden", display: "flex", gap: 0,
                transition: "border-color 0.18s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = C.accentBorder}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = C.border}
            >
              {/* Thumbnail */}
              <div style={{ position: "relative", width: 120, flexShrink: 0 }}>
                <img
                  src={`https://img.youtube.com/vi/${aula.youtubeId}/mqdefault.jpg`}
                  alt={aula.titulo}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* Overlay play */}
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", background: C.accent,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: C.bg, fontSize: 12, marginLeft: 2 }}>▶</span>
                  </div>
                </div>
                {/* Duração */}
                <div style={{
                  position: "absolute", bottom: 6, right: 6,
                  background: "rgba(0,0,0,0.75)", borderRadius: 4,
                  padding: "2px 5px", fontSize: 9, fontFamily: MN, color: C.white,
                }}>
                  {aula.duracao}
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
                <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN }}>AULA {String(aula.numero).padStart(2, "0")}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white, lineHeight: 1.4 }}>{aula.titulo}</div>
                <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>{aula.descricao.substring(0, 60)}...</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", paddingRight: 14, color: C.textMuted, fontSize: 16 }}>›</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}