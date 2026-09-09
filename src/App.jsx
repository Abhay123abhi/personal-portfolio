import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock3, Download, Github, Linkedin, Mail, Menu, Share2, X, Plus } from "lucide-react";

const EMAIL = "abhayjaiswal983@gmail.com";
const GITHUB = "https://github.com/Abhay123abhi";
const LINKEDIN = "https://www.linkedin.com/in/abhay983";
const TWITTER = "https://x.com/abhayjaissssss";
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
    eyebrow: "Reliability engineering · Event-driven backend",
    title: "Incident Investigation Platform",
    statement: "Turn a production alert into a persistent, evidence-backed incident report.",
    problem: "Incident evidence is scattered across metrics, logs, and traces, while repeated alerts and broker failures can create noise or interrupt investigation.",
    build: "Alertmanager intake persists incident state and an outbox event atomically. Kafka dispatches an evidence worker that queries Prometheus, Loki, and Tempo, stores the report in PostgreSQL, and preserves resolution state.",
    stack: ["Java 25", "Spring Boot", "Kafka", "PostgreSQL", "Prometheus", "Loki", "Tempo", "Grafana"],
    github: "https://github.com/Abhay123abhi/micro-observe-kafka",
    color: "blue",
  },
  {
    id: "02",
    eyebrow: "Full-stack product · Source-grounded AI",
    title: "News Intelligence",
    statement: "Aggregate multiple publishers, then turn the retrieved feed into grounded briefs, answers, and coverage comparisons.",
    problem: "Publishers expose inconsistent schemas and failure behaviour, while readers still need a reliable way to search, compare, and understand the combined feed.",
    build: "Guardian and NYT adapters run concurrently on Java 21 virtual threads, normalize and deduplicate results, and cache repeated searches in Redis. An optional Gemini layer adds daily briefs, feed-grounded Q&A, article summaries, and coverage comparison.",
    stack: ["Java 21", "Spring Boot", "React", "Redis", "Gemini", "Virtual threads", "Render"],
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
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
function SocialLinks({ labelled = false }) {
  return <div className={labelled ? "social-links labelled" : "social-links"} aria-label="Social and email links">
    <a href={`mailto:${EMAIL}`} aria-label="Gmail — email Abhay" title="Email Abhay"><Mail size={20} />{labelled && "Gmail"}</a>
    <a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin size={20} />{labelled && "LinkedIn"}</a>
    <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><Github size={20} />{labelled && "GitHub"}</a>
    <a href={TWITTER} target="_blank" rel="noreferrer" aria-label="X / Twitter" title="X / Twitter"><span aria-hidden="true" className="x-mark">𝕏</span>{labelled && "X / Twitter"}</a>
  </div>;
}
function Header({ inner = false }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  return <header className="header">
    <Link className="brand" to="/" aria-label="Abhay Jaiswal, home"><span className="brand-symbol">a<span>j</span>.</span><b>Abhay Jaiswal</b></Link>
    <nav id="primary-navigation" className={open ? "nav open" : "nav"} aria-label="Primary navigation">
      {inner ? <><Link to="/">Portfolio</Link><Link to="/blog">Journal</Link></> : <><a href="#work" onClick={() => setOpen(false)}>Selected work</a><a href="#experience" onClick={() => setOpen(false)}>Experience</a><Link to="/blog">Journal</Link></>}
    </nav>
    <div className="header-social"><SocialLinks /></div>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="primary-navigation">{open ? <X /> : <Menu />}</button>
  </header>;
}
const projectArchitectures = [
  {
    name: "Incident investigation",
    stages: [
      { title: "Detect", nodes: ["Prometheus", "Alertmanager"], detail: "Detect a firing or resolved service alert and send its fingerprint and status to the incident intake API." },
      { title: "Persist", nodes: ["Incident API", "PostgreSQL", "Outbox"], detail: "Store incident state and the investigation event in one transaction, reusing the active incident when Alertmanager repeats a fingerprint." },
      { title: "Investigate", nodes: ["Kafka", "Evidence worker", "Loki & Tempo"], detail: "Dispatch through Kafka, collect a bounded telemetry snapshot, and save a persistent report that Grafana can display and engineers can verify." },
    ],
    note: "Detect · Persist · Queue · Collect evidence",
  },
  {
    name: "News intelligence",
    stages: [
      { title: "Search", nodes: ["React client", "Search API"], detail: "Accept one query through a consistent API while keeping publisher credentials and provider-specific contracts behind the backend." },
      { title: "Aggregate", nodes: ["Guardian & NYT", "Normalize & dedupe", "Redis cache"], detail: "Run provider adapters concurrently, merge them into one article model, cache repeated searches, and return partial results when one source fails." },
      { title: "Understand", nodes: ["AI brief", "Ask the news", "Compare coverage"], detail: "Use optional Gemini features over only the retrieved articles, with bounded inputs, response caching, request limits, and an independent off switch." },
    ],
    note: "Reliable aggregation · Optional grounded AI",
  },
  {
    name: "Room-based messaging",
    stages: [
      { title: "Connect", nodes: ["React client", "Room membership"], detail: "Let participants join a room and manage conversation state in the React client." },
      { title: "Deliver", nodes: ["Spring Boot", "WebSocket"], detail: "Use a persistent WebSocket connection to deliver messages to room participants without polling for every update." },
      { title: "Persist", nodes: ["MongoDB", "Message history"], detail: "Store conversation history so messages remain available beyond the lifetime of a live connection." },
    ],
    note: "Live delivery · Persistent history",
  },
];

function ProjectMap({ index }) {
  const [selected, setSelected] = useState(0);
  const architecture = projectArchitectures[index];
  return <div className="architecture">
    <div className="architecture-heading"><span>System design</span><span>{architecture.name}</span></div>
    <div className="architecture-stages" role="group" aria-label={architecture.name}>
      {architecture.stages.map((stage, stageIndex) => <button
        key={stage.title}
        type="button"
        className={selected === stageIndex ? "architecture-stage selected" : "architecture-stage"}
        aria-pressed={selected === stageIndex}
        aria-controls={`architecture-detail-${index}`}
        onClick={() => setSelected(stageIndex)}
      >
        <span className="stage-heading"><strong>{stage.title}</strong></span>
        <span className="stage-nodes">{stage.nodes.map(node => <span key={node}>{node}</span>)}</span>
        {stageIndex < architecture.stages.length - 1 && <ArrowRight className="stage-connector" size={17} aria-hidden="true" />}
      </button>)}
    </div>
    <div className="architecture-detail" id={`architecture-detail-${index}`} aria-live="polite" aria-atomic="true"><strong>{architecture.stages[selected].title}</strong><p>{architecture.stages[selected].detail}</p></div>
    <div className="architecture-caption"><span>{architecture.note}</span><span>Conceptual architecture</span></div>
  </div>;
}
function Profile() {
  return <aside className="profile-rail" aria-label="About Abhay">
    <div className="profile-picture"><img src="/profile.png" alt="Abhay Jaiswal" width="1134" height="1134" fetchPriority="high" /></div>
    <div className="profile-identity">
      <h1>Abhay<span className="name-break"><br /></span> Jaiswal<span>.</span></h1>
      <p className="profile-role">Java Backend Engineer</p>
      <p className="profile-summary">I build secure APIs, event-driven services, and the systems that keep products running.</p>
      <a className="resume-button" href={RESUME} target="_blank" rel="noreferrer">View résumé <Download size={19} /></a>
    </div>
  </aside>;
}
function SectionHeading({ label, title, children }) {
  return <header className="section-heading"><div className="section-label">{label}</div><h2>{title}</h2>{children}</header>;
}
function Home() {
  usePageTitle("Abhay Jaiswal — Java Backend Engineer");
  return <><a href="#content" className="skip-link">Skip to content</a><Header /><div className="studio-layout">
    <Profile />
    <main id="content" className="studio-main">
      <section className="introduction" aria-labelledby="intro-title">
        <h2 id="intro-title">Thoughtful systems.<br /><span>Dependable products.</span></h2>
        <p>Four years of taking backend features from requirements to production—across APIs, integrations, performance, and release delivery.</p>
        <div className="impact-row">{impact.map(([value,label]) => <div className="impact-cell" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      </section>
      <section className="work-section" id="work">
        <SectionHeading label="Selected work" title="Behind the interface." ><p>The problems, architecture decisions, and systems I build.</p></SectionHeading>
        <div className="projects">{projects.map((project,index) => <article className="project" key={project.id}>
          <ProjectMap index={index} />
          <div className="project-body"><div className="project-heading"><div><span className="project-category">{project.eyebrow}</span><h3>{project.title}</h3></div><a href={project.github} target="_blank" rel="noreferrer" className="project-source" aria-label={`View ${project.title} source code`}><ArrowUpRight size={23} /></a></div>
          <p className="project-statement">{project.statement}</p>
          <ul className="project-stack">{project.stack.map(item => <li key={item}>{item}</li>)}</ul>
          <details className="project-details"><summary><span>Explore the engineering</span><Plus size={18} /></summary><div className="detail-grid"><div><h4>The problem</h4><p>{project.problem}</p></div><div><h4>The approach</h4><p>{project.build}</p></div></div></details>
          <div className="project-links"><a href={project.github} target="_blank" rel="noreferrer"><Github size={16} /> Source code</a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live product <ArrowUpRight size={16} /></a>}</div>
          </div>
        </article>)}</div>
      </section>
      <section className="experience-section" id="experience">
        <SectionHeading label="Experience" title="Built in production." />
        <article className="career"><div className="career-heading"><span className="company-mark" aria-hidden="true">SL</span><div><h3>Sun Life Global Solutions</h3><p>Software Developer · Analyst</p></div></div>
        <div className="career-date">July 2022 — Present</div>
        <p className="career-lead">Backend delivery for advisor and policy platforms across Asian insurance markets.</p>
        <ul className="career-results">
          <li><strong>4s → 3s</strong><p>Reduced client response time through Spring Boot BFF services, payload optimization, and Okta M2M security.</p></li>
          <li><strong>1,000+ / day</strong><p>Designed Kafka microservices for asynchronous business notifications.</p></li>
          <li><strong>25% faster</strong><p>Automated release delivery with Jenkins, Docker, and Kubernetes.</p></li>
          <li><strong>2,000+ advisors</strong><p>Automated rules and policy workflows, reducing manual effort by 60%.</p></li>
          <li><strong>Frontend Development</strong><p>Developed React and Ionic UI components for a campaign scheduling application, integrating backend APIs to support responsive web and mobile workflows.</p></li>
        </ul>
        <p className="career-footnote">SIT, UAT, and release readiness across the Philippines, Malaysia, and Hong Kong.</p></article>
      </section>
      <section className="craft-section" id="skills"><SectionHeading label="Engineering toolkit" title="The tools behind the work." />
        <div className="skills-list">{skills.map(skill => <article key={skill.group}><h3>{skill.group}</h3><p>{skill.items}</p></article>)}</div>
      </section>
      <section className="journal-bridge"><div><span className="section-label">Engineering journal</span><h2>Decisions worth writing down.</h2><p>Notes on reliability, backend architecture, and distributed systems.</p></div><Link to="/blog" aria-label="Read the engineering journal"><ArrowUpRight size={26} /></Link></section>
      <Contact />
    </main>
  </div></>;
}
function Contact() {
  return <footer className="contact compact-contact" id="contact">
    <p>Let’s connect.</p>
    <a className="contact-email" href={`mailto:${EMAIL}`}>Email me <ArrowUpRight size={18} /></a>
  </footer>;
}
function BlogIndex() {
  usePageTitle("Engineering Journal — Abhay Jaiswal");
  return <main><Header inner /><section className="blog-hero wrap"><p className="eyebrow">Engineering journal · {articles.length} articles</p><h1>Notes from building for the <em>unhappy path.</em></h1><p>Practical writing about backend architecture, distributed systems, reliability, and production trade-offs.</p></section><section className="archive wrap">{articles.map((article) => <Link to={`/blog/${article.slug}`} className="archive-row" key={article.slug}><b>{article.number}</b><div><small>{article.category}</small><h2>{article.title}</h2><p>{article.excerpt}</p></div><span>{article.published}<br />{article.readingTime}</span><ArrowUpRight /></Link>)}</section><Contact /></main>;
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
