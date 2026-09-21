const iconMap = {
  "Java 8–21": "java",
  "Java 21": "java",
  "Java 25": "java",
  "Spring Boot": "springboot",
  "Spring Security": "springsecurity",
  "JPA": "hibernate",
  "Hibernate": "hibernate",
  "REST APIs": "swagger",
  "BFF": "springboot",
  "React.js": "react",
  "React": "react",
  "JavaScript": "javascript",
  "Ionic": "ionic",
  "SPA": "react",
  "REST integration": "swagger",
  "Responsive UI": "css3",
  "Kafka": "apachekafka",
  "Redis": "redis",
  "PostgreSQL": "postgresql",
  "PostgreSQL + pgvector": "postgresql",
  "pgvector": "postgresql",
  "MySQL": "mysql",
  "MongoDB": "mongodb",
  "Idempotency": "apachekafka",
  "Outbox": "apachekafka",
  "Transactional outbox": "apachekafka",
  "Query optimization": "postgresql",
  "Docker": "docker",
  "Kubernetes": "kubernetes",
  "Jenkins": "jenkins",
  "CI/CD": "githubactions",
  "GitHub Actions": "githubactions",
  "AWS": "amazonwebservices",
  "Prometheus": "prometheus",
  "Grafana": "grafana",
  "Loki": "grafana",
  "Tempo": "grafana",
  "JUnit": "junit5",
  "Mockito": "java",
  "Gemini": "googlegemini",
  "Gemini AI": "googlegemini",
  "RAG": "googlegemini",
  "Virtual threads": "openjdk",
  "STOMP/WebSocket": "socketdotio",
  "WebSocket": "socketdotio",
  "SockJS": "javascript",
};

const shortLabel = value => value
  .replace(/[^a-zA-Z0-9 ]/g, " ")
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map(word => word[0])
  .join("")
  .toUpperCase();

function TechItem({ item, duplicate }) {
  const slug = iconMap[item];

  return (
    <span className="tech-pill" aria-hidden={duplicate ? "true" : undefined}>
      <span className="tech-pill-icon" aria-hidden="true">
        <span className="tech-pill-fallback">{shortLabel(item)}</span>
        {slug && (
          <img
            src={`https://cdn.simpleicons.org/${slug}`}
            alt=""
            width="18"
            height="18"
            loading="lazy"
            decoding="async"
            onError={event => { event.currentTarget.style.display = "none"; }}
          />
        )}
      </span>
      <span className="tech-pill-label">{item}</span>
    </span>
  );
}

function MovingRow({ items, reverse = false }) {
  return (
    <div className="tech-rail-window">
      <div className={reverse ? "tech-rail-track reverse" : "tech-rail-track"}>
        {[...items, ...items].map((item, index) => (
          <TechItem key={`${item}-${index}`} item={item} duplicate={index >= items.length} />
        ))}
      </div>
    </div>
  );
}

export default function TechRail({ groups, items: directItems, compact = false, title = "Engineering toolkit", id }) {
  const items = directItems ?? [...new Set((groups ?? []).flatMap(group => group.items))];
  if (!items.length) return null;

  if (compact) {
    return (
      <div className="project-tech-marquee" aria-label={title}>
        <span className="project-tech-label">{title}</span>
        <MovingRow items={items} />
      </div>
    );
  }

  const midpoint = Math.ceil(items.length / 2);
  const rows = [items.slice(0, midpoint), items.slice(midpoint)];

  return (
    <section className="tech-rail engineering-toolkit-rail" id={id} aria-label={title}>
      <div className="tech-rail-header">
        <span>{title}</span>
        <span>Java · distributed systems · delivery · UI</span>
      </div>
      <MovingRow items={rows[0]} />
      <MovingRow items={rows[1]} reverse />
    </section>
  );
}
