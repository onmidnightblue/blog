export interface ProjectContent {
  title: string;
  link: string;
  imageUrl: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
  description: string;
  createdAt: string;
}

export interface ProjectsResponse {
  success: boolean;
  projects: Project[];
  nextPage?: number;
  hasMore: boolean;
}

export const PROJECT_PAGE_SIZE = 6;
