export const identity = {
  name: "Abhay Jaiswal",
  role: "Java backend-focused full-stack developer",
  headline: "Backend first. Production minded.",
  summary: "I build reliable Java and Spring Boot services, event-driven workflows, and React interfaces — from API design to production release.",
  email: "abhayjaiswal983@gmail.com",
  github: "https://github.com/Abhay123abhi",
  linkedin: "https://www.linkedin.com/in/abhay983",
  twitter: "https://x.com/abhayjaissssss",
  resume: "/Abhay_SDE.pdf",
  photo: "/profile2.png",
};

export const productionStats = [
  { value: "4+", label: "years shipping production software" },
  { value: "1K+", label: "business events processed daily" },
  { value: "25%", label: "faster deployment cycles" },
  { value: "60%", label: "reduction in manual operations" },
];

export const capabilities = [
  {
    key: "backend",
    eyebrow: "Core",
    title: "Backend Development",
    subtitle: "Java services & API contracts",
    body: "Spring Boot APIs, security boundaries, BFF layers, data access, testing, and the production details that sit behind a clean endpoint.",
    tags: ["Java", "Spring Boot", "Spring Security", "JPA", "REST", "JUnit"],
  },
  {
    key: "distributed",
    eyebrow: "Systems",
    title: "Distributed Systems",
    subtitle: "Event-driven, durable, observable",
    body: "Kafka workflows, transactional outbox, idempotency, caching, retries, ordering, evidence pipelines, and failure-aware service boundaries.",
    tags: ["Kafka", "Redis", "Outbox", "PostgreSQL", "MongoDB", "Observability"],
  },
  {
    key: "delivery",
    eyebrow: "Production",
    title: "Delivery & Reliability",
    subtitle: "Ship, observe, recover",
    body: "CI/CD, containers, Kubernetes, production monitoring, release readiness, and operational support across Asian markets.",
    tags: ["Docker", "Kubernetes", "Jenkins", "AWS", "Grafana", "Prometheus"],
  },
  {
    key: "product",
    eyebrow: "Product",
    title: "Frontend Delivery",
    subtitle: "Backend-heavy, UI-capable",
    body: "React and Ionic interfaces connected to backend APIs, with responsive product flows that work across web and mobile.",
    tags: ["React", "Ionic", "JavaScript", "SPA", "Responsive UI"],
  },
];

export const projects = [
  {
    eyebrow: "Reliability engineering · Event-driven backend",
    title: "Incident Investigation Platform",
    statement: "Turn a production alert into a persistent, evidence-backed incident report.",
    problem: "Incident evidence is scattered across metrics, logs, and traces, while repeated alerts and broker failures can create noise or interrupt investigation.",
    approach: "Alertmanager intake deduplicates incidents, persists investigation intent through a transactional outbox, drives telemetry collection over Kafka, then optionally enriches completed evidence using Gemini embeddings, pgvector retrieval, and a separately persisted RCA hypothesis.",
    stack: ["Java 25", "Spring Boot", "Kafka", "PostgreSQL + pgvector", "Prometheus", "Loki", "Tempo", "Grafana", "Gemini AI", "RAG"],
    github: "https://github.com/Abhay123abhi/event-driven-incident-observability",
    live: null,
  },
  {
    eyebrow: "Full-stack product · Source-grounded AI",
    title: "News Intelligence",
    statement: "Aggregate multiple publishers, then turn the feed into grounded briefs, answers, and coverage comparisons.",
    problem: "Publishers expose inconsistent schemas and failure behaviour, while readers still need a reliable way to search, compare, and understand the combined feed.",
    approach: "Redis cache first, Guardian and NYT adapters fan out concurrently on virtual threads, results are normalized and deduplicated, and a separate Gemini workspace adds citation-validated summaries, Q&A, briefs, and comparisons.",
    stack: ["Java 21", "Spring Boot", "React", "Redis", "Gemini", "Virtual threads", "REST APIs"],
    github: "https://github.com/Abhay123abhi/ai-powered-news-intelligence",
    live: "https://abhay123abhi-news-web.onrender.com",
  },
  {
    eyebrow: "Real-time systems · Reliable messaging",
    title: "Real-time Chat",
    statement: "Room-based guest messaging with durable writes, live presence, and reconnect recovery.",
    problem: "Live chat needs more than WebSocket delivery: retries, reconnects, missed events, room presence, and persistent history all need predictable behavior.",
    approach: "The client sends an idempotent REST write, the backend serializes room writers and persists a sequence in MongoDB before STOMP broadcast, while cursor history and periodic synchronization recover missed events after reconnects.",
    stack: ["Java 21", "Spring Boot", "STOMP/WebSocket", "MongoDB", "React", "SockJS", "Docker", "GitHub Actions"],
    github: "https://github.com/Abhay123abhi/chat-app",
    live: null,
  },
];

export const experienceMetrics = [
  { value: "4s → 3s", text: "Reduced client response time through Spring Boot BFF services, payload optimization, and Okta M2M security." },
  { value: "1,000+ / day", text: "Designed Kafka microservices for asynchronous business notifications." },
  { value: "25% faster", text: "Automated release delivery with Jenkins, Docker, and Kubernetes." },
  { value: "2,000+ advisors", text: "Automated rules and policy workflows, reducing manual effort by 60%." },
  { value: "React + Ionic", text: "Delivered campaign scheduling interfaces integrated with backend APIs for responsive web and mobile workflows." },
];

export const toolbelt = [
  { name: "Java", desc: "services", icon: "openjdk", color: "F89820" },
  { name: "Spring Boot", desc: "backend", icon: "springboot", color: "6DB33F" },
  { name: "Kafka", desc: "events", icon: "apachekafka", color: "E7ECEF" },
  { name: "Redis", desc: "cache", icon: "redis", color: "FF4438" },
  { name: "PostgreSQL", desc: "data", icon: "postgresql", color: "4169E1" },
  { name: "MongoDB", desc: "documents", icon: "mongodb", color: "47A248" },
  { name: "Docker", desc: "containers", icon: "docker", color: "2496ED" },
  { name: "Kubernetes", desc: "orchestration", icon: "kubernetes", color: "326CE5" },
  { name: "Jenkins", desc: "CI/CD", icon: "jenkins", color: "D24939" },
  { name: "AWS", desc: "cloud", icon: "amazonwebservices", color: "FF9900" },
  { name: "Prometheus", desc: "metrics", icon: "prometheus", color: "E6522C" },
  { name: "Grafana", desc: "dashboards", icon: "grafana", color: "F46800" },
  { name: "Loki", desc: "logs", icon: "grafana", color: "F2CC0C" },
  { name: "Tempo", desc: "traces", icon: "grafana", color: "73BF69" },
  { name: "React", desc: "interfaces", icon: "react", color: "61DAFB" },
  { name: "Ionic", desc: "mobile UI", icon: "ionic", color: "3880FF" },
  { name: "JUnit", desc: "testing", icon: "junit5", color: "25A162" },
  { name: "Mockito", desc: "testing", icon: null, color: "86B817" },
];

export { featuredArticles } from "../blogArticles";
