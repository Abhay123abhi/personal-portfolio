import { describe, expect, it } from "vitest";
import { matchesTopic, prepareArticles } from "./blogContent.js";

const post = {
  slug: "reliable-events",
  topic: "Backend",
  title: "Reliable Events",
  excerpt: "Testing event delivery",
  flow: ["Input", "Queue", "Result"],
  sections: [["Delivery", "Retries need idempotency."]],
};

describe("blog content validation", () => {
  it("rejects duplicate slugs", () => {
    expect(() => prepareArticles([post, { ...post }])).toThrow(/duplicate slug/);
  });
  it("validates article structure", () => {
    expect(() => prepareArticles([{ ...post, flow: ["one"] }])).toThrow(/flow/);
  });
  it("derives display metadata without changing source records", () => {
    const [article] = prepareArticles([post]);
    expect(article.category).toBe("Backend");
    expect(article.readingTime).toMatch(/min read/);
    expect(post).not.toHaveProperty("readingTime");
  });
  it("groups backend subtopics", () => {
    expect(matchesTopic({ topic: "Security" }, "Backend")).toBe(true);
    expect(matchesTopic({ topic: "Java" }, "Backend")).toBe(false);
    expect(matchesTopic({ topic: "Java" }, "All")).toBe(true);
  });
});
