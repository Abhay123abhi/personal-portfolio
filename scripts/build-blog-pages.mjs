import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { articles } from '../src/data/blogArticles.js';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const origin = 'https://abhay-portfolioo.netlify.app';
const shell = await readFile('dist/index.html','utf8');
// Remove homepage-only metadata before injecting a unique article identity.
const articleShell = shell
  .replace(/<link rel="canonical"[^>]*>\s*/g, '')
  .replace(/<meta property="og:(?:type|title|description|url|image|image:alt)"[^>]*>\s*/g, '')
  .replace(/<meta name="twitter:(?:card|title|description|image)"[^>]*>\s*/g, '');
for (const article of articles) {
  const url = `${origin}/blog/${article.slug}`;
  const title = `${article.title} — Abhay Jaiswal`;
  const metadata = `<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${escape(title)}" />
<meta property="og:description" content="${escape(article.excerpt)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${origin}/blog-social.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Abhay Jaiswal — Blog on system design, LLD, and backend development" />
<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${escape(title)}" />\n<meta name="twitter:description" content="${escape(article.excerpt)}" />\n<meta name="twitter:image" content="${origin}/blog-social.png" />`;
  const fallback = `<main><a href="/blog">Blog</a><article><h1>${escape(article.title)}</h1><p>${escape(article.lead)}</p>${article.sections.map(([heading,...paragraphs]) => `<section><h2>${escape(heading)}</h2>${paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}</section>`).join('')}</article></main>`;
  const html = articleShell.replace(/<title>.*?<\/title>/,`<title>${escape(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${escape(article.excerpt)}" />`)
    .replace('</head>',metadata+'\n</head>').replace('<div id="root"></div>',`<div id="root">${fallback}</div>`);
  await mkdir(`dist/blog/${article.slug}`,{recursive:true});
  await writeFile(`dist/blog/${article.slug}/index.html`,html);
}
console.log(`Generated ${articles.length} shareable article pages.`);
