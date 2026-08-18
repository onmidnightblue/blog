import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BoardDetailView from "@components/board/BoardDetailView";
import { auth } from "@auth";
import { isAdminEmail } from "@lib";
import {
  getBoardPostById,
  getBoardRelatedPosts,
} from "../../../../lib/board";
import {
  formatBoardBodyForView,
} from "@utils";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId < 1) {
    return { title: "Record" };
  }

  const post = await getBoardPostById(postId);
  if (!post) {
    return { title: "Record" };
  }

  const description =
    post.summary.trim() ||
    post.tags.join(", ") ||
    "Deep Blue Board Record";

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description,
    },
  };
}

export default async function BoardDetailPage({ params }: Props) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId < 1) notFound();

  const post = await getBoardPostById(postId);
  if (!post) notFound();

  const session = await auth();
  const isAdmin = session ? await isAdminEmail(session.user?.email) : false;

  const [{ html, headings }, relatedPosts] = await Promise.all([
    post.body ? formatBoardBodyForView(post.body) : Promise.resolve({ html: "", headings: [] }),
    getBoardRelatedPosts(postId),
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BoardDetailView
        post={post}
        formattedDate={formatDate(post.publishedAt)}
        bodyHtml={html || null}
        headings={headings}
        relatedPosts={relatedPosts}
        isAdmin={isAdmin}
      />
    </div>
  );
}
