const routes = [
  "M90 150 C260 70 420 95 560 205 S900 330 1110 210 S1390 120 1540 220",
  "M-40 430 C180 360 320 500 500 430 S830 270 1040 430 S1330 570 1650 430",
  "M120 760 C310 630 500 690 650 790 S970 930 1160 760 S1400 640 1580 730",
  "M330 -40 C290 160 390 300 330 500 S210 780 360 1060",
  "M1180 -80 C1110 130 1240 300 1180 500 S1060 820 1220 1060",
];

const nodes = [
  [90, 150], [300, 118], [560, 205], [850, 315], [1110, 210], [1370, 155], [1540, 220],
  [120, 405], [500, 430], [760, 340], [1040, 430], [1320, 520], [1510, 455],
  [120, 760], [390, 660], [650, 790], [930, 880], [1160, 760], [1400, 665],
  [330, 250], [330, 500], [310, 800], [1180, 210], [1180, 500], [1150, 810],
];

const packets = [
  { route: routes[0], duration: "13s", delay: "-2s" },
  { route: routes[1], duration: "16s", delay: "-7s" },
  { route: routes[2], duration: "15s", delay: "-4s" },
  { route: routes[3], duration: "18s", delay: "-10s" },
  { route: routes[4], duration: "19s", delay: "-5s" },
];

export default function AmbientSystemBackground() {
  return (
    <div className="ambient-system" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-orb ambient-orb-a" />
      <div className="ambient-orb ambient-orb-b" />
      <div className="ambient-scan" />
      <div className="ambient-code ambient-code-a"><span>@Transactional</span><span>incident.save(...)</span><span>outbox.publish(...)</span></div>
      <div className="ambient-code ambient-code-b"><span>Guardian ─┐</span><span>NYT ──────┼→ normalize → Redis</span><span>Gemini ← grounded feed</span></div>
      <div className="ambient-code ambient-code-c"><span>POST /messages</span><span>MongoDB → STOMP</span><span>cursor → reconnect sync</span></div>
      <svg className="ambient-network" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <g className="ambient-routes">
          {routes.map((route, index) => (
            <path key={route} d={route} className={`ambient-route ambient-route-${index + 1}`} />
          ))}
        </g>
        <g className="ambient-nodes">
          {nodes.map(([cx, cy], index) => (
            <g key={`${cx}-${cy}`} className={`ambient-node ambient-node-${(index % 4) + 1}`}>
              <circle cx={cx} cy={cy} r="3.5" />
              <circle className="ambient-node-ring" cx={cx} cy={cy} r="9" />
            </g>
          ))}
        </g>
        <g className="ambient-packets">
          {packets.map((packet, index) => (
            <circle key={packet.route} className={`ambient-packet ambient-packet-${index + 1}`} r="3.5">
              <animateMotion
                dur={packet.duration}
                begin={packet.delay}
                repeatCount="indefinite"
                path={packet.route}
              />
            </circle>
          ))}
        </g>
      </svg>
    </div>
  );
}
