import { STORAGE_USER_KEY } from "@constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAnonymousUserInit = () => {
  return useQuery({
    queryKey: ["myAnonymousId"],
    queryFn: async () => {
      if (typeof window === "undefined") return null;

      const localId = localStorage.getItem(STORAGE_USER_KEY);
      if (localId) return parseInt(localId, 10);

      const { data } = await axios.get("/api/users");
      const newId = data.user_id;

      localStorage.setItem(STORAGE_USER_KEY, String(newId));
      return newId;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
