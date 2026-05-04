"use client";

import { useState } from "react";

// 🔁 MANTENHA TODOS OS SEUS IMPORTS EXISTENTES AQUI
import EducationHub from "../components/EducationHub";
import SaudeFinanceira from "../components/SaudeFinanceira";

export default function Page() {

  const [tab, setTab] = useState("home");

  // ✅ FUNÇÃO CORRIGIDA
  const handleTrack = (track) => {
    if (track === "saude-financeira") {
      setTab("saude-financeira");
      return;
    }
    setTab(track);
  };

  return (
    <div>

      {/* ⚠️ MANTENHA TODA SUA HOME ORIGINAL AQUI */}
      {tab === "home" && (
        <div>
          {/* SUA HOME */}
        </div>
      )}

      {/* EDUCAÇÃO */}
      {tab === "educacao" && (
        <EducationHub
          onBack={() => setTab("home")}
          user={null} // mantenha sua lógica
          onTrack={handleTrack}
        />
      )}

      {/* SAÚDE FINANCEIRA */}
      {tab === "saude-financeira" && (
        <SaudeFinanceira
          onBack={() => setTab("educacao")}
          user={null} // mantenha sua lógica
        />
      )}

      {/* ⚠️ MANTENHA TODAS AS OUTRAS ROTAS DO SEU APP AQUI */}
      {/* EX: comparadores, carteira, etc */}

    </div>
  );
}
