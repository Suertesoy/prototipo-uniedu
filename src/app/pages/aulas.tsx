import { useState } from "react";
import { BottomNav } from "../components/bottom-nav";
import { Header } from "../components/header";
import { Search, Play, Clock, CheckCircle2, Download, BookOpen, Trash2, PenLine, Users, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router";
import { useNotes, Note } from "../context/notes-context";

/* ─── Color map (mirrors aula-detalhe) ───────────────────────────────── */
const colorStyles: Record<Note["color"], { bg: string; border: string; dot: string }> = {
  yellow: { bg: "bg-amber-50 dark:bg-amber-900/20",  border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-400" },
  pink:   { bg: "bg-pink-50 dark:bg-pink-900/20",   border: "border-pink-200 dark:border-pink-800",  dot: "bg-[#A31545]" },
  blue:   { bg: "bg-blue-50 dark:bg-blue-900/20",   border: "border-blue-200 dark:border-blue-800",  dot: "bg-blue-400" },
  green:  { bg: "bg-green-50 dark:bg-green-900/20",  border: "border-green-200 dark:border-green-800", dot: "bg-green-500" },
};

const fmtDate = (d: Date) =>
  d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

const modules = [
  {
    id: 1,
    name: "UX Strategy",
    color: "from-pink-400 to-rose-400",
    darkClass: "dark:bg-none dark:bg-card dark:border-l-4 dark:border-l-[#B51A52] dark:border-b dark:border-b-border dark:backdrop-blur-none",
    lessons: [
      { id: 1, title: "Introdução", duration: "12 min", completed: true },
      { id: 2, title: "Percepção Visual e Gestalt", duration: "25 min", completed: true },
      { id: 3, title: "Atenção, Memória, Familiaridade e Aesthetic Usability Effect", duration: "32 min", completed: true },
      { id: 4, title: "Heurísticas de Nielsen", duration: "45 min", completed: false },
      { id: 5, title: "As leis de UX", duration: "28 min", completed: false },
      { id: 6, title: "Trends, padrões emergentes e motivadores humanos", duration: "30 min", completed: false },
      { id: 7, title: "Métricas e importância", duration: "20 min", completed: false },
      { id: 8, title: "Lagging e Leading Metrics", duration: "22 min", completed: false },
      { id: 9, title: "High Tempo Testing", duration: "18 min", completed: false },
      { id: 10, title: "Métricas de vaidade", duration: "15 min", completed: false },
      { id: 11, title: "KPI — métricas e indicadores", duration: "35 min", completed: false },
      { id: 12, title: "NPS", duration: "10 min", completed: false },
      { id: 13, title: "CTR e Funil de Conversão", duration: "28 min", completed: false },
      { id: 14, title: "Usuários ativos e Matriz de Cohort", duration: "25 min", completed: false },
      { id: 15, title: "LTV e CAC", duration: "20 min", completed: false },
      { id: 16, title: "Churn Rate", duration: "12 min", completed: false },
      { id: 17, title: "Baseline", duration: "14 min", completed: false },
      { id: 18, title: "HEART", duration: "30 min", completed: false },
      { id: 19, title: "AARRR", duration: "35 min", completed: false },
    ],
  },
  {
    id: 2,
    name: "UI Design",
    color: "from-purple-400 to-pink-400",
    darkClass: "dark:bg-none dark:bg-card dark:border-l-4 dark:border-l-[#512DA8] dark:border-b dark:border-b-border dark:backdrop-blur-none",
    lessons: [
      { id: 20, title: "Cores — Princípios (light e dark mode)", duration: "40 min", completed: false },
      { id: 21, title: "Cores — Teoria e Acessibilidade", duration: "35 min", completed: false },
      { id: 22, title: "Cores — Aplicações em produtos e guias de estilo", duration: "45 min", completed: false },
      { id: 23, title: "Cores — Configurando o Design System no Figma", duration: "50 min", completed: false },
      { id: 24, title: "Tipografia — Princípios", duration: "38 min", completed: false },
      { id: 25, title: "Tipografia — Aplicações em produtos", duration: "42 min", completed: false },
    ],
  },
  {
    id: 3,
    name: "UX Writing",
    color: "from-blue-400 to-purple-400",
    darkClass: "dark:bg-none dark:bg-card dark:border-l-4 dark:border-l-[#283593] dark:border-b dark:border-b-border dark:backdrop-blur-none",
    lessons: [
      { id: 26, title: "O que é Tom de Voz", duration: "20 min", completed: false },
      { id: 27, title: "As 4 dimensões do Tom de Voz", duration: "25 min", completed: false },
      { id: 28, title: "Como criar Tom de Voz", duration: "35 min", completed: false },
      { id: 29, title: "Heurísticas universais", duration: "30 min", completed: false },
      { id: 30, title: "Botões", duration: "15 min", completed: false },
      { id: 31, title: "Títulos", duration: "18 min", completed: false },
      { id: 32, title: "Descrições", duration: "22 min", completed: false },
      { id: 33, title: "Estados vazios", duration: "20 min", completed: false },
      { id: 34, title: "Rótulos", duration: "12 min", completed: false },
      { id: 35, title: "Controles", duration: "16 min", completed: false },
      { id: 36, title: "Formulários", duration: "28 min", completed: false },
      { id: 37, title: "Auto preenchimento para campos", duration: "14 min", completed: false },
      { id: 38, title: "Textos transacionais", duration: "20 min", completed: false },
    ],
  },
  {
    id: 4,
    name: "UX Research",
    color: "from-emerald-400 to-teal-400",
    darkClass: "dark:bg-none dark:bg-card dark:border-l-4 dark:border-l-[#004D40] dark:border-b dark:border-b-border dark:backdrop-blur-none",
    lessons: [
      { id: 39, title: "Seleção de Participantes", duration: "45 min", completed: false },
      { id: 40, title: "Análise de Pesquisas", duration: "50 min", completed: false },
      { id: 41, title: "Relatório de Pesquisas", duration: "40 min", completed: false },
      { id: 42, title: "Questionários — Parte 1", duration: "35 min", completed: false },
      { id: 43, title: "Questionários — Parte 2", duration: "38 min", completed: false },
      { id: 44, title: "Pesquisas Longitudinais — Parte 1", duration: "42 min", completed: false },
      { id: 45, title: "Pesquisas Longitudinais — Parte 2", duration: "45 min", completed: false },
      { id: 46, title: "Estudo de Diário — Parte 1", duration: "30 min", completed: false },
      { id: 47, title: "Estudo de Diário — Parte 2", duration: "35 min", completed: false },
    ],
  },
];

const downloadedLessons = [
  {
    id: 4,
    title: "Heurísticas de Nielsen",
    module: "UX Strategy",
    size: "245 MB",
    downloadDate: "Hoje",
  },
  {
    id: 20,
    title: "Cores — Princípios (light e dark mode)",
    module: "UI Design",
    size: "412 MB",
    downloadDate: "Ontem",
  },
];

const onlineStudents = [
  { id: 1, name: "Ana M.", avatar: "👩", status: "online", currentLesson: "Percepção Visual e Gestalt" },
  { id: 2, name: "Carlos", avatar: "👨", status: "online", currentLesson: "Cores — Teoria e Acessibilidade" },
  { id: 3, name: "Beatriz", avatar: "👩‍💼", status: "online", currentLesson: "Heurísticas de Nielsen" },
  { id: 4, name: "Diego", avatar: "👨‍💻", status: "online", currentLesson: "O que é Tom de Voz" },
  { id: 5, name: "Elena", avatar: "👩‍🎓", status: "online", currentLesson: "Seleção de Participantes" },
  { id: 6, name: "Felipe", avatar: "👨‍🏫", status: "online", currentLesson: "As leis de UX" },
  { id: 7, name: "Gabriela", avatar: "👩‍💼", status: "online", currentLesson: "Botões" },
  { id: 8, name: "Hugo", avatar: "👨‍🎓", status: "online", currentLesson: "Tipografia — Princípios" },
];

export function AulasPage() {
  const { notes, deleteNote } = useNotes();
  const [activeTab, setActiveTab] = useState<"all" | "downloads" | "notes" | "turma">("all");
  const [openModuleId, setOpenModuleId] = useState<number | null>(1);
  const [deletedId, setDeletedId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletedId(id);
    setTimeout(() => {
      deleteNote(id);
      setDeletedId(null);
    }, 300);
  };

  /* Group notes by lesson */
  const notesByLesson = notes.reduce<Record<string, Note[]>>((acc, note) => {
    const key = note.lessonId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {});

  return (
    <div className="h-full bg-gray-50 dark:bg-background flex flex-col overflow-hidden">
      <Header title="Aulas" showBack={false} />

      {/* Search bar */}
      <div className="flex-shrink-0 bg-white dark:bg-card px-4 py-3 border-b border-gray-200 dark:border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar aulas..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-accent dark:text-gray-100 dark:placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A31545] dark:focus:ring-[#B8467A] text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 bg-white dark:bg-card border-b border-gray-200 dark:border-border flex">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-[#A31545] dark:border-[#B8467A] text-[#A31545] dark:text-primary"
              : "border-transparent text-gray-600 dark:text-gray-400"
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setActiveTab("turma")}
          className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "turma"
              ? "border-[#A31545] dark:border-[#B8467A] text-[#A31545] dark:text-primary"
              : "border-transparent text-gray-600 dark:text-gray-400"
          }`}
        >
          Turma ({onlineStudents.length})
        </button>
        <button
          onClick={() => setActiveTab("downloads")}
          className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "downloads"
              ? "border-[#A31545] dark:border-[#B8467A] text-[#A31545] dark:text-primary"
              : "border-transparent text-gray-600 dark:text-gray-400"
          }`}
        >
          Downloads
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "notes"
              ? "border-[#A31545] dark:border-[#B8467A] text-[#A31545] dark:text-primary"
              : "border-transparent text-gray-600 dark:text-gray-400"
          }`}
        >
          Notas
        </button>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="p-4 space-y-4">
          {activeTab === "all" && (
            <>
              {modules.map((module) => {
                const isExpanded = openModuleId === module.id;
                const completedCount = module.lessons.filter(l => l.completed).length;
                const totalCount = module.lessons.length;
                const progressPercentage = Math.round((completedCount / totalCount) * 100);

                return (
                <div key={module.id} className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border overflow-hidden">
                  {/* Module header */}
                  <div 
                    className={`bg-gradient-to-r ${module.color} ${module.darkClass} p-4 text-white dark:text-[#FCE4EC] cursor-pointer active:opacity-90 transition-opacity`}
                    onClick={() => setOpenModuleId(isExpanded ? null : module.id)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-lg font-bold">{module.name}</h3>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-white dark:text-[#FCE4EC]" /> : <ChevronDown className="w-5 h-5 text-white dark:text-[#FCE4EC]" />}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/90 dark:text-[#B0BEC5]">
                      <span>{totalCount} aulas</span>
                      <span>•</span>
                      <span>{completedCount} concluída{completedCount !== 1 ? 's' : ''}</span>
                    </div>
                    {/* Barra de progresso */}
                    <div className="w-full h-1.5 bg-white/30 dark:bg-black/40 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-white dark:bg-[#F06292] transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                    </div>
                  </div>

                  {/* Lessons */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-card">
                      {module.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          to={`/aulas/${lesson.id}`}
                          className="block p-4 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center">
                              {lesson.completed ? (
                                <CheckCircle2 className="w-7 h-7 text-green-500" />
                              ) : (
                                <Play className="w-7 h-7 text-[#A31545] dark:text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium mb-1 line-clamp-2 dark:text-gray-100">
                                {lesson.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{lesson.duration}</span>
                                {lesson.completed && (
                                  <span className="ml-auto text-green-600 dark:text-green-400 font-medium">
                                    Concluída
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )})}
            </>
          )}

          {activeTab === "turma" && (
            <>
              {/* Chat em grupo card */}
              <div className="bg-gradient-to-br from-[#A31545] to-pink-600 dark:from-[#1C0E15] dark:to-[#160B11] rounded-2xl shadow-md p-4 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold mb-0.5">Chat geral da turma</p>
                    <p className="text-xs text-white/80">{onlineStudents.length} pessoas online agora</p>
                  </div>
                </div>
                <Link to="/chat-turma" className="block w-full bg-white text-[#A31545] dark:text-[#B8467A] py-3 rounded-xl text-sm font-bold active:bg-white/90 shadow-sm text-center">
                  ENTRAR NO CHAT
                </Link>
              </div>

              {/* Info card */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-4">
                <div className="flex items-start gap-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">Estude com colegas</p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                      Converse sobre as aulas, tire dúvidas e troque experiências com outros estudantes que estão online agora.
                    </p>
                  </div>
                </div>
              </div>

              {/* Online students list */}
              <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold dark:text-gray-100">
                    <Users className="w-4 h-4 text-[#A31545] dark:text-primary" />
                    <span>Estudantes online</span>
                  </h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">{onlineStudents.length} online</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {onlineStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-background rounded-xl active:bg-gray-100 dark:active:bg-[#404040] transition-colors">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center text-xl">
                          {student.avatar}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#262626]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate dark:text-gray-100">{student.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          Assistindo: {student.currentLesson}
                        </p>
                      </div>
                      <button className="flex-shrink-0 p-2.5 bg-[#A31545] dark:bg-[#F48FB1] rounded-full active:bg-[#7D1133] dark:active:bg-[#EC407A] transition-colors">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "downloads" && (
            <>
              {downloadedLessons.length > 0 ? (
                <div className="space-y-3">
                  {downloadedLessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      to={`/aulas/${lesson.id}`}
                      className="block bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="p-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center">
                            <Download className="w-7 h-7 text-[#A31545] dark:text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{lesson.module}</p>
                            <h4 className="text-sm font-medium mb-2 line-clamp-2 dark:text-gray-100">
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>{lesson.size}</span>
                              <span>•</span>
                              <span>{lesson.downloadDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 dark:text-gray-100">Nenhuma aula baixada</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Faça download de aulas para assistir offline
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "notes" && (
            <>
              {notes.length === 0 ? (
                <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-8 text-center">
                  <div className="text-5xl mb-3">📝</div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Nenhuma anotação ainda</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                    Suas anotações feitas durante as aulas aparecerão aqui, organizadas por aula.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {Object.entries(notesByLesson).map(([lessonId, lessonNotes]) => {
                    const firstNote = lessonNotes[0];
                    return (
                      <div key={lessonId}>
                        {/* Lesson header */}
                        <div className="flex items-center gap-2 mb-2.5">
                          <div className="w-7 h-7 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-3.5 h-3.5 text-[#A31545] dark:text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{firstNote.lessonTitle}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500">{firstNote.moduleTitle} · {lessonNotes.length} anotação{lessonNotes.length !== 1 ? "s" : ""}</p>
                          </div>
                        </div>

                        {/* Notes for this lesson */}
                        <div className="space-y-2 pl-2 border-l-2 border-gray-100 dark:border-border ml-3.5">
                          {lessonNotes.map((note) => {
                            const cs = colorStyles[note.color];
                            const isDeleting = deletedId === note.id;
                            return (
                              <div
                                key={note.id}
                                className={`rounded-xl border-2 p-3 transition-all duration-300 ${cs.bg} ${cs.border} ${
                                  isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed flex-1">
                                    {note.content}
                                  </p>
                                  <button
                                    onClick={() => handleDelete(note.id)}
                                    className="p-1 rounded-full bg-white/60 dark:bg-white/10 active:bg-white flex-shrink-0 mt-0.5"
                                  >
                                    <Trash2 className="w-3 h-3 text-gray-400" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1.5 mt-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${cs.dot}`} />
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{fmtDate(note.createdAt)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Summary footer */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-3 flex items-center gap-3">
                    <PenLine className="w-4 h-4 text-[#A31545] dark:text-primary flex-shrink-0" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>{notes.length}</strong> anotações em{" "}
                      <strong>{Object.keys(notesByLesson).length}</strong> aula{Object.keys(notesByLesson).length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}