import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import HomePage from "./pages/HomePage";
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
import PortfolioMotion from "./components/shared/PortfolioMotion";

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    let frame;
    let attempts = 0;

    const scroll = () => {
      if (!hash) {
        window.scrollTo(0, 0);
        return;
      }

      let id;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }

      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
      } else if (++attempts < 30) {
        frame = requestAnimationFrame(scroll);
      }
    };

    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <PortfolioMotion />
      <Suspense fallback={<main role="status" style={{ minHeight: "50vh", padding: "7rem 5vw", color: "#c9d7d4" }}>Loading page…</main>}><Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes></Suspense>
    </>
  );
}
