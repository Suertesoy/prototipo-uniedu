
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { registerServiceWorker } from "./registerSW";

  registerServiceWorker();

  createRoot(document.getElementById("root")!).render(<App />);
  