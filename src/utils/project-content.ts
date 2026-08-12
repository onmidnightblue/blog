import type { Project, ProjectContent } from "@types";

export const parseProjectContent = (content: string): ProjectContent => {
  try {
    const parsed = JSON.parse(content) as Partial<ProjectContent>;
    return {
      title: parsed.title ?? "",
      link: parsed.link ?? "",
      imageUrl: parsed.imageUrl ?? "",
      description: parsed.description ?? "",
    };
  } catch {
    return {
      title: "Untitled",
      link: "",
      imageUrl: "",
      description: content,
    };
  }
};

export const serializeProjectContent = (content: ProjectContent) =>
  JSON.stringify(content);

export const toProject = (row: {
  id: number;
  created_at: string;
  content: string;
}): Project => {
  const parsed = parseProjectContent(row.content);

  return {
    id: String(row.id),
    title: parsed.title,
    link: parsed.link,
    imageUrl: parsed.imageUrl,
    description: parsed.description,
    createdAt: row.created_at,
  };
};
