"use client";
import { useState } from "react";
import { C, MN, FN, TN } from "../lib/theme";
import { supabase } from "../lib/supabase";
import { IconPublico, IconCLT, IconAutonomo, IconEstudante, IconVendeTudo, IconVendeParte, IconEspera, IconCompraMais, IconProteger, IconRendaPassiva, IconCrescer, IconAgressivo, IconReserva, IconViagem, IconCarro, IconImovel, IconCasamento, IconFaculdade, IconAposentadoria, IconIndependencia, IconDinheiro, IconDiamante, IconTrofeu, IconIniciante, IconIntermediario, IconGuardiao, IconEstrategista, IconEsparta, IconConquistador, IconVisionario, IconUsers } from "./Icons";

const QUESTIONS = [
  {
    id: "ocupacao",
    title: "Qual sua situação profissional?",
    subtitle: "Isso ajuda a definir o nível de segurança ideal pra você.",
    options: [
      { label: "Funcionário Público", value: "publico", icon: <IconPublico size={22} />, desc: "Estabilidade alta" },
      { label: "CLT — Empresa Privada", value: "clt", icon: <IconCLT size={22} />, desc: "Estabilidade média" },
      { label: "Autônomo / Empresário / MEI", value: "autonomo", icon: <IconAutonomo size={22} />, desc: "Renda variável" },
      { label: "Estudante / Em transição", value: "estudante", icon: <IconEstudante size={22} />, desc: "Fase de construção" },
    ],
  },
  {
    id: "reserva",
    title: "Quanto da sua reserva de emergência você já tem?",
    subtitle: "Reserva ideal = 6 a 12 meses de despesas guardados.",
    options: [
      { label: "0% — Ainda não comecei", value: "0", icon: <span style={{width:14,height:14,borderRadius:"50%",background:"#F87171",display:"inline-block"}} /> },
      { label: "1-30% — Comecei mas falta bastante", value: "30", icon: <span style={{width:14,height:14,borderRadius:"50%",background:"#FB923C",display:"inline-block"}} /> },
      { label: "30-60% — Quase na metade", value: "60", icon: <span style={{width:14,height:14,borderRadius:"50%",background:"#FBBF24",display:"inline-block"}} /> },
      { label: "60-100% — Completa ou quase", value: "90", icon: <span style={{width:14,height:14,borderRadius:"50%",background:"#34D399",display:"inline-block"}} /> },
    ],
  },
  {
    id: "responsabilidade",
    title: "Qual sua situação com despesas fixas?",
    subtitle: "Quem tem menos compromissos pode se expor mais a riscos.",
    options: [
      { label: "Moro com família, não pago contas principais", value: "sem_contas", icon: <IconImovel size={22} />, desc: "Mais liberdade financeira" },
      { label: "Divido despesas com alguém", value: "divide", icon: <IconEstrategista size={22} />, desc: "Responsabilidade compartilhada" },
      { label: "Sou responsável por todas as minhas contas", value: "todas", icon: <IconAutonomo size={22} />, desc: "Independente" },
      { label: "Sustento outras pessoas além de mim", value: "sustenta", icon: <IconUsers size={22} />, desc: "Maior responsabilidade" },
    ],
  },
  {
    id: "experiencia",
    title: "Qual sua experiência com investimentos?",
    subtitle: "Seja honesto — não existe resposta errada.",
    options: [
      { label: "Nunca investi (só poupança)", value: "nenhuma", icon: <IconIniciante size={22} /> },
      { label: "Já invisto em renda fixa (CDB, Tesouro)", value: "rf", icon: <IconIntermediario size={22} /> },
      { label: "Invisto em renda fixa e variável", value: "rv", icon: <IconCrescer size={22} /> },
      { label: "Invisto em tudo (cripto, derivativos)", value: "tudo", icon: <IconVisionario size={22} /> },
    ],
  },
  {
    id: "reacao_perda",
    title: "Se seus investimentos caíssem 20% em um mês, o que faria?",
    subtitle: "Imagine que R$ 10.000 virou R$ 8.000 na sua conta da corretora.",
    options: [
      { label: "Venderia tudo imediatamente", value: "vende_tudo", icon: <IconVendeTudo size={22} />, desc: "(tiraria tudo da corretora)" },
      { label: "Venderia parte pra reduzir risco", value: "vende_parte", icon: <IconVendeParte size={22} />, desc: "(tiraria uma parte do que está investido)" },
      { label: "Não faria nada, esperaria recuperar", value: "espera", icon: <IconEspera size={22} />, desc: "(deixaria o dinheiro investido e aguardaria)" },
      { label: "Compraria mais, aproveitando a queda", value: "compra_mais", icon: <IconCompraMais size={22} />, desc: "(colocaria mais dinheiro aproveitando o preço baixo)" },
    ],
  },
  {
    id: "objetivo",
    title: "Qual seu objetivo principal?",
    subtitle: "Escolha o que mais te representa agora.",
    options: [
      { label: "Proteger meu dinheiro da inflação", value: "proteger", icon: <IconGuardiao size={48} /> },
      { label: "Gerar renda passiva mensal (dividendos)", value: "renda", icon: <IconRendaPassiva size={22} /> },
      { label: "Fazer o patrimônio crescer no longo prazo", value: "crescer", icon: <IconCrescer size={22} /> },
      { label: "Buscar retornos altos, mesmo com mais risco", value: "agressivo", icon: <IconAgressivo size={22} /> },
    ],
  },
  {
    id: "planos",
    title: "Quais seus planos financeiros?",
    subtitle: "Selecione os que se aplicam a você.",
    type: "multi",
    options: [
      { label: "Reserva de emergência", value: "reserva", icon: <IconReserva size={22} />, prazo: "curto" },
      { label: "Viagem", value: "viagem", icon: <IconViagem size={22} />, prazo: "curto" },
      { label: "Comprar carro", value: "carro", icon: <IconCarro size={22} />, prazo: "curto" },
      { label: "Entrada de imóvel", value: "imovel", icon: <IconImovel size={22} />, prazo: "medio" },
      { label: "Casamento", value: "casamento", icon: <IconCasamento size={22} />, prazo: "medio" },
      { label: "Faculdade dos filhos", value: "faculdade", icon: <IconFaculdade size={22} />, prazo: "medio" },
      { label: "Aposentadoria tranquila", value: "aposentadoria", icon: <IconAposentadoria size={22} />, prazo: "longo" },
      { label: "Independência financeira", value: "independencia", icon: <IconIndependencia size={22} />, prazo: "longo" },
    ],
  },
  {
    id: "aporte",
    title: "Quanto pretende investir por mês?",
    subtitle: "Mesmo que seja pouco, o importante é começar.",
    options: [
      { label: "Até R$ 500", value: "500", icon: <IconDinheiro size={22} /> },
      { label: "R$ 500 a R$ 1.500", value: "1500", icon: <IconRendaPassiva size={22} /> },
      { label: "R$ 1.500 a R$ 5.000", value: "5000", icon: <IconDiamante size={22} /> },
      { label: "Acima de R$ 5.000", value: "10000", icon: <IconTrofeu size={22} /> },
    ],
  },
];

const PHILOSOPHIES = {
  guardiao: { name: "Guardião", icon: <IconGuardiao size={48} />, color: C.blue, desc: "Você valoriza segurança acima de tudo. Preservar patrimônio é prioridade.", rf: 80, fii: 15, acoes: 5, cripto: 0 },
  estrategista: { name: "Estrategista", icon: <IconEstrategista size={48} />, color: C.accent, desc: "Equilíbrio é sua marca. Busca crescer com segurança, sem perder o sono.", rf: 60, fii: 25, acoes: 15, cripto: 0 },
  esparta: { name: "Esparta", icon: <IconEsparta size={48} />, color: C.orange, desc: "Disciplina e coragem. Exposição controlada a risco com base sólida.", rf: 40, fii: 30, acoes: 25, cripto: 5 },
  conquistador: { name: "Conquistador", icon: <IconConquistador size={48} />, color: C.purple, desc: "Foco em crescimento de longo prazo. Tolera volatilidade pra colher mais.", rf: 20, fii: 25, acoes: 45, cripto: 10 },
  visionario: { name: "Visionário", icon: <IconVisionario size={48} />, color: C.red, desc: "Busca retornos altos e aceita risco elevado. Visão de longo prazo agressiva.", rf: 10, fii: 15, acoes: 50, cripto: 25 },
};

function calcPhilosophy(answers) {
  let score = 40;

  if (answers.ocupacao === "publico") score += 15;
  else if (answers.ocupacao === "clt") score += 5;
  else if (answers.ocupacao === "autonomo") score -= 10;
  else if (answers.ocupacao === "estudante") score -= 5;

  if (answers.reserva === "0") score -= 20;
  else if (answers.reserva === "30") score -= 5;
  else if (answers.reserva === "60") score += 5;
  else if (answers.reserva === "90") score += 10;

  if (answers.responsabilidade === "sem_contas") score += 15;
  else if (answers.responsabilidade === "divide") score += 5;
  else if (answers.responsabilidade === "sustenta") score -= 10;

  if (answers.experiencia === "nenhuma") score -= 10;
  else if (answers.experiencia === "rv") score += 10;
  else if (answers.experiencia === "tudo") score += 15;

  if (answers.reacao_perda === "vende_tudo") score -= 15;
  else if (answers.reacao_perda === "vende_parte") score -= 5;
  else if (answers.reacao_perda === "espera") score += 5;
  else if (answers.reacao_perda === "compra_mais") score += 15;

  if (answers.objetivo === "proteger") score -= 10;
  else if (answers.objetivo === "crescer") score += 10;
  else if (answers.objetivo === "agressivo") score += 20;

  score = Math.max(0, Math.min(100, score));

  if (score <= 25) return { key: "guardiao", score };
  if (score <= 45) return { key: "estrategista", score };
  if (score <= 60) return { key: "esparta", score };
  if (score <= 80) return { key: "conquistador", score };
  return { key: "visionario", score };
}

export default function PhilosophyQuiz({ user, onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [multiSelected, setMultiSelected] = useState([]);
  const [saving, setSaving] = useState(false);

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const selectOption = async (value) => {
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setSaving(true);

      const result = calcPhilosophy(newAnswers);
      const philosophy = PHILOSOPHIES[result.key];

      let adj = { ...philosophy };
      if (newAnswers.ocupacao === "autonomo" && adj.acoes > 20) {
        const diff = adj.acoes - 20;
        adj = { ...adj, acoes: 20, rf: adj.rf + diff };
      }
      if (newAnswers.reserva === "0") {
        adj = {
          ...adj,
          rf: Math.max(adj.rf, 90),
          fii: Math.min(adj.fii, 5),
          acoes: Math.min(adj.acoes, 5),
          cripto: 0,
        };
      }

      try {
        await supabase
          .from("profiles")
          .update({
            philosophy: result.key,
            philosophy_score: result.score,
            philosophy_answers: newAnswers,
            philosophy_allocation: {
              rf: adj.rf,
              fii: adj.fii,
              acoes: adj.acoes,
              cripto: adj.cripto,
            },
          })
          .eq("id", user.id);
      } catch (e) {
        console.error(e);
      }

      setSaving(false);
      onComplete({
        key: result.key,
        score: result.score,
        philosophy: { ...philosophy, ...adj },
        answers: newAnswers,
      });
    }
  };

  const handleMultiConfirm = () => {
    selectOption(multiSelected);
  };

  const toggleMulti = (val) => {
    setMultiSelected((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 28px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontFamily: MN, fontSize: 11, color: C.textDim }}>
            Pergunta {step + 1} de {QUESTIONS.length}
          </span>
          <button
            onClick={onSkip}
            style={{
              background: `${C.accent}15`,
              border: `1px solid ${C.accent}30`,
              color: C.accent,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: FN,
              fontWeight: 700,
              padding: "6px 10px",
              borderRadius: 8,
            }}
          >
            Pular quiz →
          </button>
        </div>

        <div style={{ height: 4, background: C.border, borderRadius: 4, overflow: "hidden" }}>
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: C.accent,
              borderRadius: 4,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 28px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 520 }}>
          <h2
            style={{
              fontFamily: FN,
              fontSize: 20,
              fontWeight: 700,
              color: C.white,
              margin: "0 0 8px",
              textAlign: "center",
            }}
          >
            {q.title}
          </h2>

          <p
            style={{
              textAlign: "center",
              color: C.textDim,
              fontSize: 13,
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            {q.subtitle}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt) => {
              const isMulti = q.type === "multi";
              const isSelected = isMulti
                ? multiSelected.includes(opt.value)
                : answers[q.id] === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => (isMulti ? toggleMulti(opt.value) : selectOption(opt.value))}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 20px",
                    borderRadius: 14,
                    background: isSelected ? C.accentDim : C.card,
                    border: `1px solid ${isSelected ? C.accentBorder : C.border}`,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ display: "inline-flex", color: C.textDim }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: isSelected ? C.accent : C.white,
                      }}
                    >
                      {opt.label}
                    </div>
                    {opt.desc && (
                      <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                        {opt.desc}
                      </div>
                    )}
                    {opt.prazo && (
                      <div
                        style={{
                          fontSize: 10,
                          color: C.textMuted,
                          fontFamily: MN,
                          marginTop: 2,
                        }}
                      >
                        {opt.prazo === "curto"
                          ? "Curto prazo (1-5 anos)"
                          : opt.prazo === "medio"
                            ? "Médio prazo (5-15 anos)"
                            : "Longo prazo (15-30 anos)"}
                      </div>
                    )}
                  </div>

                  {isMulti && (
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        border: `2px solid ${isSelected ? C.accent : C.border}`,
                        background: isSelected ? C.accent : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && (
                        <span style={{ color: C.bg, fontSize: 12, fontWeight: 800 }}>
                          ✓
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {q.type === "multi" && (
            <button
              onClick={handleMultiConfirm}
              disabled={multiSelected.length === 0}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: 16,
                background: multiSelected.length > 0 ? C.accent : C.border,
                color: multiSelected.length > 0 ? C.bg : C.textMuted,
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: FN,
                cursor: multiSelected.length > 0 ? "pointer" : "not-allowed",
              }}
            >
              Continuar ({multiSelected.length} selecionados)
            </button>
          )}

          {saving && (
            <div style={{ textAlign: "center", marginTop: 20, color: C.textDim, fontSize: 13 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  border: `2px solid ${C.border}`,
                  borderTop: `2px solid ${C.accent}`,
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                  margin: "0 auto 8px",
                }}
              />
              Calculando sua filosofia...
            </div>
          )}
        </div>
      </div>

      {step > 0 && (
        <div style={{ padding: "0 28px 24px", textAlign: "center" }}>
          <button
            onClick={() => setStep(step - 1)}
            style={{
              background: "none",
              border: "none",
              color: C.textDim,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: FN,
            }}
          >
            ← Voltar à pergunta anterior
          </button>
        </div>
      )}

      <div
        style={{
          padding: "12px 28px 20px",
          textAlign: "center",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <p style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.6 }}>
          Fazer o quiz é importante para personalizar sua experiência e receber sugestões de carteira alinhadas ao seu momento de vida.
        </p>
      </div>
    </div>
  );
}

export { PHILOSOPHIES, calcPhilosophy };
