function Cube({ className }) {
  return (
    <div className={`v2-hero-solid v2-hero-cube ${className}`}>
      <div className="v2-hero-cube-body">
        <span className="v2-hero-face front" />
        <span className="v2-hero-face back" />
        <span className="v2-hero-face right" />
        <span className="v2-hero-face left" />
        <span className="v2-hero-face top" />
        <span className="v2-hero-face bottom" />
      </div>
    </div>
  );
}

export default function HeroScene() {
  return (
    <div className="v2-scene v2-scene-balanced" aria-hidden="true">
      <div className="v2-scene-grid" />
      <div className="v2-scene-glow v2-scene-glow-a" />
      <div className="v2-scene-glow v2-scene-glow-b" />

      <Cube className="v2-solid-blue" />
      <div className="v2-hero-solid v2-solid-ring" />
      <div className="v2-hero-solid v2-solid-orb" />
      <Cube className="v2-solid-slate" />
      <Cube className="v2-solid-violet" />
    </div>
  );
}
