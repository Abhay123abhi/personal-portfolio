import { ArrowDown, ArrowUpRight, BookOpen, Briefcase, FileDown, Github, Home, Layers, Linkedin, Mail, MoreHorizontal, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import HeroScene from "./HeroScene";
import ProjectCaseStudy from "./ProjectCaseStudy";
import {
  identity,
  productionStats,
  capabilities,
  projects,
  experienceMetrics,
  toolbelt,
  featuredArticles,
} from "./portfolioData";

const mobileCommands = [
  { label: "Home", meta: "hero", href: "#top", icon: Home, keywords: "home top intro profile" },
  { label: "What I build", meta: "capabilities", href: "#capabilities", icon: Layers, keywords: "skills capabilities backend distributed systems" },
  { label: "Selected work", meta: "projects", href: "#work", icon: Briefcase, keywords: "work projects architecture systems" },
  { label: "Experience", meta: "production", href: "#experience", icon: Briefcase, keywords: "experience sun life production impact" },
  { label: "Stack", meta: "toolbelt", href: "#stack", icon: Layers, keywords: "stack tools java spring kafka docker aws" },
  { label: "Engineering journal", meta: "blog", href: "/blog", icon: BookOpen, keywords: "blog articles journal writing" },
  { label: "Contact", meta: "email · links", href: "#contact", icon: Mail, keywords: "contact email linkedin github" },
  { label: "Download résumé", meta: "PDF", href: identity.resume, icon: FileDown, external: true, keywords: "resume cv pdf download" },
  { label: "GitHub profile", meta: "github.com", href: identity.github, icon: Github, external: true, keywords: "github source repositories" },
  { label: "LinkedIn profile", meta: "linkedin.com", href: identity.linkedin, icon: Linkedin, external: true, keywords: "linkedin profile network" },
  { label: "Email Abhay", meta: identity.email, href: `mailto:${identity.email}`, icon: Mail, keywords: "email contact mail" },
];

function V2Nav() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  const links = [
    ["Work", "#work"],
    ["Experience", "#experience"],
    ["Stack", "#stack"],
    ["Blog", "/blog"],
    ["Contact", "#contact"],
  ];

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return mobileCommands;
    return mobileCommands.filter(item =>
      [item.label, item.meta, item.keywords].join(" ").toLowerCase().includes(normalized)
    );
  }, [query]);

  const closePalette = () => {
    setPaletteOpen(false);
    setQuery("");
    setActiveIndex(0);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const runCommand = (item) => {
    closePalette();

    if (item.href.startsWith("#")) {
      requestAnimationFrame(() => {
        document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }

    if (item.href.startsWith("mailto:")) {
      window.location.href = item.href;
      return;
    }

    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.href = item.href;
  };

  useEffect(() => {
    if (!paletteOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => searchRef.current?.focus(), 40);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closePalette();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex(index => filteredCommands.length ? (index + 1) % filteredCommands.length : 0);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex(index => filteredCommands.length ? (index - 1 + filteredCommands.length) % filteredCommands.length : 0);
      }

      if (event.key === "Enter" && filteredCommands[activeIndex]) {
        event.preventDefault();
        runCommand(filteredCommands[activeIndex]);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [paletteOpen, filteredCommands, activeIndex]);

  return (
    <>
      <header className={`v2-nav-shell${scrolled ? " is-scrolled" : ""}`}>
        <nav className="v2-nav" aria-label="Primary">
          <a className="v2-brand" href="#top" aria-label="Abhay Jaiswal home">aj<span>.</span></a>

          <div className="v2-nav-links">
            {links.map(([label, href]) => href.startsWith("/") ? (
              <Link key={label} to={href}>{label}</Link>
            ) : (
              <a key={label} href={href}>{label}</a>
            ))}
          </div>

          <button
            className="v2-mobile-search-trigger"
            type="button"
            aria-label="Search and navigate portfolio"
            aria-haspopup="dialog"
            aria-expanded={paletteOpen}
            onClick={() => setPaletteOpen(true)}
          >
            <Search size={16} />
            <MoreHorizontal size={17} />
          </button>

          <div className="v2-nav-actions">
            <a className="v2-header-resume" href={identity.resume} target="_blank" rel="noreferrer">
              <span>résumé</span>
              <FileDown size={15} />
            </a>
          </div>
        </nav>
      </header>

      {paletteOpen && (
        <div className="v2-command-backdrop" role="presentation" onMouseDown={closePalette}>
          <section
            className="v2-command-palette"
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio navigation"
            onMouseDown={event => event.stopPropagation()}
          >
            <div className="v2-command-search">
              <Search size={18} />
              <input
                ref={searchRef}
                value={query}
                onChange={event => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Type a page, section or action…"
                aria-label="Search portfolio actions"
              />
              <button type="button" onClick={closePalette} aria-label="Close search"><X size={17} /></button>
            </div>

            <div className="v2-command-list" role="listbox" aria-label="Navigation results">
              {filteredCommands.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.label}
                    className={index === activeIndex ? "v2-command-item active" : "v2-command-item"}
                    onClick={() => runCommand(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <span className="v2-command-icon"><Icon size={17} /></span>
                    <span className="v2-command-copy">
                      <strong>{item.label}</strong>
                      <small>{item.meta}</small>
                    </span>
                    <ArrowUpRight size={14} />
                  </button>
                );
              })}

              {!filteredCommands.length && (
                <div className="v2-command-empty">No matching section or action.</div>
              )}
            </div>

            <footer className="v2-command-footer">
              <span>↑ ↓ navigate</span>
              <span>enter open</span>
              <span>esc close</span>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}

function Hero() {
  return (
    <section className="v2-hero" id="top">
      <HeroScene />
      <div className="v2-hero-inner">
        <div className="v2-hero-copy">
          <p className="v2-eyebrow">Java backend · distributed systems · product delivery</p>
          <h1><span>ABHAY</span><span>JAISWAL</span></h1>
          <p className="v2-hero-role">{identity.headline}</p>
          <p className="v2-hero-summary">{identity.summary}</p>
          <div className="v2-hero-actions">
            <a className="v2-primary" href="#work">See the systems <ArrowDown size={16} /></a>
          </div>
        </div>

        <div className="v2-hero-portrait">
          <div className="v2-portrait-orbit v2-portrait-orbit-a" aria-hidden="true" />
          <div className="v2-portrait-orbit v2-portrait-orbit-b" aria-hidden="true" />
          <div className="v2-portrait-glow" aria-hidden="true" />
          <div className="v2-portrait-frame v2-portrait-frame-circle">
            <img src={identity.photo} alt="Abhay Jaiswal" width="1134" height="1134" fetchPriority="high" />
          </div>
        </div>
      </div>

      <a href="#capabilities" className="v2-scroll-cue" aria-label="Scroll to capabilities"><span /><small>scroll</small></a>
    </section>
  );
}

function ProductionStats() {
  return (
    <div className="v2-production" aria-label="Built in production metrics">
      <div className="v2-production-rail" tabIndex={0}>
        {productionStats.map((item) => (
          <article className="v2-production-stat" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function CapabilityGrid() {
  return (
    <section className="v2-section v2-capabilities" id="capabilities">
      <div className="v2-section-head">
        <div><p className="v2-kicker">// WHAT I BUILD</p><h2>Systems that survive<br />the second request.</h2></div>
        <p>Backend-heavy engineering with enough product context to take a feature from contract to interface to production support.</p>
      </div>
      <div className="v2-cap-grid">
        {capabilities.map((item) => (
          <article className={"v2-cap-card cap-" + item.key} key={item.key}>
            <p className="v2-cap-eyebrow">{item.eyebrow}</p>
            <h3>{item.title}</h3>
            <b>{item.subtitle}</b>
            <p>{item.body}</p>
            <div>{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="v2-section v2-work" id="work">
      <div className="v2-section-head v2-work-head">
        <div><p className="v2-kicker">// SELECTED WORK</p><h2>Engineering behind<br />the product.</h2></div>
        <p>Three projects, each built around a reliability problem rather than a framework checklist. Click through the architecture stages to inspect the flow.</p>
      </div>
      <div className="v2-case-list">
        {projects.map((project, index) => (
          <ProjectCaseStudy key={project.title} project={project} projectIndex={index} reverse={index % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="v2-section v2-experience" id="experience">
      <div className="v2-experience-intro">
        <p className="v2-kicker">// EXPERIENCE</p>
        <h2>Built in production.</h2>
        <p>Four years delivering advisor and policy platforms across Asian insurance markets — backend services, event-driven workflows, frontend delivery, and production releases.</p>
      </div>

      <ProductionStats />

      <article className="v2-timeline-card">
        <div className="v2-timeline-rail"><span /></div>
        <div className="v2-timeline-head">
          <div>
            <p className="v2-kicker">SUN LIFE GLOBAL SOLUTIONS</p>
            <h3>Software Developer · Analyst</h3>
            <p>Gurugram, India · July 2022 — Present</p>
          </div>
          <div className="v2-company-mark">SL</div>
        </div>
        <div className="v2-impact-ledger">
          {experienceMetrics.map(item => (
            <div key={item.value}><strong>{item.value}</strong><p>{item.text}</p></div>
          ))}
        </div>
        <p className="v2-onsite">Supported UAT and production releases across Malaysia, the Philippines, and Hong Kong, including onsite support in the Philippines.</p>
      </article>
    </section>
  );
}

function Toolbelt() {
  const half = Math.ceil(toolbelt.length / 2);
  const rows = [toolbelt.slice(0, half), toolbelt.slice(half)];
  return (
    <section className="v2-section v2-toolbelt" id="stack">
      <div className="v2-toolbelt-head">
        <div><p className="v2-kicker">// STACK</p><h2>The toolbelt.</h2></div>
        <p><span className="v2-toolbelt-desktop-copy">What I actually reach for in production — hover to pause.</span><span className="v2-toolbelt-mobile-copy">Production tools in motion.</span></p>
      </div>
      <div className="v2-tool-rows">
        {rows.map((row, rowIndex) => (
          <div className="v2-tool-window" key={rowIndex}>
            <div className={rowIndex ? "v2-tool-track reverse" : "v2-tool-track"}>
              {[...row, ...row].map((tool, index) => (
                <span className="v2-tool" key={tool.name + index} style={{ "--tool-color": `#${tool.color}` }}>
                  <span className="v2-tool-logo" aria-hidden="true">
                    {tool.icon ? (
                      <img src={`https://cdn.simpleicons.org/${tool.icon}/${tool.color}`} alt="" width="20" height="20" loading="lazy" decoding="async" onError={event => { event.currentTarget.style.display = "none"; }} />
                    ) : (
                      <span>{tool.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </span>
                  <b>{tool.name}</b><small>{tool.desc}</small>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section className="v2-section v2-journal">
      <div className="v2-section-head">
        <div><p className="v2-kicker">// ENGINEERING JOURNAL</p><h2>Notes beyond<br />the diagram.</h2></div>
        <Link className="v2-text-link" to="/blog">View all articles <ArrowUpRight size={16} /></Link>
      </div>
      <div className="v2-journal-grid">
        {featuredArticles.map(article => (
          <Link to={article.href} className="v2-article-card" key={article.href}>
            <small>{article.category}</small>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <b>Read article <ArrowUpRight size={14} /></b>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ContactV2() {
  return (
    <section className="v2-contact" id="contact">
      <div className="v2-contact-glow" />
      <p className="v2-kicker">// CONTACT</p>
      <h2>Let’s build something<br /><span>reliable.</span></h2>
      <p>Backend, distributed systems, Java, production engineering — or a product that needs all four. My inbox is open.</p>
      <div className="v2-contact-actions">
        <a className="v2-api-action" href={"mailto:" + identity.email}>/email</a>
        <a className="v2-api-action" href={identity.linkedin} target="_blank" rel="noreferrer">/linkedin</a>
        <a className="v2-api-action" href={identity.github} target="_blank" rel="noreferrer">/github</a>
        <a className="v2-api-action" href={identity.resume} target="_blank" rel="noreferrer">/resume</a>
      </div>
      <footer><span>Abhay Jaiswal</span><span>Gurugram, India</span><span>{identity.email}</span></footer>
    </section>
  );
}

export default function HomeV2() {
  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.classList.add("v2-home-active");

    const targets = document.querySelectorAll(
      ".v2-production, .v2-cap-card, .v2-case-study, .v2-experience-intro, .v2-timeline-card, .v2-toolbelt-head, .v2-article-card, .v2-contact"
    );
    targets.forEach(target => target.classList.add("v2-reveal"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      targets.forEach(target => target.classList.add("is-visible"));
      return () => document.documentElement.classList.remove("v2-home-active");
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    targets.forEach(target => observer.observe(target));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("v2-home-active");
    };
  }, []);

  return (
    <div className="v2-page">
      <V2Nav />
      <main>
        <Hero />
        <CapabilityGrid />
        <Work />
        <Experience />
        <Toolbelt />
        <Journal />
        <ContactV2 />
      </main>
    </div>
  );
}
