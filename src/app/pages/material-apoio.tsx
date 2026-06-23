import { Header } from "../components/header";
import { FileText } from "lucide-react";

const materials = [
  { id: 1, title: "Material de Apoio", icon: "🦄" },
  { id: 2, title: "Programa UX Unicórnio 2.0", icon: null },
  { id: 3, title: "Informações importantes", icon: null },
  { id: 4, title: "Entre na Comunidade", icon: null },
  { id: 5, title: "Dica de Mestre", icon: null },
  { id: 6, title: "Calendário do Curso", icon: null },
  { id: 7, title: "Módulo Pônei", icon: null },
  { id: 8, title: "Módulo Mustang", icon: null },
  { id: 9, title: "Módulo UX Strategy", icon: null },
  { id: 10, title: "Módulo Research", icon: null },
  { id: 11, title: "Módulo Mapeamento e Facilitação", icon: null },
  { id: 12, title: "Módulo Research", icon: null },
];

export function MaterialApioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Material de Apoio" />

      <div className="max-w-2xl mx-auto p-4 space-y-2">
        {materials.map((material) => (
          <button
            key={material.id}
            className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow flex items-center gap-3"
          >
            {material.icon ? (
              <div className="text-3xl">{material.icon}</div>
            ) : (
              <FileText className="w-6 h-6 text-gray-600" />
            )}
            <span className="text-sm font-medium text-left">{material.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
