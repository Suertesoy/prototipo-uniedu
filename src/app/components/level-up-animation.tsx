import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Sparkles } from "lucide-react";

interface LevelUpAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  xpGained?: number; // XP ganho (padrão 100 = barra cheia)
  /** Camada do diálogo: quem renderiza controla foco e fundo inerte
      (useDialogFocus + useInertBackground), como na Home e na Loja. */
  dialogRef?: RefObject<HTMLDivElement | null>;
}

/* Camada modal: cobre a tela e bloqueia o fundo enquanto aberta. Sem botões na
   fase de progresso (o foco fica na própria camada); na fase "LEVEL UP!" o
   "Toque para continuar" é um botão com o mesmo visual. */
export function LevelUpAnimation({ isOpen, onClose, currentLevel, xpGained = 100, dialogRef }: LevelUpAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const leveledUp = xpGained >= 100;
  const continueRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  // onClose lido por ref: um novo onClose a cada render do pai não reinicia os timers
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setShowLevelUp(false);
      return;
    }
    // Anima a barra de progresso até o valor de XP ganho
    const timers = [setTimeout(() => setProgress(xpGained), 300)];

    // Se subiu de nível (xp >= 100), mostra animação de level up
    if (leveledUp) {
      timers.push(setTimeout(() => setShowLevelUp(true), 1500));
    } else {
      // Se não subiu de nível, fecha automaticamente após a animação
      timers.push(setTimeout(() => onCloseRef.current(), 2000));
    }
    // Fechou antes (Esc) ou desmontou: nenhum timer dispara depois
    return () => timers.forEach(clearTimeout);
  }, [isOpen, xpGained, leveledUp]);

  // Ao surgir o "Toque para continuar", o foco passa da camada para ele
  useEffect(() => {
    if (showLevelUp && document.activeElement === dialogRef?.current) continueRef.current?.focus();
  }, [showLevelUp, dialogRef]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        ref={dialogRef}
        data-dialog-layer
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 outline-none"
        onClick={showLevelUp ? onClose : undefined}
      >
        <p id={descId} className="sr-only">
          {showLevelUp
            ? `Você ganhou +${xpGained} XP e subiu para o nível ${currentLevel}.`
            : `Você ganhou +${xpGained} XP.`}
        </p>
        <div className="relative flex flex-col items-center px-8">
          {/* Partículas de fundo */}
          {showLevelUp && (
            <>
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5],
                    x: Math.cos((i * Math.PI * 2) / 16) * 120,
                    y: Math.sin((i * Math.PI * 2) / 16) * 120,
                  }}
                  transition={{ duration: 2, delay: i * 0.03 }}
                  className="absolute w-2 h-2 bg-[#A31545] rounded-full"
                />
              ))}
            </>
          )}

          {!showLevelUp ? (
            /* Barra de Progresso */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xs"
            >
              <div className="text-center mb-4">
                <p id={titleId} className="text-white text-sm font-medium mb-2">Ganhando XP...</p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-[#A31545]" aria-hidden="true" />
                  <span className="text-2xl font-black text-white">Nível {currentLevel}</span>
                </div>
              </div>

              {/* Barra de progresso — decorativa: o XP ganho está na descrição do diálogo */}
              <div className="relative" aria-hidden="true">
                <div className="h-4 bg-white/20 rounded-full overflow-hidden border-2 border-white/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#A31545] to-pink-400 relative"
                  >
                    <motion.div
                      animate={{ x: [0, 200] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-white text-xs font-bold mt-2"
                >
                  {progress}%
                </motion.p>
              </div>
            </motion.div>
          ) : (
            /* Level Up! */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Badge de nível */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative mb-6"
                aria-hidden="true"
              >
                {/* Brilho de fundo */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-[#A31545]/40 blur-3xl rounded-full"
                />

                <div className="relative w-32 h-32 bg-gradient-to-br from-[#A31545] to-pink-600 rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                  <div className="text-center">
                    <Award className="w-12 h-12 text-white mx-auto mb-1" />
                    <p className="text-xs text-white/90 font-bold">NÍVEL</p>
                    <p className="text-4xl font-black text-white">{currentLevel}</p>
                  </div>
                </div>
              </motion.div>

              {/* Texto */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <h2 id={titleId} className="text-3xl font-black text-white mb-2">LEVEL UP!</h2>
                <p className="text-white/80 text-sm mb-6">Você subiu de nível!</p>

                {/* Sparkles */}
                <div className="flex gap-2 justify-center mb-6" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        rotate: 360,
                        scale: [1, 1.3, 1]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                    </motion.div>
                  ))}
                </div>

                {/* Sem onClick próprio: o clique (ou Enter/Espaço) sobe para a camada, que fecha */}
                <motion.button
                  ref={continueRef}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.7, 1] }}
                  transition={{ duration: 1.5, delay: 0.8, repeat: Infinity }}
                  className="text-white text-sm font-medium rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Toque para continuar
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
