"use client";
import { useRef, useCallback } from "react";
import { C, MN } from "../lib/theme";
import { LogoSymbol } from "./Icons";

/* ═══════════════════════════════════════
   CAPTURA
═══════════════════════════════════════ */
function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function cardToCanvas(cardRef) {
  try {
    if (!cardRef) return null;

    const html2canvas = (await import("html2canvas")).default;

    await wait(150);

    const canvas = await html2canvas(cardRef, {
      backgroundColor: "#06090F",
      scale: 2,
      useCORS: true,
    });

    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/png")
    );
  } catch (e) {
    console.log("erro ao gerar imagem:", e);
    return null;
  }
}

/* ═══════════════════════════════════════
   SHARE
═══════════════════════════════════════ */
async function shareImage(blob, text) {
  if (!blob) {
    await navigator.share?.({ text });
    return;
  }

  const file = new File([blob], "comparainvest.png", {
    type: "image/png",
  });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ text, files: [file] });
  } else {
    await navigator.share?.({ text });
  }
}

/* ═══════════════════════════════════════
   FILOSOFIA
═══════════════════════════════════════ */
export function PhilosophyShareCard({ philosophy, score, onClose }) {
  const cardRef = useRef(null);
  const p = philosophy;

  const handleShare = useCallback(async () => {
    const blob = await cardToCanvas(cardRef.current);

    const text = `Minha Filosofia

Meu perfil: ${p.name} (${score}/100)

Veja o seu:
https://comparainvest.vercel.app`;

    await shareImage(blob, text);
  }, [p, score]);

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={(e) => e.stopPropagation()}>
        <div ref={cardRef} style={card}>
          <div style={title}>MINHA FILOSOFIA</div>

          <div style={{ marginTop: 12 }}>
            {p.iconSm || p.icon}
          </div>

          <div style={{ ...big, color: p.color, marginTop: 10 }}>
            {p.name}
          </div>

          <div style={{ marginTop: 10, color: p.color }}>
            Score: {score}/100
          </div>

          <div style={footer}>
            <LogoSymbol size={13} />
            <span style={brandText}>
              compara<span style={{ color: C.accent }}>invest</span>
            </span>
          </div>
        </div>

        {/* BOTÕES */}
        <div style={buttons}>
          <button style={btnPrimary} onClick={handleShare}>
            Compartilhar
          </button>
          <button style={btn} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   BATALHA
═══════════════════════════════════════ */
export function BattleShareCard({ ranked, onClose }) {
  const cardRef = useRef(null);

  const medals = ["🥇", "🥈", "🥉"];
  const top3 = ranked.slice(0, 3);
  const winner = ranked[0];

  const handleShare = useCallback(async () => {
    const blob = await cardToCanvas(cardRef.current);

    const text = `Batalha de Ativos

${winner.symbol} ficou em primeiro lugar.

Veja:
https://comparainvest.vercel.app`;

    await shareImage(blob, text);
  }, [winner]);

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={(e) => e.stopPropagation()}>
        <div ref={cardRef} style={card}>
          <div style={title}>BATALHA DE ATIVOS</div>

          <div style={winnerStyle}>
            {winner.symbol}
          </div>

          <div style={desc}>
            Melhor ativo da comparação
          </div>

          <div style={{ marginTop: 16 }}>
            {top3.map((r, i) => (
              <div key={r.symbol} style={row}>
                <span>{medals[i]} {r.symbol}</span>
                <span style={{ color: C.textDim }}>
                  {r.wins}V
                </span>
              </div>
            ))}
          </div>

          <div style={desc}>
            Nem sempre o mais popular é o melhor
          </div>

          <div style={footer}>
            <LogoSymbol size={13} />
            <span style={brandText}>
              compara<span style={{ color: C.accent }}>invest</span>
            </span>
          </div>
        </div>

        {/* BOTÕES */}
        <div style={buttons}>
          <button style={btnPrimary} onClick={handleShare}>
            Compartilhar
          </button>
          <button style={btn} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   STYLES
═══════════════════════════════════════ */
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.85)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const box = {
  width: "100%",
  maxWidth: 340,
};

const card = {
  background: "#06090F",
  padding: 20,
  borderRadius: 16,
  textAlign: "center",
};

const title = {
  fontSize: 11,
  color: C.textMuted,
  fontFamily: MN,
  letterSpacing: "1px",
};

const big = {
  fontSize: 24,
  fontWeight: 800,
};

const desc = {
  fontSize: 12,
  color: C.textDim,
  marginTop: 10,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  fontFamily: MN,
  marginBottom: 6,
};

const winnerStyle = {
  marginTop: 12,
  fontSize: 32,
  fontWeight: 900,
  color: C.accent,
  fontFamily: MN,
};

const footer = {
  marginTop: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  borderTop: `1px solid ${C.border}`,
  paddingTop: 12,
};

const brandText = {
  fontFamily: MN,
  fontSize: 10,
  color: C.textMuted,
};

const buttons = {
  display: "flex",
  gap: 8,
  marginTop: 10,
};

const btnPrimary = {
  flex: 1,
  padding: 12,
  borderRadius: 10,
  background: C.accent,
  color: C.bg,
  border: "none",
  cursor: "pointer",
};

const btn = {
  flex: 1,
  padding: 12,
  borderRadius: 10,
  background: C.cardAlt,
  border: `1px solid ${C.border}`,
  cursor: "pointer",
};
