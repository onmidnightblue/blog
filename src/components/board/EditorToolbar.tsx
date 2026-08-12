"use client";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";

interface Props {
  editor: Editor | null;
}

interface ToolbarButtonProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Black", value: "#333333" },
  { label: "Gray", value: "#666666" },
  { label: "Red", value: "#bb3030" },
  { label: "Orange", value: "#c45c00" },
  { label: "Green", value: "#2f7a4f" },
  { label: "Blue", value: "#2563eb" },
  { label: "Purple", value: "#7c3aed" },
] as const;

const ToolbarButton = ({ label, isActive, onClick }: ToolbarButtonProps) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    className={`min-w-9 px-2 py-1.5 text-sm rounded-md border md:transition-colors md:duration-300 ${
      isActive
        ? "bg-foreground text-background border-foreground"
        : "text-foreground-muted border-foreground/15 md:hover:text-foreground md:hover:border-foreground/30"
    }`}
  >
    {label}
  </button>
);

const EditorToolbar = ({ editor }: Props) => {
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

  return (
    <div className="flex flex-wrap gap-2 p-3 border border-b-0 border-foreground/10 rounded-t-md bg-background">
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
        label="quote"
        isActive={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        label="code"
        isActive={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
      <div className="flex items-center gap-1.5 pl-2">
        {TEXT_COLORS.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            aria-label={`${label} color`}
            title={`${label} color`}
            onClick={() => applyColor(value)}
            className={`w-6 h-6 rounded-full border md:transition-transform md:duration-300 md:hover:scale-110 ${
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
          className="relative flex items-center justify-center w-8 h-8 rounded-md border cursor-pointer border-foreground/15 md:transition-colors md:duration-300 md:hover:border-foreground/30"
        >
          <span className="text-xs font-medium text-foreground-muted">#</span>
          <input
            type="color"
            value={currentColor || "#333333"}
            onChange={(event) => applyColor(event.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};

export default EditorToolbar;
