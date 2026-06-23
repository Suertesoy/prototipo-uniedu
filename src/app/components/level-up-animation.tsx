import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Sparkles } from "lucide-react";

interface LevelUpAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  xpGained?: number; // XP ganho (padrão 100 = barra cheia)
}

export function LevelUpAnimation({ isOpen, onClose, currentLevel, xpGained = 100 }: LevelUpAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const leveledUp = xpGained >= 100;

  useEffect(() => {
    if (isOpen) {
      // Anima a barra de progresso até o valor de XP ganho
      setTimeout(() => setProgress(xpGained), 300);

      // Se subiu de nível (xp >= 100), mostra animação de level up
      if (leveledUp) {
        setTimeout(() => setShowLevelUp(true), 1500);
      } else {
        // Se não subiu de nível, fecha automaticamente após a animação
        setTimeout(() => onClose(), 2000);
      }
    } else {
      setProgress(0);
      setShowLevelUp(false);
    }
  }, [isOpen, xpGained, leveledUp, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
        onClick={showLevelUp ? onClose : undefined}
      >
        <div className="relative flex flex-col items-center px-8">
          {/* Partículas de fundo */}
          {showLevelUp && (
            <>
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
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
                <p className="text-white text-sm font-medium mb-2">Ganhando XP...</p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-[#A31545]" />
                  <span className="text-2xl font-black text-white">Nível {currentLevel}</span>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="relative">
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
                <h2 className="text-3xl font-black text-white mb-2">LEVEL UP!</h2>
                <p className="text-white/80 text-sm mb-6">Você subiu de nível!</p>

                {/* Sparkles */}
                <div className="flex gap-2 justify-center mb-6">
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

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.7, 1] }}
                  transition={{ duration: 1.5, delay: 0.8, repeat: Infinity }}
                  className="text-white text-sm font-medium"
                >
                  Toque para continuar
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
