"use client";

import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { FormEvent, useState } from "react";
import { useBoardMutations } from "@hooks";
import { normalizeBoardBodyHtml } from "@utils";
import AdminEditorHeader from "@components/admin/AdminEditorHeader";
import EditorToolbar from "./EditorToolbar";

interface Props {
  postId?: string;
  initialTitle?: string;
  initialTags?: string;
  initialSummary?: string;
  initialContent?: string;
  submitLabel?: string;
  formId?: string;
  backLink?: {
    href: string;
    label: string;
  };
  pageTitle?: string;
  pageDescription?: string;
}

const BoardEditor = ({
  postId,
  initialTitle = "",
  initialTags = "",
  initialSummary = "",
  initialContent = "",
  submitLabel = "Save",
  formId = "board-editor-form",
  backLink,
  pageTitle,
  pageDescription,
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
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
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
    <>
      {backLink ? (
        <AdminEditorHeader
          pageTitle={pageTitle}
          pageDescription={pageDescription}
          backLink={backLink}
          formId={formId}
          submitButtonLabel={isSubmitting ? "Saving..." : submitLabel}
          isSubmitting={isSubmitting}
          innerClassName="mx-auto w-full max-w-4xl"
        />
      ) : null}

      <form
        id={formId}
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-4xl flex-col gap-6"
      >
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
          className="w-full rounded-md border border-foreground/15 px-4 py-3 text-base md:transition-colors md:duration-300 md:focus:border-foreground"
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
          className="w-full resize-none rounded-md border border-foreground/15 px-4 py-3 text-base md:transition-colors md:duration-300 md:focus:border-foreground"
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
          className="w-full rounded-md border border-foreground/15 px-4 py-3 text-base md:transition-colors md:duration-300 md:focus:border-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Body</label>
        <div className="flex overflow-hidden rounded-md border border-foreground/10">
          <div className="w-min shrink-0">
            <EditorToolbar editor={editor} />
          </div>
          <div className="min-w-0 flex-1">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {!backLink ? (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:opacity-50 md:transition-colors md:duration-300 md:hover:bg-foreground/90"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      ) : null}
    </form>
    </>
  );
};

export default BoardEditor;
