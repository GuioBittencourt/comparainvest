import "./globals.css";

export const metadata = {
  title: "comparainvest — Comparador de Ativos B3",
  description: "Compare ações, FIIs e renda fixa da B3 com indicadores fundamentalistas. Educação financeira e simulação de carteira.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00E5A0" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#06090F" }}>{children}</body>
    </html>
  );
}
