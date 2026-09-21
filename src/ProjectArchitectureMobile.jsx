function getFocusedViewBox(architecture, selected) {
  const [baseX = 0, baseY = 0, baseWidth = 1000, baseHeight = 420] =
    architecture.viewBox.split(/\s+/).map(Number);
  const nodes = architecture.nodes.filter(node => node.stage === selected);

  if (!nodes.length) return architecture.viewBox;

  const padX = 90;
  const padY = 72;
  const minWidth = 430;
  const minHeight = 250;

  let minX = Math.min(...nodes.map(node => node.x)) - padX;
  let maxX = Math.max(...nodes.map(node => node.x)) + padX;
  let minY = Math.min(...nodes.map(node => node.y)) - padY;
  let maxY = Math.max(...nodes.map(node => node.y)) + padY;

  const clampAxis = (min, max, minimum, baseMin, baseSize) => {
    if (max - min < minimum) {
      const center = (min + max) / 2;
      min = center - minimum / 2;
      max = center + minimum / 2;
    }

    const baseMax = baseMin + baseSize;

    if (min < baseMin) {
      max += baseMin - min;
      min = baseMin;
    }

    if (max > baseMax) {
      min -= max - baseMax;
      max = baseMax;
    }

    min = Math.max(baseMin, min);
    max = Math.min(baseMax, max);

    return [min, Math.max(1, max - min)];
  };

  const [x, width] = clampAxis(minX, maxX, minWidth, baseX, baseWidth);
  const [y, height] = clampAxis(minY, maxY, minHeight, baseY, baseHeight);

  return `${Math.round(x)} ${Math.round(y)} ${Math.round(width)} ${Math.round(height)}`;
}

export default function ProjectArchitectureMobile({ architecture, selected }) {
  const activeEdges = architecture.edges.filter(
    edge => edge.stage === selected && !edge.muted
  );
  const viewBox = getFocusedViewBox(architecture, selected);
  const filterId = `mobile-system-glow-${architecture.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="architecture-mobile-focused" role="img" aria-label={architecture.name}>
      <div className="system-canvas-grid" aria-hidden="true" />
      <svg
        className="architecture-mobile-focused-svg"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="system-edges">
          {architecture.edges.map(edge => (
            <path
              key={edge.id}
              d={edge.d}
              className={`system-edge stage-${edge.stage}${edge.stage <= selected ? " reached" : ""}${edge.stage === selected ? " active" : ""}${edge.muted ? " muted" : ""}`}
            />
          ))}
        </g>

        <g className="system-packets">
          {activeEdges.slice(0, 2).map((edge, index) => (
            <circle
              key={edge.id}
              r="3.6"
              className="system-packet"
              filter={`url(#${filterId})`}
            >
              <animateMotion
                dur={index ? "2.2s" : "1.8s"}
                begin={index ? "-.7s" : "0s"}
                repeatCount="indefinite"
                path={edge.d}
              />
            </circle>
          ))}
        </g>

        <g className="system-nodes">
          {architecture.nodes.map(node => {
            const state =
              node.stage < selected
                ? "reached"
                : node.stage === selected
                  ? "active"
                  : "pending";

            return (
              <g
                key={node.id}
                className={`system-node stage-${node.stage} ${state}`}
                transform={`translate(${node.x} ${node.y})`}
              >
                <rect x="-60" y="-24" width="120" height="48" rx="9" />
                <circle cx="-46" cy="-11" r="3" className="system-node-dot" />
                <text x="-36" y="-6" className="system-node-label">{node.label}</text>
                {node.sub && (
                  <text x="-36" y="10" className="system-node-sub">{node.sub}</text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
