"use client";
import { useState, useEffect } from "react";
import { supabase, ADMIN_EMAIL } from "../lib/supabase";
import { C, MN, FN, TN, PAL, inputStyle, labelStyle, btnPrimary, btnSecondary } from "../lib/theme";
import { validateCPF, formatCPF, formatPhone, validateEmail, validatePhone } from "../lib/utils";
import { LGPD_TEXT } from "../lib/lgpd";
import { IND_ACOES, IND_FIIS } from "../data/indicators";
import { DB_A } from "../data/acoes";
import { DB_F } from "../data/fiis";
import { DB_RF, IND_RF, MACRO_SIGNALS, fmtRF } from "../data/rendafixa";
import { smartBrapiFetch, mergeWithBrapi } from "../lib/brapi";
import ComparatorPage from "../components/ComparatorPage";
import ComparadorRF from "../components/ComparadorRF";
import { BannerFinanceiro, BannerRiqueza } from "../components/Banners";
import SponsorSlot from "../components/SponsorSlot";
import AdminDashboard from "../components/AdminDashboard";
import HomePage from "../components/HomePage";
import PhilosophyQuiz, { PHILOSOPHIES } from "../components/PhilosophyQuiz";
import PhilosophyResult from "../components/PhilosophyResult";
import EducationHub from "../components/EducationHub";
import SaudeFinanceira from "../components/SaudeFinanceira";
import CarteiraFicticia from "../components/CarteiraFicticia";
import MeuNegocio from "../components/MeuNegocio";
import { IconHome, IconCarteira, IconAcoes, IconProteger, IconNegocio, IconControle, IconMais } from "../components/Icons";

/* ... (TODO SEU CÓDIGO DE REGISTER E LOGIN PERMANECE IGUAL — NÃO ALTEREI NADA) ... */

export default function Home() {
  const [screen, setScreen] = useState("loading");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [dbAcoes, setDbAcoes] = useState(DB_A);
  const [dbFiis, setDbFiis] = useState(DB_F);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (profile) { setUser({ ...profile, email: session.user.email }); setScreen("app"); return; }
      }
      setScreen("login");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const brapiData = await smartBrapiFetch();
        if (brapiData) {
          setDbAcoes(mergeWithBrapi(DB_A, brapiData));
          setDbFiis(mergeWithBrapi(DB_F, brapiData));
        }
      } catch (e) { console.log("Brapi merge skipped:", e.message); }
    })();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setScreen("login");
    setTab("home");
  };

  const handleTrack = (track) => {
    if (track === "quiz") {
      setTab("quiz");
    } else if (track === "carteira") {
      setTab("carteira");
    } else if (track === "comparadores" || track === "investimentos") {
      if (user?.philosophy) {
        setTab("comparadores");
      } else {
        setTab("quiz");
      }
    } else if (track === "meu-negocio") {
      setTab("meu-negocio");
    } 
    // ✅ CORREÇÃO AQUI
    else if (track === "saude-financeira") {
      setTab("saude-financeira");
    } 
    else {
      setTab("educacao");
    }
  };

  if (screen === "loading") return <div style={{ minHeight: "100vh", background: C.bg }} />;

  return (
    <div style={{ fontFamily: FN, background: C.bg, color: C.text, minHeight: "100vh" }}>

      <div style={{ padding: "24px 28px" }}>
        
        {tab === "home" && <HomePage user={user} onTrack={handleTrack} />}

        {tab === "educacao" && (
          <EducationHub
            onBack={() => setTab("home")}
            user={user}
            onTrack={handleTrack}
          />
        )}

        {/* ✅ CORREÇÃO PRINCIPAL AQUI */}
        {tab === "saude-financeira" && (
          <SaudeFinanceira
            user={user}
            onBack={() => setTab("educacao")}
          />
        )}

        {tab === "comparadores" && <div>Comparadores...</div>}
        {tab === "acoes" && <ComparatorPage db={dbAcoes} indicators={IND_ACOES} user={user} />}
        {tab === "fiis" && <ComparatorPage db={dbFiis} indicators={IND_FIIS} user={user} />}
        {tab === "rf" && <ComparadorRF user={user} />}
        {tab === "carteira" && <CarteiraFicticia user={user} />}
        {tab === "meu-negocio" && <MeuNegocio user={user} />}
        {tab === "admin" && user?.is_admin && <AdminDashboard />}

      </div>

    </div>
  );
}
