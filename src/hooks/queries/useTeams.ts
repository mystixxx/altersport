import type { TeamRecord } from "@/lib/services/airtable";
import { api } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";
import { queryKeys } from "@/lib/api/queryKeys";
import { useQuery } from "./useQuery";

/**
 * Hook for fetching all Teams from Airtable
 */
export function useTeams() {
  return useQuery<TeamRecord[]>(
    queryKeys.airtable.teams,
    () => api.get(apiRoutes.airtable.teams),
    {
      // You can customize options here
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
}

/**
 * Hook for fetching a single Team by ID from Airtable
 */
export function useTeam(id: string) {
  return useQuery<TeamRecord>(
    [...queryKeys.airtable.teams, id],
    () => api.get(`${apiRoutes.airtable.teams}?id=${id}`),
    {
      // You can customize options here
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!id, // Only run the query if we have an ID
    },
  );
}

/**
 * Hook for fetching Teams by category ID from Airtable
 */
export function useTeamsByCategory(categoryId: string) {
  return useQuery<TeamRecord[]>(
    [...queryKeys.airtable.teams, "category", categoryId],
    () => api.get(`${apiRoutes.airtable.teams}?categoryId=${categoryId}`),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!categoryId, // Only run the query if we have a category ID
    },
  );
}
