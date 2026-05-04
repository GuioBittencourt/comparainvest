// PAGE.JS - TRECHO CORRIGIDO

import SaudeFinanceira from "../components/SaudeFinanceira";

// função de navegação
const handleTrack = (track) => {
  if (track === "saude-financeira") {
    setTab("saude-financeira");
    return;
  }
  setTab(track);
};

// EducationHub correto
{tab === "educacao" && (
  <EducationHub 
    onBack={() => setTab("home")} 
    user={user} 
    onTrack={handleTrack} 
  />
)}

// rota saúde financeira
{tab === "saude-financeira" && (
  <SaudeFinanceira 
    onBack={() => setTab("educacao")} 
    user={user} 
  />
)}
