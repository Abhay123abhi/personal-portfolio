function Cube({ className }) {
  return (
    <div className={`v2-geo v2-cube-wrap ${className}`}>
      <div className="v2-cube-3d">
        <span className="face front" />
        <span className="face back" />
        <span className="face right" />
        <span className="face left" />
        <span className="face top" />
        <span className="face bottom" />
      </div>
    </div>
  );
}

export default function HeroScene() {
  return (
    <div className="v2-scene" aria-hidden="true">
      <div className="v2-scene-grid" />
      <div className="v2-scene-glow v2-scene-glow-a" />
      <div className="v2-scene-glow v2-scene-glow-b" />

      <Cube className="v2-cube-blue" />
      <div className="v2-geo v2-geo-ring" />
      <div className="v2-geo v2-geo-orb" />
      <Cube className="v2-cube-mint" />
      <Cube className="v2-cube-distant-a" />
      <Cube className="v2-cube-distant-b" />
    </div>
  );
}
