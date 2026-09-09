import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { getRouter } from "./router";
import "./styles.css";

const el = document.getElementById("root");
if (!el) throw new Error("root missing");

createRoot(el).render(
  <StrictMode>
    <RouterProvider router={getRouter()} />
  </StrictMode>,
);
