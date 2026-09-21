# Adding a blog article

All article content lives in `src/content/blog-posts.json`. You do not need to change React, CSS, routes, or metadata for a new article.

## Quick start

1. Run `npm run blog:new -- your-article-slug`.
2. Edit the new entry at the top of `src/content/blog-posts.json`. Replace all placeholder text before deploying. This is a local helper, not a publishing action.
3. Run `npm run blog:check` and `npm run build`.
4. Commit your content change and use the normal deployment process.

Alternatively, copy an existing object in that file, separate entries with commas, and give it a unique slug. Keep the outer array intact. JSON strings use double quotes; escape embedded quotes as `\"`. Do not use trailing commas.

## Copyable entry

```json
{
  "slug": "designing-a-notification-service",
  "topic": "System Design",
  "title": "Designing a notification service",
  "excerpt": "How I separate notification policy, delivery, and retries.",
  "published": "September 2026",
  "flow": ["Event", "Policy", "Channel"],
  "sections": [
    ["The problem", "Your first paragraph.", "An optional second paragraph."],
    ["The design", "Your explanation of the trade-offs."],
    ["What I learned", "Your outcome and next questions."]
  ],
  "featured": false,
  "linkedinUrl": null
}
```

## Fields

| Field | What to enter |
| --- | --- |
| `slug` | Unique lowercase words separated by hyphens. This becomes `/blog/your-slug`; keep it stable after publishing. |
| `topic` | System Design, LLD, Design Patterns, Backend, Java, Data, Observability, or AI. Security, Delivery, and Frontend are also supported and included in the Backend filter. |
| `title`, `excerpt` | Article title and short card/search-preview description. |
| `flow` | Exactly three short labels for the card diagram. |
| `sections` | Each array begins with a heading followed by one or more paragraphs. Add as many sections and paragraphs as needed. Plain text is rendered safely; HTML and Markdown are not parsed. |
| `published` | Optional date or label. Defaults to Blog. |
| `lead` | Optional introduction; defaults to the excerpt. |
| `category` | Optional detailed label on the article page; defaults to the topic. |
| `quote` | Optional callout after the second section. |
| `featured` | Optional boolean. The first three true entries in catalog order appear on the portfolio homepage. Set an older entry to false when replacing it. |
| `linkedinUrl` | Actual post URL after you publish on LinkedIn; otherwise omit it or use null. Only a valid post URL enables Read on LinkedIn. |
| `sources` | Optional list of `["Source label", "https://example.com/reference"]` pairs. |

Catalog order controls blog order. The helper inserts new articles first. Reading time is calculated automatically. Cards, search, existing topic filters/colours, article routes, homepage highlights, and static social-preview pages all use the same catalog.

`npm run blog:check` rejects duplicate/unsafe slugs, unknown topics, missing fields, malformed sections, and invalid links. New *topics* are a separate design change: update `src/blogContent.js` and the circle layout/colour rules in `src/blog.css`; adding articles under existing topics requires no such changes.
