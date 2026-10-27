import { useEffect, useRef, useState, type RefObject } from "react";
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
import { PrimaryButton, PrimaryButtonLink } from "../components/primary-button";
import { ProgressBar } from "../components/progress-bar";
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

// Tags: fundo -100 claro nos dois temas, texto -700 (≥ 4,5:1; os tons -600 ficavam entre 2,9 e 4,3:1)
const studyPlans = [
  {
    id: 1,
    icon: "🔥",
    title: "Intensivo",
    description: "5 horas por dia, todos os dias",
    hours: 35,
    tag: "Mais rápido",
    tagColor: "bg-orange-100 text-orange-700",
  },
  {
    id: 2,
    icon: "💪",
    title: "Dedicado",
    description: "2 horas por dia, 5 dias na semana",
    hours: 10,
    tag: "Recomendado",
    tagColor: "bg-pink-100 text-[#A31545]",
  },
  {
    id: 3,
    icon: "⚖️",
    title: "Equilibrado",
    description: "3 dias na semana, 3 horas cada",
    hours: 9,
    tag: "Popular",
    tagColor: "bg-purple-100 text-purple-700",
  },
  {
    id: 4,
    icon: "🌙",
    title: "Noturno",
    description: "1 hora por dia, foco nos fins de semana",
    hours: 5,
    tag: "Flexível",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 5,
    icon: "🎯",
    title: "Consistente",
    description: "4 horas por dia, 4 dias na semana",
    hours: 16,
    tag: "Eficiente",
    tagColor: "bg-green-100 text-green-700",
  },
];

// Mesma chave gravada pelo onboarding inicial (App.tsx). Ausente, corrompida
// ou de um plano inexistente: cai no Dedicado, o plano recomendado.
const PLAN_STORAGE_KEY = "uniedu_study_plan_home_id";
const DEFAULT_PLAN_ID = 2;

function readSavedPlanId() {
  const id = Number(localStorage.getItem(PLAN_STORAGE_KEY));
  return studyPlans.some((p) => p.id === id) ? id : DEFAULT_PLAN_ID;
}

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

// ── Diálogos modais: foco e fundo inativo ─────────────────────────────────────
// Só entra no ciclo o que o Tab alcançaria: ficam fora desabilitados,
// tabindex="-1", ocultos (display/visibility) e o que estiver sob [inert].
const TABBABLE =
  'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

function getTabbable(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (el) =>
      el.tabIndex >= 0 &&
      !el.matches(":disabled") &&
      !el.closest("[inert]") &&
      el.getClientRects().length > 0 &&
      getComputedStyle(el).visibility !== "hidden"
  );
}

interface DialogFocusOptions {
  /** Destino do foco ao abrir. */
  initialFocus: () => HTMLElement | null | undefined;
  /** Destino ao fechar quando quem abriu não existe mais (ou não houve quem abrisse). */
  fallbackFocus: () => HTMLElement | null | undefined;
  /** Esc: o mesmo fechamento do botão do diálogo. */
  onEscape: () => void;
  /** false quando outro diálogo vai assumir o foco logo em seguida. */
  shouldRestoreFocus?: () => boolean;
}

function useDialogFocus(
  dialogRef: RefObject<HTMLElement | null>,
  open: boolean,
  options: DialogFocusOptions
) {
  const latest = useRef(options);
  latest.current = options;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    const active = document.activeElement;
    const opener =
      active instanceof HTMLElement && active !== document.body && !dialog.contains(active)
        ? active
        : null;

    (latest.current.initialFocus() ?? getTabbable(dialog)[0])?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        latest.current.onEscape();
        return;
      }
      if (event.key !== "Tab") return;

      event.preventDefault();
      const items = getTabbable(dialog);
      if (items.length === 0) return;
      const current = document.activeElement;
      const index = items.indexOf(current as HTMLElement);
      let next: HTMLElement | undefined;
      if (index !== -1) {
        next = items[(index + (event.shiftKey ? items.length - 1 : 1)) % items.length];
      } else if (current && dialog.contains(current)) {
        // Foco num elemento não tabulável do diálogo (o título focado na abertura):
        // segue a ordem do documento a partir dele
        const after = items.filter(
          (el) => current.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING
        );
        next = event.shiftKey ? items[items.length - after.length - 1] : after[0];
      }
      (next ?? (event.shiftKey ? items[items.length - 1] : items[0])).focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (latest.current.shouldRestoreFocus?.() === false) return;
      // isConnected: no desmonte da página (ou se o controle sumiu) nada é focado
      const target = opener?.isConnected ? opener : latest.current.fallbackFocus();
      if (target?.isConnected) target.focus();
    };
  }, [open, dialogRef]);
}

/** Torna inertes os filhos de `root` que não são camadas de diálogo
    ([data-home-dialog]). Nunca alcança um ancestral do diálogo e não
    trava a rolagem: as folhas e o onboarding continuam rolando.
    O que fica fora da Home (link do case no App Shell) é avisado pelo
    evento "uniedu-dialog", no mesmo padrão do "uniedu-logout". */
function useInertBackground(rootRef: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!active || !root) return;
    const background = Array.from(root.children).filter(
      (el) => !el.hasAttribute("data-home-dialog") && !el.hasAttribute("inert")
    );
    background.forEach((el) => el.setAttribute("inert", ""));
    window.dispatchEvent(new CustomEvent("uniedu-dialog", { detail: true }));
    return () => {
      background.forEach((el) => el.removeAttribute("inert"));
      window.dispatchEvent(new CustomEvent("uniedu-dialog", { detail: false }));
    };
  }, [rootRef, active]);
}

export function HomePage() {
  const { userPoints } = useStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showStudyPlanModal, setShowStudyPlanModal] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  // savedPlan espelha o localStorage; selectedPlan é só o rascunho da folha
  const [savedPlan, setSavedPlan] = useState(readSavedPlanId);
  const [selectedPlan, setSelectedPlan] = useState(savedPlan);
  const [justSaved, setJustSaved] = useState(false);
  const [showPlanConfirmation, setShowPlanConfirmation] = useState(false);
  const [confirmedPlanId, setConfirmedPlanId] = useState<number | null>(null);
  const [showJornadaOnboarding, setShowJornadaOnboarding] = useState(
    () => !localStorage.getItem("uniedu_home_onboarding_seen")
  );
  // Intervalo entre a folha fechar e a confirmação abrir (fluxo do SALVAR)
  const [confirmationPending, setConfirmationPending] = useState(false);
  const saveTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const rootRef = useRef<HTMLDivElement>(null);
  const planTriggerRef = useRef<HTMLDivElement>(null);
  const planSheetRef = useRef<HTMLDivElement>(null);
  const planSheetHeadingRef = useRef<HTMLHeadingElement>(null);
  const planConfirmRef = useRef<HTMLDivElement>(null);
  const planConfirmHeadingRef = useRef<HTMLHeadingElement>(null);
  const jornadaHelpRef = useRef<HTMLButtonElement>(null);
  const jornadaDialogRef = useRef<HTMLDivElement>(null);
  const jornadaTitleRef = useRef<HTMLHeadingElement>(null);

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

  const clearSaveTimers = () => {
    saveTimersRef.current.forEach(clearTimeout);
    saveTimersRef.current = [];
  };
  useEffect(() => clearSaveTimers, []);

  const handleSavePlan = () => {
    const planId = selectedPlan;
    // Grava antes do feedback: fechar durante o SALVO! não desfaz a escolha,
    // e se a gravação falhar nada abaixo roda (a interface não confirma)
    localStorage.setItem(PLAN_STORAGE_KEY, String(planId));
    clearSaveTimers();
    setSavedPlan(planId);
    setJustSaved(true);
    saveTimersRef.current.push(setTimeout(() => {
      setJustSaved(false);
      setShowStudyPlanModal(false);
      setConfirmationPending(true);
      saveTimersRef.current.push(setTimeout(() => {
        setConfirmationPending(false);
        setConfirmedPlanId(planId);
        setShowPlanConfirmation(true);
      }, 300));
    }, 800));
  };

  // Fechar a folha (X, backdrop ou Esc) cancela uma confirmação ainda agendada
  const closeStudyPlanModal = () => {
    clearSaveTimers();
    setJustSaved(false);
    setShowStudyPlanModal(false);
  };

  const dismissJornadaOnboarding = () => {
    setShowJornadaOnboarding(false);
    localStorage.setItem("uniedu_home_onboarding_seen", "true");
  };

  // Declarado antes dos diálogos: ao fechar, o inert sai antes de o foco voltar ao fundo
  useInertBackground(
    rootRef,
    showStudyPlanModal || confirmationPending || showPlanConfirmation || showJornadaOnboarding
  );

  const planTrigger = () => planTriggerRef.current?.querySelector("button");

  useDialogFocus(planSheetRef, showStudyPlanModal, {
    initialFocus: () => planSheetHeadingRef.current,
    fallbackFocus: planTrigger,
    onEscape: closeStudyPlanModal,
    // Salvou: a confirmação abre em seguida e assume o foco
    shouldRestoreFocus: () => !confirmationPending,
  });

  // A confirmação abre por timer, sem controle de origem: volta ao VER PLANO
  useDialogFocus(planConfirmRef, showPlanConfirmation, {
    initialFocus: () => planConfirmHeadingRef.current,
    fallbackFocus: planTrigger,
    onEscape: () => setShowPlanConfirmation(false),
  });

  // Na primeira visita abre sozinho: ao dispensar, o foco vai para o botão
  // "Entender a jornada", que é por onde o onboarding pode ser reaberto
  useDialogFocus(jornadaDialogRef, showJornadaOnboarding, {
    initialFocus: () => jornadaTitleRef.current,
    fallbackFocus: () => jornadaHelpRef.current,
    onEscape: dismissJornadaOnboarding,
  });

  // ESCOLHER PLANO troca o conteúdo da mesma folha e o botão desmonta:
  // o foco passa para o plano marcado
  useEffect(() => {
    if (!showStudyPlanModal || showExplanation) return;
    const sheet = planSheetRef.current;
    (
      sheet?.querySelector<HTMLElement>('[aria-pressed="true"]') ??
      sheet?.querySelector<HTMLElement>("[aria-pressed]")
    )?.focus();
  }, [showStudyPlanModal, showExplanation]);

  const activePlan = studyPlans.find((p) => p.id === savedPlan);
  const formattedPoints = userPoints.toLocaleString("pt-BR");

  return (
    <div ref={rootRef} className="h-full flex flex-col overflow-hidden bg-bg-page relative">
      {/* Header próprio da Home (não é Header/Page): logo, saudação, pontos e atalhos.
          Superfície sólida em header/bg-start, sem o degradê de Header/Page. */}
      <header className="bg-header-bg-start text-header-fg flex-shrink-0 pt-[calc(env(safe-area-inset-top,0px)+3.5rem)] pb-4 px-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Logo — única */}
            <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
              <img
                src={logoUniedu}
                alt="APP UNIEDU"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            {/* Spans em bloco: o !important de fonts.css só alcança o h1,
                então cada linha mantém a família do seu estilo Type/* */}
            <h1 className="min-w-0">
              <span className="block type-caption text-header-fg-muted">Olá,</span>
              <span className="block type-title-md text-header-fg truncate">Fernanda</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Points pill — live from store */}
            <Link
              to="/loja"
              aria-label={`${formattedPoints} pontos, abrir a loja`}
              className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 active:bg-white/30 outline-none focus-visible:ring-2 focus-visible:ring-header-fg"
            >
              <Coins className="w-3.5 h-3.5 text-yellow-200" aria-hidden="true" />
              <span className="type-label-sm text-header-fg tabular-nums">{formattedPoints}</span>
            </Link>
            {/* Toggle dark/light — acesso rápido */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
              className="p-1.5 rounded-full bg-white/20 active:bg-white/30 outline-none focus-visible:ring-2 focus-visible:ring-header-fg"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
            </button>
            {/* Sem ação no protótipo: recebeu só nome acessível e foco */}
            <button
              type="button"
              aria-label="Notificações"
              className="p-1.5 rounded-full bg-white/20 active:bg-white/30 outline-none focus-visible:ring-2 focus-visible:ring-header-fg"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5 pb-4">

          {/* ── Hero: Continuar aula (prioridade visual máxima) ── */}
          <section>
            <h2 className="type-heading-sm text-text-primary mb-2">
              Você está aqui:
            </h2>
            <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border-card">
              {/* Miniatura do vídeo: link para a aula (mesmo destino do CONTINUAR).
                  Nome acessível = prefixo sr-only + tempo assistido. */}
              <Link
                to="/aulas/1"
                className="group relative bg-gray-300 h-44 flex items-center justify-center active:opacity-90 cursor-pointer outline-none"
              >
                <span className="sr-only">Continuar aula: {currentLesson}.</span>
                <div className="absolute inset-0 bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545]" />
                {/* Play button — círculo branco nos dois temas, então o ícone fica
                    em pink-700 também no Dark (o rosa-claro dava 2,2:1) */}
                <div className="relative z-10 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-md" aria-hidden="true">
                  <Play
                    className="w-8 h-8 text-[#A31545] ml-1"
                    fill="currentColor"
                  />
                </div>
                {/* Time badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white type-caption tabular-nums px-2 py-0.5 rounded">
                  <span aria-hidden="true">{currentTime}/{totalTime}</span>
                  <span className="sr-only">Assistido {currentTime} de {totalTime}</span>
                </div>
                {/* Progresso de reprodução do vídeo — independente da ProgressBar de jornada */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30" aria-hidden="true">
                  <div
                    className="h-full bg-primary"
                    style={{ width: "65%" }}
                  />
                </div>
                {/* Indicador de foco por cima das camadas absolutas (um ring inset
                    ficaria sob o degradê). Duas cores: o branco some no rosa-claro
                    e o escuro no #A31545, mas sempre uma delas passa de 3:1. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 hidden rounded-t-2xl border-[3px] border-white shadow-[inset_0_0_0_2px_#120E10] group-focus-visible:block"
                />
              </Link>
              <div className="px-3 pt-2.5 pb-3">
                <p className="type-title-sm text-text-content mb-2.5">
                  {currentLesson}
                </p>
                <PrimaryButtonLink to="/aulas/1" size="sm" fullWidth>
                  CONTINUAR
                </PrimaryButtonLink>
              </div>
            </div>
          </section>

          {/* ── Jornada de aprendizado: checklist gamificado ── */}
          <section>
            {/* Light: o degradê começa em pink-700 (Tailwind) em vez de pink-300 (#F48FB1).
                Branco sobre o início antigo dava 2,2:1 justamente onde ficam o sobretítulo
                e as primeiras etapas; o ponto mais claro agora dá 5,9:1. Mesmo critério dos
                módulos na rodada 3D (-700 + texto branco). Dark inalterado. */}
            <div className="bg-gradient-to-br from-pink-700 via-[#A31545] to-[#7D1133] dark:from-[#1E1A1D] dark:via-[#1A1518] dark:to-[#1C0E15] dark:border dark:border-[#F48FB1]/30 rounded-2xl p-3.5 shadow-md">

              {/* Header: label + progresso + help */}
              <div className="flex items-center justify-between gap-2 mb-2">
                {/* Span em bloco: o !important de fonts.css só alcança o h2 (Overline é Inter) */}
                <h2 className="min-w-0">
                  <span className="block type-overline text-white/90">
                    Sua jornada de aprendizado
                  </span>
                </h2>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="type-label-xs text-white bg-white/15 px-1.5 py-0.5 rounded-full tabular-nums">
                    <span aria-hidden="true">{jornadaCount}/{jornadaTotal}</span>
                    <span className="sr-only">{jornadaCount} de {jornadaTotal} etapas concluídas</span>
                  </span>
                  <button
                    ref={jornadaHelpRef}
                    type="button"
                    onClick={() => setShowJornadaOnboarding(true)}
                    className="p-1 rounded-full active:bg-white/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label="Entender a jornada"
                  >
                    <HelpCircle className="w-4 h-4 text-white/90" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Barra de progresso */}
              <ProgressBar
                variant="journey"
                value={jornadaCount}
                max={jornadaTotal}
                label="Progresso da jornada de aprendizado"
                className="mb-3"
              />

              {/* Checklist */}
              <div className="space-y-2">
                {jornadaItems.map((item) => {
                  const done = jornadaDone.has(item.id);
                  const flashing = rewardFlash === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        handleJornadaToggle(item.id);
                        if (!done) navigate(item.route);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        done
                          ? "bg-white/20 border border-white/30"
                          : "bg-white/10 border border-white/10"
                      }`}
                    >
                      {/* Check circle */}
                      <div aria-hidden="true" className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all duration-300 ${
                        done
                          ? "bg-green-400 border-green-400"
                          : "border-white/40 bg-transparent"
                      }`}>
                        {done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>

                      {/* Icon + label — concluída = check + riscado (não só cor);
                          texto branco pleno nos dois estados (white/60 dava ~2,6:1) */}
                      <span className="text-sm flex-shrink-0" aria-hidden="true">{item.icon}</span>
                      <span className={`type-label-md text-white flex-1 min-w-0 text-left transition-all duration-300 ${
                        done ? "line-through" : ""
                      }`}>
                        {item.label}
                        <span className="sr-only">{done ? ", concluída" : ", pendente"}</span>
                      </span>

                      {/* Reward badge — contador compacto (Label/XS) */}
                      <span className={`type-label-xs px-1.5 py-0.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                        flashing
                          ? "scale-125 bg-yellow-400/60 text-yellow-100"
                          : done
                            ? "bg-green-400/30 text-white"
                            : "bg-white/15 text-white"
                      }`}>
                        {item.reward}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mensagem de conclusão ou incentivo */}
              {jornadaCount === jornadaTotal ? (
                <div className="mt-3 bg-white/20 rounded-xl px-3 py-2 text-center transition-all duration-300">
                  <p className="type-label-sm text-white">
                    🏆 Jornada completa! Incrível, continue assim!
                  </p>
                </div>
              ) : (
                <p className="mt-3 type-caption text-white/90 text-center transition-all duration-300">
                  Complete sua jornada de hoje para manter o ritmo.
                </p>
              )}
            </div>
          </section>

          {/* Cases e Mini Cases */}
          <section>
            <h2 className="type-heading-sm text-text-primary mb-0.5">
              Cases:
            </h2>
            <p className="type-caption text-text-meta mb-2.5">
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
                  className="flex-shrink-0 w-[128px] bg-gradient-to-br from-card to-pink-50 dark:to-[#1C0E15] border border-pink-100 dark:border-[#F48FB1]/20 rounded-2xl p-3.5 flex flex-col items-center justify-between active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  style={{ minHeight: "148px" }}
                >
                  <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <div className="text-4xl mb-1" aria-hidden="true">{cat.emoji}</div>
                    <p className="type-title-sm text-text-content text-center">
                      {cat.label}
                    </p>
                  </div>
                  {/* Rótulo visual de ação dentro do card-link (não é um 2º controle).
                      Tipografia = Button/Primary SM; texto em action/primary-fg, que no
                      Dark é escuro (branco sobre #F48FB1 dava 2,2:1). */}
                  <div className="w-full bg-gradient-to-r from-primary to-pink-600 dark:to-[#EC407A] text-xs leading-4 font-bold tracking-[0.025em] py-2.5 rounded-xl text-primary-foreground text-center shadow-sm">
                    ACESSAR
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Plano de estudos */}
          <section>
            <h2 className="sr-only">Plano de estudos</h2>
            <div className="bg-card rounded-2xl overflow-hidden shadow-md border border-border-card">
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
                    {/* Superfície clara fixa nos dois temas: texto fixo em gray-800 */}
                    <p className="type-caption text-gray-800">
                      {activePlan.icon} {activePlan.title}: {activePlan.description}
                    </p>
                  </div>
                )}
              </div>
              {/* ref no invólucro: PrimaryButton não repassa ref ao <button> */}
              <div ref={planTriggerRef} className="px-3 py-2.5">
                <PrimaryButton
                  size="sm"
                  fullWidth
                  onClick={() => {
                    setSelectedPlan(savedPlan);
                    setShowExplanation(true);
                    setShowStudyPlanModal(true);
                  }}
                >
                  VER PLANO
                </PrimaryButton>
              </div>
            </div>
          </section>

          {/* Tire suas dúvidas */}
          <section>
            <h2 className="sr-only">Tire suas dúvidas</h2>
            <div className="bg-card rounded-2xl overflow-hidden shadow-md border border-border-card">
              <div
                className="h-40 relative"
                style={{
                  backgroundImage: `url(${doubtImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="px-3 py-2.5">
                <PrimaryButtonLink to="/chat" size="sm" fullWidth>
                  TIRAR DÚVIDAS
                </PrimaryButtonLink>
              </div>
            </div>
          </section>
        </div>
      </div>

      <BottomNav />

      {/* Study Plan Modal (Bottom Sheet) */}
      {showStudyPlanModal && (
        <div data-home-dialog className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/50"
            onClick={closeStudyPlanModal}
          />
          {/* Sheet */}
          <div
            ref={planSheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-plan-sheet-title"
            className="relative bg-card rounded-t-3xl pt-3 pb-6 max-h-[80%] flex flex-col"
          >
            {/* Handle */}
            <div aria-hidden="true" className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />

            {showExplanation ? (
              /* Tela de Explicação */
              <>
                <div className="px-4 mb-3 flex items-center justify-between flex-shrink-0">
                  <h2 id="home-plan-sheet-title" className="type-title-md text-text-content">Plano de Estudos</h2>
                  <button
                    type="button"
                    onClick={closeStudyPlanModal}
                    aria-label="Fechar"
                    className="p-1 rounded-full bg-gray-100 dark:bg-accent active:bg-gray-200 dark:active:bg-gray-600 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="w-4 h-4 text-text-meta" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <div className="text-center mb-4">
                    <div aria-hidden="true" className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-4xl">📚</span>
                    </div>
                    {/* Foco inicial: título do conteúdo, dentro da área rolável
                        (leitura na ordem e setas/espaço rolam o texto) */}
                    <h3
                      ref={planSheetHeadingRef}
                      tabIndex={-1}
                      className="type-title-sm text-text-content mb-2 outline-none"
                    >
                      O que é o Plano de Estudos?
                    </h3>
                  </div>

                  {/* Texto explicativo longo: Body/LG (a folha já rola internamente) */}
                  <div className="space-y-3 type-body-lg text-gray-600 dark:text-gray-400">
                    <p>
                      O <strong>Plano de Estudos</strong> é uma ferramenta que te ajuda a organizar sua rotina de aprendizado de acordo com o tempo que você tem disponível.
                    </p>
                    <p>
                      Escolha um dos planos disponíveis baseado na sua disponibilidade semanal. Você pode alterar seu plano a qualquer momento conforme sua rotina muda.
                    </p>
                    <div className="bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 rounded-xl p-3 mt-4">
                      <p className="type-body-md text-primary">
                        💡 Dica: Escolha um plano realista para manter a consistência nos estudos!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 pt-3 flex-shrink-0">
                  <PrimaryButton size="lg" fullWidth onClick={() => setShowExplanation(false)}>
                    ESCOLHER PLANO
                  </PrimaryButton>
                </div>
              </>
            ) : (
              /* Tela de Seleção */
              <>
                <div className="px-4 mb-3 flex items-center justify-between gap-3 flex-shrink-0">
                  <div className="min-w-0">
                    <h2 id="home-plan-sheet-title" className="type-title-md text-text-content">Plano de Estudos</h2>
                    {/* orange-700 no Light: orange-600 sobre branco dava 3,6:1 */}
                    <p className="type-label-sm text-orange-700 dark:text-orange-400 mt-0.5">
                      ⚠️ Você está alterando seu plano atual
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeStudyPlanModal}
                    aria-label="Fechar"
                    className="flex-shrink-0 p-1 rounded-full bg-gray-100 dark:bg-accent active:bg-gray-200 dark:active:bg-gray-600 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="w-4 h-4 text-text-meta" aria-hidden="true" />
                  </button>
                </div>
                <p id="home-plan-options-hint" className="type-body-md text-text-meta px-4 mb-3 flex-shrink-0">
                  Escolha a meta de estudos que se encaixa na sua rotina:
                </p>

                {/* pt-1: espaço para o anel de foco do primeiro item dentro da área rolável.
                    Grupo rotulado: o foco chega direto no plano marcado e o leitor
                    de tela anuncia a instrução junto. */}
                <div
                  role="group"
                  aria-labelledby="home-plan-options-hint"
                  className="flex-1 overflow-y-auto px-4 pt-1 space-y-2.5 pb-2"
                >
                  {studyPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      aria-pressed={selectedPlan === plan.id}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all active:scale-[0.99] text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
                        selectedPlan === plan.id
                          ? "border-primary bg-pink-50 dark:bg-pink-900/30"
                          : "border-gray-100 dark:border-border bg-bg-page"
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0" aria-hidden="true">{plan.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-0.5">
                          <span className="type-title-sm text-text-content">
                            {plan.title}
                          </span>
                          <span className={`type-label-sm px-1.5 py-0.5 rounded-full ${plan.tagColor}`}>
                            {plan.tag}
                          </span>
                        </div>
                        {/* gray-600/400: text/meta (gray-500) ficaria 4,4:1 sobre o pink-50 do item selecionado */}
                        <p className="type-body-md text-gray-600 dark:text-gray-400">{plan.description}</p>
                        <p className="type-caption text-gray-600 dark:text-gray-400 mt-0.5">
                          ~{plan.hours}h por semana
                        </p>
                      </div>
                      {selectedPlan === plan.id && (
                        <div aria-hidden="true" className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="px-4 pt-3 flex-shrink-0">
                  {/* Button/Primary LG; o estado "salvo" troca a superfície por green-700
                      (branco 5,0:1; green-500/600 davam 2,2 e 3,3:1) */}
                  <PrimaryButton
                    size="lg"
                    fullWidth
                    onClick={handleSavePlan}
                    className={justSaved ? "bg-green-700 text-white enabled:active:bg-green-700" : undefined}
                  >
                    {justSaved ? "✓ SALVO!" : "SALVAR"}
                  </PrimaryButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Plan Confirmation Modal (Bottom Sheet) */}
      {showPlanConfirmation && (
        <div data-home-dialog className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowPlanConfirmation(false)}
          />
          {/* Sheet */}
          <div
            ref={planConfirmRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-plan-confirm-title"
            className="relative bg-card rounded-t-3xl pt-3 pb-6 max-h-[80%] flex flex-col"
          >
            {/* Handle */}
            <div aria-hidden="true" className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />

            <div className="px-4 mb-3 flex items-center justify-between flex-shrink-0">
              <h2 id="home-plan-confirm-title" className="type-title-md text-text-content">Plano de Estudos</h2>
              <button
                type="button"
                onClick={() => setShowPlanConfirmation(false)}
                aria-label="Fechar"
                className="p-1 rounded-full bg-gray-100 dark:bg-accent active:bg-gray-200 dark:active:bg-gray-600 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="w-4 h-4 text-text-meta" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="text-center mb-4">
                <div aria-hidden="true" className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-4xl">📚</span>
                </div>
                {/* Foco inicial (mesmo critério da explicação) */}
                <h3
                  ref={planConfirmHeadingRef}
                  tabIndex={-1}
                  className="type-title-sm text-text-content mb-2 outline-none"
                >
                  Plano de Estudos Atualizado
                </h3>
              </div>

              {/* Texto explicativo longo: Body/LG (a folha já rola internamente) */}
              <div className="space-y-3 type-body-lg text-gray-600 dark:text-gray-400">
                <p>
                  Você selecionou o plano <strong>{activePlan?.title}</strong>.
                </p>
                <p>
                  {planHabits[activePlan?.id as number]?.habits}
                </p>
                <div className="bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 rounded-xl p-3 mt-4">
                  <p className="type-body-md text-primary">
                    {planHabits[activePlan?.id as number]?.notification}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-4 pt-3 flex-shrink-0">
              <PrimaryButton size="lg" fullWidth onClick={() => setShowPlanConfirmation(false)}>
                FECHAR
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Jornada Onboarding Modal — centro da tela, padrão visual da loja */}
      {showJornadaOnboarding && (
        <div data-home-dialog className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
          {/* max-h-full + overflow-y-auto: em telas baixas (ex.: 320×568, 360×640) o
              conteúdo passava da altura e o ENTENDI ficava inalcançável */}
          <div
            ref={jornadaDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-jornada-title"
            aria-describedby="home-jornada-desc"
            className="bg-card rounded-3xl p-6 w-full max-h-full overflow-y-auto text-center shadow-xl"
          >

            {/* Ícone central */}
            <div aria-hidden="true" className="w-16 h-16 bg-gradient-to-br from-[#EC407A] to-[#A31545] dark:from-[#F48FB1] dark:to-[#EC407A] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🦄</span>
            </div>

            {/* Título + descrição */}
            {/* Foco inicial no título: em telas baixas o ENTENDI fica abaixo da
                dobra e focá-lo rolaria o conteúdo para fora da vista */}
            <h2
              ref={jornadaTitleRef}
              id="home-jornada-title"
              tabIndex={-1}
              className="type-heading-sm text-text-primary mb-1 outline-none"
            >
              Sua jornada no app
            </h2>
            <p id="home-jornada-desc" className="type-body-md text-text-meta mb-5">
              Veja como evoluir e ganhar recompensas enquanto aprende
            </p>

            {/* Etapas */}
            <div className="space-y-3 mb-6 text-left">

              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-3 flex items-start gap-3">
                <ThemedIcon lightSrc={iconPlayLight} darkSrc={iconPlayDark} alt="" className="w-5 h-5 flex-shrink-0" />
                <div>
                  <h3 className="type-title-sm text-text-content mb-0.5">Aprender</h3>
                  <p className="type-body-md text-gray-600 dark:text-gray-400">
                    Assista às aulas para avançar no curso e ganhar pontos
                  </p>
                </div>
              </div>

              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-3 flex items-start gap-3">
                <ThemedIcon lightSrc={iconChatLight} darkSrc={iconChatDark} alt="" className="w-5 h-5 flex-shrink-0" />
                <div>
                  <h3 className="type-title-sm text-text-content mb-0.5">Interagir</h3>
                  <p className="type-body-md text-gray-600 dark:text-gray-400">
                    Participe comentando e trocando ideias com a comunidade
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 flex items-start gap-3">
                <ThemedIcon lightSrc={iconCheckLight} darkSrc={iconCheckDark} alt="" className="w-5 h-5 flex-shrink-0" />
                <div>
                  <h3 className="type-title-sm text-text-content mb-0.5">Evoluir</h3>
                  <p className="type-body-md text-gray-600 dark:text-gray-400">
                    Complete aulas e conquistas para subir de nível
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 flex items-start gap-3">
                <ThemedIcon lightSrc={iconGiftLight} darkSrc={iconGiftDark} alt="" className="w-5 h-5 flex-shrink-0" />
                <div>
                  <h3 className="type-title-sm text-text-content mb-0.5">Ganhar</h3>
                  <p className="type-body-md text-gray-600 dark:text-gray-400">
                    Use seus pontos para resgatar recompensas na loja
                  </p>
                </div>
              </div>

            </div>

            {/* CTA — mantém o degradê próprio; as paradas são exatamente
                action/primary → action/primary-pressed nos dois temas.
                Tipografia e foco = Button/Primary MD; texto em action/primary-fg
                (branco sobre #F48FB1 no Dark dava 2,2:1). */}
            <button
              type="button"
              onClick={dismissJornadaOnboarding}
              className="w-full bg-gradient-to-r from-primary to-action-primary-pressed text-primary-foreground text-sm leading-5 font-bold tracking-[0.025em] py-3 rounded-xl active:opacity-90 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              ENTENDI
            </button>

          </div>
        </div>
      )}
    </div>
  );
}