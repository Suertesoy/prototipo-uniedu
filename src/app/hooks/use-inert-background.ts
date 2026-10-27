import { useEffect, type RefObject } from "react";

/** Marca os filhos diretos da raiz da página que são camadas de diálogo:
    nunca ficam inertes. */
export const DIALOG_LAYER_ATTR = "data-dialog-layer";

// Quantas páginas estão com fundo inerte agora. O App Shell só ouve a
// transição 0 → 1 (true) e 1 → 0 (false), então duas instâncias nunca se
// desmentem (ex.: a cleanup de uma página saindo depois de outra ativar).
let activeBackgrounds = 0;

function notifyAppShell(open: boolean) {
  window.dispatchEvent(new CustomEvent("uniedu-dialog", { detail: open }));
}

/** Torna inertes os filhos de `root` que não são camadas de diálogo
    ([data-dialog-layer]) nem regiões aria-live (que precisam continuar
    anunciando). Nunca alcança um ancestral do diálogo e não trava a
    rolagem: os painéis continuam rolando.
    O que fica fora da página (link do case no App Shell) é avisado pelo
    evento "uniedu-dialog", no mesmo padrão do "uniedu-logout".
    Declare antes dos useDialogFocus: ao fechar, o inert sai antes de o foco
    voltar ao fundo. Mantenha `active` true durante trocas entre diálogos
    para o fundo não "piscar". */
export function useInertBackground(rootRef: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!active || !root) return;
    const background = Array.from(root.children).filter(
      (el) =>
        !el.hasAttribute(DIALOG_LAYER_ATTR) &&
        !el.hasAttribute("aria-live") &&
        !el.hasAttribute("inert")
    );
    background.forEach((el) => el.setAttribute("inert", ""));
    activeBackgrounds += 1;
    if (activeBackgrounds === 1) notifyAppShell(true);
    return () => {
      background.forEach((el) => el.removeAttribute("inert"));
      activeBackgrounds -= 1;
      if (activeBackgrounds === 0) notifyAppShell(false);
    };
  }, [rootRef, active]);
}
