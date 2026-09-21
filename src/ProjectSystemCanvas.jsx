const topologies = [
  {
    label: "Incident investigation with optional AI/RAG enrichment",
    nodes: [
      { id: "prom", x: 72, y: 72, label: "Prometheus", stage: 0 },
      { id: "alert", x: 222, y: 72, label: "Alertmanager", stage: 0 },
      { id: "api", x: 385, y: 72, label: "Incident API", stage: 1 },
      { id: "db", x: 555, y: 38, label: "PostgreSQL", stage: 1 },
      { id: "outbox", x: 555, y: 112, label: "Outbox", stage: 1 },
      { id: "kafka", x: 725, y: 112, label: "Kafka", stage: 2 },
      { id: "worker", x: 725, y: 225, label: "Evidence worker", stage: 2 },
      { id: "telemetry", x: 545, y: 260, label: "Telemetry", sub: "Prom · Loki · Tempo", stage: 2 },
      { id: "report", x: 360, y: 260, label: "Incident report", stage: 2 },
      { id: "aitopic", x: 360, y: 355, label: "AI topic", sub: "outbox → Kafka", stage: 3 },
      { id: "aiworker", x: 540, y: 355, label: "AI worker", stage: 3 },
      { id: "embed", x: 715, y: 330, label: "Gemini embed", stage: 3 },
      { id: "vector", x: 875, y: 330, label: "pgvector", sub: "runbooks · history", stage: 3 },
      { id: "gemini", x: 875, y: 405, label: "Gemini RCA", sub: "structured hypothesis", stage: 3 },
      { id: "review", x: 150, y: 355, label: "Desk / Grafana", stage: 4 },
      { id: "aiapi", x: 150, y: 430, label: "AI API", sub: "persisted hypothesis", stage: 4 },
    ],
    edges: [
      { id: "i1", d: "M72 72 H222", stage: 0 },
      { id: "i2", d: "M222 72 H385", stage: 0 },
      { id: "i3", d: "M385 72 H470 V38 H555", stage: 1 },
      { id: "i4", d: "M385 72 H470 V112 H555", stage: 1 },
      { id: "i5", d: "M555 112 H725", stage: 2 },
      { id: "i6", d: "M725 112 V225", stage: 2 },
      { id: "i7", d: "M725 225 H635 V260 H545", stage: 2 },
      { id: "i8", d: "M545 260 H360", stage: 2 },
      { id: "i9", d: "M360 260 V355", stage: 3 },
      { id: "i10", d: "M360 355 H540", stage: 3 },
      { id: "i11", d: "M540 355 H625 V330 H715", stage: 3 },
      { id: "i12", d: "M715 330 H875", stage: 3 },
      { id: "i13", d: "M875 330 V405", stage: 3 },
      { id: "i14", d: "M360 260 H255 V355 H150", stage: 4 },
      { id: "i15", d: "M875 405 H770 V430 H150", stage: 4, muted: true },
    ],
  },
  {
    label: "News intelligence system",
    nodes: [
      { id: "client", x: 72, y: 210, label: "React", stage: 0 },
      { id: "api", x: 225, y: 210, label: "Search API", stage: 0 },
      { id: "cache", x: 385, y: 80, label: "Redis", sub: "search cache", stage: 0 },
      { id: "guardian", x: 430, y: 185, label: "Guardian", stage: 1 },
      { id: "nyt", x: 430, y: 310, label: "NYT", stage: 1 },
      { id: "normalize", x: 620, y: 210, label: "Normalize", sub: "dedupe · sort", stage: 2 },
      { id: "store", x: 800, y: 110, label: "Redis", sub: "search result", stage: 2 },
      { id: "gemini", x: 800, y: 300, label: "Gemini", sub: "structured AI", stage: 3 },
      { id: "aicache", x: 625, y: 340, label: "AI cache", sub: "Redis TTL", stage: 3 },
      { id: "result", x: 945, y: 210, label: "Cited response", stage: 3 },
    ],
    edges: [
      { id: "n1", d: "M72 210 H225", stage: 0 },
      { id: "n2", d: "M225 210 H305 V80 H385", stage: 0 },
      { id: "n3", d: "M225 210 H330 V185 H430", stage: 1 },
      { id: "n4", d: "M225 210 H330 V310 H430", stage: 1 },
      { id: "n5", d: "M430 185 H525 V210 H620", stage: 2 },
      { id: "n6", d: "M430 310 H525 V210 H620", stage: 2 },
      { id: "n7", d: "M620 210 H710 V110 H800", stage: 2 },
      { id: "n8", d: "M620 210 H710 V300 H800", stage: 3 },
      { id: "n9", d: "M620 210 V340", stage: 3 },
      { id: "n10", d: "M800 300 H875 V210 H945", stage: 3 },
    ],
  },
  {
    label: "Reliable room chat system",
    nodes: [
      { id: "client", x: 70, y: 205, label: "React client", stage: 0 },
      { id: "rest", x: 225, y: 205, label: "REST write", sub: "clientMessageId", stage: 0 },
      { id: "lock", x: 390, y: 205, label: "Room writer", sub: "striped lock", stage: 1 },
      { id: "mongo", x: 555, y: 95, label: "MongoDB", sub: "message state", stage: 1 },
      { id: "seq", x: 555, y: 285, label: "Room sequence", sub: "atomic increment", stage: 1 },
      { id: "stomp", x: 735, y: 285, label: "STOMP/SockJS", stage: 2 },
      { id: "presence", x: 735, y: 95, label: "Presence", sub: "connect · disconnect", stage: 2 },
      { id: "room", x: 905, y: 285, label: "Room topic", stage: 2 },
      { id: "history", x: 905, y: 95, label: "History API", sub: "before / after cursor", stage: 3 },
      { id: "sync", x: 905, y: 390, label: "Reconnect sync", sub: "merge by ID + sequence", stage: 3 },
    ],
    edges: [
      { id: "c1", d: "M70 205 H225", stage: 0 },
      { id: "c2", d: "M225 205 H390", stage: 1 },
      { id: "c3", d: "M390 205 H470 V95 H555", stage: 1 },
      { id: "c4", d: "M390 205 H470 V285 H555", stage: 1 },
      { id: "c5", d: "M555 285 H735", stage: 2 },
      { id: "c6", d: "M735 285 H905", stage: 2 },
      { id: "c7", d: "M735 95 H905", stage: 2 },
      { id: "c8", d: "M555 95 H905", stage: 3 },
      { id: "c9", d: "M905 95 V390", stage: 3 },
      { id: "c10", d: "M905 390 H70 V205", stage: 3, muted: true },
    ],
  },
];

export default function ProjectSystemCanvas({ projectIndex, activeStage }) {
  const topology = topologies[projectIndex];
  if (!topology) return null;
  const activeEdges = topology.edges.filter(edge => edge.stage === activeStage && !edge.muted);
  const viewBox = projectIndex === 0 ? "0 0 1000 470" : "0 0 1000 440";

  return (
    <div className="system-canvas" role="img" aria-label={topology.label} data-active-stage={activeStage}>
      <div className="system-canvas-grid" aria-hidden="true" />
      <svg className="system-canvas-svg" viewBox={viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
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
              d={edge.d}
              className={`system-edge stage-${edge.stage}${edge.stage <= activeStage ? " reached" : ""}${edge.stage === activeStage ? " active" : ""}${edge.muted ? " muted" : ""}`}
            />
          ))}
        </g>
        <g className="system-packets">
          {activeEdges.slice(0, 3).map((edge, index) => (
            <circle key={edge.id} r="4" className="system-packet" filter={`url(#system-glow-${projectIndex})`}>
              <animateMotion dur={index === 0 ? "1.75s" : index === 1 ? "2.15s" : "2.5s"} begin={`-${index * .55}s`} repeatCount="indefinite" path={edge.d} />
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
      <div className="system-canvas-legend" aria-hidden="true"><span>request</span><span>durable state</span><span>async / AI flow</span></div>
    </div>
  );
}
