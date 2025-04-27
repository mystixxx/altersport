"use client";

import { useState, useEffect } from "react";
import { useTeams } from "./useTeams";
import { setKey, setLanguage, setRegion, fromAddress } from "react-geocode";
import type { TeamRecord } from "@/lib/services/airtable";

// Set default options for react-geocode
setKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");
setLanguage("hr");
setRegion("hr");

export type TeamWithCoordinates = TeamRecord & {
  coordinates?: {
    lat: number;
    lng: number;
  };
  geocodeError?: string;
};

/**
 * Hook to fetch teams and geocode their addresses to coordinates
 */
export function useTeamsWithCoordinates() {
  const {
    data: teams,
    isLoading: isTeamsLoading,
    error: teamsError,
  } = useTeams();
  const [teamsWithCoordinates, setTeamsWithCoordinates] = useState<
    TeamWithCoordinates[]
  >([]);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (!teams || teams.length === 0) return;

    const geocodeTeams = async () => {
      setIsGeocoding(true);

      const teamsWithCoords = await Promise.all(
        teams.map(async (team) => {
          // Skip geocoding if no address
          if (!team.address) {
            return { ...team };
          }

          try {
            // Using fromAddress function from react-geocode
            const response = await fromAddress(team.address);
            const { lat, lng } = response.results[0].geometry.location;

            return {
              ...team,
              coordinates: { lat, lng },
            };
          } catch (error) {
            console.error(
              `Error geocoding address for team ${team.name}:`,
              error,
            );
            return {
              ...team,
              geocodeError:
                error instanceof Error
                  ? error.message
                  : "Unknown error during geocoding",
            };
          }
        }),
      );

      setTeamsWithCoordinates(teamsWithCoords);
      setIsGeocoding(false);
    };

    geocodeTeams();
  }, [teams]);

  return {
    teams: teamsWithCoordinates,
    isLoading: isTeamsLoading || isGeocoding,
    error: teamsError,
  };
}
