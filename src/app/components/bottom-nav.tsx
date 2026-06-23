import { Home, Play, ShoppingBag, Users, User } from "lucide-react";
import { Link, useLocation } from "react-router";

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
    <nav className="bg-gradient-to-b from-[#A31545] to-[#7D1133] dark:from-[#1E1A1D] dark:to-[#1A1618] dark:border-t dark:border-white/8 flex-shrink-0">
      <div className="flex items-center justify-around px-1 pt-2 pb-3">
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
              className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[52px]"
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-white dark:text-[#F48FB1]"
                    : "text-white/60 dark:text-white/35"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[9px] ${
                  isActive
                    ? "text-white dark:text-[#F48FB1] font-semibold"
                    : "text-white/60 dark:text-white/35"
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
