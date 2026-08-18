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
    <div className="px-4 py-8 md:px-8 md:py-12">
      <BoardEditor
        postId={post.id}
        initialTitle={post.title}
        initialTags={post.tags.join(", ")}
        initialSummary={post.summary}
        initialContent={post.body ?? ""}
        pageTitle="Edit Post"
        pageDescription={post.title}
        backLink={{ href: "/", label: "← Back to Record" }}
        submitLabel="Update"
      />
    </div>
  );
}
