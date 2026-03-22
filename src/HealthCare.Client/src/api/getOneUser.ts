import { apiRequest } from "./apiClient";
import { useQuery } from "@tanstack/react-query";

export function useOneUser(nationalId: string) {
  return useQuery({
    queryKey: ["users", nationalId],
    queryFn: async () => {
      if (!nationalId) throw new Error("no nationalId provided");

      const user = await apiRequest(`/users/${encodeURIComponent(nationalId)}`, { method: "GET" });
      return user;
    },
    enabled: !!nationalId,
  });
}
