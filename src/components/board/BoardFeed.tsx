"use client";

import { useEffect, useRef } from "react";
import { SmallLoadingSpinner } from "@components/common";
import { useBoardPosts } from "@hooks";
import BoardList from "./BoardList";

const BoardFeed = () => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useBoardPosts();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <SmallLoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-8 text-sm text-center text-error">
        Failed to load posts. Please try again later.
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-dashed border-foreground/10 rounded-md">
        <p className="text-foreground">
          New records will be added here.
        </p>
      </div>
    );
  }

  return (
    <>
      <BoardList posts={posts} />
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <SmallLoadingSpinner />
        </div>
      )}
      {posts.length === 0 && (
        <p className="py-8 text-sm text-center text-foreground-muted">
          Empty.
        </p>
      )}
    </>
  );
};

export default BoardFeed;
