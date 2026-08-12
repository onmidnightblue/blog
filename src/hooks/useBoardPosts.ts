import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { BOARD_PAGE_SIZE, BoardPostsResponse } from "@types";

export const useBoardPosts = () => {
  return useInfiniteQuery({
    queryKey: ["board-posts"],
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get<BoardPostsResponse>("/api/board", {
        params: {
          page: pageParam,
          limit: BOARD_PAGE_SIZE,
        },
      });

      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
