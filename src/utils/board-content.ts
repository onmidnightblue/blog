import type { BoardHeading, BoardPost, BoardPostContent } from "@types";

export const parseBoardContent = (content: string): BoardPostContent => {
  try {
    const parsed = JSON.parse(content) as Partial<BoardPostContent> & {
      status?: string;
      draft?: Partial<BoardPostContent>;
    };

    const draft = parsed.draft;
    const useDraft =
      parsed.status === "draft" &&
      draft &&
      !parsed.title?.trim() &&
      draft.title?.trim();

    const source = useDraft ? draft : parsed;

    return {
      title: source.title ?? "",
      summary: source.summary ?? "",
      tags: Array.isArray(source.tags) ? source.tags : [],
      body: source.body ?? "",
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

export const addBoardHeadingIds = (html: string) => {
  const headings: BoardHeading[] = [];
  let h2Count = 0;
  let h3Count = 0;

  const enrichedHtml = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attrs, inner) => {
      if (/\bid\s*=/.test(attrs)) return match;

      const id =
        level === "2"
          ? `heading-h2-${++h2Count}`
          : `heading-h3-${++h3Count}`;
      const text = inner.replace(/<[^>]+>/g, "").trim();

      if (text) {
        headings.push({
          id,
          text,
          level: Number(level) as 2 | 3,
        });
      }

      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: enrichedHtml, headings };
};

const decodeHtml = (value: string) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const extractLanguage = (classAttr: string) => {
  const match = classAttr.match(/language-([\w-]+)/i);
  return match?.[1] ?? "text";
};

let highlighterPromise: ReturnType<
  typeof import("shiki").createHighlighter
> | null = null;

const getHighlighter = async () => {
  if (!highlighterPromise) {
    const { createHighlighter } = await import("shiki");
    highlighterPromise = createHighlighter({
      themes: ["dark-plus"],
      langs: [
        "javascript",
        "typescript",
        "tsx",
        "jsx",
        "css",
        "html",
        "json",
        "bash",
        "markdown",
        "python",
        "sql",
        "text",
      ],
    });
  }

  return highlighterPromise;
};

export const highlightBoardCodeBlocks = async (html: string) => {
  const preRegex = /<pre(?:\s[^>]*)?><code(?:\s([^>]*)?)?>([\s\S]*?)<\/code><\/pre>/gi;
  const matches = [...html.matchAll(preRegex)];

  if (matches.length === 0) return html;

  const highlighter = await getHighlighter();
  let result = html;

  for (const match of matches) {
    const [fullMatch, classAttr = "", rawCode] = match;
    const language = extractLanguage(classAttr);
    const code = decodeHtml(rawCode.replace(/<br\s*\/?>/gi, "\n"));

    try {
      const highlighted = highlighter.codeToHtml(code, {
        lang: language,
        theme: "dark-plus",
      });
      result = result.replace(
        fullMatch,
        `<div class="board-code-block">${highlighted}</div>`,
      );
    } catch {
      // Keep original block if language is unsupported.
    }
  }

  return result;
};

export const formatBoardBodyForView = async (body: string) => {
  const normalized = formatBoardBodyHtml(body);
  if (!normalized) {
    return { html: "", headings: [] as BoardHeading[] };
  }

  const { html: withIds, headings } = addBoardHeadingIds(normalized);
  const html = await highlightBoardCodeBlocks(withIds);

  return { html, headings };
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
