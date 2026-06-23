import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/theme-context";
import logoUniedu from "../../imports/logo-uniedu.png";

const RESET_KEYS = [
  "uniedu_first_access_done",
  "uniedu_study_plan_selected",
  "uniedu_study_plan_home_id",
  "uniedu_home_onboarding_seen",
  "uniedu_comunidade_onboarding_seen",
  "homeJornadaDone",
  "rankingVisible",
];

function hasExistingState(): boolean {
  return !!(
    localStorage.getItem("uniedu_first_access_done") ||
    localStorage.getItem("uniedu_study_plan_selected")
  );
}

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isReturning, setIsReturning] = useState(hasExistingState);
  const [showConfirm, setShowConfirm] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleReset = () => {
    RESET_KEYS.forEach((key) => localStorage.removeItem(key));
    setShowConfirm(false);
    setIsReturning(false);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-background overflow-hidden">

      {/* Topo com marca */}
      <div className="relative bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545] dark:from-[#1E1A1D] dark:via-[#1A1518] dark:to-[#120E10] dark:border-b dark:border-[#F48FB1]/20 pt-16 pb-10 px-6 flex flex-col items-center text-white flex-shrink-0">
        {/* Toggle dark/light — canto superior direito */}
        <button
          onClick={toggleTheme}
          className="absolute top-[68px] right-4 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center active:bg-white/30 transition-colors"
          aria-label="Alternar tema"
        >
          {theme === "dark"
            ? <Sun className="w-4 h-4 text-white" />
            : <Moon className="w-4 h-4 text-white" />}
        </button>

        <div className="w-40 h-40 flex items-center justify-center mb-6 flex-shrink-0">
          <img src={logoUniedu} alt="APP UNIEDU" width={160} height={160} className="w-40 h-40 object-contain drop-shadow-xl" />
        </div>
        <h1 className="text-2xl font-black tracking-tight">APP UNIEDU</h1>
        <p className="text-white/90 text-sm mt-1">Sua jornada de aprendizado</p>
      </div>

      {/* Formulário */}
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-6 flex flex-col">

        {/* Título varia conforme estado */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {isReturning ? "Bem-vinda de volta" : "Bem-vinda ao APP UNIEDU"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-muted-foreground mb-7">
          {isReturning ? "Acesse sua conta para continuar" : "Entre para começar sua jornada"}
        </p>

        <div className="space-y-4 mb-5">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider mb-2 block">
              E-mail
            </label>
            <input
              type="email"
              defaultValue="fernanda@email.com"
              readOnly
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-border bg-gray-50 dark:bg-muted text-gray-900 dark:text-gray-100 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider mb-2 block">
              Senha
            </label>
            <input
              type="text"
              defaultValue="123456"
              readOnly
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-border bg-gray-50 dark:bg-muted text-gray-900 dark:text-gray-100 text-sm focus:outline-none tracking-widest font-mono"
            />
          </div>
        </div>

        {/* Aviso demo */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
            🔓 <strong>Modo demonstração</strong> — credenciais de acesso já preenchidas automaticamente.
          </p>
        </div>

        {/* Botão principal */}
        <button
          onClick={onLogin}
          className="w-full bg-[#A31545] active:bg-[#7D1133] text-white font-bold py-4 rounded-2xl text-sm tracking-widest transition-colors shadow-lg"
        >
          ENTRAR
        </button>

        {/* Botão de reset — só aparece quando há estado salvo */}
        {isReturning && (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full mt-4 py-2.5 text-xs text-gray-400 dark:text-muted-foreground hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            Resetar protótipo
          </button>
        )}

      </div>

      {/* Modal de confirmação de reset */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-end justify-center pb-0">
          <div className="bg-white dark:bg-card w-full rounded-t-3xl px-6 pt-5 pb-8 shadow-2xl">

            {/* Handle */}
            <div className="w-10 h-1 bg-gray-200 dark:bg-border rounded-full mx-auto mb-5" />

            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
              Resetar protótipo?
            </h3>
            <p className="text-sm text-gray-500 dark:text-muted-foreground leading-relaxed mb-2">
              Isso vai apagar escolhas e progresso salvos neste navegador para você visualizar o fluxo desde o início.
            </p>
            <p className="text-xs text-gray-400 dark:text-muted-foreground/70 mb-6">
              Indicado para testes e demonstrações do protótipo.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3.5 rounded-2xl border border-gray-200 dark:border-border text-sm font-semibold text-gray-600 dark:text-gray-300 active:bg-gray-50 dark:active:bg-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white text-sm font-bold active:opacity-90 transition-opacity"
              >
                Resetar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
