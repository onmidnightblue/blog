export interface BoardPostContent {
  title: string;
  summary: string;
  tags: string[];
  body: string;
}

export interface BoardPost {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  publishedAt: string;
  body?: string;
}

export interface BoardPostsResponse {
  success: boolean;
  posts: BoardPost[];
  nextPage?: number;
  hasMore: boolean;
}

export interface BoardPostResponse {
  success: boolean;
  post: BoardPost;
}

export const BOARD_PAGE_SIZE = 5;
