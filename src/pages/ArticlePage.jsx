import { ArrowLeft, Clock3 } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { articles } from "../data/blogArticles";
import { LinkedInAction } from "../components/blog/BlogShelf";
import PortfolioNav from "../components/layout/PortfolioNav";
import ContactFooter from "../components/layout/ContactFooter";
import usePageTitle from "../hooks/usePageTitle";

const aliases = {
  "ai-incident-intelligence": "transactional-outbox-incident-investigation",
  "booking-concurrency-idempotency-design": "booking-concurrency-state-machine",
};

export default function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find(item => item.slug === (aliases[slug] || slug));

  usePageTitle(article ? `${article.title} — Abhay Jaiswal` : "Blog");

  if (!article) return <Navigate to="/blog" replace />;

  return (
    <main className="blog-route">
      <div className="blog-header"><PortfolioNav inner /></div>
      <article className="article wrap">
        <Link className="back" to="/blog"><ArrowLeft size={16} /> Blog</Link>
        <header>
          <span>{article.category}</span>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <div className="article-meta">
            <span>{article.published}</span>
            <span><Clock3 size={15} /> {article.readingTime}</span>
            <span>Abhay Jaiswal</span>
          </div>
          <LinkedInAction article={article} />
        </header>

        <div className="article-body">
          <p className="lead">{article.lead}</p>
          {article.sections.map(([heading, ...paragraphs], index) => (
            <section key={`${index}-${heading}`}>
              <h2>{heading}</h2>
              {paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
              {index === 1 && article.quote && <blockquote>{article.quote}</blockquote>}
            </section>
          ))}
          {article.sources && (
            <section>
              <h2>References &amp; project context</h2>
              <ul>
                {article.sources.map(([label, url]) => (
                  <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
      <ContactFooter />
    </main>
  );
}
