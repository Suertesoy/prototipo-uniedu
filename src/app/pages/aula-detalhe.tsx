import { useLevel } from "../context/level-context";
import { useCurrentLesson } from "../context/lesson-context";
import { useStore } from "../context/store-context";
import { useNotes } from "../context/notes-context";
import { LevelUpAnimation } from "../components/level-up-animation";
import { useState, useRef, useEffect } from "react";
import { BottomNav } from "../components/bottom-nav";
import { Header } from "../components/header";
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
const colors: { key: Note["color"]; bg: string; border: string; dot: string }[] = [
  { key: "yellow", bg: "bg-amber-50 dark:bg-amber-900/20",  border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-400" },
  { key: "pink",   bg: "bg-pink-50 dark:bg-pink-900/20",   border: "border-pink-200 dark:border-pink-800",  dot: "bg-[#A31545]" },
  { key: "blue",   bg: "bg-blue-50 dark:bg-blue-900/20",   border: "border-blue-200 dark:border-blue-800",  dot: "bg-blue-400" },
  { key: "green",  bg: "bg-green-50 dark:bg-green-900/20",  border: "border-green-200 dark:border-green-800", dot: "bg-green-500" },
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

  /* ── Inline edit state ── */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  /* ── Deleted animation ── */
  const [deletedId, setDeletedId] = useState<string | null>(null);

  /* ── Toast ── */
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (showQuickNote) setTimeout(() => textareaRef.current?.focus(), 100);
  }, [showQuickNote]);

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

  const handleDelete = (noteId: string) => {
    setDeletedId(noteId);
    setTimeout(() => {
      deleteNote(noteId);
      setDeletedId(null);
    }, 300);
  };

  const handleSaveEdit = (noteId: string) => {
    if (!editDraft.trim()) return;
    editNote(noteId, editDraft.trim());
    setEditingId(null);
    showToast("Anotação atualizada ✓");
  };

  const onlineCount = studentsInLesson.filter((s) => s.status === "online").length;
  const pausedCount = studentsInLesson.filter((s) => s.status === "paused").length;

  const tabs = [
    { key: "comments" as const, label: "Discussões",  icon: <MessageSquare className="w-3.5 h-3.5" />, badge: comments.length },
    { key: "notes" as const,    label: "Notas",       icon: <PenLine className="w-3.5 h-3.5" />,       badge: lessonNotes.length || null },
    { key: "content" as const,  label: "Arquivos",    icon: <FileText className="w-3.5 h-3.5" />,      badge: null },
    { key: "students" as const, label: "Turma",       icon: <Users className="w-3.5 h-3.5" />,         badge: onlineCount > 0 ? onlineCount : null },
  ];

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
    <div className="h-full bg-gray-50 dark:bg-background flex flex-col overflow-hidden relative">
      {/* ─────────────────────────────────────────────────────────────────
          HEADER — module as title, lesson name as subtitle.
          Both truncate to 1 line; long strings never break the layout.
      ───────────────────────────────────────────────────────────────── */}
      <Header
        title={lesson.module}
        subtitle={lesson.title}
        actions={
          <div className="flex gap-1">
            <button className="p-2 active:bg-white/20 rounded-full">
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 active:bg-white/20 rounded-full" onClick={() => setIsSaved(!isSaved)}>
              <Bookmark className={`w-5 h-5 ${isSaved ? "fill-white text-white" : "text-white/80"}`} />
            </button>
          </div>
        }
      />

      {/* ─────────────────────────────────────────────────────────────────
          VIDEO — fixed 16/10 ratio for all lessons. Shadow for dominance.
      ───────────────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 relative bg-black shadow-lg"
        style={{ aspectRatio: "16/10" }}
      >
        {!isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545]">
            <button
              onClick={handlePlayVideo}
              className="relative w-18 h-18 w-[72px] h-[72px] bg-white/95 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform ring-4 ring-white/30"
            >
              <Play className="w-9 h-9 text-[#A31545] dark:text-primary ml-1" fill="currentColor" />
            </button>
          </div>
        ) : lessonComplete && xpClaimed && !showLevelUp ? (
          /* ── Compact "próxima aula" banner ── */
          <div className="absolute inset-0 bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545]">
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <Check className="w-20 h-20 text-white" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-green-500 px-4 py-3 flex items-center gap-3">
              <div className="w-7 h-7 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-bold text-white flex-1">Aula concluída! 🎉</p>
              <button
                onClick={handleNextLesson}
                className="bg-white text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 active:bg-white/90 shadow-sm"
              >
                Próxima <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : lessonComplete ? (
          /* ── Compact "claim XP" banner ── */
          <div className="absolute inset-0 bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center opacity-50">
                <Check className="w-16 h-16 mx-auto" />
              </div>
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-green-500 to-teal-500 px-4 py-3 flex items-center gap-3 cursor-pointer active:opacity-90"
              onClick={handleClaimXP}
            >
              <div className="w-7 h-7 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">Aula concluída!</p>
                <p className="text-[10px] text-white/80">Toque para resgatar +50 XP</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/80" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs mb-2">Reproduzindo...</p>
                <div className="w-48 h-1 bg-white/30 rounded-full mx-auto overflow-hidden">
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
          onClick={() => setShowQuickNote(true)}
          className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full px-3 py-1.5 active:bg-black/80 transition-all"
        >
          <PenLine className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">Anotar</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          LESSON INFO — title (max 2 lines) + per-lesson description.
          Uses line-clamp so any title length is handled gracefully.
      ───────────────────────────────────────────────────────────────── */}

      {/* ── Loop nudge: aparece após resgatar XP ── */}
      {xpClaimed && !showLevelUp && (
        <Link
          to="/loja"
          className="flex-shrink-0 flex items-center gap-2.5 bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 active:opacity-90"
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-sm">🎉</span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-white leading-tight">+50 pts ganhos nesta aula!</p>
              <p className="text-[9px] text-white/80 truncate">Você já pode trocar por recompensas na Loja</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1 flex-shrink-0">
            <ShoppingBag className="w-3 h-3 text-white" />
            <span className="text-[10px] font-bold text-white">Ver Loja</span>
          </div>
        </Link>
      )}

      <div className="flex-shrink-0 bg-white dark:bg-card px-4 pt-3 pb-3 border-b border-gray-200 dark:border-border">
        <h2 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 mb-1">
          {lesson.title}
        </h2>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
          {lesson.description}
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          TABS — identical across all lessons. Active: underline 3px +
          font-semibold. Inactive: muted. Badge shows count when > 0.
      ───────────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white dark:bg-card border-b border-gray-200 dark:border-border flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 text-xs border-b-[3px] transition-colors flex flex-col items-center gap-0.5 ${
              activeTab === tab.key
                ? "border-[#A31545] dark:border-[#B8467A] text-[#A31545] dark:text-primary font-semibold"
                : "border-transparent text-gray-400 dark:text-gray-500 font-medium"
            }`}
          >
            {tab.icon}
            <span className="flex items-center gap-0.5">
              {tab.label}
              {tab.badge != null && (
                <span className={`text-[9px] rounded-full px-1 ${
                  activeTab === tab.key
                    ? "bg-[#A31545]/15 dark:bg-[#F48FB1]/20 text-[#A31545] dark:text-primary"
                    : "bg-gray-100 dark:bg-accent text-gray-500 dark:text-gray-400"
                }`}>
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          TAB CONTENT
      ───────────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="p-4 space-y-3">

          {/* COMMENTS / DISCUSSÕES TAB */}
          {activeTab === "comments" && (
            <>
              {/* Microcopy — padronizado para todas as aulas. 8px gap acima do input. */}
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                💬 Discussões assíncronas — Faça comentários ou nos conte a sacada da aula!
              </p>

              {/* ── Atalho: Tire suas dúvidas com IA/Monitor ── */}
              <button
                onClick={() => navigate("/chat")}
                className="w-full flex items-center gap-3 bg-violet-50 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-800 rounded-xl px-3 py-2.5 active:bg-violet-100 dark:active:bg-violet-900/20"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 text-sm">🦄</div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 truncate">
                    Dúvida sobre esta aula?
                  </p>
                  <p className="text-[10px] text-violet-500 dark:text-violet-500 truncate">
                    Fale com IA ou Monitor — resposta imediata
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-violet-400 flex-shrink-0" />
              </button>

              <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4">
                {/* Hint de pontos */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-[9px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-2 py-0.5 flex items-center gap-1">
                    💰 +10 pts por comentar
                  </span>
                </div>
                <textarea
                  placeholder="Compartilhe sua dúvida ou a sacada da aula..."
                  className="w-full p-3 bg-gray-50 dark:bg-background dark:text-gray-100 dark:placeholder-gray-500 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#A31545] dark:focus:ring-[#B8467A] text-sm placeholder-gray-400"
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handlePublishComment}
                    className="bg-[#A31545] dark:bg-[#F48FB1] text-white px-5 py-2 rounded-lg text-sm font-medium active:bg-[#7D1133] dark:active:bg-[#EC407A]"
                  >
                    Publicar
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {commentList.map((comment) => (
                  <div key={comment.id} className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4">
                    <div className="flex gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900/50 dark:to-purple-900/50 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium dark:text-gray-100">{comment.author}</span>
                          <span className="text-xs text-gray-400">{comment.time}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{comment.text}</p>
                        <button className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 active:text-[#A31545]">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* NOTES TAB */}
          {activeTab === "notes" && (
            <>
              {/* Add note CTA */}
              <button
                onClick={() => setShowQuickNote(true)}
                className="w-full border-2 border-dashed border-[#A31545]/40 dark:border-[#B8467A]/40 bg-pink-50/60 dark:bg-pink-900/10 rounded-2xl py-4 flex items-center justify-center gap-2.5 active:bg-pink-100 dark:active:bg-pink-900/20"
              >
                <div className="w-7 h-7 bg-[#A31545] dark:bg-[#F48FB1] rounded-full flex items-center justify-center shadow-sm">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#A31545] dark:text-primary">Nova anotação</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Salva automaticamente nesta aula</p>
                </div>
              </button>

              {/* Notes list */}
              {lessonNotes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Nenhuma anotação ainda</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed max-w-[200px] mx-auto">
                    Use o botão acima ou o ícone flutuante ✏️ para criar sua primeira anotação.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessonNotes.map((note) => {
                    const cs = colorStyle(note.color);
                    const isDeleting = deletedId === note.id;
                    const isEditing = editingId === note.id;

                    return (
                      <div
                        key={note.id}
                        className={`rounded-2xl border-2 p-4 transition-all duration-300 ${cs.bg} ${cs.border} ${
                          isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100"
                        }`}
                      >
                        {/* Header row */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${cs.dot}`} />
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">{fmtDate(note.createdAt)}</span>
                          </div>
                          <div className="flex gap-1">
                            {!isEditing && (
                              <button
                                onClick={() => { setEditingId(note.id); setEditDraft(note.content); }}
                                className="p-1.5 rounded-full bg-white/70 dark:bg-white/10 active:bg-white"
                              >
                                <PenLine className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(note.id)}
                              className="p-1.5 rounded-full bg-white/70 dark:bg-white/10 active:bg-white"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        {isEditing ? (
                          <>
                            <textarea
                              value={editDraft}
                              onChange={(e) => setEditDraft(e.target.value)}
                              autoFocus
                              className="w-full bg-white/80 dark:bg-white/10 rounded-xl p-2 text-sm text-gray-800 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-[#A31545]/40 min-h-[72px]"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => setEditingId(null)}
                                className="flex-1 py-1.5 rounded-lg bg-white/80 dark:bg-white/10 text-xs text-gray-500 dark:text-gray-400 font-medium active:bg-white"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleSaveEdit(note.id)}
                                className="flex-1 py-1.5 rounded-lg bg-[#A31545] dark:bg-[#F48FB1] text-xs text-white font-medium flex items-center justify-center gap-1 active:bg-[#7D1133]"
                              >
                                <Check className="w-3 h-3" /> Salvar
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{note.content}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* CONTENT / DOWNLOADS TAB */}
          {activeTab === "content" && (
            <>
              <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold dark:text-gray-100">
                  <FileText className="w-4 h-4 text-[#A31545] dark:text-primary" />
                  Materiais da aula
                </h3>
                <div className="space-y-2">
                  {materials.map((material) => {
                    const ext = getFileExt(material.name);
                    const utility = fileUtility(material.name);
                    return (
                      <button
                        key={material.id}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-background rounded-xl active:bg-gray-100 dark:active:bg-[#404040]"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Download className="w-5 h-5 text-[#A31545] dark:text-primary" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${fileExtColor(ext)}`}>{ext}</span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">{utility}</span>
                          </div>
                          <p className="text-sm font-medium truncate dark:text-gray-100">
                            {material.name.replace(/\.[^/.]+$/, "")}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{material.size}</p>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4">
                <h3 className="mb-2 text-sm dark:text-gray-100">Sobre a aula</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Nesta aula você aprenderá sobre pesquisas longitudinais e sua aplicação no Design UX.
                  Vamos explorar métodos e técnicas avançadas para coletar dados ao longo do tempo.
                </p>
              </div>
            </>
          )}

          {/* STUDENTS TAB */}
          {activeTab === "students" && (
            <>
              {/* Chat ao vivo */}
              <div className="bg-gradient-to-br from-[#A31545] to-pink-600 dark:from-[#1C0E15] dark:to-[#160B11] rounded-2xl shadow-md p-4 text-white">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold">Chat ao vivo</p>
                      <span className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                        <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                        <span className="text-[10px] font-medium">{onlineCount} online</span>
                      </span>
                    </div>
                    <p className="text-xs text-white/70">Interação em tempo real com quem está assistindo agora</p>
                  </div>
                </div>
                <button className="w-full bg-white text-[#A31545] dark:text-[#B8467A] py-2.5 rounded-xl text-sm font-bold active:bg-white/90 shadow-sm">
                  ENTRAR NO CHAT
                </button>
              </div>

              {/* Lista de estudantes */}
              <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold dark:text-gray-100">
                    <Users className="w-4 h-4 text-[#A31545] dark:text-primary" />
                    Estudando agora
                  </h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Status em tempo real</p>
                </div>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{onlineCount}</p>
                    <p className="text-[10px] text-green-700 dark:text-green-400">Online</p>
                  </div>
                  <div className="flex-1 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{pausedCount}</p>
                    <p className="text-[10px] text-orange-700 dark:text-orange-400">Pausado</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {studentsInLesson.map((student) => (
                    <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-background rounded-xl">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center text-xl">
                          {student.avatar}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#262626] ${
                          student.status === "online" ? "bg-green-500" : "bg-orange-400"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate dark:text-gray-100">{student.name}</p>
                        <p className={`text-xs ${student.status === "online" ? "text-green-600 dark:text-green-400" : "text-orange-500 dark:text-orange-400"}`}>
                          {student.status === "online" ? "Online agora" : "Pausado"}
                        </p>
                      </div>
                      {student.status === "online" && (
                        <button className="flex-shrink-0 p-2 bg-[#A31545] dark:bg-[#F48FB1] rounded-full active:bg-[#7D1133] dark:active:bg-[#EC407A]">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Next Lesson Button - Shows when lesson is complete */}
        {lessonComplete && xpClaimed && !showLevelUp && (
          <div className="p-4 pt-2">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border-2 border-green-200 dark:border-green-800 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-green-700 dark:text-green-400 font-medium">Aula concluída!</p>
                  <p className="text-[10px] text-green-600 dark:text-green-500">Próxima aula disponível</p>
                </div>
              </div>
              <button
                onClick={handleNextLesson}
                className="w-full bg-[#A31545] dark:bg-[#F48FB1] text-white py-3 rounded-xl text-sm font-bold active:bg-[#7D1133] dark:active:bg-[#EC407A] shadow-md"
              >
                ASSISTIR PRÓXIMA AULA
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />

      {/* ── FAB: Anotar (floating above bottom nav) ── */}
      <button
        onClick={() => setShowQuickNote(true)}
        className="absolute bottom-[72px] right-4 z-30 flex items-center gap-2 bg-[#A31545] dark:bg-[#F48FB1] text-white rounded-full px-4 py-2.5 shadow-lg active:bg-[#7D1133] dark:active:bg-[#EC407A] active:scale-95 transition-transform"
      >
        <PenLine className="w-4 h-4" />
        <span className="text-xs font-semibold">Anotar</span>
      </button>

      {/* ── Quick Note Bottom Sheet ── */}
      {showQuickNote && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowQuickNote(false)}
          />
          <div className="relative bg-white dark:bg-card rounded-t-3xl pt-3 pb-6 flex flex-col">
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-3" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100 dark:border-border flex-shrink-0">
              <div>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">Nova anotação</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-[220px]">{lesson.title}</p>
              </div>
              <button
                onClick={() => setShowQuickNote(false)}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-accent active:bg-gray-200 dark:active:bg-[#525252]"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Color picker */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2">
              <span className="text-[10px] text-gray-400 mr-1">Cor:</span>
              {colors.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSelectedColor(c.key)}
                  className={`w-6 h-6 rounded-full ${c.dot} transition-transform ${
                    selectedColor === c.key ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : ""
                  }`}
                />
              ))}
            </div>

            {/* Textarea */}
            <div className={`mx-4 rounded-2xl border-2 p-3 ${colorStyle(selectedColor).bg} ${colorStyle(selectedColor).border}`}>
              <textarea
                ref={textareaRef}
                placeholder="Digite sua anotação aqui..."
                value={quickDraft}
                onChange={(e) => setQuickDraft(e.target.value)}
                rows={4}
                className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 leading-relaxed"
              />
              <p className="text-[10px] text-gray-400 text-right">{quickDraft.length}/500</p>
            </div>

            {/* Save button */}
            <div className="px-4 pt-3">
              <button
                onClick={handleSaveNote}
                disabled={!quickDraft.trim()}
                className={`w-full py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
                  quickDraft.trim()
                    ? "bg-[#A31545] text-white active:bg-[#7D1133]"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <PenLine className="w-4 h-4" />
                SALVAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="absolute bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-xl">
            <Check className="w-4 h-4 text-green-400" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* ── Level Up Animation ── */}
      {levelUpData && (
        <LevelUpAnimation
          isOpen={showLevelUp}
          onClose={handleCloseLevelUp}
          currentLevel={levelUpData.level}
          xpGained={levelUpData.xp}
        />
      )}
    </div>
  );
}