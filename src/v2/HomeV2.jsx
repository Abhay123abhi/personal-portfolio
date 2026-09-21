import { ArrowDown, ArrowUpRight, Download, Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroScene from "./HeroScene";
import ProjectCaseStudy from "./ProjectCaseStudy";
import {
  identity,
  metrics,
  capabilities,
  projects,
  experienceMetrics,
  toolbelt,
  featuredArticles,
} from "./portfolioData";

function V2Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Work", "#work"],
    ["Experience", "#experience"],
    ["Stack", "#stack"],
    ["Blog", "/blog"],
    ["Contact", "#contact"],
  ];

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <header className="v2-nav-shell">
      <nav className="v2-nav" aria-label="Primary">
        <a className="v2-brand" href="#top" aria-label="Abhay Jaiswal home">aj<span>.</span></a>
        <div className={open ? "v2-nav-links open" : "v2-nav-links"}>
          {links.map(([label, href]) => href.startsWith("/") ? (
            <Link key={label} to={href} onClick={() => setOpen(false)}>{label}</Link>
          ) : (
            <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </div>
        <div className="v2-nav-actions">
          <a className="v2-nav-icon" href={identity.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
          <a className="v2-nav-icon" href={identity.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
          <a className="v2-resume-cta" href={identity.resume} target="_blank" rel="noreferrer">résumé <Download size={14} /></a>
          <button className="v2-menu" type="button" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(v => !v)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </header>
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
            <a className="v2-secondary" href={identity.resume} target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={15} /></a>
          </div>
        </div>

        <div className="v2-hero-portrait">
          <div className="v2-portrait-frame">
            <img src={identity.photo} alt="Abhay Jaiswal" width="1134" height="1134" fetchPriority="high" />
          </div>
        </div>
      </div>

      <div className="v2-metrics" role="region" aria-label="Career impact metrics" tabIndex={0}>
        {metrics.map(metric => (
          <div className="v2-metric-card" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
        ))}
      </div>
      <a href="#capabilities" className="v2-scroll-cue" aria-label="Scroll to capabilities"><span /><small>scroll</small></a>
    </section>
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

      <div className="v2-exp-stats">
        <div><strong>4+</strong><span>years in production</span></div>
        <div><strong>3</strong><span>Asian markets supported</span></div>
        <div><strong>2×</strong><span>Brighter Beginning awards</span></div>
        <div><strong>1</strong><span>onsite UAT / release assignment</span></div>
      </div>

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
        <p>What I reach for across backend, data, delivery, observability, and product work.</p>
      </div>
      <div className="v2-tool-rows">
        {rows.map((row, rowIndex) => (
          <div className="v2-tool-window" key={rowIndex}>
            <div className={rowIndex ? "v2-tool-track reverse" : "v2-tool-track"}>
              {[...row, ...row].map(([name, desc], index) => (
                <span className="v2-tool" key={name + index}><b>{name}</b><small>{desc}</small></span>
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
            <span>{article.number}</span>
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
        <a className="v2-api-action" href={"mailto:" + identity.email}><Mail size={16} /> /email</a>
        <a className="v2-api-action" href={identity.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> /linkedin</a>
        <a className="v2-api-action" href={identity.github} target="_blank" rel="noreferrer"><Github size={16} /> /github</a>
        <a className="v2-api-action" href={identity.resume} target="_blank" rel="noreferrer"><Download size={16} /> /resume</a>
      </div>
      <footer><span>Abhay Jaiswal</span><span>Gurugram, India</span><span>{identity.email}</span></footer>
    </section>
  );
}

export default function HomeV2() {
  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.classList.add("v2-home-active");
    return () => document.documentElement.classList.remove("v2-home-active");
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
