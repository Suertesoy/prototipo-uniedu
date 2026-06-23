import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Sparkles, GraduationCap, Clock, ChevronRight, BookOpen, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useCurrentLesson } from "../context/lesson-context";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot" | "monitor";
  time: string;
}

/* ─── Bot responses ─────────────────────────────────────────────────────── */
const botResponses = [
  "Ótima pergunta! Em UX Design, é fundamental validar suas hipóteses com usuários reais antes de iterar no design.",
  "Sobre pesquisas longitudinais: elas observam mudanças de comportamento ao longo do tempo — ótimas para entender como usuários evoluem com o produto.",
  "Para criar um bom Design System, comece pelos componentes mais usados e estabeleça tokens de design consistentes (cores, tipografia, espaçamentos).",
  "A diferença entre UX e UI: UX foca na experiência geral do usuário, enquanto UI foca na parte visual e interativa. Os dois se complementam! 🎨",
  "Recomendo estudar UX Research antes de UX Strategy — eles se complementam muito bem. Comece pela aula de Entrevistas com Usuários! 📚",
];

/* ──�� Monitor responses ─────────────────────────────────────────────────── */
const monitorReplies = [
  "Entendi sua dúvida! Pode detalhar um pouco mais o contexto da atividade que está fazendo?",
  "Isso é bem comum no começo do curso! Sugiro revisitar a Aula 3 do módulo de UX Research — ela esclarece muito bem esse ponto. 📖",
  "Boa pergunta! Posso te explicar agora ou, se preferir, agendamos uma mentoria para aprofundar juntos.",
  "Já vi vários alunos com essa dificuldade. Vou compartilhar um material extra que vai ajudar bastante!",
  "Conseguiu aplicar no projeto? Me manda o link quando tiver — gosto de dar feedback antes da entrega. 😊",
];

/* ─── IA suggestion chips ────────────────────────────────────────────────── */
const botSuggestions = [
  "O que é UX Research?",
  "Como fazer testes de usabilidade?",
  "Dicas para meu portfólio",
  "Diferença entre UX e UI",
];

/* ─── Monitor suggestion chips ──────────────────────────────────────────── */
const monitorSuggestions = [
  "Tenho dúvida na atividade",
  "Preciso de feedback no projeto",
  "Não entendi o conteúdo da aula",
];

let botResponseIndex = 0;
let monitorReplyIndex = 0;

function getCurrentTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export function ChatPage() {
  const navigate = useNavigate();
  const { currentLesson } = useCurrentLesson();
  const [activeTab, setActiveTab] = useState<"bot" | "monitor">("bot");
  const [inputText, setInputText] = useState("");
  const [lessonContextDismissed, setLessonContextDismissed] = useState(false);
  const [botMessages, setBotMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Oi! Posso te ajudar com conceitos de UX, atividades da aula ou dúvidas gerais. O que você quer entender melhor? 🦄",
      time: getCurrentTime(),
    },
  ]);
  const [monitorMsgs, setMonitorMsgs] = useState<Message[]>([
    {
      id: 1,
      sender: "monitor",
      text: "Oi! Sou a Juliana, monitora do curso. Posso te ajudar com dúvidas da aula ou orientar seu aprendizado. Como posso te ajudar? 😊",
      time: getCurrentTime(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [botMessages, monitorMsgs, isTyping]);

  /* ─── Switch tab — clear typing ─── */
  const handleTabSwitch = (tab: "bot" | "monitor") => {
    setActiveTab(tab);
    setIsTyping(false);
    setInputText("");
  };

  const sendBotMessage = (text?: string) => {
    const content = text ?? inputText;
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: content.trim(),
      time: getCurrentTime(),
    };
    setBotMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const response = botResponses[botResponseIndex % botResponses.length];
      botResponseIndex++;
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: response,
        time: getCurrentTime(),
      };
      setBotMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const sendMonitorMessage = (text?: string) => {
    const content = text ?? inputText;
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: content.trim(),
      time: getCurrentTime(),
    };
    setMonitorMsgs((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = monitorReplies[monitorReplyIndex % monitorReplies.length];
      monitorReplyIndex++;
      const monitorMsg: Message = {
        id: Date.now() + 1,
        sender: "monitor",
        text: reply,
        time: getCurrentTime(),
      };
      setMonitorMsgs((prev) => [...prev, monitorMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const messages = activeTab === "bot" ? botMessages : monitorMsgs;
  const handleSend = activeTab === "bot" ? sendBotMessage : sendMonitorMessage;

  /* ─── Show suggestion chips only when conversation has just the welcome msg ─── */
  const showSuggestions =
    (activeTab === "bot" && botMessages.length === 1) ||
    (activeTab === "monitor" && monitorMsgs.length === 1);
  const suggestions = activeTab === "bot" ? botSuggestions : monitorSuggestions;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-[#1a1a1a]">

      {/* ──────────────────────────────────────────────────────────────────
          HEADER — title + orientative subtitle
      ────────────────────────────────────────────────────────────────── */}
      <header className="bg-white dark:bg-[#262626] border-b border-gray-200 dark:border-gray-700 flex-shrink-0 pt-9">
        <div className="px-4 py-2.5 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-full active:bg-gray-100 dark:active:bg-[#404040] flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#A31545] dark:text-[#E8A4C8]" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate">
              Tire suas Dúvidas
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
              IA para respostas rápidas · Mentor para suporte personalizado
            </p>
          </div>
        </div>

        {/* ── TABS — each with label + supporting subtext ── */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">

          {/* IA tab */}
          <button
            onClick={() => handleTabSwitch("bot")}
            className={`flex-1 pt-2.5 pb-2 border-b-[3px] transition-colors flex flex-col items-center gap-0.5 ${
              activeTab === "bot"
                ? "border-violet-500 text-violet-600 dark:text-violet-400"
                : "border-transparent text-gray-400 dark:text-gray-500"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">ChatBot IA</span>
            </div>
            <span className={`text-[9px] font-medium ${
              activeTab === "bot"
                ? "text-violet-400 dark:text-violet-500"
                : "text-gray-300 dark:text-gray-600"
            }`}>
              Resposta imediata
            </span>
          </button>

          {/* Monitor tab */}
          <button
            onClick={() => handleTabSwitch("monitor")}
            className={`flex-1 pt-2.5 pb-2 border-b-[3px] transition-colors flex flex-col items-center gap-0.5 ${
              activeTab === "monitor"
                ? "border-[#A31545] text-[#A31545] dark:text-[#E8A4C8]"
                : "border-transparent text-gray-400 dark:text-gray-500"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Monitor</span>
            </div>
            <span className={`text-[9px] font-medium ${
              activeTab === "monitor"
                ? "text-[#A31545]/60 dark:text-[#E8A4C8]/60"
                : "text-gray-300 dark:text-gray-600"
            }`}>
              Ajuda personalizada
            </span>
          </button>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────
          LESSON CONTEXT BANNER — shown when user comes from a lesson
      ────────────────────────────────────────────────────────────────── */}
      {currentLesson && !lessonContextDismissed && (
        <div className="flex-shrink-0 bg-amber-50 dark:bg-amber-900/10 border-b border-amber-200 dark:border-amber-800/40 px-4 py-2 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 truncate">
              Dúvida sobre: {currentLesson.title}
            </p>
            <p className="text-[9px] text-amber-600/70 dark:text-amber-500">
              {currentLesson.module}
            </p>
          </div>
          <button
            onClick={() => setLessonContextDismissed(true)}
            className="p-1 rounded-full active:bg-amber-100 dark:active:bg-amber-900/20 flex-shrink-0"
          >
            <X className="w-3 h-3 text-amber-500 dark:text-amber-400" />
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          INFO BANNER — IA vs Monitor clearly differentiated
      ────────────────────────────────────────────────────────────────── */}

      {/* IA banner — violet tone */}
      {activeTab === "bot" && (
        <div className="flex-shrink-0 bg-violet-50 dark:bg-violet-900/10 border-b border-violet-100 dark:border-violet-900/20 px-4 py-2.5 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-base">🦄</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">UX Bot</p>
              <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 rounded-full px-1.5 py-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-[9px] font-medium text-green-700 dark:text-green-400">Sempre disponível</span>
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
              Respostas rápidas sobre UX e conteúdo do curso
            </p>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
        </div>
      )}

      {/* Monitor banner — pink tone */}
      {activeTab === "monitor" && (
        <div className="flex-shrink-0 bg-pink-50 dark:bg-pink-900/10 border-b border-pink-100 dark:border-pink-900/20 px-4 py-2.5 flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center text-base shadow-sm">
              👩‍🏫
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-[#262626]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Juliana Mendes</p>
              <span className="text-[9px] font-medium text-green-600 dark:text-green-400">Online</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
              Ajuda com dúvidas específicas da aula
            </p>
          </div>
          <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 flex-shrink-0">
            <Clock className="w-3 h-3" />
            <span className="text-[9px]">~5 min</span>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          MESSAGES
      ────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const isBot = msg.sender === "bot";
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isUser && (
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm shadow-sm ${
                  isBot
                    ? "bg-gradient-to-br from-violet-400 to-purple-500"
                    : "bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900/50 dark:to-purple-900/50"
                }`}>
                  {isBot ? "🦄" : "👩‍🏫"}
                </div>
              )}
              <div className="flex flex-col gap-0.5 max-w-[78%]">
                {/* Sender label above first message in a group */}
                {!isUser && (
                  <span className={`text-[9px] font-semibold px-1 ${
                    isBot
                      ? "text-violet-500 dark:text-violet-400"
                      : "text-[#A31545] dark:text-[#E8A4C8]"
                  }`}>
                    {isBot ? "UX Bot · IA" : "Juliana · Monitor"}
                  </span>
                )}
                <div
                  className={`rounded-2xl px-3 py-2.5 ${
                    isUser
                      ? "bg-[#A31545] dark:bg-[#B8467A] text-white rounded-br-sm"
                      : isBot
                        ? "bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                        : "bg-white dark:bg-[#2e2e2e] border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-sm rounded-bl-sm"
                  }`}
                >
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                  <p className={`text-[9px] mt-1 ${
                    isUser ? "text-white/70 text-right" : "text-gray-400 dark:text-gray-500"
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Typing indicator ── */}
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm shadow-sm ${
              activeTab === "bot"
                ? "bg-gradient-to-br from-violet-400 to-purple-500"
                : "bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900/50 dark:to-purple-900/50"
            }`}>
              {activeTab === "bot" ? "🦄" : "👩‍🏫"}
            </div>
            <div className={`rounded-2xl rounded-bl-sm px-4 py-3 ${
              activeTab === "bot"
                ? "bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800"
                : "bg-white dark:bg-[#2e2e2e] border border-gray-100 dark:border-gray-700 shadow-sm"
            }`}>
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Suggestion chips — only shown on empty conversation ── */}
        {showSuggestions && !isTyping && (
          <div className="pt-1">
            <p className={`text-[10px] font-medium mb-2 px-1 ${
              activeTab === "bot"
                ? "text-violet-500 dark:text-violet-400"
                : "text-[#A31545] dark:text-[#E8A4C8]"
            }`}>
              {activeTab === "bot"
                ? "💡 Você pode perguntar sobre:"
                : "💬 Tópicos comuns:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    activeTab === "bot" ? sendBotMessage(s) : sendMonitorMessage(s)
                  }
                  className={`flex items-center gap-1 text-[10px] font-medium px-3 py-1.5 rounded-full border transition-colors active:scale-95 ${
                    activeTab === "bot"
                      ? "border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/10 active:bg-violet-100 dark:active:bg-violet-900/20"
                      : "border-pink-200 dark:border-pink-800 text-[#A31545] dark:text-[#E8A4C8] bg-pink-50 dark:bg-pink-900/10 active:bg-pink-100 dark:active:bg-pink-900/20"
                  }`}
                >
                  {s}
                  <ChevronRight className="w-2.5 h-2.5 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          INPUT — contextual placeholder per tab
      ────────────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white dark:bg-[#262626] border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        {/* Context hint above input */}
        <p className={`text-[9px] font-medium mb-1.5 ${
          activeTab === "bot"
            ? "text-violet-400 dark:text-violet-500"
            : "text-[#A31545]/60 dark:text-[#E8A4C8]/60"
        }`}>
          {activeTab === "bot"
            ? "⚡ IA · Responde instantaneamente"
            : "🎓 Monitor · Suporte humano e contextual"}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              activeTab === "bot"
                ? "Pergunte algo sobre UX ou a aula..."
                : "Descreva sua dúvida para o monitor..."
            }
            className={`flex-1 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 bg-gray-100 dark:bg-[#1a1a1a] dark:text-gray-100 dark:placeholder-gray-500 ${
              activeTab === "bot"
                ? "focus:ring-violet-400 dark:focus:ring-violet-600"
                : "focus:ring-[#A31545] dark:focus:ring-[#B8467A]"
            }`}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
              activeTab === "bot"
                ? "bg-violet-500 dark:bg-violet-600 active:bg-violet-700"
                : "bg-[#A31545] dark:bg-[#B8467A] active:bg-[#7D1133] dark:active:bg-[#9A3865]"
            }`}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}