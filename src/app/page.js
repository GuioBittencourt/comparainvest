"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { C, MN, FN } from "../lib/theme";

import HomePage from "../components/HomePage";
import ComparatorPage from "../components/ComparatorPage";
import ComparadorRF from "../components/ComparadorRF";
import PhilosophyQuiz from "../components/PhilosophyQuiz";
import PhilosophyResult from "../components/PhilosophyResult";
import CarteiraFicticia from "../components/CarteiraFicticia";
import AdminDashboard from "../components/AdminDashboard";

import {
  LogoSymbol,
  IconHome,
  IconComparar,
  IconAcoes,
  IconFIIs,
  IconRendaFixa,
  IconCarteira,
} from "../components/Icons";

export default function Home() {
  const [screen, setScreen] = useState("loading");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        setScreen("app");
      } else {
        setScreen("login");
      }
    })();
  }, []);

  if (screen === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg }} />
    );
  }

  if (screen === "login") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <LogoSymbol size={50} />
          <h1 style={{ fontFamily: MN, color: C.white }}>
            compara<span style={{ color: C.accent }}>invest</span>
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>

      {/* HEADER */}
      <div style={{
        padding: "20px 28px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div
          onClick={() => setTab("home")}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
        >
          <LogoSymbol size={22} />
          <h1 style={{ fontFamily: MN, fontSize: 20 }}>
            compara<span style={{ color: C.accent }}>invest</span>
          </h1>
        </div>
      </div>

      {/* NAV */}
      <div style={{ display: "flex", gap: 12, padding: 16 }}>
        {[
          { id: "home", icon: <IconHome size={16} />, label: "Início" },
          { id: "comparadores", icon: <IconComparar size={16} />, label: "Comparar" },
          { id: "acoes", icon: <IconAcoes size={16} />, label: "Ações" },
          { id: "fiis", icon: <IconFIIs size={16} />, label: "FIIs" },
          { id: "rf", icon: <IconRendaFixa size={16} />, label: "RF" },
          { id: "carteira", icon: <IconCarteira size={16} />, label: "Carteira" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              background: "transparent",
              border: "none",
              color: tab === t.id ? C.accent : C.textDim,
              borderBottom: tab === t.id ? `2px solid ${C.accent}` : "none",
              cursor: "pointer"
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: 24 }}>
        {tab === "home" && <HomePage />}
        {tab === "comparadores" && <ComparatorPage />}
        {tab === "acoes" && <ComparatorPage />}
        {tab === "fiis" && <ComparatorPage />}
        {tab === "rf" && <ComparadorRF />}
        {tab === "carteira" && <CarteiraFicticia />}
        {tab === "admin" && <AdminDashboard />}
        {tab === "quiz" && (
          <PhilosophyQuiz
            onComplete={(res) => {
              setQuizResult(res);
              setTab("quiz-result");
            }}
          />
        )}
        {tab === "quiz-result" && (
          <PhilosophyResult
            result={quizResult}
            onContinue={() => setTab("comparadores")}
          />
        )}
      </div>

      {/* FOOTER */}
      <div style={{
        textAlign: "center",
        fontSize: 10,
        padding: 16,
        color: C.textMuted,
        borderTop: `1px solid ${C.border}`
      }}>
        comparainvest v3.0
      </div>

    </div>
  );
}
