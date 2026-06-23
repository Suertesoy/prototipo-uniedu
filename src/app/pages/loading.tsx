import { useEffect } from "react";
import { useTheme } from "../context/theme-context";
import logoUniedu from "../../imports/logo-uniedu.png";

interface LoadingPageProps {
  onComplete: () => void;
}

export function LoadingPage({ onComplete }: LoadingPageProps) {
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545] dark:from-[#120E10] dark:via-[#120E10] dark:to-[#120E10] dark:bg-[#120E10]">

      <div className="flex flex-col items-center gap-5">

        {/* Logo — única para ambos os temas */}
        <div className="w-40 h-40 flex items-center justify-center">
          <img
            src={logoUniedu}
            alt="APP UNIEDU"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Nome */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-white dark:text-[#F48FB1] tracking-tight">APP UNIEDU</h1>
          <p className="text-white/80 dark:text-[#F48FB1]/80 text-xs mt-1 tracking-widest uppercase">Plataforma de aprendizado</p>
        </div>

        {/* Dots animados */}
        <div className="flex items-center gap-2 mt-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 bg-white dark:bg-[#F48FB1] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.8s" }}
            />
          ))}
        </div>

        <p className="text-white dark:text-[#F48FB1] text-sm font-medium mt-1">Preparando sua jornada…</p>

      </div>

    </div>
  );
}
