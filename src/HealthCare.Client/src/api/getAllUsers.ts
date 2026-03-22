import { apiRequest } from "./apiClient";
import { useQuery } from "@tanstack/react-query";

export function useAllUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await apiRequest("/api/users", { method: "GET" });
      return users;
    },
  });
}
