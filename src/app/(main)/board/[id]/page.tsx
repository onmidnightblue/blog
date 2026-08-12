import Link from "next/link";
import { notFound } from "next/navigation";
import BoardPostActions from "@components/board/BoardPostActions";
import { auth } from "@auth";
import { isAdminEmail } from "@lib";
import { getBoardPostById } from "../../../../lib/board";
import { formatBoardBodyHtml } from "@utils";

interface Props {
  params: Promise<{ id: string }>;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default async function BoardDetailPage({ params }: Props) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId < 1) notFound();

  const post = await getBoardPostById(postId);
  if (!post) notFound();

  const session = await auth();
  const isAdmin = session ? await isAdminEmail(session.user?.email) : false;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="px-4 py-8 md:px-12 md:py-12 max-w-3xl mx-auto">
      <Link
        href="/"
        className="inline-block mb-8 text-sm text-foreground-muted md:transition-colors md:duration-300 md:hover:text-foreground"
      >
        ← Board
      </Link>

      <article>
        <header className="flex flex-col gap-4 mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <time
              dateTime={post.publishedAt}
              className="text-xs text-foreground-muted"
            >
              {formatDate(post.publishedAt)}
            </time>
            <h1 className="mt-2 font-paperozi text-3xl font-bold text-foreground break-keep">
              {post.title}
            </h1>
            {post.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag, index) => (
                  <li
                    key={`${tag}-${index}`}
                    className="px-2 py-0.5 text-xs text-foreground-muted border border-foreground/15 rounded-full"
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

        {post.body ? (
          <div
            className="board-post-content"
            dangerouslySetInnerHTML={{
              __html: formatBoardBodyHtml(post.body),
            }}
          />
        ) : (
          <p className="text-sm text-foreground-muted">No content.</p>
        )}
      </article>
      </div>
    </div>
  );
}
