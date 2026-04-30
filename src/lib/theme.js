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
  padding: "11px 16px",
  minHeight: 42,
  background: "linear-gradient(180deg, #20C982, #0E9F6E)",
  color: "#06110C",
  border: "none",
  borderRadius: 13,
  fontSize: 14,
  fontWeight: 700,
  fontFamily: FN,
  cursor: "pointer",
  boxShadow: "0 10px 26px rgba(16,185,129,0.12)",
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
  boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
};

export const premiumButton = {
  padding: "10px 17px",
  minHeight: 40,
  borderRadius: 13,
  border: "none",
  background: "linear-gradient(180deg, #20C982, #0E9F6E)",
  color: "#06110C",
  fontSize: 13,
  fontWeight: 700,
  fontFamily: FN,
  cursor: "pointer",
  boxShadow: "0 10px 26px rgba(16,185,129,0.12)",
};
