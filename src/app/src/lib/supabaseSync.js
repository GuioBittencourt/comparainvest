// src/lib/supabaseSync.js
// Helper híbrido: localStorage como cache + Supabase como storage persistente
// Estratégia: salva local imediatamente, sincroniza Supabase em background

import { supabase } from "./supabase";

// ─── SAÚDE FINANCEIRA ─────────────────────────────────────────────────────────

export async function syncSaudeFinanceira(userId, dados) {
  if (!userId) return;
  try {
    await supabase.from("saude_financeira").upsert(
      { user_id: userId, dados, atualizado_em: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  } catch {}
}

export async function carregarSaudeFinanceiraRemoto(userId) {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from("saude_financeira")
      .select("dados")
      .eq("user_id", userId)
      .single();
    if (error || !data) return null;
    return data.dados;
  } catch {
    return null;
  }
}

export async function syncSnapshotSaude(userId, snapshot) {
  if (!userId) return;
  try {
    // Mantém máximo de 24 snapshots: remove os mais antigos
    const { data: existentes } = await supabase
      .from("saude_financeira_historico")
      .select("id, criado_em")
      .eq("user_id", userId)
      .order("criado_em", { ascending: false });

    if (existentes && existentes.length >= 24) {
      const idsRemover = existentes.slice(23).map((e) => e.id);
      await supabase.from("saude_financeira_historico").delete().in("id", idsRemover);
    }

    await supabase.from("saude_financeira_historico").insert({
      user_id: userId,
      dados: snapshot,
      criado_em: new Date().toISOString(),
    });
  } catch {}
}

export async function carregarHistoricoRemoto(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from("saude_financeira_historico")
      .select("dados, criado_em")
      .eq("user_id", userId)
      .order("criado_em", { ascending: false })
      .limit(24);
    if (error || !data) return [];
    return data.map((r) => r.dados);
  } catch {
    return [];
  }
}

// ─── GESTÃO ATIVA ─────────────────────────────────────────────────────────────

export async function syncGestaoAtiva(userId, mes, dados) {
  if (!userId) return;
  try {
    await supabase.from("gestao_ativa").upsert(
      { user_id: userId, mes, dados, atualizado_em: new Date().toISOString() },
      { onConflict: "user_id,mes" }
    );
  } catch {}
}

export async function carregarGestaoAtivaRemoto(userId, mes) {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from("gestao_ativa")
      .select("dados")
      .eq("user_id", userId)
      .eq("mes", mes)
      .single();
    if (error || !data) return null;
    return data.dados;
  } catch {
    return null;
  }
}

// ─── MEU NEGÓCIO ──────────────────────────────────────────────────────────────

export async function syncNegocios(userId, lista) {
  if (!userId) return;
  try {
    await supabase.from("negocios").upsert(
      { user_id: userId, dados: lista, atualizado_em: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  } catch {}
}

export async function carregarNegociosRemoto(userId) {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from("negocios")
      .select("dados")
      .eq("user_id", userId)
      .single();
    if (error || !data) return null;
    return data.dados;
  } catch {
    return null;
  }
}

// ─── CARTEIRA FICTÍCIA ────────────────────────────────────────────────────────

export async function syncCarteira(userId, assets) {
  if (!userId) return;
  try {
    await supabase.from("carteira_ficticia").upsert(
      { user_id: userId, assets, atualizado_em: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  } catch {}
}

export async function carregarCarteiraRemoto(userId) {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from("carteira_ficticia")
      .select("assets")
      .eq("user_id", userId)
      .single();
    if (error || !data) return null;
    return data.assets;
  } catch {
    return null;
  }
}

// ─── ADMIN — carregar dados de qualquer usuário ───────────────────────────────
// Usa o client normal (RLS) — o admin tem is_admin=true e acessa via policies
// Para acesso total sem RLS, usar supabase service role no servidor

export async function adminCarregarSaudeFinanceira(userId) {
  try {
    const { data, error } = await supabase
      .from("saude_financeira")
      .select("dados, atualizado_em")
      .eq("user_id", userId)
      .single();
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function adminListarUsuariosComDados() {
  try {
    const { data, error } = await supabase
      .from("saude_financeira")
      .select("user_id, atualizado_em")
      .order("atualizado_em", { ascending: false });
    if (error) return [];
    return data;
  } catch {
    return [];
  }
}
