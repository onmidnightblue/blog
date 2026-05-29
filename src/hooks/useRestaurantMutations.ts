import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RestaurantType, SupabaseValue } from "@types";

export const useRestaurantMutations = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, SupabaseValue>;
    }) => {
      const { data: response } = await axios.patch("/api/restaurants", {
        id,
        type: "RESTAURANTS",
        ...data,
      });
      return response;
    },
    onSuccess: (responseData, variables) => {
      queryClient.setQueryData<RestaurantType[]>(["restaurants"], (old) => {
        if (!old) return [];
        return old.map((rest) =>
          String(rest.id) === String(variables.id)
            ? {
                ...rest,
                ...variables.data,
                ...responseData,
              }
            : rest
        );
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newData: Partial<RestaurantType>) => {
      const { data: response } = await axios.post("/api/restaurants", {
        type: "RESTAURANTS",
        ...newData,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  return {
    updateRestaurant: updateMutation.mutateAsync,
    createRestaurant: createMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
    error: updateMutation.error || createMutation.error,
  };
};
