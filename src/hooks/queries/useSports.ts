import type { SportRecord } from "@/lib/services/airtable";
import { api } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";
import { queryKeys } from "@/lib/api/queryKeys";
import { useQuery } from "./useQuery";

/**
 * Hook for fetching all Sports from Airtable
 */
export function useSports() {
  return useQuery<SportRecord[]>(
    queryKeys.airtable.sports,
    () => api.get(apiRoutes.airtable.sports),
    {
      // You can customize options here
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}

/**
 * Hook for fetching a single Sport by ID from Airtable
 */
export function useSport(id: string) {
  return useQuery<SportRecord>(
    [...queryKeys.airtable.sports, id],
    () => api.get(`${apiRoutes.airtable.sports}?id=${id}`),
    {
      // You can customize options here
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!id, // Only run the query if id is provided
    }
  );
} 