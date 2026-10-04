function Cube({ className }) {
  return (
    <div className={`portfolio-hero-solid portfolio-hero-cube ${className}`}>
      <div className="portfolio-hero-cube-body">
        <span className="portfolio-hero-face front" />
        <span className="portfolio-hero-face back" />
        <span className="portfolio-hero-face right" />
        <span className="portfolio-hero-face left" />
        <span className="portfolio-hero-face top" />
        <span className="portfolio-hero-face bottom" />
      </div>
    </div>
  );
}

export default function HeroScene() {
  return (
    <div className="portfolio-scene portfolio-scene-balanced" aria-hidden="true">
      <div className="portfolio-scene-grid" />
      <div className="portfolio-scene-glow portfolio-scene-glow-a" />
      <div className="portfolio-scene-glow portfolio-scene-glow-b" />

      <Cube className="portfolio-solid-blue" />
      <div className="portfolio-hero-solid portfolio-solid-ring" />
      <div className="portfolio-hero-solid portfolio-solid-orb" />
      <Cube className="portfolio-solid-slate" />
      <Cube className="portfolio-solid-violet" />
    </div>
  );
}
