import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock3, Download, Github, Linkedin, Mail, Menu, Share2, X, Plus, Server, Network, Database, Activity } from "lucide-react";

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
    "category": "System design · Project notes",
    "excerpt": "Why my incident workflow uses a transactional outbox, where duplicates remain, and what I would test before scaling it.",
    "lead": "A box labelled Kafka makes an architecture diagram look asynchronous. It does not answer a more awkward question: what happens if the incident is saved but its investigation event is never published? In Micro Observe Kafka, that boundary is the reason for the outbox. This is a walkthrough of a local project, not a claim that I have operated it at large scale.",
    "number": "01",
    "published": "September 2026",
    "quote": "Persisting the intent to send is different from proving that the work happened.",
    "readingTime": "3 min read",
    "sections": [
      [
        "Start with the invariant",
        "My requirement is that an accepted incident must retain a durable path to investigation. Saving a row and then publishing directly leaves a crash window between those operations. Publishing first has the opposite problem: the worker could receive an event for a transaction that later rolls back.",
        "The project stores the incident and its outbox event in one PostgreSQL transaction. A separate publisher attempts delivery to Kafka. The request no longer has to complete both a database write and a broker operation synchronously."
      ],
      [
        "Follow the ambiguous acknowledgement",
        "Consider a publisher that sends an event, receives confirmation, and crashes before recording publication. On restart, the row is still pending. Sending it again is safer than silently abandoning it, but the consumer can now see a duplicate.",
        "That is why I describe the boundary as at-least-once, not exactly-once. The outbox fixes the lost-intent window; it does not make every downstream effect unique. A stable event identifier and an explicit consumer deduplication boundary are separate design concerns."
      ],
      [
        "An alert fingerprint is not an event ID",
        "Repeated firing webhooks can refer to the same active incident. The project reuses that active incident by fingerprint. A later occurrence after recovery is a different lifecycle, even if the alert labels look identical.",
        "For a future inbox design, I would distinguish the incident ID, alert fingerprint, and delivery event ID. Deduplicating every message by fingerprint forever would risk suppressing legitimate investigations after a new failure."
      ],
      [
        "Recovery can win the race",
        "Suppose a worker begins collecting evidence and the service recovers before the collection finishes. The resolved webhook should close the incident. A late worker result must not reopen it merely because it started from older state.",
        "The project preserves resolution when late results arrive. I would test this with controlled interleaving rather than sleep-based timing: pause collection, apply recovery, release collection, and assert that the final state stays resolved while the evidence remains available."
      ],
      [
        "What I would require before adding replicas",
        "The current project is a local, single-instance demo. Multiple publishers introduce row-claiming, lease recovery, and ordering questions; these are follow-up work, not capabilities I assume from having Kafka in the stack.",
        "My next checks would cover a broker outage followed by recovery, publication followed by a crash, repeated alerts, and a failed telemetry source. I would watch the age of the oldest pending outbox row, not only its count. A small backlog that never moves is still a reliability failure."
      ]
    ],
    "slug": "transactional-outbox-incident-investigation",
    "sources": [
      [
        "Project implementation and scope",
        "https://github.com/Abhay123abhi/micro-observe-kafka"
      ],
      [
        "Transactional outbox pattern — Chris Richardson",
        "https://microservices.io/patterns/data/transactional-outbox.html"
      ]
    ],
    "title": "The database committed. What if Kafka never got the event?"
  },
  {
    "category": "Low-level design · Java",
    "excerpt": "The boundaries behind News Intelligence: adapters, orchestration, deadlines, partial success, and an optional AI layer.",
    "lead": "In my news aggregator, Guardian and NYT sit behind one search API. Calling that Strategy is correct, but incomplete. The more useful design discussion is about who owns normalization, what a timeout means, and how much useful work survives a dependency failure.",
    "number": "02",
    "published": "September 2026",
    "quote": "An interface hides a vendor. A good contract also explains failure.",
    "readingTime": "3 min read",
    "sections": [
      [
        "Give each abstraction one reason to change",
        "NewsProviderClient is the provider strategy: the aggregator depends on a shared search contract. GuardianClient and NytClient also act as adapters, translating vendor payloads into the common article model. Strategy and Adapter describe different responsibilities even when one class participates in both.",
        "I keep HTTP authentication and vendor field mapping at the integration boundary. Merge, deduplication, sorting, and response assembly belong to the aggregator. This avoids moving the original provider-specific conditional into a supposedly generic service."
      ],
      [
        "Concurrency needs a deadline",
        "The project uses CompletableFuture with Java 21 virtual threads for provider calls. The benefit is overlapping I/O waits, not making a remote publisher respond faster. In an illustrative case, two independent calls taking 300 ms and 700 ms take roughly 700 ms plus overhead when started together, rather than roughly one second sequentially. These numbers are examples, not a project benchmark.",
        "For a tighter latency target, I would allocate one end-to-end deadline and pass the remaining budget to dependencies. Waiting separately for a full timeout per future can exceed the request budget. Timing out a future also does not by itself guarantee that the underlying HTTP operation stopped."
      ],
      [
        "Cheap threads do not mean unlimited upstream capacity",
        "Virtual threads make blocking I/O easier to scale within the JVM. They do not increase an API quota, a connection pool, or available memory. I would bound calls per provider rather than use the number of available threads as admission control.",
        "For example, a per-provider semaphore could limit concurrent calls while a separate rate limiter protects requests per minute. Those are different constraints. Saturated admission should have a bounded wait or a clear rejection path; an unlimited queue merely hides overload."
      ],
      [
        "Separate empty results from dependency failure",
        "A successful search with no matching articles is not the same as both providers being unavailable. One successful provider can still produce a useful partial response. If every usable provider fails and there is no acceptable cached answer, a service-unavailable response is more honest than an empty success.",
        "For contract tests, I would cover one provider timing out, both failing, a valid empty search, malformed vendor fields, and duplicate URLs across sources. I would also document that merging independently paginated sources is not equivalent to globally paginating a complete news corpus."
      ],
      [
        "Keep intelligence outside retrieval",
        "Gemini is an optional layer over retrieved articles in this project. News search does not depend on an AI answer. Redis failure can fall back to provider calls; an AI outage should not remove the normal feed.",
        "The extension point matters more than the pattern count. A new publisher should implement the news contract. A new model provider should implement the AI contract. Neither change should require teaching the controller about vendor-specific response formats."
      ]
    ],
    "slug": "provider-design-strategy-adapter-concurrency",
    "sources": [
      [
        "News Intelligence design and implementation",
        "https://github.com/Abhay123abhi/news_aggregator"
      ],
      [
        "Java 21 virtual threads — Oracle",
        "https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html"
      ]
    ],
    "title": "Strategy is the easy part: designing a reliable multi-provider API"
  },
  {
    "category": "System design · LLD design exercise",
    "excerpt": "A worked design exercise covering database invariants, expiring holds, idempotent requests, and late payment callbacks.",
    "lead": "Booking systems are a useful way to connect high-level architecture with low-level design. A class diagram can describe a Seat and a Booking, but it cannot stop two requests from confirming the same seat. This is a design exercise: the numbers and decisions below are illustrative, not results from a deployed booking service.",
    "number": "03",
    "published": "September 2026",
    "quote": "The state machine explains what is legal. The database must enforce who wins.",
    "readingTime": "4 min read",
    "sections": [
      [
        "Define the invariant before picking a lock",
        "I would model inventory by show ID and seat ID: seat A1 can be booked for different shows. The invariant is one current owner of a seat for a particular show. A single row per show-seat, identified by a primary key, gives all contenders one place to coordinate.",
        "For a small implementation, I would use a conditional database update or a row lock inside a short transaction. The transition from available to held succeeds only if the prior state still permits it. Checking availability first and writing later without an atomic condition creates a race."
      ],
      [
        "Make expiry part of the write condition",
        "Assume an illustrative five-minute hold. I would store the owner token and expiration alongside the state. Acquisition can take an available seat or reclaim an expired hold, using database time consistently. Only the request that wins the atomic update owns the new hold.",
        "A cleanup job is useful housekeeping, but correctness should not depend on it running at the exact expiration second. Confirmation must validate the hold token and expiry in the same protected transition. A stale client must not confirm a seat already reassigned to someone else."
      ],
      [
        "Use a state machine without overbuilding it",
        "The domain transitions might be available to held, held to confirmed, and held to available on expiry or cancellation. I would start with an enum and explicit transition methods. The State pattern becomes useful if each state gains enough distinct behaviour to justify separate classes.",
        "A pricing Strategy can remain independent of inventory allocation, and payment integration can sit behind an adapter. I would not add Factory, Observer, and State classes merely to make the diagram look sophisticated. The important tests are illegal transitions and competing requests."
      ],
      [
        "A payment callback can arrive too late",
        "The inventory transaction should not remain open while a payment provider responds. I would persist the payment attempt separately and reconcile its result with the booking state. Successful payment alone does not authorize confirming a hold that expired and was reassigned.",
        "My chosen policy would be to reject confirmation for a lost hold and initiate a compensating refund or manual reconciliation. That creates an operational responsibility: persist compensation intent, retry it safely, and alert if it remains unresolved. Calling this a saga does not implement those responsibilities."
      ],
      [
        "Retries need a durable request identity",
        "For a retryable booking endpoint, I would scope an idempotency key to the authenticated customer and operation, persist a request hash, and protect the key with a unique constraint. The same key with different seat selections should be rejected instead of returning an unrelated prior response.",
        "Idempotency must cover concurrent retries, not only a later cache hit. The key record and inventory transition should share a transaction when possible. Payment callbacks need their own deduplication identity; a booking request key cannot stand in for every event in the lifecycle."
      ],
      [
        "Prove the invariant under contention",
        "I would send concurrent hold requests for the same show-seat and assert that exactly one obtains the current hold. Then I would test expiry against confirmation, duplicate callbacks, and a callback arriving after reassignment. For multiple seats, I would lock in a consistent order and make allocation all-or-nothing to avoid partial bookings and reduce deadlock risk.",
        "I would begin with PostgreSQL as the correctness boundary. A Redis lease could reduce contention, but a lease expiring while its owner is still running must not permit a stale write. The database condition still needs to reject that write. More infrastructure is not a substitute for an enforceable invariant."
      ]
    ],
    "slug": "booking-concurrency-state-machine",
    "sources": [
      [
        "Redis locking guarantees and expiry considerations",
        "https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/"
      ]
    ],
    "title": "Two users, one seat: where a booking design becomes a concurrency problem"
  },
  {
    "slug": "event-driven-reliability",
    "number": "04",
    "category": "Distributed Systems",
    "title": "The reliability details behind a Kafka consumer",
    "excerpt": "Retries are only one piece. Idempotency, offsets, poison messages, and observability decide whether a flow survives production.",
    "readingTime": "5 min read",
    "published": "August 2026",
    "lead": "A Kafka consumer can look complete after it deserializes a message and calls a service. In production, that is where the reliability conversation begins.",
    "quote": "Exactly once is not a magic switch across every database, API, and side effect. State where the guarantee actually holds.",
    "sections": [
      [
        "Define the delivery contract",
        "Most business consumers should assume at-least-once delivery. Duplicates are expected, so the consumer needs a stable event identifier and an idempotency boundary around each side effect.",
        "An idempotency record and business write should share a transaction where possible. Otherwise, document the accepted inconsistency and reconciliation path."
      ],
      [
        "Offsets are business correctness",
        "Committing early risks message loss. Committing after the operation can repeat work when a consumer crashes between those steps. Idempotency is the companion to a safe offset strategy.",
        "Batch size and processing time also affect group stability; unbounded network calls can trigger rebalances and more duplicate work."
      ],
      [
        "Classify and observe failure",
        "A timeout may deserve bounded retry with backoff. A malformed payload will not improve after ten attempts. Separate transient failure from poison messages and preserve attempt context in the dead-letter flow.",
        "Track processing latency, retries, dead-letter volume, idempotency hits, dependency latency, and lag. Kafka transports the event; these decisions make it dependable."
      ]
    ]
  },
  {
    "slug": "graceful-provider-fallbacks",
    "number": "05",
    "category": "Backend Design",
    "title": "Designing graceful fallback for multi-provider APIs",
    "excerpt": "How to keep an aggregator useful when upstream APIs are inconsistent, rate-limited, or temporarily unavailable.",
    "readingTime": "5 min read",
    "published": "August 2026",
    "lead": "An aggregator promises one useful response while depending on APIs it does not control. It should absorb provider inconsistency instead of passing it directly to the client.",
    "quote": "Graceful degradation is not hiding failure. It preserves useful work while communicating what became unavailable.",
    "sections": [
      [
        "Normalize at the boundary",
        "Each provider adapter translates its response into one internal model. Authentication, pagination, provider fields, and error mapping stay inside the adapter.",
        "This is also where URLs, timestamps, missing images, and deduplication identifiers become stable."
      ],
      [
        "Make partial success first-class",
        "If one provider returns twelve articles and another times out, returning nothing wastes valid data. Query providers concurrently with individual timeouts and return partial data when at least one succeeds.",
        "Use a full service error only when no configured source or safe cache can produce a result."
      ],
      [
        "Cache and measure intentionally",
        "Cache keys include normalized query, pagination, filters, and schema version. Empty results use a shorter TTL so temporary provider failure does not become a long-lived answer.",
        "Measure each provider's latency, success rate, timeouts, rate limits, item count, and cache contribution."
      ]
    ]
  }
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
      {inner ? <><Link to="/">Portfolio</Link><Link to="/blog">Blog</Link></> : <><a href="#work" onClick={() => setOpen(false)}>Selected work</a><a href="#experience" onClick={() => setOpen(false)}>Experience</a><a href="#skills" onClick={() => setOpen(false)}>Stack</a><Link to="/blog">Blog</Link></>}
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
        <h2 id="intro-title">Backend first.<br /><span>Production minded.</span></h2>
        <p>I turn complex business requirements into reliable Java services—with secure APIs, event-driven workflows, and measurable improvements in performance and delivery.</p>
        <div className="impact-row" role="region" aria-label="Career impact — scroll horizontally to view all metrics" tabIndex={0}>{impact.map(([value,label]) => <div className="impact-cell" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
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
        <div className="toolkit-grid">{skills.map((skill, index) => {
          const Icon = [Server, Network, Database, Activity][index];
          const descriptions = ["Secure services & API contracts", "Async workflows & reliable delivery", "Persistence & query performance", "Release automation & observability"];
          return <article className={`toolkit-card toolkit-card-${index}`} key={skill.group} aria-labelledby={`toolkit-title-${index}`}>
            <header className="toolkit-card-heading"><span className="toolkit-icon" aria-hidden="true"><Icon size={24} strokeWidth={1.6} /></span><div><h3 id={`toolkit-title-${index}`}>{skill.group}</h3><p>{descriptions[index]}</p></div></header>
            <ul className="toolkit-tags" aria-label={skill.group + " skills"}>{skill.items.split(", ").map((item, itemIndex) => <li className={itemIndex < 2 ? "toolkit-primary" : ""} key={item}>{item}</li>)}</ul>
          </article>;
        })}</div>
      </section>
      
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
  return <main><Header inner /><section className="blog-hero wrap"><p className="eyebrow">Engineering journal · {articles.length} articles</p><h1>System design beyond <em>the diagram.</em></h1><p>Project notes and design exercises on Java, distributed systems, and low-level design—focused on trade-offs, failure cases, and how I would test them.</p></section><section className="archive wrap">{articles.map((article) => <Link to={`/blog/${article.slug}`} className="archive-row" key={article.slug}><b>{article.number}</b><div><small>{article.category}</small><h2>{article.title}</h2><p>{article.excerpt}</p></div><span>{article.published}<br />{article.readingTime}</span><ArrowUpRight /></Link>)}</section><Contact /></main>;
}

function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === (slug === "ai-incident-intelligence" ? "transactional-outbox-incident-investigation" : slug));
  usePageTitle(article ? `${article.title} — Abhay Jaiswal` : "Engineering Journal");
  if (!article) return <Navigate to="/blog" replace />;
  const share = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
  return <main><Header inner /><article className="article wrap"><Link className="back" to="/blog"><ArrowLeft size={16} /> Journal</Link><header><span>{article.category}</span><h1>{article.title}</h1><p>{article.excerpt}</p><div className="article-meta"><span>{article.published}</span><span><Clock3 size={15} /> {article.readingTime}</span><span>Abhay Jaiswal</span></div><a className="share" href={share} target="_blank" rel="noreferrer"><Share2 size={16} /> Share</a></header><div className="article-body"><p className="lead">{article.lead}</p>{article.sections.map((section, index) => <section key={section[0]}><h2>{section[0]}</h2><p>{section[1]}</p>{index === 1 && <blockquote>{article.quote}</blockquote>}<p>{section[2]}</p></section>)}{article.sources && <section><h2>References &amp; project context</h2><ul>{article.sources.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ul></section>}</div></article><Contact /></main>;
}

export default function App() {
  return <><ScrollToTop /><Routes><Route path="/" element={<Home />} /><Route path="/blog" element={<BlogIndex />} /><Route path="/blog/:slug" element={<ArticlePage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></>;
}
