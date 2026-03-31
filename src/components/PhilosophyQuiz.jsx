"use client";

import { useState } from "react";
import { C, MN, FN } from "../lib/theme";
import { supabase } from "../lib/supabase";
import {
  IconGuardiao,
  IconEstrategista,
  IconEsparta,
  IconConquistador,
  IconVisionario,
} from "./Icons";

/* =========================
   QUESTIONS
========================= */
const QUESTIONS = [
  {
    id: "ocupacao",
    title: "Qual sua situação profissional?",
    subtitle: "Isso ajuda a definir o nível de segurança ideal pra você.",
    options: [
      { label: "Funcionário Público", value: "publico", icon: "🏛️" },
      { label: "CLT — Empresa Privada", value: "clt", icon: "🏢" },
      { label: "Autônomo / Empresário / MEI", value: "autonomo", icon: "🚀" },
      { label: "Estudante / Em transição", value: "estudante", icon: "📚" },
    ],
  },
  {
    id: "reserva",
    title: "Quanto da sua reserva de emergência você já tem?",
    subtitle: "Reserva ideal = 6 a 12 meses.",
    options: [
      { label: "0% — Ainda não comecei", value: "0", icon: "🔴" },
      { label: "1-30%", value: "30", icon: "🟠" },
      { label: "30-60%", value: "60", icon: "🟡" },
      { label: "60-100%", value: "90", icon: "🟢" },
    ],
  },
  {
    id: "responsabilidade",
    title: "Qual sua situação com despesas?",
    subtitle: "Menos compromissos = mais liberdade.",
    options: [
      { label: "Moro com família", value: "sem_contas", icon: "🏠" },
      { label: "Divido despesas", value: "divide", icon: "🤝" },
      { label: "Pago tudo sozinho", value: "todas", icon: "💪" },
      { label: "Sustento outros", value: "sustenta", icon: "👨‍👩‍👧‍👦" },
    ],
  },
  {
    id: "experiencia",
    title: "Experiência com investimentos?",
    options: [
      { label: "Nenhuma", value: "nenhuma", icon: "🌱" },
      { label: "Renda fixa", value: "rf", icon: "📊" },
      { label: "Renda variável", value: "rv", icon: "📈" },
      { label: "Tudo", value: "tudo", icon: "🔥" },
    ],
  },
  {
    id: "reacao_perda",
    title: "Se caísse 20%?",
    options: [
      { label: "Vendo tudo", value: "vende_tudo", icon: "😰" },
      { label: "Vendo parte", value: "vende_parte", icon: "😟" },
      { label: "Espero", value: "espera", icon: "😌" },
      { label: "Compro mais", value: "compra_mais", icon: "🤑" },
    ],
  },
  {
    id: "objetivo",
    title: "Seu objetivo?",
    options: [
      { label: "Proteger", value: "proteger", icon: "🛡️" },
      { label: "Renda", value: "renda", icon: "💰" },
      { label: "Crescer", value: "crescer", icon: "📈" },
      { label: "Agressivo", value: "agressivo", icon: "🚀" },
    ],
  },
];

/* =========================
   PHILOSOPHIES
========================= */
const PHILOSOPHIES = {
  guardiao: {
    name: "Guardião",
    icon: <IconGuardiao size={56} />,
    color: C.blue,
    rf: 80,
    fii: 15,
    acoes: 5,
  },
  estrategista: {
    name: "Estrategista",
    icon: <IconEstrategista size={56} />,
    color: C.accent,
    rf: 60,
    fii: 25,
    acoes: 15,
  },
  esparta: {
    name: "Esparta",
    icon: <IconEsparta size={56} />,
    color: C.orange,
    rf: 40,
    fii: 30,
    acoes: 25,
  },
  conquistador: {
    name: "Conquistador",
    icon: <IconConquistador size={56} />,
    color: C.purple,
    rf: 20,
    fii: 25,
    acoes: 45,
  },
  visionario: {
    name: "Visionário",
    icon: <IconVisionario size={56} />,
    color: C.red,
    rf: 10,
    fii: 15,
    acoes: 50,
  },
};

/* =========================
   CALC
========================= */
function calcPhilosophy(answers) {
  let score = 50;

  if (answers.ocupacao === "publico") score += 15;
  if (answers.ocupacao === "autonomo") score -= 10;

  if (answers.reserva === "0") score -= 20;
  if (answers.reserva === "90") score += 10;

  if (answers.experiencia === "rv") score += 10;
  if (answers.experiencia === "tudo") score += 15;

  if (answers.reacao_perda === "vende_tudo") score -= 15;
  if (answers.reacao_perda === "compra_mais") score += 15;

  if (answers.objetivo === "agressivo") score += 20;

  score = Math.max(0, Math.min(100, score));

  if (score <= 25) return "guardiao";
  if (score <= 45) return "estrategista";
  if (score <= 60) return "esparta";
  if (score <= 80) return "conquistador";
  return "visionario";
}

/* =========================
   COMPONENT
========================= */
export default function PhilosophyQuiz({ user, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = QUESTIONS[step];

  const select = async (value) => {
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const key = calcPhilosophy(newAnswers);

      try {
        await supabase
          .from("profiles")
          .update({ philosophy: key })
          .eq("id", user?.id);
      } catch (e) {
        console.error(e);
      }

      onComplete({ key, data: PHILOSOPHIES[key] });
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ fontFamily: FN }}>{q.title}</h2>

      {q.options.map((opt) => (
        <button key={opt.value} onClick={() => select(opt.value)}>
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );
}

export { PHILOSOPHIES, calcPhilosophy };
