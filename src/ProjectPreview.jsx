import { Activity, ArrowUpRight, Check, Database, FileText, GitBranch, Layers, MessageSquare, Search, ShieldCheck } from "lucide-react";

// These are illustrative workflows, not screenshots or live production telemetry.
const previewNames = ["Incident investigation", "News intelligence", "Room messaging"];

function IncidentPreview() {
  return <div className="incident-preview">
    <div className="preview-intro"><span className="preview-overline">From signal to context</span><h4>One alert.<br /> Connected evidence.</h4><p>Metrics, logs, and traces.<br />One persistent investigation.</p></div>
    <div className="evidence-report">
      <div className="evidence-heading"><span className="preview-icon"><Activity size={18} /></span><div><strong>Incident report</strong><span>Evidence collection workflow</span></div><ShieldCheck size={19} /></div>
      <div className="evidence-sources">
        {[[Activity, "Metrics", "Prometheus"], [FileText, "Logs", "Loki"], [GitBranch, "Traces", "Tempo"]].map(([Icon, label, source]) => <div key={label}><Icon size={16} /><span>{label}<small>{source}</small></span><Check size={13} /></div>)}
      </div>
      <div className="evidence-footer"><Database size={13} /><span>Persisted in PostgreSQL</span><span className="preview-signal" /></div>
    </div>
  </div>;
}

function NewsPreview() {
  return <div className="news-preview">
    <div className="news-preview-header"><span className="preview-overline">Many sources. One perspective.</span><h4>A clearer view<br /> of the news.</h4></div>
    <div className="news-workspace">
      <div className="preview-search"><Search size={15} /><span>Explore a topic across publishers</span><ArrowUpRight size={14} /></div>
      <div className="news-preview-grid">
        <div className="publisher-cards"><div><span>The Guardian</span><strong>Discover the story.</strong><div className="preview-lines" aria-hidden="true"><i /><i /></div></div><div><span>The New York Times</span><strong>Compare perspectives.</strong><div className="preview-lines" aria-hidden="true"><i /><i /></div></div></div>
        <div className="brief-preview"><Layers size={19} /><span className="preview-overline">Grounded in sources</span><strong>Read less.<br />Understand more.</strong><p>Summaries, answers, and coverage comparison.</p><span className="brief-source"><Check size={12} /> Retrieved articles</span></div>
      </div>
    </div>
  </div>;
}

function ChatPreview() {
  return <div className="chat-preview">
    <div className="preview-intro"><span className="preview-overline">Built to stay in sync</span><h4>Every message.<br /> A durable path.</h4><p>Live conversation.<br />History that survives a reconnect.</p></div>
    <div className="conversation-preview"><div className="conversation-header"><span className="preview-icon"><MessageSquare size={17} /></span><div><strong>Project room</strong><span>Illustrative conversation</span></div><span className="preview-signal" /></div>
      <div className="conversation-messages"><div className="message-in"><small>Teammate</small><p>Can you share the latest update?</p></div><div className="message-out"><p>Yes, the changes are ready to review.</p><small><Check size={11} /> Saved to history</small></div></div>
      <div className="conversation-footer"><ShieldCheck size={13} /><span>Persist → deliver → recover</span></div>
    </div>
  </div>;
}

export default function ProjectPreview({ index }) {
  const Preview = [IncidentPreview, NewsPreview, ChatPreview][index];
  return <figure className={`project-preview preview-${index}`} aria-label={`${previewNames[index]} workflow illustration`}>
    <div className="preview-chrome"><span><i /><i /><i /></span><span>{previewNames[index]}</span><span>Workflow illustration</span></div>
    <Preview />
  </figure>;
}
