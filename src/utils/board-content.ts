import type { BoardPost, BoardPostContent } from "@types";

export const parseBoardContent = (content: string): BoardPostContent => {
  try {
    const parsed = JSON.parse(content) as Partial<BoardPostContent>;
    return {
      title: parsed.title ?? "",
      summary: parsed.summary ?? "",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      body: parsed.body ?? "",
    };
  } catch {
    return {
      title: "Untitled",
      summary: content.slice(0, 120),
      tags: [],
      body: content,
    };
  }
};

export const serializeBoardContent = (content: BoardPostContent) =>
  JSON.stringify(content);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const normalizeBoardBodyHtml = (html: string) =>
  html
    .replace(/<br[^>]*>/gi, "<br>")
    .replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "<p><br></p>");

export const formatBoardBodyHtml = (body: string) => {
  if (!body.trim()) return "";

  if (/<[a-z][\s\S]*>/i.test(body)) {
    return normalizeBoardBodyHtml(body);
  }

  return body
    .split("\n")
    .map((line) => `<p>${line ? escapeHtml(line) : "<br>"}</p>`)
    .join("");
};

export const toBoardPost = (row: {
  id: number;
  created_at: string;
  content: string;
}): BoardPost => {
  const parsed = parseBoardContent(row.content);

  return {
    id: String(row.id),
    title: parsed.title,
    summary: parsed.summary,
    tags: parsed.tags,
    publishedAt: row.created_at,
    body: parsed.body,
  };
};

export const toBoardPostListItem = (post: BoardPost): BoardPost => ({
  id: post.id,
  title: post.title,
  summary: post.summary,
  tags: post.tags,
  publishedAt: post.publishedAt,
});
