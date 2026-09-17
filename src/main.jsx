import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ThemeToggle from "./ThemeToggle";
import "./styles.css";
import "./header-refresh.css";
import "./showcase-refresh.css";
import "./theme.css";
import "./motion.css";
import "./portfolio-polish.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeToggle />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

