// Set linkedinUrl to the actual post URL after publishing. Never infer publication from a share click.
export const additionalArticles = [
  {
    "slug": "time-series-observability",
    "topic": "Observability",
    "category": "Observability",
    "title": "Why metrics need a different data model",
    "excerpt": "Prometheus, Loki, and Grafana changed how I think about monitoring data.",
    "lead": "Prometheus, Loki, and Grafana changed how I think about monitoring data.",
    "number": "06",
    "published": "Adapted from my LinkedIn post",
    "readingTime": "2 min read",
    "quote": "This project continues to shape how I connect an alert to evidence. Inspired by System Design Interview by Alex Xu, my next question is not how many dashboards I can build, but which signals help explain a failure.",
    "sections": [
      [
        "Start with the question",
        "While building my monitoring and alerting project, I needed to understand request latency, error rates, and resource usage over time. That workload is different from fetching an order by ID.",
        "A time-series database organizes measurements around timestamps and series. Prometheus fits operational metrics; Loki serves logs, and Grafana brings views together. Each component has a distinct responsibility."
      ],
      [
        "Choose for the workload",
        "Relational and NoSQL databases can store time-stamped data. The trade-off is how much engineering is needed for ingestion, time-window queries, retention, and storage at the expected scale. It is too broad to say that every NoSQL database is unsuitable.",
        "Prometheus uses a local time-series store. Retention needs explicit planning; long-term storage and downsampling depend on the wider architecture, rather than appearing automatically when a dashboard is added."
      ],
      [
        "Keep useful signals affordable",
        "I would start with request rate, errors, and duration, then examine which labels are needed for investigation. User IDs and arbitrary URLs can create excessive series cardinality.",
        "This project continues to shape how I connect an alert to evidence. Inspired by System Design Interview by Alex Xu, my next question is not how many dashboards I can build, but which signals help explain a failure."
      ]
    ],
    "flow": [
      "Services",
      "Prometheus",
      "Grafana"
    ],
    "linkedinPublished": true,
    "linkedinUrl": null,
    "sources": [
      [
        "Prometheus storage",
        "https://prometheus.io/docs/prometheus/latest/storage/"
      ]
    ]
  },
  {
    "slug": "java-volatile-visibility",
    "topic": "Java",
    "category": "Java",
    "title": "The stop flag my worker thread could not see",
    "excerpt": "A small concurrency bug, and the boundary between visibility and atomicity.",
    "lead": "A small concurrency bug, and the boundary between visibility and atomicity.",
    "number": "07",
    "published": "Adapted from my LinkedIn post",
    "readingTime": "2 min read",
    "quote": "A flag also does not wake a worker blocked in I/O. For executor tasks, interruption and explicit cancellation policies are usually part of a complete shutdown design.",
    "sections": [
      [
        "A flag is shared state",
        "I once set a flag to stop a worker thread, but it kept running. With an ordinary shared boolean and no synchronization, that loop has no reliable visibility guarantee.",
        "CPU caching is a useful intuition, but compiler optimizations and the Java Memory Model matter too. A thread may keep using a value without observing the update."
      ],
      [
        "Establish a happens-before relationship",
        "A volatile write happens-before subsequent reads of that variable. A declaration such as private volatile boolean running = true is suitable for a simple cooperative stop flag.",
        "This is a visibility and ordering guarantee, not a promise that every access bypasses hardware caches or that a thread is scheduled immediately. The worker still needs to reach its next flag check."
      ],
      [
        "Know what it cannot fix",
        "volatile does not make count++ atomic. A read, modification, and write can still interleave with another thread. Choose an atomic operation or a lock when the invariant needs it.",
        "A flag also does not wake a worker blocked in I/O. For executor tasks, interruption and explicit cancellation policies are usually part of a complete shutdown design."
      ]
    ],
    "flow": [
      "Writer",
      "volatile",
      "Worker"
    ],
    "linkedinPublished": true,
    "linkedinUrl": null,
    "sources": [
      [
        "Java Memory Model",
        "https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html"
      ]
    ]
  },
  {
    "slug": "redis-news-cache",
    "topic": "Data",
    "category": "Data",
    "title": "Cache-aside: a faster feed without hiding failure",
    "excerpt": "Cache keys, expiration, and fallback in AI-Powered News Intelligence.",
    "lead": "Cache keys, expiration, and fallback in AI-Powered News Intelligence.",
    "number": "08",
    "published": "Engineering notes",
    "readingTime": "2 min read",
    "quote": "Redis is an optimization here. A fallback to providers still needs admission limits so a cache outage does not overload every upstream at once.",
    "sections": [
      [
        "Make the key describe the response",
        "The news feed uses Redis cache-aside: read the cache first, load from providers on a miss, then cache the normalized result.",
        "A key should include query, filters, page, and a schema version. Omitting any response-shaping input lets unrelated searches share the wrong result."
      ],
      [
        "Treat expiration as a product decision",
        "Freshness matters for news. A long TTL reduces provider calls but may hide a developing story. A short TTL does the opposite.",
        "I would measure hit rate alongside result age and provider usage. TTL jitter and bounded request coalescing can reduce bursts when popular entries expire together."
      ],
      [
        "Keep failures distinguishable",
        "A valid empty search is different from an upstream outage. Caching both identically can turn a short outage into a long-lived empty feed.",
        "Redis is an optimization here. A fallback to providers still needs admission limits so a cache outage does not overload every upstream at once."
      ]
    ],
    "flow": [
      "Request",
      "Redis",
      "Providers"
    ]
  },
  {
    "slug": "gemini-optional-ai",
    "topic": "AI",
    "category": "AI",
    "title": "An AI feature should not take the news feed down",
    "excerpt": "Daily briefs, questions, and coverage comparison with an optional Gemini layer.",
    "lead": "Daily briefs, questions, and coverage comparison with an optional Gemini layer.",
    "number": "09",
    "published": "Engineering notes",
    "readingTime": "2 min read",
    "quote": "I would evaluate this with disabled AI, quota exhaustion, malformed output, and one missing source. The goal is a useful workspace that degrades clearly.",
    "sections": [
      [
        "Retrieve before generating",
        "The AI workspace builds on retrieved news for daily briefs, questions, and coverage comparisons. Keeping retrieval independent preserves normal search if generation fails.",
        "A useful answer should link back to the articles it uses. Source availability is not proof that every generated claim is correct, so unsupported conclusions need to be avoided."
      ],
      [
        "Design for a finite allowance",
        "For a free-tier demo, I prefer explicit enablement, bounded input, response caching, and clear unavailable states. Quotas can change and should remain configuration, not assumptions embedded in the UI.",
        "Cache identity needs the operation, question, source set, and prompt version. Otherwise a fresh question may receive an answer grounded in older or different articles."
      ],
      [
        "Let the interface tell the truth",
        "An AI timeout should leave the news cards usable. A retry button should represent another bounded attempt rather than an invisible retry loop.",
        "I would evaluate this with disabled AI, quota exhaustion, malformed output, and one missing source. The goal is a useful workspace that degrades clearly."
      ]
    ],
    "flow": [
      "Articles",
      "Gemini",
      "Citations"
    ]
  },
  {
    "slug": "chat-delivery-reconnect",
    "topic": "Backend",
    "category": "Backend",
    "title": "A chat connection is not a delivery guarantee",
    "excerpt": "Design notes from building a real-time chat app.",
    "lead": "Design notes from building a real-time chat app.",
    "number": "10",
    "published": "Engineering notes",
    "readingTime": "2 min read",
    "quote": "On mobile, entry controls, keyboard space, and scroll behavior are part of correctness: users must still reach the room and send a message on a small screen.",
    "sections": [
      [
        "Separate transport from persistence",
        "A live connection makes chat feel immediate. It does not prove a message was durably stored or read by another person.",
        "For the chat app, I think about accepted, persisted, delivered, and read as distinct states. The interface should only claim the state the backend can establish."
      ],
      [
        "Reconnect without duplicating",
        "A client can lose its connection after sending but before receiving an acknowledgement. Retrying with a new message identity risks duplication.",
        "A proposed durable design uses a stable client message ID scoped to the sender, server deduplication, and history retrieval after a cursor. These are design boundaries, not a claim of unlimited scale."
      ],
      [
        "Bound the demo",
        "Public room creation and messaging need validation, payload limits, and rate limits at the server. Hiding a button is not enforcement.",
        "On mobile, entry controls, keyboard space, and scroll behavior are part of correctness: users must still reach the room and send a message on a small screen."
      ]
    ],
    "flow": [
      "Client",
      "Socket",
      "History"
    ]
  },
  {
    "slug": "bff-okta-boundary",
    "topic": "Security",
    "category": "Security",
    "title": "What belongs behind a BFF?",
    "excerpt": "API composition and machine-to-machine identity in backend work.",
    "lead": "API composition and machine-to-machine identity in backend work.",
    "number": "11",
    "published": "Engineering notes",
    "readingTime": "2 min read",
    "quote": "Timeout budgets and partial responses belong in the API contract. Returning a fast but misleading success is not a performance improvement.",
    "sections": [
      [
        "Shape responses for the client",
        "My backend work includes a BFF and Okta machine-to-machine integration. The BFF gives web and mobile a response aligned with their screens instead of requiring many client-side calls.",
        "That boundary is useful for payload shaping and orchestration. It should not become a second implementation of every domain rule."
      ],
      [
        "Separate identities",
        "A service credential proves which application is calling. It does not automatically establish which human user is authorized for a resource.",
        "Validate token issuer, audience, expiry, and required permissions at the appropriate boundary. Propagate user context only through a trusted contract and keep secrets outside the frontend bundle."
      ],
      [
        "Measure the whole path",
        "A smaller payload can improve the experience, but dependency fan-out and serialization still contribute to latency. I would trace the request across the BFF and its services.",
        "Timeout budgets and partial responses belong in the API contract. Returning a fast but misleading success is not a performance improvement."
      ]
    ],
    "flow": [
      "Web / Mobile",
      "BFF",
      "Services"
    ]
  },
  {
    "slug": "sql-index-api-latency",
    "topic": "Data",
    "category": "Data",
    "title": "An index is a hypothesis: prove it with the query plan",
    "excerpt": "A practical workflow for SQL-backed API performance.",
    "lead": "A practical workflow for SQL-backed API performance.",
    "number": "12",
    "published": "Engineering notes",
    "readingTime": "2 min read",
    "quote": "I would compare latency percentiles and write behavior before and after a change. Test skewed accounts and deep pages, not only an empty development database.",
    "sections": [
      [
        "Measure before changing",
        "SQL optimization in my backend work starts with the query the API actually runs, representative parameters, and the amount of data returned.",
        "A slow endpoint may be waiting on a database, connection pool, serialization, or another service. An index cannot fix all of those."
      ],
      [
        "Match the access path",
        "For a query filtered by account and ordered by time, I would inspect whether a composite index can support the filter and ordering together.",
        "Use the database query plan and realistic distributions. Index order, selectivity, and pagination shape matter; adding one index per column is not a general solution."
      ],
      [
        "Account for the write cost",
        "Indexes consume storage and add maintenance to inserts and updates. Every extra index needs a reason to exist.",
        "I would compare latency percentiles and write behavior before and after a change. Test skewed accounts and deep pages, not only an empty development database."
      ]
    ],
    "flow": [
      "API",
      "Query plan",
      "Index"
    ]
  },
  {
    "slug": "delivery-release-readiness",
    "topic": "Delivery",
    "category": "Delivery",
    "title": "The release is not finished when the pipeline turns green",
    "excerpt": "Jenkins, containers, and lessons from SIT and UAT readiness.",
    "lead": "Jenkins, containers, and lessons from SIT and UAT readiness.",
    "number": "13",
    "published": "Engineering notes",
    "readingTime": "2 min read",
    "quote": "I would use backward-compatible schema steps, inspect error rates after release, and document who owns recovery. That makes release readiness a shared engineering responsibility.",
    "sections": [
      [
        "Make one artifact travel",
        "My delivery work spans Jenkins, Docker, Kubernetes, and release support. A reproducible artifact helps keep the tested version aligned with the deployed version.",
        "Configuration should vary by environment without silently rebuilding different application code for each stage."
      ],
      [
        "Readiness is evidence",
        "Supporting SIT and UAT across Asian markets taught me that a successful deployment is only one checkpoint. Dependencies, test data, access, and business flows must also be ready.",
        "A release checklist is useful when each item points to an observable result: a health check, a verified journey, an agreed configuration, or a known limitation."
      ],
      [
        "Plan how to recover",
        "Rollback needs compatible database changes and a known artifact. A pipeline button cannot undo an irreversible migration by itself.",
        "I would use backward-compatible schema steps, inspect error rates after release, and document who owns recovery. That makes release readiness a shared engineering responsibility."
      ]
    ],
    "flow": [
      "Build",
      "Verify",
      "Release"
    ]
  },
  {
    "slug": "react-ionic-api-states",
    "topic": "Frontend",
    "category": "Frontend",
    "title": "The backend contract continues into the loading state",
    "excerpt": "React and Ionic lessons for resilient web and mobile interfaces.",
    "lead": "React and Ionic lessons for resilient web and mobile interfaces.",
    "number": "14",
    "published": "Engineering notes",
    "readingTime": "2 min read",
    "quote": "For campaign and chat-style flows, I would check the primary action on narrow screens and preserve input after recoverable errors. A dependable UI makes the backend behavior understandable.",
    "sections": [
      [
        "Name every response state",
        "My frontend experience includes React and Ionic interfaces connected to backend workflows. Loading, empty, partial, failed, and successful responses deserve different UI states.",
        "A blank card should not force a user to guess whether the request is still running or returned no results."
      ],
      [
        "Protect against stale responses",
        "Two searches can finish out of order. The older response should not overwrite the result for the latest input.",
        "Cancellation can reduce wasted work; a request identity check still helps ensure only the current result updates the screen. Disable repeated submission only when it is appropriate to the operation."
      ],
      [
        "Test the actual viewport",
        "Desktop alignment is not enough. Touch targets, long labels, focus visibility, and on-screen keyboards change the interaction.",
        "For campaign and chat-style flows, I would check the primary action on narrow screens and preserve input after recoverable errors. A dependable UI makes the backend behavior understandable."
      ]
    ],
    "flow": [
      "User",
      "React / Ionic",
      "API"
    ]
  },
  {
    "slug": "incident-evidence-partial-failure",
    "topic": "Observability",
    "category": "Observability",
    "title": "When the monitoring dependency is the thing that fails",
    "excerpt": "Keep incident reports useful when logs or traces are unavailable.",
    "lead": "Keep incident reports useful when logs or traces are unavailable.",
    "number": "15",
    "published": "Engineering notes",
    "readingTime": "2 min read",
    "quote": "The goal is an honest incident history: what triggered the investigation, which evidence was available, and what remained unknown. A polished dashboard alone cannot provide that history.",
    "sections": [
      [
        "An alert starts an investigation",
        "The incident platform brings metrics, logs, and traces into a persistent report. Each evidence source can fail independently.",
        "A Loki outage should not erase metrics that were already collected. The report needs to distinguish absent evidence from evidence that could not be fetched."
      ],
      [
        "Bound the collection",
        "A slow telemetry request must not keep a worker occupied forever. I would give each collection operation a timeout within an overall investigation budget.",
        "Preserve source-level status and errors alongside successful results. This helps a reader decide whether a conclusion is supported or whether investigation needs another attempt."
      ],
      [
        "Practice the failure",
        "Stopping a dependency in a local environment is a useful failure exercise. Check both the final report and the recovery path when the dependency returns.",
        "The goal is an honest incident history: what triggered the investigation, which evidence was available, and what remained unknown. A polished dashboard alone cannot provide that history."
      ]
    ],
    "flow": [
      "Alert",
      "Evidence",
      "Report"
    ]
  },
  {
    "slug": "notification-patterns",
    "topic": "Design Patterns",
    "category": "Design Patterns",
    "title": "Strategy, Observer, and the notification boundary",
    "excerpt": "A design exercise connecting incident notifications to the patterns I am studying.",
    "flow": [
      "Event",
      "Policy",
      "Channel"
    ],
    "number": "16",
    "published": "Design exercise · Reading notes",
    "readingTime": "3 min read",
    "lead": "A design exercise connecting incident notifications to the patterns I am studying.",
    "quote": "Start with the invariant, then choose the abstraction.",
    "sections": [
      [
        "Start with responsibilities",
        "Reading Dive Into Design Patterns by Alexander Shvets prompts me to ask which responsibility is changing before choosing a class structure. Here is my own notification design exercise, inspired by that question.",
        "An incident may trigger an email today and another channel later. Deciding whether to notify, formatting content, and talking to a provider are separate decisions."
      ],
      [
        "Choose variation deliberately",
        "A NotificationChannel interface can offer send(message), with adapters around provider APIs. A delivery policy can select a channel or combine several. I would use Strategy when the behavior needs to be interchangeable.",
        "Creating those implementations is a separate concern. A small registry or dependency injection may be enough; I would not call every constructor wrapper a Factory Method."
      ],
      [
        "Observer is not a message broker",
        "Observer describes a subscription relationship between objects. It can decouple an in-process event source from listeners, but does not automatically provide persistence, retries, or delivery across processes.",
        "If sending must survive a crash, persist notification intent and process it with an explicit retry policy. A Kafka-based pipeline has failure semantics that a pattern name alone cannot describe."
      ],
      [
        "Test the boundary",
        "For the exercise, I would inject a fake channel, verify policy selection, and test provider failure independently from incident creation.",
        "The useful outcome is a smaller change when a provider is replaced, not a larger count of patterns in the codebase."
      ]
    ],
    "sources": [
      [
        "Reading inspiration: Dive Into Design Patterns — Alexander Shvets",
        "https://refactoring.guru/design-patterns/book"
      ]
    ]
  },
  {
    "slug": "rate-limiter-design",
    "topic": "System Design",
    "category": "System Design",
    "title": "Designing a rate limiter: where should the decision live?",
    "excerpt": "An original system-design exercise inspired by my Alex Xu reading.",
    "flow": [
      "Request",
      "Token bucket",
      "Service"
    ],
    "number": "17",
    "published": "Design exercise · Reading notes",
    "readingTime": "3 min read",
    "lead": "An original system-design exercise inspired by my Alex Xu reading.",
    "quote": "Start with the invariant, then choose the abstraction.",
    "sections": [
      [
        "Define the promise",
        "My reading of System Design Interview by Alex Xu is a starting point for this exercise: protect a public demo API from bursts while keeping ordinary use responsive. These are proposed choices, not claims about a deployed limiter.",
        "First define the identity, operation, steady rate, burst allowance, and response on rejection. A limit per IP is different from a limit per authenticated account."
      ],
      [
        "Model a small token bucket",
        "Imagine a bucket with capacity ten, refilling at one token per second. Each admitted request spends a token. That permits short bursts while controlling the longer-term rate.",
        "Across service replicas, a shared decision needs an atomic read-refill-consume operation. A Redis script is one possible implementation; separate get and set calls can overspend tokens under contention."
      ],
      [
        "Separate failure policy from algorithm",
        "What happens when Redis is unavailable? An expensive generation endpoint may reject requests, while another endpoint may accept a bounded local fallback. The choice belongs to the operation.",
        "Return a clear rejection and appropriate retry information. Avoid unbounded waiting inside the limiter: a queue can consume resources before the protected service receives any work."
      ],
      [
        "Check the boundary conditions",
        "I would test simultaneous requests, refill after idle time, clock assumptions, and multiple replicas. Include hot identities and an unavailable store.",
        "A rate limit does not replace authentication, payload limits, concurrency bounds, or an upstream budget. Each protects a different constraint."
      ]
    ],
    "sources": [
      [
        "Reading inspiration: System Design Interview — Alex Xu",
        "https://bytebytego.com/books/system-design-interview"
      ]
    ]
  },
  {
    "slug": "state-pattern-lld",
    "topic": "LLD",
    "category": "LLD",
    "title": "State pattern: make illegal transitions hard to express",
    "excerpt": "A vending-machine exercise that connects back to incident lifecycles.",
    "flow": [
      "Idle",
      "Paid",
      "Dispense"
    ],
    "number": "18",
    "published": "Design exercise · Reading notes",
    "readingTime": "3 min read",
    "lead": "A vending-machine exercise that connects back to incident lifecycles.",
    "quote": "Start with the invariant, then choose the abstraction.",
    "sections": [
      [
        "Write the transitions first",
        "My LLD practice alongside Dive Into Design Patterns starts with behavior. For a vending machine, selecting an item, accepting money, cancelling, and dispensing do not make sense in every state.",
        "I would first list legal transitions and their guards. The problem is easier to see before adding classes named IdleState or PaidState."
      ],
      [
        "Choose enum or state objects",
        "An enum with explicit transition methods works well while the behavior is small. Separate State implementations become useful when each state owns substantial distinct behavior.",
        "A context delegates actions to the current state and controls state changes. It should not allow outside code to set any state arbitrarily, bypassing stock or payment checks."
      ],
      [
        "Keep side effects explicit",
        "Dispensing can fail after payment succeeds. The model needs a recovery or refund path rather than assuming the happy transition always completes.",
        "The same reasoning helps me think about an incident lifecycle: a late collection result should not reopen a resolved incident. State objects alone do not solve concurrent updates; persistence needs a version check or another atomic guard."
      ],
      [
        "Test behavior instead of class names",
        "I would test cancelling before payment, insufficient balance, stock exhaustion, a failed dispense, and repeated requests. Assertions should describe the domain invariant.",
        "This is a design exercise rather than a claim that my portfolio ships a vending machine. The value is learning when a pattern clarifies behavior and when a simpler model is enough."
      ]
    ],
    "sources": [
      [
        "Reading inspiration: Dive Into Design Patterns — Alexander Shvets",
        "https://refactoring.guru/design-patterns/book"
      ]
    ]
  }
];

const existingArticles = [
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

const topics = ["System Design", "Design Patterns", "LLD", "Data", "Backend"];
const flows = [["Incident", "Outbox", "Kafka"], ["Providers", "Adapters", "API"], ["Hold", "Payment", "Confirm"], ["Kafka", "Consumer", "Commit"], ["Sources", "Fallback", "Feed"]];
export const articles = [...existingArticles.map((article, i) => ({...article, topic: topics[i], flow: flows[i]})), ...additionalArticles];

