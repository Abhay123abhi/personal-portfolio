import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check,
  Clock3, Download, Github, Linkedin, Mail, Menu, Share2, X,
} from "lucide-react";

const EMAIL = "abhayjaiswal983@gmail.com";
const GITHUB = "https://github.com/Abhay123abhi";
const LINKEDIN = "https://www.linkedin.com/in/abhay983";
const RESUME = "/Abhay_Jaiswal_Resume.pdf";

const impact = [
  ["4+", "years shipping production software"],
  ["1K+", "business events processed daily"],
  ["25%", "faster deployment cycles"],
  ["60%", "reduction in manual operations"],
];

const projects = [
  {
    id: "01",
    eyebrow: "Reliability engineering · AI",
    title: "Incident Intelligence",
    statement: "Turn fragmented production signals into an evidence-backed incident narrative.",
    problem: "During an incident, engineers lose time moving between metrics, logs, traces, deployments, and runbooks.",
    build: "An event-driven investigation workflow that correlates telemetry first, then uses AI to explain evidence and recommend verifiable next actions.",
    stack: ["Java 21", "Spring AI", "Kafka", "PostgreSQL", "Prometheus", "Loki", "Tempo"],
    github: "https://github.com/Abhay123abhi/micro-observe-kafka",
    color: "blue",
  },
  {
    id: "02",
    eyebrow: "Distributed backend · Full stack",
    title: "News Intelligence",
    statement: "Keep search useful even when upstream publishers are slow or unavailable.",
    problem: "News providers expose inconsistent schemas, pagination, rate limits, and failure behaviour.",
    build: "Concurrent provider strategies, a normalized domain model, Redis-backed hot-query caching, partial-success responses, and health-aware degradation.",
    stack: ["Spring Boot", "React", "Redis", "Docker", "REST", "Render"],
    github: "https://github.com/Abhay123abhi/news_aggregator",
    live: "https://abhay123abhi-news-web.onrender.com",
    color: "coral",
  },
  {
    id: "03",
    eyebrow: "Real-time systems · Product build",
    title: "Real-time Chat",
    statement: "A responsive messaging experience backed by persistent room history.",
    problem: "Real-time delivery, room membership, message history, and client state need to remain consistent across reconnects.",
    build: "A WebSocket-based messaging flow with persistent MongoDB history and a responsive React client for rooms, emoji, files, and dark mode.",
    stack: ["Spring Boot", "WebSocket", "MongoDB", "React", "Vite", "Docker"],
    github: "https://github.com/Abhay123abhi/chat-app",
    color: "yellow",
  },
];

const skills = [
  { group: "Backend", items: "Java 8–21, Spring Boot, Spring Security, JPA, Hibernate, REST APIs, BFF" },
  { group: "Distributed systems", items: "Kafka, Redis, idempotency, outbox, retry/DLQ, eventual consistency" },
  { group: "Data", items: "PostgreSQL, MySQL, MongoDB, indexing, query optimization, partitioning" },
  { group: "Delivery & reliability", items: "Docker, Kubernetes, Jenkins, Prometheus, Grafana, Loki, JUnit, Mockito" },
];

const systemLayers = [
  { id: "01", label: "Entry", title: "Secure edge", nodes: ["REST contract", "OAuth2 / Okta", "BFF / Gateway"] },
  { id: "02", label: "Core", title: "Domain services", nodes: ["Business rules", "Idempotency", "PostgreSQL"] },
  { id: "03", label: "Events", title: "Async backbone", nodes: ["Outbox", "Kafka topics", "Retry / DLQ"] },
  { id: "04", label: "Signals", title: "Production truth", nodes: ["Metrics", "Logs + traces", "Alerts"] },
];

const articles = [
  {
    slug: "ai-incident-intelligence",
    number: "01",
    category: "AI × Reliability",
    title: "AI incident analysis should start with evidence, not a prompt",
    excerpt: "A practical architecture for turning metrics, logs, traces, and deployment events into a grounded incident narrative.",
    readingTime: "6 min read",
    published: "August 2026",
    lead: "Adding a language model to an observability dashboard does not automatically create incident intelligence. The useful system begins before the prompt: it gathers trustworthy evidence, preserves time and service context, and makes uncertainty visible.",
    quote: "AI should explain collected evidence. It should never be allowed to invent the evidence it wishes existed.",
    sections: [
      ["Start with an investigation contract", "An investigation needs a stable input model. I treat the alert as the starting signal, then build a time window identifying the affected service, environment, deployment version, and related dependencies.", "Prometheus provides metric movement, Loki provides error patterns, Tempo provides failed request paths, and deployment events explain what changed. The model receives this normalized evidence—not unrestricted access to every system."],
      ["Correlation is the engineering work", "The valuable step is connecting observations by time, service, trace identifier, and deployment. A latency alert becomes useful when the same window contains a release, a database timeout pattern, and traces showing one downstream call consuming most of the request budget.", "The correlation layer remains useful when AI is disabled. Engineers still see the evidence bundle, source links, and timeline."],
      ["Design output for verification", "A useful response is structured: summary, observed signals, contributing factors, confidence, competing hypotheses, and recommended checks. Every important claim points back to a metric, log pattern, trace, deployment, or runbook.", "If signals disagree or a source is unavailable, that uncertainty belongs in the result."],
    ],
  },
  {
    slug: "event-driven-reliability",
    number: "02",
    category: "Distributed Systems",
    title: "The reliability details behind a Kafka consumer",
    excerpt: "Retries are only one piece. Idempotency, offsets, poison messages, and observability decide whether a flow survives production.",
    readingTime: "5 min read",
    published: "August 2026",
    lead: "A Kafka consumer can look complete after it deserializes a message and calls a service. In production, that is where the reliability conversation begins.",
    quote: "Exactly once is not a magic switch across every database, API, and side effect. State where the guarantee actually holds.",
    sections: [
      ["Define the delivery contract", "Most business consumers should assume at-least-once delivery. Duplicates are expected, so the consumer needs a stable event identifier and an idempotency boundary around each side effect.", "An idempotency record and business write should share a transaction where possible. Otherwise, document the accepted inconsistency and reconciliation path."],
      ["Offsets are business correctness", "Committing early risks message loss. Committing after the operation can repeat work when a consumer crashes between those steps. Idempotency is the companion to a safe offset strategy.", "Batch size and processing time also affect group stability; unbounded network calls can trigger rebalances and more duplicate work."],
      ["Classify and observe failure", "A timeout may deserve bounded retry with backoff. A malformed payload will not improve after ten attempts. Separate transient failure from poison messages and preserve attempt context in the dead-letter flow.", "Track processing latency, retries, dead-letter volume, idempotency hits, dependency latency, and lag. Kafka transports the event; these decisions make it dependable."],
    ],
  },
  {
    slug: "graceful-provider-fallbacks",
    number: "03",
    category: "Backend Design",
    title: "Designing graceful fallback for multi-provider APIs",
    excerpt: "How to keep an aggregator useful when upstream APIs are inconsistent, rate-limited, or temporarily unavailable.",
    readingTime: "5 min read",
    published: "August 2026",
    lead: "An aggregator promises one useful response while depending on APIs it does not control. It should absorb provider inconsistency instead of passing it directly to the client.",
    quote: "Graceful degradation is not hiding failure. It preserves useful work while communicating what became unavailable.",
    sections: [
      ["Normalize at the boundary", "Each provider adapter translates its response into one internal model. Authentication, pagination, provider fields, and error mapping stay inside the adapter.", "This is also where URLs, timestamps, missing images, and deduplication identifiers become stable."],
      ["Make partial success first-class", "If one provider returns twelve articles and another times out, returning nothing wastes valid data. Query providers concurrently with individual timeouts and return partial data when at least one succeeds.", "Use a full service error only when no configured source or safe cache can produce a result."],
      ["Cache and measure intentionally", "Cache keys include normalized query, pagination, filters, and schema version. Empty results use a shorter TTL so temporary provider failure does not become a long-lived answer.", "Measure each provider's latency, success rate, timeouts, rate limits, item count, and cache contribution."],
    ],
  },
];

function usePageTitle(title) {
  useEffect(() => { document.title = title; }, [title]);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Brand() {
  return <Link to="/" className="brand" aria-label="Abhay Jaiswal, home"><span>AJ</span><b>Abhay Jaiswal</b></Link>;
}

function Header({ inner = false }) {
  const [open, setOpen] = useState(false);
  const go = (id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <header className="header">
      <Brand />
      <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav className={open ? "nav open" : "nav"} aria-label="Primary navigation">
        {inner ? <><Link to="/">Portfolio</Link><Link to="/blog">Journal</Link></> : <><button onClick={() => go("work")}>Work</button><button onClick={() => go("experience")}>Experience</button><button onClick={() => go("skills")}>Skills</button><Link to="/blog">Journal</Link></>}
      </nav>
      <a className="header-contact" href={`mailto:${EMAIL}`}>Let’s talk <ArrowUpRight size={16} /></a>
    </header>
  );
}

function SectionIntro({ index, label, title, copy }) {
  return <div className="section-intro"><div className="section-kicker"><span>{index}</span>{label}</div><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function Home() {
  usePageTitle("Abhay Jaiswal — Java Backend Engineer");
  return (
    <main>
      <Header />
      <section className="hero wrap">
        <div className="hero-status"><i /> Available for SDE-2 / Backend opportunities</div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Java Backend Engineer · Gurugram, India</p>
            <h1>I build backend systems that stay <em>fast, clear,</em> and <em>reliable.</em></h1>
            <p className="hero-summary">Four years of product engineering across secure APIs, event-driven microservices, system integrations, and production delivery.</p>
            <div className="hero-actions">
              <button className="primary-action" type="button" onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>See selected work <ArrowDown size={18} /></button>
              <a className="text-action" href={RESUME} target="_blank" rel="noreferrer"><Download size={17} /> Download résumé</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="portrait-block"><img src="/profile.png" alt="Abhay Jaiswal" /></div>
            <div className="portrait-caption"><span>Backend first.</span><span>Production minded.</span></div>
          </div>
        </div>
        <div className="impact-row">{impact.map(([value, label]) => <div className="impact-cell" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      </section>

      <section className="work section-pad" id="work">
        <div className="wrap"><SectionIntro index="01" label="Selected work" title="Systems designed around real failure modes." copy="Each project starts with the engineering problem—not a list of technologies." />
          <div className="case-list">{projects.map((project) => <article className={`case-study ${project.color}`} key={project.title}>
            <div className="case-number">{project.id}</div>
            <div className="case-title"><span>{project.eyebrow}</span><h3>{project.title}</h3><p>{project.statement}</p></div>
            <div className="case-details"><div><b>Problem</b><p>{project.problem}</p></div><div><b>What I built</b><p>{project.build}</p></div><ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div className="case-links"><a href={project.github} target="_blank" rel="noreferrer"><Github size={18} /> Source code <ArrowUpRight size={15} /></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live product <ArrowUpRight size={15} /></a>}</div>
          </article>)}</div>
        </div>
      </section>

      <section className="experience section-pad wrap" id="experience">
        <SectionIntro index="02" label="Experience" title="Ownership from API contract to production release." />
        <div className="experience-grid">
          <div className="role-meta"><span>2022 — Present</span><h3>Software Developer<br />Analyst</h3><a href="https://www.sunlife.com/slgs/en/" target="_blank" rel="noreferrer">Sun Life Global Solutions <ArrowUpRight size={15} /></a><p>Gurugram · Insurance technology</p></div>
          <div className="role-story">
            <p className="role-lead">Building advisor and policy platforms used across Asian insurance markets.</p>
            <ul>
              <li><Check /> Architected Spring Boot BFF services with Okta M2M security, reducing client response time from 4s to 3s.</li>
              <li><Check /> Designed Kafka microservices processing 1,000+ business notifications every day.</li>
              <li><Check /> Automated Jenkins, Docker, and Kubernetes delivery, cutting release time by 25%.</li>
              <li><Check /> Automated advisor rules and policy workflows for 2,000+ advisors, reducing manual effort by 60%.</li>
              <li><Check /> Coordinated SIT, UAT, release readiness, and stakeholder validation across the Philippines, Malaysia, and Hong Kong.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="blueprint section-pad" id="blueprint"><div className="wrap">
        <SectionIntro index="03" label="System thinking" title="I design the happy path—and everything around it." copy="A strong backend is more than endpoints. It has explicit trust boundaries, data ownership, failure handling, and production signals." />
        <div className="blueprint-board">
          <div className="blueprint-head"><span>REFERENCE / PRODUCTION SERVICE</span><span>REQUEST → STATE → EVENT → SIGNAL</span></div>
          <div className="system-flow">{systemLayers.map((layer, index) => <article className="system-layer" key={layer.id}>
            <div className="layer-title"><span>{layer.id} / {layer.label}</span><h3>{layer.title}</h3></div>
            <div className="layer-nodes">{layer.nodes.map((node) => <div className="system-node" key={node}><i />{node}</div>)}</div>
            {index < systemLayers.length - 1 && <div className="flow-arrow" aria-hidden="true"><span>flow</span><ArrowRight size={18} /></div>}
          </article>)}</div>
          <div className="blueprint-foot"><span><i className="legend solid" /> synchronous boundary</span><span><i className="legend dotted" /> asynchronous hand-off</span><strong>Designed for retries, replay, and partial failure.</strong></div>
        </div>
      </div></section>

      <section className="skills section-pad" id="skills"><div className="wrap">
        <SectionIntro index="04" label="Technical toolkit" title="Java-first. Distributed by design. Ready for production." />
        <div className="skills-list">{skills.map((skill, index) => <article key={skill.group}><span>0{index + 1}</span><h3>{skill.group}</h3><p>{skill.items}</p></article>)}</div>
      </div></section>

      <Contact />
    </main>
  );
}

function Contact() {
  return <footer className="contact"><div className="wrap contact-grid"><div><span className="footer-label">Have a backend problem worth solving?</span><h2>Let’s build something dependable.</h2></div><div className="contact-links"><a href={`mailto:${EMAIL}`}><Mail /> {EMAIL}</a><a href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin /> LinkedIn <ArrowUpRight size={15} /></a><a href={GITHUB} target="_blank" rel="noreferrer"><Github /> GitHub <ArrowUpRight size={15} /></a></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Abhay Jaiswal</span><span>Designed for clarity. Engineered for speed.</span></div></footer>;
}

function BlogIndex() {
  usePageTitle("Engineering Journal — Abhay Jaiswal");
  return <main><Header inner /><section className="blog-hero wrap"><Link className="back" to="/"><ArrowLeft size={16} /> Portfolio</Link><p className="eyebrow">Engineering journal · {articles.length} articles</p><h1>Notes from building for the <em>unhappy path.</em></h1><p>Practical writing about backend architecture, distributed systems, reliability, and production trade-offs.</p></section><section className="archive wrap">{articles.map((article) => <Link to={`/blog/${article.slug}`} className="archive-row" key={article.slug}><b>{article.number}</b><div><small>{article.category}</small><h2>{article.title}</h2><p>{article.excerpt}</p></div><span>{article.published}<br />{article.readingTime}</span><ArrowUpRight /></Link>)}</section><Contact /></main>;
}

function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);
  usePageTitle(article ? `${article.title} — Abhay Jaiswal` : "Engineering Journal");
  if (!article) return <Navigate to="/blog" replace />;
  const share = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
  return <main><Header inner /><article className="article wrap"><Link className="back" to="/blog"><ArrowLeft size={16} /> Journal</Link><header><span>{article.category}</span><h1>{article.title}</h1><p>{article.excerpt}</p><div className="article-meta"><span>{article.published}</span><span><Clock3 size={15} /> {article.readingTime}</span><span>Abhay Jaiswal</span></div><a className="share" href={share} target="_blank" rel="noreferrer"><Share2 size={16} /> Share</a></header><div className="article-body"><p className="lead">{article.lead}</p>{article.sections.map((section, index) => <section key={section[0]}><h2>{section[0]}</h2><p>{section[1]}</p>{index === 1 && <blockquote>{article.quote}</blockquote>}<p>{section[2]}</p></section>)}</div></article><Contact /></main>;
}

export default function App() {
  return <><ScrollToTop /><Routes><Route path="/" element={<Home />} /><Route path="/blog" element={<BlogIndex />} /><Route path="/blog/:slug" element={<ArticlePage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></>;
}
