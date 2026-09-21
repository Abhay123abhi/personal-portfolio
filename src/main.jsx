import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import "./header-refresh.css";
import "./theme.css";
import "./motion.css";
import "./design-overhaul.css";
import "./responsive.css";
import "./v2/v2.css";

document.documentElement.dataset.theme = "dark";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

