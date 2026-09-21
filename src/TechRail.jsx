const iconMap = {
  "Java 8–21": "java",
  "Spring Boot": "springboot",
  "Spring Security": "springsecurity",
  "JPA": "hibernate",
  "Hibernate": "hibernate",
  "REST APIs": "swagger",
  "BFF": "springboot",
  "React.js": "react",
  "JavaScript": "javascript",
  "Ionic": "ionic",
  "SPA": "react",
  "REST integration": "swagger",
  "Responsive UI": "css3",
  "Kafka": "apachekafka",
  "Redis": "redis",
  "PostgreSQL": "postgresql",
  "MySQL": "mysql",
  "MongoDB": "mongodb",
  "Idempotency": "apachekafka",
  "Outbox": "apachekafka",
  "Query optimization": "postgresql",
  "Docker": "docker",
  "Kubernetes": "kubernetes",
  "Jenkins": "jenkins",
  "CI/CD": "githubactions",
  "AWS": "amazonwebservices",
  "Prometheus": "prometheus",
  "Grafana": "grafana",
  "Loki": "grafana",
  "JUnit": "junit5",
  "Mockito": "java",
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
          />
        )}
      </span>
      <span className="tech-pill-label">{item}</span>
    </span>
  );
}

export default function TechRail({ groups }) {
  const items = [...new Set(groups.flatMap(group => group.items))];
  const midpoint = Math.ceil(items.length / 2);
  const rows = [items.slice(0, midpoint), items.slice(midpoint)];

  return (
    <section className="tech-rail" aria-label="Technology toolkit">
      <div className="tech-rail-header">
        <span>Production stack</span>
        <span>Hover to pause</span>
      </div>
      {rows.map((row, rowIndex) => (
        <div className="tech-rail-window" key={rowIndex}>
          <div className={rowIndex ? "tech-rail-track reverse" : "tech-rail-track"}>
            {[...row, ...row].map((item, index) => (
              <TechItem key={`${item}-${index}`} item={item} duplicate={index >= row.length} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
