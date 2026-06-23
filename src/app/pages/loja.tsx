import { useState } from "react";
import { BottomNav } from "../components/bottom-nav";
import { Search, ShoppingCart, Coins, X, CheckCircle, Trash2, HelpCircle } from "lucide-react";
import { useStore, CartItem } from "../context/store-context";
import { ThemedIcon } from "../components/themed-icon";
import iconPlayLight from "../../imports/icon-play-light.png";
import iconPlayDark from "../../imports/icon-play-dark.png";
import iconChatLight from "../../imports/icon-chat-light.png";
import iconChatDark from "../../imports/icon-chat-dark.png";
import iconCommunityLight from "../../imports/icon-community-light.png";
import iconCommunityDark from "../../imports/icon-community-dark.png";
import { useTheme } from "../context/theme-context";
import placeholderLightImg from "../../imports/produto-placeholder-light.png";
import placeholderDarkImg from "../../imports/produto-placeholder-dark-novo.jfif";
import dinheiroLightImg from "../../imports/premio-dinheiro-light.png";
import dinheiroDarkImg from "../../imports/premio-dinheiro-dark.png";

const featuredItem: CartItem = {
  id: 99,
  name: "Prêmio em Dinheiro R$100",
  category: "Prêmio",
  price: 30000,
  icon: "💰",
  description:
    "O prêmio máximo! Resgate R$100 em dinheiro diretamente via PIX. Válido para alunos com mais de 3 meses de assinatura ativa.",
};

const storeItems: CartItem[] = [
  {
    id: 1,
    name: "E-book UX Research",
    category: "Digital",
    price: 300,
    icon: "📚",
    description: "Guia completo de pesquisa com usuários — 180 páginas",
  },
  {
    id: 2,
    name: "Template Figma DS",
    category: "Digital",
    price: 400,
    icon: "🎨",
    description: "Design System completo com 200+ componentes prontos",
  },
  {
    id: 3,
    name: "Mentoria 1h",
    category: "Mentoria",
    price: 500,
    icon: "🎓",
    description: "Sessão 1:1 com especialista sênior em UX Design",
  },
  {
    id: 4,
    name: "Kit Wireframes",
    category: "Digital",
    price: 200,
    icon: "📐",
    description: "150+ telas e componentes para wireframing rápido",
  },
  {
    id: 5,
    name: "Curso UX Strategy",
    category: "Curso",
    price: 800,
    icon: "🎯",
    description: "Módulo avançado de UX Strategy com certificado",
  },
  {
    id: 6,
    name: "Certificado Premium",
    category: "Certificado",
    price: 300,
    icon: "🏆",
    description: "Certificado premium com validação no LinkedIn",
  },
  {
    id: 7,
    name: "Workshop ao Vivo",
    category: "Mentoria",
    price: 1200,
    icon: "🎙️",
    description: "Workshop exclusivo 3h com referências do mercado",
  },
  {
    id: 8,
    name: "Review de Portfólio",
    category: "Mentoria",
    price: 600,
    icon: "📋",
    description: "Análise detalhada do seu portfólio por especialista sênior",
  },
  {
    id: 9,
    name: "Kit de Ícones Premium",
    category: "Digital",
    price: 350,
    icon: "✨",
    description: "Biblioteca com 2000+ ícones vetoriais para seus projetos",
  },
];

const gradients: Record<string, string> = {
  Digital: "from-purple-100 to-indigo-100",
  Mentoria: "from-blue-100 to-cyan-100",
  Curso: "from-green-100 to-emerald-100",
  Certificado: "from-yellow-100 to-amber-100",
  Prêmio: "from-pink-100 to-rose-100",
};

export function LojaPage() {
  const { userPoints, cartItems, addToCart, removeFromCart, checkout, totalCartPrice, isInCart } =
    useStore();
  const { theme } = useTheme();

  const getProductImage = (id: number): string => {
    if (id === 99) return theme === "dark" ? dinheiroDarkImg : dinheiroLightImg;
    return theme === "dark" ? placeholderDarkImg : placeholderLightImg;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [addedFeedback, setAddedFeedback] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const categories = ["Todos", "Digital", "Mentoria", "Curso", "Certificado", "Prêmio"];

  const filteredItems = storeItems.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      activeCategory === "Todos" || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleAddToCart = (item: CartItem) => {
    const added = addToCart(item);
    if (added) {
      setAddedFeedback(item.id);
      setTimeout(() => setAddedFeedback(null), 1500);
    }
    setSelectedItem(null);
  };

  const handleCheckout = () => {
    const success = checkout();
    if (success) {
      setShowCheckout(false);
      setShowSuccess(true);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-background">
      {/* Header */}
      <header className="bg-[#A31545] dark:bg-[#1E1A1D] border-b border-pink-700 dark:border-white/8 flex-shrink-0 pt-9">
        <div className="px-4 py-2 flex items-center justify-between">
          <h1 className="text-base font-semibold text-white">Loja</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHint((v) => !v)}
              className={`p-2 rounded-full transition-colors ${showHint ? "bg-white/30" : "active:bg-white/20"}`}
              aria-label="Como funciona a loja"
            >
              <HelpCircle className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 rounded-full active:bg-white/20"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
            {cartItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-[#A31545] text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/20 placeholder-white/70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm"
            />
          </div>
        </div>
      </header>

      {/* Points Banner */}
      <div className="flex-shrink-0 bg-gradient-to-r from-[#A31545] to-[#7D1133] dark:from-[#1C0E15] dark:to-[#160B11] px-4 py-2.5">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            <div key={userPoints} className="animate-pop-in inline-block origin-left">
              <span className="text-sm font-bold">{userPoints.toLocaleString("pt-BR")} pts</span>
              <span className="text-[10px] text-white/70 ml-1.5">disponíveis para resgate</span>
            </div>
          </div>
          <span className="text-[9px] text-white/60 font-medium">Ganhe estudando ↓</span>
        </div>
      </div>

      {/* ── Hint expansível: como ganhar pontos (sem overlay) ── */}
      {showHint && (
        <div className="flex-shrink-0 bg-white dark:bg-card border-b border-gray-200 dark:border-border px-4 pt-3 pb-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Como funciona a loja
            </p>
            <button
              onClick={() => setShowHint(false)}
              className="p-0.5 rounded-full active:bg-gray-100 dark:active:bg-gray-700"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          {/* Earn + Redeem mini description */}
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mb-2.5">
            Ganhe pontos nas aulas e na comunidade, depois resgate recompensas exclusivas aqui.
          </p>

          {/* 3 earning actions */}
          <div className="flex gap-2 mb-2.5">
            {([
              { lightSrc: iconPlayLight,      darkSrc: iconPlayDark,      label: "Aula concluída", pts: "+50 pts" },
              { lightSrc: iconChatLight,      darkSrc: iconChatDark,      label: "Comentar",       pts: "+10 pts" },
              { lightSrc: iconCommunityLight, darkSrc: iconCommunityDark, label: "Publicar",       pts: "+50 pts" },
            ] as const).map((item) => (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center gap-0.5 bg-pink-50 dark:bg-pink-900/10 rounded-lg py-1.5 px-1"
              >
                <ThemedIcon lightSrc={item.lightSrc} darkSrc={item.darkSrc} alt={item.label} className="w-4 h-4" />
                <span className="text-[8px] text-gray-500 dark:text-gray-400 text-center leading-tight">{item.label}</span>
                <span className="text-[9px] font-bold text-[#A31545] dark:text-primary">{item.pts}</span>
              </div>
            ))}
          </div>

          {/* Journey reminder */}
          <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg px-2.5 py-1.5">
            <span className="text-xs">🦄</span>
            <p className="text-[10px] text-purple-600 dark:text-purple-300 leading-tight">
              <strong>Aprender → Interagir → Evoluir → Ganhar.</strong>{" "}
              Cada ação na Home conta pontos aqui.
            </p>
          </div>
        </div>
      )}

      {/* ── Strip contextual permanente (apenas quando hint fechado) ── */}
      {!showHint && (
        <div className="flex-shrink-0 bg-white dark:bg-card border-b border-gray-200 dark:border-border px-4 py-2.5">
          <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
            Ganhe pontos estudando e participando
          </p>
          <div className="flex gap-2">
            {([
              { lightSrc: iconPlayLight,      darkSrc: iconPlayDark,      label: "Aula concluída", pts: "+50 pts" },
              { lightSrc: iconChatLight,      darkSrc: iconChatDark,      label: "Comentar",       pts: "+10 pts" },
              { lightSrc: iconCommunityLight, darkSrc: iconCommunityDark, label: "Publicar",       pts: "+50 pts" },
            ] as const).map((item) => (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center gap-0.5 bg-pink-50 dark:bg-pink-900/10 rounded-lg py-1.5 px-1"
              >
                <ThemedIcon lightSrc={item.lightSrc} darkSrc={item.darkSrc} alt={item.label} className="w-4 h-4" />
                <span className="text-[8px] text-gray-500 dark:text-gray-400 text-center leading-tight">{item.label}</span>
                <span className="text-[9px] font-bold text-[#A31545] dark:text-primary">{item.pts}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Featured Item */}
        <div className="px-4 pt-4">
          <button
            onClick={() => setSelectedItem(featuredItem)}
            className="w-full rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-border relative active:scale-[0.99] transition-transform"
          >
            <div
              className="h-[140px] relative overflow-hidden"
              style={{
                backgroundImage: `url(${getProductImage(featuredItem.id)})`,
                backgroundSize: '120%',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Coins className="w-3 h-3" />
                {featuredItem.price.toLocaleString("pt-BR")}
              </div>
            </div>
            <div className="bg-white dark:bg-card px-3 py-2 text-left">
              <p className="text-[11px] font-bold text-gray-800 dark:text-gray-100">{featuredItem.name}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{featuredItem.description}</p>
            </div>
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-colors ${
                activeCategory === cat
                  ? "bg-[#A31545] dark:bg-[#F48FB1] text-white"
                  : "bg-white dark:bg-card text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-2.5">
            {filteredItems.map((item) => {
              const inCart = isInCart(item.id);
              const justAdded = addedFeedback === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-border active:scale-95 transition-transform relative"
                >
                  {inCart && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#A31545] rounded-full flex items-center justify-center z-10">
                      <span className="text-white text-[8px] font-bold">✓</span>
                    </div>
                  )}
                  <div className="p-2.5 space-y-2">
                    {/* Item image */}
                    <div
                      className="aspect-square rounded-xl overflow-hidden"
                      style={{
                        backgroundImage: `url(${getProductImage(item.id)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    {/* Name */}
                    <p className="text-[9px] font-semibold text-center text-gray-700 dark:text-gray-200 leading-tight line-clamp-2">
                      {item.name}
                    </p>
                    {/* Price */}
                    <div className={`flex items-center justify-center gap-1 rounded-lg py-1 ${
                      userPoints >= item.price
                        ? "bg-[#A31545] dark:bg-[#F48FB1]"
                        : "bg-gray-200 dark:bg-accent"
                    }`}>
                      <Coins className={`w-3 h-3 ${userPoints >= item.price ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                      <span className={`text-[10px] font-bold ${userPoints >= item.price ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
                        {item.price}
                      </span>
                    </div>
                    {/* Faltam X pts */}
                    {userPoints < item.price && (
                      <p className="text-[8px] text-center text-orange-500 dark:text-orange-400 leading-tight">
                        Faltam {(item.price - userPoints).toLocaleString("pt-BR")} pts
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Banner - Fixed Bottom */}
      {cartItems.length > 0 && (
        <div className="flex-shrink-0 bg-gradient-to-r from-[#A31545] to-[#7D1133] dark:from-[#1C0E15] dark:to-[#160B11] px-4 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            {/* Total - Left Side */}
            <div className="flex-1 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
              <ShoppingCart className="w-5 h-5 text-white" />
              <div className="flex-1">
                <p className="text-[10px] text-white/80 font-medium">Total do carrinho</p>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">
                    {totalCartPrice.toLocaleString("pt-BR")} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Button - Right Side */}
            <button
              onClick={() => setShowCart(true)}
              className="bg-[#A31545] dark:bg-[#F48FB1] text-white font-bold px-5 py-3 rounded-xl active:bg-[#7D1133] dark:active:bg-[#EC407A] transition-colors whitespace-nowrap text-sm border-2 border-white/30"
            >
              Ver Carrinho
            </button>
          </div>
        </div>
      )}

      <BottomNav />

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="absolute inset-0 bg-black/50 z-40 flex items-end">
          <div className="bg-white dark:bg-card w-full rounded-t-3xl p-5 animate-slide-up">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
                style={{
                  backgroundImage: `url(${getProductImage(selectedItem.id)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <span className="inline-block bg-pink-50 dark:bg-pink-900/30 text-[#A31545] dark:text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
              {selectedItem.category}
            </span>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">{selectedItem.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{selectedItem.description}</p>

            <div className="flex items-center justify-between mb-4 bg-gray-50 dark:bg-background rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Coins className="w-4 h-4 text-[#A31545] dark:text-primary" />
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {selectedItem.price.toLocaleString("pt-BR")} pts
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Você tem:{" "}
                <span
                  className={`font-semibold ${
                    userPoints >= selectedItem.price ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {userPoints.toLocaleString("pt-BR")} pts
                </span>
              </div>
            </div>

            {isInCart(selectedItem.id) ? (
              <div className="w-full bg-green-100 text-green-700 text-sm font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                No carrinho
              </div>
            ) : userPoints < selectedItem.price ? (
              <div className="space-y-2">
                <div className="w-full bg-gray-100 text-gray-500 text-xs font-bold py-3 rounded-xl text-center">
                  Pontos insuficientes
                </div>
                <p className="text-center text-[10px] text-gray-400">
                  Faltam {(selectedItem.price - userPoints).toLocaleString("pt-BR")} pontos
                </p>
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 rounded-xl px-3 py-2 border border-amber-200 dark:border-amber-800/40">
                  <span className="text-sm">📚</span>
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-tight">
                    Continue estudando e participando para alcançar esta recompensa!
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleAddToCart(selectedItem)}
                className="w-full bg-[#A31545] dark:bg-[#F48FB1] text-white text-sm font-bold py-3 rounded-xl active:bg-[#7D1133] dark:active:bg-[#EC407A] transition-colors"
              >
                Adicionar ao Carrinho
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cart Panel */}
      {showCart && (
        <div className="absolute inset-0 bg-black/50 z-40 flex flex-col justify-end">
          <div className="bg-white dark:bg-card rounded-t-3xl flex flex-col max-h-[85%]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#A31545] dark:text-primary" />
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Carrinho</h3>
                {cartItems.length > 0 && (
                  <span className="bg-[#A31545] dark:bg-[#F48FB1] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">Seu carrinho está vazio</p>
                  <p className="text-xs mt-1">Adicione produtos para continuar</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-gray-50 dark:bg-background rounded-xl p-3"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden"
                        style={{
                          backgroundImage: `url(${getProductImage(item.id)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Coins className="w-3 h-3 text-[#A31545] dark:text-primary" />
                          <span className="text-xs font-bold text-[#A31545] dark:text-primary">{item.price} pts</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 hover:bg-gray-200 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-[#A31545] dark:text-primary" />
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {totalCartPrice.toLocaleString("pt-BR")} pts
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>Seus pontos:</span>
                  <span
                    className={`font-semibold ${
                      userPoints >= totalCartPrice ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {userPoints.toLocaleString("pt-BR")} pts
                  </span>
                </div>
                {userPoints < totalCartPrice ? (
                  <div className="w-full bg-gray-100 text-gray-500 text-sm font-bold py-3 rounded-xl text-center">
                    Pontos insuficientes
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full bg-[#A31545] dark:bg-[#F48FB1] text-white text-sm font-bold py-3 rounded-xl active:bg-[#7D1133] dark:active:bg-[#EC407A]"
                  >
                    Resgatar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Confirmation */}
      {showCheckout && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-card rounded-3xl p-6 w-full shadow-xl">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-8 h-8 text-[#A31545] dark:text-primary" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Confirmar resgate</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Revise seu pedido antes de confirmar</p>
            </div>

            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300 text-xs">{item.name}</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-[#A31545] dark:text-primary" />
                    <span className="text-xs font-semibold dark:text-gray-200">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-border pt-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold dark:text-gray-100">Total</span>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-[#A31545] dark:text-primary" />
                  <span className="font-bold text-[#A31545] dark:text-primary">
                    {totalCartPrice.toLocaleString("pt-BR")} pts
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Saldo após compra:{" "}
                <span className="font-semibold text-gray-600">
                  {(userPoints - totalCartPrice).toLocaleString("pt-BR")} pts
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCheckout(false);
                  setShowCart(true);
                }}
                className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-border text-sm font-semibold text-gray-600 dark:text-gray-300 active:bg-gray-50 dark:active:bg-[#1a1a1a]"
              >
                Voltar
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 py-3 rounded-xl bg-[#A31545] dark:bg-[#F48FB1] text-white text-sm font-bold active:bg-[#7D1133] dark:active:bg-[#EC407A]"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {showSuccess && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-card rounded-3xl p-8 w-full text-center shadow-xl">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 text-lg">Compra realizada!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Seus itens foram resgatados com sucesso 🎉
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
              Saldo atual:{" "}
              <span className="font-bold text-[#A31545] dark:text-primary">
                {userPoints.toLocaleString("pt-BR")} pts
              </span>
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-[#A31545] dark:bg-[#F48FB1] text-white text-sm font-bold py-3 rounded-xl active:bg-[#7D1133] dark:active:bg-[#EC407A]"
            >
              Continuar comprando
            </button>
          </div>
        </div>
      )}
    </div>
  );
}