import { CheckCircle2, Clock, Play } from "lucide-react";
import { Link } from "react-router";

/* Figma: Card/Lesson (25:723). Pending → Play; Completed → CheckCircle2 + "Concluída".
   Renderiza um <li>: use dentro da lista de ModuleCard. */
interface LessonCardProps {
  title: string;
  duration: string;
  completed: boolean;
  to: string;
}

export function LessonCard({ title, duration, completed, to }: LessonCardProps) {
  return (
    <li>
      <Link
        to={to}
        className="block p-4 hover:bg-bg-page transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-lesson-tile-start to-lesson-tile-end rounded-xl flex items-center justify-center">
            {completed ? (
              <CheckCircle2 className="w-7 h-7 text-status-success-icon" aria-hidden="true" />
            ) : (
              <Play className="w-7 h-7 text-primary" aria-hidden="true" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="type-title-sm text-text-content mb-1 line-clamp-2">
              {title}
            </h4>
            <div className="flex items-center gap-2 text-text-meta">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span className="type-caption">{duration}</span>
              {completed ? (
                <span className="ml-auto type-label-sm text-status-success-fg">
                  Concluída
                </span>
              ) : (
                <span className="sr-only">, não concluída</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
