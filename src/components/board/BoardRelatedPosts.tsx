import Link from "next/link";
import type { BoardPostSummary } from "@types";

interface Props {
  posts: BoardPostSummary[];
}

export default function BoardRelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-foreground/10 pt-10">
      <h2 className="font-paperozi text-lg font-bold text-foreground">
        Read More Posts
      </h2>
      <ul className="mt-4 space-y-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/board/${post.id}`}
              className="text-sm text-link underline underline-offset-2 md:transition-colors md:duration-300 md:hover:text-link-hover"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
