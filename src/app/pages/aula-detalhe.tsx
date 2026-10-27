import { useLevel } from "../context/level-context";
import { useCurrentLesson } from "../context/lesson-context";
import { useStore } from "../context/store-context";
import { useNotes, type Note } from "../context/notes-context";
import { LevelUpAnimation } from "../components/level-up-animation";
import { useDialogFocus } from "../hooks/use-dialog-focus";
import { useInertBackground } from "../hooks/use-inert-background";
import { useState, useRef, useEffect, useId } from "react";
import { BottomNav } from "../components/bottom-nav";
import { Header } from "../components/header";
import { PrimaryButton } from "../components/primary-button";
import {
  Play,
  MessageSquare,
  FileText,
  Share2,
  Bookmark,
  ThumbsUp,
  Download,
  Users,
  PenLine,
  Trash2,
  Plus,
  X,
  Check,
  ChevronRight,
  Coins,
  ShoppingBag,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router";

/* ─── Lesson metadata map ─────────────────────────────────────────────── */
const lessonMap: Record<string, { title: string; module: string; description: string }> = {
  "1": { title: "Introdução", module: "UX Strategy", description: "Visão geral e introdução ao universo de UX Strategy." },
  "2": { title: "Percepção Visual e Gestalt", module: "UX Strategy", description: "Princípios da percepção visual e como aplicá-los no design." },
  "3": { title: "Atenção, Memória, Familiaridade e Aesthetic Usability Effect", module: "UX Strategy", description: "Como a memória e a familiaridade afetam a experiência do usuário." },
  "4": { title: "Heurísticas de Nielsen", module: "UX Strategy", description: "Conheça as 10 heurísticas de usabilidade e aplique-as para avaliar e melhorar qualquer interface." },
  "5": { title: "As leis de UX", module: "UX Strategy", description: "Entenda as leis psicológicas aplicadas ao design de experiência." },
  "6": { title: "Trends, padrões emergentes e motivadores humanos", module: "UX Strategy", description: "Explorando as tendências e os motivadores humanos no design." },
  "7": { title: "Métricas e importância", module: "UX Strategy", description: "Por que as métricas são importantes e como defini-las." },
  "8": { title: "Lagging e Leading Metrics", module: "UX Strategy", description: "Diferença entre métricas de resultado e métricas de previsão." },
  "9": { title: "High Tempo Testing", module: "UX Strategy", description: "Estratégias para testar ideias rapidamente." },
  "10": { title: "Métricas de vaidade", module: "UX Strategy", description: "Como evitar métricas que não trazem valor real ao negócio." },
  "11": { title: "KPI — métricas e indicadores", module: "UX Strategy", description: "Definindo e acompanhando indicadores-chave de performance." },
  "12": { title: "NPS", module: "UX Strategy", description: "Avaliando a satisfação e lealdade dos usuários." },
  "13": { title: "CTR e Funil de Conversão", module: "UX Strategy", description: "Análise de funis e taxas de clique." },
  "14": { title: "Usuários ativos e Matriz de Cohort", module: "UX Strategy", description: "Entendendo a retenção através da análise de coortes." },
  "15": { title: "LTV e CAC", module: "UX Strategy", description: "Equilibrando o custo de aquisição e o valor do ciclo de vida do usuário." },
  "16": { title: "Churn Rate", module: "UX Strategy", description: "Entenda o que é churn e como trabalhar para reduzi-lo." },
  "17": { title: "Baseline", module: "UX Strategy", description: "Estabelecendo uma linha de base para acompanhar o progresso." },
  "18": { title: "HEART", module: "UX Strategy", description: "Framework HEART do Google para medir a experiência do usuário." },
  "19": { title: "AARRR", module: "UX Strategy", description: "Métricas para startups com o funil pirata." },
  "20": { title: "Cores — Princípios (light e dark mode)", module: "UI Design", description: "Princípios do uso de cores em interfaces." },
  "21": { title: "Cores — Teoria e Acessibilidade", module: "UI Design", description: "Garantindo a acessibilidade no contraste e escolha de cores." },
  "22": { title: "Cores — Aplicações em produtos e guias de estilo", module: "UI Design", description: "Como aplicar cores no guia de estilo de um produto." },
  "23": { title: "Cores — Configurando o Design System no Figma", module: "UI Design", description: "Organizando as cores em um sistema de design no Figma." },
  "24": { title: "Tipografia — Princípios", module: "UI Design", description: "Princípios da tipografia em interfaces digitais." },
  "25": { title: "Tipografia — Aplicações em produtos", module: "UI Design", description: "Aplicando tipografia e hierarquia visual na prática." },
  "26": { title: "O que é Tom de Voz", module: "UX Writing", description: "Entenda o conceito e a importância do tom de voz." },
  "27": { title: "As 4 dimensões do Tom de Voz", module: "UX Writing", description: "Explorando as dimensões fundamentais do tom de voz." },
  "28": { title: "Como criar Tom de Voz", module: "UX Writing", description: "Metodologia para criação de tom de voz para produtos." },
  "29": { title: "Heurísticas universais", module: "UX Writing", description: "Princípios universais da escrita para interfaces." },
  "30": { title: "Botões", module: "UX Writing", description: "Melhores práticas para textos de botões e CTAs." },
  "31": { title: "Títulos", module: "UX Writing", description: "Escrevendo títulos concisos e orientados à ação." },
  "32": { title: "Descrições", module: "UX Writing", description: "Redação de textos descritivos que ajudam o usuário." },
  "33": { title: "Estados vazios", module: "UX Writing", description: "Como desenhar e escrever para os empty states." },
  "34": { title: "Rótulos", module: "UX Writing", description: "Escrevendo rótulos claros para navegação e conteúdo." },
  "35": { title: "Controles", module: "UX Writing", description: "Textos curtos para controles de interface." },
  "36": { title: "Formulários", module: "UX Writing", description: "Boas práticas de UX Writing aplicadas a formulários." },
  "37": { title: "Auto preenchimento para campos", module: "UX Writing", description: "Facilitando a vida do usuário no preenchimento de campos." },
  "38": { title: "Textos transacionais", module: "UX Writing", description: "Como se comunicar claramente em e-mails e push notifications." },
  "39": { title: "Seleção de Participantes", module: "UX Research", description: "Como recrutar os usuários certos para a sua pesquisa." },
  "40": { title: "Análise de Pesquisas", module: "UX Research", description: "Técnicas para organizar e analisar os dados coletados." },
  "41": { title: "Relatório de Pesquisas", module: "UX Research", description: "Sintetizando e apresentando os resultados de forma acionável." },
  "42": { title: "Questionários — Parte 1", module: "UX Research", description: "Introdução à criação e aplicação de questionários estruturados." },
  "43": { title: "Questionários — Parte 2", module: "UX Research", description: "Análise aprofundada das respostas e identificação de padrões." },
  "44": { title: "Pesquisas Longitudinais — Parte 1", module: "UX Research", description: "Entenda como mapear mudanças de comportamento ao longo do tempo." },
  "45": { title: "Pesquisas Longitudinais — Parte 2", module: "UX Research", description: "Aprofunde-se nas técnicas de análise longitudinal." },
  "46": { title: "Estudo de Diário — Parte 1", module: "UX Research", description: "Como planejar e executar estudos de diário com usuários." },
  "47": { title: "Estudo de Diário — Parte 2", module: "UX Research", description: "Acompanhamento, engajamento e análise dos dados do diário." },
};

/* ─── Note color palette ───────────────────────────────────────────── */
/* Cores de organização pessoal (sem token semântico, mantidas). O rótulo dá
   nome acessível ao seletor e repete a cor em texto para leitores de tela. */
const colors: { key: Note["color"]; label: string; bg: string; border: string; dot: string }[] = [
  { key: "yellow", label: "Amarelo", bg: "bg-amber-50 dark:bg-amber-900/20",  border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-400" },
  { key: "pink",   label: "Rosa",    bg: "bg-pink-50 dark:bg-pink-900/20",   border: "border-pink-200 dark:border-pink-800",  dot: "bg-[#A31545]" },
  { key: "blue",   label: "Azul",    bg: "bg-blue-50 dark:bg-blue-900/20",   border: "border-blue-200 dark:border-blue-800",  dot: "bg-blue-400" },
  { key: "green",  label: "Verde",   bg: "bg-green-50 dark:bg-green-900/20",  border: "border-green-200 dark:border-green-800", dot: "bg-green-500" },
];

const colorStyle = (key: Note["color"]) =>
  colors.find((c) => c.key === key) ?? colors[0];

const fmtDate = (d: Date) =>
  d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

/* ─── File type helpers ───────────────────────────────────────────────── */
const getFileExt = (name: string) => name.split(".").pop()?.toUpperCase() ?? "";
const fileExtColor = (ext: string) => {
  if (ext === "PDF")  return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
  if (ext === "FIG")  return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
  if (ext === "XLSX") return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
  return "bg-gray-100 dark:bg-accent text-gray-600 dark:text-gray-300";
};
const fileUtility = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("slide")) return "Slides";
  if (n.includes("template")) return "Template";
  if (n.includes("checklist")) return "Checklist";
  return "Material";
};

/* ─── Comments / materials / students (unchanged) ───────────────────── */
const comments = [
  { id: 1, author: "Ana Silva", time: "2h atrás", text: "Adorei esta aula! Muito esclarecedora sobre o tema.", likes: 12 },
  { id: 2, author: "Carlos Mendes", time: "5h atrás", text: "Consegui aplicar isso no meu projeto, funcionou perfeitamente!", likes: 8 },
];
const materials = [
  { id: 1, name: "Slides da apresentação.pdf", size: "2.3 MB" },
  { id: 2, name: "Template de pesquisa.fig", size: "1.8 MB" },
  { id: 3, name: "Checklist de análise.xlsx", size: "0.5 MB" },
];
const studentsInLesson = [
  { id: 1, name: "Ana M.", avatar: "👩", status: "online" },
  { id: 2, name: "Carlos", avatar: "👨", status: "online" },
  { id: 3, name: "Beatriz", avatar: "👩‍💼", status: "paused" },
  { id: 4, name: "Diego", avatar: "👨‍💻", status: "online" },
  { id: 5, name: "Elena", avatar: "👩‍🎓", status: "paused" },
  { id: 6, name: "Felipe", avatar: "👨‍🏫", status: "online" },
];

export function AulaDetalhePage() {
  const { id = "1" } = useParams();
  const navigate = useNavigate();
  const lesson = lessonMap[id] ?? lessonMap["1"];

  const { getNotesByLesson, addNote, deleteNote, editNote } = useNotes();
  const lessonNotes = getNotesByLesson(id);
  const { level, addXP } = useLevel();
  const { setCurrentLesson } = useCurrentLesson();
  const { addPoints, userPoints } = useStore();

  /* ── Registra a aula atual no contexto global (usado pelo Chat, Comunidade, etc.) ── */
  useEffect(() => {
    setCurrentLesson({ id, title: lesson.title, module: lesson.module });
    // Limpar ao sair não é necessário — mantemos o contexto para o Chat saber de onde veio
  }, [id]);

  const [activeTab, setActiveTab] = useState<"comments" | "notes" | "content" | "students">("comments");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [xpClaimed, setXpClaimed] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ level: number; xp: number } | null>(null);

  // Reset states when lesson ID changes
  useEffect(() => {
    setIsPlaying(false);
    setVideoProgress(0);
    setLessonComplete(false);
    setXpClaimed(false);
    setShowLevelUp(false);
    setLevelUpData(null);
  }, [id]);

  /* ── Quick-note overlay (triggered from video ✏️ button) ── */
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [quickDraft, setQuickDraft] = useState("");
  const [selectedColor, setSelectedColor] = useState<Note["color"]>("yellow");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const quickNoteRef = useRef<HTMLDivElement>(null);
  // Quem abriu o editor (botão do vídeo, Nova anotação ou FAB). Guardado no
  // clique porque o Safari não foca botões tocados com o mouse.
  const quickNoteOpenerRef = useRef<HTMLElement | null>(null);
  const newNoteButtonRef = useRef<HTMLButtonElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const levelUpRef = useRef<HTMLDivElement>(null);

  const openQuickNote = (e: React.MouseEvent<HTMLElement>) => {
    quickNoteOpenerRef.current = e.currentTarget;
    setShowQuickNote(true);
  };
  const closeQuickNote = () => setShowQuickNote(false);

  /* ── Inline edit state ── */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  /* ── Deleted animation ── */
  const [deletedId, setDeletedId] = useState<string | null>(null);
  // Uma exclusão pendente por nota (animação de 300 ms antes de remover)
  const deleteTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const lessonNotesRef = useRef(lessonNotes);
  lessonNotesRef.current = lessonNotes;
  const deleteNoteRef = useRef(deleteNote);
  deleteNoteRef.current = deleteNote;

  // Saiu da página no meio da animação: a nota é removida na hora, sem mexer no foco
  useEffect(
    () => () => {
      deleteTimers.current.forEach((timer, noteId) => {
        clearTimeout(timer);
        deleteNoteRef.current(noteId);
      });
      deleteTimers.current.clear();
    },
    []
  );

  /* ── Toast ── */
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  /* ── Foco perdido por troca de estado ──
     O botão que recebeu o toque some quando o estado do vídeo muda (play →
     reprodução → resgate → próxima aula) e quando a edição de uma nota termina.
     Só recupera o foco se ele caiu no <body>; não interfere em quem já navegou. */
  const claimButtonRef = useRef<HTMLButtonElement>(null);
  const nextBannerButtonRef = useRef<HTMLButtonElement>(null);
  const editButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastEditedId = useRef<string | null>(null);
  const focusIsLost = () => !document.activeElement || document.activeElement === document.body;

  useEffect(() => {
    if (!lessonComplete || !focusIsLost()) return;
    if (!xpClaimed) claimButtonRef.current?.focus();
    else if (!showLevelUp) nextBannerButtonRef.current?.focus();
  }, [lessonComplete, xpClaimed, showLevelUp]);

  useEffect(() => {
    if (editingId) {
      lastEditedId.current = editingId;
      return;
    }
    const noteId = lastEditedId.current;
    lastEditedId.current = null;
    if (noteId && focusIsLost()) editButtonRefs.current[noteId]?.focus();
  }, [editingId]);

  const handlePlayVideo = () => {
    setIsPlaying(true);
    setVideoProgress(0);

    // Simulate 2-second video playback
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setVideoProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Video complete - just mark as complete, don't add XP yet
        setLessonComplete(true);
      }
    }, interval);
  };

  const handleClaimXP = () => {
    if (xpClaimed) return;
    setXpClaimed(true);
    addXP(50);
    addPoints(50); // +50 pts no saldo da loja
    setLevelUpData({ level: level + 1, xp: 50 });
    setShowLevelUp(true);
  };

  const handleCloseLevelUp = () => {
    setShowLevelUp(false);
  };

  const handleNextLesson = () => {
    const currentId = parseInt(id);
    const nextId = currentId + 1;

    // Se a próxima aula existir no mapa, navega para ela
    if (lessonMap[nextId.toString()]) {
      navigate(`/aulas/${nextId}`);
    } else {
      // Se não houver próxima aula, volta para a home
      navigate("/");
    }
  };

  const handleSaveNote = () => {
    if (!quickDraft.trim()) return;
    addNote({
      lessonId: id,
      lessonTitle: lesson.title,
      moduleTitle: lesson.module,
      content: quickDraft.trim(),
      color: selectedColor,
    });
    setQuickDraft("");
    setShowQuickNote(false);
    showToast("Anotação salva! 📝");
    setActiveTab("notes");
  };

  /* O botão Excluir some com a nota: se o foco ainda estava nela (ou caiu no
     <body>), passa para a próxima nota, senão a anterior, senão para Nova
     anotação. Se a pessoa já levou o foco para outro lugar, fica onde está. */
  const handleDelete = (noteId: string) => {
    if (deleteTimers.current.has(noteId)) return;
    setDeletedId(noteId);
    deleteTimers.current.set(noteId, setTimeout(() => {
      deleteTimers.current.delete(noteId);
      const active = document.activeElement;
      const focusWasOnNote =
        !active ||
        active === document.body ||
        active.closest("[data-note-id]")?.getAttribute("data-note-id") === noteId;
      const list = lessonNotesRef.current;
      const index = list.findIndex((n) => n.id === noteId);

      deleteNote(noteId);
      setDeletedId((current) => (current === noteId ? null : current));

      // index -1: a aula mudou durante a animação, a lista já é outra
      if (!focusWasOnNote || index === -1) return;
      const neighbor = [...list.slice(index + 1), ...list.slice(0, index).reverse()].find(
        (n) => !deleteTimers.current.has(n.id)
      );
      const target = neighbor
        ? rootRef.current?.querySelector<HTMLElement>(`[data-note-id="${neighbor.id}"] [data-note-delete]`)
        : newNoteButtonRef.current;
      target?.focus();
    }, 300));
  };

  const handleSaveEdit = (noteId: string) => {
    if (!editDraft.trim()) return;
    editNote(noteId, editDraft.trim());
    setEditingId(null);
    showToast("Anotação atualizada ✓");
  };

  /* ── Camadas modais: editor rápido e animação de XP ──
     Nunca abrem juntas (cada uma deixa a outra inalcançável), então um único
     fundo inerte serve às duas. Declarado antes dos diálogos: ao fechar, o
     inert sai antes de o foco voltar ao fundo. Toast e status (aria-live)
     continuam fora do inert e seguem anunciando. */
  useInertBackground(rootRef, showQuickNote || showLevelUp);

  useDialogFocus(quickNoteRef, showQuickNote, {
    // Escrever é a ação principal do editor
    initialFocus: () => textareaRef.current,
    fallbackFocus: () => {
      const opener = quickNoteOpenerRef.current;
      if (opener?.isConnected && opener.getClientRects().length > 0) return opener;
      return newNoteButtonRef.current ?? fabRef.current;
    },
    // Mesmo fechamento do X: o rascunho é mantido
    onEscape: closeQuickNote,
  });

  // Sem botões na fase de progresso: o foco vai para a própria camada. Quem
  // abriu (o banner de resgate) desmonta ao fechar: o foco vai para Próxima.
  useDialogFocus(levelUpRef, showLevelUp, {
    initialFocus: () => levelUpRef.current,
    fallbackFocus: () => nextBannerButtonRef.current,
    // Só dispensa a animação; o XP e os pontos já foram somados no resgate
    onEscape: handleCloseLevelUp,
  });

  const onlineCount = studentsInLesson.filter((s) => s.status === "online").length;
  const pausedCount = studentsInLesson.filter((s) => s.status === "paused").length;

  const tabs = [
    { key: "comments" as const, label: "Discussões",  icon: <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />, badge: comments.length },
    { key: "notes" as const,    label: "Notas",       icon: <PenLine className="w-3.5 h-3.5" aria-hidden="true" />,       badge: lessonNotes.length || null },
    { key: "content" as const,  label: "Arquivos",    icon: <FileText className="w-3.5 h-3.5" aria-hidden="true" />,      badge: null },
    { key: "students" as const, label: "Turma",       icon: <Users className="w-3.5 h-3.5" aria-hidden="true" />,         badge: onlineCount > 0 ? onlineCount : null },
  ];

  /* Mesmo padrão ARIA tabs da tela Aulas (rodada 3E): ativação automática,
     setas/Home/End movem foco e seleção, roving tabindex, um único tabpanel. */
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const idPrefix = useId();
  const tabId = (key: string) => `${idPrefix}-tab-${key}`;
  const panelId = `${idPrefix}-panel`;
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActiveTab(tabs[next].key);
    tabRefs.current[next]?.focus();
  };

  const quickNoteTitleId = `${idPrefix}-quick-note-title`;
  const quickNoteLessonId = `${idPrefix}-quick-note-lesson`;
  const quickNoteCounterId = `${idPrefix}-quick-note-counter`;
  const colorLabelId = `${idPrefix}-color-label`;
  const commentHintId = `${idPrefix}-comment-hint`;

  /* Anúncio não visual da reprodução simulada (região sempre montada). */
  const videoStatus = !isPlaying
    ? ""
    : !lessonComplete
      ? "Reproduzindo aula"
      : !xpClaimed
        ? "Aula concluída. Resgate de +50 XP disponível."
        : showLevelUp
          ? ""
          : "Aula concluída. Próxima aula disponível.";

  /* ── Comment state ── */
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState(comments);
  const [commentFlash, setCommentFlash] = useState(false);

  const handlePublishComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: "Você",
      time: "agora",
      text: commentText.trim(),
      likes: 0,
    };
    setCommentList((prev) => [newComment, ...prev]);
    addPoints(10);
    setCommentText("");
    setCommentFlash(true);
    setTimeout(() => setCommentFlash(false), 2000);
    showToast("💬 +10 pts por comentar!");
  };

  return (
    <div ref={rootRef} className="h-full bg-bg-page flex flex-col overflow-hidden relative">
      {/* ─────────────────────────────────────────────────────────────────
          HEADER — module as title, lesson name as subtitle.
          Both truncate to 1 line; long strings never break the layout.
      ───────────────────────────────────────────────────────────────── */}
      <Header
        title={lesson.module}
        subtitle={lesson.title}
        actions={
          <div className="flex gap-1">
            {/* Compartilhar ainda não tem ação no protótipo (pendência registrada) */}
            <button
              type="button"
              aria-label="Compartilhar aula"
              className="p-2.5 rounded-full text-header-fg active:bg-header-overlay-pressed outline-none focus-visible:ring-2 focus-visible:ring-header-fg"
            >
              <Share2 className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Salvar aula"
              aria-pressed={isSaved}
              className="p-2.5 rounded-full active:bg-header-overlay-pressed outline-none focus-visible:ring-2 focus-visible:ring-header-fg"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Bookmark
                className={`w-5 h-5 ${isSaved ? "fill-header-fg text-header-fg" : "text-header-fg-muted"}`}
                aria-hidden="true"
              />
            </button>
          </div>
        }
      />

      {/* ─────────────────────────────────────────────────────────────────
          VIDEO — fixed 16/10 ratio for all lessons. Shadow for dominance.
          Gradiente decorativo igual à miniatura da Home (sem token, mantido).
      ───────────────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 relative bg-black shadow-lg"
        style={{ aspectRatio: "16/10" }}
      >
        {!isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545]">
            <button
              type="button"
              onClick={handlePlayVideo}
              aria-label="Reproduzir aula"
              className="relative w-18 h-18 bg-white/95 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform ring-4 ring-white/30 outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {/* Ícone sempre pink-700: o rosa claro do Dark ficava 2,2:1 sobre o branco */}
              <Play className="w-9 h-9 text-[#A31545] ml-1" fill="currentColor" aria-hidden="true" />
            </button>
          </div>
        ) : lessonComplete && xpClaimed && !showLevelUp ? (
          /* ── Compact "próxima aula" banner ── */
          <div className="absolute inset-0 bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545]">
            <div className="absolute inset-0 flex items-center justify-center opacity-30" aria-hidden="true">
              <Check className="w-20 h-20 text-white" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-teal-700 to-green-700 px-4 py-3 flex items-center gap-3">
              <div className="w-7 h-7 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="type-label-md text-white flex-1 min-w-0">
                Aula concluída! <span aria-hidden="true">🎉</span>
              </p>
              <button
                ref={nextBannerButtonRef}
                type="button"
                onClick={handleNextLesson}
                className="flex-shrink-0 min-h-9 bg-white text-green-700 px-3 rounded-lg type-label-sm flex items-center gap-1 active:bg-white/90 shadow-sm outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Próxima<span className="sr-only"> aula</span>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : lessonComplete ? (
          /* ── Compact "claim XP" banner ── */
          <div className="absolute inset-0 bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545]">
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <div className="text-white text-center opacity-50">
                <Check className="w-16 h-16 mx-auto" />
              </div>
            </div>
            {/* green/teal-700: branco sobre green-500/teal-500 ficava ~2,2:1 */}
            <button
              ref={claimButtonRef}
              type="button"
              onClick={handleClaimXP}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-green-700 to-teal-700 px-4 py-3 flex items-center gap-3 text-left active:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
            >
              <span className="w-7 h-7 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse" aria-hidden="true">
                <Check className="w-4 h-4 text-white" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block type-label-md text-white">Aula concluída!</span>
                <span className="block type-caption text-white">Toque para resgatar +50 XP</span>
              </span>
              <ChevronRight className="w-4 h-4 text-white flex-shrink-0" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
                {/* Pílula escura: branco direto sobre o centro do gradiente ficava 3,8:1 */}
                <p className="inline-block type-label-sm bg-black/30 rounded-full px-2.5 py-0.5 mb-2">Reproduzindo...</p>
                <div
                  role="progressbar"
                  aria-label="Progresso da reprodução"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(videoProgress)}
                  className="w-48 h-1 bg-white/30 rounded-full mx-auto overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✏️ Quick note button — always visible on video */}
        <button
          type="button"
          onClick={openQuickNote}
          className="absolute top-2 right-2 min-h-8 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full px-3 active:bg-black/80 transition-all outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <PenLine className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="type-label-sm">Anotar</span>
        </button>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {videoStatus}
      </p>

      {/* ── Loop nudge: aparece após resgatar XP ── */}
      {xpClaimed && !showLevelUp && (
        <Link
          to="/loja"
          className="flex-shrink-0 flex items-center gap-2.5 bg-gradient-to-r from-green-700 to-emerald-700 px-4 py-2 active:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-sm" aria-hidden="true">🎉</span>
            <div className="min-w-0">
              <p className="type-label-sm text-white">+50 pts ganhos nesta aula!</p>
              <p className="type-caption text-white">Você já pode trocar por recompensas na Loja</p>
            </div>
          </div>
          {/* Pílula branca: rótulo branco sobre white/20 ficava 3,5:1 */}
          <div className="flex items-center gap-1 bg-white text-green-700 rounded-full px-2.5 py-1 flex-shrink-0">
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="type-label-sm">Ver Loja</span>
          </div>
        </Link>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          ÁREA ROLÁVEL — informações da aula, abas (fixas no topo ao rolar)
          e conteúdo. Título e descrição completos (sem line-clamp): ficam
          dentro da rolagem para não espremer o conteúdo em alturas como 568px.
          pb-16: o último item pode rolar para acima do botão flutuante Anotar.
      ───────────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-16">
        <div className="bg-card px-4 pt-3 pb-3 border-b border-border-card">
          <h2 className="type-title-md text-text-content break-words mb-1">
            {lesson.title}
          </h2>
          <p className="type-body-md text-text-meta">
            {lesson.description}
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TABS — composição local, tokens tab/*. Ícone + contador na
            primeira linha e rótulo na segunda: os quatro destinos cabem
            em 320px sem colisão entre rótulo e contador.
        ───────────────────────────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Conteúdo da aula"
          className="sticky top-0 z-10 bg-card border-b border-border-card flex"
        >
          {tabs.map((tab, index) => {
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={tabId(tab.key)}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab.key)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                className={`flex-1 min-w-0 px-1 py-2 border-b-[3px] transition-colors flex flex-col items-center gap-0.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                  selected
                    ? "border-tab-indicator text-tab-active-fg"
                    : "border-transparent text-tab-inactive-fg"
                }`}
              >
                <span className="flex items-center gap-1 h-4">
                  {tab.icon}
                  {tab.badge != null && (
                    <span
                      aria-hidden="true"
                      className={`type-label-xs min-w-4 rounded-full px-1 ${
                        selected
                          ? "bg-primary/15 text-tab-active-fg"
                          : "bg-gray-100 dark:bg-accent text-tab-inactive-fg"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </span>
                <span className="type-label-sm whitespace-nowrap">
                  {tab.label}
                  {tab.badge != null && <span className="sr-only"> ({tab.badge})</span>}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TAB CONTENT
        ───────────────────────────────────────────────────────────── */}
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId(activeTab)}
          tabIndex={0}
          className="p-4 space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >

          {/* COMMENTS / DISCUSSÕES TAB */}
          {activeTab === "comments" && (
            <>
              {/* Microcopy — padronizado para todas as aulas. 8px gap acima do input. */}
              <p className="type-body-md text-text-meta">
                <span aria-hidden="true">💬 </span>Discussões assíncronas — Faça comentários ou nos conte a sacada da aula!
              </p>

              {/* ── Atalho: Tire suas dúvidas com IA/Monitor (violeta funcional, sem token) ── */}
              <button
                type="button"
                onClick={() => navigate("/chat")}
                className="w-full flex items-center gap-3 bg-violet-50 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-800 rounded-xl px-3 py-2.5 active:bg-violet-100 dark:active:bg-violet-900/20 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 text-sm" aria-hidden="true">🦄</div>
                <div className="flex-1 text-left min-w-0">
                  <p className="type-title-sm text-violet-800 dark:text-violet-200">
                    Dúvida sobre esta aula?
                  </p>
                  <p className="type-caption text-violet-700 dark:text-violet-300">
                    Fale com IA ou Monitor — resposta imediata
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-violet-700 dark:text-violet-300 flex-shrink-0" aria-hidden="true" />
              </button>

              <div className="bg-card rounded-2xl shadow-sm border border-border-card p-4">
                {/* Hint de pontos */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span
                    id={commentHintId}
                    className="type-label-sm bg-green-50 dark:bg-green-900/30 text-status-success-fg rounded-full px-2 py-0.5 flex items-center gap-1"
                  >
                    <span aria-hidden="true">💰</span> +10 pts por comentar
                  </span>
                </div>
                <textarea
                  aria-label="Escrever comentário"
                  aria-describedby={commentHintId}
                  placeholder="Compartilhe sua dúvida ou a sacada da aula..."
                  className="w-full p-3 bg-input-bg text-input-fg placeholder:text-input-placeholder type-body-md rounded-xl resize-none outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end mt-3">
                  <PrimaryButton onClick={handlePublishComment}>
                    Publicar
                  </PrimaryButton>
                </div>
              </div>
              <ul className="space-y-3">
                {commentList.map((comment) => (
                  <li key={comment.id} className="bg-card rounded-2xl shadow-sm border border-border-card p-4">
                    <div className="flex gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900/50 dark:to-purple-900/50 rounded-full flex-shrink-0" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2 mb-1">
                          <span className="type-title-sm text-text-content">{comment.author}</span>
                          <span className="type-caption text-text-meta">{comment.time}</span>
                        </div>
                        <p className="type-body-md text-text-content break-words mb-2">{comment.text}</p>
                        {/* Curtir ainda não tem ação no protótipo (pendência registrada) */}
                        <button
                          type="button"
                          aria-label={`Curtir comentário de ${comment.author}, ${comment.likes} curtidas`}
                          className="min-h-8 -ml-2 px-2 rounded-full flex items-center gap-1.5 type-label-sm text-text-meta active:text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* NOTES TAB */}
          {activeTab === "notes" && (
            <>
              {/* Add note CTA */}
              <button
                ref={newNoteButtonRef}
                type="button"
                onClick={openQuickNote}
                className="w-full border-2 border-dashed border-[#A31545]/40 dark:border-[#B8467A]/40 bg-pink-50/60 dark:bg-pink-900/10 rounded-2xl py-4 px-4 flex items-center justify-center gap-2.5 active:bg-pink-100 dark:active:bg-pink-900/20 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-sm flex-shrink-0" aria-hidden="true">
                  <Plus className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="text-left min-w-0">
                  <p className="type-title-sm text-primary">Nova anotação</p>
                  {/* Antes: "Salva automaticamente nesta aula" — a nota só é guardada ao tocar em SALVAR */}
                  <p className="type-caption text-text-meta">Toque em SALVAR para guardar nesta aula</p>
                </div>
              </button>

              {/* Notes list */}
              {lessonNotes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3" aria-hidden="true">📝</div>
                  <p className="type-title-sm text-text-content mb-1">Nenhuma anotação ainda</p>
                  <p className="type-body-md text-text-meta max-w-xs mx-auto">
                    Use o botão acima ou o botão Anotar para criar sua primeira anotação.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {lessonNotes.map((note) => {
                    const cs = colorStyle(note.color);
                    const isDeleting = deletedId === note.id;
                    const isEditing = editingId === note.id;

                    return (
                      <li
                        key={note.id}
                        data-note-id={note.id}
                        className={`rounded-2xl border-2 p-4 transition-all duration-300 ${cs.bg} ${cs.border} ${
                          isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100"
                        }`}
                      >
                        {/* Header row */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cs.dot}`} aria-hidden="true" />
                            <span className="sr-only">Anotação {cs.label.toLowerCase()}, </span>
                            {/* gray-600: text-meta (gray-500) sobre blue-50 ficava 4,4:1 */}
                            <time dateTime={note.createdAt.toISOString()} className="type-caption text-gray-600 dark:text-gray-400">
                              {fmtDate(note.createdAt)}
                            </time>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            {!isEditing && (
                              <button
                                ref={(el) => {
                                  editButtonRefs.current[note.id] = el;
                                }}
                                type="button"
                                aria-label="Editar anotação"
                                onClick={() => { setEditingId(note.id); setEditDraft(note.content); }}
                                className="p-2 rounded-full bg-white/70 dark:bg-white/10 active:bg-white outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <PenLine className="w-4 h-4 text-text-meta" aria-hidden="true" />
                              </button>
                            )}
                            <button
                              type="button"
                              data-note-delete
                              aria-label="Excluir anotação"
                              onClick={() => handleDelete(note.id)}
                              className="p-2 rounded-full bg-white/70 dark:bg-white/10 active:bg-white outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Trash2 className="w-4 h-4 text-text-meta" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        {isEditing ? (
                          <>
                            <textarea
                              aria-label="Editar anotação"
                              value={editDraft}
                              onChange={(e) => setEditDraft(e.target.value)}
                              autoFocus
                              className="w-full bg-white/80 dark:bg-white/10 rounded-xl p-3 type-body-md text-text-content resize-none outline-none focus:ring-2 focus:ring-ring min-h-[88px]"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="flex-1 py-2.5 rounded-lg bg-white/80 dark:bg-white/10 type-label-sm text-text-meta active:bg-white outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                Cancelar
                              </button>
                              <PrimaryButton
                                size="sm"
                                icon={<Check />}
                                onClick={() => handleSaveEdit(note.id)}
                                className="flex-1"
                              >
                                Salvar
                              </PrimaryButton>
                            </div>
                          </>
                        ) : (
                          <p className="type-body-md text-text-content whitespace-pre-line break-words">{note.content}</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {/* CONTENT / DOWNLOADS TAB */}
          {activeTab === "content" && (
            <>
              <div className="bg-card rounded-2xl shadow-sm border border-border-card p-4">
                <h3 className="mb-3 flex items-center gap-2 type-title-sm text-text-content">
                  <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span>Materiais da aula</span>
                </h3>
                <ul className="space-y-2">
                  {materials.map((material) => {
                    const ext = getFileExt(material.name);
                    const utility = fileUtility(material.name);
                    const displayName = material.name.replace(/\.[^/.]+$/, "");
                    return (
                      <li key={material.id}>
                        {/* Material demonstrativo: o botão ainda não baixa nada (pendência registrada) */}
                        <button
                          type="button"
                          aria-label={`${displayName}, ${utility} ${ext}, ${material.size}`}
                          className="w-full flex items-center gap-3 p-3 bg-bg-page rounded-xl active:bg-gray-100 dark:active:bg-[#404040] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-lesson-tile-start to-lesson-tile-end rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                            <Download className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={`type-label-sm px-1.5 rounded ${fileExtColor(ext)}`}>{ext}</span>
                              <span className="type-caption text-text-meta">{utility}</span>
                            </div>
                            <p className="type-title-sm text-text-content break-words">
                              {displayName}
                            </p>
                            <p className="type-caption text-text-meta">{material.size}</p>
                          </div>
                          <Download className="w-4 h-4 text-text-meta flex-shrink-0" aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border-card p-4">
                <h3 className="mb-2 type-title-sm text-text-content">Sobre a aula</h3>
                <p className="type-body-md text-gray-600 dark:text-gray-400">
                  Nesta aula você aprenderá sobre pesquisas longitudinais e sua aplicação no Design UX.
                  Vamos explorar métodos e técnicas avançadas para coletar dados ao longo do tempo.
                </p>
              </div>
            </>
          )}

          {/* STUDENTS TAB */}
          {activeTab === "students" && (
            <>
              {/* Chat ao vivo — gradiente de destaque sem token semântico (mantido, igual à tela Aulas) */}
              <div className="bg-gradient-to-br from-[#A31545] to-pink-600 dark:from-[#1C0E15] dark:to-[#160B11] rounded-2xl shadow-md p-4 text-white">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-0.5">
                      <p className="type-title-sm">Chat ao vivo</p>
                      <span className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                        <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" aria-hidden="true" />
                        <span className="type-label-sm">{onlineCount} online</span>
                      </span>
                    </div>
                    <p className="type-caption text-white">Interação em tempo real com quem está assistindo agora</p>
                  </div>
                </div>
                {/* Sem ação no protótipo (pendência registrada) */}
                <button
                  type="button"
                  className="w-full bg-white text-[#A31545] dark:text-[#B8467A] py-3 rounded-xl text-sm leading-5 font-bold tracking-[0.025em] active:bg-white/90 shadow-sm outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  ENTRAR NO CHAT
                </button>
              </div>

              {/* Lista de estudantes */}
              <div className="bg-card rounded-2xl shadow-sm border border-border-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-3">
                  <h3 className="flex items-center gap-2 type-title-sm text-text-content">
                    <Users className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span>Estudando agora</span>
                  </h3>
                  <p className="type-caption text-text-meta">Status em tempo real</p>
                </div>
                {/* Verde e laranja -700 no Light: green/orange-600 sobre os fundos -50 ficavam ~3:1 */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                    <p className="type-heading-md text-status-success-fg">{onlineCount}</p>
                    <p className="type-label-sm text-status-success-fg">Online</p>
                  </div>
                  <div className="flex-1 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 text-center">
                    <p className="type-heading-md text-orange-700 dark:text-orange-400">{pausedCount}</p>
                    <p className="type-label-sm text-orange-700 dark:text-orange-400">Pausado</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {studentsInLesson.map((student) => (
                    <li key={student.id} className="flex items-center gap-3 p-3 bg-bg-page rounded-xl">
                      <div className="relative flex-shrink-0" aria-hidden="true">
                        <div className="w-12 h-12 bg-gradient-to-br from-lesson-tile-start to-lesson-tile-end rounded-full flex items-center justify-center text-xl">
                          {student.avatar}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-bg-page ${
                          student.status === "online" ? "bg-status-success-icon" : "bg-orange-500"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="type-title-sm text-text-content truncate">{student.name}</p>
                        <p className={`type-caption ${student.status === "online" ? "text-status-success-fg" : "text-orange-700 dark:text-orange-400"}`}>
                          {student.status === "online" ? "Online agora" : "Pausado"}
                        </p>
                      </div>
                      {student.status === "online" && (
                        /* Sem ação no protótipo (pendência registrada, igual à tela Aulas) */
                        <button
                          type="button"
                          aria-label={`Enviar mensagem para ${student.name}`}
                          className="flex-shrink-0 p-2.5 bg-primary rounded-full active:bg-action-primary-pressed outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:ring-offset-bg-page"
                        >
                          <MessageSquare className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Next Lesson Button - Shows when lesson is complete */}
        {lessonComplete && xpClaimed && !showLevelUp && (
          <div className="p-4 pt-2">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border-2 border-green-200 dark:border-green-800 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-status-success-icon rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Check className="w-5 h-5 text-white dark:text-background" />
                </div>
                <div className="min-w-0">
                  <p className="type-title-sm text-status-success-fg">Aula concluída!</p>
                  <p className="type-caption text-status-success-fg">Próxima aula disponível</p>
                </div>
              </div>
              <PrimaryButton fullWidth onClick={handleNextLesson} className="shadow-md">
                ASSISTIR PRÓXIMA AULA
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>

      <BottomNav />

      {/* ── FAB: Anotar (floating above bottom nav) ── */}
      <button
        ref={fabRef}
        type="button"
        onClick={openQuickNote}
        className="absolute bottom-[72px] right-4 z-30 min-h-11 flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 shadow-lg active:bg-action-primary-pressed active:scale-95 transition-transform outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <PenLine className="w-4 h-4" aria-hidden="true" />
        <span className="type-label-md">Anotar</span>
      </button>

      {/* ── Quick Note Bottom Sheet ── diálogo modal (useDialogFocus + fundo inerte) */}
      {showQuickNote && (
        <div data-dialog-layer className="absolute inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50"
            aria-hidden="true"
            onClick={closeQuickNote}
          />
          <div
            ref={quickNoteRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={quickNoteTitleId}
            aria-describedby={quickNoteLessonId}
            className="relative bg-card rounded-t-3xl pt-3 pb-6 flex flex-col max-h-full overflow-y-auto"
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-3 flex-shrink-0" aria-hidden="true" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-4 pb-3 border-b border-border-divider flex-shrink-0">
              <div className="min-w-0">
                <h2 id={quickNoteTitleId} className="type-title-sm text-text-content">Nova anotação</h2>
                <p id={quickNoteLessonId} className="type-caption text-text-meta mt-0.5 line-clamp-2">{lesson.title}</p>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={closeQuickNote}
                className="flex-shrink-0 p-2 rounded-full bg-gray-100 dark:bg-accent active:bg-gray-200 dark:active:bg-[#525252] outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="w-4 h-4 text-text-meta" aria-hidden="true" />
              </button>
            </div>

            {/* Color picker — seleção indicada por anel (forma) e aria-pressed, não só pela cor */}
            <div role="group" aria-labelledby={colorLabelId} className="flex items-center gap-1 px-4 pt-3 pb-2">
              <span id={colorLabelId} className="type-label-sm text-text-meta mr-1">Cor:</span>
              {colors.map((c) => {
                const selected = selectedColor === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    aria-label={c.label}
                    aria-pressed={selected}
                    onClick={() => setSelectedColor(c.key)}
                    className="w-9 h-9 rounded-full flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      aria-hidden="true"
                      className={`w-6 h-6 rounded-full ${c.dot} transition-transform ${
                        selected ? "scale-110 ring-2 ring-offset-2 ring-text-content ring-offset-card" : ""
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Textarea */}
            <div className={`mx-4 rounded-2xl border-2 p-3 focus-within:ring-2 focus-within:ring-ring ${colorStyle(selectedColor).bg} ${colorStyle(selectedColor).border}`}>
              <textarea
                ref={textareaRef}
                aria-label="Texto da anotação"
                aria-describedby={quickNoteCounterId}
                placeholder="Digite sua anotação aqui..."
                value={quickDraft}
                onChange={(e) => setQuickDraft(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full bg-transparent type-body-md text-text-content placeholder:text-input-placeholder resize-none outline-none"
              />
              <p id={quickNoteCounterId} className="type-caption text-text-meta text-right">
                {quickDraft.length}/500<span className="sr-only"> caracteres</span>
              </p>
            </div>

            {/* Save button */}
            <div className="px-4 pt-3">
              <PrimaryButton
                size="lg"
                fullWidth
                icon={<PenLine />}
                onClick={handleSaveNote}
                disabled={!quickDraft.trim()}
              >
                SALVAR
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── região sempre montada para o anúncio funcionar; acima do FAB */}
      <div
        role="status"
        aria-live="polite"
        className="absolute bottom-[124px] left-4 right-4 z-50 flex justify-center pointer-events-none"
      >
        {toast && (
          <div className="bg-gray-900 text-white type-body-md px-5 py-3 rounded-2xl flex items-center gap-2 shadow-xl">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0" aria-hidden="true" />
            <span>{toast}</span>
          </div>
        )}
      </div>

      {/* ── Level Up Animation ── */}
      {levelUpData && (
        <LevelUpAnimation
          dialogRef={levelUpRef}
          isOpen={showLevelUp}
          onClose={handleCloseLevelUp}
          currentLevel={levelUpData.level}
          xpGained={levelUpData.xp}
        />
      )}
    </div>
  );
}
