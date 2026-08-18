"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BoardPostActions from "@components/board/BoardPostActions";
import BoardRelatedPosts from "@components/board/BoardRelatedPosts";
import BoardTableOfContents from "@components/board/BoardTableOfContents";
import { PAGE_PADDING, PAGE_PADDING_X } from "@components/layout/PageShell";
import type { BoardHeading, BoardPost, BoardPostSummary } from "@types";

type BoardDetailViewProps = {
  post: BoardPost;
  formattedDate: string;
  bodyHtml: string | null;
  headings: BoardHeading[];
  relatedPosts: BoardPostSummary[];
  isAdmin: boolean;
};

export default function BoardDetailView({
  post,
  formattedDate,
  bodyHtml,
  headings,
  relatedPosts,
  isAdmin,
}: BoardDetailViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [showFixedBar, setShowFixedBar] = useState(false);

  useEffect(() => {
    const root = scrollRef.current;
    const target = titleRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFixedBar(!entry.isIntersecting);
      },
      { root, threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        className={`fixed top-14 md:top-0 left-0 md:left-60 right-0 z-30 border-b border-foreground/5 bg-background py-3 transition-opacity duration-200 ${PAGE_PADDING_X} ${
          showFixedBar
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showFixedBar}
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            tabIndex={showFixedBar ? 0 : -1}
            className="shrink-0 text-sm text-foreground-muted md:transition-colors md:duration-300 md:hover:text-foreground"
          >
            ← Back to Record
          </Link>
          <p className="min-w-0 truncate text-right text-sm font-medium text-foreground">
            {post.title}
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className={PAGE_PADDING}>
          <Link
            href="/"
            className="mb-8 inline-block text-sm text-foreground-muted md:transition-colors md:duration-300 md:hover:text-foreground"
          >
            ← Back to Record
          </Link>

          <div className="relative">
            {headings.length > 0 && (
              <aside className="pointer-events-none absolute right-0 top-0 hidden w-52 xl:block">
                <div className="pointer-events-auto">
                  <BoardTableOfContents
                    headings={headings}
                    scrollRootRef={scrollRef}
                  />
                </div>
              </aside>
            )}

            <article className={headings.length > 0 ? "xl:pr-60" : undefined}>
              <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <time
                    dateTime={post.publishedAt}
                    className="text-xs text-foreground-muted"
                  >
                    {formattedDate}
                  </time>
                  <h1
                    ref={titleRef}
                    className="mt-2 font-paperozi text-3xl font-bold break-keep text-foreground"
                  >
                    {post.title}
                  </h1>
                  {post.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <li
                          key={`${tag}-${index}`}
                          className="rounded-full border border-foreground/15 px-2 py-0.5 text-xs text-foreground-muted"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {isAdmin && (
                  <div className="shrink-0">
                    <BoardPostActions post={post} />
                  </div>
                )}
              </header>

              {bodyHtml ? (
                <div
                  className="board-post-content break-all"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              ) : (
                <p className="text-sm text-foreground-muted">No content.</p>
              )}

              <BoardRelatedPosts posts={relatedPosts} />
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
