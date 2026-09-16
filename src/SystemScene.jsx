import { useEffect, useRef } from "react";

// Original SVG illustration: conceptual architecture, never simulated production metrics.
export default function SystemScene() {
  const ref = useRef(null);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      ref.current?.classList.toggle("scene-visible", entry.isIntersecting);
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const paths = [
    "M140 120 H228",
    "M384 120 H418 Q438 120 438 100 V54 Q438 42 450 42 H498",
    "M384 120 H498",
    "M384 120 H418 Q438 120 438 140 V186 Q438 198 450 198 H498",
  ];
  return <figure className="system-scene scene-visible" ref={ref}>
    <figcaption><span><i aria-hidden="true" /> Inside the backend</span><span>Conceptual flow</span></figcaption>
    <div className="system-scene-scroll" tabIndex={0} role="region" aria-label="Backend architecture illustration — scroll horizontally on small screens">
      <svg viewBox="0 0 670 245" role="img" aria-label="Requests enter a Spring Boot API, which connects to a Redis cache, PostgreSQL database, and Kafka events.">
        <g className="circuit-tracks" fill="none">{paths.map(path => <path key={path} d={path} />)}</g>
        <g className="circuit-packets" fill="none">{paths.map((path, index) => <path key={path} d={path} pathLength="100" style={{ animationDelay: `${index * -.9}s` }} />)}</g>
        <g className="scene-node" transform="translate(14 91)"><rect width="126" height="58" rx="10" /><text x="63" y="24">REST requests</text><text className="node-caption" x="63" y="43">web / mobile</text></g>
        <g className="scene-node scene-core" transform="translate(228 77)"><rect width="156" height="86" rx="12" /><text className="node-symbol" x="78" y="25">&#123; &#125;</text><text x="78" y="48">Spring Boot</text><text className="node-caption" x="78" y="68">API · business logic</text></g>
        <g className="scene-node" transform="translate(498 14)"><rect width="150" height="56" rx="10" /><text x="75" y="24">Redis</text><text className="node-caption" x="75" y="42">cache</text></g>
        <g className="scene-node" transform="translate(498 92)"><rect width="150" height="56" rx="10" /><text x="75" y="24">PostgreSQL</text><text className="node-caption" x="75" y="42">durable state</text></g>
        <g className="scene-node" transform="translate(498 170)"><rect width="150" height="56" rx="10" /><text x="75" y="24">Kafka</text><text className="node-caption" x="75" y="42">async events</text></g>
        <text className="wire-label" x="183" y="108">HTTPS</text>
      </svg>
    </div>
    <div className="scene-footer"><span>Request → process → persist → publish</span><span>Java / Spring / Kafka</span></div>
  </figure>;
}
