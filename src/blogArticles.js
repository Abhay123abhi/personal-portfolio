import posts from './content/blog-posts.json' with { type: 'json' };
import { prepareArticles } from './blogContent.js';

export const articles = prepareArticles(posts);
export { blogTopics } from './blogContent.js';
