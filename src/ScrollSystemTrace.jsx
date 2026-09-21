export default function ScrollSystemTrace() {
  return (
    <aside className="scroll-system-trace" aria-hidden="true">
      <div className="scroll-trace-line"><span className="scroll-trace-progress" /><span className="scroll-trace-packet" /></div>
      <span className="scroll-trace-node trace-intro">01</span>
      <span className="scroll-trace-node trace-work">02</span>
      <span className="scroll-trace-node trace-experience">03</span>
      <span className="scroll-trace-node trace-skills">04</span>
    </aside>
  );
}
