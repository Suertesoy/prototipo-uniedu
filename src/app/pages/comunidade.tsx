import { useState } from "react";
import { BottomNav } from "../components/bottom-nav";
import { Header } from "../components/header";
import { ThemedIcon } from "../components/themed-icon";
import iconPlayLight from "../../imports/icon-play-light.png";
import iconPlayDark from "../../imports/icon-play-dark.png";
import iconChatLight from "../../imports/icon-chat-light.png";
import iconChatDark from "../../imports/icon-chat-dark.png";
import iconGiftLight from "../../imports/icon-gift-light.png";
import iconGiftDark from "../../imports/icon-gift-dark.png";
import {
  Search, Heart, MessageCircle, Share2, MoreVertical, Plus, X,
  Image, Smile, Coins, HelpCircle, Menu, Bell, BookOpen, Calendar,
  Briefcase, MessageSquare, UserPlus, Coffee, ThumbsUp, Home,
  Clock, Users, MapPin, CheckCircle, AlertCircle,
} from "lucide-react";
import { useStore } from "../context/store-context";
import { useLocation } from "react-router";

type Section = "feed" | "perguntas" | "feedback" | "vagas" | "eventos" | "apresente" | "chat" | "cafe";
type TabType = "feed" | "avisos";

interface Post {
  id: number;
  author: { name: string; role: string; avatar: string };
  time: string;
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isNew?: boolean;
}

const initialPosts: Post[] = [
  { id: 1, author: { name: "Amanda Laurins", role: "Experiente", avatar: "👩‍💼" }, time: "3h", content: "Consegui minha primeira vaga como Product Designer Junior! 6 meses após iniciar o curso no UX Unicórnio. Muito grata por toda a ajuda da comunidade! 🎉", likes: 635, comments: 88, isLiked: false },
  { id: 2, author: { name: "Carlos Silva", role: "Iniciante", avatar: "👨‍💻" }, time: "1d", content: "Alguém pode me ajudar com pesquisas longitudinais? Estou com dificuldade em entender a aplicação prática.", likes: 12, comments: 24, isLiked: false },
  { id: 3, author: { name: "Juliana Mendes", role: "Mentor", avatar: "👩‍🏫" }, time: "2d", content: "Dica da semana: sempre validem suas hipóteses com usuários reais antes de começar o design! Economiza muito tempo depois. 💡", likes: 248, comments: 42, isLiked: true },
];

const POINTS_PER_POST = 50;
const FIRST_POST_BONUS = 500;

const roleBadge = (role: string) => {
  if (role === "Mentor") return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
  if (role === "Experiente") return "bg-[#A31545]/10 dark:bg-[#F48FB1]/20 text-[#A31545] dark:text-primary";
  return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
};

/* ── Mock data ─────────────────────────────────────────────────────────────── */

const perguntasData = [
  { id: 201, author: { name: "Marcos T.", avatar: "👨‍💻" }, time: "2h", title: "Como escolher entre entrevista e survey para pesquisa?", replies: 12, tags: ["UX Research"], answered: false },
  { id: 202, author: { name: "Bia Lima", avatar: "👩‍🎨" }, time: "5h", title: "Figma ou Adobe XD em 2025? Qual recomendam?", replies: 34, tags: ["Ferramentas"], answered: true },
  { id: 203, author: { name: "André F.", avatar: "🧑‍💼" }, time: "1d", title: "Como apresentar resultados de pesquisa para stakeholders?", replies: 8, tags: ["Carreira"], answered: false },
  { id: 204, author: { name: "Camila N.", avatar: "👩‍💻" }, time: "2d", title: "Heurísticas de Nielsen: qual a mais difícil de implementar?", replies: 19, tags: ["UX Design"], answered: true },
];

const feedbackData = [
  { id: 301, author: { name: "Carlos M.", avatar: "👨‍🎨" }, time: "4h", projectTitle: "App de controle financeiro", emoji: "💰", feedbacks: 6, description: "Redesenhei o onboarding para ser mais claro. Gostaria de feedback sobre o fluxo principal." },
  { id: 302, author: { name: "Ana P.", avatar: "👩‍🏫" }, time: "1d", projectTitle: "Redesign de e-commerce", emoji: "🛍️", feedbacks: 11, description: "Novo conceito para página de produto com foco em conversão. O que acharam da hierarquia visual?" },
  { id: 303, author: { name: "Renata S.", avatar: "👩‍💻" }, time: "3d", projectTitle: "Dashboard de métricas", emoji: "📊", feedbacks: 4, description: "Dashboard para times de marketing. Buscando feedback sobre densidade de informação." },
];

const vagasData = [
  { id: 401, title: "UX Designer Jr", company: "Nubank", type: "Remoto", salary: "R$ 4.000–6.000", posted: "3h", tags: ["Junior", "Remoto"] },
  { id: 402, title: "Product Designer", company: "iFood", type: "Híbrido – SP", salary: "R$ 6.000–9.000", posted: "1d", tags: ["Pleno", "Híbrido"] },
  { id: 403, title: "UI Designer Freelancer", company: "Agência Nova", type: "Remoto", salary: "Projeto fixo", posted: "2d", tags: ["Freelance", "Remoto"] },
  { id: 404, title: "UX Researcher", company: "Banco Inter", type: "Remoto", salary: "R$ 5.000–7.500", posted: "3d", tags: ["Pleno", "Remoto"] },
];

const eventosData = [
  { id: 501, title: "UX Research na Prática", date: "16 Mai", time: "19h", type: "Online", spots: 60, spotsLeft: 15, emoji: "🔬" },
  { id: 502, title: "Workshop de Figma Avançado", date: "23 Mai", time: "14h", type: "Online", spots: 30, spotsLeft: 2, emoji: "🎨" },
  { id: 503, title: "Meetup de Product Design", date: "30 Mai", time: "18h30", type: "SP – Presencial", spots: 80, spotsLeft: 28, emoji: "🤝" },
  { id: 504, title: "Mentoria em Grupo: Portfólio", date: "10 Jun", time: "20h", type: "Online", spots: 15, spotsLeft: 7, emoji: "🌟" },
];

const apresenteData = [
  { id: 601, author: { name: "Beatriz R.", avatar: "👩‍💼" }, time: "1h", content: "Oi pessoal! 👋 Venho do marketing digital e estou apaixonada por comportamento humano. Entrei aqui para aprender UX Research de verdade!", likes: 24 },
  { id: 602, author: { name: "Felipe A.", avatar: "👨‍💻" }, time: "3h", content: "Oii! Sou dev há 3 anos e resolvi migrar para UX. Acho que entender os dois lados vai me dar uma perspectiva única. Vamos juntos! 🚀", likes: 38 },
  { id: 603, author: { name: "Larissa C.", avatar: "👩‍🎨" }, time: "1d", content: "Olá comunidade! Design gráfico há 5 anos, mas sempre tive curiosidade sobre o 'porquê' das decisões. UX Unicórnio foi o passo que faltava! 🦄", likes: 52 },
];

const chatData = [
  { id: 701, title: "Melhores recursos para aprender UX em 2025", replies: 28, lastActivity: "5min", author: "Mari S." },
  { id: 702, title: "Como montar um portfólio do zero?", replies: 47, lastActivity: "1h", author: "Pedro K." },
  { id: 703, title: "Qual metodologia ágil funciona melhor com UX?", replies: 19, lastActivity: "3h", author: "Gabi L." },
  { id: 704, title: "Ferramentas gratuitas para prototipagem em 2025", replies: 33, lastActivity: "1d", author: "Thiago M." },
];

const cafeData = [
  { id: 801, author: { name: "Mari Silva", avatar: "👩‍💻" }, time: "30min", content: "☕ Café ou chá enquanto estuda? Descobri uma playlist de lofi que virou meu ritual de foco. Recomendo demais!", likes: 23, comments: 15 },
  { id: 802, author: { name: "João C.", avatar: "👨‍💻" }, time: "2h", content: "🎮 Alguém aqui aplica pensamento de UX em jogos? Jogando Balatro e percebendo como o feedback visual é absurdamente bem feito.", likes: 45, comments: 31 },
  { id: 803, author: { name: "Priya M.", avatar: "👩‍🔬" }, time: "1d", content: "🌱 Dica off: pausas de 10 min a cada 50 min de estudo melhoram retenção em ~40%. A ciência por trás do Pomodoro!", likes: 67, comments: 22 },
];

const sectionLabels: Record<Section, string> = {
  feed: "Feed",
  perguntas: "Perguntas e dúvidas",
  feedback: "Feedback em projetos",
  vagas: "Vagas e oportunidades",
  eventos: "Eventos",
  apresente: "Apresente-se",
  chat: "Chat e discussões",
  cafe: "Café / off-topic",
};

/* ── Component ─────────────────────────────────────────────────────────────── */

export function ComunidadePage() {
  const { addPoints } = useStore();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState<Section>("feed");
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [postsList, setPostsList] = useState<Post[]>(initialPosts);
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [isFirstPost, setIsFirstPost] = useState(true);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [showFirstPostBonus, setShowFirstPostBonus] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("uniedu_comunidade_onboarding_seen"));
  const [showHamburger, setShowHamburger] = useState(false);
  const [postContext, setPostContext] = useState<any>(null);

  const handleOpenModal = () => {
    setPostContext(location.state?.lessonContext || null);
    setShowModal(true);
  };

  const navigateToSection = (section: Section) => {
    setCurrentSection(section);
    setActiveTab("feed");
    setShowHamburger(false);
  };

  const toggleLike = (postId: number) => {
    setPostsList((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handlePublish = () => {
    if (!draft.trim()) return;
    setPublishing(true);
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now(),
        author: { name: "Você", role: "Iniciante", avatar: "🦄" },
        time: "agora",
        content: draft.trim(),
        likes: 0,
        comments: 0,
        isLiked: false,
        isNew: true,
      };
      setPostsList((prev) => [newPost, ...prev]);
      const totalPoints = isFirstPost ? POINTS_PER_POST + FIRST_POST_BONUS : POINTS_PER_POST;
      addPoints(totalPoints);
      setLastPointsEarned(totalPoints);
      const wasFirst = isFirstPost;
      if (isFirstPost) setIsFirstPost(false);
      setDraft("");
      setPublishing(false);
      setShowModal(false);
      if (wasFirst) setShowFirstPostBonus(true);
      else { setSuccessMsg(true); setTimeout(() => setSuccessMsg(false), 3000); }
    }, 700);
  };

  /* ── Hamburger sections ── */
  const hamburgerSections = [
    {
      title: null,
      items: [{ id: "feed" as Section, label: "Feed principal", icon: <Home className="w-4 h-4" /> }],
    },
    {
      title: "Explorar",
      items: [
        { id: "perguntas" as Section, label: "Perguntas e dúvidas", icon: <HelpCircle className="w-4 h-4" /> },
        { id: "feedback" as Section, label: "Feedback em projetos", icon: <ThumbsUp className="w-4 h-4" /> },
        { id: "vagas" as Section, label: "Vagas e oportunidades", icon: <Briefcase className="w-4 h-4" /> },
        { id: "eventos" as Section, label: "Eventos", icon: <Calendar className="w-4 h-4" /> },
      ],
    },
    {
      title: "Comunidade",
      items: [
        { id: "apresente" as Section, label: "Apresente-se", icon: <UserPlus className="w-4 h-4" /> },
        { id: "chat" as Section, label: "Chat e discussões", icon: <MessageSquare className="w-4 h-4" /> },
      ],
    },
    {
      title: "Extras",
      items: [{ id: "cafe" as Section, label: "Café / off-topic", icon: <Coffee className="w-4 h-4" /> }],
    },
  ];

  /* ── Avisos data ── */
  const globalAvisos = [
    { id: 101, badgeLabel: "Nova Aula", badgeColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400", iconEl: <BookOpen className="w-4 h-4 text-purple-500" />, title: "Card Sorting na Prática", content: "A aula do Módulo 3 já está disponível! Técnicas avançadas com exemplos reais de projetos.", time: "Hoje" },
    { id: 102, badgeLabel: "Workshop", badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", iconEl: <Calendar className="w-4 h-4 text-blue-500" />, title: "UX Writing para Iniciantes", content: "Participe do workshop ao vivo neste sábado às 15h. Vagas limitadas!", time: "Sáb, 15h" },
    { id: 103, badgeLabel: "Atualização", badgeColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400", iconEl: <Bell className="w-4 h-4 text-amber-500" />, title: "Slides do Módulo 2 atualizados", content: "Materiais revisados com novos exemplos práticos. Acesse em Arquivos.", time: "Ontem" },
    { id: 104, badgeLabel: "Comunicado", badgeColor: "bg-gray-100 dark:bg-accent text-gray-600 dark:text-gray-300", iconEl: <Bell className="w-4 h-4 text-gray-500" />, title: "Manutenção programada", content: "Manutenção no domingo entre 2h–4h. Plataforma temporariamente indisponível.", time: "3d" },
  ];

  const sectionAvisosExtra: Partial<Record<Section, typeof globalAvisos>> = {
    perguntas: [
      { id: 901, badgeLabel: "Moderação", badgeColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", iconEl: <CheckCircle className="w-4 h-4 text-green-500" />, title: "Responda com empatia", content: "Todas as respostas devem ser construtivas. Moderadores revisam em até 24h.", time: "Fixado" },
      { id: 902, badgeLabel: "Destaque", badgeColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400", iconEl: <AlertCircle className="w-4 h-4 text-yellow-500" />, title: "Top 3 mais votadas ganham destaque", content: "As perguntas mais curtidas da semana ficam em destaque na comunidade.", time: "Fixado" },
    ],
    feedback: [
      { id: 911, badgeLabel: "Workshop", badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", iconEl: <Calendar className="w-4 h-4 text-blue-500" />, title: "Workshop de feedback esta semana", content: "Aprenda a dar e receber feedback construtivo. Inscreva-se agora!", time: "Hoje" },
      { id: 912, badgeLabel: "Diretrizes", badgeColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", iconEl: <CheckCircle className="w-4 h-4 text-green-500" />, title: "Novas diretrizes de feedback", content: "Novo guia de como estruturar feedbacks úteis e respeitosos foi publicado.", time: "2d" },
    ],
    vagas: [
      { id: 921, badgeLabel: "Novidade", badgeColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", iconEl: <CheckCircle className="w-4 h-4 text-green-500" />, title: "5 novas vagas adicionadas hoje!", content: "Confira as oportunidades mais recentes. Processo seletivo Nubank aberto.", time: "Hoje" },
      { id: 922, badgeLabel: "Parceria", badgeColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400", iconEl: <AlertCircle className="w-4 h-4 text-purple-500" />, title: "Parceria com iFood", content: "Alunos do UX Unicórnio têm prioridade no processo seletivo de Product Designer.", time: "1d" },
    ],
    eventos: [
      { id: 931, badgeLabel: "Em breve", badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", iconEl: <Calendar className="w-4 h-4 text-blue-500" />, title: "UX Research na Prática – Sexta 19h", content: "Próximo evento ao vivo. Apenas 15 vagas restantes, garanta a sua!", time: "Hoje" },
      { id: 932, badgeLabel: "Gravações", badgeColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400", iconEl: <Bell className="w-4 h-4 text-amber-500" />, title: "Gravações de eventos disponíveis", content: "Os últimos 3 workshops foram gravados e estão na área de conteúdo.", time: "3d" },
    ],
    apresente: [
      { id: 941, badgeLabel: "Boas-vindas", badgeColor: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400", iconEl: <UserPlus className="w-4 h-4 text-pink-500" />, title: "Nova turma chegando esta semana!", content: "Dê as boas-vindas aos novos alunos. Um comentário faz toda a diferença! 🦄", time: "Hoje" },
      { id: 942, badgeLabel: "Mentoria", badgeColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400", iconEl: <CheckCircle className="w-4 h-4 text-purple-500" />, title: "Mentores disponíveis", content: "Alunos iniciantes podem solicitar orientação inicial com um mentor.", time: "Fixado" },
    ],
    chat: [
      { id: 951, badgeLabel: "Destaque", badgeColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400", iconEl: <AlertCircle className="w-4 h-4 text-yellow-500" />, title: "Como fazer sua primeira pesquisa", content: "Tópico em destaque esta semana. Contribua com sua experiência!", time: "Hoje" },
      { id: 952, badgeLabel: "Moderação", badgeColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", iconEl: <CheckCircle className="w-4 h-4 text-green-500" />, title: "Moderação ativa 8h–22h", content: "Mantenha conversas respeitosas. Moderadores monitoram ativamente.", time: "Fixado" },
    ],
    cafe: [
      { id: 961, badgeLabel: "Bem-vindo", badgeColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400", iconEl: <Coffee className="w-4 h-4 text-amber-500" />, title: "Espaço descontraído!", content: "Aqui é o lugar para conversas leves. Mantenha respeito mesmo no off-topic ☕", time: "Fixado" },
    ],
  };

  const currentAvisos = [
    ...(sectionAvisosExtra[currentSection] ?? []),
    ...globalAvisos,
  ];

  /* ── Content renderers ── */

  const renderFeedContent = () => (
    <div className="p-4 space-y-4">
      {postsList.map((post) => (
        <div key={post.id} className={`bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border overflow-hidden ${post.isNew ? "ring-2 ring-[#A31545]/25 dark:ring-[#B8467A]/25" : ""}`}>
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0 text-xl">{post.author.avatar}</div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm dark:text-gray-100">{post.author.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge(post.author.role)}`}>{post.author.role}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{post.time}</p>
                </div>
              </div>
              <button className="p-1 active:bg-gray-100 dark:active:bg-[#404040] rounded-full"><MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" /></button>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4 mb-3 text-xs text-gray-400 dark:text-gray-500">
              <span>{post.likes} curtidas</span>
              <span>{post.comments} comentários</span>
            </div>
            <div className="flex items-center gap-1 pt-3 border-t border-gray-100 dark:border-border">
              <button onClick={() => toggleLike(post.id)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors ${post.isLiked ? "text-[#A31545] dark:text-primary" : "text-gray-500 dark:text-gray-400 active:bg-gray-50 dark:active:bg-[#404040]"}`}>
                <Heart className={`w-4 h-4 ${post.isLiked ? "fill-[#A31545] dark:fill-[#E8A4C8]" : ""}`} />
                <span className="text-xs font-medium">Curtir</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-gray-500 dark:text-gray-400 active:bg-gray-50 dark:active:bg-[#404040]">
                <MessageCircle className="w-4 h-4" /><span className="text-xs font-medium">Comentar</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-gray-500 dark:text-gray-400 active:bg-gray-50 dark:active:bg-[#404040]">
                <Share2 className="w-4 h-4" /><span className="text-xs font-medium">Compartilhar</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPerguntasContent = () => (
    <div className="p-4 space-y-3">
      {perguntasData.map((q) => (
        <div key={q.id} className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 text-lg">{q.author.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{q.author.name}</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{q.time}</span>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug mb-2">{q.title}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {q.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-[#A31545]/8 dark:bg-[#F48FB1]/15 text-[#A31545] dark:text-primary rounded-full font-medium">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 ml-2">
                  {q.answered && <span className="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400 font-medium"><CheckCircle className="w-3 h-3" />Respondida</span>}
                  <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500"><MessageCircle className="w-3.5 h-3.5" />{q.replies}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFeedbackContent = () => (
    <div className="p-4 space-y-3">
      {feedbackData.map((p) => (
        <div key={p.id} className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0 text-lg">{p.author.avatar}</div>
            <div className="flex-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">{p.author.name} · {p.time}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{p.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-accent rounded-xl p-3">
            <div className="w-10 h-10 bg-white dark:bg-accent rounded-lg flex items-center justify-center text-xl shadow-sm flex-shrink-0">{p.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{p.projectTitle}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{p.feedbacks} feedbacks recebidos</p>
            </div>
            <button className="text-xs text-[#A31545] dark:text-primary font-semibold flex-shrink-0 active:opacity-70">Ver →</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderVagasContent = () => (
    <div className="p-4 space-y-3">
      {vagasData.map((v) => (
        <div key={v.id} className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{v.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{v.company}</p>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5">{v.posted}</span>
          </div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"><MapPin className="w-3 h-3" />{v.type}</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span className="text-xs font-medium text-green-600 dark:text-green-400">{v.salary}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {v.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-accent text-gray-600 dark:text-gray-300 rounded-full">{tag}</span>
              ))}
            </div>
            <button className="text-xs font-semibold text-[#A31545] dark:text-primary active:opacity-70">Candidatar →</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEventosContent = () => (
    <div className="p-4 space-y-3">
      {eventosData.map((e) => {
        const spotsPercent = Math.round(((e.spots - e.spotsLeft) / e.spots) * 100);
        const almostFull = e.spotsLeft <= 5;
        return (
          <div key={e.id} className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{e.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug mb-1.5">{e.title}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2.5 flex-wrap">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.type}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${almostFull ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
                    {almostFull ? `⚡ Só ${e.spotsLeft} vagas restantes!` : `${e.spotsLeft} vagas disponíveis`}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{e.spots - e.spotsLeft}/{e.spots}</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-accent rounded-full overflow-hidden mb-3">
                  <div className={`h-full rounded-full transition-all ${almostFull ? "bg-red-400" : "bg-[#A31545] dark:bg-[#F06292]"}`} style={{ width: `${spotsPercent}%` }} />
                </div>
                <button className="w-full py-2 bg-[#A31545] dark:bg-[#F48FB1] text-white text-xs font-bold rounded-xl active:opacity-80">Inscrever-se</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderApresenteContent = () => (
    <div className="p-4 space-y-3">
      {apresenteData.map((a) => (
        <div key={a.id} className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center text-xl flex-shrink-0">{a.author.avatar}</div>
            <div>
              <p className="text-sm font-semibold dark:text-gray-100">{a.author.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{a.time}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{a.content}</p>
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-border">
            <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 active:text-[#A31545] dark:active:text-[#E8A4C8]">
              <Heart className="w-4 h-4" /><span className="text-xs">{a.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-[#A31545] dark:text-primary font-medium active:opacity-70 ml-auto">Dar boas-vindas 👋</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChatContent = () => (
    <div className="p-4 space-y-2.5">
      {chatData.map((t) => (
        <button key={t.id} className="w-full bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4 text-left active:bg-gray-50 dark:active:bg-[#2e2e2e] transition-colors">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug mb-2">{t.title}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{t.replies} respostas</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />há {t.lastActivity}</span>
            <span className="ml-auto text-[11px]">{t.author}</span>
          </div>
        </button>
      ))}
    </div>
  );

  const renderCafeContent = () => (
    <div className="p-4 space-y-3">
      {cafeData.map((c) => (
        <div key={c.id} className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center text-base flex-shrink-0">{c.author.avatar}</div>
            <div>
              <p className="text-xs font-medium dark:text-gray-100">{c.author.name}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{c.time}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{c.content}</p>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-border">
            <button className="flex items-center gap-1 active:text-[#A31545] dark:active:text-[#E8A4C8]"><Heart className="w-3.5 h-3.5" />{c.likes}</button>
            <button className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{c.comments}</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAvisosContent = () => (
    <div className="p-4 space-y-3">
      {currentAvisos.map((a) => (
        <div key={a.id} className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-200 dark:border-border p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{a.iconEl}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.badgeColor}`}>{a.badgeLabel}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto">{a.time}</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-0.5">{a.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{a.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (activeTab === "avisos") return renderAvisosContent();
    switch (currentSection) {
      case "feed":       return renderFeedContent();
      case "perguntas":  return renderPerguntasContent();
      case "feedback":   return renderFeedbackContent();
      case "vagas":      return renderVagasContent();
      case "eventos":    return renderEventosContent();
      case "apresente":  return renderApresenteContent();
      case "chat":       return renderChatContent();
      case "cafe":       return renderCafeContent();
    }
  };

  /* ── Render ── */
  return (
    <div className="h-full bg-gray-50 dark:bg-background flex flex-col overflow-hidden relative">
      <Header
        title="Comunidade"
        showBack={false}
        actions={
          <button onClick={() => setShowOnboarding(true)} className="p-2 active:bg-white/20 rounded-full">
            <HelpCircle className="w-5 h-5 text-white" />
          </button>
        }
      />

      {/* Search + Nova publicação */}
      <div className="flex-shrink-0 bg-white dark:bg-card px-4 py-2.5 border-b border-gray-200 dark:border-border">
        <div className="relative mb-2.5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar na comunidade..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-accent dark:text-gray-100 dark:placeholder-gray-500 rounded-full focus:outline-none focus:ring-1 focus:ring-[#A31545]/50 dark:focus:ring-[#B8467A]/50 text-sm text-gray-600"
          />
        </div>
        <button
          onClick={handleOpenModal}
          className="w-full bg-gradient-to-r from-[#A31545] to-[#7D1133] dark:from-[#F48FB1] dark:to-[#EC407A] text-white py-2.5 rounded-full flex items-center justify-center gap-2 active:opacity-90 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-semibold">Nova publicação</span>
          <div className="bg-green-500 rounded-full px-2 py-0.5 ml-1 flex items-center gap-1">
            <span className="text-[10px] font-bold">GANHE</span>
            <Coins className="w-3 h-3" />
            <span className="text-[10px] font-bold">+{isFirstPost ? POINTS_PER_POST + FIRST_POST_BONUS : POINTS_PER_POST}</span>
          </div>
        </button>
      </div>

      {/* Nav bar — hambúrguer + Feed + Avisos */}
      <div className="flex-shrink-0 bg-white dark:bg-card border-b border-gray-200 dark:border-border flex items-center">
        {/* Hambúrguer */}
        <button
          onClick={() => setShowHamburger(true)}
          className="flex items-center justify-center w-11 h-11 ml-1 rounded-xl active:bg-gray-100 dark:active:bg-[#3a3a3a] transition-colors flex-shrink-0"
        >
          <Menu className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400" />
        </button>

        {/* Divider pill */}
        <div className="w-px h-4 bg-gray-200 dark:bg-accent mx-1 flex-shrink-0" />

        {/* Feed tab */}
        <button
          onClick={() => setActiveTab("feed")}
          className={`py-3 px-4 text-sm border-b-[3px] transition-colors ${
            activeTab === "feed"
              ? "border-[#A31545] dark:border-[#B8467A] text-[#A31545] dark:text-primary font-semibold"
              : "border-transparent text-gray-400 dark:text-gray-500 font-medium"
          }`}
        >
          Feed
        </button>

        {/* Avisos tab */}
        <button
          onClick={() => setActiveTab("avisos")}
          className={`py-3 px-4 text-sm border-b-[3px] transition-colors flex items-center gap-1.5 ${
            activeTab === "avisos"
              ? "border-[#A31545] dark:border-[#B8467A] text-[#A31545] dark:text-primary font-semibold"
              : "border-transparent text-gray-400 dark:text-gray-500 font-medium"
          }`}
        >
          Avisos
          <span className={`text-[9px] font-semibold rounded-full w-4 h-4 flex items-center justify-center leading-none transition-colors ${
            activeTab === "avisos"
              ? "bg-[#A31545]/15 dark:bg-[#F48FB1]/25 text-[#A31545] dark:text-primary"
              : "bg-gray-200 dark:bg-accent text-gray-500 dark:text-gray-400"
          }`}>
            {currentAvisos.length}
          </span>
        </button>
      </div>

      {/* Section indicator — only when not on main feed */}
      {currentSection !== "feed" && (
        <div className="flex-shrink-0 bg-gray-50 dark:bg-muted px-4 py-1.5 border-b border-gray-100 dark:border-border/40 flex items-center gap-2">
          <button onClick={() => navigateToSection("feed")} className="text-xs text-gray-400 dark:text-gray-500 active:text-[#A31545] dark:active:text-[#E8A4C8]">Feed</button>
          <span className="text-gray-300 dark:text-gray-600 text-xs">›</span>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{sectionLabels[currentSection]}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {renderContent()}
      </div>

      <BottomNav />

      {/* ── Hambúrguer drawer ── */}
      {showHamburger && (
        <div className="absolute inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/35" onClick={() => setShowHamburger(false)} />
          <div className="relative w-[78%] max-w-[300px] bg-white dark:bg-card h-full flex flex-col shadow-xl rounded-r-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-12 pb-3 bg-gradient-to-r from-[#A31545] to-[#7D1133] dark:from-[#1C0E15] dark:to-[#160B11]">
              <span className="text-white font-semibold text-sm">Comunidade</span>
              <button onClick={() => setShowHamburger(false)} className="p-1.5 rounded-full bg-white/15 active:bg-white/25">
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto py-1">
              {hamburgerSections.map((section, si) => (
                <div key={si} className={si > 0 ? "mt-1" : ""}>
                  {section.title && (
                    <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 pt-3 pb-1">
                      {section.title}
                    </p>
                  )}
                  {si > 0 && si === 1 && <div className="h-px bg-gray-100 dark:bg-accent/50 mx-4 mb-1" />}
                  {section.items.map((item) => {
                    const isActive = currentSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateToSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors active:bg-gray-50 dark:active:bg-[#333333] ${isActive ? "bg-[#A31545]/6 dark:bg-[#F48FB1]/10" : ""}`}
                      >
                        <span className={`flex-shrink-0 transition-colors ${isActive ? "text-[#A31545] dark:text-primary" : "text-gray-400 dark:text-gray-500"}`}>
                          {item.icon}
                        </span>
                        <span className={`text-sm flex-1 text-left transition-colors ${isActive ? "font-semibold text-[#A31545] dark:text-primary" : "font-normal text-gray-700 dark:text-gray-300"}`}>
                          {item.label}
                        </span>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#A31545]/50 dark:bg-[#E8A4C8]/50 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Onboarding Modal ── */}
      {showOnboarding && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-card rounded-3xl p-6 w-full text-center shadow-xl max-w-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-black text-gray-900 dark:text-gray-100 mb-2 text-lg">Sistema de Pontos</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Na comunidade UX Unicórnio, você <strong className="text-green-600 dark:text-green-400">ganha pontos</strong> por participar!
            </p>
            <div className="space-y-3 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-bold text-green-700 dark:text-green-400">PUBLICAR</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ganhe <strong className="text-green-600 dark:text-green-400">+50 pontos</strong> por cada publicação</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-400">BÔNUS PRIMEIRA VEZ</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Na sua primeira publicação, ganhe <strong className="text-purple-600 dark:text-purple-400">+500 pontos extras!</strong></p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <ThemedIcon lightSrc={iconGiftLight} darkSrc={iconGiftDark} alt="Recompensa" className="w-4 h-4" />
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400">USE NA LOJA</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Troque seus pontos por recompensas exclusivas na loja</p>
              </div>
            </div>
            <button
              onClick={() => { setShowOnboarding(false); localStorage.setItem("uniedu_comunidade_onboarding_seen", "true"); }}
              className="w-full bg-gradient-to-r from-[#A31545] to-[#7D1133] dark:from-[#B8467A] dark:to-[#9A3865] text-white text-sm font-bold py-3 rounded-xl active:opacity-90"
            >
              ENTENDI!
            </button>
          </div>
        </div>
      )}

      {/* ── First Post Bonus Modal ── */}
      {showFirstPostBonus && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-card rounded-3xl p-8 w-full text-center shadow-xl max-w-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-black text-gray-900 dark:text-gray-100 mb-2 text-xl">Parabéns!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Você ganhou um bônus de <strong className="text-[#A31545] dark:text-primary">500 pontos</strong> pela sua primeira publicação.
            </p>
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Coins className="w-6 h-6 text-[#A31545] dark:text-primary" />
                <span className="text-2xl font-black text-[#A31545] dark:text-primary">+{FIRST_POST_BONUS + POINTS_PER_POST}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">pontos</span>
              </div>
            </div>
            <button
              onClick={() => { setShowFirstPostBonus(false); setSuccessMsg(true); setTimeout(() => setSuccessMsg(false), 3000); }}
              className="w-full bg-[#A31545] dark:bg-[#F48FB1] text-white text-sm font-bold py-3 rounded-xl active:bg-[#7D1133] dark:active:bg-[#EC407A]"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* ── Success Toast ── */}
      {successMsg && (
        <div className="absolute bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none">
          <div className="bg-gray-900 dark:bg-accent text-white text-sm px-4 py-3 rounded-2xl flex items-center gap-2 shadow-xl">
            <Coins className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-[12px]">Publicado! <strong>+{lastPointsEarned} pts</strong> 🎉</p>
              <p className="text-[10px] text-white/70">Troque seus pontos na <strong className="text-yellow-300">Loja →</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* ── New Post Modal (Bottom Sheet) ── */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => !publishing && setShowModal(false)} />
          <div className="relative bg-white dark:bg-card rounded-t-3xl pt-3 pb-6 flex flex-col max-h-[90%]">
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100 dark:border-border flex-shrink-0">
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full bg-gray-100 dark:bg-accent active:bg-gray-200 dark:active:bg-[#525252]">
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
              <h3 className="text-sm font-semibold dark:text-gray-100">Nova Publicação</h3>
              <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-3 py-1.5 shadow-sm">
                <span className="text-[9px] font-bold text-white">VOCÊ GANHA</span>
                <Coins className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-black text-white">+{isFirstPost ? POINTS_PER_POST + FIRST_POST_BONUS : POINTS_PER_POST}</span>
              </div>
            </div>
            {/* ── Lesson context chip — shown when user is coming from a lesson ── */}
            {postContext && (
              <div className="flex items-center gap-2 mx-4 mt-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl px-3 py-2">
                <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 truncate">
                    Contexto: {postContext.title}
                  </p>
                  <p className="text-[9px] text-amber-500/80 dark:text-amber-500">Publicando sobre esta aula</p>
                </div>
                <button
                  onClick={() => setPostContext(null)}
                  className="p-1.5 rounded-full active:bg-amber-100 dark:active:bg-amber-900/30 transition-colors"
                  aria-label="Remover contexto"
                >
                  <X className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center text-xl flex-shrink-0">🦄</div>
              <div>
                <p className="text-sm font-semibold dark:text-gray-100">Você</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Publicando para a comunidade</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4">
              <textarea
                autoFocus
                placeholder="O que você quer compartilhar com a comunidade?"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full min-h-[140px] resize-none focus:outline-none text-sm text-gray-800 dark:text-gray-100 dark:bg-transparent placeholder-gray-400 dark:placeholder-gray-500 leading-relaxed"
              />
            </div>
            <div className="flex items-center gap-3 px-4 pt-3 pb-2 border-t border-gray-100 dark:border-border flex-shrink-0">
              <button className="p-2 rounded-full bg-gray-100 dark:bg-accent active:bg-gray-200 dark:active:bg-[#525252]"><Image className="w-4 h-4 text-gray-500 dark:text-gray-400" /></button>
              <button className="p-2 rounded-full bg-gray-100 dark:bg-accent active:bg-gray-200 dark:active:bg-[#525252]"><Smile className="w-4 h-4 text-gray-500 dark:text-gray-400" /></button>
              <p className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{draft.length} / 500</p>
            </div>
            <div className="px-4 flex-shrink-0">
              <button
                onClick={handlePublish}
                disabled={!draft.trim() || publishing}
                className={`w-full py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
                  publishing ? "bg-gray-200 dark:bg-accent text-gray-400"
                  : draft.trim() ? "bg-gradient-to-r from-[#A31545] to-[#7D1133] dark:from-[#B8467A] dark:to-[#9A3865] text-white active:opacity-90"
                  : "bg-gray-100 dark:bg-accent text-gray-400 dark:text-gray-500"
                }`}
              >
                {publishing ? "Publicando..." : (
                  <>
                    <span>PUBLICAR E GANHAR</span>
                    <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                      <Coins className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">+{isFirstPost ? POINTS_PER_POST + FIRST_POST_BONUS : POINTS_PER_POST}</span>
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}