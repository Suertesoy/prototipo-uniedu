import * as React from "react";
import { Link } from "react-router";
import { cva } from "class-variance-authority";

import { cn } from "./ui/utils";

/* Figma: Button/Primary (3:70). SM 36px · MD 44px · LG 48px.
   Cores: action/primary (--primary), action/primary-fg (--primary-foreground,
   #120E10 no Dark), action/primary-pressed. Foco: 2px de espaço + 2px de
   border/focus (--ring). Disabled: opacidade 40% no botão inteiro (fundo e
   rótulo), cursor bloqueado e sem resposta de pressed.
   O texto é exibido como recebido: os CTAs atuais já passam o rótulo em
   caixa alta, então a identidade é preservada sem forçar text-transform. */
const primaryButtonVariants = cva(
  "inline-flex items-center justify-center text-center px-5 font-bold tracking-[0.025em] bg-primary text-primary-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "py-2.5 gap-1 rounded-lg text-xs leading-4 [&_svg]:size-3",
        md: "py-3 gap-2 rounded-xl text-sm leading-5 [&_svg]:size-4",
        lg: "py-3.5 gap-2 rounded-2xl text-sm leading-5 [&_svg]:size-4",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type PrimaryButtonSize = "sm" | "md" | "lg";

interface PrimaryButtonOwnProps {
  size?: PrimaryButtonSize;
  /** Ícone decorativo exibido antes do rótulo (ex.: <Play />). */
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

function PrimaryButtonContent({ icon, children }: Pick<PrimaryButtonOwnProps, "icon" | "children">) {
  return (
    <>
      {icon && (
        <span aria-hidden="true" className="inline-flex">
          {icon}
        </span>
      )}
      {children}
    </>
  );
}

/** Ação primária (Button/Primary). Use uma por seção. */
export function PrimaryButton({
  size,
  icon,
  fullWidth,
  className,
  type = "button",
  children,
  ...props
}: PrimaryButtonOwnProps & Omit<React.ComponentProps<"button">, "children">) {
  return (
    <button
      type={type}
      className={cn(
        primaryButtonVariants({ size, fullWidth }),
        "enabled:active:bg-action-primary-pressed disabled:opacity-40 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      <PrimaryButtonContent icon={icon}>{children}</PrimaryButtonContent>
    </button>
  );
}

/** Mesmo visual de Button/Primary para navegação: mantém a semântica de link. */
export function PrimaryButtonLink({
  size,
  icon,
  fullWidth,
  className,
  children,
  ...props
}: PrimaryButtonOwnProps & Omit<React.ComponentProps<typeof Link>, "children">) {
  return (
    <Link
      className={cn(
        primaryButtonVariants({ size, fullWidth }),
        "active:bg-action-primary-pressed",
        className,
      )}
      {...props}
    >
      <PrimaryButtonContent icon={icon}>{children}</PrimaryButtonContent>
    </Link>
  );
}
