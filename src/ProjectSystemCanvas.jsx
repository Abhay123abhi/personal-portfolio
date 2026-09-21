import { projectArchitectures } from "./projectArchitectureData";

export default function ProjectSystemCanvas({ projectIndex, activeStage }) {
  const topology = projectArchitectures[projectIndex];
  if (!topology) return null;

  const [, , diagramWidth, diagramHeight] = topology.viewBox.split(/\s+/).map(Number);
  const activeEdges = topology.edges.filter(edge => edge.stage === activeStage && !edge.muted);

  return (
    <div className="system-canvas-frame">
      <div className="system-canvas" role="img" aria-label={topology.name} data-active-stage={activeStage}>
        <div className="system-canvas-grid" aria-hidden="true" />
        <svg className="system-canvas-svg" viewBox={topology.viewBox} style={{ "--diagram-aspect": `${diagramWidth} / ${diagramHeight}` }} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <filter id={`system-glow-${projectIndex}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g className="system-edges">
            {topology.edges.map(edge => (
              <path
                key={edge.id}
                d={edge.d}
                className={`system-edge stage-${edge.stage}${edge.stage <= activeStage ? " reached" : ""}${edge.stage === activeStage ? " active" : ""}${edge.muted ? " muted" : ""}`}
              />
            ))}
          </g>
          <g className="system-packets">
            {activeEdges.slice(0, 2).map((edge, index) => (
              <circle key={edge.id} r="3.6" className="system-packet" filter={`url(#system-glow-${projectIndex})`}>
                <animateMotion dur={index ? "2.2s" : "1.8s"} begin={index ? "-.7s" : "0s"} repeatCount="indefinite" path={edge.d} />
              </circle>
            ))}
          </g>
          <g className="system-nodes">
            {topology.nodes.map(node => {
              const state = node.stage < activeStage ? "reached" : node.stage === activeStage ? "active" : "pending";
              return (
                <g key={node.id} className={`system-node stage-${node.stage} ${state}`} transform={`translate(${node.x} ${node.y})`}>
                  <rect x="-60" y="-24" width="120" height="48" rx="9" />
                  <circle cx="-46" cy="-11" r="3" className="system-node-dot" />
                  <text x="-36" y="-6" className="system-node-label">{node.label}</text>
                  {node.sub && <text x="-36" y="10" className="system-node-sub">{node.sub}</text>}
                </g>
              );
            })}
          </g>
        </svg>
        <div className="system-canvas-legend" aria-hidden="true"><span>request</span><span>durable state</span><span>async / AI flow</span></div>
      </div>
    </div>
  );
}

