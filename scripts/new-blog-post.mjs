import { readFile, writeFile } from 'node:fs/promises';
import { prepareArticles } from '../src/blogContent.js';
const file = new URL('../src/content/blog-posts.json', import.meta.url);
const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: npm run blog:new -- my-article-slug');
  process.exit(1);
}
const posts = JSON.parse(await readFile(file, 'utf8'));
if (posts.some(post => post.slug === slug)) {
  console.error(`An article with slug "${slug}" already exists. Nothing changed.`);
  process.exit(1);
}
const entry = {
  slug, topic: 'System Design', title: 'Replace with your article title',
  excerpt: 'Replace with a short description of the problem and what the reader will learn.',
  published: new Date().toISOString().slice(0, 10),
  flow: ['Request', 'Decision', 'Result'],
  sections: [['The problem', 'Describe the problem in your own words.'], ['The design', 'Explain your approach and the trade-offs.'], ['What I learned', 'Describe the outcome or what you would test.']],
  linkedinUrl: null
};
const next = [entry, ...posts];
prepareArticles(next);
await writeFile(file, JSON.stringify(next, null, 2) + '\n');
console.log(`Added ${slug} at the top of src/content/blog-posts.json. Edit the placeholder text before committing or deploying.`);
