import { useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Boxes,
  Braces,
  CheckCircle2,
  Clock3,
  CloudCog,
  Code2,
  Database,
  GitBranch,
  Mail,
  Radio,
  Share2,
  Sparkles,
} from "lucide-react";

const EMAIL = "abhayjaiswal983@gmail.com";
const GITHUB = "https://github.com/Abhay123abhi";

const impact = [
  { value: "4+", label: "Years building production software" },
  { value: "1K+", label: "Business events processed daily" },
  { value: "25%", label: "Faster release cycles" },
  { value: "60%", label: "Less manual operational work" },
];

const capabilities = [
  { icon: Code2, title: "Backend product systems", text: "Spring Boot services, secure REST APIs, BFFs, resilient integrations, and clear domain boundaries." },
  { icon: Radio, title: "Distributed system design", text: "Kafka, caching, idempotency, ordering, retries, dead-letter flows, and consistency trade-offs." },
  { icon: CloudCog, title: "Production reliability", text: "Timeouts, circuit breakers, observability, capacity thinking, CI/CD, and predictable failure recovery." },
];

const projects = [
  {
    number: "01",
    title: "AI Incident Intelligence Platform",
    description: "An evidence-first reliability platform that correlates metrics, logs, traces, deployments, and runbooks—then uses AI to produce a grounded incident narrative and recommended actions.",
    outcome: "Built to reduce the time engineers lose moving between disconnected observability tools during an incident.",
    stack: ["Java 21", "Spring AI", "Kafka", "PostgreSQL", "Prometheus", "Loki", "Tempo"],
    github: "https://github.com/Abhay123abhi/micro-observe-kafka",
    accent: "lime",
  },
  {
    number: "02",
    title: "Multi-source News Intelligence",
    description: "A full-stack aggregator that searches multiple publishers concurrently, normalizes inconsistent provider responses, caches hot queries, and degrades gracefully when a source is unavailable.",
    outcome: "A production-shaped system with provider strategies, Redis caching, health checks, containerization, and an AI-ready enrichment layer.",
    stack: ["Spring Boot", "React", "Redis", "Docker", "REST APIs", "Render"],
    github: "https://github.com/Abhay123abhi/news_aggregator",
    live: "https://abhay123abhi-news-web.onrender.com",
    accent: "orange",
  },
  {
    number: "03",
    title: "Real-time Chat Platform",
    description: "A room-based messaging application with a Spring Boot WebSocket backend, persistent MongoDB history, and a responsive React client supporting emoji, files, and dark mode.",
    outcome: "Demonstrates end-to-end ownership of real-time delivery, room membership, persistence, frontend state, and Docker-based local orchestration.",
    stack: ["Spring Boot", "WebSocket", "MongoDB", "React", "Vite", "Tailwind CSS", "Docker"],
    github: "https://github.com/Abhay123abhi/chat-app",
    accent: "blue",
  },
];

const toolkit = [
  { icon: Braces, label: "Core backend", items: "Java 8–21 · Spring Boot · Spring Security · JPA · Hibernate · REST" },
  { icon: Boxes, label: "System design", items: "Scalability · Caching · Idempotency · Eventual consistency · Retry/DLQ · Outbox" },
  { icon: Database, label: "Data & messaging", items: "PostgreSQL · MySQL · MongoDB · Redis · Kafka · Indexing · Partitioning" },
  { icon: Activity, label: "Reliability & platform", items: "API Gateway · Circuit breaker · Docker · Kubernetes · Jenkins · Grafana · Testing" },
];

const articles = [
  {
    slug: "ai-incident-intelligence",
    category: "AI × Reliability",
    title: "AI incident analysis should start with evidence, not a prompt",
    excerpt: "A practical architecture for turning metrics, logs, traces, and deployment events into a grounded incident narrative.",
    readingTime: "6 min read",
    published: "August 2026",
    lead: "Adding a language model to an observability dashboard does not automatically create incident intelligence. The useful system begins before the prompt: it gathers trustworthy evidence, preserves time and service context, and makes uncertainty visible.",
    quote: "AI should explain collected evidence. It should never be allowed to invent the evidence it wishes existed.",
    sections: [
      ["Start with an investigation contract", "An incident investigation should have a stable input model. I treat the alert as the starting signal, then build an investigation window around it. That window identifies the affected service, environment, deployment version, alert time, and the upstream or downstream services likely to be involved.", "Prometheus provides the metric movement, Loki provides error patterns, Tempo provides the slow or failed request path, and deployment events explain what changed. The model should receive this normalized evidence—not unrestricted access to every telemetry system."],
      ["Correlation is the engineering work", "The most valuable step is connecting observations by time, service, trace identifier, and deployment. A latency alert becomes more informative when the same window contains a new release, a database timeout pattern, and traces showing one downstream call consuming most of the request budget.", "This correlation layer should remain useful even when AI is disabled. Engineers should still see the evidence bundle, source links, and a timeline."],
      ["Design the output for verification", "A good response is structured: incident summary, observed signals, likely contributing factors, confidence, competing hypotheses, and recommended next checks. Every important claim should point back to a metric series, log pattern, trace, deployment, or runbook section.", "If signals disagree, the output should say so. If a telemetry source is unavailable, that absence belongs in the result."],
      ["Build for failure from day one", "Telemetry queries need strict timeouts and bounded result sizes. Investigation events need idempotency because Kafka delivery can repeat. Model calls need budgets, retry limits, and a non-AI fallback.", "The result is not ‘Grafana with AI.’ It is an investigation workflow that reduces tool switching, preserves a reviewable trail, and helps an engineer move from alert to a defensible next action faster."],
    ],
  },
  {
    slug: "event-driven-reliability",
    category: "Distributed Systems",
    title: "The reliability details behind a Kafka consumer",
    excerpt: "Retries are only one piece. Idempotency, offset strategy, poison messages, and observability determine whether the flow survives production.",
    readingTime: "5 min read",
    published: "August 2026",
    lead: "A Kafka consumer can look complete after it deserializes a message and calls a service. In production, that is where the reliability conversation begins. The real design is about what happens when processing succeeds halfway, fails repeatedly, or receives the same event twice.",
    quote: "Exactly once is not a magic switch across every database, API, and side effect. State the boundary where the guarantee actually holds.",
    sections: [
      ["Define the delivery contract first", "Most business consumers should assume at-least-once delivery. That makes duplicates an expected condition rather than an edge case. The consumer needs a stable event identifier and an idempotency boundary around the side effect.", "An idempotency record and the business write should share a transaction where possible. If they cannot, the design must explain which inconsistency is acceptable and how reconciliation will repair it."],
      ["Offsets are part of business correctness", "Committing an offset before the business operation risks message loss. Committing after the operation can repeat work when the consumer crashes between those steps. That is why idempotency is the companion to a safe offset strategy.", "Batch size and processing time also affect group stability. Slow network calls without bounded concurrency may trigger rebalances and create even more duplicate work."],
      ["Separate transient and permanent failure", "A dependency timeout may deserve a short retry with exponential backoff and jitter. A malformed payload will not become valid after ten retries. Treating both the same creates noisy loops and blocks healthy messages.", "Use bounded retries followed by a dead-letter flow containing the original event, failure classification, consumer version, and attempt history."],
      ["Observe the flow, not only the broker", "Consumer lag matters, but it is not sufficient. Track processing latency, success and failure rate, retry count, dead-letter volume, idempotency hits, and dependency latency.", "Kafka transports the event. Explicit decisions around ownership, ordering, retries, recovery, and visibility make the system dependable."],
    ],
  },
  {
    slug: "graceful-provider-fallbacks",
    category: "Backend Design",
    title: "Designing graceful fallback for multi-provider APIs",
    excerpt: "How to keep an aggregator useful when upstream APIs are slow, inconsistent, rate-limited, or temporarily unavailable.",
    readingTime: "5 min read",
    published: "August 2026",
    lead: "An aggregator promises one useful response while depending on several APIs it does not control. Providers will disagree on schemas, pagination, rate limits, and availability. The service should absorb that inconsistency instead of passing it directly to the client.",
    quote: "Graceful degradation is not hiding failure. It is preserving useful work while communicating exactly what became unavailable.",
    sections: [
      ["Normalize at the boundary", "Each provider adapter should translate its external response into one internal article model. Provider-specific fields, authentication, pagination, and error mapping stay inside the adapter.", "This is also the right place to validate URLs, normalize timestamps, clean missing images, and create a stable identifier for deduplication."],
      ["Make partial success a first-class result", "If one provider returns twelve articles and another times out, returning nothing wastes valid data. Query providers concurrently with individual timeouts and return a partial response when at least one succeeds.", "A full service error should be reserved for cases where no configured source can produce a result and no safe cached response exists."],
      ["Cache the normalized response", "Cache keys should include the normalized query, page, filters, and a cache schema version. Caching after normalization makes a stale fallback possible when upstream APIs are temporarily down.", "Empty results need a shorter TTL so a temporary provider issue does not look like a long-lived valid answer."],
      ["Measure providers independently", "Record success rate, timeout rate, rate limits, latency percentiles, returned item count, and cache contribution for each source.", "The goal is to contain provider differences behind stable adapters, keep the response useful under failure, and expose enough signal to understand result quality."],
    ],
  },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Brand() {
  return <Link className="brand" to="/" aria-label="Abhay Jaiswal, home"><span className="brand-mark">AJ</span><span className="brand-name">Abhay Jaiswal</span></Link>;
}

function HomeHeader() {
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <header className="site-header">
      <Brand />
      <nav className="nav-links" aria-label="Primary navigation">
        <button type="button" onClick={() => scroll("work")}>Work</button>
        <button type="button" onClick={() => scroll("experience")}>Experience</button>
        <button type="button" onClick={() => scroll("notes")}>Journal</button>
        <button type="button" onClick={() => scroll("stack")}>Stack</button>
      </nav>
      <a className="header-cta" href={`mailto:${EMAIL}`}>Let&apos;s talk <ArrowUpRight size={16} /></a>
    </header>
  );
}

function InnerHeader() {
  return (
    <header className="site-header">
      <Brand />
      <nav className="nav-links" aria-label="Blog navigation"><Link to="/">Portfolio</Link><Link to="/blog">Engineering journal</Link></nav>
      <a className="header-cta" href={`mailto:${EMAIL}`}>Let&apos;s talk <ArrowUpRight size={16} /></a>
    </header>
  );
}

function Home() {
  useEffect(() => { document.title = "Abhay Jaiswal | Java Backend Engineer"; }, []);
  return (
    <main>
      <HomeHeader />
      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" />Java · Spring Boot · Distributed systems</div>
          <h1>Java Backend Engineer building <em>reliable products</em> at scale.</h1>
          <p className="hero-intro">I design secure APIs, event-driven microservices, and observable platforms. Four years of production experience across backend delivery, performance, and release ownership.</p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>Explore selected work <ArrowDownRight size={18} /></button>
            <a className="button button-ghost" href={GITHUB} target="_blank" rel="noreferrer"><GitBranch size={18} /> GitHub profile</a>
          </div>
          <div className="hero-proof"><span>Backend Engineer II / Senior roles</span><span>Insurance platforms · Philippines · Malaysia · Hong Kong</span></div>
        </div>
        <figure className="portrait-card">
          <div className="portrait-glow" aria-hidden="true" />
          <div className="portrait-frame"><img src="/profile.png" alt="Abhay Jaiswal, Java Backend Engineer" /></div>
          <figcaption><span>Abhay Jaiswal</span><strong>Java backend · System design · Product ownership</strong></figcaption>
        </figure>
      </section>

      <section className="impact-strip" aria-label="Career impact"><div className="section-shell impact-grid">{impact.map((item) => <div className="impact-item" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>

      <section className="section-shell approach-section" aria-labelledby="approach-title">
        <div className="section-label"><span>01</span> Engineering approach</div>
        <div className="approach-heading"><h2 id="approach-title">From business requirement to production signal.</h2><p>I care about the full path: clear contracts, predictable failure modes, measurable performance, and a release path the team can trust.</p></div>
        <div className="capability-grid">{capabilities.map(({ icon: Icon, title, text }, index) => <article className="capability-card" key={title}><div className="capability-top"><Icon size={24} /><span>0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-title"><div className="section-shell">
        <div className="section-label"><span>02</span> Selected systems</div>
        <div className="work-heading"><h2 id="work-title">Projects built around real engineering problems.</h2><p>Architecture, resilience, and system-design choices—not tutorial-only feature lists.</p></div>
        <div className="project-list">{projects.map((project) => <article className={`project-card project-${project.accent}`} key={project.title}>
          <div className="project-index">{project.number}</div><div className="project-main"><h3>{project.title}</h3><p className="project-description">{project.description}</p><div className="project-outcome"><Sparkles size={18} /><span>{project.outcome}</span></div><div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div>
          <div className="project-links"><a href={project.github} target="_blank" rel="noreferrer"><GitBranch size={19} /> Source <ArrowUpRight size={15} /></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer"><Activity size={19} /> Live app <ArrowUpRight size={15} /></a>}</div>
        </article>)}</div>
      </div></section>

      <section className="section-shell experience-section" id="experience" aria-labelledby="experience-title">
        <div className="section-label"><span>03</span> Experience</div><div className="experience-layout">
          <div className="experience-intro"><h2 id="experience-title">Building advisor and policy platforms across Asian insurance markets.</h2><p>Progressed from Associate Software Developer to Software Developer while owning backend delivery, system integration, release readiness, and production outcomes.</p></div>
          <article className="role-card"><div className="role-topline"><div><span className="role-company">Sun Life Global Solutions</span><h3>Software Developer · Analyst</h3></div><span className="role-date">Jul 2022 — Present</span></div>
            <ul><li><CheckCircle2 /> Architected Spring Boot BFF services with Okta M2M security, cutting client response time from 4s to 3s.</li><li><CheckCircle2 /> Designed Kafka-based microservices processing 1,000+ business notifications per day.</li><li><CheckCircle2 /> Automated Jenkins, Docker, and Kubernetes delivery flows, reducing release time by 25%.</li><li><CheckCircle2 /> Helped automate advisor rules and policy workflows for 2,000+ advisors, reducing manual effort by 60%.</li><li><CheckCircle2 /> Supported insurance advisor and policy applications across the Philippines, Malaysia, and Hong Kong markets, coordinating SIT, UAT, release readiness, and stakeholder validation.</li></ul>
          </article>
        </div>
      </section>

      <section className="stack-section" id="stack" aria-labelledby="stack-title"><div className="section-shell">
        <div className="section-label"><span>04</span> Technical toolkit</div><div className="stack-heading"><h2 id="stack-title">Tools chosen for the problem, not the trend.</h2><p>A Java-first stack with enough platform depth to own the path to production.</p></div>
        <div className="toolkit-grid">{toolkit.map(({ icon: Icon, label, items }) => <article className="toolkit-row" key={label}><div className="toolkit-icon"><Icon size={21} /></div><div><h3>{label}</h3><p>{items}</p></div></article>)}</div>
      </div></section>

      <section className="blog-section section-shell" id="notes" aria-labelledby="notes-title">
        <div className="section-label"><span>05</span> Engineering journal</div><div className="blog-heading"><div><h2 id="notes-title">Engineering ideas, made practical.</h2><p>A readable engineering blog where I break down backend architecture, distributed systems, reliability trade-offs, and lessons from building production software.</p></div><Link className="header-cta" to="/blog">Browse all articles <ArrowUpRight size={16} /></Link></div>
        <div className="blog-grid">{articles.map((article, index) => <article className="blog-card" key={article.slug}><div className="blog-card-meta"><span>0{index + 1}</span><span>{article.readingTime}</span></div><div className="blog-icon"><BookOpen size={21} /></div><span className="blog-category">{article.category}</span><h3>{article.title}</h3><p>{article.excerpt}</p><Link className="blog-link" to={`/blog/${article.slug}`} aria-label={`Read ${article.title}`}>Read full article <ArrowUpRight size={15} /></Link></article>)}</div>
      </section>

      <section className="contact-section section-shell" id="contact" aria-labelledby="contact-title"><div className="contact-card">
        <div className="contact-kicker"><span /> OPEN TO PRODUCT ENGINEERING OPPORTUNITIES</div><h2 id="contact-title">Building something where reliability matters?</h2><p>I&apos;m open to Backend Engineer II and senior backend roles where I can own scalable services, system-design decisions, and production outcomes.</p>
        <div className="contact-actions"><a className="button button-primary" href={`mailto:${EMAIL}`}><Mail size={18} /> Start a conversation</a><a className="button button-ghost" href={GITHUB} target="_blank" rel="noreferrer"><GitBranch size={18} /> Follow my work</a></div><a className="text-link contact-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </div></section>

      <footer className="site-footer section-shell"><div><span className="brand-mark">AJ</span><p>Designed around systems, signals, and measurable outcomes.</p></div><div className="footer-links"><a href={GITHUB} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href={`mailto:${EMAIL}`}>Email <ArrowUpRight size={14} /></a><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top</button></div><span className="copyright">© 2026 Abhay Jaiswal</span></footer>
    </main>
  );
}

function BlogIndex() {
  useEffect(() => { document.title = "Engineering Notes | Abhay Jaiswal"; }, []);
  return (
    <main className="blog-index"><InnerHeader />
      <section className="blog-index-hero section-shell"><Link className="article-back" to="/"><ArrowLeft size={16} /> Back to portfolio</Link><div className="section-label"><span>JOURNAL</span> Backend engineering articles</div><h1>Ideas are more useful when they survive contact with production.</h1><p>Readable articles about system design, backend decisions, failure modes, and the trade-offs behind reliable software.</p></section>
      <section className="blog-archive section-shell" aria-label="Published engineering notes">{articles.map((article, index) => <Link className="archive-row" to={`/blog/${article.slug}`} key={article.slug}><span className="archive-number">0{index + 1}</span><div className="archive-main"><span className="blog-category">{article.category}</span><h2>{article.title}</h2><p>{article.excerpt}</p></div><div className="archive-meta"><span>{article.published}</span><span><Clock3 size={14} /> {article.readingTime}</span></div><BookOpen className="archive-icon" size={22} /></Link>)}</section>
    </main>
  );
}

function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);
  useEffect(() => { if (article) document.title = `${article.title} | Abhay Jaiswal`; }, [article]);
  if (!article) return <Navigate to="/blog" replace />;
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
  return (
    <main className="article-page"><InnerHeader /><article className="article-shell">
      <Link className="article-back" to="/blog"><ArrowLeft size={16} /> Engineering journal</Link><div className="article-category">{article.category}</div><h1>{article.title}</h1><p className="article-deck">{article.excerpt}</p><div className="article-meta"><span>{article.published}</span><span><Clock3 size={14} /> {article.readingTime}</span><span>By Abhay Jaiswal</span></div><a className="article-share" href={linkedInShare} target="_blank" rel="noreferrer"><Share2 size={15} /> Share on LinkedIn</a>
      <div className="article-body"><p className="article-lead">{article.lead}</p>{article.sections.map((section, index) => <div key={section[0]}><h2>{section[0]}</h2><p>{section[1]}</p>{index === 1 && <blockquote>{article.quote}</blockquote>}<p>{section[2]}</p></div>)}</div>
    </article><aside className="article-cta section-shell"><div><span>Continue the conversation</span><h2>Have a different approach?</h2><p>I enjoy comparing architecture decisions with engineers solving similar production problems.</p></div><div className="article-cta-links"><a className="button button-primary" href={`mailto:${EMAIL}`}><Mail size={17} /> Email me</a><a className="button button-ghost" href={GITHUB} target="_blank" rel="noreferrer"><GitBranch size={17} /> GitHub</a></div></aside></main>
  );
}

export default function App() {
  return <><ScrollToTop /><Routes><Route path="/" element={<Home />} /><Route path="/blog" element={<BlogIndex />} /><Route path="/blog/:slug" element={<ArticlePage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></>;
}
