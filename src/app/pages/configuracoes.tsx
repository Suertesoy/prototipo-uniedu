import { Header } from "../components/header";
import { ChevronRight, Mail, Phone, CreditCard, Download, Bell, Moon, Sun } from "lucide-react";
import { BottomNav } from "../components/bottom-nav";
import { useTheme } from "../context/theme-context";
import { Link } from "react-router";

export function ConfiguracoesPage() {
  const { theme, toggleTheme } = useTheme();

  const userInfo = {
    name: "Fernanda Silva",
    since: "JUN/2025",
    email: "fernanda@gmail.com",
    phone: "(19) 99987-2456",
    paymentMethod: "VISA final 2443",
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-background flex flex-col overflow-hidden">
      <Header title="Configurações" />

      <div className="flex-1 overflow-y-auto pb-4">
        {/* Aparência */}
        <div className="p-4">
          <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-border">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Aparência</h3>
            </div>
            <button
              onClick={toggleTheme}
              className="w-full p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === "dark" ? "bg-gray-700" : "bg-yellow-100"
                }`}>
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Modo escuro</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {theme === "dark" ? "Ativado" : "Desativado"}
                  </p>
                </div>
              </div>
              <div className={`relative w-12 h-6 rounded-full transition-colors ${
                theme === "dark" ? "bg-[#A31545]" : "bg-gray-300"
              }`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  theme === "dark" ? "translate-x-6" : "translate-x-0.5"
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="px-4 pb-4">
          <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Informações Pessoais</h3>
              <Link to="/profile-settings" className="text-sm text-[#A31545] hover:underline">
                Editar
              </Link>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <div className="px-4 py-3 flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{userInfo.email}</p>
                </div>
              </div>

              <div className="px-4 py-3 flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Celular</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{userInfo.phone}</p>
                </div>
              </div>

              <div className="px-4 py-3 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Método de pagamento</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{userInfo.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Functionality */}
        <div className="px-4">
          <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-border">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Funcionalidades</h3>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <button className="w-full px-4 py-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-accent">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">Downloads</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>

              <button className="w-full px-4 py-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-accent">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">Notificações</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
