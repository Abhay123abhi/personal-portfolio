import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/base.css";
import "./styles/header.css";
import "./styles/theme.css";
import "./styles/motion.css";
import "./styles/layout.css";
import "./styles/responsive.css";
import "./styles/portfolio.css";
import "./styles/navigation.css";
import "./styles/blog.css";
import "./styles/mobile.css";

document.documentElement.dataset.theme = "dark";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

