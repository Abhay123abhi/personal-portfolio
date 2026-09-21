import { articles } from "./blogArticles";
import { BlogShelf, LinkedInAction } from "./BlogShelf";
import "./blog.css";
import HomeV2, { V2Nav } from "./v2/HomeV2";
import PortfolioMotion from "./PortfolioMotion";
import { useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";

const EMAIL = "abhayjaiswal983@gmail.com";
function usePageTitle(title) {
  useEffect(() => { document.title = title; }, [title]);
}

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    let frame;
    let attempts = 0;
    const scroll = () => {
      if (!hash) { window.scrollTo(0, 0); return; }
      let id;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
      else if (++attempts < 30) frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);
  return null;
}

function Contact() {
  return <footer className="contact compact-contact" id="contact">
    <p>Let’s connect.</p>
    <a className="contact-email" href={`mailto:${EMAIL}`}>Email me <ArrowUpRight size={18} /></a>
  </footer>;
}

function BlogIndex() {
  usePageTitle("Blog — Abhay Jaiswal");
  return <main className="blog-route"><div className="blog-header"><V2Nav inner /></div><BlogShelf articles={articles} /></main>;
}

function ArticlePage() {
  const { slug } = useParams();
  const aliases = { "ai-incident-intelligence": "transactional-outbox-incident-investigation", "booking-concurrency-idempotency-design": "booking-concurrency-state-machine" };
  const article = articles.find((item) => item.slug === (aliases[slug] || slug));
  usePageTitle(article ? `${article.title} — Abhay Jaiswal` : "Blog");
  if (!article) return <Navigate to="/blog" replace />;

  return <main className="blog-route"><div className="blog-header"><V2Nav inner /></div><article className="article wrap"><Link className="back" to="/blog"><ArrowLeft size={16} /> Blog</Link><header><span>{article.category}</span><h1>{article.title}</h1><p>{article.excerpt}</p><div className="article-meta"><span>{article.published}</span><span><Clock3 size={15} /> {article.readingTime}</span><span>Abhay Jaiswal</span></div><LinkedInAction article={article} /></header><div className="article-body"><p className="lead">{article.lead}</p>{article.sections.map(([heading, ...paragraphs], index) => <section key={`${index}-${heading}`}><h2>{heading}</h2>{paragraphs.map((paragraph, pIndex) => <p key={pIndex}>{paragraph}</p>)}{index === 1 && article.quote && <blockquote>{article.quote}</blockquote>}</section>)}{article.sources && <section><h2>References &amp; project context</h2><ul>{article.sources.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ul></section>}</div></article><Contact /></main>;
}

export default function App() {
  return <><ScrollToTop /><PortfolioMotion /><Routes><Route path="/" element={<HomeV2 />} /><Route path="/blog" element={<BlogIndex />} /><Route path="/blog/:slug" element={<ArticlePage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></>;
}


