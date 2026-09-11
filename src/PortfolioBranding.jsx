import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const toolkitContent = [
  {
    group: "Backend",
    description: "Java services & API contracts",
    items: ["Java 8–21", "Spring Boot", "Spring Security", "JPA", "Hibernate", "REST APIs", "BFF"],
  },
  {
    group: "Frontend",
    description: "Responsive product interfaces",
    items: ["React.js", "JavaScript", "Ionic", "SPA", "REST integration", "Responsive UI"],
  },
  {
    group: "Data & distributed systems",
    description: "Messaging, caching & persistence",
    items: ["Kafka", "Redis", "PostgreSQL", "MySQL", "MongoDB", "Idempotency", "Outbox", "Query optimization"],
  },
  {
    group: "DevOps & cloud",
    description: "Delivery, cloud & observability",
    items: ["Docker", "Kubernetes", "Jenkins", "CI/CD", "AWS", "Prometheus", "Grafana", "Loki", "JUnit", "Mockito"],
  },
];

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
      const oldStackLine = document.querySelector(".profile-stack-line");

      if (role) role.textContent = "Java Full Stack Developer";
      if (summary) {
        summary.textContent = "I build reliable Java and Spring Boot services with responsive React interfaces, supported by Docker and CI/CD for production delivery.";
      }
      oldStackLine?.remove();

      if (introTitle) {
        introTitle.replaceChildren(
          document.createTextNode("Java at the core."),
          document.createElement("br"),
          Object.assign(document.createElement("span"), { textContent: "Full-stack in delivery." }),
        );
      }

      if (introCopy) {
        introCopy.textContent = "I build end-to-end applications across backend APIs, React interfaces, data, and delivery—focused on performance, reliability, and maintainable production systems.";
      }

      document.querySelectorAll(".toolkit-card").forEach((card, index) => {
        const content = toolkitContent[index];
        if (!content) return;

        const title = card.querySelector(".toolkit-card-heading h3");
        const description = card.querySelector(".toolkit-card-heading p");
        const tags = card.querySelector(".toolkit-tags");

        if (title) title.textContent = content.group;
        if (description) description.textContent = content.description;
        if (tags) {
          tags.setAttribute("aria-label", `${content.group} skills`);
          tags.replaceChildren(...content.items.map((item, itemIndex) => {
            const tag = document.createElement("li");
            tag.textContent = item;
            if (itemIndex < 2) tag.className = "toolkit-primary";
            return tag;
          }));
        }
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
