import { FileDown } from "lucide-react";
import { useEffect } from "react";
import PortfolioNav from "../components/layout/PortfolioNav";
import HeroScene from "../components/home/HeroScene";
import ProjectCaseStudy from "../components/home/ProjectCaseStudy";
import {
  identity,
  productionStats,
  capabilities,
  projects,
  experienceMetrics,
  toolbelt,
} from "../data/portfolioData";

function Hero() {
  return (
    <section className="portfolio-hero" id="top">
      <HeroScene />
      <div className="portfolio-hero-inner">
        <div className="portfolio-hero-copy">
          <p className="portfolio-eyebrow">Java backend · distributed systems · product delivery</p>
          <h1><span>ABHAY</span><span>JAISWAL</span></h1>
          <p className="portfolio-hero-role">{identity.headline}</p>
          <p className="portfolio-hero-summary">{identity.summary}</p>
          <div className="portfolio-hero-actions">
            <a className="portfolio-primary" href={identity.resume} target="_blank" rel="noreferrer">View résumé <FileDown size={16} /></a>
          </div>
        </div>

        <div className="portfolio-hero-portrait">
          <div className="portfolio-portrait-orbit portfolio-portrait-orbit-a" aria-hidden="true" />
          <div className="portfolio-portrait-orbit portfolio-portrait-orbit-b" aria-hidden="true" />
          <div className="portfolio-portrait-glow" aria-hidden="true" />
          <div className="portfolio-portrait-frame portfolio-portrait-frame-circle">
            <img src={identity.photo} alt="Abhay Jaiswal" width="1134" height="1134" fetchPriority="high" />
          </div>
        </div>
      </div>

      <a href="#capabilities" className="portfolio-scroll-cue" aria-label="Scroll to capabilities"><span /><small>scroll</small></a>
    </section>
  );
}

function ProductionStats() {
  return (
    <div className="portfolio-production" aria-label="Built in production metrics">
      <div className="portfolio-production-rail" tabIndex={0}>
        {productionStats.map((item) => (
          <article className="portfolio-production-stat" key={item.label}>
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
    <section className="portfolio-section portfolio-capabilities" id="capabilities">
      <div className="portfolio-section-head">
        <div><p className="portfolio-kicker">// WHAT I BUILD</p><h2>Systems that survive<br />the second request.</h2></div>
        <p>Backend-heavy engineering with enough product context to take a feature from contract to interface to production support.</p>
      </div>
      <div className="portfolio-cap-grid">
        {capabilities.map((item) => (
          <article className={"portfolio-cap-card cap-" + item.key} key={item.key}>
            <p className="portfolio-cap-eyebrow">{item.eyebrow}</p>
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
    <section className="portfolio-section portfolio-work" id="work">
      <div className="portfolio-section-head portfolio-work-head">
        <div><p className="portfolio-kicker">// SELECTED WORK</p><h2>Engineering behind<br />the product.</h2></div>
        <p>Three projects, each built around a reliability problem rather than a framework checklist. Click through the architecture stages to inspect the flow.</p>
      </div>
      <div className="portfolio-case-list">
        {projects.map((project, index) => (
          <ProjectCaseStudy key={project.title} project={project} projectIndex={index} reverse={index % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="portfolio-section portfolio-experience" id="experience">
      <div className="portfolio-experience-intro">
        <p className="portfolio-kicker">// EXPERIENCE</p>
        <h2>Built in production.</h2>
        <p>Four years delivering advisor and policy platforms across Asian insurance markets — backend services, event-driven workflows, frontend delivery, and production releases.</p>
      </div>

      <ProductionStats />

      <article className="portfolio-timeline-card">
        <div className="portfolio-timeline-rail"><span /></div>
        <div className="portfolio-timeline-head">
          <div>
            <p className="portfolio-kicker">SUN LIFE GLOBAL SOLUTIONS</p>
            <h3>Software Developer · Analyst</h3>
            <p>Gurugram, India · July 2022 — Present</p>
          </div>
          <div className="portfolio-company-mark">SL</div>
        </div>
        <div className="portfolio-impact-ledger">
          {experienceMetrics.map(item => (
            <div key={item.value}><strong>{item.value}</strong><p>{item.text}</p></div>
          ))}
        </div>
        <p className="portfolio-onsite">Supported UAT and production releases across Malaysia, the Philippines, and Hong Kong, including onsite support in the Philippines.</p>
      </article>
    </section>
  );
}

function Toolbelt() {
  const half = Math.ceil(toolbelt.length / 2);
  const rows = [toolbelt.slice(0, half), toolbelt.slice(half)];
  return (
    <section className="portfolio-section portfolio-toolbelt" id="stack">
      <div className="portfolio-toolbelt-head">
        <div><p className="portfolio-kicker">// STACK</p><h2>The toolbelt.</h2></div>
        <p><span className="portfolio-toolbelt-desktop-copy">What I actually reach for in production — hover to pause.</span><span className="portfolio-toolbelt-mobile-copy">Touch & hold to pause.</span></p>
      </div>
      <div className="portfolio-tool-rows">
        {rows.map((row, rowIndex) => (
          <div className="portfolio-tool-window" key={rowIndex}>
            <div className={rowIndex ? "portfolio-tool-track reverse" : "portfolio-tool-track"}>
              {[...row, ...row].map((tool, index) => (
                <span className="portfolio-tool" key={tool.name + index} style={{ "--tool-color": `#${tool.color}` }}>
                  <span className="portfolio-tool-logo" aria-hidden="true">
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

function ContactV2() {
  return (
    <section className="portfolio-contact" id="contact">
      <div className="portfolio-contact-glow" />
      <p className="portfolio-kicker">// CONTACT</p>
      <h2>Let’s build something<br /><span>reliable.</span></h2>
      <p>Backend, distributed systems, Java, production engineering — or a product that needs all four. My inbox is open.</p>
      <div className="portfolio-contact-actions">
        <a className="portfolio-api-action" href={"mailto:" + identity.email}>/email</a>
        <a className="portfolio-api-action" href={identity.linkedin} target="_blank" rel="noreferrer">/linkedin</a>
        <a className="portfolio-api-action" href={identity.github} target="_blank" rel="noreferrer">/github</a>
        <a className="portfolio-api-action" href={identity.resume} target="_blank" rel="noreferrer">/resume</a>
      </div>
      <footer><span>Abhay Jaiswal</span><span>Gurugram, India</span><span>{identity.email}</span></footer>
    </section>
  );
}

export default function HomePage() {
  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.classList.add("portfolio-home-active");

    const targets = document.querySelectorAll(
      ".portfolio-production, .portfolio-cap-card, .portfolio-case-study, .portfolio-experience-intro, .portfolio-timeline-card, .portfolio-toolbelt-head, .portfolio-article-card, .portfolio-contact"
    );
    targets.forEach(target => target.classList.add("portfolio-reveal"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      targets.forEach(target => target.classList.add("is-visible"));
      return () => document.documentElement.classList.remove("portfolio-home-active");
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
      document.documentElement.classList.remove("portfolio-home-active");
    };
  }, []);

  return (
    <div className="portfolio-page">
      <PortfolioNav />
      <main>
        <Hero />
        <CapabilityGrid />
        <Work />
        <Experience />
        <Toolbelt />
        <ContactV2 />
      </main>
    </div>
  );
}

