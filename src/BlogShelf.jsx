import { downloadBlogCard } from "./blogCardDownload";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Download, Linkedin, Search } from "lucide-react";

export const blogTopics = ["System Design", "LLD", "Design Patterns", "Backend", "Java", "Data", "Observability", "AI"];
export function LinkedInAction({ article }) {
  const url = article.linkedinUrl;
  if (url && /^https:\/\/(www\.)?linkedin\.com\/(posts\/|feed\/update\/|pulse\/)/.test(url)) {
    return <a className="bs-linkedin" href={url} target="_blank" rel="noopener noreferrer"><Linkedin size={15} /> Read on LinkedIn <ArrowUpRight size={14} /></a>;
  }
  if (article.linkedinPublished) return <span className="bs-published"><Linkedin size={15} /> Shared on LinkedIn</span>;
  const share = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://abhay-portfolioo.netlify.app/blog/${article.slug}`)}`;
  return <a className="bs-linkedin" href={share} target="_blank" rel="noopener noreferrer"><Linkedin size={15} /> Share on LinkedIn <ArrowUpRight size={14} /></a>;
}
function Illustration({ article }) {
  return <div className={`bs-art bs-art-${article.topic.toLowerCase()}`} aria-hidden="true">
    <div className="bs-art-top"><span>NOTE / {article.number}</span><span>● {article.topic}</span></div>
    <div className="bs-flow">{article.flow.map((label, i) => <div className="bs-node" key={label}><span className="bs-node-icon">{["{ }", "◈", "↗"][i]}</span><strong>{label}</strong></div>)}</div>
    <div className="bs-art-bottom"><span>ABHAY JAISWAL</span><span>ENGINEERING NOTES ↗</span></div>
  </div>;
}
function Card({ article }) {
  return <article className={`bs-card bs-tone-${Math.max(0, blogTopics.indexOf(article.topic))}`}>
    <Link className="bs-card-main" to={`/blog/${article.slug}`}><Illustration article={article} /><div className="bs-card-copy"><span className="bs-category">{article.topic} <span> / {article.readingTime}</span></span><h3>{article.title}</h3><p>{article.excerpt}</p><span className="bs-read">Read article <ArrowUpRight size={16} /></span></div></Link>
    <div className="bs-card-footer"><LinkedInAction article={article} /><button className="bs-download" onClick={() => downloadBlogCard(article)} aria-label={`Download card for ${article.title}`} title="Download card image"><Download size={16} /></button></div>
  </article>;
}
export function BlogShelf({ articles }) {
  const [topic, setTopic] = useState("All");
  const [query, setQuery] = useState("");
  const counts = Object.fromEntries(blogTopics.map(t => [t, articles.filter(a => (a.topic === t || (t === "Backend" && ["Security", "Delivery", "Frontend"].includes(a.topic)))).length]));
  const filtered = articles.filter(a => (topic === "All" || a.topic === topic || (topic === "Backend" && ["Security", "Delivery", "Frontend"].includes(a.topic))) && `${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  const chooseTopic = (value, scroll = false) => { setTopic(value); if (scroll) document.getElementById("blog-shelf").scrollIntoView({ block: "start" }); };
  return <div className="blog-studio wrap">
    <section className="bs-hero"><div><p className="bs-eyebrow">// NOTES FROM BUILDING</p><h1>Behind the code.<br /><span>Inside the decisions.</span><i aria-hidden="true">✦</i></h1><p className="bs-intro">System design, LLD, and patterns put into practice. Notes from my projects and my reading of Alex Xu and Alexander Shvets — the trade-offs, the failures, and the decisions behind the code.</p><div className="bs-stats"><span><b>{articles.length}</b> articles</span><span><b>{blogTopics.length}</b> topics</span><span><b>{articles.filter(a => a.linkedinPublished || a.linkedinUrl).length}</b> LinkedIn posts</span></div></div>
      <div className="bs-topics" aria-label="Filter articles by topic">{blogTopics.map((t, i) => <button key={t} className={`bs-orb bs-tone-${i}`} style={{"--i":i}} aria-pressed={topic === t} onClick={() => chooseTopic(topic === t ? "All" : t, true)}><strong>{t}</strong><span>{String(counts[t]).padStart(2,"0")}</span></button>)}<p>Explore a topic ↗</p></div>
    </section>
    {topic === "All" && !query && <section className="bs-featured" aria-labelledby="bs-featured-heading"><div className="bs-section-title"><div><p className="bs-eyebrow">// A GOOD PLACE TO START</p><h2 id="bs-featured-heading">From my workbench <span>✦</span></h2></div><span>Three ideas worth exploring</span></div><div className="bs-grid">{[articles[0], articles[1], articles[17]].map(a => <Card article={a} key={a.slug} />)}</div></section>}
    <section id="blog-shelf" aria-labelledby="bs-shelf-heading"><div className="bs-section-title"><div><p className="bs-eyebrow">// THE COLLECTION</p><h2 id="bs-shelf-heading">All engineering notes</h2></div><label className="bs-search"><Search size={17} /><input aria-label="Search articles" placeholder="Find a topic or idea…" value={query} onChange={e => setQuery(e.target.value)} type="search" /></label></div>
      <div className="bs-filters" aria-label="Article topics">{["All",...blogTopics].map(t => <button key={t} aria-pressed={topic === t} onClick={() => chooseTopic(t)}>{t}<sup>{t === "All" ? articles.length : counts[t]}</sup></button>)}</div>
      <p className="bs-result-count" role="status">{filtered.length} {filtered.length === 1 ? "article" : "articles"}{topic !== "All" ? ` in ${topic}` : " to explore"}</p>
      <div className="bs-grid">{filtered.map(a => <Card article={a} key={a.slug} />)}</div>
      {!filtered.length && <div className="bs-empty"><h3>No notes found</h3><p>Try another topic or search term.</p><button onClick={() => {setTopic("All");setQuery("");}}>Reset filters</button></div>}
    </section>
    <div className="bs-end"><span>Built, questioned, written down.</span><a href="https://www.linkedin.com/in/abhay983" target="_blank" rel="noopener noreferrer">Follow the conversation on LinkedIn <ArrowUpRight size={16} /></a></div>
  </div>;
}
