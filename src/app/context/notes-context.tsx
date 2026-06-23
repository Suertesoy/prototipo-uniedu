import { createContext, useContext, useState, ReactNode } from "react";

export interface Note {
  id: string;
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  content: string;
  createdAt: Date;
  color: "yellow" | "pink" | "blue" | "green";
}

interface NotesContextType {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  deleteNote: (id: string) => void;
  editNote: (id: string, content: string) => void;
  getNotesByLesson: (lessonId: string) => Note[];
}

const NotesContext = createContext<NotesContextType | null>(null);

const INITIAL_NOTES: Note[] = [
  {
    id: "demo-1",
    lessonId: "1",
    lessonTitle: "Pesquisas Longitudinais - Parte 1",
    moduleTitle: "UX Research",
    content: "Pesquisas longitudinais acompanham os mesmos usuários ao longo do tempo — ótimo para entender mudanças de comportamento.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    color: "yellow",
  },
  {
    id: "demo-2",
    lessonId: "1",
    lessonTitle: "Pesquisas Longitudinais - Parte 1",
    moduleTitle: "UX Research",
    content: "Diferença chave: transversal = foto; longitudinal = vídeo do comportamento do usuário.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    color: "pink",
  },
];

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);

  const addNote = (note: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const editNote = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, content } : n))
    );
  };

  const getNotesByLesson = (lessonId: string) =>
    notes.filter((n) => n.lessonId === lessonId);

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotesByLesson }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used inside NotesProvider");
  return ctx;
}
