import { useEffect, useMemo, useRef, useState } from "react";
import { BriefcaseBusiness, FileText, Github, Layers3, Mail, Search, UserRound, X } from "lucide-react";

const commands = [
  { label: "Selected work", hint: "Projects & architecture", href: "#work", icon: BriefcaseBusiness },
  { label: "Experience", hint: "Production delivery", href: "#experience", icon: UserRound },
  { label: "Engineering stack", hint: "Tools & capabilities", href: "#skills", icon: Layers3 },
  { label: "Engineering journal", hint: "System design notes", href: "/blog", icon: FileText },
  { label: "GitHub", hint: "Abhay123abhi", href: "https://github.com/Abhay123abhi", external: true, icon: Github },
  { label: "Email Abhay", hint: "abhayjaiswal983@gmail.com", href: "mailto:abhayjaiswal983@gmail.com", external: true, icon: Mail },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return commands;
    return commands.filter(command => `${command.label} ${command.hint}`.toLowerCase().includes(value));
  }, [query]);

  useEffect(() => {
    const onKeyDown = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(value => !value);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("portfolio:command", onOpen);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("portfolio:command", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  if (!open) return null;

  const close = () => setOpen(false);
  const follow = (event, command) => {
    if (command.external) return close();
    event.preventDefault();
    close();
    if (command.href.startsWith("#")) {
      if (window.location.pathname !== "/") {
        window.location.assign(`/${command.href}`);
        return;
      }
      document.querySelector(command.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", command.href);
      return;
    }
    window.location.assign(command.href);
  };

  return (
    <div className="command-backdrop" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) close();
    }}>
      <section className="command-palette" role="dialog" aria-modal="true" aria-label="Portfolio command palette">
        <header className="command-search">
          <Search size={18} aria-hidden="true" />
          <input ref={inputRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search portfolio..." aria-label="Search portfolio" />
          <button type="button" onClick={close} aria-label="Close command palette"><X size={17} /></button>
        </header>
        <div className="command-results">
          {filtered.length ? filtered.map(command => {
            const Icon = command.icon;
            return <a key={command.label} href={command.href} target={command.external && command.href.startsWith("http") ? "_blank" : undefined} rel={command.external && command.href.startsWith("http") ? "noreferrer" : undefined} onClick={event => follow(event, command)}>
              <span className="command-icon"><Icon size={17} /></span>
              <span><strong>{command.label}</strong><small>{command.hint}</small></span>
              <kbd>↵</kbd>
            </a>;
          }) : <p className="command-empty">No matching destination.</p>}
        </div>
        <footer className="command-footer"><span>Navigate</span><kbd>Ctrl / ⌘ K</kbd><span>Close</span><kbd>Esc</kbd></footer>
      </section>
    </div>
  );
}
