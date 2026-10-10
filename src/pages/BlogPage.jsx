import { articles } from "../data/blogArticles";
import { BlogShelf } from "../components/blog/BlogShelf";
import PortfolioNav from "../components/layout/PortfolioNav";
import usePageTitle from "../hooks/usePageTitle";

export default function BlogPage() {
  usePageTitle("Abhay Jaiswal | Engineering Blog");

  return (
    <main className="blog-route">
      <div className="blog-header"><PortfolioNav inner /></div>
      <BlogShelf articles={articles} />
    </main>
  );
}
