"use client";

import { useEffect, useState } from "react";
import type { BoardHeading } from "@types";

interface Props {
  headings: BoardHeading[];
  scrollRootRef: React.RefObject<HTMLDivElement | null>;
}

export default function BoardTableOfContents({ headings, scrollRootRef }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const root = scrollRootRef.current;
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              elements.indexOf(a.target as HTMLElement) -
              elements.indexOf(b.target as HTMLElement),
          );

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root,
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings, scrollRootRef]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="board-toc sticky top-6 max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground-muted">
        On this page
      </p>
      <ol className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block text-sm leading-snug md:transition-colors md:duration-300 ${
                heading.level === 3 ? "pl-3" : ""
              } ${
                activeId === heading.id
                  ? "font-medium text-foreground"
                  : "text-foreground-muted md:hover:text-foreground"
              }`}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
