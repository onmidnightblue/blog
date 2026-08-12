import type { BoardPost } from "@types";

const BASE_BOARD_POSTS: BoardPost[] = [
  {
    id: "1",
    title: "Cursor로 프론트엔드 개발하기",
    summary:
      "AI 에디터 Cursor를 처음 쓰는 프론트엔드 개발자를 위한 실전 팁과 워크플로우 정리.",
    tags: ["Frontend", "Cursor", "Workflow"],
    publishedAt: "2026-08-12",
  },
  {
    id: "2",
    title: "Next.js App Router로 멀티 서비스 구성하기",
    summary:
      "하나의 레포에서 블로그와 side project를 route group으로 분리하는 방법.",
    tags: ["Next.js", "Architecture"],
    publishedAt: "2026-08-05",
  },
  {
    id: "3",
    title: "Tailwind CSS v4 마이그레이션 노트",
    summary:
      "@theme과 CSS 변수 기반 디자인 토큰으로 스타일 시스템을 정리한 기록.",
    tags: ["Tailwind", "CSS"],
    publishedAt: "2026-07-28",
  },
  {
    id: "4",
    title: "React Query와 Zustand, 역할 나누기",
    summary:
      "서버 상태와 클라이언트 UI 상태를 분리할 때의 기준과 실제 적용 사례.",
    tags: ["React Query", "Zustand", "State"],
    publishedAt: "2026-07-15",
  },
];

const EXTRA_BOARD_POSTS: Omit<BoardPost, "id" | "publishedAt">[] = [
  {
    title: "TypeScript strict mode 실전 가이드",
    summary: "any를 줄이고 타입 안정성을 높이기 위해 적용한 규칙과 점진적 마이그레이션 전략.",
    tags: ["TypeScript"],
  },
  {
    title: "Intersection Observer로 무한 스크롤 구현하기",
    summary: "scroll 이벤트 대신 Observer API를 사용해 성능과 UX를 함께 개선한 방법.",
    tags: ["Frontend", "Performance"],
  },
  {
    title: "App Router에서 Client/Server Component 나누기",
    summary: "데이터 fetching과 상호작용 UI를 분리할 때의 기준과 폴더 구조.",
    tags: ["Next.js", "React"],
  },
  {
    title: "디자인 토큰으로 일관된 UI 유지하기",
    summary: "CSS 변수와 Tailwind theme 설정으로 컴포넌트 간 스타일 drift를 줄인 경험.",
    tags: ["Design System", "CSS"],
  },
  {
    title: "React 19에서 바뀐 점 정리",
    summary: "마이그레이션하면서 실제로 체감한 API 변화와 주의할 점.",
    tags: ["React"],
  },
  {
    title: "포트폴리오 블로그 IA 설계",
    summary: "board, project, contact 섹션을 어떻게 나누고 우선순위를 정했는지.",
    tags: ["Product", "Blog"],
  },
  {
    title: "ESLint와 Prettier 설정 공유",
    summary: "팀/개인 프로젝트에서 재사용 가능한 lint 규칙 세트.",
    tags: ["Tooling"],
  },
  {
    title: "모바일 네비게이션 UX 패턴",
    summary: "햄버거 메뉴, 드로어, 오버레이를 조합할 때 검증한 인터랙션.",
    tags: ["UX", "Mobile"],
  },
  {
    title: "GitHub Pages vs Vercel 배포 비교",
    summary: "정적 export와 SSR 프로젝트를 동시에 운영할 때의 트레이드오프.",
    tags: ["DevOps"],
  },
  {
    title: "Supabase 연동 전략",
    summary: "블로그 콘텐츠를 DB로 옮기기 전에 정한 스키마와 API 설계.",
    tags: ["Supabase", "Backend"],
  },
  {
    title: "접근성 체크리스트 for FE",
    summary: "키보드 탐색, aria-label, 포커스 관리를 릴리즈 전에 확인하는 항목.",
    tags: ["A11y", "Frontend"],
  },
  {
    title: "개발 일지: 사이드바 리팩터",
    summary: "반응형 nav를 분리하면서 겪은 상태 관리와 레이아웃 이슈.",
    tags: ["Refactor"],
  },
];

const generateExtraPosts = (): BoardPost[] =>
  EXTRA_BOARD_POSTS.map((post, index) => ({
    ...post,
    id: String(index + 5),
    publishedAt: new Date(2026, 6 - Math.floor(index / 2), 28 - index)
      .toISOString()
      .slice(0, 10),
  }));

export const BOARD_POSTS: BoardPost[] = [
  ...BASE_BOARD_POSTS,
  ...generateExtraPosts(),
];

export const getPaginatedBoardPosts = (page: number, limit: number) => {
  const start = page * limit;
  const posts = BOARD_POSTS.slice(start, start + limit);
  const hasMore = start + limit < BOARD_POSTS.length;

  return {
    posts,
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  };
};
