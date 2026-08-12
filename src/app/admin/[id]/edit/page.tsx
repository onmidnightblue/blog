import Link from "next/link";
import { notFound } from "next/navigation";
import BoardEditor from "@components/board/BoardEditor";
import { getBoardPostById } from "../../../../lib/board";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPage({ params }: Props) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId < 1) notFound();

  const post = await getBoardPostById(postId);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <header className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-paperozi text-3xl font-bold text-foreground">
            Edit Post
          </h1>
          <p className="mt-2 text-sm text-foreground-muted">{post.title}</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 text-sm text-foreground-muted border border-foreground/15 rounded-md md:transition-colors md:duration-300 md:hover:text-foreground md:hover:border-foreground/30"
        >
          Back to Board
        </Link>
      </header>
      <BoardEditor
        postId={post.id}
        initialTitle={post.title}
        initialTags={post.tags.join(", ")}
        initialSummary={post.summary}
        initialContent={post.body ?? ""}
        submitLabel="Update"
      />
    </div>
  );
}
