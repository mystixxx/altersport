"use client";

import { useState, useEffect, use } from "react";
import Header from "@/components/landing-page/header";
import Carousel from "@/components/landing-page/carousel";
import CarouselVertical from "@/components/landing-page/carousel-vertical";
import MapsLeagues from "@/components/landing-page/maps-leagues";
import { tournamentItems } from "@/utils/mockData";
import { useTeamsBySport } from "@/hooks/queries/useTeamsBySport";
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

export default function Sports({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const sportId = unwrappedParams.id;
  const { data: teams, isLoading: isTeamsLoading } = useTeamsBySport(sportId);
  const [clubItems, setClubItems] = useState<any[]>([]);
  const [matchItems, setMatchItems] = useState<any[]>([]);
  const [teamsCache, setTeamsCache] = useState<Record<string, TeamRecord>>({});
  const [locationsCache, setLocationsCache] = useState<
    Record<string, LocationRecord>
  >({});
  const [isRecommendationsLoading, setIsRecommendationsLoading] =
    useState(true);
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

  useEffect(() => {
    if (teams) {
      // Transform team data to match ClubItem format
      const formattedTeams = teams.map((team) => ({
        id: team.id,
        name: team.name,
        location: team.address,
        logoUrl: team.logo?.[0]?.url || "/placeholder.png",
        isFavorite: false, // Default value, could be managed by user preferences
        sport: team.sport,
      }));
      setClubItems(formattedTeams);
    }
  }, [teams]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsRecommendationsLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("No user ID found in localStorage");
          setIsRecommendationsLoading(false);
          return;
        }

        // Make the API request for recommendations filtered by sport
        const response = await externalApi.get<RecommendationResponse>(
          `recommend/${userId}/homepage`,
          {},
        );

        console.log("Sport-specific Recommendations:", response);

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
                sport: sportName || sportId, // Use the sport name if available, otherwise use the ID
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
            },
          );

          // Wait for all team and location data to be fetched
          const formattedMatches = await Promise.all(detailPromises);
          setMatchItems(formattedMatches);
        }
      } catch (error) {
        console.error("Error fetching sport-specific recommendations:", error);
      } finally {
        setIsRecommendationsLoading(false);
      }
    };

    if (sportId) {
      fetchRecommendations();
    }
  }, [sportId, sportName]);

  // Skeleton cards for loading state
  const skeletonMatchItems = Array(4)
    .fill(0)
    .map((_, i) => ({
      isLoading: true,
      variant: "upcoming" as const,
      id: `skeleton-${i}`,
    }));

  return (
    <div className="flex w-full flex-col gap-10">
      <Header />
      <Carousel
        variant="match"
        title={`Preporučeni događaji`}
        items={isRecommendationsLoading ? skeletonMatchItems : matchItems}
        isLoading={isRecommendationsLoading}
      />
      <div className="grid grid-cols-[35%_65%] gap-2">
        <CarouselVertical
          title={`Klubovi ${sportName ? `- ${sportName}` : ""}`}
          items={clubItems}
          sportId={sportId}
          isLoading={isTeamsLoading}
        />
        <MapsLeagues />
      </div>
      <Carousel
        variant="tournament"
        title="Otvorena natjecanja"
        items={tournamentItems}
      />
    </div>
  );
}
