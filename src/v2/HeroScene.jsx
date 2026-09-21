export default function HeroScene() {
  return (
    <div className="v2-scene" aria-hidden="true">
      <div className="v2-scene-grid" />
      <div className="v2-shape v2-shape-cube"><span /><span /><span /></div>
      <div className="v2-shape v2-shape-ring" />
      <div className="v2-shape v2-shape-capsule" />
      <div className="v2-shape v2-shape-orb" />
      <div className="v2-flow">
        <span className="v2-flow-node node-api">API</span>
        <span className="v2-flow-node node-kafka">Kafka</span>
        <span className="v2-flow-node node-worker">Worker</span>
        <span className="v2-flow-node node-data">Data</span>
        <i className="v2-flow-line line-a"><b /></i>
        <i className="v2-flow-line line-b"><b /></i>
        <i className="v2-flow-line line-c"><b /></i>
      </div>
      <div className="v2-scene-glow v2-scene-glow-a" />
      <div className="v2-scene-glow v2-scene-glow-b" />
    </div>
  );
}
