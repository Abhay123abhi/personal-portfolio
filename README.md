# Personal portfolio

My React portfolio for selected projects, work experience, Blog, and the stack I use.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

The site is deployed on Netlify. SPA routes are handled by `public/_redirects`.

## Blog content

Add articles in `src/content/blog-posts.json`, or create a starter entry:

```bash
npm run blog:new -- my-new-article
npm run blog:check
npm run build
```

Edit the starter text before deploying. Cards, article pages, homepage highlights, and preview metadata update from this one catalog. See [Adding blog articles](docs/ADDING_BLOG_POSTS.md) for fields and examples.
