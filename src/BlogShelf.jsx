import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Linkedin, Search } from "lucide-react";

export const blogTopics = ["System Design", "LLD", "Design Patterns", "Backend", "Java", "Data", "Observability", "AI"];
export function LinkedInAction({ article }) {
  const url = article.linkedinUrl;
  if (url && /^https:\/\/(www\.)?linkedin\.com\/(posts\/|feed\/update\/|pulse\/)/.test(url)) {
    return <a className="bs-linkedin" href={url} target="_blank" rel="noopener noreferrer"><Linkedin size={15} /> Read on LinkedIn <ArrowUpRight size={14} /></a>;
  }
  return null;
}
function Illustration({ article }) {
  return <div className={`bs-art bs-art-${article.topic.toLowerCase()}`} aria-hidden="true">
    <div className="bs-art-top"><span>ENGINEERING NOTE</span><span>● {article.topic}</span></div>
    <div className="bs-flow">{article.flow.map((label, i) => <div className="bs-node" key={label}><span className="bs-node-icon">{["{ }", "◈", "↗"][i]}</span><strong>{label}</strong></div>)}</div>
    <div className="bs-art-bottom"><span>ABHAY JAISWAL</span><span>ENGINEERING NOTES ↗</span></div>
  </div>;
}
function Card({ article }) {
  return <article className="bs-card" data-topic={article.topic}>
    <Link className="bs-card-main" to={`/blog/${article.slug}`}><Illustration article={article} /><div className="bs-card-copy"><span className="bs-category">{article.topic} <span> / {article.readingTime}</span></span><h3>{article.title}</h3><p>{article.excerpt}</p><span className="bs-read">Read article <ArrowUpRight size={16} /></span></div></Link>
    {article.linkedinUrl && <div className="bs-card-footer"><LinkedInAction article={article} /></div>}
  </article>;
}
export function BlogShelf({ articles }) {
  const [topic, setTopic] = useState("All");
  const [query, setQuery] = useState("");
  const filtered = articles.filter(a => (topic === "All" || a.topic === topic || (topic === "Backend" && ["Security", "Delivery", "Frontend"].includes(a.topic))) && `${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  const chooseTopic = (value, scroll = false) => { setTopic(value); if (scroll) document.getElementById("blog-shelf").scrollIntoView({ block: "start" }); };
  return <div className="blog-studio wrap">
    <section className="bs-hero"><div><p className="bs-eyebrow">// NOTES FROM BUILDING</p><h1>Behind the code.<br /><span>Inside the decisions.</span><i aria-hidden="true">✦</i></h1><p className="bs-intro">System design, LLD, and patterns put into practice. Notes from my projects — the trade-offs, the failures, and the decisions behind the code.</p></div>
      <div className="bs-topics" aria-label="Filter articles by topic">{blogTopics.map((t, i) => <button key={t} className="bs-orb" data-topic={t} style={{"--i":i}} aria-pressed={topic === t} onClick={() => chooseTopic(topic === t ? "All" : t, true)}><strong>{t === "Observability" ? <>Observa<wbr />bility</> : t}</strong></button>)}<p>Explore a topic ↗</p></div>
    </section>
    <section id="blog-shelf" aria-label="Engineering articles"><div className="bs-section-title bs-toolbar">{topic !== "All" && <button className="bs-reset" onClick={() => chooseTopic("All")}>All topics <span aria-hidden="true">↗</span></button>}<label className="bs-search"><Search size={17} /><input aria-label="Search articles" placeholder="Find a topic or idea…" value={query} onChange={e => setQuery(e.target.value)} type="search" /></label></div>
      <div className="bs-grid">{filtered.map(a => <Card article={a} key={a.slug} />)}</div>
      {!filtered.length && <div className="bs-empty"><h3>No notes found</h3><p>Try another topic or search term.</p><button onClick={() => {setTopic("All");setQuery("");}}>Reset filters</button></div>}
    </section>
    <div className="bs-end"><span>Built, questioned, written down.</span><a href="https://www.linkedin.com/in/abhay983" target="_blank" rel="noopener noreferrer">Follow the conversation on LinkedIn <ArrowUpRight size={16} /></a></div>
  </div>;
}
