export default function TechRail({ groups }) {
  const items = [...new Set(groups.flatMap(group => group.items))];
  const midpoint = Math.ceil(items.length / 2);
  const rows = [items.slice(0, midpoint), items.slice(midpoint)];

  return (
    <section className="tech-rail" aria-label="Technology toolkit">
      {rows.map((row, rowIndex) => (
        <div className="tech-rail-window" key={rowIndex}>
          <div className={rowIndex ? "tech-rail-track reverse" : "tech-rail-track"}>
            {[...row, ...row].map((item, index) => <span key={`${item}-${index}`}><i aria-hidden="true" />{item}</span>)}
          </div>
        </div>
      ))}
    </section>
  );
}
