import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Github, X } from "lucide-react";
import ProjectSystemCanvas from "./ProjectSystemCanvas";
import ProjectArchitectureMobile from "./ProjectArchitectureMobile";
import { projectArchitectures } from "../../data/projectArchitectureData";

export default function ProjectCaseStudy({ project, projectIndex, reverse = false }) {
  const [selected, setSelected] = useState(0);
  const [mobileArchitectureOpen, setMobileArchitectureOpen] = useState(false);
  const stageTabsRef = useRef(null);
  const architecture = projectArchitectures[projectIndex];

  useEffect(() => {
    if (!mobileArchitectureOpen || typeof window === "undefined") return undefined;
    if (!window.matchMedia("(max-width: 760px)").matches) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const tabs = stageTabsRef.current;
      const activeTab = tabs?.querySelector("button.active");

      if (tabs && activeTab) {
        const maxScroll = Math.max(0, tabs.scrollWidth - tabs.clientWidth);
        const desiredLeft =
          activeTab.offsetLeft + activeTab.offsetWidth / 2 - tabs.clientWidth / 2;

        tabs.scrollTo({
          left: Math.max(0, Math.min(maxScroll, desiredLeft)),
          behavior: "smooth",
        });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [mobileArchitectureOpen, selected]);

  return (
    <article className={`portfolio-case-study case-${projectIndex}${reverse ? " is-reverse" : ""}`}>
      <div className="portfolio-case-copy">
        <p className="portfolio-kicker">{project.eyebrow}</p>
        <h3>{project.title}</h3>
        <p className="portfolio-case-statement">{project.statement}</p>

        <div className="portfolio-case-columns">
          <div><span>Problem</span><p>{project.problem}</p></div>
          <div><span>Approach</span><p>{project.approach}</p></div>
        </div>

        <div className="portfolio-case-mobile-insights">
          <div className="problem">
            <span>Problem</span>
            <p>{project.problem}</p>
          </div>
          <div className="approach">
            <span>Approach</span>
            <p>{project.approach}</p>
          </div>
        </div>

        <div className="portfolio-case-stack">
          {project.stack.map(item => <span key={item}>{item}</span>)}
        </div>

        <div className="portfolio-case-actions">
          <a href={project.github} target="_blank" rel="noreferrer"><Github size={16} /> Source code</a>
          {project.live && <a href={project.live} target="_blank" rel="noreferrer">Live product <ArrowUpRight size={16} /></a>}
        </div>

        <button
          type="button"
          className="portfolio-mobile-architecture-toggle"
          aria-expanded={mobileArchitectureOpen}
          onClick={() => setMobileArchitectureOpen(open => !open)}
        >
          <span>{mobileArchitectureOpen ? "Close architecture" : "Explore architecture"}</span>
          {mobileArchitectureOpen ? <X size={15} /> : <ArrowDown size={15} />}
        </button>
      </div>

      <div className={`portfolio-case-visual${mobileArchitectureOpen ? " is-mobile-open" : ""}`}>
        <div className="portfolio-case-window-head">
          <span><i /><i /><i /></span>
          <b>{architecture.name}</b>
        </div>
        <div className="portfolio-arch-surface">
          <div className="portfolio-arch-grid" aria-hidden="true" />
          <div className="portfolio-arch-glow portfolio-arch-glow-a" aria-hidden="true" />
          <div className="portfolio-arch-glow portfolio-arch-glow-b" aria-hidden="true" />
          <div className="portfolio-case-canvas">
            <ProjectSystemCanvas projectIndex={projectIndex} activeStage={selected} />
          </div>
        </div>
        <div className="portfolio-case-mobile">
          <ProjectArchitectureMobile architecture={architecture} selected={selected} onSelect={setSelected} />
        </div>
        <div ref={stageTabsRef} className="portfolio-stage-tabs" aria-label={`${project.title} architecture stages`}>
          {architecture.stages.map((stage, index) => (
            <button key={stage.title} type="button" className={selected === index ? "active" : ""} onClick={() => setSelected(index)}>
              {stage.title}
            </button>
          ))}
        </div>
        <div className="portfolio-stage-explainer" aria-live="polite">
          <strong>{architecture.stages[selected].title}</strong>
          <p key={selected}>{architecture.stages[selected].detail}</p>
        </div>
        <p className="portfolio-stage-note">{architecture.note}</p>
      </div>
    </article>
  );
}
