"use client";
import { useRef, useCallback } from "react";
import { C, MN, FN } from "../lib/theme";

// 🚀 CAPTURA OTIMIZADA
function cardToCanvas(cardRef) {
  return new Promise(async (resolve) => {
    try {
      if (!cardRef) return resolve(null);

      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(cardRef, {
        backgroundColor: "#06090F",
        scale: 3, // 🔥 MAIS QUALIDADE
        useCORS: true,
        logging: false,
      });

      canvas.toBlob((blob) => resolve(blob), "image/png");
    } catch (e) {
      console.log("html2canvas failed:", e);
      resolve(null);
    }
  });
}

// 🚀 SHARE INTELIGENTE
async function shareImage(blob, text) {
  const urlBase = "https://comparainvest.vercel.app";

  if (!blob) {
    if (navigator.share) {
      await navigator.share({ text, url: urlBase });
    } else {
      await navigator.clipboard?.writeText(text + "\n\n" + urlBase);
      alert("Link copiado!");
    }
    return;
  }

  const file = new File([blob], "minha-filosofia-investidor.png", {
    type: "image/png",
  });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      text,
      files: [file],
      url: urlBase,
    });
  } else if (navigator.share) {
    await navigator.share({ text, url: urlBase });
  } else {
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "minha-filosofia-investidor.png";
    a.click();

    // 🔥 copia junto (crescimento invisível)
    await navigator.clipboard?.writeText(text + "\n" + urlBase);

    URL.revokeObjectURL(url);
  }
}

// ═══════════════════════════════════════
// PHILOSOPHY SHARE CARD
// ═══════════════════════════════════════
export function PhilosophyShareCard({
  philosophy,
  score,
  allocation,
  onClose,
}) {
  const cardRef = useRef(null);
  const p = philosophy;

  const handleShare = useCallback(async () => {
    const blob = await cardToCanvas(cardRef.current);

    // 🔥 TEXTO QUE CONVERTE
    const text = `Descobri minha filosofia de investidor e o resultado me surpreendeu 👀

Sou ${p.name} (Score ${score}/100)

Descubra a sua também 👇`;

    await shareImage(blob, text);
  }, [p, score]);

  const allocData = [
    { label: "Renda Fixa", pct: allocation?.rf || 0, color: C.blue },
    { label: "FIIs", pct: allocation?.fii || 0, color: C.accent },
    { label: "Ações", pct: allocation?.acoes || 0, color: C.orange },
    ...(allocation?.cripto > 0
      ? [{ label: "Cripto", pct: allocation.cripto, color: C.purple }]
      : []),
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 360 }}
      >
        {/* CARD */}
        <div
          ref={cardRef}
          style={{
            background: "#06090F",
            borderRadius: 20,
            overflow: "hidden",
            border: `1px solid ${p.color}40`,
          }}
        >
          <div
            style={{
              height: 4,
              background: `linear-gradient(90deg, ${p.color}, transparent)`,
            }}
          />

          <div style={{ padding: "28px 24px", textAlign: "center" }}>
            <div
              style={{
                fontSize: 10,
                color: C.textMuted,
                fontFamily: MN,
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              MINHA FILOSOFIA DE INVESTIDOR
            </div>

            <div style={{ fontSize: 48 }}>{p.icon}</div>

            <div
              style={{
                fontFamily: MN,
                fontSize: 26,
                fontWeight: 800,
                color: p.color,
              }}
            >
              {p.name}
            </div>

            <div
              style={{
                fontSize: 12,
                color: C.textDim,
                marginTop: 8,
                lineHeight: 1.6,
              }}
            >
              {p.desc}
            </div>

            {/* SCORE */}
            <div
              style={{
                marginTop: 14,
                padding: "6px 14px",
                borderRadius: 20,
                background: `${p.color}15`,
                display: "inline-block",
                fontFamily: MN,
                fontWeight: 700,
                color: p.color,
              }}
            >
              Score: {score}/100
            </div>

            {/* ALOCAÇÃO */}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "center",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              {allocData
                .filter((a) => a.pct > 0)
                .map((a) => (
                  <div
                    key={a.label}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      background: `${a.color}15`,
                      fontSize: 10,
                    }}
                  >
                    {a.label} {a.pct}%
                  </div>
                ))}
            </div>

            {/* 🔥 CTA QUE CONVERTE */}
            <div
              style={{
                marginTop: 18,
                fontSize: 11,
                color: C.textMuted,
              }}
            >
              Descubra o seu perfil gratuitamente
            </div>

            <div
              style={{
                marginTop: 4,
                fontSize: 12,
                fontWeight: 700,
                color: C.white,
              }}
            >
              comparainvest.vercel.app
            </div>
          </div>
        </div>

        {/* BOTÕES */}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            onClick={handleShare}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 12,
              fontWeight: 700,
              background: C.accent,
              color: C.bg,
              border: "none",
              cursor: "pointer",
            }}
          >
            Compartilhar
          </button>

          <button
            onClick={onClose}
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              background: C.cardAlt,
              border: `1px solid ${C.border}`,
              cursor: "pointer",
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
