"use client";

import { useParams } from "next/navigation";
import { useTeam } from "@/hooks/queries/useTeams";
import { useMatches } from "@/hooks/queries/useMatches";
import { useEffect, useState } from "react";
import Image from "next/image";
import Loader from "@/components/ui/loader";
import TitleHeader from "@/components/landing-page/title-header";
import Carousel from "@/components/landing-page/carousel";
import JoinBanner from "@/components/landing-page/join-banner";
import Results from "@/components/landing-page/results";
import Ranking from "@/components/landing-page/ranking";
import type { MatchRecord } from "@/lib/services/airtable";
import { externalApi, api } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";
import { formatDate } from "@/lib/utils";

interface UpcomingEvent {
  event_id: string;
  event_type: string;
  event_date: string;
  sport_id: string;
  home_team_id: string;
  home_team_logo: string;
  away_team_id: string;
  away_team_logo: string;
  location_id: string;
  from_api: boolean;
  kategorija: string[];
}

interface TeamRecord {
  id: string;
  name: string;
  logo?: string;
  // Add other fields as needed
}

interface LocationRecord {
  id: string;
  venueName: string;
  address: string;
  capacity?: number;
  facilities?: string[];
  photo?: {
    id: string;
    url: string;
    filename: string;
    size: number;
    type: string;
  }[];
  matchesHosted?: string[];
  tournamentsHosted?: string[];
  sport?: string[];
}

interface RecommendationResponse {
  user_id: string;
  recommendations: {
    favorite_sports: any[];
    upcoming_events: UpcomingEvent[];
    recommended_teams: any[];
  };
}

export default function ClubPage() {
  const params = useParams();
  const clubId = Array.isArray(params.clubId)
    ? params.clubId[0]
    : params.clubId;
  const {
    data: club,
    isLoading: clubLoading,
    error: clubError,
  } = useTeam(clubId as string);
  const { data: matches, isLoading: matchesLoading } = useMatches();
  const [clubMatches, setClubMatches] = useState<MatchRecord[]>([]);
  const [matchItems, setMatchItems] = useState<any[]>([]);
  const [teamsCache, setTeamsCache] = useState<Record<string, TeamRecord>>({});
  const [locationsCache, setLocationsCache] = useState<
    Record<string, LocationRecord>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch a team by ID
  const fetchTeam = async (teamId: string) => {
    if (teamsCache[teamId]) {
      return teamsCache[teamId];
    }

    try {
      const team = await api.get<TeamRecord>(
        `${apiRoutes.airtable.teams}?id=${teamId}`,
      );
      setTeamsCache((prev) => ({ ...prev, [teamId]: team }));
      return team;
    } catch (error) {
      console.error(`Error fetching team with ID ${teamId}:`, error);
      return null;
    }
  };

  // Function to fetch a location by ID
  const fetchLocation = async (locationId: string) => {
    if (locationsCache[locationId]) {
      return locationsCache[locationId];
    }

    try {
      const location = await api.get<LocationRecord>(
        `${apiRoutes.airtable.locations}?id=${locationId}`,
      );
      setLocationsCache((prev) => ({ ...prev, [locationId]: location }));
      return location;
    } catch (error) {
      console.error(`Error fetching location with ID ${locationId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    if (matches && club) {
      // Filter matches where this club is either home or away team
      const filteredMatches = matches.filter(
        (match) =>
          (match.homeTeam && match.homeTeam.includes(club.id)) ||
          (match.awayTeam && match.awayTeam.includes(club.id)),
      );

      console.log("Matches for current club:", filteredMatches);
      setClubMatches(filteredMatches);
    }
  }, [matches, club]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("No user ID found in localStorage");
          setIsLoading(false);
          return;
        }

        // Make the API request for recommendations
        const response = await externalApi.get<RecommendationResponse>(
          `recommend/${userId}/homepage`,
          {},
        );

        console.log("API Response:", response);

        // Process upcoming events into match items
        if (response?.recommendations?.upcoming_events?.length > 0) {
          // Create an array to hold all promises for fetching additional data
          const detailPromises = response.recommendations.upcoming_events.map(
            async (event) => {
              // Fetch home team, away team and location data in parallel
              const [homeTeam, awayTeam, location] = await Promise.all([
                fetchTeam(event.home_team_id),
                fetchTeam(event.away_team_id),
                fetchLocation(event.location_id),
              ]);

              return {
                sport: "Nogomet", // This could be improved by fetching sport data
                homeTeam: {
                  name: homeTeam?.name || `Team ${event.home_team_id}`,
                  logoUrl:
                    event.home_team_logo ||
                    homeTeam?.logo ||
                    "/placeholder-logo.png",
                },
                awayTeam: {
                  name: awayTeam?.name || `Team ${event.away_team_id}`,
                  logoUrl:
                    event.away_team_logo ||
                    awayTeam?.logo ||
                    "/placeholder-logo.png",
                },
                venue: location?.venueName || `Location ${event.location_id}`,
                time: "18:30", // Default time, could be improved with actual event time
                date: formatDate(event.event_date),
                isFavorite: false,
                variant: "upcoming" as const,
                id: event.event_id,
              };
            },
          );

          // Wait for all team and location data to be fetched
          const formattedMatches = await Promise.all(detailPromises);
          setMatchItems(formattedMatches);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (clubLoading || matchesLoading) {
    return (
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (clubError || !club) {
    return (
      <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-semibold">Error loading club</h2>
        <p className="mt-2 text-white/70">
          {clubError instanceof Error
            ? clubError.message
            : "Unable to load club data"}
        </p>
      </div>
    );
  }

  // Skeleton cards for loading state
  const skeletonMatchItems = Array(4)
    .fill(0)
    .map((_, i) => ({
      isLoading: true,
      variant: "upcoming" as const,
      id: `skeleton-${i}`,
    }));

  return (
    <div className="flex flex-col gap-10">
      <div className="relative h-full">
        <Image
          src={"/placeholder.svg"}
          alt={"banner"}
          width={1920}
          height={250}
          className="w-full object-cover"
        />
        <div className="absolute -bottom-18 left-0 w-full translate-y-1/2 transform">
          <div className="px-8 py-3">
            <TitleHeader club={club} />
          </div>
        </div>
      </div>
      <div className="mt-44 flex w-full flex-col gap-12 bg-[#070314] px-8 py-3">
        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-4 md:grid-cols-[75%_25%]">
          <Carousel
            variant="match"
            title="Preporučeni događaji"
            items={isLoading ? skeletonMatchItems : matchItems}
            isLoading={isLoading}
          />
          <JoinBanner />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Results clubMatches={clubMatches} currentClubId={club.id} />
          <Ranking clubId={club.id} />
        </div>
      </div>
    </div>
  );
}
