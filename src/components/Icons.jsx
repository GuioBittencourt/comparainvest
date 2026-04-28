"use client";

// ═══════════════════════════════════════════════════════════════
// ICON SYSTEM — Monochromatic line art, uses currentColor
// Usage: <Icon size={24} /> inherits color from parent
// ═══════════════════════════════════════════════════════════════

const S = { display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const sv = (size, children) => (
  <span style={S}><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg></span>
);

// ═══════════════════════════════════════════════════
// FILOSOFIAS
// ═══════════════════════════════════════════════════
export function IconGuardiao({ size = 24 }) {
  return sv(size, <><path d="M12 3L4 7V12C4 16.4 7.4 20.3 12 21.4C16.6 20.3 20 16.4 20 12V7L12 3Z" /><path d="M12 8V13" /><circle cx="12" cy="15.5" r="0.5" fill="currentColor" stroke="none" /></>);
}

export function IconEstrategista({ size = 24 }) {
  return sv(size, <><path d="M12 3V21" /><path d="M3 12H6" /><path d="M18 12H21" /><circle cx="12" cy="12" r="6" /><path d="M8.5 8.5L12 12L15.5 8.5" /></>);
}

export function IconEsparta({ size = 24 }) {
  return sv(size, <><path d="M6 3L18 21" /><path d="M18 3L6 21" /><circle cx="12" cy="12" r="3" /></>);
}

export function IconConquistador({ size = 24 }) {
  return sv(size, <><path d="M12 2L14.5 9H21L15.5 13.5L17.5 21L12 17L6.5 21L8.5 13.5L3 9H9.5L12 2Z" /></>);
}

export function IconVisionario({ size = 24 }) {
  return sv(size, <><path d="M12 2C10 6 8 10 8 14C8 18.4 9.8 20 12 20C14.2 20 16 18.4 16 14C16 10 14 6 12 2Z" /><path d="M10 14C10 12 12 10 12 8" /></>);
}

// ═══════════════════════════════════════════════════
// NAVIGATION & GENERAL
// ═══════════════════════════════════════════════════
export function IconHome({ size = 24 }) {
  return sv(size, <><path d="M3 10.5L12 3L21 10.5" /><path d="M5 10V19C5 19.6 5.4 20 6 20H18C18.6 20 19 19.6 19 19V10" /></>);
}

export function IconCompare({ size = 24 }) {
  return sv(size, <><path d="M8 4L4 8L8 12" /><path d="M4 8H16" /><path d="M16 12L20 16L16 20" /><path d="M20 16H8" /></>);
}

export function IconAcoes({ size = 24 }) {
  return sv(size, <><path d="M3 20L8 14L13 17L21 6" /><path d="M17 6H21V10" /></>);
}

export function IconFIIs({ size = 24 }) {
  return sv(size, <><rect x="3" y="10" width="7" height="11" rx="1" /><rect x="14" y="4" width="7" height="17" rx="1" /><path d="M6 14H7" /><path d="M6 17H7" /><path d="M17 8H18" /><path d="M17 11H18" /><path d="M17 14H18" /></>);
}

export function IconRendaFixa({ size = 24 }) {
  return sv(size, <><rect x="3" y="10" width="18" height="11" rx="2" /><path d="M7 10V7C7 4.8 9.2 3 12 3C14.8 3 17 4.8 17 7V10" /><circle cx="12" cy="16" r="2" /></>);
}

export function IconCarteira({ size = 24 }) {
  return sv(size, <><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M16 12H22V16H16C14.9 16 14 15.1 14 14C14 12.9 14.9 12 16 12Z" /></>);
}

export function IconCripto({ size = 24 }) {
  return sv(size, <><path d="M9 8H15C16.7 8 18 9.3 18 11C18 12.7 16.7 14 15 14H9V8Z" /><path d="M9 14H15C16.7 14 18 15.3 18 17H9V14Z" /><path d="M12 5V8" /><path d="M12 17V20" /><path d="M7 8H9" /><path d="M7 14H9" /><path d="M7 17H9" /></>);
}

export function IconNegocio({ size = 24 }) {
  return sv(size, <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" /><path d="M12 11V17" /><path d="M9 14H15" /></>);
}

export function IconStar({ size = 24 }) {
  return sv(size, <><path d="M12 2L15 8.5L22 9.3L17 14L18.2 21L12 17.8L5.8 21L7 14L2 9.3L9 8.5L12 2Z" /></>);
}

export function IconLock({ size = 24 }) {
  return sv(size, <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" /></>);
}

// ═══════════════════════════════════════════════════
// QUIZ — OCUPAÇÃO
// ═══════════════════════════════════════════════════
export function IconPublico({ size = 24 }) {
  return sv(size, <><path d="M3 21H21" /><path d="M5 21V11L12 5L19 11V21" /><path d="M9 21V15H15V21" /><path d="M10 8H14" /></>);
}

export function IconCLT({ size = 24 }) {
  return sv(size, <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 8H15" /><path d="M9 12H15" /><path d="M9 16H12" /></>);
}

export function IconAutonomo({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="8" r="4" /><path d="M12 12V16" /><path d="M8 20H16" /><path d="M12 16L8 20" /><path d="M12 16L16 20" /></>);
}

export function IconEstudante({ size = 24 }) {
  return sv(size, <><path d="M2 10L12 5L22 10L12 15L2 10Z" /><path d="M6 12V18L12 21L18 18V12" /></>);
}

// ═══════════════════════════════════════════════════
// QUIZ — REAÇÃO A PERDAS
// ═══════════════════════════════════════════════════
export function IconVendeTudo({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="12" r="9" /><path d="M8 15C8 15 9 13 12 13C15 13 16 15 16 15" /><path d="M9 9V10" /><path d="M15 9V10" /></>);
}

export function IconVendeParte({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="12" r="9" /><path d="M8 14H16" /><path d="M9 9V10" /><path d="M15 9V10" /></>);
}

export function IconEspera({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="12" r="9" /><path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" /><path d="M9 9.5H9.01" /><path d="M15 9.5H15.01" /></>);
}

export function IconCompraMais({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="12" r="9" /><path d="M8 13C8 13 9.5 16 12 16C14.5 16 16 13 16 13" /><path d="M8.5 9L10 10.5" /><path d="M15.5 9L14 10.5" /></>);
}

// ═══════════════════════════════════════════════════
// QUIZ — OBJETIVO
// ═══════════════════════════════════════════════════
export function IconProteger({ size = 24 }) {
  return sv(size, <><path d="M12 3L4 7V12C4 16.4 7.4 20.3 12 21.4C16.6 20.3 20 16.4 20 12V7L12 3Z" /></>);
}

export function IconRendaPassiva({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="12" r="8" /><path d="M12 8V12L15 14" /></>);
}

export function IconCrescer({ size = 24 }) {
  return sv(size, <><path d="M3 20L8 14L13 17L21 6" /><path d="M17 6H21V10" /></>);
}

export function IconAgressivo({ size = 24 }) {
  return sv(size, <><path d="M12 2L15 12H20L13 18L16 22L12 19L8 22L11 18L4 12H9L12 2Z" /></>);
}

// ═══════════════════════════════════════════════════
// QUIZ — PLANOS
// ═══════════════════════════════════════════════════
export function IconReserva({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="12" r="9" /><path d="M12 8V16" /><path d="M8 12H16" /></>);
}

export function IconViagem({ size = 24 }) {
  return sv(size, <><path d="M2 17L12 7L17 12" /><path d="M17 12L22 7" /><path d="M14.5 9.5L17 3" /><path d="M2 17H22" /></>);
}

export function IconCarro({ size = 24 }) {
  return sv(size, <><path d="M5 17H19" /><path d="M5 17L3 13H21L19 17" /><path d="M6 13L8 8H16L18 13" /><circle cx="7" cy="17" r="1.5" /><circle cx="17" cy="17" r="1.5" /></>);
}

export function IconImovel({ size = 24 }) {
  return sv(size, <><path d="M3 21H21" /><path d="M5 21V7L12 3L19 7V21" /><rect x="9" y="13" width="6" height="8" /></>);
}

export function IconCasamento({ size = 24 }) {
  return sv(size, <><path d="M12 4L14 8L18 9L15 12L16 16L12 14L8 16L9 12L6 9L10 8L12 4Z" /></>);
}

export function IconFaculdade({ size = 24 }) {
  return sv(size, <><path d="M2 10L12 5L22 10L12 15L2 10Z" /><path d="M6 12V18L12 21L18 18V12" /></>);
}

export function IconAposentadoria({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="12" r="9" /><path d="M12 6V12H17" /></>);
}

export function IconIndependencia({ size = 24 }) {
  return sv(size, <><path d="M4 20L8 14" /><path d="M8 14L12 17" /><path d="M12 17L16 10" /><path d="M16 10L20 4" /><circle cx="20" cy="4" r="2" /></>);
}

// ═══════════════════════════════════════════════════
// QUIZ — APORTE
// ═══════════════════════════════════════════════════
export function IconDinheiro({ size = 24 }) {
  return sv(size, <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M6 12H6.01" /><path d="M18 12H18.01" /></>);
}

export function IconDiamante({ size = 24 }) {
  return sv(size, <><path d="M6 3H18L22 9L12 21L2 9L6 3Z" /><path d="M2 9H22" /><path d="M10 3L8 9L12 21" /><path d="M14 3L16 9L12 21" /></>);
}

export function IconTrofeu({ size = 24 }) {
  return sv(size, <><path d="M8 21H16" /><path d="M12 17V21" /><path d="M7 4H17V8C17 12 14.8 14 12 14C9.2 14 7 12 7 8V4Z" /><path d="M7 8H4C4 11 5 12 7 12" /><path d="M17 8H20C20 11 19 12 17 12" /></>);
}

// ═══════════════════════════════════════════════════
// QUIZ — EXPERIÊNCIA
// ═══════════════════════════════════════════════════
export function IconIniciante({ size = 24 }) {
  return sv(size, <><path d="M12 18C12 18 6 14 6 8L12 4L18 8C18 14 12 18 12 18Z" /><path d="M12 10V14" /></>);
}

export function IconIntermediario({ size = 24 }) {
  return sv(size, <><rect x="3" y="14" width="4" height="7" /><rect x="10" y="10" width="4" height="11" /><rect x="17" y="6" width="4" height="15" /></>);
}

// ═══════════════════════════════════════════════════
// GESTÃO ATIVA — CATEGORIAS
// ═══════════════════════════════════════════════════
export function IconMercado({ size = 24 }) {
  return sv(size, <><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /><path d="M3 3H5L7 15H19L21 7H7" /></>);
}

export function IconTransporte({ size = 24 }) {
  return sv(size, <><path d="M3 16L7 6H12L16 16" /><path d="M3 16H16" /><circle cx="6" cy="19" r="2" /><circle cx="13" cy="19" r="2" /><path d="M18 10H22V16H16" /></>);
}

export function IconDiversao({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="12" r="9" /><path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" /><path d="M9 9H9.01" /><path d="M15 9H15.01" /></>);
}

export function IconSaude({ size = 24 }) {
  return sv(size, <><path d="M9 3H15V8H20V14H15V19H9V14H4V8H9V3Z" /></>);
}

export function IconPets({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="16" r="4" /><circle cx="7" cy="8" r="2" /><circle cx="17" cy="8" r="2" /><circle cx="5" cy="13" r="1.5" /><circle cx="19" cy="13" r="1.5" /></>);
}

export function IconCursos({ size = 24 }) {
  return sv(size, <><path d="M4 4H16C17.1 4 18 4.9 18 6V18C18 19.1 17.1 20 16 20H4V4Z" /><path d="M18 4H20V20H18" /><path d="M8 8H14" /><path d="M8 12H14" /><path d="M8 16H11" /></>);
}

export function IconOutros({ size = 24 }) {
  return sv(size, <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="16" cy="16" r="1" fill="currentColor" stroke="none" /></>);
}

export function IconPin({ size = 24 }) {
  return sv(size, <><path d="M12 2C8.1 2 5 5.1 5 9C5 14.2 12 22 12 22C12 22 19 14.2 19 9C19 5.1 15.9 2 12 2Z" /><circle cx="12" cy="9" r="2.5" /></>);
}

// ═══════════════════════════════════════════════════
// MISC
// ═══════════════════════════════════════════════════
export function IconMedal1({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="14" r="6" /><path d="M9 3H15L13 8H11L9 3Z" /><path d="M12 11V17" /><path d="M9 14H15" /></>);
}

export function IconMedal2({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="14" r="6" /><path d="M9 3H15L13 8H11L9 3Z" /><path d="M10 12L14 12" /><path d="M14 12L10 16H14" /></>);
}

export function IconMedal3({ size = 24 }) {
  return sv(size, <><circle cx="12" cy="14" r="6" /><path d="M9 3H15L13 8H11L9 3Z" /><path d="M10 11H14L12 14H14L10 17" /></>);
}

export function IconCheck({ size = 24 }) {
  return sv(size, <><path d="M5 12L10 17L20 7" /></>);
}

export function IconUsers({ size = 24 }) {
  return sv(size, <><circle cx="9" cy="7" r="3" /><path d="M3 21V17C3 15.3 4.3 14 6 14H12C13.7 14 15 15.3 15 17V21" /><circle cx="18" cy="8" r="2.5" /><path d="M18 14C19.7 14 21 15.3 21 17V21" /></>);
}

export function IconCalendar({ size = 24 }) {
  return sv(size, <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2V6" /><path d="M16 2V6" /><path d="M3 10H21" /></>);
}

export function IconSearch({ size = 24 }) {
  return sv(size, <><circle cx="10" cy="10" r="6" /><path d="M21 21L15 15" /></>);
}

export function IconPhone({ size = 24 }) {
  return sv(size, <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 18H14" /></>);
}

export function IconMessage({ size = 24 }) {
  return sv(size, <><path d="M4 4H20C21.1 4 22 4.9 22 6V16C22 17.1 21.1 18 20 18H8L4 22V6C4 4.9 4.9 4 6 4Z" /></>);
}

export function IconDownload({ size = 24 }) {
  return sv(size, <><path d="M12 3V15" /><path d="M8 11L12 15L16 11" /><path d="M4 19H20" /></>);
}

export function IconBolt({ size = 24 }) {
  return sv(size, <><path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" /></>);
}

export function IconTip({ size = 24 }) {
  return sv(size, <><path d="M9 18H15" /><path d="M10 21H14" /><path d="M12 2C8.1 2 5 5.1 5 9C5 12 7 14 8 15H16C17 14 19 12 19 9C19 5.1 15.9 2 12 2Z" /></>);
}

export function IconDoc({ size = 24 }) {
  return sv(size, <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6H16" /><path d="M8 10H16" /><path d="M8 14H12" /></>);
}

export function IconBriefcase({ size = 24 }) {
  return sv(size, <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" /></>);
}

export function IconBrain({ size = 24 }) {
  return sv(size, <><path d="M12 2C9 2 7 4.5 7 7C5 7 3 9 3 12C3 14.5 5 16.5 7 17V22H17V17C19 16.5 21 14.5 21 12C21 9 19 7 17 7C17 4.5 15 2 12 2Z" /><path d="M12 7V17" /></>);
}

// ═══════════════════════════════════════════════════
// LOGO
// ═══════════════════════════════════════════════════
export function LogoSymbol({ size = 24, color = "#00E5A0" }) {
  return (
    <span style={S}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18H20" />
        <rect x="5" y="12" width="2.5" height="6" rx="1" />
        <rect x="10.5" y="9" width="2.5" height="9" rx="1" />
        <rect x="16" y="6" width="2.5" height="12" rx="1" />
        <path d="M6 13L12 9.5L17 7L21 4" />
        <path d="M21 4V7" />
        <path d="M21 4H18" />
      </svg>
    </span>
  );
}
