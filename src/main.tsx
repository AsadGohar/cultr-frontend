import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { initializeAppStore } from "@/stores";
import AppRoutes from "./routes";

initializeAppStore();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
);
