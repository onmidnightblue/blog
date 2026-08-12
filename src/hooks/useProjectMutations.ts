import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ProjectContent } from "@types";

export const useProjectMutations = () => {
  const queryClient = useQueryClient();

  const invalidateProjects = () =>
    queryClient.invalidateQueries({ queryKey: ["projects"] });

  const createProject = useMutation({
    mutationFn: async (payload: ProjectContent) => {
      const { data } = await axios.post("/api/project", payload);
      return data;
    },
    onSuccess: invalidateProjects,
  });

  const updateProject = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ProjectContent;
    }) => {
      const { data } = await axios.patch(`/api/project/${id}`, payload);
      return data;
    },
    onSuccess: invalidateProjects,
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/project/${id}`);
      return data;
    },
    onSuccess: invalidateProjects,
  });

  return {
    createProject,
    updateProject,
    deleteProject,
  };
};
