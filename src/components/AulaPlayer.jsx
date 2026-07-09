"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { C, MN, FN } from "../lib/theme";
import { AULAS } from "./AulasHub";

const WA_LINK = "https://wa.me/5512996657178?text=Ol%C3%A1%20Guilherme%2C%20vim%20pelas%20aulas%20do%20comparainvest!";

export default function AulaPlayer({ aulaId, onBack, onAula, user }) {
  const aula = AULAS.find((a) => a.id === aulaId);
  const idx = AULAS.findIndex((a) => a.id === aulaId);
  const anterior = idx > 0 ? AULAS[idx - 1] : null;
  const proxima = idx < AULAS.length - 1 ? AULAS[idx + 1] : null;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!aula) return;
    carregarLikes();
    carregarComentarios();
  }, [aulaId]);

  async function carregarLikes() {
    const { data: todos } = await supabase.from("aula_likes").select("user_id").eq("aula_id", aulaId);
    setLikeCount(todos?.length || 0);
    if (user?.id) {
      const meu = todos?.find((l) => l.user_id === user.id);
      setLiked(!!meu);
    }
  }

  async function toggleLike() {
    if (!user?.id) return;
    if (liked) {
      await supabase.from("aula_likes").delete().eq("aula_id", aulaId).eq("user_id", user.id);
      setLiked(false);
      setLikeCount((p) => p - 1);
    } else {
      await supabase.from("aula_likes").insert({ aula_id: aulaId, user_id: user.id });
      setLiked(true);
      setLikeCount((p) => p + 1);
    }
  }

  async function carregarComentarios() {
    const { data } = await supabase
      .from("aula_comentarios")
      .select("id, texto, created_at, user_id, profiles(nome, sobrenome)")
      .eq("aula_id", aulaId)
      .order("created_at", { ascending: true });
    setComentarios(data || []);
  }

  async function enviarComentario() {
    if (!texto.trim() || !user?.id || enviando) return;
    setEnviando(true);
    await supabase.from("aula_comentarios").insert({ aula_id: aulaId, user_id: user.id, texto: texto.trim() });
    setTexto("");
    await carregarComentarios();
    setEnviando(false);
  }

  async function deletarComentario(id) {
    if (!confirm("Excluir comentário?")) return;
    await supabase.from("aula_comentarios").delete().eq("id", id).eq("user_id", user.id);
    setComentarios((prev) => prev.filter((c) => c.id !== id));
  }

  if (!aula) return null;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {/* Navegação topo */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN }}>{"← Voltar às aulas"}</button>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => anterior && onAula(anterior.id)}
            disabled={!anterior}
            style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${anterior ? C.border : C.cardAlt}`, background: "transparent", color: anterior ? C.textDim : C.cardAlt, fontSize: 11, fontFamily: MN, cursor: anterior ? "pointer" : "not-allowed" }}
          >{"← Anterior"}</button>
          <button
            onClick={() => proxima && onAula(proxima.id)}
            disabled={!proxima}
            style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${proxima ? C.accentBorder : C.cardAlt}`, background: proxima ? `${C.accent}12` : "transparent", color: proxima ? C.accent : C.cardAlt, fontSize: 11, fontFamily: MN, cursor: proxima ? "pointer" : "not-allowed" }}
          >{"Próxima →"}</button>
        </div>
      </div>

      {/* Player */}
      <div style={{ borderRadius: 16, overflow: "hidden", background: "#000", marginBottom: 20 }}>
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe
            key={aulaId}
            src={"https://www.youtube.com/embed/" + aula.youtubeId + "?autoplay=1&rel=0&modestbranding=1"}
            title={aula.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>

      {/* Info da aula */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN, marginBottom: 6 }}>{"AULA " + String(aula.numero).padStart(2, "0") + " de " + AULAS.length}</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.white, margin: "0 0 10px", lineHeight: 1.3 }}>{aula.titulo}</h2>
        <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: "0 0 16px" }}>{aula.descricao}</p>

        {/* Ações */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={toggleLike}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 10,
              border: "1px solid " + (liked ? "#e11d48" : C.border),
              background: liked ? "#e11d4815" : "transparent",
              color: liked ? "#e11d48" : C.textDim,
              fontSize: 13, cursor: user?.id ? "pointer" : "not-allowed", fontFamily: FN,
            }}
          >
            {liked ? "❤️" : "🤍"}{likeCount > 0 && <span style={{ fontFamily: MN, fontSize: 11, marginLeft: 4 }}>{likeCount}</span>}
          </button>

          
            <a href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 10,
              border: "1px solid #25D16620",
              background: "#25D16612", color: "#25D166",
              fontSize: 12, fontFamily: MN, textDecoration: "none",
            }}
          >
            {"💬 Falar com Guilherme"}
          </a>
        </div>
      </div>

      {/* Comentários */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ fontFamily: MN, fontSize: 10, color: C.textMuted, letterSpacing: "1px", marginBottom: 14 }}>
          {"COMENTÁRIOS (" + comentarios.length + ")"}
        </div>

        {user?.id ? (
          <div style={{ marginBottom: 16 }}>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Deixe sua dúvida ou comentário sobre esta aula..."
              rows={3}
              style={{
                width: "100%", padding: "10px 14px", background: C.cardAlt,
                border: `1px solid ${C.border}`, borderRadius: 10,
                color: C.text, fontSize: 13, fontFamily: FN,
                outline: "none", resize: "vertical", boxSizing: "border-box",
              }}
            />
            <button
              onClick={enviarComentario}
              disabled={!texto.trim() || enviando}
              style={{
                marginTop: 8, padding: "9px 20px", borderRadius: 8,
                background: texto.trim() ? C.accent : C.border,
                color: texto.trim() ? C.bg : C.textMuted,
                border: "none", fontSize: 12, fontWeight: 700, fontFamily: MN,
                cursor: texto.trim() ? "pointer" : "not-allowed",
              }}
            >
              {enviando ? "Enviando..." : "Comentar"}
            </button>
          </div>
        ) : (
          <div style={{ padding: "12px 14px", background: C.cardAlt, borderRadius: 10, fontSize: 12, color: C.textDim, marginBottom: 16 }}>
            {"Faça login para comentar."}
          </div>
        )}

        {comentarios.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0", color: C.textMuted, fontSize: 12 }}>
            {"Nenhum comentário ainda. Seja o primeiro!"}
          </div>
        )}

        {comentarios.map((c) => {
          const nome = c.profiles ? (c.profiles.nome + " " + (c.profiles.sobrenome || "")).trim() : "Usuário";
          const data = new Date(c.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
          const hora = new Date(c.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          const meu = c.user_id === user?.id;
          return (
            <div key={c.id} style={{ padding: "12px 0", borderTop: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: C.accent + "20", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: MN,
                  }}>
                    {nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.white }}>{nome}</div>
                    <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN }}>{data + " às " + hora}</div>
                  </div>
                </div>
                {meu && (
                  <button onClick={() => deletarComentario(c.id)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 12 }}>{"×"}</button>
                )}
              </div>
              <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: 0, paddingLeft: 36 }}>{c.texto}</p>
            </div>
          );
        })}
      </div>

      {proxima && (
        <button
          onClick={() => onAula(proxima.id)}
          style={{
            width: "100%", textAlign: "left", padding: "16px 20px",
            background: "linear-gradient(135deg, #0D3320, #0D1117)",
            border: `1px solid ${C.accentBorder}`, borderRadius: 16,
            cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 14,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, marginBottom: 4 }}>{"PRÓXIMA AULA"}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{proxima.titulo}</div>
          </div>
          <span style={{ color: C.accent, fontSize: 20 }}>{"→"}</span>
        </button>
      )}
    </div>
  );
}