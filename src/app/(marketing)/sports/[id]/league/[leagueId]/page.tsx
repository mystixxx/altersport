"use client";

import { useParams } from "next/navigation";
import { useKategorije } from "@/hooks/queries/useKategorije";
import { useMatchesByLeague } from "@/hooks/queries/useMatches";
import { useEffect, useState } from "react";
import Image from "next/image";
import Loader from "@/components/ui/loader";
import TitleHeader from "@/components/landing-page/title-header";
import Carousel from "@/components/landing-page/carousel";
import JoinBanner from "@/components/landing-page/join-banner";
import Results from "@/components/landing-page/results";
import Ranking from "@/components/landing-page/ranking";
import type { MatchRecord, KategorijaRecord } from "@/lib/services/airtable";
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
  logo?: {
    url?: string;
  }[];
  address?: string;
  sport?: string[];
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

interface SportRecord {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  // Add other fields as needed
}

interface RecommendationResponse {
  user_id: string;
  recommendations: {
    favorite_sports: any[];
    upcoming_events: UpcomingEvent[];
    recommended_teams: any[];
  };
}

export default function LeaguePage() {
  const params = useParams();
  const leagueId = Array.isArray(params.leagueId)
    ? params.leagueId[0]
    : params.leagueId;
  const sportId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Get the current league data
  const {
    data: allLeagues,
    isLoading: leaguesLoading,
    error: leaguesError,
  } = useKategorije();

  // Get league-specific matches
  const { data: leagueMatches, isLoading: matchesLoading } = useMatchesByLeague(
    leagueId as string,
  );

  const [currentLeague, setCurrentLeague] = useState<KategorijaRecord | null>(
    null,
  );
  const [matchItems, setMatchItems] = useState<any[]>([]);
  const [teamsCache, setTeamsCache] = useState<Record<string, TeamRecord>>({});
  const [locationsCache, setLocationsCache] = useState<
    Record<string, LocationRecord>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [sportName, setSportName] = useState<string>("");

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

  // Function to fetch sport details by ID
  const fetchSport = async (id: string) => {
    try {
      const sport = await api.get<SportRecord>(
        `${apiRoutes.airtable.sports}?id=${id}`,
      );
      return sport;
    } catch (error) {
      console.error(`Error fetching sport with ID ${id}:`, error);
      return null;
    }
  };

  // Fetch sport name when sportId changes
  useEffect(() => {
    const getSportName = async () => {
      if (!sportId) return;

      try {
        const sport = await fetchSport(sportId);
        if (sport && sport.name) {
          setSportName(sport.name);
        }
      } catch (error) {
        console.error("Error fetching sport name:", error);
      }
    };

    getSportName();
  }, [sportId]);

  // Find the current league from all leagues
  useEffect(() => {
    if (allLeagues && leagueId) {
      const league = allLeagues.find((league) => league.id === leagueId);
      setCurrentLeague(league || null);
    }
  }, [allLeagues, leagueId]);

  // Fetch recommended matches
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

        // Process upcoming events into match items
        if (response?.recommendations?.upcoming_events?.length > 0) {
          const leagueEvents = response.recommendations.upcoming_events;

          // Create an array to hold all promises for fetching additional data
          const detailPromises = leagueEvents.map(async (event) => {
            // Fetch home team, away team and location data in parallel
            const [homeTeam, awayTeam, location] = await Promise.all([
              fetchTeam(event.home_team_id),
              fetchTeam(event.away_team_id),
              fetchLocation(event.location_id),
            ]);

            return {
              sport: sportName || event.sport_id, // Use sportName if available
              homeTeam: {
                name: homeTeam?.name || `Team ${event.home_team_id}`,
                logoUrl:
                  event.home_team_logo ||
                  homeTeam?.logo?.[0]?.url ||
                  "/placeholder-logo.png",
              },
              awayTeam: {
                name: awayTeam?.name || `Team ${event.away_team_id}`,
                logoUrl:
                  event.away_team_logo ||
                  awayTeam?.logo?.[0]?.url ||
                  "/placeholder-logo.png",
              },
              venue: location?.venueName || `Location ${event.location_id}`,
              time: "18:30", // Default time, could be improved with actual event time
              date: formatDate(event.event_date),
              isFavorite: false,
              variant: "upcoming" as const,
              id: event.event_id,
            };
          });

          // Wait for all team and location data to be fetched
          const formattedMatches = await Promise.all(detailPromises);
          setMatchItems(formattedMatches);
        }
      } catch (error) {
        console.error("Error fetching league-specific recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (leagueId) {
      fetchData();
    }
  }, [leagueId, sportId, sportName]); // Add sportName as dependency

  // Skeleton cards for loading state
  const skeletonMatchItems = Array(4)
    .fill(0)
    .map((_, i) => ({
      isLoading: true,
      variant: "upcoming" as const,
      id: `skeleton-${i}`,
    }));

  if (leaguesLoading || matchesLoading) {
    return (
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (leaguesError || !currentLeague) {
    return (
      <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-semibold">Error loading league</h2>
        <p className="mt-2 text-white/70">
          {leaguesError instanceof Error
            ? leaguesError.message
            : "Unable to load league data"}
        </p>
      </div>
    );
  }

  console.log(matchItems);

  return (
    <div className="flex flex-col">
      <div className="relative h-full">
        <Image
          src={"/placeholder.svg"}
          alt={"banner"}
          width={1920}
          height={250}
          className="w-full object-cover"
        />
      </div>
      <div className="flex w-full flex-col gap-12 bg-[#070314] px-8 py-3">
        <TitleHeader
          title={`${currentLeague.name}${sportName ? ` - ${sportName}` : ""}`}
        />
        <Carousel
          variant="match"
          title="Preporučeni događaji"
          items={isLoading ? skeletonMatchItems : matchItems}
          isLoading={isLoading}
        />
        <div className="grid grid-cols-2 gap-6">
          <Results
            clubMatches={leagueMatches || []}
            currentClubId=""
            leagueView={true}
          />
          <Ranking leagueId={currentLeague.id} />
        </div>
      </div>
    </div>
  );
}
