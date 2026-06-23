import { useState, useCallback, useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { StoreProvider } from "./context/store-context";
import { NotesProvider } from "./context/notes-context";
import { LevelProvider } from "./context/level-context";
import { ThemeProvider } from "./context/theme-context";
import { LessonProvider } from "./context/lesson-context";
import { LoginPage } from "./pages/login";
import { LoadingPage } from "./pages/loading";
import { PlanOnboardingPage } from "./pages/plan-onboarding";
import { ExternalLink } from "lucide-react";

type AppScreen = "login" | "loading" | "onboarding" | "app";

// Login nunca persiste entre recarregamentos — sempre começa no login
function getInitialScreen(): AppScreen {
  return "login";
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(getInitialScreen);

  // Logout: qualquer tela pode disparar este evento para voltar ao login
  useEffect(() => {
    const handleLogout = () => setScreen("login");
    window.addEventListener("uniedu-logout", handleLogout);
    return () => window.removeEventListener("uniedu-logout", handleLogout);
  }, []);

  const handleLogin = useCallback(() => {
    setScreen("loading");
  }, []);

  // Após loading: decide para onde ir baseado no plano já escolhido
  const handleLoadingComplete = useCallback(() => {
    const firstDone = localStorage.getItem("uniedu_first_access_done");
    if (firstDone) {
      // router.navigate atualiza o estado interno do router (replaceState não faz isso)
      router.navigate("/home", { replace: true });
      setScreen("app");
    } else {
      setScreen("onboarding");
    }
  }, []);

  const handlePlanSelected = useCallback((planId: string, homeId: number) => {
    localStorage.setItem("uniedu_study_plan_selected", planId);
    localStorage.setItem("uniedu_study_plan_home_id", String(homeId));
    localStorage.setItem("uniedu_first_access_done", "true");
    // router.navigate atualiza o estado interno do router (replaceState não faz isso)
    router.navigate("/home", { replace: true });
    setScreen("app");
  }, []);

  return (
    <ThemeProvider>
      <StoreProvider>
        <LevelProvider>
          <LessonProvider>
            <NotesProvider>
              {/* Fundo externo e centralizador — desktop: mockup iPhone | mobile: transparent */}
              <div className="app-outer">
                <div className="phone-wrap">

                  {/* Frame do iPhone — dimensões fixas no desktop, fullscreen no mobile */}
                  <div className="phone-frame">
                    {/* Notch/Dynamic Island simulada — oculta no mobile */}
                    <div className="phone-notch" />

                    {/* Tela do app — gate de fluxo inicial */}
                    <div className="phone-screen bg-background">
                      {screen === "login"      && <LoginPage onLogin={handleLogin} />}
                      {screen === "loading"    && <LoadingPage onComplete={handleLoadingComplete} />}
                      {screen === "onboarding" && <PlanOnboardingPage onComplete={handlePlanSelected} />}
                      {screen === "app"        && <RouterProvider router={router} />}
                    </div>
                  </div>

                  {/* Botões laterais decorativos — ocultos no mobile */}
                  <div className="phone-btn phone-btn-left-1" />
                  <div className="phone-btn phone-btn-left-2" />
                  <div className="phone-btn phone-btn-left-3" />
                  <div className="phone-btn phone-btn-right-1" />
                  <div className="phone-btn phone-btn-right-2" />

                  {/* Label decorativa — oculta no mobile */}
                  <p className="phone-label">iPHONE 16</p>

                </div>

                {/* CTA externo: case study — somente desktop (lg+), fixed para não afetar a centralização do mockup */}
                <a
                  href="https://case-app-uniedu.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:flex fixed right-10 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-3"
                >
                  <span className="flex items-center gap-2 bg-[#A31545] dark:bg-[#F48FB1] text-white px-5 py-3 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200">
                    <ExternalLink className="w-4 h-4" />
                    Ver case study
                  </span>
                  <span className="text-xs text-white/70 text-center leading-snug max-w-[160px]">
                    Conheça o processo por trás do protótipo
                  </span>
                </a>
              </div>
            </NotesProvider>
          </LessonProvider>
        </LevelProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
