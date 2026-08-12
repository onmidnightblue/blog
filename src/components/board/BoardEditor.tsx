"use client";

import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { FormEvent, useState } from "react";
import { useBoardMutations } from "@hooks";
import { normalizeBoardBodyHtml } from "@utils";
import EditorToolbar from "./EditorToolbar";

interface Props {
  postId?: string;
  initialTitle?: string;
  initialTags?: string;
  initialSummary?: string;
  initialContent?: string;
  submitLabel?: string;
}

const BoardEditor = ({
  postId,
  initialTitle = "",
  initialTags = "",
  initialSummary = "",
  initialContent = "",
  submitLabel = "Save",
}: Props) => {
  const router = useRouter();
  const { createPost, updatePost } = useBoardMutations();
  const [title, setTitle] = useState(initialTitle);
  const [tags, setTags] = useState(initialTags);
  const [summary, setSummary] = useState(initialSummary);
  const isSubmitting = createPost.isPending || updatePost.isPending;

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleKit.configure({
        backgroundColor: false,
        fontFamily: false,
        fontSize: false,
        lineHeight: false,
      }),
      Placeholder.configure({
        placeholder: "Write your content...",
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "board-editor-content",
      },
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editor) return;

    const payload = {
      title: title.trim(),
      summary: summary.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      body: normalizeBoardBodyHtml(editor.getHTML()),
    };

    try {
      if (postId) {
        await updatePost.mutateAsync({ id: postId, payload });
      } else {
        await createPost.mutateAsync(payload);
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Failed to save. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter a title"
          className="w-full px-4 py-3 text-base border border-foreground/15 rounded-md md:transition-colors md:duration-300 md:focus:border-foreground"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="summary" className="text-sm font-medium text-foreground">
          Summary
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder="One-line summary for the list"
          rows={2}
          className="w-full px-4 py-3 text-base border border-foreground/15 rounded-md resize-none md:transition-colors md:duration-300 md:focus:border-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="tags" className="text-sm font-medium text-foreground">
          Tags
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="Frontend, Next.js (comma-separated)"
          className="w-full px-4 py-3 text-base border border-foreground/15 rounded-md md:transition-colors md:duration-300 md:focus:border-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Body</label>
        <div className="border border-foreground/10 rounded-md overflow-hidden">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-background bg-foreground rounded-md disabled:opacity-50 md:transition-colors md:duration-300 md:hover:bg-foreground/90"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default BoardEditor;
