import { useState } from "react";
import { Bell, Play, Coins, X, Check, HelpCircle, Moon, Sun } from "lucide-react";
import { ThemedIcon } from "../components/themed-icon";
import iconPlayLight from "../../imports/icon-play-light.png";
import iconPlayDark from "../../imports/icon-play-dark.png";
import iconChatLight from "../../imports/icon-chat-light.png";
import iconChatDark from "../../imports/icon-chat-dark.png";
import iconGiftLight from "../../imports/icon-gift-light.png";
import iconGiftDark from "../../imports/icon-gift-dark.png";
import iconCheckLight from "../../imports/icon-check-light.png";
import iconCheckDark from "../../imports/icon-check-dark.png";
import { useTheme } from "../context/theme-context";
import { Link, useNavigate } from "react-router";
import { useStore } from "../context/store-context";
import { BottomNav } from "../components/bottom-nav";
import studyImg from "../../imports/imagem-plano-de-estudos.jfif";
import doubtImg from "../../imports/imagem-tire-suas-duvidas.jfif";
import logoUniedu from "../../imports/logo-uniedu.png";

const caseCategories = [
  { id: 1, label: "STRATEGY", slug: "strategy", emoji: "🎯" },
  { id: 2, label: "RESEARCH", slug: "research", emoji: "🔍" },
  { id: 3, label: "WRITING", slug: "writing", emoji: "✍️" },
  { id: 4, label: "USABILITY", slug: "usability", emoji: "🎨" },
  { id: 5, label: "INFORMATION ARCH.", slug: "information-arch", emoji: "🏗️" },
  { id: 6, label: "UI DESIGN", slug: "ui-design", emoji: "💎" },
];

const studyPlans = [
  {
    id: 1,
    icon: "🔥",
    title: "Intensivo",
    description: "5 horas por dia, todos os dias",
    hours: 35,
    tag: "Mais rápido",
    tagColor: "bg-orange-100 text-orange-600",
  },
  {
    id: 2,
    icon: "💪",
    title: "Dedicado",
    description: "2 horas por dia, 5 dias na semana",
    hours: 10,
    tag: "Recomendado",
    tagColor: "bg-pink-100 text-[#A31545] dark:text-primary",
  },
  {
    id: 3,
    icon: "⚖️",
    title: "Equilibrado",
    description: "3 dias na semana, 3 horas cada",
    hours: 9,
    tag: "Popular",
    tagColor: "bg-purple-100 text-purple-600",
  },
  {
    id: 4,
    icon: "🌙",
    title: "Noturno",
    description: "1 hora por dia, foco nos fins de semana",
    hours: 5,
    tag: "Flexível",
    tagColor: "bg-blue-100 text-blue-600",
  },
  {
    id: 5,
    icon: "🎯",
    title: "Consistente",
    description: "4 horas por dia, 4 dias na semana",
    hours: 16,
    tag: "Eficiente",
    tagColor: "bg-green-100 text-green-600",
  },
];

const planHabits: Record<number, { habits: string; notification: string }> = {
  1: {
    habits: "Pessoas que seguem o plano Intensivo costumam estudar nos primeiros momentos do dia — geralmente antes do trabalho. Ritmo acelerado, resultados visíveis em semanas. O segredo está na disciplina e no comprometimento diário.",
    notification: "Vamos te enviar lembretes nos seus horários de pico para manter o ritmo em chamas! 🔥",
  },
  2: {
    habits: "Profissionais do plano Dedicado protegem blocos fixos de 2h ao longo do dia e raramente abrem exceções. É o equilíbrio certo entre crescimento rápido e qualidade de vida.",
    notification: "Você receberá notificações nos horários certos para manter sua consistência semanal! 💪",
  },
  3: {
    habits: "Quem segue o plano Equilibrado usa os intervalos entre sessões a seu favor — é nesses momentos que o aprendizado se consolida. Ideal para quem prefere profundidade ao invés de velocidade.",
    notification: "Enviaremos lembretes nos seus 3 dias de estudo para que você nunca perca o ritmo! ⚖️",
  },
  4: {
    habits: "Estudantes do plano Noturno aproveitam o silêncio da noite e a liberdade dos fins de semana para se aprofundar no conteúdo sem interrupções. Flexível e eficiente para rotinas cheias.",
    notification: "Seus lembretes chegarão no início da noite e nos fins de semana para te manter no caminho! 🌙",
  },
  5: {
    habits: "Pessoas do plano Consistente criam rituais fixos de estudo e protegem esse tempo como prioridade absoluta. Alta produtividade com previsibilidade — você sabe exatamente quando vai evoluir.",
    notification: "Notificações nos seus 4 dias de estudo para blindar sua agenda e manter o ritmo consistente! 🎯",
  },
};

export function HomePage() {
  const { userPoints } = useStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showStudyPlanModal, setShowStudyPlanModal] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(() => {
    const stored = localStorage.getItem("uniedu_study_plan_home_id");
    return stored ? parseInt(stored, 10) : 2;
  });
  const [savedPlan, setSavedPlan] = useState<number | null>(() => {
    const stored = localStorage.getItem("uniedu_study_plan_home_id");
    return stored ? parseInt(stored, 10) : 2;
  });
  const [justSaved, setJustSaved] = useState(false);
  const [showPlanConfirmation, setShowPlanConfirmation] = useState(false);
  const [confirmedPlanId, setConfirmedPlanId] = useState<number | null>(null);
  const [showJornadaOnboarding, setShowJornadaOnboarding] = useState(
    () => !localStorage.getItem("uniedu_home_onboarding_seen")
  );

  // ── Jornada interativa ──────────────────────────────────────────────────────
  const jornadaItems = [
    { id: "aula",       icon: "📚", label: "Assistir uma aula",     reward: "+50 pts", route: "/aulas/1"    },
    { id: "comentario", icon: "💬", label: "Fazer um comentário",   reward: "+10 pts", route: "/comunidade" },
    { id: "conquista",  icon: "⭐", label: "Ganhar uma conquista",  reward: "+XP",     route: "/perfil"     },
    { id: "recompensa", icon: "🎁", label: "Resgatar recompensa",   reward: "🎉",      route: "/loja"       },
  ];

  const [jornadaDone, setJornadaDone] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("homeJornadaDone");
      return saved ? new Set(JSON.parse(saved)) : new Set(["aula"]);
    } catch { return new Set(["aula"]); }
  });
  const [rewardFlash, setRewardFlash] = useState<string | null>(null);

  const handleJornadaToggle = (id: string) => {
    setJornadaDone(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setRewardFlash(id);
        setTimeout(() => setRewardFlash(null), 1400);
      }
      localStorage.setItem("homeJornadaDone", JSON.stringify([...next]));
      return next;
    });
  };

  const jornadaCount = jornadaDone.size;
  const jornadaTotal = jornadaItems.length;
  // ────────────────────────────────────────────────────────────────────────────

  const courseProgress = 65; // percentage
  const currentLesson = "UX Research: Pesquisas Longitudinais - Parte 1";
  const currentTime = "28:22";
  const totalTime = "43:39";

  const handleSavePlan = () => {
    const planId = selectedPlan;
    setSavedPlan(planId);
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      setShowStudyPlanModal(false);
      setTimeout(() => {
        setConfirmedPlanId(planId);
        setShowPlanConfirmation(true);
      }, 300);
    }, 800);
  };

  const activePlan = studyPlans.find((p) => p.id === savedPlan);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-background relative">
      {/* Header */}
      <header className="bg-[#A31545] dark:bg-[#1E1A1D] text-white flex-shrink-0 pt-[calc(env(safe-area-inset-top,0px)+3.5rem)] pb-4 px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* Logo — única */}
            <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
              <img
                src={logoUniedu}
                alt="APP UNIEDU"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div>
              <p className="text-xs text-white/80">Olá,</p>
              <h2 className="text-base font-semibold leading-tight">Fernanda</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Points pill — live from store */}
            <Link to="/loja" className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 active:bg-white/30">
              <Coins className="w-3.5 h-3.5 text-yellow-200" />
              <span className="text-[11px] font-bold text-white">{userPoints.toLocaleString("pt-BR")}</span>
            </Link>
            {/* Toggle dark/light — acesso rápido */}
            <button onClick={toggleTheme} className="p-1.5 rounded-full bg-white/20 active:bg-white/30" aria-label="Alternar tema">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="p-1.5 rounded-full bg-white/20 active:bg-white/30">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5 pb-4">

          {/* ── Hero: Continuar aula (prioridade visual máxima) ── */}
          <section>
            <p className="text-lg text-[#2F2F35] dark:text-gray-100 mb-2 font-bold">
              Você está aqui:
            </p>
            <div className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-border">
              {/* Video Thumbnail - fully clickable */}
              <div
                className="relative bg-gray-300 h-44 flex items-center justify-center active:opacity-90 cursor-pointer"
                onClick={() => navigate("/aulas/1")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545]" />
                {/* Play button */}
                <div className="relative z-10 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                  <Play
                    className="w-8 h-8 text-[#A31545] dark:text-primary ml-1"
                    fill="currentColor"
                  />
                </div>
                {/* Time badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                  {currentTime}/{totalTime}
                </div>
                {/* Progress line at bottom of video */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                  <div
                    className="h-full bg-[#A31545] dark:bg-[#F48FB1]"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>
              <div className="px-3 pt-2 pb-3">
                <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-tight mb-2">
                  {currentLesson}
                </p>
                <Link
                  to="/aulas/1"
                  className="block w-full bg-[#A31545] dark:bg-[#F48FB1] text-white text-center text-xs font-bold py-2.5 rounded-lg tracking-wide transition-colors duration-200 active:bg-[#7D1133] dark:active:bg-[#EC407A]"
                >
                  CONTINUAR
                </Link>
              </div>
            </div>
          </section>

          {/* ── Jornada de aprendizado: checklist gamificado ── */}
          <section>
            <div className="bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545] dark:from-[#1E1A1D] dark:via-[#1A1518] dark:to-[#1C0E15] dark:border dark:border-[#F48FB1]/30 rounded-2xl p-3.5 shadow-md">

              {/* Header: label + progresso + help */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest">
                  Sua jornada de aprendizado
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-white/80 bg-white/15 px-1.5 py-0.5 rounded-full">
                    {jornadaCount}/{jornadaTotal}
                  </span>
                  <button
                    onClick={() => setShowJornadaOnboarding(true)}
                    className="p-0.5 rounded-full active:bg-white/20 transition-colors"
                    aria-label="Entender a jornada"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-white/60" />
                  </button>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="h-1 bg-white/20 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-white/80 rounded-full transition-all duration-500"
                  style={{ width: `${(jornadaCount / jornadaTotal) * 100}%` }}
                />
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                {jornadaItems.map((item) => {
                  const done = jornadaDone.has(item.id);
                  const flashing = rewardFlash === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleJornadaToggle(item.id);
                        if (!done) navigate(item.route);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 active:scale-[0.98] ${
                        done
                          ? "bg-white/20 border border-white/30"
                          : "bg-white/10 border border-white/10"
                      }`}
                    >
                      {/* Check circle */}
                      <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all duration-300 ${
                        done
                          ? "bg-green-400 border-green-400"
                          : "border-white/40 bg-transparent"
                      }`}>
                        {done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>

                      {/* Icon + label */}
                      <span className="text-sm flex-shrink-0">{item.icon}</span>
                      <span className={`text-[11px] font-semibold flex-1 text-left leading-tight transition-all duration-300 ${
                        done ? "text-white/60 line-through" : "text-white"
                      }`}>
                        {item.label}
                      </span>

                      {/* Reward badge */}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                        done
                          ? "bg-green-400/30 text-green-200"
                          : "bg-white/15 text-white/70"
                      } ${flashing ? "scale-125 bg-yellow-400/60 text-yellow-100" : ""}`}>
                        {item.reward}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mensagem de conclusão ou incentivo */}
              {jornadaCount === jornadaTotal ? (
                <div className="mt-3 bg-white/20 rounded-xl px-3 py-2 text-center transition-all duration-300">
                  <p className="text-[10px] font-bold text-white">
                    🏆 Jornada completa! Incrível, continue assim!
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-[10px] text-white/80 text-center font-medium transition-all duration-300">
                  Complete sua jornada de hoje para manter o ritmo.
                </p>
              )}
            </div>
          </section>

          {/* Cases e Mini Cases */}
          <section>
            <p className="text-lg text-[#2F2F35] dark:text-gray-100 mb-0.5 font-bold">
              Cases:
            </p>
            <p className="text-xs text-gray-500 dark:text-muted-foreground mb-2.5">
              Projetos para aplicar o que você aprendeu
            </p>
            <div
              className="flex gap-3 pb-2 -mx-4 px-4 scrollbar-hide"
              style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
            >
              {caseCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/cases/${cat.slug}`}
                  className="flex-shrink-0 w-[128px] bg-gradient-to-br from-white to-pink-50 dark:from-card dark:to-[#1C0E15] border border-pink-100 dark:border-[#F48FB1]/20 rounded-2xl p-3.5 flex flex-col items-center justify-between active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{ minHeight: "148px" }}
                >
                  <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <div className="text-4xl mb-1">{cat.emoji}</div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 text-center leading-tight">
                      {cat.label}
                    </p>
                  </div>
                  <div className="w-full bg-gradient-to-r from-[#A31545] to-pink-600 dark:from-[#F48FB1] dark:to-[#EC407A] text-[10px] py-2.5 rounded-xl font-bold text-white text-center shadow-sm">
                    ACESSAR
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Plano de estudos */}
          <section>
            <div className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-border">
              <div
                className="h-40 relative"
                style={{
                  backgroundImage: `url(${studyImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {activePlan && (
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                    <p className="text-gray-800 text-[10px] font-medium">
                      {activePlan.icon} {activePlan.title}: {activePlan.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="px-3 py-2.5">
                <button
                  onClick={() => {
                    setSelectedPlan(savedPlan);
                    setShowExplanation(true);
                    setShowStudyPlanModal(true);
                  }}
                  className="block w-full bg-[#A31545] dark:bg-[#F48FB1] text-white text-center text-xs font-bold py-2.5 rounded-lg tracking-wide active:bg-[#7D1133] dark:active:bg-[#EC407A]"
                >
                  VER PLANO
                </button>
              </div>
            </div>
          </section>

          {/* Tire suas dúvidas */}
          <section>
            <div className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-border">
              <div
                className="h-40 relative"
                style={{
                  backgroundImage: `url(${doubtImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="px-3 py-2.5">
                <Link
                  to="/chat"
                  className="block w-full bg-[#A31545] dark:bg-[#F48FB1] text-white text-center text-xs font-bold py-2.5 rounded-lg tracking-wide active:bg-[#7D1133] dark:active:bg-[#EC407A]"
                >
                  TIRAR DÚVIDAS
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <BottomNav />

      {/* Study Plan Modal (Bottom Sheet) */}
      {showStudyPlanModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowStudyPlanModal(false)}
          />
          {/* Sheet */}
          <div className="relative bg-white dark:bg-card rounded-t-3xl pt-3 pb-6 max-h-[80%] flex flex-col">
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />

            {showExplanation ? (
              /* Tela de Explicação */
              <>
                <div className="px-4 mb-3 flex items-center justify-between flex-shrink-0">
                  <h3 className="text-base font-semibold dark:text-gray-100">Plano de Estudos</h3>
                  <button
                    onClick={() => setShowStudyPlanModal(false)}
                    className="p-1 rounded-full bg-gray-100 dark:bg-accent active:bg-gray-200 dark:active:bg-gray-600"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-4xl">📚</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                      O que é o Plano de Estudos?
                    </h4>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    <p>
                      O <strong>Plano de Estudos</strong> é uma ferramenta que te ajuda a organizar sua rotina de aprendizado de acordo com o tempo que você tem disponível.
                    </p>
                    <p>
                      Escolha um dos planos disponíveis baseado na sua disponibilidade semanal. Você pode alterar seu plano a qualquer momento conforme sua rotina muda.
                    </p>
                    <div className="bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 rounded-xl p-3 mt-4">
                      <p className="text-xs font-medium text-[#A31545] dark:text-primary">
                        💡 Dica: Escolha um plano realista para manter a consistência nos estudos!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 pt-3 flex-shrink-0">
                  <button
                    onClick={() => setShowExplanation(false)}
                    className="w-full bg-[#A31545] dark:bg-[#F48FB1] text-white py-3.5 rounded-2xl text-sm font-bold tracking-wide active:bg-[#7D1133] dark:active:bg-[#EC407A]"
                  >
                    ESCOLHER PLANO
                  </button>
                </div>
              </>
            ) : (
              /* Tela de Seleção */
              <>
                <div className="px-4 mb-3 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h3 className="text-base font-semibold dark:text-gray-100">Plano de Estudos</h3>
                    <p className="text-[10px] text-orange-600 dark:text-orange-400 font-medium mt-0.5">
                      ⚠️ Você está alterando seu plano atual
                    </p>
                  </div>
                  <button
                    onClick={() => setShowStudyPlanModal(false)}
                    className="p-1 rounded-full bg-gray-100 dark:bg-accent active:bg-gray-200 dark:active:bg-gray-600"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 px-4 mb-3 flex-shrink-0">
                  Escolha a meta de estudos que se encaixa na sua rotina:
                </p>

                <div className="flex-1 overflow-y-auto px-4 space-y-2.5 pb-2">
                  {studyPlans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all active:scale-[0.99] text-left ${
                        selectedPlan === plan.id
                          ? "border-[#A31545] dark:border-[#F48FB1] bg-pink-50 dark:bg-pink-900/30"
                          : "border-gray-100 dark:border-border bg-gray-50 dark:bg-background"
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{plan.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {plan.title}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${plan.tagColor}`}>
                            {plan.tag}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{plan.description}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                          ~{plan.hours}h por semana
                        </p>
                      </div>
                      {selectedPlan === plan.id && (
                        <div className="w-6 h-6 bg-[#A31545] dark:bg-[#F48FB1] rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="px-4 pt-3 flex-shrink-0">
                  <button
                    onClick={handleSavePlan}
                    className={`w-full py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all ${
                      justSaved
                        ? "bg-green-500 dark:bg-green-600 text-white"
                        : "bg-[#A31545] dark:bg-[#F48FB1] text-white active:bg-[#7D1133] dark:active:bg-[#EC407A]"
                    }`}
                  >
                    {justSaved ? "✓ SALVO!" : "SALVAR"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Plan Confirmation Modal (Bottom Sheet) */}
      {showPlanConfirmation && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowPlanConfirmation(false)}
          />
          {/* Sheet */}
          <div className="relative bg-white dark:bg-card rounded-t-3xl pt-3 pb-6 max-h-[80%] flex flex-col">
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />

            <div className="px-4 mb-3 flex items-center justify-between flex-shrink-0">
              <h3 className="text-base font-semibold dark:text-gray-100">Plano de Estudos</h3>
              <button
                onClick={() => setShowPlanConfirmation(false)}
                className="p-1 rounded-full bg-gray-100 dark:bg-accent active:bg-gray-200 dark:active:bg-gray-600"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-4xl">📚</span>
                </div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Plano de Estudos Atualizado
                </h4>
              </div>

              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Você selecionou o plano <strong>{activePlan?.title}</strong>.
                </p>
                <p>
                  {planHabits[activePlan?.id as number]?.habits}
                </p>
                <div className="bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 rounded-xl p-3 mt-4">
                  <p className="text-xs font-medium text-[#A31545] dark:text-primary">
                    {planHabits[activePlan?.id as number]?.notification}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-4 pt-3 flex-shrink-0">
              <button
                onClick={() => setShowPlanConfirmation(false)}
                className="w-full bg-[#A31545] dark:bg-[#F48FB1] text-white py-3.5 rounded-2xl text-sm font-bold tracking-wide active:bg-[#7D1133] dark:active:bg-[#EC407A]"
              >
                FECHAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jornada Onboarding Modal — centro da tela, padrão visual da loja */}
      {showJornadaOnboarding && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-card rounded-3xl p-6 w-full text-center shadow-xl">

            {/* Ícone central */}
            <div className="w-16 h-16 bg-gradient-to-br from-[#EC407A] to-[#A31545] dark:from-[#F48FB1] dark:to-[#EC407A] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🦄</span>
            </div>

            {/* Título + descrição */}
            <h3 className="font-black text-[#2F2F35] dark:text-gray-100 mb-1 text-lg">
              Sua jornada no app
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
              Veja como evoluir e ganhar recompensas enquanto aprende
            </p>

            {/* Etapas */}
            <div className="space-y-3 mb-6 text-left">

              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-3 flex items-start gap-3">
                <ThemedIcon lightSrc={iconPlayLight} darkSrc={iconPlayDark} alt="Aulas" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mb-0.5">Aprender</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Assista às aulas para avançar no curso e ganhar pontos
                  </p>
                </div>
              </div>

              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-3 flex items-start gap-3">
                <ThemedIcon lightSrc={iconChatLight} darkSrc={iconChatDark} alt="Comentar" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mb-0.5">Interagir</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Participe comentando e trocando ideias com a comunidade
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 flex items-start gap-3">
                <ThemedIcon lightSrc={iconCheckLight} darkSrc={iconCheckDark} alt="Evoluir" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mb-0.5">Evoluir</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Complete aulas e conquistas para subir de nível
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 flex items-start gap-3">
                <ThemedIcon lightSrc={iconGiftLight} darkSrc={iconGiftDark} alt="Recompensa" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mb-0.5">Ganhar</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Use seus pontos para resgatar recompensas na loja
                  </p>
                </div>
              </div>

            </div>

            {/* CTA */}
            <button
              onClick={() => {
                setShowJornadaOnboarding(false);
                localStorage.setItem("uniedu_home_onboarding_seen", "true");
              }}
              className="w-full bg-gradient-to-r from-[#A31545] to-[#7D1133] dark:from-[#F48FB1] dark:to-[#EC407A] text-white text-sm font-bold py-3 rounded-xl active:opacity-90"
            >
              ENTENDI
            </button>

          </div>
        </div>
      )}
    </div>
  );
}