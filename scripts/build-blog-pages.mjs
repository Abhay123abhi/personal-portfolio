import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { articles } from '../src/blogArticles.js';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const origin = 'https://abhay-portfolioo.netlify.app';
const shell = await readFile('dist/index.html','utf8');
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
<meta property="og:image:alt" content="Abhay Jaiswal — Engineering notes on system design, LLD, and backend development" />
<meta name="twitter:card" content="summary_large_image" />`;
  const fallback = `<main><a href="/blog">Engineering notes</a><article><h1>${escape(article.title)}</h1><p>${escape(article.lead)}</p>${article.sections.map(([heading,...paragraphs]) => `<section><h2>${escape(heading)}</h2>${paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}</section>`).join('')}</article></main>`;
  const html = shell.replace(/<title>.*?<\/title>/,`<title>${escape(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${escape(article.excerpt)}" />`)
    .replace('</head>',metadata+'\n</head>').replace('<div id="root"></div>',`<div id="root">${fallback}</div>`);
  await mkdir(`dist/blog/${article.slug}`,{recursive:true});
  await writeFile(`dist/blog/${article.slug}/index.html`,html);
}
console.log(`Generated ${articles.length} shareable article pages.`);
