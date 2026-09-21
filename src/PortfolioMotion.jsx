import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Content stays visible until an observer has positively registered it.
export default function PortfolioMotion() {
  const { pathname } = useLocation();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    const targets = [...document.querySelectorAll(".section-heading, .project, .career-results li, .toolkit-card, .archive-row, .article-body section")];
    const reset = () => {
      observer?.disconnect();
      targets.forEach(node => node.classList.remove("reveal-pending", "reveal-in"));
    };
    const observe = () => {
      reset();
      if (preference.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.classList.remove("reveal-pending");
          target.classList.add("reveal-in");
          observer.unobserve(target);
        });
      }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
      targets.forEach(node => {
        // Never hide content already visible, focused, or targeted by an anchor.
        if (node.getBoundingClientRect().top < window.innerHeight) return;
        node.classList.add("reveal-pending");
        observer.observe(node);
      });
    };
    observe();
    preference.addEventListener("change", observe);
    return () => { reset(); preference.removeEventListener("change", observe); };
  }, [pathname]);

  useEffect(() => {
    const links = [...document.querySelectorAll('.nav a[href^="#"]')];
    const sections = links.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const progress = document.querySelector(".reading-progress");
    const article = document.querySelector(".article");
    let frame = 0;
    const update = () => {
      frame = 0;
      let active;
      sections.forEach(section => { if (section.getBoundingClientRect().top <= 180) active = section.id; });
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = sections.at(-1)?.id;
      links.forEach(link => {
        if (link.hash === `#${active}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      const pageRange = document.documentElement.scrollHeight - window.innerHeight;
      const pageProgress = pageRange > 0 ? Math.min(1, Math.max(0, window.scrollY / pageRange)) : 0;
      document.documentElement.style.setProperty("--page-progress", pageProgress);
      if (article && progress) {
        const box = article.getBoundingClientRect();
        const available = box.height - window.innerHeight;
        const value = available > 0 ? Math.min(1, Math.max(0, -box.top / available)) : 1;
        progress.style.transform = `scaleX(${value})`;
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      links.forEach(link => link.removeAttribute("aria-current"));
      document.documentElement.style.removeProperty("--page-progress");
    };
  }, [pathname]);
  useEffect(() => {
    const root = document.documentElement;
    const ambient = document.querySelector(".ambient-system");
    const projects = [...document.querySelectorAll(".project")];
    const sections = [...document.querySelectorAll(".introduction, .work-section, .experience-section, .craft-section")];
    if (!ambient || !("IntersectionObserver" in window)) return;

    const projectObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const index = projects.indexOf(entry.target);
        root.dataset.activeProject = index >= 0 ? String(index) : "";
      });
    }, { threshold: 0.42, rootMargin: "-12% 0px -30%" });

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        root.dataset.activeSection = entry.target.classList.contains("work-section") ? "work"
          : entry.target.classList.contains("experience-section") ? "experience"
          : entry.target.classList.contains("craft-section") ? "skills"
          : "intro";
      });
    }, { threshold: 0.28, rootMargin: "-18% 0px -38%" });

    projects.forEach(project => projectObserver.observe(project));
    sections.forEach(section => sectionObserver.observe(section));

    return () => {
      projectObserver.disconnect();
      sectionObserver.disconnect();
      delete root.dataset.activeProject;
      delete root.dataset.activeSection;
    };
  }, [pathname]);

  useEffect(() => {
    const preference = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const root = document.documentElement;
    let frame = 0;
    let x = 50;
    let y = 20;

    const apply = () => {
      frame = 0;
      root.style.setProperty("--ambient-x", `${x}%`);
      root.style.setProperty("--ambient-y", `${y}%`);
    };
    const move = event => {
      if (!preference.matches) return;
      x = (event.clientX / window.innerWidth) * 100;
      y = (event.clientY / window.innerHeight) * 100;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", move);
      root.style.removeProperty("--ambient-x");
      root.style.removeProperty("--ambient-y");
    };
  }, [pathname]);

  // Pointer lighting enhances cards only on fine-pointer devices. No React renders per move.
  useEffect(() => {
    const preference = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let activeCard;
    let frame = 0;
    let point;
    const clear = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (activeCard) {
        activeCard.removeAttribute("data-spotlit");
        activeCard.style.removeProperty("--pointer-x");
        activeCard.style.removeProperty("--pointer-y");
      }
      activeCard = null;
    };
    const move = event => {
      if (!preference.matches || !(event.target instanceof Element)) return;
      const card = event.target.closest(".project, .toolkit-card, .impact-cell");
      if (card !== activeCard) { clear(); activeCard = card; }
      if (!card) return;
      point = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!activeCard) return;
        const bounds = activeCard.getBoundingClientRect();
        activeCard.style.setProperty("--pointer-x", `${point.x - bounds.left}px`);
        activeCard.style.setProperty("--pointer-y", `${point.y - bounds.top}px`);
        activeCard.setAttribute("data-spotlit", "true");
      });
    };
    const leave = event => { if (!event.relatedTarget) clear(); };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    window.addEventListener("blur", clear);
    window.addEventListener("scroll", clear, { passive: true });
    preference.addEventListener("change", clear);
    return () => {
      clear();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", clear);
      window.removeEventListener("scroll", clear);
      preference.removeEventListener("change", clear);
    };
  }, [pathname]);
  return pathname.startsWith("/blog/") ? <div className="reading-progress" aria-hidden="true" /> : null;
}
