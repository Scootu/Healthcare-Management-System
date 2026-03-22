import { type CommuneDataType } from "../types/communeDataType";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "./apiClient";

export function useUsersByCommune(communeData: CommuneDataType) {
  return useQuery({
    queryKey: ["users", communeData],
    queryFn: async () => {
      if (!communeData.wilaya) throw new Error("no wilaya provided");
      if (!communeData.dayra) throw new Error("no dayra provided");
      if (!communeData.commune) throw new Error("no commune provided");

      const params = new URLSearchParams({
        wilaya: communeData.wilaya,
        dayra: communeData.dayra,
        commune: communeData.commune,
      });

      const users = await apiRequest(`/users?${params.toString()}`, { method: "GET" });
      return users;
    },
    enabled:
      !!communeData.wilaya &&
      !!communeData.dayra &&
      !!communeData.commune,
  });
}
