import { useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { useRestaurantStore } from "@store";
import { supabaseBrowser } from "@lib";
import { OperatingHour, RestaurantType, UpdateType } from "@types";
import { v4 } from "uuid";

export const useRestaurants = (id?: string) => {
  const queryClient = useQueryClient();
  const { setRestaurants } = useRestaurantStore((state) => state);
  const supabase = useMemo(() => supabaseBrowser(), []);

  // -------------------------------------------------------------------fetch
  const {
    data: restaurants,
    isLoading: isFetchLoading,
    isError: isFetchError,
    error: fetchError,
  } = useQuery<RestaurantType[]>({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data } = await axios.get("/api/restaurants");
      if (!data.success) throw new Error("Data load failed");
      setRestaurants(data.restaurants);
      return data.restaurants;
    },
    staleTime: 1000 * 60 * 30, // 30min
  });

  const operatingHours = useMemo(() => {
    if (!id || !restaurants) return [];
    return restaurants.find((r) => r.id === id)?.operating_hours || [];
  }, [id, restaurants]);

  // -------------------------------------------------------------------update
  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["restaurants"] });
  }, [queryClient]);

  const updateMutation = useMutation({
    mutationFn: async (variables: {
      id?: string | number;
      data: Record<string, unknown>;
      type?: UpdateType;
    }) => {
      const { data } = await axios.patch("/api/restaurants", {
        id: variables.id,
        type: variables.type,
        ...variables.data,
      });
      return data;
    },
    onMutate: async (newVariables) => {
      await queryClient.cancelQueries({ queryKey: ["restaurants"] });
      const previousRestaurants = queryClient.getQueryData<RestaurantType[]>([
        "restaurants",
      ]);

      if (previousRestaurants && newVariables.type === "OPERATING_HOURS") {
        queryClient.setQueryData<RestaurantType[]>(["restaurants"], (old) => {
          return old?.map((restaurant) => {
            if (restaurant.id === id) {
              return {
                ...restaurant,
                operating_hours: restaurant.operating_hours.map((oh) => {
                  const isMatch =
                    oh.id === newVariables.id ||
                    (typeof newVariables.id === "number" &&
                      oh.day_of_week === newVariables.id);
                  if (isMatch) {
                    return {
                      ...oh,
                      ...(newVariables.data as Partial<OperatingHour>),
                    };
                  }
                  return oh;
                }),
              };
            }
            return restaurant;
          });
        });
      }
      return { previousRestaurants };
    },
    onSuccess: invalidate,
    onError: (err, newVariables, context) => {
      if (context?.previousRestaurants) {
        queryClient.setQueryData(["restaurants"], context.previousRestaurants);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (params: { id: string | number; type: UpdateType }) => {
      const { data } = await axios.delete("/api/restaurants", { params });
      return data;
    },
    onSuccess: invalidate,
  });

  // -------------------------------------------------------------------action
  const handleDelete = (targetId: number | string, type: UpdateType) => {
    deleteMutation.mutate(
      { id: targetId, type },
      {
        onError: (error: unknown) => {
          const message = (error as Error)?.message ?? "Internal Server Error";
          console.log(message);
        },
      }
    );
  };

  const saveComment = useCallback(
    (commentId: number, content: string) => {
      updateMutation.mutate({
        id: commentId,
        data: { content },
        type: "COMMENTS",
      });
    },
    [updateMutation]
  );

  // -------------------------------------------------------------------debounce
  const saveToSupabase = useMemo(
    () =>
      debounce(
        (data: Record<string, unknown>) =>
          updateMutation.mutate({ id: id!, data }),
        100
      ),
    [id, updateMutation]
  );

  const saveOperatingHours = useMemo(
    () =>
      debounce(
        (payload: { id: string | number; data: Partial<OperatingHour> }) => {
          if (!id) return;

          const restaurants = queryClient.getQueryData<RestaurantType[]>([
            "restaurants",
          ]);
          const currentOHs =
            restaurants?.find((r) => r.id === id)?.operating_hours || [];
          const existing = currentOHs.find(
            (oh) =>
              oh.id === payload.id ||
              (typeof payload.id === "number" && oh.day_of_week === payload.id)
          );
          const isNewRecord = typeof payload.id === "number";
          const finalId = isNewRecord ? v4() : payload.id;
          updateMutation.mutate({
            id: finalId,
            data: {
              ...existing,
              ...payload.data,
              id: finalId,
              restaurant_id: id,
              ...(isNewRecord ? { day_of_week: payload.id } : {}),
            },
            type: "OPERATING_HOURS",
          });
        },
        200
      ),
    [id, updateMutation, queryClient]
  );

  useEffect(() => {
    return () => {
      saveToSupabase.cancel();
      saveOperatingHours.cancel();
    };
  }, [saveToSupabase, saveOperatingHours]);

  // -------------------------------------------------------------------subscription
  useEffect(() => {
    const channel = supabase
      .channel(`realtime-db-${id || "global"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "restaurants" },
        invalidate
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "operating_hours" },
        invalidate
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        invalidate
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, invalidate, id]);

  const isUpdating = updateMutation.isPending || deleteMutation.isPending;
  const isMutationError = updateMutation.isError || deleteMutation.isError;
  const activeField =
    updateMutation.isPending && updateMutation.variables?.data
      ? Object.keys(updateMutation.variables.data)[0]
      : null;
  const errorMessage = useMemo(() => {
    const err = fetchError || updateMutation.error || deleteMutation.error;
    if (!err) return null;
    return axios.isAxiosError(err)
      ? err.response?.data?.error || err.message
      : (err as Error).message;
  }, [fetchError, updateMutation.error, deleteMutation.error]);

  return {
    // Data
    restaurants,
    operatingHours,

    // Status
    isLoading: isFetchLoading || isUpdating,
    isError: isFetchError || isMutationError,
    errorMessage,
    updatingField: activeField,
    errorField: updateMutation.isError ? activeField : null,

    // Actions
    saveToSupabase,
    saveOperatingHours,
    saveComment,
    onDelete: handleDelete,
  };
};
