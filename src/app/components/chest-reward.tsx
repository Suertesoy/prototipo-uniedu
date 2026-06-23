import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coins, Sparkles } from "lucide-react";

interface ChestRewardProps {
  isOpen: boolean;
  onClose: () => void;
  reward: number;
}

export function ChestReward({ isOpen, onClose, reward }: ChestRewardProps) {
  const [stage, setStage] = useState<"closed" | "opening" | "revealed">("closed");

  useEffect(() => {
    if (isOpen) {
      // Animação: baú fechado -> abrindo -> revelado
      setStage("closed");
      setTimeout(() => setStage("opening"), 300);
      setTimeout(() => setStage("revealed"), 1200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
        onClick={stage === "revealed" ? onClose : undefined}
      >
        <div className="relative flex flex-col items-center">
          {/* Partículas de fundo */}
          {stage === "revealed" && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5],
                    x: Math.cos((i * Math.PI * 2) / 12) * 100,
                    y: Math.sin((i * Math.PI * 2) / 12) * 100,
                  }}
                  transition={{ duration: 1.5, delay: i * 0.05 }}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                />
              ))}
            </>
          )}

          {/* Baú */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative mb-6"
          >
            {/* Brilho de fundo */}
            {stage !== "closed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.6, 0.6], scale: [0.8, 1.2, 1.2] }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-yellow-400/30 blur-3xl rounded-full"
              />
            )}

            {/* Corpo do baú */}
            <div className="relative">
              {/* Tampa */}
              <motion.div
                animate={
                  stage === "opening" || stage === "revealed"
                    ? { rotateX: -45, y: -20 }
                    : { rotateX: 0, y: 0 }
                }
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ transformOrigin: "bottom center", perspective: 1000 }}
                className="w-32 h-16 bg-gradient-to-b from-amber-600 to-amber-700 rounded-t-xl border-4 border-amber-800 relative"
              >
                {/* Detalhe da fechadura */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-8 bg-yellow-600 rounded-md border-2 border-amber-900" />
              </motion.div>

              {/* Base */}
              <div className="w-32 h-20 bg-gradient-to-b from-amber-700 to-amber-800 rounded-b-xl border-4 border-t-0 border-amber-900 relative">
                <div className="absolute inset-2 border-2 border-amber-600/30 rounded-md" />
              </div>
            </div>

            {/* Luz saindo do baú */}
            {stage === "opening" && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 1, 1], scaleY: [0, 1.5, 1.5] }}
                transition={{ duration: 0.8 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-32 bg-gradient-to-t from-yellow-400/60 via-yellow-300/40 to-transparent blur-md"
                style={{ transformOrigin: "bottom center" }}
              />
            )}
          </motion.div>

          {/* Recompensa revelada */}
          {stage === "revealed" && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              {/* Badge de pontos */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl px-8 py-4 shadow-2xl border-4 border-yellow-300"
              >
                <div className="flex items-center gap-3">
                  <Coins className="w-8 h-8 text-white" />
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">+{reward}</p>
                    <p className="text-xs font-bold text-yellow-100 tracking-wide">PONTOS</p>
                  </div>
                  <Coins className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* Sparkles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-1"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Mensagem de tap */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7, 1] }}
                transition={{ duration: 1.5, delay: 0.8, repeat: Infinity }}
                className="text-white text-sm font-medium mt-4"
              >
                Toque para continuar
              </motion.p>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
