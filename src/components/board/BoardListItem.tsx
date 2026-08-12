import Link from "next/link";
import type { BoardPost } from "@types";

interface Props {
  post: BoardPost;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const BoardListItem = ({ post }: Props) => {
  return (
    <article className="py-6 border-b border-foreground/10 last:border-b-0">
      <Link href={`/board/${post.id}`} className="block group">
        <time
          dateTime={post.publishedAt}
          className="text-xs text-foreground-muted"
        >
          {formatDate(post.publishedAt)}
        </time>
        <h2 className="mt-2 font-paperozi text-xl font-bold text-foreground">
          <span className="md:inline-block md:border-b md:border-b-transparent md:pb-1 md:transition-[border-color] md:duration-300 md:ease-in-out md:group-hover:border-b-foreground/30">
            {post.title}
          </span>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground-muted whitespace-pre-line md:transition-colors md:duration-300 md:ease-in-out md:group-hover:text-foreground/80">
          {post.summary}
        </p>
        <ul className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag, index) => (
            <li
              key={`${tag}-${index}`}
              className="px-2 py-0.5 text-xs text-foreground-muted border border-foreground/15 rounded-full md:transition-[border-color,color] md:duration-300 md:ease-in-out md:group-hover:border-foreground/30 md:group-hover:text-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </article>
  );
};

export default BoardListItem;
