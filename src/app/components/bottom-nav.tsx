import { Home, Play, ShoppingBag, Users, User } from "lucide-react";
import { Link, useLocation } from "react-router";

/* Figma: Nav/Bottom (14:388) + Nav/Item (14:142).
   Distribuição da rodada 2F: itens hug (mín. 52px) com justify-between e
   padding lateral. Abaixo de 360px o padding encolhe para "Comunidade"
   caber em 320px sem invadir os rótulos vizinhos. */
export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Play, label: "Aulas", path: "/aulas" },
    { icon: ShoppingBag, label: "Loja", path: "/loja" },
    { icon: Users, label: "Comunidade", path: "/comunidade" },
    { icon: User, label: "Perfil", path: "/perfil" },
  ];

  return (
    <nav
      aria-label="Navegação principal"
      className="bg-gradient-to-b from-nav-bg-start to-nav-bg-end border-t border-nav-border-top flex-shrink-0"
    >
      <div className="flex items-center justify-between px-1 min-[360px]:px-3 pt-2 pb-3">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/home" && location.pathname === "/") ||
            (item.path === "/aulas" &&
              location.pathname.startsWith("/aulas"));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center gap-0.5 px-2 min-[360px]:px-3 py-1 min-w-[52px] rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-nav-item-active ${
                isActive ? "text-nav-item-active" : "text-nav-item-inactive"
              }`}
            >
              {/* Indicador do item ativo: reforço não cromático (forma + peso) */}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-4 rounded-full bg-nav-item-active"
                />
              )}
              <Icon
                className="w-5 h-5"
                strokeWidth={isActive ? 2.5 : 2}
                aria-hidden="true"
              />
              <span
                className={`type-label-xs whitespace-nowrap ${
                  isActive ? "font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
