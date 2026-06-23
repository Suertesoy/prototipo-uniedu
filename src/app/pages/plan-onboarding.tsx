import { useState } from "react";

/* Espelha exatamente os studyPlans da Home — homeId = id do plano na Home */
const plans = [
  {
    id: "intensivo",
    homeId: 1,
    icon: "🔥",
    title: "Intensivo",
    description: "5 horas por dia, todos os dias",
    hours: "~35h por semana",
    tag: "Mais rápido",
    gradient: "from-orange-400 to-red-500",
  },
  {
    id: "dedicado",
    homeId: 2,
    icon: "💪",
    title: "Dedicado",
    description: "2 horas por dia, 5 dias na semana",
    hours: "~10h por semana",
    tag: "Recomendado",
    gradient: "from-[#A31545] to-pink-600",
  },
  {
    id: "equilibrado",
    homeId: 3,
    icon: "⚖️",
    title: "Equilibrado",
    description: "3 dias na semana, 3 horas cada",
    hours: "~9h por semana",
    tag: "Popular",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    id: "noturno",
    homeId: 4,
    icon: "🌙",
    title: "Noturno",
    description: "1 hora por dia, foco nos fins de semana",
    hours: "~5h por semana",
    tag: "Flexível",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    id: "consistente",
    homeId: 5,
    icon: "🎯",
    title: "Consistente",
    description: "4 horas por dia, 4 dias na semana",
    hours: "~16h por semana",
    tag: "Eficiente",
    gradient: "from-green-400 to-teal-500",
  },
] as const;

interface PlanOnboardingPageProps {
  onComplete: (planId: string, homeId: number) => void;
}

export function PlanOnboardingPage({ onComplete }: PlanOnboardingPageProps) {
  const [selected, setSelected] = useState<string>("equilibrado");

  const handleStart = () => {
    const plan = plans.find((p) => p.id === selected);
    if (plan) onComplete(plan.id, plan.homeId);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-background overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545] dark:from-[#1E1A1D] dark:via-[#1A1518] dark:to-[#120E10] dark:border-b dark:border-[#F48FB1]/20 pt-14 pb-5 px-5 text-white flex-shrink-0">
        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Primeiro acesso</p>
        <h1 className="text-lg font-black leading-tight">Escolha seu plano de estudos</h1>
        <p className="text-white/70 text-xs mt-1">Você poderá alterar isso depois na Home.</p>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-2">
        {plans.map((plan) => {
          const isSelected = selected === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-150 active:scale-[0.98] ${
                isSelected
                  ? "border-[#A31545] dark:border-primary bg-pink-50 dark:bg-pink-900/20"
                  : "border-gray-200 dark:border-border bg-white dark:bg-card"
              }`}
            >
              <div className="flex items-center gap-3">

                {/* Ícone */}
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <span className="text-xl">{plan.icon}</span>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{plan.title}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      isSelected
                        ? "bg-[#A31545] dark:bg-primary text-white"
                        : "bg-gray-100 dark:bg-accent text-gray-500 dark:text-gray-400"
                    }`}>
                      {plan.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">{plan.description}</p>
                  <p className="text-[10px] text-gray-400 dark:text-muted-foreground mt-0.5">{plan.hours}</p>
                </div>

                {/* Indicador de seleção */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected
                    ? "border-[#A31545] dark:border-primary bg-[#A31545] dark:bg-primary"
                    : "border-gray-300 dark:border-border bg-transparent"
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

              </div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <div className="flex-shrink-0 px-4 pb-8 pt-3">
        <button
          onClick={handleStart}
          className="w-full bg-[#A31545] active:bg-[#7D1133] dark:bg-[#F48FB1] dark:active:bg-[#EC407A] text-white font-bold py-4 rounded-2xl text-sm tracking-wide transition-colors shadow-lg"
        >
          COMEÇAR MINHA JORNADA 🚀
        </button>
      </div>

    </div>
  );
}
