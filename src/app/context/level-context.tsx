import { createContext, useContext, useState, ReactNode } from "react";

interface LevelContextType {
  level: number;
  xp: number;
  addXP: (amount: number) => { leveledUp: boolean; newLevel: number };
}

const LevelContext = createContext<LevelContextType | null>(null);

const XP_PER_LEVEL = 100; // 100 XP por nível

export function LevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState(2);
  const [xp, setXp] = useState(0);

  const addXP = (amount: number): { leveledUp: boolean; newLevel: number } => {
    const newXP = xp + amount;
    const levelsGained = Math.floor(newXP / XP_PER_LEVEL);
    const remainingXP = newXP % XP_PER_LEVEL;

    if (levelsGained > 0) {
      const newLevel = level + levelsGained;
      setLevel(newLevel);
      setXp(remainingXP);
      return { leveledUp: true, newLevel };
    } else {
      setXp(newXP);
      return { leveledUp: false, newLevel: level };
    }
  };

  return (
    <LevelContext.Provider value={{ level, xp, addXP }}>
      {children}
    </LevelContext.Provider>
  );
}

export function useLevel() {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error("useLevel must be used within LevelProvider");
  return ctx;
}
