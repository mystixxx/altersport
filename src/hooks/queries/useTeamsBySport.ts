"use client";

import { useTeams } from "./useTeams";
import { useMemo } from "react";
import type { TeamRecord } from "@/lib/services/airtable";

/**
 * Hook for fetching teams filtered by sport ID
 * @param sportId Optional sport ID to filter teams by
 */
export function useTeamsBySport(sportId?: string) {
  const { data: allTeams, isLoading, error } = useTeams();

  // Filter teams by sport if a sportId is provided
  const filteredTeams = useMemo(() => {
    if (!allTeams) return [];

    if (!sportId) return allTeams;

    return allTeams.filter(
      (team) => team.sport && team.sport.includes(sportId),
    );
  }, [allTeams, sportId]);

  return {
    data: filteredTeams,
    isLoading,
    error,
  };
}
