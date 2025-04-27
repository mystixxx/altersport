import type { MatchRecord } from "@/lib/services/airtable";
import { api } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";
import { queryKeys } from "@/lib/api/queryKeys";
import { useQuery } from "./useQuery";
import { useMutation } from "./useMutation";
import { useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * Hook for fetching all Matches from Airtable
 */
export function useMatches() {
  return useQuery<MatchRecord[]>(
    queryKeys.airtable.matches,
    () => api.get(apiRoutes.airtable.matches),
    {
      // You can customize options here
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
}

/**
 * Hook for fetching matches filtered by league ID
 * @param leagueId League ID to filter matches by
 */
export function useMatchesByLeague(leagueId?: string) {
  const { data: allMatches, isLoading, error } = useMatches();

  // Filter matches by league if a leagueId is provided
  const filteredMatches = useMemo(() => {
    if (!allMatches) return [];
    if (!leagueId) return allMatches;

    return allMatches.filter(
      (match) => match.kategorija && match.kategorija.includes(leagueId),
    );
  }, [allMatches, leagueId]);

  return {
    data: filteredMatches,
    isLoading,
    error,
  };
}

/**
 * Hook for fetching a single Match by ID from Airtable
 */
export function useMatch(id: string) {
  return useQuery<MatchRecord>(
    [...queryKeys.airtable.matches, id],
    () => api.get(`${apiRoutes.airtable.matches}?id=${id}`),
    {
      // You can customize options here
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!id, // Only run the query if we have an ID
    },
  );
}

/**
 * Hook for creating a new Match
 */
export function useCreateMatch(): UseMutationResult<
  MatchRecord,
  Error,
  Omit<MatchRecord, "id">
> {
  const queryClient = useQueryClient();

  return useMutation<MatchRecord, Error, Omit<MatchRecord, "id">>(
    (matchData) => api.post(apiRoutes.airtable.matches, matchData),
    {
      onSuccess: () => {
        // Invalidate the matches list query to refetch the updated data
        queryClient.invalidateQueries({ queryKey: queryKeys.airtable.matches });
      },
    },
  );
}

/**
 * Hook for updating a Match
 */
export function useUpdateMatch(
  id: string,
): UseMutationResult<MatchRecord, Error, Partial<MatchRecord>> {
  const queryClient = useQueryClient();

  return useMutation<MatchRecord, Error, Partial<MatchRecord>>(
    (matchData) => api.put(`${apiRoutes.airtable.matches}/${id}`, matchData),
    {
      onSuccess: () => {
        // Invalidate the specific match query and the matches list query
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.airtable.matches, id],
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.airtable.matches,
        });
      },
    },
  );
}
