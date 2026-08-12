import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { PROJECT_PAGE_SIZE, ProjectsResponse } from "@types";

export const useProjects = () => {
  return useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get<ProjectsResponse>("/api/project", {
        params: {
          page: pageParam,
          limit: PROJECT_PAGE_SIZE,
        },
      });

      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
