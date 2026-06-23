import { useState } from "react";
import { Header } from "../components/header";
import { Send, Users } from "lucide-react";
import { useNavigate } from "react-router";

interface Message {
  id: number;
  userId: number;
  userName: string;
  avatar: string;
  message: string;
  time: string;
  isOwn: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    userId: 1,
    userName: "Ana M.",
    avatar: "👩",
    message: "Oi pessoal! Alguém já terminou a aula de Pesquisas Longitudinais?",
    time: "14:32",
    isOwn: false,
  },
  {
    id: 2,
    userId: 2,
    userName: "Carlos",
    avatar: "👨",
    message: "Sim! Achei super interessante. Você tem alguma dúvida específica?",
    time: "14:35",
    isOwn: false,
  },
  {
    id: 3,
    userId: 3,
    userName: "Você",
    avatar: "👤",
    message: "Também terminei! A parte sobre análise de dados foi bem completa.",
    time: "14:38",
    isOwn: true,
  },
  {
    id: 4,
    userId: 1,
    userName: "Ana M.",
    avatar: "👩",
    message: "Sim! Tenho dúvida sobre como aplicar o card sorting na prática",
    time: "14:40",
    isOwn: false,
  },
  {
    id: 5,
    userId: 4,
    userName: "Diego",
    avatar: "👨‍💻",
    message: "Ana, tem um vídeo complementar muito bom sobre isso. Vou mandar o link",
    time: "14:42",
    isOwn: false,
  },
];

export function ChatTurmaPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [onlineCount] = useState(8);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      userId: 3,
      userName: "Você",
      avatar: "👤",
      message: inputValue,
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-[#1a1a1a] flex flex-col overflow-hidden">
      {/* Custom Header */}
      <div className="flex-shrink-0 bg-gradient-to-br from-[#A31545] to-[#7D1133] pt-14 pb-4 px-4 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full active:bg-white/20"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-white">Chat da Turma</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-white/90">{onlineCount} online</span>
            </div>
          </div>
          <button className="p-2 rounded-full active:bg-white/20">
            <Users className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}
          >
            {!msg.isOwn && (
              <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                {msg.avatar}
              </div>
            )}
            <div className={`flex-1 max-w-[75%] ${msg.isOwn ? "items-end" : "items-start"} flex flex-col`}>
              {!msg.isOwn && (
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {msg.userName}
                </span>
              )}
              <div
                className={`rounded-2xl px-4 py-2.5 ${
                  msg.isOwn
                    ? "bg-[#A31545] text-white"
                    : "bg-white dark:bg-[#262626] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.message}</p>
              </div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 bg-white dark:bg-[#262626] border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-gray-100 dark:bg-[#404040] text-gray-800 dark:text-gray-200 rounded-2xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#A31545] max-h-24"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              inputValue.trim()
                ? "bg-[#A31545] text-white active:bg-[#7D1133]"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
