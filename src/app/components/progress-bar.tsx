import { cn } from "./ui/utils";

/* Figma: Progress/Bar (24:706).
   module  → 6px, dentro de Card/Module (tokens progress/module-*).
   journey → 4px, jornada da Home (tokens progress/journey-*; Light com o
             contraste proposto: preenchimento branco sobre trilho black/30).
   O valor do Figma é uma máscara de gradiente; aqui é a largura do preenchimento. */
const variantClasses = {
  module: {
    track: "h-1.5 bg-progress-module-track",
    fill: "bg-progress-module-fill",
  },
  journey: {
    track: "h-1 bg-progress-journey-track",
    fill: "bg-progress-journey-fill rounded-full",
  },
};

interface ProgressBarProps {
  variant: keyof typeof variantClasses;
  /** Quantidade concluída (ex.: aulas concluídas). */
  value: number;
  /** Total (ex.: aulas do módulo). */
  max: number;
  /** Nome acessível: o que este progresso representa. */
  label: string;
  className?: string;
}

export function ProgressBar({ variant, value, max, label, className }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const styles = variantClasses[variant];

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("w-full rounded-full overflow-hidden", styles.track, className)}
    >
      <div
        className={cn("h-full transition-all duration-500", styles.fill)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
