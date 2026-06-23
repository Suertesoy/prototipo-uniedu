import { createContext, useContext, useState, ReactNode } from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
export interface CurrentLesson {
  id: string;
  title: string;
  module: string;
}

interface LessonContextType {
  currentLesson: CurrentLesson | null;
  setCurrentLesson: (lesson: CurrentLesson | null) => void;
}

/* ─── Context ────────────────────────────────────────────────────────────── */
const LessonContext = createContext<LessonContextType | null>(null);

export function LessonProvider({ children }: { children: ReactNode }) {
  const [currentLesson, setCurrentLesson] = useState<CurrentLesson | null>(null);

  return (
    <LessonContext.Provider value={{ currentLesson, setCurrentLesson }}>
      {children}
    </LessonContext.Provider>
  );
}

export function useCurrentLesson() {
  const ctx = useContext(LessonContext);
  if (!ctx) throw new Error("useCurrentLesson must be used within LessonProvider");
  return ctx;
}
