import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
  PieChart, Pie
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════════════════════════════════ */
const C = {
  bg: "#06090F", card: "#0D1117", cardAlt: "#131922",
  border: "#1B2433", borderLight: "#253044",
  accent: "#00E5A0", accentDim: "rgba(0,229,160,0.08)", accentBorder: "rgba(0,229,160,0.25)",
  blue: "#38BDF8", purple: "#A78BFA", pink: "#F472B6",
  orange: "#FB923C", yellow: "#FBBF24", green: "#34D399", red: "#F87171",
  text: "#E2E8F0", textDim: "#64748B", textMuted: "#3E4C5E", white: "#F8FAFC",
};
const PAL = [C.accent, C.blue, C.purple, C.pink, C.orange, C.yellow, "#818CF8", "#FB7185", "#2DD4BF", "#E879F9"];
const FN = "'Outfit',sans-serif";
const MN = "'JetBrains Mono',monospace";
const _fl = document.createElement("link");
_fl.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
_fl.rel = "stylesheet";
document.head.appendChild(_fl);
const _ss = document.createElement("style");
_ss.textContent = `@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes glow{0%,100%{box-shadow:0 0 8px rgba(0,229,160,.3)}50%{box-shadow:0 0 20px rgba(0,229,160,.6)}}.fu{animation:fadeUp .4s ease forwards}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px}input::placeholder{color:${C.textMuted}}`;
document.head.appendChild(_ss);

/* ═══════════════════════════════════════════════════════════════════════
   STORAGE HELPERS
   ═══════════════════════════════════════════════════════════════════════ */
const ADMIN_EMAIL = "guilherme@comparai.com";
const ADMIN_PASS = "admin2024";

async function storageGet(key) {
  try {
    const v = localStorage.getItem("comparai_" + key);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}
async function storageSet(key, val) {
  try {
    localStorage.setItem("comparai_" + key, JSON.stringify(val));
    return true;
  } catch { return false; }
}

/* ═══════════════════════════════════════════════════════════════════════
   VALIDATORS
   ═══════════════════════════════════════════════════════════════════════ */
function validateCPF(cpf) {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i);
  let rem = (sum * 10) % 11;
  if (rem === 10) rem = 0;
  if (rem !== parseInt(clean[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean[i]) * (11 - i);
  rem = (sum * 10) % 11;
  if (rem === 10) rem = 0;
  if (rem !== parseInt(clean[10])) return false;
  return true;
}

function formatCPF(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
}

function formatPhone(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validatePhone(p) { return p.replace(/\D/g, "").length === 11; }

/* ═══════════════════════════════════════════════════════════════════════
   LGPD CONSENT TEXT
   ═══════════════════════════════════════════════════════════════════════ */
const LGPD_TEXT = `TERMO DE CONSENTIMENTO PARA TRATAMENTO DE DADOS PESSOAIS — LGPD

Ao se cadastrar na plataforma compar.ai, você autoriza a coleta e o tratamento dos seguintes dados pessoais: nome completo, CPF, telefone celular, e-mail, sexo e data de nascimento.

FINALIDADE DO TRATAMENTO:
• Identificação e autenticação do usuário na plataforma
• Personalização da experiência de uso
• Análises estatísticas internas (faixa etária, perfil de investidor, comportamento de uso)
• Comunicação sobre atualizações e novidades da plataforma
• Geração de relatórios agregados e anonimizados para fins comerciais

SEUS DIREITOS (Art. 18 da LGPD):
Você pode, a qualquer momento, solicitar: acesso aos seus dados, correção de dados incompletos ou desatualizados, anonimização ou exclusão de dados desnecessários, portabilidade dos dados, e revogação deste consentimento.

COMPARTILHAMENTO:
Seus dados pessoais NÃO serão vendidos ou compartilhados individualmente com terceiros. Relatórios agregados e anônimos (ex: "85% dos usuários têm entre 25-40 anos") podem ser utilizados para fins comerciais.

ARMAZENAMENTO:
Os dados são armazenados de forma segura e criptografada, com acesso restrito à equipe administrativa da plataforma.

Ao clicar em "Aceito e quero me cadastrar", você declara que leu e concorda com os termos acima, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).`;

/* ═══════════════════════════════════════════════════════════════════════
   SHARED UI
   ═══════════════════════════════════════════════════════════════════════ */
const inputStyle = {
  width: "100%", padding: "12px 16px", background: C.cardAlt,
  border: `1px solid ${C.border}`, borderRadius: 10, color: C.text,
  fontSize: 14, fontFamily: FN, outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s",
};
const labelStyle = { fontSize: 12, color: C.textDim, marginBottom: 4, display: "block", fontFamily: MN };
const errorStyle = { fontSize: 11, color: C.red, marginTop: 2 };
const btnPrimary = {
  width: "100%", padding: "14px", background: C.accent, color: C.bg,
  border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
  fontFamily: FN, cursor: "pointer", transition: "opacity 0.2s",
};
const btnSecondary = {
  width: "100%", padding: "12px", background: "transparent",
  border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 13,
  color: C.textDim, fontFamily: FN, cursor: "pointer",
};

function FieldError({ msg }) {
  if (!msg) return null;
  return <div style={errorStyle}>{msg}</div>;
}

/* ═══════════════════════════════════════════════════════════════════════
   REGISTER SCREEN
   ═══════════════════════════════════════════════════════════════════════ */
function RegisterScreen({ onRegistered, onGoLogin }) {
  const [form, setForm] = useState({ nome: "", sobrenome: "", email: "", celular: "", cpf: "", sexo: "", nascimento: "", senha: "", senhaConf: "" });
  const [errors, setErrors] = useState({});
  const [lgpdOpen, setLgpdOpen] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [globalErr, setGlobalErr] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Obrigatório";
    if (!form.sobrenome.trim()) e.sobrenome = "Obrigatório";
    if (!validateEmail(form.email)) e.email = "E-mail inválido";
    if (!validatePhone(form.celular)) e.celular = "Celular inválido (11 dígitos)";
    if (!validateCPF(form.cpf)) e.cpf = "CPF inválido (verifique os dígitos)";
    if (!form.sexo) e.sexo = "Selecione";
    if (!form.nascimento) e.nascimento = "Obrigatório";
    if (form.senha.length < 6) e.senha = "Mínimo 6 caracteres";
    if (form.senha !== form.senhaConf) e.senhaConf = "Senhas não coincidem";
    if (!lgpdAccepted) e.lgpd = "Você precisa aceitar os termos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setGlobalErr("");

    const cpfClean = form.cpf.replace(/\D/g, "");
    const users = (await storageGet("users")) || {};

    if (users[cpfClean]) { setGlobalErr("CPF já cadastrado. Faça login."); setSubmitting(false); return; }

    const emailExists = Object.values(users).some((u) => u.email === form.email.toLowerCase());
    if (emailExists) { setGlobalErr("E-mail já cadastrado. Faça login."); setSubmitting(false); return; }

    const user = {
      nome: form.nome.trim(),
      sobrenome: form.sobrenome.trim(),
      email: form.email.toLowerCase().trim(),
      celular: form.celular.replace(/\D/g, ""),
      cpf: cpfClean,
      sexo: form.sexo,
      nascimento: form.nascimento,
      senha: form.senha,
      lgpdAccepted: true,
      lgpdDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      searches: [],
      isAdmin: form.email.toLowerCase().trim() === ADMIN_EMAIL,
    };

    users[cpfClean] = user;
    await storageSet("users", users);
    await storageSet("session", { cpf: cpfClean, loggedIn: true });

    setSubmitting(false);
    onRegistered(user);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="fu" style={{ width: "100%", maxWidth: 480, background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "36px 32px" }}>
        <h1 style={{ fontFamily: MN, fontSize: 22, fontWeight: 800, color: C.white, margin: "0 0 4px", textAlign: "center" }}>
          compar<span style={{ color: C.accent }}>.</span>ai
        </h1>
        <p style={{ textAlign: "center", color: C.textDim, fontSize: 13, marginBottom: 28 }}>Crie sua conta gratuita</p>

        {globalErr && <div style={{ padding: "10px 14px", background: `${C.red}15`, border: `1px solid ${C.red}30`, borderRadius: 10, color: C.red, fontSize: 12, marginBottom: 16 }}>{globalErr}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Nome</label>
            <input style={inputStyle} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="João" />
            <FieldError msg={errors.nome} />
          </div>
          <div>
            <label style={labelStyle}>Sobrenome</label>
            <input style={inputStyle} value={form.sobrenome} onChange={(e) => set("sobrenome", e.target.value)} placeholder="Silva" />
            <FieldError msg={errors.sobrenome} />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>E-mail</label>
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="joao@email.com" />
          <FieldError msg={errors.email} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Celular</label>
            <input style={inputStyle} value={formatPhone(form.celular)} onChange={(e) => set("celular", e.target.value)} placeholder="(11) 99999-9999" />
            <FieldError msg={errors.celular} />
          </div>
          <div>
            <label style={labelStyle}>CPF</label>
            <input style={inputStyle} value={formatCPF(form.cpf)} onChange={(e) => set("cpf", e.target.value)} placeholder="000.000.000-00" />
            <FieldError msg={errors.cpf} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Sexo</label>
            <select style={{ ...inputStyle, appearance: "auto" }} value={form.sexo} onChange={(e) => set("sexo", e.target.value)}>
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
              <option value="N">Prefiro não dizer</option>
            </select>
            <FieldError msg={errors.sexo} />
          </div>
          <div>
            <label style={labelStyle}>Data de Nascimento</label>
            <input style={inputStyle} type="date" value={form.nascimento} onChange={(e) => set("nascimento", e.target.value)} />
            <FieldError msg={errors.nascimento} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Senha</label>
            <input style={inputStyle} type="password" value={form.senha} onChange={(e) => set("senha", e.target.value)} placeholder="Mínimo 6 caracteres" />
            <FieldError msg={errors.senha} />
          </div>
          <div>
            <label style={labelStyle}>Confirmar Senha</label>
            <input style={inputStyle} type="password" value={form.senhaConf} onChange={(e) => set("senhaConf", e.target.value)} placeholder="Repita a senha" />
            <FieldError msg={errors.senhaConf} />
          </div>
        </div>

        {/* LGPD */}
        <div style={{ marginBottom: 20, padding: "14px 16px", background: C.cardAlt, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <input type="checkbox" checked={lgpdAccepted} onChange={(e) => setLgpdAccepted(e.target.checked)}
              style={{ marginTop: 3, accentColor: C.accent, width: 16, height: 16, cursor: "pointer" }} />
            <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.6 }}>
              Li e aceito o{" "}
              <span onClick={() => setLgpdOpen(!lgpdOpen)} style={{ color: C.accent, cursor: "pointer", textDecoration: "underline" }}>
                Termo de Consentimento para Tratamento de Dados Pessoais (LGPD)
              </span>
            </div>
          </div>
          <FieldError msg={errors.lgpd} />

          {lgpdOpen && (
            <div style={{ marginTop: 12, padding: "14px", background: C.bg, borderRadius: 10, maxHeight: 200, overflowY: "auto", fontSize: 11, color: C.textDim, lineHeight: 1.7, whiteSpace: "pre-line", border: `1px solid ${C.border}` }}>
              {LGPD_TEXT}
            </div>
          )}
        </div>

        <button style={{ ...btnPrimary, opacity: submitting ? 0.6 : 1 }} onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Cadastrando..." : "Aceito e quero me cadastrar"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={onGoLogin} style={{ ...btnSecondary, border: "none", width: "auto", padding: "8px 16px" }}>
            Já tem conta? <span style={{ color: C.accent }}>Fazer login</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LOGIN SCREEN
   ═══════════════════════════════════════════════════════════════════════ */
function LoginScreen({ onLoggedIn, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const users = (await storageGet("users")) || {};
    const user = Object.values(users).find((u) => u.email === email.toLowerCase().trim() && u.senha === senha);
    if (!user) { setError("E-mail ou senha incorretos."); setLoading(false); return; }
    user.lastLogin = new Date().toISOString();
    users[user.cpf] = user;
    await storageSet("users", users);
    await storageSet("session", { cpf: user.cpf, loggedIn: true });
    setLoading(false);
    onLoggedIn(user);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="fu" style={{ width: "100%", maxWidth: 400, background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "36px 32px" }}>
        <h1 style={{ fontFamily: MN, fontSize: 22, fontWeight: 800, color: C.white, margin: "0 0 4px", textAlign: "center" }}>
          compar<span style={{ color: C.accent }}>.</span>ai
        </h1>
        <p style={{ textAlign: "center", color: C.textDim, fontSize: 13, marginBottom: 28 }}>Entrar na sua conta</p>

        {error && <div style={{ padding: "10px 14px", background: `${C.red}15`, border: `1px solid ${C.red}30`, borderRadius: 10, color: C.red, fontSize: 12, marginBottom: 16 }}>{error}</div>}

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>E-mail</label>
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Senha</label>
          <input style={inputStyle} type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        </div>

        <button style={{ ...btnPrimary, opacity: loading ? 0.6 : 1 }} onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={onGoRegister} style={{ ...btnSecondary, border: "none", width: "auto", padding: "8px 16px" }}>
            Não tem conta? <span style={{ color: C.accent }}>Cadastre-se</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
   ═══════════════════════════════════════════════════════════════════════ */
function AdminDashboard({ onBack }) {
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = (await storageGet("users")) || {};
      setUsers(u);
      setLoading(false);
    })();
  }, []);

  const userList = Object.values(users);
  const total = userList.length;

  const sexoData = useMemo(() => {
    const counts = { M: 0, F: 0, O: 0, N: 0 };
    userList.forEach((u) => { if (counts[u.sexo] !== undefined) counts[u.sexo]++; });
    return [
      { name: "Masculino", value: counts.M, fill: C.blue },
      { name: "Feminino", value: counts.F, fill: C.pink },
      { name: "Outro", value: counts.O, fill: C.purple },
      { name: "N/D", value: counts.N, fill: C.textMuted },
    ].filter((d) => d.value > 0);
  }, [users]);

  const ageData = useMemo(() => {
    const buckets = { "18-24": 0, "25-34": 0, "35-44": 0, "45-54": 0, "55+": 0 };
    const now = new Date();
    userList.forEach((u) => {
      if (!u.nascimento) return;
      const birth = new Date(u.nascimento);
      const age = Math.floor((now - birth) / (365.25 * 86400000));
      if (age < 25) buckets["18-24"]++;
      else if (age < 35) buckets["25-34"]++;
      else if (age < 45) buckets["35-44"]++;
      else if (age < 55) buckets["45-54"]++;
      else buckets["55+"]++;
    });
    return Object.entries(buckets).map(([name, value], i) => ({ name, value, fill: PAL[i] })).filter((d) => d.value > 0);
  }, [users]);

  const searchData = useMemo(() => {
    const counts = {};
    userList.forEach((u) => {
      (u.searches || []).forEach((s) => {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([name, value]) => ({ name, value }));
  }, [users]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.textDim }}>
        <div style={{ width: 28, height: 28, border: `2.5px solid ${C.border}`, borderTop: `2.5px solid ${C.accent}`, borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
        Carregando dados...
      </div>
    );
  }

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: MN, fontSize: 18, fontWeight: 800, color: C.white, margin: 0 }}>
            🔐 Painel Administrativo
          </h2>
          <p style={{ fontSize: 12, color: C.textDim, margin: "4px 0 0" }}>Métricas de usuários e comportamento</p>
        </div>
        <button onClick={onBack} style={{ padding: "8px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: MN, cursor: "pointer", background: C.cardAlt, color: C.textDim, border: `1px solid ${C.border}` }}>
          ← Voltar ao app
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Usuários", value: total, icon: "👥" },
          { label: "Cadastros Hoje", value: userList.filter((u) => u.createdAt?.startsWith(new Date().toISOString().slice(0, 10))).length, icon: "📅" },
          { label: "Buscas Totais", value: userList.reduce((s, u) => s + (u.searches?.length || 0), 0), icon: "🔍" },
          { label: "LGPD Aceitos", value: userList.filter((u) => u.lgpdAccepted).length, icon: "✅" },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>{kpi.icon} {kpi.label}</div>
            <div style={{ fontFamily: MN, fontSize: 28, fontWeight: 800, color: C.accent }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Gender */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, color: C.textDim, fontFamily: MN, marginBottom: 12 }}>Distribuição por Sexo</div>
          {sexoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={sexoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={3} strokeWidth={0}>
                  {sexoData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Legend wrapperStyle={{ fontFamily: MN, fontSize: 10 }} />
                <RTooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: MN, fontSize: 11, color: C.text }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div style={{ color: C.textMuted, fontSize: 12, padding: 20, textAlign: "center" }}>Sem dados ainda</div>}
        </div>

        {/* Age */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, color: C.textDim, fontFamily: MN, marginBottom: 12 }}>Faixa Etária</div>
          {ageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ageData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: C.textDim, fontSize: 10, fontFamily: MN }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {ageData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ color: C.textMuted, fontSize: 12, padding: 20, textAlign: "center" }}>Sem dados ainda</div>}
        </div>
      </div>

      {/* Top searches */}
      {searchData.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: C.textDim, fontFamily: MN, marginBottom: 12 }}>🔍 Ativos Mais Buscados</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {searchData.map((s, i) => (
              <span key={s.name} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontFamily: MN, fontWeight: 600, background: `${PAL[i % PAL.length]}15`, color: PAL[i % PAL.length], border: `1px solid ${PAL[i % PAL.length]}30` }}>
                {s.name} ({s.value})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* User table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "auto" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.textDim, fontFamily: MN }}>TODOS OS USUÁRIOS ({total})</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
          <thead>
            <tr>
              {["Nome", "E-mail", "Celular", "CPF", "Sexo", "Idade", "Cadastro", "Último Login", "Buscas"].map((h) => (
                <th key={h} style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}`, textAlign: "left", fontFamily: MN, fontSize: 9, color: C.textMuted, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {userList.map((u) => {
              const age = u.nascimento ? Math.floor((Date.now() - new Date(u.nascimento).getTime()) / (365.25 * 86400000)) : "—";
              const cpfMask = u.cpf ? `***.***.${u.cpf.slice(6, 9)}-${u.cpf.slice(9)}` : "—";
              return (
                <tr key={u.cpf}>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, fontSize: 12, color: C.text }}>{u.nome} {u.sobrenome}</td>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.textDim, fontFamily: MN }}>{u.email}</td>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.textDim, fontFamily: MN }}>{formatPhone(u.celular || "")}</td>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.textDim, fontFamily: MN }}>{cpfMask}</td>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.textDim }}>{u.sexo === "M" ? "Masc" : u.sexo === "F" ? "Fem" : u.sexo === "O" ? "Outro" : "N/D"}</td>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.textDim, fontFamily: MN }}>{age}</td>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, fontSize: 10, color: C.textMuted, fontFamily: MN }}>{u.createdAt?.slice(0, 10) || "—"}</td>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, fontSize: 10, color: C.textMuted, fontFamily: MN }}>{u.lastLogin?.slice(0, 10) || "—"}</td>
                  <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.accent, fontFamily: MN }}>{u.searches?.length || 0}</td>
                </tr>
              );
            })}
            {total === 0 && (
              <tr><td colSpan={9} style={{ padding: 20, textAlign: "center", color: C.textMuted, fontSize: 12 }}>Nenhum usuário cadastrado ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FORMATTERS
   ═══════════════════════════════════════════════════════════════════════ */
const numFmt = (v, d = 2) => {
  if (v == null || isNaN(v)) return "—";
  return Number(v).toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
};
const fmtBRL = (v) => (v != null && !isNaN(v) ? `R$ ${numFmt(v)}` : "—");
function fmtInd(v, f) {
  if (v == null || isNaN(v)) return "—";
  switch (f) {
    case "pct": return `${numFmt(v)}%`;
    case "bi": return `R$ ${numFmt(v, 1)} bilhões`;
    case "mi": return `R$ ${numFmt(v, 0)} milhões`;
    case "x": return `${numFmt(v)}x`;
    case "score": return `${Math.round(v)}/100`;
    case "money": {
      if (v >= 1e6) return `R$ ${numFmt(v / 1e6, 1)} milhões/dia`;
      if (v >= 1e3) return `R$ ${numFmt(v / 1e3, 1)} mil/dia`;
      return `R$ ${numFmt(v, 0)}/dia`;
    }
    default: return numFmt(v);
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   INDICATORS
   ═══════════════════════════════════════════════════════════════════════ */
const IND_ACOES = [
  { key: "priceToBook", label: "P/VP", unit: "x", short: "P/VP", dir: "lower", src: "STATUS", fmt: "x", tip: "Preço sobre Valor Patrimonial. Abaixo de 1x pode indicar desconto." },
  { key: "priceEarnings", label: "P/L", unit: "x", short: "P/L", dir: "lower", src: "STATUS", fmt: "x", tip: "Quantos anos de lucro para pagar o investimento. Quanto menor, mais barato." },
  { key: "priceToEbit", label: "P/Ebit", unit: "x", short: "P/Ebit", dir: "lower", src: "STATUS", fmt: "x", tip: "Preço sobre lucro operacional. Desconsidera impostos e juros." },
  { key: "evToEbit", label: "EV/EBIT", unit: "x", short: "EV/EBIT", dir: "lower", src: "STATUS", fmt: "x", tip: "Valor da firma (com dívidas) sobre EBIT. Mais completo que P/L." },
  { key: "netMargin", label: "Margem Líquida", unit: "%", short: "Marg.Líq", dir: "higher", src: "STATUS", fmt: "pct", tip: "Percentual do faturamento que sobra como lucro. Quanto maior, melhor." },
  { key: "roe", label: "ROE", unit: "%", short: "ROE", dir: "higher", src: "STATUS", fmt: "pct", tip: "Retorno sobre Patrimônio. Acima de 15% é considerado bom." },
  { key: "netIncome", label: "Lucro Líquido", unit: "R$ bilhões", short: "Lucro", dir: "higher", src: "FUNDAMENTUS", fmt: "bi", tip: "Lucro final após deduções. Empresas lucrativas são mais seguras." },
  { key: "grossDebt", label: "Dívida Bruta", unit: "R$ bilhões", short: "Dív.Bruta", dir: "lower", src: "TRADE MAP", fmt: "bi", tip: "Total de dívidas. Quanto menor, menos risco financeiro." },
  { key: "equity", label: "Patrimônio Líq.", unit: "R$ bilhões", short: "PL", dir: "higher", src: "TRADE MAP", fmt: "bi", tip: "Bens menos dívidas. Quanto maior, mais sólida." },
  { key: "debtToEquity", label: "DB/PL", unit: "x", short: "DB/PL", dir: "lower", src: "TRADE MAP", fmt: "x", tip: "Dívida sobre Patrimônio. Acima de 1x = dívida supera patrimônio." },
  { key: "cagr", label: "CAGR Lucro", unit: "%", short: "CAGR", dir: "higher", src: "STATUS", fmt: "pct", tip: "Crescimento anual composto do lucro em 5 anos. Acima de 10% é positivo." },
  { key: "dividendYield", label: "Dividend Yield", unit: "%", short: "DY", dir: "higher", src: "STATUS", fmt: "pct", tip: "Percentual pago em dividendos em 12 meses. Acima de 6% é bom." },
];

const IND_FIIS = [
  { key: "vacancy", label: "Vacância Física", unit: "%", short: "Vacânc.", dir: "lower", src: "FII INFO", fmt: "pct", tip: "Percentual de imóveis desocupados. Quanto menor, melhor." },
  { key: "equity", label: "Patrimônio Líquido", unit: "R$ milhões", short: "PL", dir: "higher", src: "CVM", fmt: "mi", tip: "Valor dos ativos menos obrigações. Fundos maiores são mais diversificados." },
  { key: "assets", label: "Ativos Imobilizados", unit: "R$ milhões", short: "Imob.", dir: "higher", src: "CVM", fmt: "mi", tip: "Valor dos imóveis físicos do fundo. Mostra o tamanho real do portfólio." },
  { key: "debt", label: "Dívida", unit: "R$ milhões", short: "Dívida", dir: "lower", src: "CVM", fmt: "mi", tip: "Total de dívidas (CRIs, debêntures). Mais risco com juros altos." },
  { key: "pvp", label: "P/VP", unit: "x", short: "P/VP", dir: "lower", src: "STATUS", fmt: "x", tip: "Abaixo de 1x = desconto, acima de 1x = ágio sobre o patrimônio." },
  { key: "dy12m", label: "DY 12 Meses", unit: "% a.a.", short: "DY 12M", dir: "higher", src: "STATUS", fmt: "pct", tip: "Dividend Yield acumulado em 12 meses. Acima de 8% é atrativo." },
  { key: "returnYTD", label: "Retorno no Ano", unit: "%", short: "Ret.Ano", dir: "higher", src: "STATUS", fmt: "pct", tip: "Valorização da cota + proventos no ano corrente." },
  { key: "risk", label: "Risco", unit: "0–100", short: "Risco", dir: "lower", src: "ANÁLISE", fmt: "score", tip: "Score 0–100: volatilidade, vacância e alavancagem. Abaixo de 30 é conservador." },
  { key: "liquidity", label: "Liquidez Diária", unit: "R$ milhões/dia", short: "Liq.", dir: "higher", src: "B3", fmt: "money", tip: "Volume médio negociado por dia. Acima de R$ 1 milhão/dia é boa liquidez." },
  { key: "portfolioQual", label: "Qualidade Portfólio", unit: "0–100", short: "Qual.", dir: "higher", src: "ANÁLISE", fmt: "score", tip: "Score 0–100: localização, inquilinos, diversificação e contratos. Acima de 80 é excelente." },
  { key: "distHistory", label: "Histórico Proventos", unit: "0–100", short: "Hist.", dir: "higher", src: "STATUS", fmt: "score", tip: "Score 0–100: consistência dos proventos em 24 meses. Acima de 85 é estável." },
];

/* ═══════════════════════════════════════════════════════════════════════
   SECTORS + DATA (condensed to save space)
   ═══════════════════════════════════════════════════════════════════════ */
const SECTORS_A = {"Financeiro":["ITUB4","BBAS3","SANB11","BBDC4","ITSA4","BPAC11","ABCB4"],"Energia":["PETR4"],"Energia Elétrica":["TAEE11","CMIG4","ELET3","EGIE3","CPFE3"],"Mineração / Siderurgia":["VALE3","CSNA3","GGBR4"],"Consumo":["MGLU3","ABEV3","RENT3","JBSS3","LREN3","ARZZ3"],"Bens Industriais":["WEGE3"],"Materiais Básicos":["SUZB3"],"Saúde":["FLRY3","HAPV3","RDOR3"],"Tecnologia":["TOTS3"],"Telecom":["VIVT3","TIMS3"]};
const SECTORS_F = {"Tijolo — Logística":["HGLG11","BTLG11","XPLG11","VILG11","LVBI11","BRCO11"],"Tijolo — Shopping":["XPML11","VISC11","HSML11","MALL11"],"Tijolo — Lajes Corp.":["KNRI11","HGRE11","BRCR11","PVBI11","VINO11"],"Tijolo — Renda Urbana":["TRXF11","HGRU11","RBVA11"],"Papel — CRI":["MXRF11","KNCR11","KNIP11","IRDM11","CPTS11","RBRR11","RECR11"],"Papel — Agro":["KNCA11","RZAG11"],"Híbrido / FOF":["BCFF11","HFOF11","RBRF11","MGFF11"]};
const getSA = (s) => { for (const [k, v] of Object.entries(SECTORS_A)) if (v.includes(s)) return k; return null; };
const getSF = (s) => { for (const [k, v] of Object.entries(SECTORS_F)) if (v.includes(s)) return k; return null; };

const RA = {PETR4:{sn:"PETROBRAS PN",pr:38.72,pvp:1.4,pl:6.2,pebit:3.8,evebit:4.1,mg:22.5,roe:32.1,lucro:98.5,divb:210,eq:350,dbpl:0.60,cagr:18.2,dy:12.3},VALE3:{sn:"VALE ON NM",pr:58.43,pvp:1.6,pl:7.5,pebit:4.5,evebit:5.2,mg:19.8,roe:24.8,lucro:72.3,divb:85,eq:215,dbpl:0.40,cagr:15.4,dy:8.5},ITUB4:{sn:"ITAÚ UNIBANCO PN",pr:34.82,pvp:1.8,pl:8.5,pebit:6.2,evebit:7.1,mg:26.3,roe:18.5,lucro:35.6,divb:45,eq:185,dbpl:0.24,cagr:12.8,dy:4.2},BBAS3:{sn:"BANCO DO BRASIL ON",pr:28.15,pvp:0.9,pl:5.1,pebit:3.9,evebit:4.5,mg:24.1,roe:21.3,lucro:33.8,divb:38,eq:172,dbpl:0.22,cagr:14.5,dy:8.9},SANB11:{sn:"SANTANDER BR UNT",pr:27.50,pvp:1.01,pl:7.26,pebit:4.85,evebit:5.09,mg:14.81,roe:13.91,lucro:3.9,divb:10,eq:79,dbpl:0.127,cagr:14.98,dy:10.15},BBDC4:{sn:"BRADESCO PN",pr:15.23,pvp:1.05,pl:7.01,pebit:5.56,evebit:6.12,mg:17.82,roe:15.0,lucro:7.0,divb:15,eq:151,dbpl:0.099,cagr:5.2,dy:7.2},ITSA4:{sn:"ITAÚSA PN",pr:10.85,pvp:1.5,pl:7.8,pebit:5.8,evebit:6.5,mg:22.0,roe:17.2,lucro:14.2,divb:12,eq:82,dbpl:0.15,cagr:11.2,dy:6.8},BPAC11:{sn:"BTGP BANCO UNT",pr:32.40,pvp:2.8,pl:12.5,pebit:8.2,evebit:9.5,mg:32.5,roe:22.8,lucro:10.8,divb:8,eq:48,dbpl:0.17,cagr:20.5,dy:3.1},ABCB4:{sn:"ABC BRASIL PN",pr:22.30,pvp:0.85,pl:5.8,pebit:4.2,evebit:4.8,mg:20.5,roe:16.8,lucro:1.2,divb:2.5,eq:9.8,dbpl:0.26,cagr:13.5,dy:7.5},WEGE3:{sn:"WEG ON NM",pr:42.18,pvp:8.2,pl:28.5,pebit:22.1,evebit:24.3,mg:18.2,roe:28.5,lucro:5.2,divb:3.5,eq:18,dbpl:0.19,cagr:22.5,dy:1.5},MGLU3:{sn:"MAGAZINE LUIZA ON",pr:12.54,pvp:4.8,pl:45.2,pebit:18.5,evebit:22.0,mg:2.1,roe:5.2,lucro:0.8,divb:12,eq:8.5,dbpl:1.41,cagr:8.3,dy:0.3},ABEV3:{sn:"AMBEV S/A ON",pr:14.85,pvp:3.2,pl:14.8,pebit:10.2,evebit:11.5,mg:15.6,roe:16.8,lucro:14.2,divb:8,eq:45,dbpl:0.18,cagr:6.8,dy:5.4},RENT3:{sn:"LOCALIZA ON NM",pr:48.90,pvp:2.4,pl:16.3,pebit:10.8,evebit:12.4,mg:10.5,roe:14.2,lucro:3.8,divb:42,eq:28,dbpl:1.5,cagr:15.2,dy:2.1},JBSS3:{sn:"JBS ON NM",pr:34.60,pvp:2.1,pl:11.2,pebit:5.9,evebit:6.8,mg:4.5,roe:22.1,lucro:8.5,divb:95,eq:42,dbpl:2.26,cagr:18.5,dy:2.8},LREN3:{sn:"LOJAS RENNER ON",pr:18.50,pvp:3.5,pl:15.2,pebit:9.8,evebit:11.2,mg:9.8,roe:18.5,lucro:2.1,divb:5.2,eq:12,dbpl:0.43,cagr:10.5,dy:3.5},ARZZ3:{sn:"AREZZO ON NM",pr:62.30,pvp:4.2,pl:18.5,pebit:12.8,evebit:14.2,mg:12.5,roe:24.2,lucro:1.5,divb:3.8,eq:7.2,dbpl:0.53,cagr:16.8,dy:2.2},TAEE11:{sn:"TAESA UNT N2",pr:36.40,pvp:1.7,pl:9.1,pebit:7.2,evebit:8.5,mg:45.2,roe:22.5,lucro:1.8,divb:6.5,eq:9.2,dbpl:0.71,cagr:10.8,dy:9.8},CMIG4:{sn:"CEMIG PN",pr:11.85,pvp:1.3,pl:6.8,pebit:5.4,evebit:6.2,mg:18.9,roe:19.3,lucro:4.5,divb:18,eq:32,dbpl:0.56,cagr:12.1,dy:10.2},ELET3:{sn:"ELETROBRAS ON",pr:40.25,pvp:1.0,pl:7.8,pebit:6.0,evebit:7.2,mg:20.1,roe:13.5,lucro:12.8,divb:48,eq:95,dbpl:0.51,cagr:9.5,dy:5.6},EGIE3:{sn:"ENGIE BRASIL ON",pr:43.80,pvp:2.8,pl:10.5,pebit:8.2,evebit:9.8,mg:28.5,roe:25.2,lucro:3.2,divb:14,eq:13.5,dbpl:1.04,cagr:11.5,dy:8.2},CPFE3:{sn:"CPFL ENERGIA ON",pr:34.50,pvp:2.2,pl:8.2,pebit:6.5,evebit:7.8,mg:15.8,roe:26.5,lucro:4.8,divb:22,eq:18,dbpl:1.22,cagr:13.2,dy:7.5},SUZB3:{sn:"SUZANO S.A. ON",pr:52.35,pvp:1.5,pl:8.9,pebit:6.1,evebit:7.0,mg:21.4,roe:18.9,lucro:8.2,divb:62,eq:45,dbpl:1.38,cagr:14.2,dy:3.2},CSNA3:{sn:"SID NACIONAL ON",pr:12.80,pvp:1.8,pl:8.5,pebit:4.8,evebit:5.5,mg:12.5,roe:18.2,lucro:3.5,divb:42,eq:18,dbpl:2.33,cagr:8.5,dy:5.8},GGBR4:{sn:"GERDAU PN",pr:22.50,pvp:1.2,pl:6.5,pebit:4.2,evebit:4.8,mg:14.8,roe:16.5,lucro:6.8,divb:18,eq:42,dbpl:0.43,cagr:12.8,dy:6.2},FLRY3:{sn:"FLEURY ON NM",pr:16.80,pvp:2.5,pl:15.8,pebit:10.5,evebit:12.2,mg:10.8,roe:16.2,lucro:0.9,divb:3.2,eq:5.8,dbpl:0.55,cagr:9.8,dy:4.2},HAPV3:{sn:"HAPVIDA ON NM",pr:4.25,pvp:1.8,pl:22.5,pebit:14.2,evebit:16.5,mg:4.5,roe:8.2,lucro:1.4,divb:12,eq:18,dbpl:0.67,cagr:15.2,dy:1.2},RDOR3:{sn:"REDE D'OR ON NM",pr:28.50,pvp:3.2,pl:28.5,pebit:16.8,evebit:18.5,mg:8.2,roe:12.5,lucro:2.8,divb:22,eq:22,dbpl:1.0,cagr:18.5,dy:1.5},TOTS3:{sn:"TOTVS ON NM",pr:32.50,pvp:5.5,pl:32.5,pebit:22.5,evebit:24.8,mg:12.5,roe:18.5,lucro:0.65,divb:2.8,eq:3.8,dbpl:0.74,cagr:16.8,dy:1.2},VIVT3:{sn:"TELEF BRASIL ON",pr:52.80,pvp:1.5,pl:14.2,pebit:8.5,evebit:5.8,mg:15.2,roe:10.8,lucro:6.2,divb:18,eq:58,dbpl:0.31,cagr:5.5,dy:6.5},TIMS3:{sn:"TIM S/A ON NM",pr:18.20,pvp:2.8,pl:12.8,pebit:6.2,evebit:4.5,mg:18.5,roe:22.5,lucro:3.5,divb:12,eq:16,dbpl:0.75,cagr:8.8,dy:5.8}};

const DB_A = {};
Object.entries(RA).forEach(([s, r]) => {
  DB_A[s] = { symbol: s, shortName: r.sn, regularMarketPrice: r.pr, sector: getSA(s), priceToBook: r.pvp, priceEarnings: r.pl, priceToEbit: r.pebit, evToEbit: r.evebit, netMargin: r.mg, roe: r.roe, netIncome: r.lucro, grossDebt: r.divb, equity: r.eq, debtToEquity: r.dbpl, cagr: r.cagr, dividendYield: r.dy };
});

const RF = {HGLG11:{sn:"CSHG Logística",pr:162.50,vac:5.2,eq:8200,ast:9500,dbt:280,pvp:0.95,dy:7.8,ret:8.5,risk:22,liq:12500000,qual:88,hist:92},BTLG11:{sn:"BTG Log",pr:98.50,vac:3.8,eq:2650,ast:3100,dbt:180,pvp:0.93,dy:9.1,ret:12.2,risk:25,liq:4500000,qual:85,hist:90},XPLG11:{sn:"XP Log",pr:108.20,vac:7.5,eq:3000,ast:3600,dbt:320,pvp:0.97,dy:8.4,ret:6.8,risk:28,liq:6800000,qual:82,hist:88},VILG11:{sn:"Vinci Logística",pr:95.80,vac:8.2,eq:1650,ast:2100,dbt:250,pvp:0.91,dy:8.8,ret:5.2,risk:32,liq:3200000,qual:78,hist:85},LVBI11:{sn:"VBI Logístico",pr:112.40,vac:4.5,eq:1400,ast:1800,dbt:150,pvp:0.94,dy:8.2,ret:9.5,risk:24,liq:3800000,qual:84,hist:87},BRCO11:{sn:"Bresco Logística",pr:118.90,vac:2.1,eq:2000,ast:2500,dbt:200,pvp:0.96,dy:7.5,ret:10.8,risk:20,liq:2800000,qual:90,hist:93},XPML11:{sn:"XP Malls",pr:108.30,vac:4.8,eq:3900,ast:4800,dbt:450,pvp:0.88,dy:8.2,ret:11.5,risk:26,liq:8700000,qual:86,hist:89},VISC11:{sn:"Vinci Shop Centers",pr:112.80,vac:6.2,eq:3100,ast:3800,dbt:350,pvp:0.85,dy:8.6,ret:9.8,risk:30,liq:5400000,qual:82,hist:86},HSML11:{sn:"HSI Malls",pr:88.50,vac:5.5,eq:2000,ast:2600,dbt:280,pvp:0.90,dy:9.2,ret:14.2,risk:28,liq:4200000,qual:80,hist:84},MALL11:{sn:"Malls Brasil Plural",pr:102.40,vac:7.8,eq:1600,ast:2100,dbt:220,pvp:0.87,dy:8.8,ret:7.5,risk:34,liq:2800000,qual:75,hist:80},KNRI11:{sn:"Kinea Renda Imob",pr:136.20,vac:12.5,eq:4800,ast:5500,dbt:180,pvp:0.91,dy:7.2,ret:5.8,risk:35,liq:6500000,qual:80,hist:88},HGRE11:{sn:"CSHG Real Estate",pr:128.50,vac:18.2,eq:2900,ast:3500,dbt:120,pvp:0.82,dy:7.8,ret:3.2,risk:42,liq:4800000,qual:72,hist:82},BRCR11:{sn:"BC Fund",pr:58.20,vac:22.5,eq:2200,ast:2800,dbt:250,pvp:0.78,dy:8.5,ret:-2.5,risk:52,liq:3500000,qual:65,hist:75},PVBI11:{sn:"VBI Prime Prop",pr:92.80,vac:8.8,eq:1500,ast:1900,dbt:100,pvp:0.89,dy:7.5,ret:8.2,risk:30,liq:2200000,qual:82,hist:85},VINO11:{sn:"Vinci Offices",pr:8.50,vac:25.5,eq:720,ast:950,dbt:80,pvp:0.75,dy:9.2,ret:-4.5,risk:58,liq:1800000,qual:60,hist:70},TRXF11:{sn:"TRX Real Estate",pr:108.50,vac:0.5,eq:2300,ast:2800,dbt:320,pvp:0.98,dy:9.5,ret:12.8,risk:18,liq:3200000,qual:88,hist:91},HGRU11:{sn:"CSHG Renda Urbana",pr:128.80,vac:1.2,eq:3500,ast:4200,dbt:280,pvp:0.95,dy:8.2,ret:8.5,risk:22,liq:5200000,qual:85,hist:89},RBVA11:{sn:"Rio Bravo Renda",pr:102.50,vac:2.8,eq:1650,ast:2000,dbt:180,pvp:0.92,dy:8.8,ret:6.2,risk:28,liq:2800000,qual:80,hist:85},MXRF11:{sn:"Maxi Renda",pr:10.45,vac:null,eq:3600,ast:3800,dbt:0,pvp:1.02,dy:11.5,ret:12.8,risk:28,liq:54000000,qual:82,hist:90},KNCR11:{sn:"Kinea Rendimentos",pr:102.80,vac:null,eq:7000,ast:7200,dbt:0,pvp:1.01,dy:12.2,ret:14.5,risk:22,liq:18500000,qual:90,hist:95},KNIP11:{sn:"Kinea Índice Preço",pr:92.50,vac:null,eq:5500,ast:5800,dbt:0,pvp:0.98,dy:10.8,ret:9.2,risk:25,liq:12000000,qual:88,hist:92},IRDM11:{sn:"Iridium Recebíveis",pr:78.20,vac:null,eq:3000,ast:3200,dbt:0,pvp:0.95,dy:11.8,ret:8.5,risk:32,liq:8500000,qual:80,hist:85},CPTS11:{sn:"Capitânia Securities",pr:86.50,vac:null,eq:4200,ast:4500,dbt:0,pvp:0.99,dy:11.2,ret:11.8,risk:26,liq:15000000,qual:85,hist:88},RBRR11:{sn:"RBR Rendimento High",pr:88.80,vac:null,eq:2600,ast:2800,dbt:0,pvp:0.97,dy:12.5,ret:13.2,risk:30,liq:6500000,qual:82,hist:86},RECR11:{sn:"REC Recebíveis",pr:82.50,vac:null,eq:2050,ast:2200,dbt:0,pvp:0.96,dy:12.8,ret:10.5,risk:34,liq:5800000,qual:78,hist:82},KNCA11:{sn:"Kinea Crédito Agro",pr:105.20,vac:null,eq:1150,ast:1200,dbt:0,pvp:1.01,dy:13.5,ret:15.2,risk:28,liq:2500000,qual:85,hist:88},RZAG11:{sn:"Riza Agro",pr:92.80,vac:null,eq:750,ast:800,dbt:0,pvp:0.98,dy:14.2,ret:12.8,risk:35,liq:1800000,qual:78,hist:82},BCFF11:{sn:"BTG Fundo de Fundos",pr:72.50,vac:null,eq:2600,ast:2800,dbt:0,pvp:0.90,dy:10.5,ret:8.2,risk:30,liq:8500000,qual:80,hist:85},HFOF11:{sn:"Hedge Top FOF",pr:78.20,vac:null,eq:1650,ast:1800,dbt:0,pvp:0.88,dy:10.8,ret:6.5,risk:32,liq:5200000,qual:78,hist:82},RBRF11:{sn:"RBR Alpha FOF",pr:68.50,vac:null,eq:1100,ast:1200,dbt:0,pvp:0.92,dy:11.2,ret:9.8,risk:28,liq:3800000,qual:82,hist:86},MGFF11:{sn:"Mogno FOF",pr:62.80,vac:null,eq:550,ast:600,dbt:0,pvp:0.85,dy:11.8,ret:5.2,risk:38,liq:1500000,qual:72,hist:78}};

const DB_F = {};
Object.entries(RF).forEach(([s, r]) => {
  DB_F[s] = { symbol: s, shortName: r.sn, regularMarketPrice: r.pr, sector: getSF(s), vacancy: r.vac, equity: r.eq, assets: r.ast, debt: r.dbt, pvp: r.pvp, dy12m: r.dy, returnYTD: r.ret, risk: r.risk, liquidity: r.liq, portfolioQual: r.qual, distHistory: r.hist };
});

/* ═══════════════════════════════════════════════════════════════════════
   ENGINE + REUSABLE COMPONENTS (condensed)
   ═══════════════════════════════════════════════════════════════════════ */
function rankAll(symbols, db, indicators) {
  const assets = symbols.map((s) => db[s]).filter(Boolean);
  if (assets.length < 2) return [];
  const scores = {};
  assets.forEach((a) => { scores[a.symbol] = { wins: 0, points: 0 }; });
  for (let i = 0; i < assets.length; i++) {
    for (let j = i + 1; j < assets.length; j++) {
      let sA = 0, sB = 0;
      for (const ind of indicators) {
        const vA = assets[i][ind.key], vB = assets[j][ind.key];
        if (vA == null || vB == null || isNaN(vA) || isNaN(vB)) continue;
        const better = ind.dir === "lower" ? (vA < vB ? "A" : vA > vB ? "B" : null) : (vA > vB ? "A" : vA < vB ? "B" : null);
        if (better === "A") sA++;
        if (better === "B") sB++;
      }
      if (sA > sB) scores[assets[i].symbol].wins++;
      if (sB > sA) scores[assets[j].symbol].wins++;
      scores[assets[i].symbol].points += sA;
      scores[assets[j].symbol].points += sB;
    }
  }
  return Object.entries(scores).sort((a, b) => b[1].wins - a[1].wins || b[1].points - a[1].points).map(([sym, sc], i) => ({ ...db[sym], wins: sc.wins, points: sc.points, rank: i + 1 }));
}

function InfoTip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", marginLeft: 5 }}>
      <span onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 15, height: 15, borderRadius: "50%", fontSize: 9, color: C.textMuted, border: `1px solid ${C.border}`, cursor: "help", flexShrink: 0 }}>i</span>
      {show && <span style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, width: 250, padding: "10px 12px", background: "#1a2235", border: `1px solid ${C.borderLight}`, borderRadius: 10, fontSize: 11, lineHeight: 1.6, color: "#94A3B8", boxShadow: "0 12px 40px rgba(0,0,0,0.7)", zIndex: 200, pointerEvents: "none", fontFamily: FN }}>{text}</span>}
    </span>
  );
}

function InlineSearch({ index, onSelect, sectorLock, selected, placeholder, db }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const timer = useRef(null);
  useEffect(() => { const h = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const doSearch = (v) => { if (timer.current) clearTimeout(timer.current); if (v.length < 1) { setResults([]); setOpen(false); return; } timer.current = setTimeout(() => { const u = v.toUpperCase(); const r = Object.values(db).filter((x) => { if (sectorLock && x.sector !== sectorLock) return false; if (selected.includes(x.symbol)) return false; return x.symbol.includes(u) || x.shortName.toUpperCase().includes(u); }); setResults(r.slice(0, 10)); setOpen(true); }, 120); };
  return (
    <div ref={box} style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: "0 16px" }}>
        <span style={{ fontFamily: MN, fontSize: 13, fontWeight: 700, color: PAL[index % PAL.length], minWidth: 22 }}>{index + 1}.</span>
        <input value={q} onChange={(e) => { setQ(e.target.value); doSearch(e.target.value); }} onFocus={() => results.length > 0 && setOpen(true)} placeholder={placeholder} style={{ flex: 1, padding: "12px 0", background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, fontFamily: FN }} />
        {sectorLock && <span style={{ fontSize: 9, color: C.textMuted, fontFamily: MN, whiteSpace: "nowrap", padding: "4px 8px", background: `${C.accent}10`, borderRadius: 6, border: `1px solid ${C.accent}20` }}>{sectorLock}</span>}
      </div>
      {open && results.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, maxHeight: 220, overflowY: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
          {results.map((r) => (
            <button key={r.symbol} onClick={() => { onSelect(r.symbol); setQ(""); setOpen(false); setResults([]); }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 16px", background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`, cursor: "pointer", color: C.text, fontFamily: FN, fontSize: 12, textAlign: "left" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.cardAlt; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
              <div><span style={{ fontFamily: MN, fontWeight: 700, color: C.white, marginRight: 8 }}>{r.symbol}</span><span style={{ color: C.textDim, fontSize: 11 }}>{r.shortName}</span></div>
              <span style={{ fontFamily: MN, fontSize: 11, color: C.textDim }}>{fmtBRL(r.regularMarketPrice)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RankingResults({ ranked, selected, indicators, label }) {
  const medals = ["🥇", "🥈", "🥉"];
  const totalD = selected.length * (selected.length - 1) / 2;
  const radarData = indicators.filter((ind) => ranked.every((r) => r[ind.key] != null && !isNaN(r[ind.key]))).map((ind) => { const vals = ranked.map((r) => r[ind.key]); const mn = Math.min(...vals), mx = Math.max(...vals); const entry = { indicator: ind.short }; ranked.forEach((r) => { let n = mx === mn ? 50 : ((r[ind.key] - mn) / (mx - mn)) * 100; if (ind.dir === "lower") n = 100 - n; entry[r.symbol] = Math.round(n); }); return entry; });

  return (
    <div className="fu" style={{ marginTop: 24 }}>
      <div style={{ background: C.card, border: `1px solid ${C.accentBorder}`, borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 16, animation: "glow 3s infinite" }}>
        <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: "2px", fontFamily: MN, marginBottom: 10 }}>Melhor {label} do setor</div>
        <div style={{ fontSize: 36, marginBottom: 2 }}>🏆</div>
        <div style={{ fontFamily: MN, fontSize: 26, fontWeight: 800, color: C.accent }}>{ranked[0]?.symbol}</div>
        <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>{ranked[0]?.shortName}</div>
        <div style={{ fontFamily: MN, fontSize: 13, color: C.accent, marginTop: 6 }}>{ranked[0]?.wins} vitórias de {totalD} duelos</div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
        {ranked.map((r, i) => (
          <div key={r.symbol} className="fu" style={{ background: C.card, border: `1px solid ${i === 0 ? C.accentBorder : C.border}`, borderRadius: 14, padding: "12px 18px", textAlign: "center", minWidth: 100, animationDelay: `${i * 60}ms`, position: "relative", overflow: "hidden" }}>
            {i === 0 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C.accent }} />}
            <div style={{ fontSize: 18 }}>{i < 3 ? medals[i] : <span style={{ fontFamily: MN, fontSize: 13, color: C.textMuted }}>{i + 1}º</span>}</div>
            <div style={{ fontFamily: MN, fontSize: 14, fontWeight: 800, color: i === 0 ? C.accent : C.white, marginTop: 2 }}>{r.symbol}</div>
            <div style={{ fontSize: 9, color: C.textDim, marginTop: 1 }}>{r.shortName}</div>
            <div style={{ fontFamily: MN, fontSize: 15, fontWeight: 800, color: i === 0 ? C.accent : PAL[(i + 1) % PAL.length], marginTop: 4 }}>{r.wins}V <span style={{ fontSize: 10, fontWeight: 400, color: C.textMuted }}>{r.points}pts</span></div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <ResponsiveContainer width="100%" height={Math.max(160, ranked.length * 40)}>
          <BarChart data={ranked} layout="vertical" margin={{ left: 65, right: 20, top: 5, bottom: 5 }}>
            <XAxis type="number" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: MN }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="symbol" tick={{ fill: C.white, fontSize: 11, fontFamily: MN, fontWeight: 700 }} axisLine={false} tickLine={false} width={60} />
            <RTooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, fontFamily: MN, fontSize: 11, color: C.text }} formatter={(v) => [`${v} pts`]} />
            <Bar dataKey="points" radius={[0, 8, 8, 0]}>{ranked.map((r, i) => <Cell key={r.symbol} fill={i === 0 ? C.accent : PAL[(i + 1) % PAL.length]} fillOpacity={i === 0 ? 1 : 0.65} />)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {radarData.length >= 3 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: MN, marginBottom: 12, textAlign: "center" }}>Perfil Comparativo</div>
          <ResponsiveContainer width="100%" height={Math.min(380, Math.max(280, ranked.length * 55))}>
            <RadarChart data={radarData}><PolarGrid stroke={C.border} /><PolarAngleAxis dataKey="indicator" tick={{ fill: C.textDim, fontSize: 8, fontFamily: MN }} /><PolarRadiusAxis tick={false} domain={[0, 100]} axisLine={false} />
              {ranked.map((r, i) => <Radar key={r.symbol} name={r.symbol} dataKey={r.symbol} stroke={PAL[i % PAL.length]} fill={PAL[i % PAL.length]} fillOpacity={0.06} strokeWidth={2} />)}
              <Legend wrapperStyle={{ fontFamily: MN, fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "visible" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: MN }}>Tabela Comparativa — {indicators.length} Indicadores</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}`, textAlign: "left", fontFamily: MN, fontSize: 9, color: C.textMuted, textTransform: "uppercase", minWidth: 150, background: C.card }}>Indicador</th>
                <th style={{ padding: "10px 6px", borderBottom: `1px solid ${C.border}`, textAlign: "center", fontFamily: MN, fontSize: 9, color: C.textMuted }}>Unid.</th>
                <th style={{ padding: "10px 6px", borderBottom: `1px solid ${C.border}`, textAlign: "center", fontFamily: MN, fontSize: 9, color: C.textMuted }}>Crit.</th>
                {ranked.map((r, i) => <th key={r.symbol} style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}`, textAlign: "right", fontFamily: MN, fontSize: 11, color: PAL[i % PAL.length], fontWeight: 700 }}>{i === 0 ? "🏆 " : ""}{r.symbol}</th>)}
                <th style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}`, textAlign: "center", fontFamily: MN, fontSize: 9, color: C.textMuted }}>Melhor</th>
              </tr>
            </thead>
            <tbody>
              {indicators.map((ind) => {
                const vals = ranked.map((r) => ({ sym: r.symbol, val: r[ind.key] })).filter((x) => x.val != null && !isNaN(x.val));
                let bestSym = null;
                if (vals.length >= 2) { bestSym = ind.dir === "lower" ? vals.reduce((a, b) => (a.val < b.val ? a : b)).sym : vals.reduce((a, b) => (a.val > b.val ? a : b)).sym; }
                return (
                  <tr key={ind.key}>
                    <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.text, background: C.card, position: "relative" }}>
                      <span style={{ display: "flex", alignItems: "center" }}>{ind.label}<InfoTip text={ind.tip} /></span>
                      <span style={{ fontSize: 8, color: C.textMuted }}>{ind.src}</span>
                    </td>
                    <td style={{ padding: "9px 6px", borderBottom: `1px solid ${C.border}`, textAlign: "center", fontSize: 9, color: C.textMuted, fontFamily: MN }}>{ind.unit}</td>
                    <td style={{ padding: "9px 6px", borderBottom: `1px solid ${C.border}`, textAlign: "center", fontSize: 9, color: C.textMuted, fontFamily: MN }}>{ind.dir === "lower" ? "↓" : "↑"}</td>
                    {ranked.map((r) => { const v = r[ind.key]; const best = r.symbol === bestSym; return <td key={r.symbol} style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, textAlign: "right", fontFamily: MN, fontSize: 11, color: best ? C.accent : C.text, fontWeight: best ? 700 : 400, background: best ? `${C.accent}08` : "transparent" }}>{fmtInd(v, ind.fmt)}</td>; })}
                    <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.border}`, textAlign: "center", fontFamily: MN, fontSize: 10, fontWeight: 700, color: C.accent }}>{bestSym || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ComparatorPage({ db, indicators, assetLabel, searchPlaceholder, shortcuts, onSearch }) {
  const [selected, setSelected] = useState([]);
  const [sectorLock, setSectorLock] = useState(null);
  const addAsset = (sym) => { if (selected.includes(sym)) return; const a = db[sym]; if (!a) return; if (selected.length === 0) { setSectorLock(a.sector); setSelected([sym]); } else { setSelected((p) => [...p, sym]); } if (onSearch) onSearch(sym); };
  const removeAsset = (sym) => { const next = selected.filter((s) => s !== sym); setSelected(next); if (next.length === 0) setSectorLock(null); };
  const resetAll = () => { setSelected([]); setSectorLock(null); };
  const ranked = useMemo(() => (selected.length >= 2 ? rankAll(selected, db, indicators) : []), [selected]);

  return (
    <div>
      {sectorLock && (
        <div className="fu" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 16px", background: `${C.accent}08`, border: `1px solid ${C.accent}20`, borderRadius: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14 }}>🔒</span>
          <span style={{ fontSize: 12, color: C.accent, fontFamily: MN, fontWeight: 600 }}>{sectorLock}</span>
          <span style={{ fontSize: 11, color: C.textDim }}>— apenas {assetLabel}s deste segmento</span>
          <button onClick={resetAll} style={{ marginLeft: "auto", padding: "5px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: MN, cursor: "pointer", background: `${C.red}15`, color: C.red, border: `1px solid ${C.red}30` }}>Limpar</button>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
        {selected.map((sym, i) => (
          <div key={sym} className="fu" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, animationDelay: `${i * 50}ms` }}>
            <span style={{ fontFamily: MN, fontSize: 12, fontWeight: 700, color: PAL[i % PAL.length], minWidth: 22 }}>{i + 1}.</span>
            <span style={{ fontFamily: MN, fontWeight: 700, color: C.white, fontSize: 13 }}>{sym}</span>
            <span style={{ color: C.textDim, fontSize: 11, flex: 1 }}>{db[sym]?.shortName}</span>
            <span style={{ fontFamily: MN, fontSize: 11, color: C.textDim }}>{fmtBRL(db[sym]?.regularMarketPrice)}</span>
            <button onClick={() => removeAsset(sym)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 2px" }} onMouseEnter={(e) => { e.target.style.color = C.red; }} onMouseLeave={(e) => { e.target.style.color = C.textMuted; }}>×</button>
          </div>
        ))}
        <InlineSearch index={selected.length} onSelect={addAsset} sectorLock={sectorLock} selected={selected} db={db} placeholder={selected.length === 0 ? searchPlaceholder : sectorLock ? `Adicionar ${selected.length + 1}º ${assetLabel} de ${sectorLock}...` : `Buscar...`} />
      </div>
      {selected.length === 1 && <div style={{ textAlign: "center", padding: 20, color: C.textDim, fontSize: 13 }}>Adicione o 2º {assetLabel} de <strong style={{ color: C.white }}>{sectorLock}</strong> para comparar</div>}
      {selected.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px 20px" }}>
          <div style={{ fontSize: 42, marginBottom: 10 }}>⚔️</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 8 }}>Comparador de {assetLabel}s</div>
          <div style={{ fontSize: 13, color: C.textDim, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            Busque o primeiro {assetLabel}. O segmento trava e você adiciona quantos quiser. Sistema compara <strong style={{ color: C.accent }}>{indicators.length} indicadores</strong> e ranqueia do melhor ao pior.
          </div>
          {shortcuts && <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>{shortcuts.map((s) => (
            <button key={s} onClick={() => { const first = Object.values(db).find((a) => a.sector === s); if (first) addAsset(first.symbol); }}
              style={{ padding: "6px 14px", borderRadius: 8, fontSize: 11, fontFamily: MN, cursor: "pointer", background: C.cardAlt, color: C.textDim, border: `1px solid ${C.border}`, transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accentBorder; e.currentTarget.style.color = C.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}>{s}</button>
          ))}</div>}
        </div>
      )}
      {ranked.length >= 2 && <RankingResults ranked={ranked} selected={selected} indicators={indicators} label={assetLabel} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("loading");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("acoes");
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await storageGet("session");
      if (session?.loggedIn) {
        const users = (await storageGet("users")) || {};
        const u = users[session.cpf];
        if (u) { setUser(u); setScreen("app"); return; }
      }
      setScreen("login");
    })();
  }, []);

  const handleLogout = async () => {
    await storageSet("session", { loggedIn: false });
    setUser(null);
    setScreen("login");
    setShowAdmin(false);
  };

  const trackSearch = async (sym) => {
    if (!user) return;
    const users = (await storageGet("users")) || {};
    const u = users[user.cpf];
    if (u) {
      u.searches = u.searches || [];
      u.searches.push(sym);
      users[user.cpf] = u;
      await storageSet("users", users);
    }
  };

  if (screen === "loading") {
    return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, border: `2.5px solid ${C.border}`, borderTop: `2.5px solid ${C.accent}`, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    </div>;
  }

  if (screen === "register") {
    return <RegisterScreen onRegistered={(u) => { setUser(u); setScreen("app"); }} onGoLogin={() => setScreen("login")} />;
  }

  if (screen === "login") {
    return <LoginScreen onLoggedIn={(u) => { setUser(u); setScreen("app"); }} onGoRegister={() => setScreen("register")} />;
  }

  if (showAdmin && user?.isAdmin) {
    return (
      <div style={{ fontFamily: FN, background: C.bg, color: C.text, minHeight: "100vh" }}>
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}` }}>
          <h1 style={{ fontFamily: MN, fontSize: 24, fontWeight: 800, color: C.white, margin: 0 }}>compar<span style={{ color: C.accent }}>.</span>ai</h1>
        </div>
        <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto" }}>
          <AdminDashboard onBack={() => setShowAdmin(false)} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FN, background: C.bg, color: C.text, minHeight: "100vh" }}>
      <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg, rgba(0,229,160,0.03) 0%, transparent 100%)` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: MN, fontSize: 24, fontWeight: 800, color: C.white, margin: 0 }}>compar<span style={{ color: C.accent }}>.</span>ai</h1>
            <p style={{ color: C.textDim, fontSize: 12, margin: "4px 0 0" }}>Olá, {user?.nome}!</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {user?.isAdmin && (
              <button onClick={() => setShowAdmin(true)} style={{ padding: "8px 16px", borderRadius: 10, fontSize: 11, fontWeight: 600, fontFamily: MN, cursor: "pointer", background: `${C.purple}15`, color: C.purple, border: `1px solid ${C.purple}30` }}>
                🔐 Admin
              </button>
            )}
            <button onClick={handleLogout} style={{ padding: "8px 16px", borderRadius: 10, fontSize: 11, fontWeight: 600, fontFamily: MN, cursor: "pointer", background: C.cardAlt, color: C.textDim, border: `1px solid ${C.border}` }}>
              Sair
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, marginTop: 16 }}>
          {[
            { id: "acoes", label: "📈 Ações", desc: "12 ind. R2A" },
            { id: "fiis", label: "🏢 FIIs", desc: "11 indicadores" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "11px 20px", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? C.accent : C.textDim, background: "transparent", border: "none", borderBottom: tab === t.id ? `2px solid ${C.accent}` : "2px solid transparent", cursor: "pointer", fontFamily: FN, transition: "all 0.2s" }}>
              {t.label} <span style={{ fontSize: 10, color: C.textMuted }}>({t.desc})</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 28px", maxWidth: 960, margin: "0 auto" }}>
        {tab === "acoes" && <ComparatorPage db={DB_A} indicators={IND_ACOES} assetLabel="ação" searchPlaceholder="Buscar ação... (ex: ITUB4, Petrobras)" shortcuts={["Financeiro", "Energia Elétrica", "Consumo", "Mineração / Siderurgia", "Saúde"]} onSearch={trackSearch} />}
        {tab === "fiis" && <ComparatorPage db={DB_F} indicators={IND_FIIS} assetLabel="FII" searchPlaceholder="Buscar FII... (ex: HGLG11, MXRF11)" shortcuts={["Tijolo — Logística", "Tijolo — Shopping", "Tijolo — Lajes Corp.", "Papel — CRI", "Híbrido / FOF"]} onSearch={trackSearch} />}
      </div>

      <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, textAlign: "center", fontSize: 10, color: C.textMuted, fontFamily: MN }}>
        compar.ai v2.0 — Cadastro + Login + LGPD + Admin Dashboard + Comparador R2A
      </div>
    </div>
  );
}
