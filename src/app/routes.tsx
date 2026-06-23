import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "./pages/home";
import { AulasPage } from "./pages/aulas";
import { AulaDetalhePage } from "./pages/aula-detalhe";
import { PerfilPage } from "./pages/perfil";
import { ComunidadePage } from "./pages/comunidade";
import { LojaPage } from "./pages/loja";
import { ConfiguracoesPage } from "./pages/configuracoes";
import { MaterialApioPage } from "./pages/material-apoio";
import { RankingPage } from "./pages/ranking";
import { ChatPage } from "./pages/chat";
import { ChatTurmaPage } from "./pages/chat-turma";
import { CaseDetalhePage } from "./pages/case-detalhe";
import { ProfileSettingsPage } from "./pages/profile-settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/home",
    Component: HomePage,
  },
  {
    path: "/aulas",
    Component: AulasPage,
  },
  {
    path: "/aulas/:id",
    Component: AulaDetalhePage,
  },
  {
    path: "/perfil",
    Component: PerfilPage,
  },
  {
    path: "/comunidade",
    Component: ComunidadePage,
  },
  {
    path: "/loja",
    Component: LojaPage,
  },
  {
    path: "/configuracoes",
    Component: ConfiguracoesPage,
  },
  {
    path: "/material-apoio",
    Component: MaterialApioPage,
  },
  {
    path: "/ranking",
    Component: RankingPage,
  },
  {
    path: "/chat",
    Component: ChatPage,
  },
  {
    path: "/chat-turma",
    Component: ChatTurmaPage,
  },
  {
    path: "/cases/:slug",
    Component: CaseDetalhePage,
  },
  {
    path: "/profile-settings",
    Component: ProfileSettingsPage,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);