import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BlogShelf } from "./BlogShelf.jsx";

const posts = [
  { slug: "distributed-design", topic: "System Design", title: "Distributed Design", excerpt: "Availability", category: "System Design", readingTime: "3 min read", flow: ["A","B","C"] },
  { slug: "java-contracts", topic: "Java", title: "Java Contracts", excerpt: "Interfaces", category: "Java", readingTime: "2 min read", flow: ["A","B","C"] }
];
const mount = () => render(<MemoryRouter><BlogShelf articles={posts}/></MemoryRouter>);

describe("BlogShelf", () => {
  it("renders cards with usable article links", () => {
    mount();
    expect(screen.getByRole("link", { name: /Distributed Design/i })).toHaveAttribute("href", "/blog/distributed-design");
    expect(screen.getByRole("link", { name: /Java Contracts/i })).toHaveAttribute("href", "/blog/java-contracts");
  });
  it("filters and resets search", () => {
    mount();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search articles" }), { target: { value: "interfaces" } });
    expect(screen.queryByRole("link", { name: /Distributed Design/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Java Contracts/i })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search articles" }), { target: { value: "missing" } });
    expect(screen.getByText("No notes found")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getByRole("link", { name: /Distributed Design/i })).toBeInTheDocument();
  });
});
