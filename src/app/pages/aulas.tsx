import { useId, useRef, useState } from "react";
import { BottomNav } from "../components/bottom-nav";
import { Header } from "../components/header";
import { ModuleCard, type ModuleColor } from "../components/module-card";
import { LessonCard } from "../components/lesson-card";
import { Search, Download, BookOpen, Trash2, PenLine, Users, MessageSquare } from "lucide-react";
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
    color: "pink" as ModuleColor,
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
    color: "purple" as ModuleColor,
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
    color: "blue" as ModuleColor,
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
    color: "green" as ModuleColor,
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

type AulasTab = "all" | "downloads" | "notes" | "turma";

/* Ordem visual das abas (Todas · Turma · Downloads · Notas) */
const tabs: { id: AulasTab; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "turma", label: `Turma (${onlineStudents.length})` },
  { id: "downloads", label: "Downloads" },
  { id: "notes", label: "Notas" },
];

export function AulasPage() {
  const { notes, deleteNote } = useNotes();
  const [activeTab, setActiveTab] = useState<AulasTab>("all");
  const [openModuleId, setOpenModuleId] = useState<number | null>(1);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const idPrefix = useId();
  const tabId = (tab: AulasTab) => `${idPrefix}-tab-${tab}`;
  const panelId = `${idPrefix}-panel`;

  /* Padrão ARIA tabs com ativação automática: setas, Home e End movem o foco
     e selecionam a aba; só a aba ativa entra na ordem do Tab (roving tabindex). */
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActiveTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

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
    <div className="h-full bg-bg-page flex flex-col overflow-hidden">
      <Header title="Aulas" showBack={false} />

      {/* Search bar — composição local (Figma 51:44); tokens input/* */}
      <div className="flex-shrink-0 bg-card px-4 py-3 border-b border-border-card">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-input-placeholder"
            aria-hidden="true"
          />
          <input
            type="text"
            aria-label="Buscar aulas"
            placeholder="Buscar aulas..."
            className="w-full pl-10 pr-4 py-2.5 bg-input-bg text-input-fg placeholder:text-input-placeholder type-body-md rounded-full outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Tabs — composição local (Figma 51:50); tokens tab/* */}
      <div
        role="tablist"
        aria-label="Conteúdo de Aulas"
        className="flex-shrink-0 bg-card border-b border-border-card flex"
      >
        {tabs.map((tab, index) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={`flex-1 min-w-0 px-1 py-3 type-label-sm border-b-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                selected
                  ? "border-tab-indicator text-tab-active-fg"
                  : "border-transparent text-tab-inactive-fg"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId(activeTab)}
          tabIndex={0}
          className="p-4 space-y-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          {activeTab === "all" && (
            <>
              {modules.map((module) => {
                const isExpanded = openModuleId === module.id;
                const completedCount = module.lessons.filter(l => l.completed).length;
                const totalCount = module.lessons.length;

                return (
                  <ModuleCard
                    key={module.id}
                    title={module.name}
                    color={module.color}
                    completedCount={completedCount}
                    totalCount={totalCount}
                    expanded={isExpanded}
                    onToggle={() => setOpenModuleId(isExpanded ? null : module.id)}
                  >
                    {module.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        title={lesson.title}
                        duration={lesson.duration}
                        completed={lesson.completed}
                        to={`/aulas/${lesson.id}`}
                      />
                    ))}
                  </ModuleCard>
                );
              })}
            </>
          )}

          {activeTab === "turma" && (
            <>
              {/* Chat em grupo card — gradiente de destaque sem token semântico (mantido) */}
              <div className="bg-gradient-to-br from-[#A31545] to-pink-600 dark:from-[#1C0E15] dark:to-[#160B11] rounded-2xl shadow-md p-4 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <MessageSquare className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="type-title-sm mb-0.5">Chat geral da turma</p>
                    <p className="type-caption text-white/80">{onlineStudents.length} pessoas online agora</p>
                  </div>
                </div>
                <Link
                  to="/chat-turma"
                  className="block w-full bg-white text-[#A31545] dark:text-[#B8467A] py-3 rounded-xl text-sm leading-5 font-bold tracking-[0.025em] active:bg-white/90 shadow-sm text-center focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  ENTRAR NO CHAT
                </Link>
              </div>

              {/* Info card — azul informativo (cor funcional, mantida) */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-4">
                <div className="flex items-start gap-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="type-title-sm text-blue-900 dark:text-blue-300 mb-1">Estude com colegas</p>
                    <p className="type-body-md text-blue-700 dark:text-blue-400">
                      Converse sobre as aulas, tire dúvidas e troque experiências com outros estudantes que estão online agora.
                    </p>
                  </div>
                </div>
              </div>

              {/* Online students list */}
              <div className="bg-card rounded-2xl shadow-md border border-border-card p-4">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h3 className="flex items-center gap-2 type-title-sm text-text-content">
                    <Users className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span>Estudantes online</span>
                  </h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-status-success-icon rounded-full animate-pulse" aria-hidden="true" />
                    <span className="type-label-sm text-status-success-fg">{onlineStudents.length} online</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {onlineStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-3 p-3 bg-bg-page rounded-xl active:bg-gray-100 dark:active:bg-[#404040] transition-colors">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center text-xl" aria-hidden="true">
                          {student.avatar}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-success-icon rounded-full border-2 border-bg-page" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="type-title-sm text-text-content truncate">{student.name}</p>
                        <p className="type-caption text-text-meta truncate">
                          Assistindo: {student.currentLesson}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Enviar mensagem para ${student.name}`}
                        className="flex-shrink-0 p-2.5 bg-primary rounded-full active:bg-action-primary-pressed transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:ring-offset-bg-page"
                      >
                        <MessageSquare className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
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
                      className="block bg-card rounded-2xl shadow-md border border-border-card overflow-hidden hover:shadow-lg transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="p-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-lesson-tile-start to-lesson-tile-end rounded-xl flex items-center justify-center">
                            <Download className="w-7 h-7 text-primary" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="type-caption text-text-meta mb-1">{lesson.module}</p>
                            <h4 className="type-title-sm text-text-content mb-2 line-clamp-2">
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-3 type-caption text-text-meta">
                              <span>{lesson.size}</span>
                              <span aria-hidden="true">•</span>
                              <span>{lesson.downloadDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-2xl shadow-md border border-border-card p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-text-meta" aria-hidden="true" />
                  </div>
                  <h3 className="type-heading-sm text-text-content mb-2">Nenhuma aula baixada</h3>
                  <p className="type-body-md text-text-meta">
                    Faça download de aulas para assistir offline
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "notes" && (
            <>
              {notes.length === 0 ? (
                <div className="bg-card rounded-2xl shadow-md border border-border-card p-8 text-center">
                  <div className="text-5xl mb-3" aria-hidden="true">📝</div>
                  <p className="type-title-sm text-text-content mb-1">Nenhuma anotação ainda</p>
                  <p className="type-body-md text-text-meta">
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
                          <div className="w-7 h-7 bg-gradient-to-br from-lesson-tile-start to-lesson-tile-end rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="type-title-sm text-text-content truncate">{firstNote.lessonTitle}</p>
                            <p className="type-caption text-text-meta">{firstNote.moduleTitle} · {lessonNotes.length} anotação{lessonNotes.length !== 1 ? "s" : ""}</p>
                          </div>
                        </div>

                        {/* Notes for this lesson */}
                        <div className="space-y-2 pl-2 border-l-2 border-border-divider ml-3.5">
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
                                  <p className="type-body-md text-text-content flex-1 min-w-0 break-words">
                                    {note.content}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(note.id)}
                                    aria-label="Excluir anotação"
                                    className="p-1.5 rounded-full bg-white/60 dark:bg-white/10 active:bg-white flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-text-meta" aria-hidden="true" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1.5 mt-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${cs.dot}`} aria-hidden="true" />
                                  <span className="type-caption text-text-meta">{fmtDate(note.createdAt)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Summary footer — gradiente decorativo sem token semântico (mantido) */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-3 flex items-center gap-3">
                    <PenLine className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                    <p className="type-caption text-text-meta">
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
