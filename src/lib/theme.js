export const C = {
  // Base premium — azul petróleo, não preto puro
  bg: "#071018",
  bgSoft: "#09131D",
  card: "rgba(10,18,28,0.92)",
  cardAlt: "rgba(16,27,40,0.92)",
  cardElevated: "rgba(13,24,36,0.96)",

  // Bordas sutis
  border: "rgba(255,255,255,0.065)",
  borderLight: "rgba(255,255,255,0.105)",

  // Verde marca refinado
  accent: "#00D47E",
  accent2: "#19E58F",
  accentDim: "rgba(0,212,126,0.075)",
  accentBorder: "rgba(0,212,126,0.18)",
  accentGlow: "rgba(0,212,126,0.10)",

  // Funcionais
  yellow: "#EAB308",
  red: "#F87171",
  green: "#34D399",
  blue: "#38BDF8",
  purple: "#8B5CF6",
  pink: "#EC4899",
  orange: "#FB923C",

  // Texto
  text: "rgba(235,241,248,0.88)",
  textDim: "rgba(199,211,224,0.62)",
  textMuted: "rgba(148,163,184,0.44)",
  white: "#F8FAFC",
};

// Paleta para gráficos — poucos tons, alto contraste e sem aspecto infantil
export const PAL = [C.blue, C.accent, C.orange, C.purple, C.pink, "#94A3B8", "#64748B", "#CBD5E1"];

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
  padding: "12px 16px",
  minHeight: 44,
  background: "linear-gradient(180deg, #19D97C, #11B866)",
  color: "#06110C",
  border: "none",
  borderRadius: 14,
  fontSize: 14,
  fontWeight: 700,
  fontFamily: FN,
  cursor: "pointer",
  boxShadow: "0 10px 28px rgba(0,212,126,0.14)",
};

export const btnSecondary = {
  width: "100%",
  padding: "11px 16px",
  minHeight: 42,
  background: "rgba(255,255,255,0.025)",
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  fontSize: 13,
  color: C.textDim,
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
  padding: "11px 18px",
  minHeight: 42,
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(180deg, #19D97C, #11B866)",
  color: "#06110C",
  fontSize: 13,
  fontWeight: 700,
  fontFamily: FN,
  cursor: "pointer",
  boxShadow: "0 10px 28px rgba(0,212,126,0.14)",
};
