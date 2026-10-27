import { useEffect, useRef, type RefObject } from "react";

// ── Diálogos modais: foco ─────────────────────────────────────────────────────
// Extraído da Home (rodada 3G) para ser compartilhado com a Loja (rodada 3J).
// Só entra no ciclo o que o Tab alcançaria: ficam fora desabilitados,
// tabindex="-1", ocultos (display/visibility) e o que estiver sob [inert].
const TABBABLE =
  'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function getTabbable(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (el) =>
      el.tabIndex >= 0 &&
      !el.matches(":disabled") &&
      !el.closest("[inert]") &&
      el.getClientRects().length > 0 &&
      getComputedStyle(el).visibility !== "hidden"
  );
}

export interface DialogFocusOptions {
  /** Destino do foco ao abrir. */
  initialFocus: () => HTMLElement | null | undefined;
  /** Destino ao fechar quando quem abriu não existe mais (ou não houve quem abrisse). */
  fallbackFocus: () => HTMLElement | null | undefined;
  /** Esc: o mesmo fechamento do botão do diálogo. */
  onEscape: () => void;
  /** false quando outro diálogo vai assumir o foco logo em seguida. */
  shouldRestoreFocus?: () => boolean;
}

/** Foco inicial, ciclo de Tab/Shift+Tab, Esc e retorno do foco ao fechar.
    As opções são lidas no momento do uso (sempre as do último render). */
export function useDialogFocus(
  dialogRef: RefObject<HTMLElement | null>,
  open: boolean,
  options: DialogFocusOptions
) {
  const latest = useRef(options);
  latest.current = options;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    const active = document.activeElement;
    const opener =
      active instanceof HTMLElement && active !== document.body && !dialog.contains(active)
        ? active
        : null;

    (latest.current.initialFocus() ?? getTabbable(dialog)[0])?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        latest.current.onEscape();
        return;
      }
      if (event.key !== "Tab") return;

      event.preventDefault();
      const items = getTabbable(dialog);
      if (items.length === 0) return;
      const current = document.activeElement;
      const index = items.indexOf(current as HTMLElement);
      let next: HTMLElement | undefined;
      if (index !== -1) {
        next = items[(index + (event.shiftKey ? items.length - 1 : 1)) % items.length];
      } else if (current && dialog.contains(current)) {
        // Foco num elemento não tabulável do diálogo (o título focado na abertura):
        // segue a ordem do documento a partir dele
        const after = items.filter(
          (el) => current.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING
        );
        next = event.shiftKey ? items[items.length - after.length - 1] : after[0];
      }
      (next ?? (event.shiftKey ? items[items.length - 1] : items[0])).focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (latest.current.shouldRestoreFocus?.() === false) return;
      // isConnected: no desmonte da página (ou se o controle sumiu) nada é focado
      const target = opener?.isConnected ? opener : latest.current.fallbackFocus();
      if (target?.isConnected) target.focus();
    };
  }, [open, dialogRef]);
}
