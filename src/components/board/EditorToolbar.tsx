"use client";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import axios from "axios";
import { useRef, useState } from "react";

interface Props {
  editor: Editor | null;
}

interface ToolbarButtonProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const TEXT_COLORS = [
  { label: "Default", value: "#333333" },
  { label: "Gray", value: "#666666" },
  { label: "Red", value: "#bb3030" },
  { label: "Green", value: "#2f7a4f" },
  { label: "Blue", value: "#2563eb" },
] as const;

const ToolbarButton = ({
  label,
  isActive,
  onClick,
  disabled,
}: ToolbarButtonProps) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    disabled={disabled}
    className={`min-w-9 rounded-md border px-2 py-1.5 text-sm md:transition-colors md:duration-300 disabled:opacity-50 ${
      isActive
        ? "border-foreground bg-foreground text-background"
        : "border-foreground/15 text-foreground-muted md:hover:border-foreground/30 md:hover:text-foreground"
    }`}
  >
    {label}
  </button>
);

const EditorToolbar = ({ editor }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const currentColor = useEditorState({
    editor,
    selector: ({ editor: activeEditor }) =>
      activeEditor?.getAttributes("textStyle").color ?? "",
  });

  if (!editor) return null;

  const applyColor = (color: string) => {
    if (!color) {
      editor.chain().focus().unsetColor().run();
      return;
    }

    editor.chain().focus().setColor(color).run();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post("/api/project/upload", formData);
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (error) {
      console.error(error);
      window.alert("Failed to upload image. Please try again later.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex w-min shrink-0 flex-col gap-2 border border-y-0 border-l-0 border-foreground/10 bg-background p-3">
      <ToolbarButton
        label="H2"
        isActive={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        label="H3"
        isActive={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <ToolbarButton
        label="text"
        isActive={editor.isActive("paragraph")}
        onClick={() => {
          editor.chain().focus().setParagraph().run();
          editor.chain().focus().unsetAllMarks().run();
        }}
      />
      <ToolbarButton
        label="_"
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        label="B"
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="I"
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="•"
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="1."
        isActive={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        label="''"
        isActive={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        label="</>"
        isActive={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
      <ToolbarButton
        label="img"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleImageUpload}
      />
      <div className="flex flex-col items-center gap-1.5">
        {TEXT_COLORS.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            aria-label={`${label} color`}
            title={`${label} color`}
            onClick={() => applyColor(value)}
            className={`h-6 w-6 rounded-full border md:transition-transform md:duration-300 md:hover:scale-110 ${
              currentColor === value
                ? "border-foreground ring-2 ring-foreground/20"
                : "border-foreground/15"
            }`}
            style={{
              backgroundColor: value || "var(--background)",
            }}
          />
        ))}
        <label
          aria-label="Custom color"
          title="Custom color"
          className="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-foreground/15 md:transition-colors md:duration-300 md:hover:border-foreground/30"
        >
          <span className="text-xs text-foreground-muted py-1.5 text-center">#</span>
          <input
            type="color"
            value={currentColor || "#333333"}
            onChange={(event) => applyColor(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </div>
    </div>
  );
};

export default EditorToolbar;
