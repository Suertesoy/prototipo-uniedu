import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface HeaderProps {
  title: string;
  /** Optional subtitle shown below the title in a lighter style */
  subtitle?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
}

/* Figma: Header/Page (14:85) + Header/Icon Button (14:83).
   Cores = tokens header/* (theme.css); tipografia = Type/Title MD + Type/Caption. */
export function Header({ title, subtitle, showBack = true, actions }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-header-bg-start to-header-bg-end">
      <div className="px-4 py-3 pt-14 flex items-center gap-2">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="flex-shrink-0 p-2 -ml-2 rounded-full text-header-fg active:bg-header-overlay-pressed outline-none focus-visible:ring-2 focus-visible:ring-header-fg"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        {/* Title block — flex-1 + min-w-0 ensures truncation works inside flex */}
        <div className="flex-1 min-w-0">
          <h1
            className="type-title-md text-header-fg truncate"
            title={title}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="type-caption text-header-fg-muted truncate mt-0.5"
              title={subtitle}
            >
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex-shrink-0 flex items-center">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
