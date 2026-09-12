import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ThemeToggle from "./ThemeToggle";
import PortfolioBranding from "./PortfolioBranding";
import "./styles.css";
import "./dark-theme.css";
import "./header-refresh.css";
import "./showcase-refresh.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeToggle />
    <BrowserRouter>
      <PortfolioBranding />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
