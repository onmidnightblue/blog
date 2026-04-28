import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  OperatingHourType,
  RestaurantType,
  SupabaseUpdateType,
  SupabaseValue,
} from "@types";
import axios, { AxiosError } from "axios";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo } from "react";
import { v4 } from "uuid";

interface ApiErrorResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export const useRestaurantMutations = (id?: string) => {
  const queryClient = useQueryClient();

  const invalidate = useMemo(
    () =>
      debounce(
        () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }),
        300
      ),
    [queryClient]
  );

  const mutation = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      data: Record<string, SupabaseValue>;
      type: SupabaseUpdateType;
    }) => {
      const { data } = await axios.patch("/api/restaurants", {
        id: vars.id,
        type: vars.type,
        ...vars.data,
      });
      return data;
    },
    onMutate: async (newVars) => {
      await queryClient.cancelQueries({ queryKey: ["restaurants"] });
      const previous = queryClient.getQueryData<RestaurantType[]>([
        "restaurants",
      ]);

      queryClient.setQueryData<RestaurantType[]>(["restaurants"], (old) => {
        if (!old) return [];
        return old.map((rest) => {
          if (newVars.type === "RESTAURANTS" && rest.id === newVars.id) {
            return { ...rest, ...newVars.data };
          }
          if (newVars.type === "OPERATING_HOURS" && rest.id === id) {
            const updatedHours = rest.operating_hours.map((oh) =>
              oh.id === newVars.id ? { ...oh, ...newVars.data } : oh
            );
            return { ...rest, operating_hours: updatedHours };
          }
          return rest;
        });
      });
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["restaurants"], context.previous);
      }
    },
    onSettled: invalidate,
  });

  const saveOperatingHours = useMemo(
    () =>
      debounce((payload: { id: number; data: Partial<OperatingHourType> }) => {
        mutation.mutate({
          id: payload.id,
          data: payload.data as Record<string, SupabaseValue>,
          type: "OPERATING_HOURS",
        });
      }, 300),
    [mutation]
  );

  const saveOperatingHoursDirect = useCallback(
    (payload: { id: number; data: Partial<OperatingHourType> }) => {
      mutation.mutate({
        id: payload.id,
        data: payload.data as Record<string, SupabaseValue>,
        type: "OPERATING_HOURS",
      });
    },
    [mutation]
  );

  const saveToSupabase = useMemo(
    () =>
      debounce((data: Record<string, SupabaseValue>) => {
        if (id) mutation.mutate({ id, data, type: "RESTAURANTS" });
      }, 100),
    [id, mutation]
  );

  const errorMessage = useMemo(() => {
    if (!mutation.error) return null;
    const axiosError = mutation.error as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.error || axiosError.message;
  }, [mutation.error]);

  useEffect(() => {
    return () => {
      saveToSupabase.cancel();
      saveOperatingHours.cancel();
    };
  }, [saveToSupabase, saveOperatingHours]);

  return {
    saveToSupabase,
    saveOperatingHours,
    saveOperatingHoursDirect,
    isUpdating: mutation.isPending,
    errorId: mutation.isError ? mutation.variables?.id : null,
    errorMessage,
  };
};
