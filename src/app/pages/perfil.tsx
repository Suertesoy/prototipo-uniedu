import { useState, useEffect } from "react";
import { BottomNav } from "../components/bottom-nav";
import { Header } from "../components/header";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Edit, Trophy, Settings, ChevronRight, Lock, LogOut, EyeOff,
  Award, TrendingUp, Coins, CheckCircle, ChevronDown, ChevronUp,
  Camera, BookOpen, Users, ShoppingBag, Flame,
} from "lucide-react";
import { Link } from "react-router";
import { useStore } from "../context/store-context";
import { useLevel } from "../context/level-context";

/* ─── Static data ────────────────────────────────────────────────────── */
const certificates = [
  { id: 1, title: "Design & Arquitetura", date: "Jan 2025", emoji: "🎨" },
  { id: 2, title: "Fundamentos de UX",    date: "Dez 2024", emoji: "📚" },
];

const stats = [
  { label: "Aulas concluídas", value: "24",    icon: "🎓" },
  { label: "Horas de estudo",  value: "18h",   icon: "⏱️" },
  { label: "Sequência atual",  value: "7 dias", icon: "🔥" },
];

const allAchievements = [
  { id: 1, emoji: "🏆", title: "5 aulas completas",   description: "Complete 5 aulas em sequência",           unlocked: true,  date: "15 Jan 2025", points: 100 },
  { id: 2, emoji: "⭐", title: "Nvel 2 alcançado",   description: "Alcance o nível 2 no ranking",            unlocked: true,  date: "10 Jan 2025", points: 200 },
  { id: 3, emoji: "🔥", title: "Sequência de 7 dias", description: "Estude por 7 dias seguidos",              unlocked: true,  date: "20 Jan 2025", points: 300 },
  { id: 4, emoji: "💬", title: "Primeira interação",  description: "Faça seu primeiro comentário",            unlocked: true,  date: "5 Jan 2025",  points: 100 },
  { id: 5, emoji: "📚", title: "Leitor voraz",        description: "Complete 10 aulas",                       unlocked: false, progress: 40 },
  { id: 6, emoji: "👥", title: "Networking",          description: "Conecte-se com 5 pessoas",                unlocked: false, progress: 60 },
  { id: 7, emoji: "🎯", title: "Especialista",        description: "Complete um módulo inteiro",              unlocked: false, progress: 75 },
  { id: 8, emoji: "💎", title: "VIP",                 description: "Alcance 1000 pontos",                     unlocked: false, progress: 30 },
];

export function PerfilPage() {
  const { userPoints } = useStore();
  const { level, xp } = useLevel();
  const [rankingVisible, setRankingVisible] = useState(true);
  const [showLockedAchievements, setShowLockedAchievements] = useState(false);

  // Lê o valor do ranking do localStorage sempre que o componente for montado
  useEffect(() => {
    const saved = localStorage.getItem("rankingVisible");
    if (saved !== null) {
      setRankingVisible(JSON.parse(saved));
    }
  }, []);

  const courseProgress = 65; // percentage
  const currentModule = "Módulo 2 de 6";
  const lessonsCompleted = "14 aulas concluídas";

  const user = {
    name: "Fernanda Silva",
    email: "fernanda@email.com",
    since: "JUN/2025",
    ranking: 54,
  };

  const unlockedCount = allAchievements.filter((a) => a.unlocked).length;
  const totalCount = allAchievements.length;
  const unlockedAchievements = allAchievements.filter((a) => a.unlocked);
  const lockedAchievements = allAchievements.filter((a) => !a.unlocked);

  return (
    <div className="h-full bg-gray-50 dark:bg-background flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Profile hero with integrated header */}
        <div className="bg-gradient-to-br from-[#A31545] to-[#7D1133] dark:from-[#1C0E15] dark:to-[#160B11] px-6 pt-14 pb-6 text-white">
          {/* Header section */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-lg font-semibold text-white">Perfil</h1>
            <div className="flex items-center gap-2">
              <Link to="/profile-settings" className="p-2 active:bg-white/20 rounded-full">
                <Edit className="w-5 h-5 text-white" />
              </Link>
              <Link to="/configuracoes" className="p-2 active:bg-white/20 rounded-full">
                <Settings className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center">
            {/* Avatar with XP progress ring */}
            <div className="relative mb-4">
              {/* SVG Progress Ring */}
              <svg className="w-28 h-28 rotate-90">
                {/* Background circle */}
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  fill="none"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="7"
                />
                {/* Progress circle */}
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  fill="none"
                  stroke="white"
                  strokeWidth="7"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - xp / 100)}`}
                  strokeLinecap="round"
                />
              </svg>

              {/* Avatar - clickable for editing */}
              <button className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl">
                  👤
                </div>
              </button>

              {/* Level indicator */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-lg">
                <span className="text-xs font-bold text-[#A31545]">Lv. {Math.floor(level)}</span>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-1 mt-2">{user.name}</h2>
            <p className="text-xs text-white/80 mb-3">{user.email}</p>

            {/* Membro desde */}
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <span className="text-xs font-bold text-white">
                Membro desde {user.since}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">

          {/* Barra de progresso do curso */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">Progresso geral do curso</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">{currentModule}</span>
              <span className="text-sm font-bold text-[#A31545] dark:text-primary">{courseProgress}%</span>
            </div>
            <div className="h-2.5 bg-gray-200 dark:bg-accent rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#A31545] to-pink-600 dark:from-[#1C0E15] dark:to-[#160B11] rounded-full transition-all"
                style={{ width: `${courseProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{lessonsCompleted}</p>
          </div>

          {/* Conquistas */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Conquistas</h3>
              <span className="text-xs bg-[#A31545] dark:bg-[#F48FB1] text-white px-2 py-1 rounded-full font-bold">
                {unlockedCount}/{totalCount}
              </span>
            </div>
            <div className="p-4 space-y-3">
              {/* Conquistas desbloqueadas */}
              {unlockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`w-full flex items-start justify-between gap-3 p-3 rounded-xl ${
                        achievement.unlocked
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
                          : "bg-gray-50 dark:bg-background border border-gray-200 dark:border-border"
                      }`}
                    >
                      {/* Left side: Icon + Info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          achievement.unlocked ? "bg-white dark:bg-card" : "bg-gray-200 dark:bg-accent"
                        }`}>
                          {achievement.unlocked
                            ? <span className="text-2xl">{achievement.emoji}</span>
                            : <Lock className="w-6 h-6 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium mb-0.5 ${achievement.unlocked ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
                            {achievement.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{achievement.description}</p>
                          {achievement.unlocked ? (
                            <div className="space-y-1.5">
                              <p className="text-xs text-green-700 dark:text-green-400 font-medium flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Conquistada em {achievement.date}
                              </p>
                              <div>
                                <span className="inline-flex items-center gap-1 text-xs bg-green-600 text-white px-2.5 py-1 rounded-full font-bold">
                                  <Coins className="w-3 h-3" />
                                  +{achievement.points} pts
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-accent rounded-full overflow-hidden">
                                <div className="h-full bg-[#A31545] dark:bg-[#F48FB1] rounded-full" style={{ width: `${achievement.progress}%` }} />
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{achievement.progress}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

              {/* Accordion para conquistas bloqueadas */}
              {lockedAchievements.length > 0 && (
                <>
                  <button
                    onClick={() => setShowLockedAchievements(!showLockedAchievements)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-background rounded-xl active:bg-gray-100 dark:active:bg-[#404040] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Conquistas bloqueadas ({lockedAchievements.length})
                      </span>
                    </div>
                    {showLockedAchievements ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>

                  {showLockedAchievements && lockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="w-full flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-background border border-gray-200 dark:border-border"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-200 dark:bg-accent">
                          <Lock className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium mb-0.5 text-gray-500 dark:text-gray-400">
                            {achievement.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{achievement.description}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-accent rounded-full overflow-hidden">
                              <div className="h-full bg-[#A31545] dark:bg-[#F48FB1] rounded-full" style={{ width: `${achievement.progress}%` }} />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{achievement.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Estatísticas — métricas com incentivo motivacional */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-border">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Estatísticas</h3>
            </div>
            <div className="p-4 space-y-2.5">
              {/* Aulas concluídas */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
                <span className="text-2xl flex-shrink-0">🎓</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm dark:text-gray-200">Aulas concluídas</p>
                  <p className="text-[10px] text-[#A31545] dark:text-primary font-medium">Cada aula = +50 pts → invista na loja</p>
                </div>
                <span className="text-sm font-bold text-[#A31545] dark:text-primary flex-shrink-0">24</span>
              </div>

              {/* Horas de estudo */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
                <span className="text-2xl flex-shrink-0">⏱️</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm dark:text-gray-200">Horas de estudo</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Continue evoluindo!</p>
                </div>
                <span className="text-sm font-bold text-[#A31545] dark:text-primary flex-shrink-0">18h</span>
              </div>

              {/* Sequência atual — motivacional */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-800/40">
                <Flame className="w-6 h-6 text-orange-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold dark:text-gray-200">7 dias de sequência</p>
                    <span className="text-[9px] bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-bold px-1.5 py-0.5 rounded-full">ATIVO</span>
                  </div>
                  <p className="text-[10px] text-orange-600 dark:text-orange-400 font-medium">Continue hoje para manter a sequência! 🔥</p>
                </div>
                <Link to="/aulas" className="flex-shrink-0 p-1.5 bg-orange-500 rounded-lg active:bg-orange-600">
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          </div>

          {/* Próximas ações — conecta perfil às outras áreas */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-border">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Continue evoluindo</h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Aprender → Interagir → Evoluir → Ganhar</p>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <Link to="/aulas" className="flex items-center gap-3 px-4 py-3 active:bg-gray-50 dark:active:bg-[#1a1a1a]">
                <div className="w-9 h-9 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-[#A31545] dark:text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold dark:text-gray-200">Continuar estudando</p>
                  <p className="text-[10px] text-green-600 dark:text-green-400">+50 pts por aula concluída</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </Link>
              <Link to="/comunidade" className="flex items-center gap-3 px-4 py-3 active:bg-gray-50 dark:active:bg-[#1a1a1a]">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold dark:text-gray-200">Participar da comunidade</p>
                  <p className="text-[10px] text-green-600 dark:text-green-400">+50 pts ao publicar</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </Link>
              <Link to="/loja" className="flex items-center gap-3 px-4 py-3 active:bg-gray-50 dark:active:bg-[#1a1a1a]">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold dark:text-gray-200">Resgatar recompensas</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Use seus pontos na loja</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </Link>
            </div>
          </div>

          {/* Ranking Card */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border overflow-hidden">
            <div className="h-32 overflow-hidden relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1743119805124-1a0fb1973f93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waHklMjBwb2RpdW0lMjBnb2xkJTIwd2lubmVyfGVufDF8fHx8MTc3ODA4NDQwM3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Ranking"
                className={`w-full h-full object-cover transition-all ${!rankingVisible ? "grayscale opacity-50" : ""}`}
                style={{ width: "100%", height: "100%" }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent ${!rankingVisible ? "opacity-50" : ""}`} />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                {rankingVisible ? (
                  <>
                    <div className="text-white">
                      <p className="text-xs text-white/80 mb-0.5">Sua posição</p>
                      <p className="text-2xl font-black">{user.ranking}°</p>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-300" />
                  </>
                ) : (
                  <>
                    <div className="text-white/60">
                      <p className="text-xs text-white/50 mb-0.5">Ranking oculto</p>
                      <p className="text-xl font-black">—</p>
                    </div>
                    <EyeOff className="w-8 h-8 text-white/40" />
                  </>
                )}
              </div>
            </div>
            <div className="p-3">
              <Link
                to="/ranking"
                className="block w-full bg-gradient-to-r from-[#A31545] to-pink-600 dark:from-[#1C0E15] dark:to-[#160B11] text-white text-center text-xs font-bold py-2.5 rounded-lg tracking-wide active:opacity-90"
              >
                VER RANKING
              </Link>
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-border flex items-center justify-between">
              <h3 className="dark:text-gray-100">Certificados</h3>
              <span className="text-sm text-[#A31545] dark:text-primary">{certificates.length}</span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {certificates.map((cert) => (
                <button key={cert.id} className="w-full p-4 flex items-center gap-3 active:bg-gray-50 dark:active:bg-[#1a1a1a]">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                    {cert.emoji}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate dark:text-gray-100">{cert.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cert.date}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Settings link */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("uniedu-logout"))}
            className="block w-full bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-4 active:shadow-lg text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <span className="font-medium text-red-500">Sair da conta</span>
              </div>
              <ChevronRight className="w-5 h-5 text-red-300" />
            </div>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}