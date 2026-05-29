import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CommentType } from "@types";
import { supabaseBrowser } from "@lib";

export const useComments = (
  restaurantId?: string,
  isRealtimeEnabled: boolean = false
) => {
  const queryClient = useQueryClient();

  const query = useQuery<CommentType[]>({
    queryKey: ["comments", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const { data } = await axios.get(
        `/api/comments?restaurant_id=${restaurantId}`
      );
      return data.comments || [];
    },
    enabled: !!restaurantId,
  });

  useEffect(() => {
    if (!restaurantId || !isRealtimeEnabled) return;

    const supabase = supabaseBrowser();
    const channelName = `comments-channel-${restaurantId}`;

    supabase.removeChannel(supabase.channel(channelName));
    const channel = supabase.channel(channelName);

    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        (payload) => {
          const newRecord = payload.new as { restaurant_id?: string } | null;
          const oldRecord = payload.old as { restaurant_id?: string } | null;

          if (
            newRecord?.restaurant_id === restaurantId ||
            oldRecord?.restaurant_id === restaurantId
          ) {
            queryClient.setQueryData(
              ["comments", restaurantId],
              (oldData: CommentType[] = []) => {
                if (payload.eventType === "INSERT")
                  return [payload.new as CommentType, ...oldData];
                if (payload.eventType === "DELETE")
                  return oldData.filter((item) => item.id !== payload.old.id);
                return oldData;
              }
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, isRealtimeEnabled, queryClient]);

  return query;
};
