import { articles } from "./blogArticles";
import { BlogShelf, LinkedInAction } from "./BlogShelf";
import "./blog.css";
import HomeV2 from "./v2/HomeV2";
import PortfolioMotion from "./PortfolioMotion";
import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Clock3, Github, Linkedin, Mail, Menu, Share2, X } from "lucide-react";

const EMAIL = "abhayjaiswal983@gmail.com";
const GITHUB = "https://github.com/Abhay123abhi";
const LINKEDIN = "https://www.linkedin.com/in/abhay983";
const TWITTER = "https://x.com/abhayjaissssss";


function usePageTitle(title) {
  useEffect(() => { document.title = title; }, [title]);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function SocialLinks() {
  return <div className="social-links" aria-label="Social and email links">
    <a href={`mailto:${EMAIL}`} aria-label="Gmail — email Abhay" title="Email Abhay"><Mail size={20} /></a>
    <a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin size={20} /></a>
    <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><Github size={20} /></a>
    <a href={TWITTER} target="_blank" rel="noreferrer" aria-label="X / Twitter" title="X / Twitter"><span aria-hidden="true" className="x-mark">𝕏</span></a>
  </div>;
}

function Header({ inner = false }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);

  return <header className="header">
    <Link className="brand" to="/" aria-label="Abhay Jaiswal, home"><span className="brand-symbol">a<span>j</span>.</span><b>Abhay Jaiswal</b></Link>
    <nav id="primary-navigation" className={open ? "nav open" : "nav"} aria-label="Primary navigation">
      {inner ? <><Link to="/">Portfolio</Link><Link to="/blog">Blog</Link></> : <><a href="#work" onClick={() => setOpen(false)}>Selected work</a><a href="#experience" onClick={() => setOpen(false)}>Experience</a><a href="#skills" onClick={() => setOpen(false)}>Stack</a><Link to="/blog">Blog</Link></>}
    </nav>
    <div className="header-actions"><div className="header-social"><SocialLinks /></div></div>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="primary-navigation">{open ? <X /> : <Menu />}</button>
  </header>;
}

function Contact() {
  return <footer className="contact compact-contact" id="contact">
    <p>Let’s connect.</p>
    <a className="contact-email" href={`mailto:${EMAIL}`}>Email me <ArrowUpRight size={18} /></a>
  </footer>;
}

function BlogIndex() {
  usePageTitle("Engineering notes — Abhay Jaiswal");
  return <main><Header inner /><BlogShelf articles={articles} /></main>;
}

function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === (slug === "ai-incident-intelligence" ? "transactional-outbox-incident-investigation" : slug));
  usePageTitle(article ? `${article.title} — Abhay Jaiswal` : "Engineering Journal");
  if (!article) return <Navigate to="/blog" replace />;

  return <main><Header inner /><article className="article wrap"><Link className="back" to="/blog"><ArrowLeft size={16} /> Journal</Link><header><span>{article.category}</span><h1>{article.title}</h1><p>{article.excerpt}</p><div className="article-meta"><span>{article.published}</span><span><Clock3 size={15} /> {article.readingTime}</span><span>Abhay Jaiswal</span></div><LinkedInAction article={article} /></header><div className="article-body"><p className="lead">{article.lead}</p>{article.sections.map((section, index) => <section key={section[0]}><h2>{section[0]}</h2><p>{section[1]}</p>{index === 1 && <blockquote>{article.quote}</blockquote>}<p>{section[2]}</p></section>)}{article.sources && <section><h2>References &amp; project context</h2><ul>{article.sources.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ul></section>}</div></article><Contact /></main>;
}

export default function App() {
  return <><ScrollToTop /><PortfolioMotion /><Routes><Route path="/" element={<HomeV2 />} /><Route path="/blog" element={<BlogIndex />} /><Route path="/blog/:slug" element={<ArticlePage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></>;
}


