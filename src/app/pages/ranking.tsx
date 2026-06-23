import { useState, useEffect } from "react";
import { Header } from "../components/header";
import { BottomNav } from "../components/bottom-nav";
import { ChevronRight, UserPlus } from "lucide-react";

const rankingData = [
  { rank: 1, name: "Mariana", xp: 18420, isYou: false, avatar: "👩‍🎨" },
  { rank: 2, name: "Rafael", xp: 15300, isYou: false, avatar: "👨‍💻" },
  { rank: 3, name: "Camila", xp: 14870, isYou: false, avatar: "👩‍💼" },
  { rank: 4, name: "Álvaro", xp: 10579, isYou: false, avatar: "👨‍🎓" },
  { rank: 5, name: "Fernanda", xp: 10579, isYou: false, avatar: "👩‍🔬" },
  { rank: 6, name: "Thiago", xp: 10579, isYou: false, avatar: "👨‍🏫" },
  { rank: 7, name: "Beatriz", xp: 10579, isYou: false, avatar: "👩‍💻" },
  { rank: 8, name: "Lucas", xp: 9240, isYou: false, avatar: "👨‍🎨" },
  { rank: 9, name: "Juliana", xp: 8780, isYou: false, avatar: "👩‍🎓" },
  { rank: 10, name: "Você", xp: 8000, isYou: true, avatar: "🦄" },
];

const podiumColors = [
  { border: "border-yellow-400 dark:border-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-600 dark:text-yellow-400", label: "🥇" },
  { border: "border-gray-400 dark:border-gray-500", bg: "bg-gray-50 dark:bg-gray-800/50", text: "text-gray-600 dark:text-gray-300", label: "🥈" },
  { border: "border-orange-400 dark:border-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400", label: "🥉" },
];

function TeardropAvatar({
  emoji,
  size = "large",
  rank,
  colorIndex,
}: {
  emoji: string;
  size?: "large" | "medium" | "small";
  rank: number;
  colorIndex: number;
}) {
  const sizeClasses = {
    large: "w-20 h-24",
    medium: "w-16 h-20",
    small: "w-14 h-18",
  };

  const emojiSizes = {
    large: "text-3xl",
    medium: "text-2xl",
    small: "text-xl",
  };

  const color = podiumColors[colorIndex];

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex flex-col items-center">
        {/* Rank badge on top */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 z-10
            ${colorIndex === 0 ? "bg-yellow-400 text-yellow-900" : colorIndex === 1 ? "bg-gray-400 text-gray-900" : "bg-orange-400 text-orange-900"}`}
        >
          {rank}
        </div>
        {/* Teardrop shape */}
        <div
          className={`${sizeClasses[size]} border-2 ${color.border} ${color.bg} flex items-center justify-center`}
          style={{
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          }}
        >
          <span className={emojiSizes[size]}>{emoji}</span>
        </div>
      </div>
    </div>
  );
}

export function RankingPage() {
  const [showRanking, setShowRanking] = useState(() => {
    const saved = localStorage.getItem("rankingVisible");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState<"mes" | "ano" | "turma" | "amigos">("mes");

  useEffect(() => {
    localStorage.setItem("rankingVisible", JSON.stringify(showRanking));
  }, [showRanking]);

  const top3 = rankingData.slice(0, 3);
  const restList = rankingData.slice(3);
  const youEntry = rankingData.find((r) => r.isYou)!;

  const tabs = [
    { id: "mes" as const, label: "Mês" },
    { id: "ano" as const, label: "Ano" },
    { id: "turma" as const, label: "Turma" },
    { id: "amigos" as const, label: "Amigos" },
  ];

  return (
    <div className="h-full bg-gray-50 dark:bg-background flex flex-col overflow-hidden">
      <Header title="Ranking" showBack={true} />

      {/* Toggle Row */}
      <div className="flex-shrink-0 bg-white dark:bg-card border-b border-gray-200 dark:border-border px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-bold tracking-wide dark:text-[#FCE4EC]">RANKING</span>
        {/* Custom Toggle */}
        <button
          onClick={() => setShowRanking(!showRanking)}
          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
            showRanking ? "bg-[#A31545] dark:bg-[#F48FB1]" : "bg-gray-300 dark:bg-gray-700"
          }`}
        >
          <div
            className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
              showRanking ? "left-7" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {showRanking ? (
        <>
          {/* Tabs */}
          <div className="flex-shrink-0 bg-white dark:bg-card border-b border-gray-200 dark:border-border flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#A31545] dark:border-[#B8467A] text-[#A31545] dark:text-primary"
                    : "border-transparent text-gray-500 dark:text-[#9E9EAE]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab !== "amigos" ? (
            <div className="flex-1 overflow-y-auto">
              {/* Sua Posição Card */}
              <div className="mx-4 mt-4 bg-gradient-to-r from-[#A31545] to-[#7D1133] dark:from-[#1E1A1D] dark:to-[#1C0E15] dark:border dark:border-[#F48FB1]/30 rounded-2xl p-4 text-white shadow-md flex items-center justify-between transition-all duration-200 hover:shadow-lg">
                <div>
                  <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">Sua posição</p>
                  <p className="text-xs text-white/90">Continue estudando para subir no ranking.</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-black">{youEntry.rank}º</span>
                </div>
              </div>

              {/* Podium */}
              <div className="bg-white dark:bg-card mx-4 mt-4 rounded-2xl shadow-md border border-gray-200 dark:border-border px-4 pt-5 pb-4">
                {/* Podium layout: 2nd | 1st | 3rd */}
                <div className="flex items-end justify-center gap-4 mb-4">
                  {/* 2nd */}
                  <div className="flex flex-col items-center gap-1">
                    <TeardropAvatar
                      emoji={top3[1].avatar}
                      size="medium"
                      rank={2}
                      colorIndex={1}
                    />
                    <p className="text-xs font-semibold text-gray-700 dark:text-[#FCE4EC] mt-1">{top3[1].name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-[#9E9EAE]">{top3[1].xp.toLocaleString("pt-BR")}xp</p>
                  </div>

                  {/* 1st - elevated */}
                  <div className="flex flex-col items-center gap-1 -mb-2">
                    <div className="mb-1">
                      <span className="text-xl">👑</span>
                    </div>
                    <TeardropAvatar
                      emoji={top3[0].avatar}
                      size="large"
                      rank={1}
                      colorIndex={0}
                    />
                    <p className="text-xs font-semibold text-gray-700 dark:text-[#FCE4EC] mt-1">{top3[0].name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-[#9E9EAE]">{top3[0].xp.toLocaleString("pt-BR")}xp</p>
                  </div>

                  {/* 3rd */}
                  <div className="flex flex-col items-center gap-1">
                    <TeardropAvatar
                      emoji={top3[2].avatar}
                      size="small"
                      rank={3}
                      colorIndex={2}
                    />
                    <p className="text-xs font-semibold text-gray-700 dark:text-[#FCE4EC] mt-1">{top3[2].name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-[#9E9EAE]">{top3[2].xp.toLocaleString("pt-BR")}xp</p>
                  </div>
                </div>
              </div>

              {/* Rankings list (4th onward) */}
              <div className="mx-4 mt-3 mb-3 bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border overflow-hidden">
                {restList.filter((r) => !r.isYou).map((ranker, idx) => (
                  <div
                    key={ranker.rank}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      idx < restList.filter((r) => !r.isYou).length - 1
                        ? "border-b border-gray-100 dark:border-border/50"
                        : ""
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-gray-600 dark:text-[#FCE4EC]">{ranker.rank}</span>
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {ranker.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-[#FCE4EC]">{ranker.name}</p>
                      <p className="text-[11px] text-gray-400 dark:text-[#9E9EAE]">{ranker.xp.toLocaleString("pt-BR")}xp</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                  </div>
                ))}
              </div>

              {/* "Você" pinned row */}
              <div className="mx-4 mb-4 bg-pink-50 dark:bg-[#F48FB1]/10 border-2 border-[#A31545]/30 dark:border-[#F48FB1]/30 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-7 h-7 rounded-full bg-[#A31545] dark:bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">{youEntry.rank}</span>
                  </div>
                  <div className="w-9 h-9 bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {youEntry.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#A31545] dark:text-primary">Você</p>
                    <p className="text-[11px] text-[#A31545]/70 dark:text-primary/70">{youEntry.xp.toLocaleString("pt-BR")}xp</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A31545]/50 dark:text-primary/50 flex-shrink-0" />
                </div>
              </div>
            </div>
          ) : (
            /* Amigos tab */
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-6 text-center">
                  <div className="w-16 h-16 bg-pink-50 dark:bg-[#F48FB1]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="w-8 h-8 text-[#A31545] dark:text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-700 dark:text-[#FCE4EC] mb-1">Amigos</h3>
                  <p className="text-sm text-gray-400 dark:text-[#9E9EAE] mb-4">
                    Você ainda não tem amigos adicionados
                  </p>
                  <button className="bg-[#A31545] dark:bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl active:bg-[#7D1133] dark:active:bg-[#EC407A]">
                    + Adicionar amigos
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Ranking off */
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-sm text-gray-400 dark:text-[#9E9EAE]">
              Ative o ranking para ver sua posição
            </p>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
