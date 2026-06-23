import { useState } from "react";
import { ChevronLeft, Edit, Shield } from "lucide-react";
import { useNavigate } from "react-router";

export function ProfileSettingsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Fernanda Silva",
    email: "fernanda@gmail.com",
    phone: "(19) 99987-2456",
  });

  return (
    <div className="h-full bg-gray-50 dark:bg-background flex flex-col overflow-hidden">
      {/* Header com Gradiente AAA */}
      <div className="relative bg-gradient-to-br from-[#F48FB1] via-[#EC407A] to-[#A31545] px-4 pt-14 pb-6 text-white flex-shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 active:bg-white/20 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Meus Dados</h1>
        </div>
        
        {/* Avatar / Editar Foto */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 bg-white dark:bg-[#1E1A1D] rounded-full flex items-center justify-center text-4xl shadow-md border-4 border-white/20">
              👤
            </div>
            {/* Ícone de Lápis (Editar foto) com Soft Line-Art 2px e cor primária AAA */}
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-card rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform border border-gray-100 dark:border-border">
              <Edit className="w-4 h-4 text-[#A31545] dark:text-[#F48FB1]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider mb-2 block">
              Nome Completo
            </label>
            {/* Inputs com focus ring da cor primária AAA */}
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#A31545] dark:focus:ring-[#F48FB1] transition-shadow"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider mb-2 block">
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#A31545] dark:focus:ring-[#F48FB1] transition-shadow"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-wider mb-2 block">
              Celular
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#A31545] dark:focus:ring-[#F48FB1] transition-shadow"
            />
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-4 flex items-center justify-between shadow-sm mt-2">
          <div className="flex items-center gap-3">
            {/* Ícone de Escudo (Segurança) com Soft Line-Art 2px e cor primária AAA */}
            <div className="w-10 h-10 bg-gray-50 dark:bg-background rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#A31545] dark:text-[#F48FB1]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Segurança</p>
              <p className="text-xs text-gray-500 dark:text-muted-foreground">Alterar sua senha</p>
            </div>
          </div>
          <button className="text-xs font-bold text-[#A31545] dark:text-[#F48FB1] hover:underline">
            ALTERAR
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Botão Salvar com cores AAA e texto branco */}
        <button 
          onClick={() => navigate(-1)}
          className="w-full bg-[#A31545] active:bg-[#7D1133] dark:bg-[#F48FB1] dark:active:bg-[#EC407A] text-white font-bold py-4 rounded-2xl text-sm tracking-widest transition-colors shadow-lg mt-6"
        >
          SALVAR ALTERAÇÕES
        </button>
      </div>
    </div>
  );
}
