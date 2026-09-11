import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PortfolioBranding() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return undefined;

    const frame = window.requestAnimationFrame(() => {
      document.title = "Abhay Jaiswal — Java Full Stack Developer";

      const role = document.querySelector(".profile-role");
      const summary = document.querySelector(".profile-summary");
      const introTitle = document.querySelector("#intro-title");
      const introCopy = document.querySelector(".introduction > p");

      if (role) role.textContent = "Java Full Stack Developer";
      if (summary) {
        summary.textContent = "Java and Spring Boot on the backend, React on the frontend, with Docker, Jenkins CI/CD, and AWS fundamentals for delivery.";

        let stackLine = document.querySelector(".profile-stack-line");
        if (!stackLine) {
          stackLine = document.createElement("p");
          stackLine.className = "profile-stack-line";
          summary.insertAdjacentElement("afterend", stackLine);
        }
        stackLine.textContent = "Java · Spring Boot · React.js · Docker · Jenkins · CI/CD · AWS basics";
      }

      if (introTitle) {
        introTitle.replaceChildren(
          document.createTextNode("Java at the core."),
          document.createElement("br"),
          Object.assign(document.createElement("span"), { textContent: "Full-stack in delivery." }),
        );
      }

      if (introCopy) {
        introCopy.textContent = "I build end-to-end web applications with reliable Java services, responsive React interfaces, and delivery workflows built around containers, CI/CD, and cloud fundamentals.";
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
