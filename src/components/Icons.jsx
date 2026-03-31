export function IconAcoes({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16V10" />
      <path d="M9 16V8" />
      <path d="M14 16V6" />
      <path d="M4 16H20" />
      <path d="M6 12L10 9L14 7L20 4" />
      <path d="M20 4V8" />
      <path d="M20 4H16" />
    </svg>
  );
}

export function IconFIIs({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="6" height="12" />
      <rect x="14" y="4" width="6" height="16" />
      <circle cx="7" cy="12" r="0.5" fill={color} stroke="none" />
      <circle cx="7" cy="16" r="0.5" fill={color} stroke="none" />
      <circle cx="17" cy="8" r="0.5" fill={color} stroke="none" />
      <circle cx="17" cy="12" r="0.5" fill={color} stroke="none" />
    </svg>
  );
}

export function IconRendaFixa({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="10" width="18" height="10" rx="2" />
      <path d="M7 10V6H17V10" />
      <circle cx="12" cy="14" r="0.7" fill={color} stroke="none" />
    </svg>
  );
}

export function IconCarteira({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M16 12H21" />
      <circle cx="17" cy="14" r="1" fill={color} stroke="none" />
    </svg>
  );
}

export function IconComparar({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4L10 10" />
      <path d="M10 4L4 10" />
      <path d="M14 14L20 20" />
      <path d="M20 14L14 20" />
    </svg>
  );
}

export function IconHome({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10L12 3L21 10" />
      <path d="M5 10V20H19V10" />
    </svg>
  );
}

// FILOSOFIAS

export function IconGuardiao({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L19 6V12C19 17 15 20 12 21C9 20 5 17 5 12V6L12 3Z" />
    </svg>
  );
}

export function IconEstrategista({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3V21" />
      <path d="M6 7H18" />
      <path d="M6 7L4 11H8Z" />
      <path d="M18 7L16 11H20Z" />
    </svg>
  );
}

export function IconEsparta({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4L20 20" />
      <path d="M20 4L4 20" />
    </svg>
  );
}

export function IconConquistador({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L15 8L22 9L17 14L18 22L12 18L6 22L7 14L2 9L9 8L12 2Z" />
    </svg>
  );
}

export function IconVisionario({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C10 7 14 9 14 12C14 14 12 15 12 17C12 19 14 20 16 18C18 16 19 13 18 10C17 7 14 5 12 3Z" />
    </svg>
  );
}

// LOGO

export function LogoSymbol({ size = 24, color = "#00E5A0" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18H20" />
      <rect x="5" y="11" width="2" height="5" rx="1" />
      <rect x="10" y="9" width="2" height="7" rx="1" />
      <rect x="15" y="6" width="2" height="10" rx="1" />
      <path d="M5 13L11 10L16 8L20 5" />
      <circle cx="5" cy="13" r="0.8" fill={color} stroke="none" />
      <circle cx="11" cy="10" r="0.8" fill={color} stroke="none" />
      <circle cx="16" cy="8" r="0.8" fill={color} stroke="none" />
      <path d="M20 5V8" />
      <path d="M20 5H17" />
    </svg>
  );
}
