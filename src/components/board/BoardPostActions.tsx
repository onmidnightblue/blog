"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BoardPost } from "@types";
import { useBoardMutations } from "@hooks";

interface Props {
  post: BoardPost;
}

const BoardPostActions = ({ post }: Props) => {
  const router = useRouter();
  const { deletePost } = useBoardMutations();

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      await deletePost.mutateAsync(post.id);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Failed to delete. Please try again later.");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Link
        href={`/admin/${post.id}/edit`}
        className="px-3 py-1.5 text-xs font-medium text-foreground border border-foreground/15 rounded-md md:transition-colors md:duration-300 md:hover:border-foreground/30"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deletePost.isPending}
        className="px-3 py-1.5 text-xs font-medium text-error border border-error/20 rounded-md disabled:opacity-50 md:transition-colors md:duration-300 md:hover:border-error/40"
      >
        {deletePost.isPending ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

export default BoardPostActions;
