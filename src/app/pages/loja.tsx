import { useEffect, useRef, useState } from "react";
import { BottomNav } from "../components/bottom-nav";
import { PrimaryButton } from "../components/primary-button";
import { useDialogFocus } from "../hooks/use-dialog-focus";
import { useInertBackground } from "../hooks/use-inert-background";
import { Search, ShoppingCart, Coins, X, Check, CheckCircle, Trash2, HelpCircle } from "lucide-react";
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

// Ações que geram pontos: usadas no hint expansível e na faixa compacta
const earnActions = [
  { lightSrc: iconPlayLight,      darkSrc: iconPlayDark,      label: "Aula concluída", pts: "+50 pts" },
  { lightSrc: iconChatLight,      darkSrc: iconChatDark,      label: "Comentar",       pts: "+10 pts" },
  { lightSrc: iconCommunityLight, darkSrc: iconCommunityDark, label: "Publicar",       pts: "+50 pts" },
] as const;

const formatPoints = (value: number) => value.toLocaleString("pt-BR");

/* Estados sem ação (Pontos insuficientes / No carrinho) são informativos:
   ficam como blocos, nunca como botões ativos. */
const insufficientBlockClass =
  "w-full bg-gray-100 dark:bg-accent text-gray-600 dark:text-gray-400 type-label-md py-3 rounded-xl text-center";

const closeButtonClass =
  "p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring";

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

  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const detailTitleRef = useRef<HTMLHeadingElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const cartTitleRef = useRef<HTMLHeadingElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const checkoutTitleRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const successTitleRef = useRef<HTMLHeadingElement>(null);
  // Produto aberto por último: destino alternativo quando o card não recebeu foco ao abrir
  const lastProductIdRef = useRef<number | null>(null);
  // Posição do item removido: o foco vai para o vizinho (ou para o título, se esvaziar)
  const removedIndexRef = useRef<number | null>(null);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(addedTimerRef.current), []);

  const openProduct = (item: CartItem) => {
    lastProductIdRef.current = item.id;
    setSelectedItem(item);
  };

  const handleAddToCart = (item: CartItem) => {
    const added = addToCart(item);
    if (added) {
      clearTimeout(addedTimerRef.current);
      setAddedFeedback(item.id);
      addedTimerRef.current = setTimeout(() => setAddedFeedback(null), 1500);
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

  const handleRemoveFromCart = (id: number, index: number) => {
    removedIndexRef.current = index;
    removeFromCart(id);
  };

  const openCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  // VOLTAR e Esc na confirmação: volta ao carrinho com os itens, sem resgatar
  const backToCart = () => {
    setShowCheckout(false);
    setShowCart(true);
  };

  // Um único fundo inerte para os quatro diálogos: nas trocas carrinho ↔
  // confirmação → sucesso ele continua ativo e o catálogo nunca recebe foco.
  // Declarado antes dos diálogos: ao fechar, o inert sai antes de o foco voltar.
  useInertBackground(rootRef, selectedItem !== null || showCart || showCheckout || showSuccess);

  const cartButton = () => cartButtonRef.current;

  useDialogFocus(detailRef, selectedItem !== null, {
    // Nome do produto primeiro: dá contexto antes de chegar à ação
    initialFocus: () => detailTitleRef.current,
    fallbackFocus: () =>
      rootRef.current?.querySelector<HTMLElement>(`[data-product-id="${lastProductIdRef.current}"]`) ??
      searchRef.current,
    onEscape: () => setSelectedItem(null),
  });

  // Abre pelo Header ou pela barra inferior; se a barra sumiu (último item
  // removido), o foco volta ao carrinho do Header
  useDialogFocus(cartRef, showCart, {
    initialFocus: () => cartTitleRef.current,
    fallbackFocus: cartButton,
    onEscape: () => setShowCart(false),
    // RESGATAR: a confirmação abre em seguida e assume o foco
    shouldRestoreFocus: () => !showCheckout,
  });

  useDialogFocus(checkoutRef, showCheckout, {
    initialFocus: () => checkoutTitleRef.current,
    fallbackFocus: cartButton,
    onEscape: backToCart,
    // Sai sempre para outro diálogo (carrinho ou sucesso), que assume o foco
    shouldRestoreFocus: () => !showCart && !showSuccess,
  });

  // Quem iniciou o resgate já desmontou (carrinho vazio): volta ao carrinho do Header
  useDialogFocus(successRef, showSuccess, {
    initialFocus: () => successTitleRef.current,
    fallbackFocus: cartButton,
    onEscape: () => setShowSuccess(false),
  });

  useEffect(() => {
    const index = removedIndexRef.current;
    if (index === null) return;
    removedIndexRef.current = null;
    const removeButtons = cartRef.current?.querySelectorAll<HTMLElement>("[data-cart-remove]");
    (removeButtons?.[Math.min(index, removeButtons.length - 1)] ?? cartTitleRef.current)?.focus();
  }, [cartItems]);

  const addedItemName =
    addedFeedback === null
      ? null
      : [featuredItem, ...storeItems].find((item) => item.id === addedFeedback)?.name;

  const cartCountLabel = `${cartItems.length} ${cartItems.length === 1 ? "item" : "itens"}`;

  // Três cards com altura igual; em 320px o rótulo quebra em duas linhas em vez de encolher
  const earnActionsList = (
    <ul className="flex gap-2">
      {earnActions.map((item) => (
        <li
          key={item.label}
          className="flex-1 min-w-0 flex flex-col items-center gap-1 bg-pink-50 dark:bg-pink-900/10 rounded-lg px-1.5 py-2 text-center"
        >
          <ThemedIcon lightSrc={item.lightSrc} darkSrc={item.darkSrc} className="w-5 h-5" />
          <span className="type-caption text-text-content">{item.label}</span>
          <span className="type-label-sm text-primary tabular-nums">{item.pts}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={rootRef} className="h-full flex flex-col overflow-hidden bg-bg-page">
      {/* Anúncio de produto adicionado (addedFeedback): sempre montado para o
          leitor de tela notar a mudança; aria-live o mantém fora do inert */}
      <p role="status" aria-live="polite" className="sr-only">
        {addedItemName ? `${addedItemName} adicionado ao carrinho` : ""}
      </p>

      {/* Header próprio da Loja (não é Header/Page): ajuda, carrinho e busca */}
      <header className="bg-header-bg-start border-b border-pink-700 dark:border-white/8 flex-shrink-0 pt-9">
        <div className="px-4 py-2 flex items-center justify-between">
          <h1 className="type-title-md text-header-fg">Loja</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              aria-label="Como funciona a loja"
              aria-expanded={showHint}
              className={`p-2 rounded-full text-header-fg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-header-fg ${
                showHint ? "bg-white/30" : "active:bg-header-overlay-pressed"
              }`}
            >
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              ref={cartButtonRef}
              type="button"
              onClick={() => setShowCart(true)}
              aria-label={cartItems.length > 0 ? `Abrir carrinho, ${cartCountLabel}` : "Abrir carrinho"}
              className="relative p-2 rounded-full text-header-fg active:bg-header-overlay-pressed outline-none focus-visible:ring-2 focus-visible:ring-header-fg"
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              {cartItems.length > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-header-fg text-header-bg-start type-label-xs tabular-nums rounded-full flex items-center justify-center"
                >
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search — mesma lógica de filtragem; superfície input/* legível nos dois temas */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-input-placeholder"
            />
            <input
              ref={searchRef}
              type="text"
              aria-label="Buscar produtos"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-input-bg text-input-fg placeholder:text-input-placeholder type-body-md rounded-lg outline-none focus:ring-2 focus:ring-header-fg"
            />
          </div>
        </div>
      </header>

      {/* Points Banner — o texto quebra de linha em telas estreitas em vez de estourar */}
      <div className="flex-shrink-0 bg-gradient-to-r from-header-bg-start to-header-bg-end px-4 py-2.5">
        <div className="flex items-center justify-between gap-3 text-header-fg">
          <div className="flex items-center gap-2 min-w-0">
            <Coins className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <p key={userPoints} className="animate-pop-in origin-left min-w-0">
              <span className="type-label-md tabular-nums">{formatPoints(userPoints)} pts</span>{" "}
              <span className="type-caption text-header-fg-muted">disponíveis para resgate</span>
            </p>
          </div>
          <span className="type-caption text-header-fg-muted whitespace-nowrap flex-shrink-0">
            Ganhe estudando <span aria-hidden="true">↓</span>
          </span>
        </div>
      </div>

      {/* ── Hint expansível: como ganhar pontos (sem overlay) ── */}
      {showHint && (
        <div className="flex-shrink-0 bg-card border-b border-border-card px-4 pt-3 pb-3 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="type-overline text-text-meta">
              Como funciona a loja
            </p>
            <button
              type="button"
              onClick={() => setShowHint(false)}
              aria-label="Fechar explicação da loja"
              className="-m-1.5 p-1.5 rounded-full active:bg-gray-100 dark:active:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="w-4 h-4 text-text-meta" aria-hidden="true" />
            </button>
          </div>

          {/* Earn + Redeem mini description */}
          <p className="type-body-md text-gray-600 dark:text-gray-400 mb-3">
            Ganhe pontos nas aulas e na comunidade, depois resgate recompensas exclusivas aqui.
          </p>

          {/* 3 earning actions */}
          <div className="mb-3">{earnActionsList}</div>

          {/* Journey reminder */}
          <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg px-3 py-2">
            <span className="text-sm" aria-hidden="true">🦄</span>
            <p className="type-caption text-purple-600 dark:text-purple-300">
              <strong>Aprender → Interagir → Evoluir → Ganhar.</strong>{" "}
              Cada ação na Home conta pontos aqui.
            </p>
          </div>
        </div>
      )}

      {/* ── Strip contextual permanente (apenas quando hint fechado) ── */}
      {!showHint && (
        <div className="flex-shrink-0 bg-card border-b border-border-card px-4 py-2.5">
          <p className="type-overline text-text-meta mb-2">
            Ganhe pontos estudando e participando
          </p>
          {earnActionsList}
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Featured Item */}
        <div className="px-4 pt-4">
          <button
            type="button"
            data-product-id={featuredItem.id}
            onClick={() => openProduct(featuredItem)}
            className="w-full bg-card rounded-2xl overflow-hidden shadow-md border border-border-card relative text-left active:scale-[0.99] transition-transform outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
          >
            <span
              className="block h-[140px] relative overflow-hidden"
              style={{
                backgroundImage: `url(${getProductImage(featuredItem.id)})`,
                backgroundSize: '120%',
                backgroundPosition: 'center',
              }}
            >
              <span className="absolute bottom-3 right-3 bg-black/70 text-white type-label-sm tabular-nums px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" aria-hidden="true" />
                {formatPoints(featuredItem.price)} pts
              </span>
            </span>
            <span className="block px-3 py-2.5">
              <span className="block type-title-sm text-text-content">{featuredItem.name}</span>
              <span className="block mt-0.5 type-caption text-text-meta">{featuredItem.description}</span>
            </span>
          </button>
        </div>

        {/* Categories — rolagem horizontal só na faixa; ativo = preenchido + check */}
        <div
          role="group"
          aria-label="Filtrar por categoria"
          className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={isActive}
                className={`flex-shrink-0 inline-flex items-center gap-1 px-3.5 py-2 rounded-full border type-label-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-tab-inactive-fg border-border-card active:bg-muted"
                }`}
              >
                {isActive && <Check className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Items Grid — container query: mede a área real (também no frame de 393px do desktop).
            3 colunas só a partir de 360px de conteúdo (~392px de tela), onde cada card
            ainda tem ~95px úteis para nome em Title/SM e preço em Label/SM; abaixo, 2 colunas. */}
        <div className="@container px-4 pb-4">
          {filteredItems.length > 0 && (
            <ul className="grid grid-cols-2 gap-2.5 @min-[360px]:grid-cols-3">
              {filteredItems.map((item) => {
                const inCart = isInCart(item.id);
                const canAfford = userPoints >= item.price;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      data-product-id={item.id}
                      onClick={() => openProduct(item)}
                      className="w-full h-full flex flex-col bg-card rounded-2xl overflow-hidden shadow-md border border-border-card p-2.5 @min-[360px]:p-2 text-center active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
                    >
                      {/* Item image — 4:3 em 2 colunas para não alongar o card; quadrada em 3 */}
                      <span
                        className="relative block w-full aspect-[4/3] @min-[360px]:aspect-square rounded-xl overflow-hidden"
                        style={{
                          backgroundImage: `url(${getProductImage(item.id)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        {inCart && (
                          <span
                            aria-hidden="true"
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center ring-2 ring-card"
                          >
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          </span>
                        )}
                      </span>
                      {/* Name — reserva 2 linhas para alinhar os preços da mesma fileira */}
                      <span className="mt-2 type-title-sm text-text-content line-clamp-2 min-h-10">
                        {item.name}
                      </span>
                      {/* Price */}
                      <span
                        className={`mt-1.5 flex items-center justify-center gap-1 rounded-lg px-1 py-1.5 type-label-sm tabular-nums ${
                          canAfford
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-100 dark:bg-accent text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                        {formatPoints(item.price)} pts
                      </span>
                      {/* Estado: no carrinho / faltam X pts */}
                      {inCart ? (
                        <span className="mt-1.5 flex items-center justify-center gap-1 type-label-sm text-status-success-fg">
                          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                          No carrinho
                        </span>
                      ) : (
                        !canAfford && (
                          <span className="mt-1.5 type-caption text-orange-700 dark:text-orange-400 text-balance">
                            Faltam {formatPoints(item.price - userPoints)} pts
                          </span>
                        )
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-10">
              <Search className="w-8 h-8 mx-auto mb-2 text-text-meta opacity-60" aria-hidden="true" />
              <p className="type-body-md text-text-meta">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Banner - Fixed Bottom */}
      {cartItems.length > 0 && (
        <div className="flex-shrink-0 bg-gradient-to-r from-header-bg-start to-header-bg-end px-4 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            {/* Total - Left Side (texto em header-fg: o muted ficava abaixo de 4,5:1 sobre o white/20) */}
            <div className="flex-1 min-w-0 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2.5 text-header-fg">
              <ShoppingCart className="w-5 h-5 flex-shrink-0 max-[360px]:hidden" aria-hidden="true" />
              <div className="min-w-0">
                <p className="type-caption">Total do carrinho</p>
                <p className="flex items-center gap-1 type-label-md tabular-nums">
                  <Coins className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  {formatPoints(totalCartPrice)} pts
                </p>
              </div>
            </div>

            {/* Button - Right Side */}
            <PrimaryButton
              onClick={() => setShowCart(true)}
              className="px-4 whitespace-nowrap border-2 border-white/30 focus-visible:outline-header-fg"
            >
              Ver Carrinho
            </PrimaryButton>
          </div>
        </div>
      )}

      <BottomNav />

      {/* Item Detail Modal */}
      {selectedItem && (
        <div data-dialog-layer className="absolute inset-0 bg-black/50 z-40 flex items-end">
          <div
            ref={detailRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="loja-product-title"
            className="bg-card w-full max-h-[90%] overflow-y-auto rounded-t-3xl p-5 animate-slide-up"
          >
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
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Fechar detalhes do produto"
                className={closeButtonClass}
              >
                <X className="w-5 h-5 text-text-meta" aria-hidden="true" />
              </button>
            </div>
            <span className="inline-block bg-pink-50 dark:bg-pink-900/30 text-primary type-label-sm px-2.5 py-0.5 rounded-full mb-2">
              {selectedItem.category}
            </span>
            <h3
              id="loja-product-title"
              ref={detailTitleRef}
              tabIndex={-1}
              className="type-heading-sm text-text-content mb-1 outline-none"
            >
              {selectedItem.name}
            </h3>
            <p className="type-body-md text-gray-600 dark:text-gray-400 mb-4">{selectedItem.description}</p>

            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-4 bg-bg-page rounded-xl p-3">
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="type-title-md text-text-content tabular-nums">
                  {formatPoints(selectedItem.price)} pts
                </span>
              </div>
              <p className="type-caption text-text-meta">
                Você tem:{" "}
                <span
                  className={`type-label-sm tabular-nums ${
                    userPoints >= selectedItem.price
                      ? "text-status-success-fg"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {formatPoints(userPoints)} pts
                </span>
              </p>
            </div>

            {isInCart(selectedItem.id) ? (
              <div className="w-full bg-green-50 dark:bg-green-900/30 text-status-success-fg type-label-md py-3 rounded-xl text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                No carrinho
              </div>
            ) : userPoints < selectedItem.price ? (
              <div className="space-y-2">
                <div className={insufficientBlockClass}>
                  Pontos insuficientes
                </div>
                <p className="text-center type-caption text-text-meta">
                  Faltam {formatPoints(selectedItem.price - userPoints)} pontos
                </p>
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 rounded-xl px-3 py-2 border border-amber-200 dark:border-amber-800/40">
                  <span className="text-sm" aria-hidden="true">📚</span>
                  <p className="type-caption text-amber-700 dark:text-amber-400">
                    Continue estudando e participando para alcançar esta recompensa!
                  </p>
                </div>
              </div>
            ) : (
              <PrimaryButton fullWidth onClick={() => handleAddToCart(selectedItem)}>
                Adicionar ao Carrinho
              </PrimaryButton>
            )}
          </div>
        </div>
      )}

      {/* Cart Panel */}
      {showCart && (
        <div data-dialog-layer className="absolute inset-0 bg-black/50 z-40 flex flex-col justify-end">
          <div
            ref={cartRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="loja-cart-title"
            className="bg-card rounded-t-3xl flex flex-col max-h-[85%]"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-divider">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" aria-hidden="true" />
                <h3
                  id="loja-cart-title"
                  ref={cartTitleRef}
                  tabIndex={-1}
                  className="type-title-md text-text-content outline-none"
                >
                  Carrinho
                </h3>
                {cartItems.length > 0 && (
                  <span className="min-w-5 h-5 px-1 bg-primary text-primary-foreground type-label-xs tabular-nums rounded-full flex items-center justify-center">
                    {cartItems.length}
                    <span className="sr-only"> {cartItems.length === 1 ? "item" : "itens"}</span>
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowCart(false)}
                aria-label="Fechar carrinho"
                className={closeButtonClass}
              >
                <X className="w-5 h-5 text-text-meta" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-text-meta opacity-60" aria-hidden="true" />
                  <p className="type-title-sm text-text-content">Seu carrinho está vazio</p>
                  <p className="type-caption text-text-meta mt-1">Adicione produtos para continuar</p>
                </div>
              ) : (
                <ul className="p-4 space-y-3">
                  {cartItems.map((item, index) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 bg-bg-page rounded-xl p-3"
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
                        <p className="type-label-md text-text-content line-clamp-2">{item.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Coins className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                          <span className="type-label-sm text-primary tabular-nums">{formatPoints(item.price)} pts</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        data-cart-remove
                        onClick={() => handleRemoveFromCart(item.id, index)}
                        aria-label={`Remover ${item.name} do carrinho`}
                        className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Trash2 className="w-4 h-4 text-text-meta" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="px-4 pb-4 pt-3 border-t border-border-divider">
                <div className="flex items-center justify-between mb-2">
                  <span className="type-body-md text-text-meta">Total:</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span className="type-title-md text-text-content tabular-nums">
                      {formatPoints(totalCartPrice)} pts
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="type-caption text-text-meta">Seus pontos:</span>
                  <span
                    className={`type-label-sm tabular-nums ${
                      userPoints >= totalCartPrice ? "text-status-success-fg" : "text-red-700 dark:text-red-400"
                    }`}
                  >
                    {formatPoints(userPoints)} pts
                  </span>
                </div>
                {userPoints < totalCartPrice ? (
                  <div className={insufficientBlockClass}>
                    Pontos insuficientes
                  </div>
                ) : (
                  <PrimaryButton fullWidth onClick={openCheckout}>
                    Resgatar
                  </PrimaryButton>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Confirmation */}
      {showCheckout && (
        <div data-dialog-layer className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div
            ref={checkoutRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="loja-checkout-title"
            aria-describedby="loja-checkout-description"
            className="bg-card rounded-3xl p-6 w-full max-h-full overflow-y-auto shadow-xl"
          >
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-8 h-8 text-primary" aria-hidden="true" />
              </div>
              <h3
                id="loja-checkout-title"
                ref={checkoutTitleRef}
                tabIndex={-1}
                className="type-heading-sm text-text-primary mb-1 outline-none"
              >
                Confirmar resgate
              </h3>
              <p id="loja-checkout-description" className="type-body-md text-text-meta">
                Revise seu pedido antes de confirmar
              </p>
            </div>

            <ul className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3">
                  <span className="type-body-md text-text-content min-w-0">{item.name}</span>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    <Coins className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                    <span className="type-label-sm text-text-content tabular-nums">{formatPoints(item.price)} pts</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-border-divider pt-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="type-title-sm text-text-content">Total</span>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className="type-title-md text-primary tabular-nums">
                    {formatPoints(totalCartPrice)} pts
                  </span>
                </div>
              </div>
              <p className="type-caption text-text-meta mt-1">
                Saldo após compra:{" "}
                <span className="type-label-sm text-text-content tabular-nums">
                  {formatPoints(userPoints - totalCartPrice)} pts
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={backToCart}
                className="flex-1 py-3 rounded-xl border border-border-card type-label-md text-text-content active:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Voltar
              </button>
              <PrimaryButton onClick={handleCheckout} className="flex-1">
                Confirmar
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {showSuccess && (
        <div data-dialog-layer className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div
            ref={successRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="loja-success-title"
            aria-describedby="loja-success-message"
            className="bg-card rounded-3xl p-8 w-full max-h-full overflow-y-auto text-center shadow-xl"
          >
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-status-success-icon" aria-hidden="true" />
            </div>
            {/* Foco inicial: a própria mensagem de sucesso */}
            <h3
              id="loja-success-title"
              ref={successTitleRef}
              tabIndex={-1}
              className="type-heading-sm text-text-primary mb-1 outline-none"
            >
              Compra realizada!
            </h3>
            <p id="loja-success-message" className="type-body-md text-gray-600 dark:text-gray-400 mb-2">
              Seus itens foram resgatados com sucesso <span aria-hidden="true">🎉</span>
            </p>
            <p className="type-caption text-text-meta mb-6">
              Saldo atual:{" "}
              <span className="type-label-sm text-primary tabular-nums">
                {formatPoints(userPoints)} pts
              </span>
            </p>
            <PrimaryButton fullWidth onClick={() => setShowSuccess(false)}>
              Continuar comprando
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
