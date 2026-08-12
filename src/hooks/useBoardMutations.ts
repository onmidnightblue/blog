import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BoardPostContent } from "@types";

export const useBoardMutations = () => {
  const queryClient = useQueryClient();

  const invalidateBoardPosts = () =>
    queryClient.invalidateQueries({ queryKey: ["board-posts"] });

  const createPost = useMutation({
    mutationFn: async (payload: BoardPostContent) => {
      const { data } = await axios.post("/api/board", payload);
      return data;
    },
    onSuccess: invalidateBoardPosts,
  });

  const updatePost = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: BoardPostContent;
    }) => {
      const { data } = await axios.patch(`/api/board/${id}`, payload);
      return data;
    },
    onSuccess: invalidateBoardPosts,
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/board/${id}`);
      return data;
    },
    onSuccess: invalidateBoardPosts,
  });

  return {
    createPost,
    updatePost,
    deletePost,
  };
};
