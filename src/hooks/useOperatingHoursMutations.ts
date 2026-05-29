import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { v4 } from "uuid";
import { OperatingHourType } from "@types";
import { DAY_LABELS } from "@constants";

export const useOperatingHoursMutations = (
  restaurantId: string | null | undefined
) => {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({
      id,
      dayOfWeek,
      data,
    }: {
      id: string | number;
      dayOfWeek: number;
      data: Partial<OperatingHourType>;
    }) => {
      const isNew = typeof id === "number";
      const { data: response } = await axios.patch("/api/restaurants", {
        ...data,
        id: isNew ? v4() : id,
        type: "OPERATING_HOURS",
        restaurant_id: restaurantId,
        day_of_week: dayOfWeek,
      });
      return response;
    },
  });

  const saveOperatingHours = async (operatingHours: OperatingHourType[]) => {
    setIsUpdating(true);
    try {
      const promises = operatingHours.map((oh) =>
        mutation.mutateAsync({
          id: oh.id,
          dayOfWeek: oh.day_of_week,
          data: oh,
        })
      );
      const results = await Promise.allSettled(promises);
      await queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      const failedDays = results
        .map((res, index) =>
          res.status === "rejected" ? operatingHours[index].day_of_week : null
        )
        .filter((day) => day !== null);
      if (failedDays.length > 0) {
        const failedDayNames = failedDays
          .map((day) => DAY_LABELS[day as number])
          .join(", ");
        throw new Error(`Error: Failed to save ${failedDayNames}요일`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    saveOperatingHours,
    isUpdating,
    error: mutation.error,
    variables: mutation.variables,
  };
};
