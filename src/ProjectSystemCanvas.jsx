const topologies = [
  {
    label: "Incident investigation system",
    nodes: [
      { id: "prom", x: 80, y: 82, label: "Prometheus", stage: 0 },
      { id: "alert", x: 240, y: 82, label: "Alertmanager", stage: 0 },
      { id: "api", x: 420, y: 82, label: "Incident API", stage: 1 },
      { id: "db", x: 610, y: 42, label: "PostgreSQL", stage: 1 },
      { id: "outbox", x: 610, y: 132, label: "Outbox", stage: 1 },
      { id: "kafka", x: 790, y: 132, label: "Kafka", stage: 2 },
      { id: "worker", x: 790, y: 260, label: "Worker", stage: 2 },
      { id: "telemetry", x: 610, y: 320, label: "Telemetry", sub: "Prom · Loki · Tempo", stage: 2 },
      { id: "report", x: 405, y: 320, label: "Incident report", stage: 3 },
      { id: "review", x: 190, y: 320, label: "Desk / Grafana", stage: 3 },
    ],
    edges: [
      { id: "i1", d: "M80 82 H240", stage: 0 },
      { id: "i2", d: "M240 82 H420", stage: 0 },
      { id: "i3", d: "M420 82 H505 V42 H610", stage: 1 },
      { id: "i4", d: "M420 82 H505 V132 H610", stage: 1 },
      { id: "i5", d: "M610 132 H790", stage: 2 },
      { id: "i6", d: "M790 132 V260", stage: 2 },
      { id: "i7", d: "M790 260 H700 V320 H610", stage: 2 },
      { id: "i8", d: "M610 320 H405", stage: 3 },
      { id: "i9", d: "M405 320 H190", stage: 3 },
    ],
  },
  {
    label: "News intelligence system",
    nodes: [
      { id: "client", x: 80, y: 210, label: "React", stage: 0 },
      { id: "api", x: 245, y: 210, label: "Search API", stage: 0 },
      { id: "guardian", x: 420, y: 92, label: "Guardian", stage: 1 },
      { id: "nyt", x: 420, y: 328, label: "NYT", stage: 1 },
      { id: "normalize", x: 610, y: 210, label: "Normalize", sub: "dedupe · sort", stage: 2 },
      { id: "redis", x: 780, y: 92, label: "Redis", stage: 2 },
      { id: "gemini", x: 780, y: 328, label: "Gemini", sub: "grounded AI", stage: 3 },
      { id: "result", x: 930, y: 210, label: "Structured result", stage: 3 },
    ],
    edges: [
      { id: "n1", d: "M80 210 H245", stage: 0 },
      { id: "n2", d: "M245 210 H320 V92 H420", stage: 1 },
      { id: "n3", d: "M245 210 H320 V328 H420", stage: 1 },
      { id: "n4", d: "M420 92 H505 V210 H610", stage: 2 },
      { id: "n5", d: "M420 328 H505 V210 H610", stage: 2 },
      { id: "n6", d: "M610 210 H695 V92 H780", stage: 2 },
      { id: "n7", d: "M610 210 H695 V328 H780", stage: 3 },
      { id: "n8", d: "M610 210 H930", stage: 3 },
      { id: "n9", d: "M780 328 H855 V210 H930", stage: 3 },
    ],
  },
  {
    label: "Real-time chat system",
    nodes: [
      { id: "client", x: 75, y: 210, label: "React client", stage: 0 },
      { id: "rest", x: 235, y: 210, label: "REST write", stage: 0 },
      { id: "service", x: 410, y: 210, label: "Spring Boot", stage: 1 },
      { id: "mongo", x: 600, y: 92, label: "MongoDB", sub: "room sequence", stage: 1 },
      { id: "stomp", x: 600, y: 328, label: "STOMP", sub: "WebSocket", stage: 2 },
      { id: "room", x: 785, y: 328, label: "Room clients", stage: 2 },
      { id: "history", x: 785, y: 92, label: "History API", sub: "cursor", stage: 3 },
      { id: "sync", x: 930, y: 210, label: "Reconnect sync", stage: 3 },
    ],
    edges: [
      { id: "c1", d: "M75 210 H235", stage: 0 },
      { id: "c2", d: "M235 210 H410", stage: 0 },
      { id: "c3", d: "M410 210 H505 V92 H600", stage: 1 },
      { id: "c4", d: "M410 210 H505 V328 H600", stage: 2 },
      { id: "c5", d: "M600 328 H785", stage: 2 },
      { id: "c6", d: "M600 92 H785", stage: 3 },
      { id: "c7", d: "M785 92 H860 V210 H930", stage: 3 },
      { id: "c8", d: "M930 210 H965 V385 H75 V210", stage: 3, muted: true },
    ],
  },
];

export default function ProjectSystemCanvas({ projectIndex, activeStage }) {
  const topology = topologies[projectIndex];
  if (!topology) return null;
  const activeEdges = topology.edges.filter(edge => edge.stage === activeStage && !edge.muted);

  return (
    <div className="system-canvas" role="img" aria-label={topology.label} data-active-stage={activeStage}>
      <div className="system-canvas-grid" aria-hidden="true" />
      <svg className="system-canvas-svg" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <filter id={`system-glow-${projectIndex}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g className="system-edges">
          {topology.edges.map(edge => (
            <path
              key={edge.id}
              id={`edge-${projectIndex}-${edge.id}`}
              d={edge.d}
              className={`system-edge stage-${edge.stage}${edge.stage <= activeStage ? " reached" : ""}${edge.stage === activeStage ? " active" : ""}${edge.muted ? " muted" : ""}`}
            />
          ))}
        </g>
        <g className="system-packets">
          {activeEdges.slice(0, 2).map((edge, index) => (
            <circle key={edge.id} r="4" className="system-packet" filter={`url(#system-glow-${projectIndex})`}>
              <animateMotion dur={index ? "2.2s" : "1.8s"} begin={index ? "-.8s" : "0s"} repeatCount="indefinite" path={edge.d} />
            </circle>
          ))}
        </g>
        <g className="system-nodes">
          {topology.nodes.map(node => {
            const state = node.stage < activeStage ? "reached" : node.stage === activeStage ? "active" : "pending";
            return (
              <g key={node.id} className={`system-node stage-${node.stage} ${state}`} transform={`translate(${node.x} ${node.y})`}>
                <rect x="-66" y="-27" width="132" height="54" rx="10" />
                <circle cx="-50" cy="-13" r="3.5" className="system-node-dot" />
                <text x="-40" y="-7" className="system-node-label">{node.label}</text>
                {node.sub && <text x="-40" y="12" className="system-node-sub">{node.sub}</text>}
              </g>
            );
          })}
        </g>
      </svg>
      <div className="system-canvas-legend" aria-hidden="true"><span>request</span><span>durable state</span><span>async flow</span></div>
    </div>
  );
}
