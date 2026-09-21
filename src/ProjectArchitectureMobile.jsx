export default function ProjectArchitectureMobile({ architecture, selected, onSelect }) {
  const stage = architecture.stages[selected];

  return (
    <div className="architecture-mobile">
      <div className="architecture-mobile-nav" role="tablist" aria-label={architecture.name}>
        {architecture.stages.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={selected === index}
            className={selected === index ? "active" : ""}
            onClick={() => onSelect(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>
      <article className="architecture-mobile-card" aria-live="polite">
        <span className="architecture-mobile-step">Stage {String(selected + 1).padStart(2, "0")}</span>
        <h4>{stage.title}</h4>
        <div className="architecture-mobile-tags">
          {stage.nodes.map(node => <span key={node}>{node}</span>)}
        </div>
        <p>{stage.detail}</p>
      </article>
      <p className="architecture-mobile-note">{architecture.note}</p>
    </div>
  );
}
