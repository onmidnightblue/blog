import { STORAGE_USER_KEY } from "@constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCommentMutations = (restaurantId?: string) => {
  const queryClient = useQueryClient();

  const storageUserId =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_USER_KEY)
      : null;

  // post
  const mutation = useMutation({
    mutationFn: async ({
      text,
      password,
    }: {
      text: string;
      password: string;
    }) => {
      if (!restaurantId) throw new Error("Not found restaurantId");
      if (!storageUserId) throw new Error("No user ID has been issued.");
      const { data: response } = await axios.post("/api/comments", {
        content: text,
        password,
        user_id: parseInt(storageUserId, 10),
        restaurant_id: restaurantId,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", restaurantId] });
    },
  });

  // delete
  const deleteMutation = useMutation({
    mutationFn: async ({
      commentId,
      password,
    }: {
      commentId: string | number;
      password: string;
    }) => {
      const { data: response } = await axios.patch("/api/comments", {
        comment_id: commentId,
        password,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  return {
    userId: storageUserId ? parseInt(storageUserId, 10) : null,
    saveComment: mutation.mutateAsync,
    deleteComment: deleteMutation.mutateAsync,
  };
};
