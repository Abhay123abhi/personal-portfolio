import posts from './content/blog-posts.json' with { type: 'json' };
import { prepareArticles } from './blogContent.js';

export const articles = prepareArticles(posts);
export const featuredArticles = articles.filter(article => article.featured).slice(0, 3)
  .map(article => ({ ...article, href: `/blog/${article.slug}` }));
export { blogTopics } from './blogContent.js';
