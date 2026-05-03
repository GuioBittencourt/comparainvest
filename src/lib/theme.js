export const C = {
  // Base Comparainvest v19 — fintech intuitiva + private banking institucional
  // Inspiração: navegação simples tipo Inter + sobriedade Safra.
  bg: "#061019",
  bgSoft: "#081522",
  bgDeep: "#02070D",
  surface: "#0A1624",
  surface2: "#0E1B2B",
  card: "rgba(9, 20, 32, 0.94)",
  cardAlt: "rgba(13, 27, 43, 0.92)",
  cardElevated: "rgba(15, 31, 48, 0.98)",

  // Safra-inspired accents: azul profundo, dourado sutil e verde de resultado.
  navy: "#081B33",
  navy2: "#102A45",
  royal: "#123A63",
  gold: "#C8A45D",
  gold2: "#E0C47A",
  silver: "#D8DEE8",
  ivory: "#F5F2EA",

  // Bordas institucionais — menos neon, mais fosco.
  border: "rgba(216, 222, 232, 0.075)",
  borderLight: "rgba(216, 222, 232, 0.130)",
  borderGold: "rgba(200, 164, 93, 0.26)",
  borderBlue: "rgba(76, 139, 197, 0.26)",

  // Verde marca/resultado — usado com parcimônia.
  accent: "#13B981",
  accent2: "#35D39A",
  accentDim: "rgba(19, 185, 129, 0.065)",
  accentBorder: "rgba(19, 185, 129, 0.18)",
  accentGlow: "rgba(19, 185, 129, 0.10)",

  // Cores funcionais para gráficos/status.
  blue: "#3D83E6",
  blueSoft: "#63A5F4",
  petroleum: "#2D718A",
  purple: "#7C6BFF",
  pink: "#C08497",
  orange: "#C8782B",
  yellow: "#C8A45D",
  green: "#22A06B",
  red: "#E36B6B",
  graphite: "#64748B",
  slate: "#9AA8BA",

  // Texto
  text: "rgba(235, 241, 248, 0.88)",
  textDim: "rgba(199, 211, 224, 0.66)",
  textMuted: "rgba(148, 163, 184, 0.48)",
  white: "#F8FAFC",
};

// Paleta de gráficos: institucional, com contraste e sem excesso neon.
export const PAL = [C.blue, C.accent, C.gold, C.petroleum, C.purple, C.graphite, C.pink, C.slate];
export const CHART = {
  male: C.blue,
  female: C.pink,
  other: C.purple,
  neutral: C.graphite,
  nd: C.slate,
};

export const FN = "'Inter', 'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
export const MN = "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace";
export const SERIF = "'DM Serif Display', Georgia, 'Times New Roman', serif";
export const TN = FN;

export const WA_FINANCEIRO = "https://wa.me/5512988890312?text=Ol%C3%A1%20vim%20pelo%20comparainvest.%20Quero%20meu%20Diagn%C3%B3stico%20Financeiro";
export const WA_RIQUEZA = "https://wa.me/5512988890312?text=Ol%C3%A1%20vim%20pelo%20comparainvest.%20Quero%20meu%20Diagn%C3%B3stico%20da%20Riqueza!%20";

export const glassPanel = {
  background: "linear-gradient(180deg, rgba(12, 28, 45, 0.94), rgba(6, 16, 25, 0.96))",
  border: `1px solid ${C.borderLight}`,
  boxShadow: "0 22px 70px rgba(0,0,0,0.34)",
};

export const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  background: "rgba(13, 27, 43, 0.88)",
  border: `1px solid ${C.border}`,
  borderRadius: 13,
  color: C.text,
  fontSize: 14,
  fontFamily: FN,
  outline: "none",
  boxSizing: "border-box",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)",
};

export const labelStyle = {
  fontSize: 11,
  color: C.textDim,
  marginBottom: 6,
  display: "block",
  fontFamily: MN,
  fontWeight: 700,
  letterSpacing: "0.7px",
  textTransform: "uppercase",
};

export const btnPrimary = {
  width: "100%",
  padding: "12px 17px",
  minHeight: 44,
  background: "linear-gradient(135deg, #123A63 0%, #13B981 100%)",
  color: "#F8FAFC",
  border: "none",
  borderRadius: 14,
  fontSize: 14,
  fontWeight: 800,
  fontFamily: FN,
  cursor: "pointer",
  boxShadow: "0 16px 36px rgba(19,185,129,0.10)",
};

export const btnSecondary = {
  width: "100%",
  padding: "11px 16px",
  minHeight: 42,
  background: "rgba(255,255,255,0.026)",
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  fontSize: 13,
  color: C.textDim,
  fontFamily: FN,
  cursor: "pointer",
};

export const btnPurple = {
  width: "100%",
  padding: "11px 16px",
  minHeight: 42,
  background: "rgba(124,92,255,0.10)",
  border: `1px solid rgba(124,92,255,0.22)`,
  borderRadius: 14,
  fontSize: 14,
  color: "#C4B5FD",
  fontWeight: 700,
  fontFamily: FN,
  cursor: "pointer",
};

export const cardStyle = {
  background: "linear-gradient(180deg, rgba(11, 24, 38, 0.94), rgba(7, 16, 25, 0.94))",
  border: `1px solid ${C.border}`,
  borderRadius: 20,
  boxShadow: "0 18px 54px rgba(0,0,0,0.24)",
};

export const heroStyle = {
  fontFamily: FN,
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: "-0.45px",
  color: C.white,
  margin: 0,
  lineHeight: 1.16,
};

export const premiumButton = {
  padding: "11px 18px",
  minHeight: 42,
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg, #123A63 0%, #13B981 100%)",
  color: "#F8FAFC",
  fontSize: 13,
  fontWeight: 800,
  fontFamily: FN,
  cursor: "pointer",
  boxShadow: "0 16px 36px rgba(19,185,129,0.10)",
};


export const btnGradientBlue = {
  width: "100%",
  padding: "11px 16px",
  minHeight: 42,
  background: "linear-gradient(135deg, #081B33 0%, #123A63 54%, #13B981 100%)",
  color: "#F8FAFC",
  border: "none",
  borderRadius: 14,
  fontSize: 13,
  fontWeight: 800,
  fontFamily: FN,
  cursor: "pointer",
  boxShadow: "0 14px 34px rgba(18,58,99,0.20)",
};
