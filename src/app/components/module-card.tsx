import { useId } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ProgressBar } from "./progress-bar";

/* Figma: Card/Module (26:741). Light: gradiente -700 (tokens module/<cor>/start|end);
   Dark: superfície do card + acento lateral de 4px (module/<cor>/accent).
   O botão de expansão cobre o cabeçalho via ::after; a lista de aulas fica fora
   dele, então os links das aulas nunca ficam dentro de um botão. */
const colorClasses = {
  pink: "from-module-pink-start to-module-pink-end border-l-module-pink-accent",
  purple: "from-module-purple-start to-module-purple-end border-l-module-purple-accent",
  blue: "from-module-blue-start to-module-blue-end border-l-module-blue-accent",
  green: "from-module-green-start to-module-green-end border-l-module-green-accent",
};

export type ModuleColor = keyof typeof colorClasses;

interface ModuleCardProps {
  title: string;
  color: ModuleColor;
  completedCount: number;
  totalCount: number;
  expanded: boolean;
  onToggle: () => void;
  /** <LessonCard />s, exibidos quando expandido. */
  children: React.ReactNode;
}

export function ModuleCard({
  title,
  color,
  completedCount,
  totalCount,
  expanded,
  onToggle,
  children,
}: ModuleCardProps) {
  const id = useId();
  const buttonId = `${id}-toggle`;
  const regionId = `${id}-lessons`;
  const Chevron = expanded ? ChevronUp : ChevronDown;

  return (
    <div className="bg-card rounded-2xl shadow-md border border-border-card overflow-hidden">
      {/* Module header */}
      <div
        className={`relative bg-gradient-to-r bg-origin-border border-l-4 ${colorClasses[color]} dark:border-b dark:border-b-border p-4 text-module-fg transition-opacity has-[button:active]:opacity-90 has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-inset has-[button:focus-visible]:ring-module-fg`}
      >
        <h3 className="mb-1">
          <button
            type="button"
            id={buttonId}
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={expanded ? regionId : undefined}
            className="w-full flex justify-between items-center gap-2 text-left type-heading-sm outline-none after:absolute after:inset-0 after:content-['']"
          >
            <span className="min-w-0 break-words">{title}</span>
            <Chevron className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          </button>
        </h3>
        <div className="flex items-center gap-2 type-body-md text-module-fg-muted">
          <span>{totalCount} aulas</span>
          <span aria-hidden="true">•</span>
          <span>{completedCount} concluída{completedCount !== 1 ? "s" : ""}</span>
        </div>
        <ProgressBar
          variant="module"
          value={completedCount}
          max={totalCount}
          label={`Progresso do módulo ${title}`}
          className="mt-3"
        />
      </div>

      {/* Lessons */}
      {expanded && (
        <div id={regionId} role="region" aria-labelledby={buttonId}>
          <ul className="divide-y divide-border-divider bg-card">
            {children}
          </ul>
        </div>
      )}
    </div>
  );
}
