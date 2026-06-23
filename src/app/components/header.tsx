import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface HeaderProps {
  title: string;
  /** Optional subtitle shown below the title in a lighter style */
  subtitle?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, showBack = true, actions }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-[#A31545] to-[#7D1133] dark:from-[#1C0E15] dark:to-[#160B11]">
      <div className="px-4 py-3 pt-14 flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex-shrink-0 p-2 -ml-2 rounded-full active:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Title block — flex-1 + min-w-0 ensures truncation works inside flex */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-white text-[15px] leading-snug truncate"
            title={title}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-white/65 text-[11px] leading-tight truncate mt-0.5"
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
