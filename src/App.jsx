import HomeV2 from "./v2/HomeV2";
import PortfolioMotion from "./PortfolioMotion";
import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Clock3, Github, Linkedin, Mail, Menu, Share2, X } from "lucide-react";

const EMAIL = "abhayjaiswal983@gmail.com";
const GITHUB = "https://github.com/Abhay123abhi";
const LINKEDIN = "https://www.linkedin.com/in/abhay983";
const TWITTER = "https://x.com/abhayjaissssss";

const articles = [
  {
    category: "System design · Project notes",
    excerpt: "Why my incident workflow uses a transactional outbox, where duplicates remain, and what I would test before scaling it.",
    lead: "A box labelled Kafka makes an architecture diagram look asynchronous. It does not answer a more awkward question: what happens if the incident is saved but its investigation event is never published? In Micro Observe Kafka, that boundary is the reason for the outbox. This is a walkthrough of a local project, not a claim that I have operated it at large scale.",
    number: "01",
    published: "September 2026",
    quote: "Persisting the intent to send is different from proving that the work happened.",
    readingTime: "3 min read",
    sections: [
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
    slug: "transactional-outbox-incident-investigation",
    sources: [
      ["Project implementation and scope", "https://github.com/Abhay123abhi/event-driven-incident-observability"],
      ["Transactional outbox pattern — Chris Richardson", "https://microservices.io/patterns/data/transactional-outbox.html"],
    ],
    title: "The database committed. What if Kafka never got the event?"
  },
  {
    category: "Low-level design · Java",
    excerpt: "The boundaries behind News Intelligence: adapters, orchestration, deadlines, partial success, and an optional AI layer.",
    lead: "In my news aggregator, Guardian and NYT sit behind one search API. Calling that Strategy is correct, but incomplete. The more useful design discussion is about who owns normalization, what a timeout means, and how much useful work survives a dependency failure.",
    number: "02",
    published: "September 2026",
    quote: "An interface hides a vendor. A good contract also explains failure.",
    readingTime: "3 min read",
    sections: [
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
    slug: "provider-design-strategy-adapter-concurrency",
    sources: [
      ["News Intelligence design and implementation", "https://github.com/Abhay123abhi/ai-powered-news-intelligence"],
      ["Java 21 virtual threads — Oracle", "https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html"],
    ],
    title: "Strategy is the easy part: designing a reliable multi-provider API"
  },
  {
    category: "System design · LLD design exercise",
    excerpt: "A worked design exercise covering database invariants, expiring holds, idempotent requests, and late payment callbacks.",
    lead: "Booking systems are a useful way to connect high-level architecture with low-level design. A class diagram can describe a Seat and a Booking, but it cannot stop two requests from confirming the same seat. This is a design exercise: the numbers and decisions below are illustrative, not results from a deployed booking service.",
    number: "03",
    published: "September 2026",
    quote: "The state machine explains what is legal. The database must enforce who wins.",
    readingTime: "4 min read",
    sections: [
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
    slug: "booking-concurrency-state-machine",
    sources: [["Redis locking guarantees and expiry considerations", "https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/"]],
    title: "Two users, one seat: where a booking design becomes a concurrency problem"
  },
  {
    slug: "event-driven-reliability",
    number: "04",
    category: "Distributed Systems",
    title: "The reliability details behind a Kafka consumer",
    excerpt: "Retries are only one piece. Idempotency, offsets, poison messages, and observability decide whether a flow survives production.",
    readingTime: "5 min read",
    published: "August 2026",
    lead: "A Kafka consumer can look complete after it deserializes a message and calls a service. In production, that is where the reliability conversation begins.",
    quote: "Exactly once is not a magic switch across every database, API, and side effect. State where the guarantee actually holds.",
    sections: [
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
    slug: "graceful-provider-fallbacks",
    number: "05",
    category: "Backend Design",
    title: "Designing graceful fallback for multi-provider APIs",
    excerpt: "How to keep an aggregator useful when upstream APIs are inconsistent, rate-limited, or temporarily unavailable.",
    readingTime: "5 min read",
    published: "August 2026",
    lead: "An aggregator promises one useful response while depending on APIs it does not control. It should absorb provider inconsistency instead of passing it directly to the client.",
    quote: "Graceful degradation is not hiding failure. It preserves useful work while communicating what became unavailable.",
    sections: [
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

function SocialLinks() {
  return <div className="social-links" aria-label="Social and email links">
    <a href={`mailto:${EMAIL}`} aria-label="Gmail — email Abhay" title="Email Abhay"><Mail size={20} /></a>
    <a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin size={20} /></a>
    <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><Github size={20} /></a>
    <a href={TWITTER} target="_blank" rel="noreferrer" aria-label="X / Twitter" title="X / Twitter"><span aria-hidden="true" className="x-mark">𝕏</span></a>
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
    <div className="header-actions"><div className="header-social"><SocialLinks /></div></div>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="primary-navigation">{open ? <X /> : <Menu />}</button>
  </header>;
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
  return <><ScrollToTop /><PortfolioMotion /><Routes><Route path="/" element={<HomeV2 />} /><Route path="/blog" element={<BlogIndex />} /><Route path="/blog/:slug" element={<ArticlePage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></>;
}

