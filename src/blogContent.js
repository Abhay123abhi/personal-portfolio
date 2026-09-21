// Display topics and accepted subtopics are maintained in one place.
export const blogTopics = ['System Design', 'LLD', 'Design Patterns', 'Backend', 'Java', 'Data', 'Observability', 'AI'];
const subtopics = ['Security', 'Delivery', 'Frontend'];
export function matchesTopic(article, topic) {
  return topic === 'All' || article.topic === topic || (topic === 'Backend' && subtopics.includes(article.topic));
}
export function prepareArticles(posts) {
  if (!Array.isArray(posts)) throw new Error('Blog catalog must be an array.');
  const slugs = new Set();
  return posts.map((post, index) => {
    const fail = message => { throw new Error(`Blog entry ${post.slug || index + 1}: ${message}`); };
    for (const field of ['slug', 'topic', 'title', 'excerpt']) {
      if (typeof post[field] !== 'string' || !post[field].trim()) fail(`${field} is required.`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) fail('slug must contain lowercase words separated by hyphens.');
    if (slugs.has(post.slug)) fail('duplicate slug.');
    slugs.add(post.slug);
    if (![...blogTopics, ...subtopics].includes(post.topic)) fail('choose a documented topic.');
    if (!Array.isArray(post.flow) || post.flow.length !== 3 || post.flow.some(v => typeof v !== 'string' || !v.trim())) fail('flow needs three short text labels.');
    if (!Array.isArray(post.sections) || !post.sections.length || post.sections.some(section => !Array.isArray(section) || section.length < 2 || section.some(v => typeof v !== 'string' || !v.trim()))) fail('each section needs a heading and at least one paragraph.');
    for (const key of ['category', 'lead', 'quote', 'published']) if (post[key] != null && typeof post[key] !== 'string') fail(`${key} must be text.`);
    if (post.featured != null && typeof post.featured !== 'boolean') fail('featured must be true or false.');
    if (post.linkedinUrl && !/^https:\/\/(www\.)?linkedin\.com\/(posts\/|feed\/update\/|pulse\/)[^\s]+$/.test(post.linkedinUrl)) fail('linkedinUrl must be an actual LinkedIn post/article URL.');
    if (post.sources != null && (!Array.isArray(post.sources) || post.sources.some(ref => !Array.isArray(ref) || ref.length !== 2 || typeof ref[0] !== 'string' || !ref[0].trim() || typeof ref[1] !== 'string' || !/^https?:\/\/[^\s]+$/.test(ref[1])))) fail('sources must be [label, http(s) URL] pairs.');
    const lead = post.lead || post.excerpt;
    const words = [lead, ...post.sections.flat(), post.quote || ''].join(' ').trim().split(/\s+/).length;
    return { ...post, category: post.category || post.topic, lead, published: post.published || 'Blog', readingTime: `${Math.max(1, Math.ceil(words / 200))} min read` };
  });
}
