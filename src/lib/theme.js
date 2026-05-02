export const C = {
  // Base premium — azul petróleo, não preto puro
  bg: "#071018",
  bgSoft: "#09131D",
  card: "rgba(10,18,28,0.94)",
  cardAlt: "rgba(15,25,38,0.94)",
  cardElevated: "rgba(12,22,34,0.98)",

  // Bordas sutis e foscas
  border: "rgba(255,255,255,0.060)",
  borderLight: "rgba(255,255,255,0.100)",

  // Verde marca refinado: continua forte, mas menos neon/gamer
  accent: "#10B981",
  accent2: "#34D399",
  accentDim: "rgba(16,185,129,0.070)",
  accentBorder: "rgba(16,185,129,0.160)",
  accentGlow: "rgba(16,185,129,0.090)",

  // Cores institucionais para gráficos e status
  blue: "#3B82F6",
  petroleum: "#256D85",
  purple: "#7C5CFF",
  pink: "#C08497",
  orange: "#D97706",
  yellow: "#D6A536",
  green: "#22A06B",
  red: "#E26D6D",
  graphite: "#64748B",
  slate: "#94A3B8",

  // Texto
  text: "rgba(235,241,248,0.88)",
  textDim: "rgba(199,211,224,0.64)",
  textMuted: "rgba(148,163,184,0.46)",
  white: "#F8FAFC",
};

// Paleta de gráficos: mais corretora/institucional, menos neon monocromático.
export const PAL = [C.blue, C.accent, C.purple, C.yellow, C.graphite, C.pink, C.petroleum, C.slate];
export const CHART = {
  male: C.blue,
  female: C.pink,
  other: C.purple,
  neutral: C.graphite,
  nd: C.slate,
};

export const FN = "'Inter', 'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
export const MN = "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace";
// SERIF: usada APENAS em destaques especiais (ex: nome da filosofia em PhilosophyResult).
// Para títulos padrão de tela, use heroStyle (que aponta pra FN/Inter).
export const SERIF = "'DM Serif Display', Georgia, 'Times New Roman', serif";
// TN é mantido para retrocompatibilidade com componentes antigos que ainda referenciam.
// Novos códigos devem usar heroStyle (h2/título de tela) ou SERIF (destaque especial).
export const TN = FN;

export const WA_FINANCEIRO = "https://wa.me/5512988890312?text=Ol%C3%A1%20vim%20pelo%20comparainvest.%20Quero%20meu%20Diagn%C3%B3stico%20Financeiro";
export const WA_RIQUEZA = "https://wa.me/5512988890312?text=Ol%C3%A1%20vim%20pelo%20comparainvest.%20Quero%20meu%20Diagn%C3%B3stico%20da%20Riqueza!%20";

export const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  background: C.cardAlt,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  color: C.text,
  fontSize: 14,
  fontFamily: FN,
  outline: "none",
  boxSizing: "border-box",
};

export const labelStyle = {
  fontSize: 11,
  color: C.textDim,
  marginBottom: 6,
  display: "block",
  fontFamily: FN,
  fontWeight: 600,
};

export const btnPrimary = {
  width: "100%",
  padding: "12px 16px",
  minHeight: 46,
  background: "linear-gradient(135deg, #10B981 0%, #178A8A 100%)",
  color: "#06110C",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 14,
  fontSize: 14,
  fontWeight: 750,
  fontFamily: FN,
  cursor: "pointer",
  boxShadow: "0 14px 32px rgba(16,185,129,0.10)",
};

export const btnSecondary = {
  width: "100%",
  padding: "11px 16px",
  minHeight: 40,
  background: "rgba(255,255,255,0.025)",
  border: `1px solid ${C.border}`,
  borderRadius: 13,
  fontSize: 13,
  color: C.textDim,
  fontFamily: FN,
  cursor: "pointer",
};

export const btnPurple = {
  width: "100%",
  padding: "11px 16px",
  minHeight: 42,
  background: "rgba(124,92,255,0.11)",
  border: `1px solid rgba(124,92,255,0.24)`,
  borderRadius: 13,
  fontSize: 14,
  color: "#C4B5FD",
  fontWeight: 700,
  fontFamily: FN,
  cursor: "pointer",
};

export const cardStyle = {
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 18,
  boxShadow: "0 10px 40px rgba(0,0,0,0.22)",
};

// Hero style — pra títulos grandes em telas (Carteira, Comparar, etc)
// Hierarquia leve: pesa mais que body, mas não vira "negritão redondo"
export const heroStyle = {
  fontFamily: FN,
  fontSize: 26,
  fontWeight: 600,
  letterSpacing: "-0.3px",
  color: C.white,
  margin: 0,
  lineHeight: 1.2,
};

export const premiumButton = {
  padding: "11px 17px",
  minHeight: 42,
  borderRadius: 13,
  border: "1px solid rgba(255,255,255,0.07)",
  background: "linear-gradient(135deg, #10B981 0%, #178A8A 100%)",
  color: "#06110C",
  fontSize: 13,
  fontWeight: 750,
  fontFamily: FN,
  cursor: "pointer",
  boxShadow: "0 12px 30px rgba(16,185,129,0.09)",
};


// V18.3 — padrões institucionais premium.
export const diagnosticCardStyle = {
  background: "linear-gradient(135deg, rgba(30,90,150,0.15), rgba(10,18,28,0.96) 60%)",
  border: "1px solid rgba(59,130,246,0.24)",
  borderLeft: "2px solid rgba(59,130,246,0.78)",
  borderRadius: 14,
  boxShadow: "0 16px 42px rgba(0,0,0,0.20)",
};

export const premiumNoticeStyle = {
  background: "linear-gradient(135deg, rgba(226,109,109,0.09), rgba(10,18,28,0.96) 62%)",
  border: "1px solid rgba(226,109,109,0.22)",
  borderLeft: "2px solid rgba(226,109,109,0.80)",
  borderRadius: 12,
};

export const moneyCompactStyle = {
  fontFamily: FN,
  fontWeight: 700,
  letterSpacing: "-0.025em",
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
};


// V18.4 — botões institucionais premium e navegação refinada.
export const btnGradient = {
  width: "100%",
  minHeight: 48,
  padding: "13px 18px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(135deg, #10B981 0%, #178A8A 100%)",
  color: "#06110C",
  fontSize: 15,
  fontWeight: 750,
  fontFamily: FN,
  cursor: "pointer",
  boxShadow: "0 16px 36px rgba(16,185,129,0.10)",
};

export const btnGradientBlue = {
  ...btnGradient,
  background: "linear-gradient(135deg, #2563EB 0%, #1D8AA6 100%)",
  color: "#F8FAFC",
  boxShadow: "0 16px 36px rgba(37,99,235,0.12)",
};

export const btnGradientAmber = {
  ...btnGradient,
  background: "linear-gradient(135deg, #D97706 0%, #A45309 100%)",
  color: "#FFF7ED",
  boxShadow: "0 16px 36px rgba(217,119,6,0.12)",
};

export const premiumScreenShell = {
  background: "radial-gradient(circle at top, rgba(37,99,235,0.13), transparent 34%), linear-gradient(180deg, rgba(7,16,24,0.98), rgba(4,8,14,0.99))",
  border: "1px solid rgba(255,255,255,0.10)",
};
