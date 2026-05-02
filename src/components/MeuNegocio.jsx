"use client";
import { useState, useMemo, useEffect } from "react";
import { C, MN, FN, TN, heroStyle, moneyCompactStyle } from "../lib/theme";
import SponsorSlot from "./SponsorSlot";
import PremiumGate from "./PremiumGate";
import PremiumNotice from "./PremiumNotice";
import RelatorioPremium from "./meu-negocio/RelatorioPremium";
import { BannerNegocio } from "./Banners";

const STORAGE_KEY = "comparai_negocios";

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const SEGMENTOS = [
  { id: "entregas", label: "Entregas / Motorista de App", desc: "iFood, Uber, 99, Rappi, entregas em geral", receitas: ["Corridas / Entregas", "Bônus e Incentivos", "Gorjetas", "Outras Receitas"], despesas: ["Combustível", "Manutenção do Veículo", "Seguro do Veículo", "Celular / Dados Móveis", "Alimentação na Rua", "Troca de Óleo", "Pneus", "Lavagem", "Outras Despesas"] },
  { id: "alimentacao", label: "Alimentação / Salgados / Doces", desc: "Produção e venda de alimentos", receitas: ["Vendas Diretas", "Encomendas", "Eventos / Festas", "Revenda", "Outras Receitas"], despesas: ["Ingredientes / Insumos", "Embalagens", "Gás de Cozinha", "Energia Elétrica", "Água", "Aluguel do Espaço", "Equipamentos", "Transporte / Entrega", "Marketing", "Outras Despesas"] },
  { id: "beleza", label: "Beleza / Estética / Barbearia", desc: "Cabelo, unhas, estética, maquiagem", receitas: ["Atendimentos", "Vendas de Produtos", "Pacotes Mensais", "Outras Receitas"], despesas: ["Produtos Profissionais", "Materiais Descartáveis", "Aluguel / Espaço", "Energia Elétrica", "Água", "Marketing", "Equipamentos", "Outras Despesas"] },
  { id: "servicos_gerais", label: "Serviços Gerais / Manutenção", desc: "Eletricista, encanador, pintor, diarista", receitas: ["Prestação de Serviços", "Contratos Mensais", "Extras / Bicos", "Outras Receitas"], despesas: ["Ferramentas", "Materiais de Trabalho", "Transporte", "Celular / Dados", "EPI / Uniformes", "Outras Despesas"] },
  { id: "comercio", label: "Comércio / Revenda / Loja", desc: "Venda de produtos físicos, loja, bazar", receitas: ["Vendas à Vista", "Vendas a Prazo", "Vendas Online", "Outras Receitas"], despesas: ["Custo da Mercadoria", "Frete / Envio", "Embalagens", "Aluguel", "Energia Elétrica", "Funcionários", "Marketing", "Taxas de Plataforma", "Outras Despesas"] },
  { id: "digital", label: "Digital / Freelancer / Conteúdo", desc: "Designer, programador, social media, influencer", receitas: ["Projetos / Contratos", "Recorrência Mensal", "Vendas de Infoprodutos", "Publicidade / Parcerias", "Outras Receitas"], despesas: ["Ferramentas / Assinaturas", "Internet", "Equipamentos", "Marketing / Tráfego Pago", "Contador", "Outras Despesas"] },
  { id: "outro", label: "Outro Segmento", desc: "Não se encaixa nas opções acima", receitas: ["Receita Principal", "Receita Secundária", "Outras Receitas"], despesas: ["Custo Principal", "Materiais", "Transporte", "Aluguel", "Marketing", "Outras Despesas"] },
];

const FAIXAS = [
  { id: "ate2k", label: "Até R$ 2.000/mês" },
  { id: "2k_5k", label: "R$ 2.000 a R$ 5.000/mês" },
  { id: "5k_10k", label: "R$ 5.000 a R$ 10.000/mês" },
  { id: "10k_20k", label: "R$ 10.000 a R$ 20.000/mês" },
  { id: "acima20k", label: "Acima de R$ 20.000/mês" },
];

const BENCHMARKS = {
  entregas: { custoTotal: 55, margemLiquida: 30 },
  alimentacao: { custoTotal: 40, margemLiquida: 25 },
  beleza: { custoTotal: 25, margemLiquida: 35 },
  servicos_gerais: { custoTotal: 30, margemLiquida: 40 },
  comercio: { custoTotal: 50, margemLiquida: 20 },
  digital: { custoTotal: 15, margemLiquida: 50 },
  outro: { custoTotal: 40, margemLiquida: 25 },
};

const fmtBRL = (v) => `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtPct = (v) => `${Number(v || 0).toFixed(1)}%`;
const curMonth = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`; };

function loadAll() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function saveAll(list) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {} }

function calcTotals(neg) {
  const month = curMonth();
  const rec = (neg.receitas || []).filter((r) => (r.month || month) === month);
  const desp = (neg.despesas || []).filter((d) => (d.month || month) === month);
  const totalR = rec.reduce((s, r) => s + r.valor, 0);
  const totalD = desp.reduce((s, d) => s + d.valor, 0);
  return { totalR, totalD, lucro: totalR - totalD, margem: totalR > 0 ? ((totalR - totalD) / totalR) * 100 : 0, custoPct: totalR > 0 ? (totalD / totalR) * 100 : 0 };
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════ */
export default function MeuNegocio({ user }) {
  const [negocios, setNegocios] = useState([]);
  const [view, setView] = useState("list"); // list, quiz, dashboard, historico
  const [activeId, setActiveId] = useState(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizData, setQuizData] = useState({ segmento: null, faturamento: null, nome: "", meta: "" });
  const [showModal, setShowModal] = useState(null);
  const [newItem, setNewItem] = useState({ desc: "", valor: "", categoria: "" });
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [viewMonth, setViewMonth] = useState(curMonth()); // for browsing other months

  const isPremium = user?.is_premium || user?.is_admin;

  useEffect(() => { setNegocios(loadAll()); setLoaded(true); }, []);
  useEffect(() => { if (loaded) saveAll(negocios); }, [negocios, loaded]);

  const active = negocios.find((n) => n.id === activeId);
  const seg = active ? SEGMENTOS.find((s) => s.id === active.segmento) : null;
  const bench = active ? (BENCHMARKS[active.segmento] || BENCHMARKS.outro) : BENCHMARKS.outro;

  const month = curMonth();
  const displayMonth = viewMonth || month;
  const isCurrentMonth = displayMonth === month;
  const recMes = useMemo(() => (active?.receitas || []).filter((r) => (r.month || month) === displayMonth), [active, displayMonth, month]);
  const despMes = useMemo(() => (active?.despesas || []).filter((d) => (d.month || month) === displayMonth), [active, displayMonth, month]);
  const totalR = useMemo(() => recMes.reduce((s, r) => s + r.valor, 0), [recMes]);
  const totalD = useMemo(() => despMes.reduce((s, d) => s + d.valor, 0), [despMes]);
  const lucro = totalR - totalD;
  const margem = totalR > 0 ? (lucro / totalR) * 100 : 0;
  const custoPct = totalR > 0 ? (totalD / totalR) * 100 : 0;

  const despPorCat = useMemo(() => {
    const g = {};
    despMes.forEach((d) => { g[d.categoria] = (g[d.categoria] || 0) + d.valor; });
    return Object.entries(g).sort((a, b) => b[1] - a[1]);
  }, [despMes]);

  // (removido: useMemo de `alerts` antigo. O diagnóstico agora vive em
  // `lib/meuNegocio/motor` e é renderizado pelo componente RelatorioPremium.)

  // === MUTATIONS ===
  const updateActive = (fn) => setNegocios((prev) => prev.map((n) => n.id === activeId ? fn(n) : n));
  const addItem = (type) => {
    if (!newItem.desc || !newItem.valor || !newItem.categoria) return;
    const item = { id: Date.now(), desc: newItem.desc, valor: parseFloat(newItem.valor), categoria: newItem.categoria, month: displayMonth };
    updateActive((n) => ({ ...n, [type]: [...(n[type] || []), item] }));
    setNewItem({ desc: "", valor: "", categoria: "" });
    setShowModal(null);
  };
  const removeItem = (type, id) => updateActive((n) => ({ ...n, [type]: (n[type] || []).filter((x) => x.id !== id) }));
  const deleteNegocio = (id) => { setNegocios((prev) => prev.filter((n) => n.id !== id)); setView("list"); setActiveId(null); };

  const finishQuiz = () => {
    const novo = { id: Date.now(), segmento: quizData.segmento, faturamento: quizData.faturamento, nome: quizData.nome || SEGMENTOS.find((s) => s.id === quizData.segmento)?.label || "Meu Negócio", meta: parseFloat(quizData.meta) || 0, receitas: [], despesas: [], createdAt: new Date().toISOString() };
    setNegocios((prev) => [...prev, novo]);
    setActiveId(novo.id);
    setView("dashboard");
    setQuizData({ segmento: null, faturamento: null, nome: "", meta: "" });
    setQuizStep(0);
  };

  /* ═══════════════════════════════════════════════════════════════
     QUIZ
     ═══════════════════════════════════════════════════════════════ */
  if (view === "quiz") {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => { setView("list"); setQuizStep(0); }} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 12 }}>← Voltar</button>
          <h2 style={heroStyle}>Novo Negócio</h2>
          <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: 0 }}>Configure o perfil para gestão personalizada.</p>
        </div>

        {quizStep === 0 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 14 }}>Qual é o segmento?</div>
            {SEGMENTOS.map((s) => (
              <button key={s.id} onClick={() => { setQuizData((p) => ({ ...p, segmento: s.id })); setQuizStep(1); }}
                style={{ display: "block", width: "100%", padding: "16px 18px", borderRadius: 12, textAlign: "left", background: C.card, border: `1px solid ${C.border}`, cursor: "pointer", marginBottom: 8, transition: "border-color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = C.accentBorder} onMouseLeave={(e) => e.currentTarget.style.borderColor = C.border}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{s.label}</div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 3 }}>{s.desc}</div>
              </button>
            ))}
          </div>
        )}

        {quizStep === 1 && (
          <div>
            <button onClick={() => setQuizStep(0)} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 12 }}>← Voltar</button>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 14 }}>Faixa de faturamento mensal?</div>
            {FAIXAS.map((f) => (
              <button key={f.id} onClick={() => { setQuizData((p) => ({ ...p, faturamento: f.id })); setQuizStep(2); }}
                style={{ display: "block", width: "100%", padding: "14px 18px", borderRadius: 12, textAlign: "left", background: C.card, border: `1px solid ${C.border}`, cursor: "pointer", marginBottom: 8, transition: "border-color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = C.accentBorder} onMouseLeave={(e) => e.currentTarget.style.borderColor = C.border}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{f.label}</div>
              </button>
            ))}
          </div>
        )}

        {quizStep === 2 && (
          <div>
            <button onClick={() => setQuizStep(1)} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 12 }}>← Voltar</button>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 14 }}>Detalhes do negócio</div>
            <label style={{ fontSize: 11, color: C.textDim, display: "block", marginBottom: 4, fontFamily: MN }}>Nome (opcional)</label>
            <input value={quizData.nome} onChange={(e) => setQuizData((p) => ({ ...p, nome: e.target.value }))} placeholder="Ex: Salgados da Maria"
              style={{ width: "100%", padding: "12px 16px", background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: FN, outline: "none", boxSizing: "border-box", marginBottom: 14 }} />
            <label style={{ fontSize: 11, color: C.textDim, display: "block", marginBottom: 4, fontFamily: MN }}>Meta de faturamento mensal (R$)</label>
            <input type="number" value={quizData.meta} onChange={(e) => setQuizData((p) => ({ ...p, meta: e.target.value }))} placeholder="Ex: 5000"
              style={{ width: "100%", padding: "12px 16px", background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontFamily: MN, outline: "none", boxSizing: "border-box", marginBottom: 20 }} />
            <button onClick={finishQuiz} style={{ width: "100%", padding: "14px", background: "linear-gradient(180deg, #20C982, #0E9F6E)", color: "#06110C", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: FN, cursor: "pointer" }}>Criar negócio</button>
          </div>
        )}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     LIST (HOME)
     ═══════════════════════════════════════════════════════════════ */
  if (view === "list") {
    const consolidated = negocios.length >= 2 ? negocios.reduce((acc, n) => {
      const t = calcTotals(n);
      return { totalR: acc.totalR + t.totalR, totalD: acc.totalD + t.totalD, lucro: acc.lucro + t.lucro };
    }, { totalR: 0, totalD: 0, lucro: 0 }) : null;

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={heroStyle}>Meu Negócio</h2>
          <button onClick={() => setView("quiz")} style={{ padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: MN, cursor: "pointer", background: "rgba(255,255,255,0.030)", color: C.textDim, border: `1px solid ${C.border}` }}>+ Novo negócio</button>
        </div>

        <BannerNegocio />
      {!isPremium && <PremiumNotice context="meuNegocio" onClick={() => setShowUpgrade(true)} />}

        {/* Consolidated view */}
        {consolidated && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: MN, letterSpacing: "1px", marginBottom: 12 }}>VISÃO CONSOLIDADA — {negocios.length} NEGÓCIOS</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, padding: 10, background: C.cardAlt, borderRadius: 10, textAlign: "center", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, marginBottom: 3 }}>RECEITA TOTAL</div>
                <div style={{ fontFamily: MN, fontSize: 16, fontWeight: 800, color: C.accent }}>{fmtBRL(consolidated.totalR)}</div>
              </div>
              <div style={{ flex: 1, padding: 10, background: C.cardAlt, borderRadius: 10, textAlign: "center", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, marginBottom: 3 }}>DESPESA TOTAL</div>
                <div style={{ fontFamily: MN, fontSize: 16, fontWeight: 800, color: C.red }}>{fmtBRL(consolidated.totalD)}</div>
              </div>
              <div style={{ flex: 1, padding: 10, background: C.cardAlt, borderRadius: 10, textAlign: "center", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, marginBottom: 3 }}>LUCRO TOTAL</div>
                <div style={{ fontFamily: MN, fontSize: 16, fontWeight: 800, color: consolidated.lucro >= 0 ? C.accent : C.red }}>{fmtBRL(consolidated.lucro)}</div>
              </div>
            </div>

            {/* Per-business comparison */}
            {isPremium && (
              <div style={{ marginTop: 14 }}>
                {negocios.map((n) => {
                  const t = calcTotals(n);
                  const saudavel = t.margem >= (BENCHMARKS[n.segmento]?.margemLiquida || 25) - 5;
                  return (
                    <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 12, color: C.text }}>{n.nome}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: MN, fontSize: 11, color: t.lucro >= 0 ? C.accent : C.red }}>{fmtBRL(t.lucro)}</span>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: saudavel ? C.accent : C.yellow }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isPremium && negocios.length >= 2 && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`, borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: C.textDim }}>
                  Diagnóstico cruzado disponível no Premium.{" "}
                  <button onClick={() => setShowUpgrade(true)} style={{ background: "none", border: "none", color: C.accent, fontSize: 11, cursor: "pointer", fontFamily: FN, padding: 0, textDecoration: "underline" }}>Ver mais</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Business cards */}
        {negocios.map((n) => {
          const t = calcTotals(n);
          const segLabel = SEGMENTOS.find((s) => s.id === n.segmento)?.label || "Negócio";
          return (
            <button key={n.id} onClick={() => { setActiveId(n.id); setView("dashboard"); }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "18px 20px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, cursor: "pointer", marginBottom: 10, transition: "border-color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = C.accentBorder} onMouseLeave={(e) => e.currentTarget.style.borderColor = C.border}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{n.nome}</div>
                  <div style={{ fontSize: 11, color: C.textDim, fontFamily: MN, marginTop: 2 }}>{segLabel}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: MN, fontSize: 14, fontWeight: 700, color: t.lucro >= 0 ? C.accent : C.red }}>{fmtBRL(t.lucro)}</div>
                  <div style={{ fontSize: 10, color: C.textDim }}>lucro do mês</div>
                </div>
              </div>
              {n.meta > 0 && t.totalR > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: C.textDim }}>Meta: {fmtBRL(n.meta)}</span>
                    <span style={{ fontSize: 10, color: C.textDim, fontFamily: MN }}>{fmtPct((t.totalR / n.meta) * 100)}</span>
                  </div>
                  <div style={{ height: 3, background: C.cardAlt, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${Math.min((t.totalR / n.meta) * 100, 100)}%`, background: t.totalR >= n.meta ? C.accent : C.accent, borderRadius: 2, transition: "width 0.3s" }} />
                  </div>
                </div>
              )}
            </button>
          );
        })}

        {negocios.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 15, color: C.white, fontWeight: 600, marginBottom: 8 }}>Nenhum negócio cadastrado</div>
            <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.7, marginBottom: 20 }}>Adicione seu primeiro negócio para começar a controlar receitas, despesas e margem de lucro.</div>
            <button onClick={() => setView("quiz")} style={{ padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700, fontFamily: FN, cursor: "pointer", background: "linear-gradient(180deg, #20C982, #0E9F6E)", color: "#06110C", border: "none" }}>Adicionar negócio</button>
          </div>
        )}

        {showUpgrade && <PremiumGate onClose={() => setShowUpgrade(false)} context="meuNegocio" />}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     HISTÓRICO
     ═══════════════════════════════════════════════════════════════ */
  if (view === "historico" && active) {
    // Build monthly data from all receitas/despesas
    const allMonths = new Set();
    (active.receitas || []).forEach((r) => allMonths.add(r.month || month));
    (active.despesas || []).forEach((d) => allMonths.add(d.month || month));
    const sortedMonths = [...allMonths].sort();

    // Group by year
    const years = {};
    sortedMonths.forEach((m) => {
      const y = m.split("-")[0];
      if (!years[y]) years[y] = [];
      years[y].push(m);
    });

    const monthlyData = sortedMonths.map((m) => {
      const rec = (active.receitas || []).filter((r) => (r.month || month) === m).reduce((s, r) => s + r.valor, 0);
      const desp = (active.despesas || []).filter((d) => (d.month || month) === m).reduce((s, d) => s + d.valor, 0);
      return { month: m, label: new Date(parseInt(m.split("-")[0]), parseInt(m.split("-")[1]) - 1).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }), receita: rec, despesa: desp, lucro: rec - desp, margem: rec > 0 ? ((rec - desp) / rec) * 100 : 0 };
    });

    const maxVal = Math.max(...monthlyData.map((d) => Math.max(d.receita, d.despesa)), 1);

    return (
      <div>
        <button onClick={() => setView("dashboard")} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 12 }}>← Voltar ao dashboard</button>
        <h2 style={{ ...heroStyle, marginBottom: 6 }}>Histórico — {active.nome}</h2>
        <p style={{ fontSize: 12, color: C.textDim, marginBottom: 20, margin: "0 0 20px" }}>Evolução mês a mês. Dados armazenados por até 5 anos.</p>

        {monthlyData.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: C.textMuted, fontSize: 13 }}>Nenhum dado registrado ainda. Lance receitas e despesas para começar o histórico.</div>
        )}

        {/* Evolution chart - simple bar chart */}
        {monthlyData.length > 0 && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: MN, letterSpacing: "1px", marginBottom: 16 }}>EVOLUÇÃO</div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginBottom: 14, justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: C.accent }} />
                <span style={{ fontSize: 10, color: C.textDim }}>Receita</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: C.red }} />
                <span style={{ fontSize: 10, color: C.textDim }}>Despesa</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: C.accent }} />
                <span style={{ fontSize: 10, color: C.textDim }}>Lucro</span>
              </div>
            </div>

            {/* Bars */}
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 140, overflowX: "auto", paddingBottom: 4 }}>
              {monthlyData.map((d) => (
                <div key={d.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 40, flex: 1 }}>
                  <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 100 }}>
                    <div style={{ width: 8, height: Math.max(2, (d.receita / maxVal) * 100), background: C.accent, borderRadius: "2px 2px 0 0" }} />
                    <div style={{ width: 8, height: Math.max(2, (d.despesa / maxVal) * 100), background: C.red, borderRadius: "2px 2px 0 0", opacity: 0.7 }} />
                  </div>
                  <div style={{ fontSize: 8, color: C.textMuted, fontFamily: MN, marginTop: 4, textAlign: "center", lineHeight: 1.2 }}>{d.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly details table */}
        {Object.entries(years).reverse().map(([year, months]) => (
          <div key={year} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: MN, marginBottom: 8 }}>{year}</div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
              {months.reverse().map((m) => {
                const d = monthlyData.find((x) => x.month === m);
                if (!d) return null;
                const monthName = new Date(parseInt(m.split("-")[0]), parseInt(m.split("-")[1]) - 1).toLocaleDateString("pt-BR", { month: "long" });
                return (
                  <button key={m} onClick={() => { setViewMonth(m); setView("dashboard"); }}
                    style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = C.cardAlt} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <div>
                      <div style={{ fontSize: 13, color: C.white, textTransform: "capitalize" }}>{monthName}</div>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: MN, fontSize: 11, color: C.accent }}>{fmtBRL(d.receita)}</div>
                        <div style={{ fontSize: 9, color: C.textMuted }}>receita</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: MN, fontSize: 11, color: d.lucro >= 0 ? C.accent : C.red }}>{fmtBRL(d.lucro)}</div>
                        <div style={{ fontSize: 9, color: C.textMuted }}>lucro</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: MN, fontSize: 11, color: d.margem >= (bench.margemLiquida || 25) ? C.accent : C.yellow }}>{fmtPct(d.margem)}</div>
                        <div style={{ fontSize: 9, color: C.textMuted }}>margem</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     DASHBOARD
     ═══════════════════════════════════════════════════════════════ */
  if (!active) { setView("list"); return null; }

  return (
    <div>
      {showUpgrade && <PremiumGate onClose={() => setShowUpgrade(false)} context="diagnostico" />}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => { setView("list"); setActiveId(null); setViewMonth(curMonth()); }} style={{ background: "none", border: "none", color: C.textDim, fontSize: 12, cursor: "pointer", fontFamily: FN, marginBottom: 8 }}>← Voltar aos negócios</button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{ ...heroStyle, margin: "0 0 2px" }}>{active.nome}</h2>
            <span style={{ fontSize: 11, color: C.accent, fontFamily: MN }}>{seg?.label}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setView("historico")}
              style={{ padding: "6px 14px", borderRadius: 8, fontSize: 10, fontFamily: MN, cursor: "pointer", background: "rgba(255,255,255,0.030)", color: C.textDim, border: `1px solid ${C.border}` }}>Histórico</button>
            <button onClick={() => { if (confirm(`Excluir "${active.nome}"?`)) deleteNegocio(active.id); }}
              style={{ padding: "6px 14px", borderRadius: 8, fontSize: 10, fontFamily: MN, cursor: "pointer", background: `${C.red}12`, color: C.red, border: `1px solid ${C.red}25` }}>Excluir</button>
          </div>
        </div>
      </div>

      <BannerNegocio />

      {/* Month navigator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => { const [y, m] = displayMonth.split("-").map(Number); const d = new Date(y, m - 2, 1); setViewMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`); }}
          style={{ background: "none", border: "none", color: C.textDim, fontSize: 16, cursor: "pointer", padding: "4px 8px" }}>←</button>
        <div style={{ fontFamily: MN, fontSize: 13, color: isCurrentMonth ? C.accent : C.white, minWidth: 100, textAlign: "center" }}>
          {new Date(parseInt(displayMonth.split("-")[0]), parseInt(displayMonth.split("-")[1]) - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </div>
        <button onClick={() => { if (!isCurrentMonth) { const [y, m] = displayMonth.split("-").map(Number); const d = new Date(y, m, 1); setViewMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`); } }}
          style={{ background: "none", border: "none", color: isCurrentMonth ? C.textMuted : C.textDim, fontSize: 16, cursor: isCurrentMonth ? "default" : "pointer", padding: "4px 8px" }}>→</button>
      </div>

      {/* Meta progress */}
      {active.meta > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: C.textDim }}>Meta de faturamento</span>
            <span style={{ ...moneyCompactStyle, fontSize: "clamp(12px, 3.4vw, 14px)", color: totalR >= active.meta ? C.accent : C.text }}>{fmtBRL(totalR)} / {fmtBRL(active.meta)}</span>
          </div>
          <div style={{ height: 5, background: C.cardAlt, borderRadius: 3 }}>
            <div style={{ height: "100%", width: `${Math.min((totalR / active.meta) * 100, 100)}%`, background: totalR >= active.meta ? C.accent : C.accent, borderRadius: 3, transition: "width 0.3s" }} />
          </div>
        </div>
      )}

      {/* DRE — dashboard executivo compacto */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: MN, letterSpacing: "1px", marginBottom: 3 }}>RESULTADO DO MÊS</div>
            <div style={{ fontSize: 12, color: C.textDim }}>Resumo executivo do negócio</div>
          </div>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: lucro >= 0 ? C.accent : C.red, boxShadow: lucro >= 0 ? `0 0 18px ${C.accentGlow}` : "none" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          {[
            { label: "Receita", value: fmtBRL(totalR), color: C.accent },
            { label: "Despesa", value: fmtBRL(totalD), color: C.red },
            { label: "Lucro", value: fmtBRL(lucro), color: lucro >= 0 ? C.accent : C.red },
            { label: "Margem", value: fmtPct(margem), color: margem >= bench.margemLiquida ? C.accent : C.yellow },
            { label: "Custos / Receita", value: fmtPct(custoPct), color: custoPct <= bench.custoTotal ? C.accent : C.yellow },
            { label: "Meta do segmento", value: `${bench.margemLiquida}% margem`, color: C.textDim },
          ].map((item) => (
            <div key={item.label} style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 12px", minWidth: 0 }}>
              <div style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 5 }}>{item.label}</div>
              <div style={{ ...moneyCompactStyle, fontSize: "clamp(13px, 3.6vw, 16px)", color: item.color, overflow: "hidden", textOverflow: "ellipsis" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Relatório do Mês — componentizado em meu-negocio/RelatorioPremium */}
      <RelatorioPremium
        negocio={active}
        mes={displayMonth}
        isPremium={isPremium}
        onUpgrade={() => setShowUpgrade(true)}
      />

      {/* Despesas por Categoria */}
      {despPorCat.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 16, marginTop: 10 }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontFamily: MN, letterSpacing: "1px", marginBottom: 12 }}>DESPESAS POR CATEGORIA</div>
          {despPorCat.map(([cat, val]) => {
            const pct = totalR > 0 ? (val / totalR) * 100 : 0;
            return (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.text }}>{cat}</span>
                  <span style={{ fontFamily: MN, fontSize: 11, color: C.textDim }}>{fmtBRL(val)} ({fmtPct(pct)})</span>
                </div>
                <div style={{ height: 4, background: C.cardAlt, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: pct > 30 ? C.yellow : C.accent, borderRadius: 2, transition: "width 0.3s" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Receitas + Despesas em 2 colunas (auto-fit: empilha em mobile) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 12 }}>

        {/* Receitas */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: MN, letterSpacing: "1px" }}>RECEITAS</div>
            <button onClick={() => { setShowModal("receitas"); setNewItem({ desc: "", valor: "", categoria: seg?.receitas[0] || "" }); }}
              style={{ padding: "5px 14px", borderRadius: 8, fontSize: 11, fontFamily: MN, cursor: "pointer", background: "rgba(255,255,255,0.030)", color: C.textDim, border: `1px solid ${C.border}` }}>+ Adicionar</button>
          </div>
          {recMes.length === 0 && <div style={{ textAlign: "center", padding: "16px 0", color: C.textMuted, fontSize: 12 }}>Nenhuma receita neste mês</div>}
          {recMes.map((r) => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <div><div style={{ fontSize: 12, color: C.text }}>{r.desc}</div><div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN }}>{r.categoria}</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: MN, fontSize: 12, color: C.accent }}>{fmtBRL(r.valor)}</span>
                <button onClick={() => removeItem("receitas", r.id)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14 }}>×</button>
              </div>
            </div>
          ))}
        </div>

        {/* Despesas */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: MN, letterSpacing: "1px" }}>DESPESAS</div>
            <button onClick={() => { setShowModal("despesas"); setNewItem({ desc: "", valor: "", categoria: seg?.despesas[0] || "" }); }}
              style={{ padding: "5px 14px", borderRadius: 8, fontSize: 11, fontFamily: MN, cursor: "pointer", background: `${C.red}12`, color: C.red, border: `1px solid ${C.red}25` }}>+ Adicionar</button>
          </div>
          {despMes.length === 0 && <div style={{ textAlign: "center", padding: "16px 0", color: C.textMuted, fontSize: 12 }}>Nenhuma despesa neste mês</div>}
          {despMes.map((d) => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <div><div style={{ fontSize: 12, color: C.text }}>{d.desc}</div><div style={{ fontSize: 10, color: C.textMuted, fontFamily: MN }}>{d.categoria}</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: MN, fontSize: 12, color: C.red }}>{fmtBRL(d.valor)}</span>
                <button onClick={() => removeItem("despesas", d.id)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14 }}>×</button>
              </div>
            </div>
          ))}
        </div>

      </div>

      <SponsorSlot id="negocio-bottom" />

      {/* Empty hint */}
      {recMes.length === 0 && despMes.length === 0 && (
        <div style={{ textAlign: "center", padding: "24px 20px" }}>
          <div style={{ fontSize: 13, color: C.white, fontWeight: 600, marginBottom: 6 }}>Comece lançando receitas e despesas</div>
          <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.7 }}>Categorias preparadas para {seg?.label}.</div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => setShowModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 400, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 20px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 16 }}>{showModal === "receitas" ? "Nova Receita" : "Nova Despesa"}</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: C.textDim, display: "block", marginBottom: 4, fontFamily: MN }}>Categoria</label>
              <select value={newItem.categoria} onChange={(e) => setNewItem((p) => ({ ...p, categoria: e.target.value }))}
                style={{ width: "100%", padding: "10px 14px", background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, fontFamily: FN, appearance: "auto" }}>
                {(showModal === "receitas" ? seg?.receitas : seg?.despesas)?.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: C.textDim, display: "block", marginBottom: 4, fontFamily: MN }}>Descrição</label>
              <input value={newItem.desc} onChange={(e) => setNewItem((p) => ({ ...p, desc: e.target.value }))} placeholder={showModal === "receitas" ? "Ex: Vendas dia 15" : "Ex: Gasolina semana 1"}
                style={{ width: "100%", padding: "10px 14px", background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, fontFamily: FN, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: C.textDim, display: "block", marginBottom: 4, fontFamily: MN }}>Valor (R$)</label>
              <input type="number" value={newItem.valor} onChange={(e) => setNewItem((p) => ({ ...p, valor: e.target.value }))} placeholder="0,00"
                style={{ width: "100%", padding: "10px 14px", background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, fontFamily: MN, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => addItem(showModal)} style={{ flex: 1, padding: 12, background: "linear-gradient(180deg, #20C982, #0E9F6E)", color: "#06110C", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: FN, cursor: "pointer" }}>Salvar</button>
              <button onClick={() => setShowModal(null)} style={{ padding: "12px 20px", background: C.cardAlt, color: C.textDim, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, fontFamily: FN, cursor: "pointer" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <p style={{ textAlign: "center", fontSize: 10, color: C.textMuted, lineHeight: 1.6, marginTop: 20 }}>Simulação educativa. Não substitui acompanhamento contábil.</p>
    </div>
  );
}
