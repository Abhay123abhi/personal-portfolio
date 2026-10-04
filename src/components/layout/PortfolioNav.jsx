import { ArrowUpRight, BookOpen, Briefcase, FileDown, Github, Home, Layers, Linkedin, Mail, Menu, Search, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { identity } from "../../data/portfolioData";

const commands = [
  { label: "Home", meta: "hero", href: "/", icon: Home, keywords: "home top intro profile" },
  { label: "What I build", meta: "capabilities", href: "/#capabilities", icon: Layers, keywords: "skills capabilities backend distributed systems" },
  { label: "Selected work", meta: "projects", href: "/#work", icon: Briefcase, keywords: "work projects architecture systems" },
  { label: "Experience", meta: "production", href: "/#experience", icon: Briefcase, keywords: "experience sun life production impact" },
  { label: "Stack", meta: "toolbelt", href: "/#stack", icon: Layers, keywords: "stack tools java spring kafka docker aws" },
  { label: "Blog", meta: "blog", href: "/blog", icon: BookOpen, keywords: "blog articles blog writing" },
  { label: "Contact", meta: "email · links", href: "/#contact", icon: Mail, keywords: "contact email linkedin github" },
  { label: "Download résumé", meta: "PDF", href: identity.resume, icon: FileDown, external: true, keywords: "resume cv pdf download" },
  { label: "GitHub profile", meta: "github.com", href: identity.github, icon: Github, external: true, keywords: "github source repositories" },
  { label: "LinkedIn profile", meta: "linkedin.com", href: identity.linkedin, icon: Linkedin, external: true, keywords: "linkedin profile network" },
  { label: "Email Abhay", meta: identity.email, href: `mailto:${identity.email}`, icon: Mail, keywords: "email contact mail" },
];

export default function PortfolioNav({ inner = false }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const searchRef = useRef(null);

  const links = [
    ["Home", "/"],
    ["Work", "/#work"],
    ["Experience", "/#experience"],
    ["Blog", "/blog"],
  ];

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter(item =>
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

  useEffect(() => {
    if (inner || pathname !== "/") {
      setActiveSection("");
      return undefined;
    }

    const sections = ["work", "experience"]
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActiveSection(visible.target.id);
    }, {
      rootMargin: "-18% 0px -58% 0px",
      threshold: [0, 0.15, 0.35, 0.6],
    });

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [inner, pathname]);

  const runCommand = (item) => {
    closePalette();

    if (item.href.startsWith("mailto:")) {
      window.location.href = item.href;
      return;
    }

    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }

    navigate(item.href);
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
      <header className={`portfolio-nav-shell${scrolled ? " is-scrolled" : ""}`}>
        <nav className="portfolio-nav" aria-label="Primary">
          <Link className="portfolio-brand" to="/" aria-label="Abhay Jaiswal home">aj<span>.</span></Link>

          <div className="portfolio-nav-links">
            {links.map(([label, href]) => {
              const sectionId = href.startsWith("/#") ? href.slice(2) : "";
              const isBlog = href === "/blog";
              const isHome = href === "/";
              const isActive = isBlog
                ? pathname.startsWith("/blog")
                : isHome
                  ? pathname === "/" && !activeSection
                  : pathname === "/" && activeSection === sectionId;

              return <Link
                key={label}
                to={href}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "location" : undefined}
              >{label}</Link>;
            })}
          </div>

          <button
            className="portfolio-mobile-search-trigger"
            type="button"
            aria-label="Open portfolio menu"
            aria-haspopup="dialog"
            aria-expanded={paletteOpen}
            onClick={() => setPaletteOpen(true)}
          >
            <Menu size={18} />
          </button>

          <div className="portfolio-nav-actions">
            <button className="portfolio-desktop-menu" type="button" aria-haspopup="dialog" aria-expanded={paletteOpen} onClick={() => setPaletteOpen(true)}><Search size={15} /> Explore</button>
          </div>
        </nav>
      </header>

      {paletteOpen && (
        <div className="portfolio-command-backdrop" role="presentation" onMouseDown={closePalette}>
          <section
            className="portfolio-command-palette"
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio navigation"
            onMouseDown={event => event.stopPropagation()}
          >
            <div className="portfolio-command-search">
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

            <div className="portfolio-command-list" role="listbox" aria-label="Navigation results">
              {filteredCommands.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.label}
                    className={index === activeIndex ? "portfolio-command-item active" : "portfolio-command-item"}
                    onClick={() => runCommand(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <span className="portfolio-command-icon"><Icon size={17} /></span>
                    <span className="portfolio-command-copy">
                      <strong>{item.label}</strong>
                      <small>{item.meta}</small>
                    </span>
                    <ArrowUpRight size={14} />
                  </button>
                );
              })}

              {!filteredCommands.length && (
                <div className="portfolio-command-empty">No matching section or action.</div>
              )}
            </div>

            <footer className="portfolio-command-footer">
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
