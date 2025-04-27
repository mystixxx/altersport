"use client";

import Header from "@/components/landing-page/header";
import Banner from "@/components/landing-page/banner";
import CarouselVertical from "@/components/landing-page/carousel-vertical";
import { useEffect, useState } from "react";
import Carousel from "@/components/landing-page/carousel";
import { tournamentItems } from "@/utils/mockData";
import { api, externalApi } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";
import { useTeamsBySport } from "@/hooks/queries/useTeamsBySport";
import { formatDate } from "@/lib/utils";

// Define types
interface SportRecord {
  id: string;
  name: string;
  icon: string;
}

interface TeamRecord {
  id: string;
  name: string;
  logo: {
    id: string;
    url: string;
    filename: string;
    size: number;
    type: string;
  }[];
  address: string;
  sport: string[];
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

interface RecommendationResponse {
  user_id: string;
  recommendations: {
    favorite_sports: any[];
    upcoming_events: UpcomingEvent[];
    recommended_teams: any[];
  };
}

export default function SuggestionPage() {
  const [recommendedSportId, setRecommendedSportId] = useState<string | null>(
    null,
  );
  const [recommendedSportName, setRecommendedSportName] = useState<
    string | null
  >(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [clubItems, setClubItems] = useState<any[]>([]);
  const [matchItems, setMatchItems] = useState<any[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);
  const [teamsCache, setTeamsCache] = useState<Record<string, TeamRecord>>({});
  const [locationsCache, setLocationsCache] = useState<
    Record<string, LocationRecord>
  >({});

  // Use the useTeamsBySport hook to get teams for the recommended sport
  const { data: teams, isLoading: isTeamsLoading } = useTeamsBySport(
    recommendedSportId || undefined,
  );

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
    // Check if we have API response data in sessionStorage
    const checkForApiResponse = () => {
      try {
        const storedResponse = sessionStorage.getItem("quizApiResponse");
        if (storedResponse) {
          const parsedResponse = JSON.parse(storedResponse);
          console.log("Quiz API Response:", parsedResponse);

          if (parsedResponse.recommended_sport) {
            setRecommendedSportId(parsedResponse.recommended_sport);
          }

          if (parsedResponse.user_profile) {
            setUserProfile(parsedResponse.user_profile);
          }

          // Clear the stored response after reading it
          sessionStorage.removeItem("quizApiResponse");
        }
      } catch (error) {
        console.error(
          "Error parsing API response from session storage:",
          error,
        );
      }
    };

    checkForApiResponse();
  }, []);

  // Fetch recommended events for the suggested sport
  useEffect(() => {
    const fetchRecommendedEvents = async () => {
      setIsEventsLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("No user ID found in localStorage");
          setIsEventsLoading(false);
          return;
        }

        // Make the API request for recommendations
        const response = await externalApi.get<RecommendationResponse>(
          `recommend/${userId}/homepage`,
          {},
        );

        console.log("Events API Response:", response);

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
                sport: recommendedSportName || "Sport",
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
                time: "18:30", // Default time
                date: formatDate(event.event_date),
                isFavorite: false,
                variant: "upcoming" as const,
              };
            },
          );

          // Wait for all team and location data to be fetched
          const formattedMatches = await Promise.all(detailPromises);
          setMatchItems(formattedMatches);
        }
      } catch (error) {
        console.error("Error fetching recommended events:", error);
      } finally {
        setIsEventsLoading(false);
      }
    };

    // Call the function to fetch recommended events
    fetchRecommendedEvents();
  }, [recommendedSportName]);

  // Fetch sport details when we have a recommended sport ID
  useEffect(() => {
    if (recommendedSportId) {
      // Fetch the sport name
      const fetchSportDetails = async () => {
        try {
          const sportData = await api.get<SportRecord>(
            `${apiRoutes.airtable.sports}?id=${recommendedSportId}`,
          );
          console.log("Sport data:", sportData);

          if (sportData && sportData.name) {
            setRecommendedSportName(sportData.name);
          }
        } catch (error) {
          console.error("Error fetching sport details:", error);
        }
      };

      fetchSportDetails();
    }
  }, [recommendedSportId]);

  // Transform team data to match ClubItem format
  useEffect(() => {
    if (teams) {
      const formattedTeams = teams.map((team) => ({
        id: team.id,
        name: team.name,
        location: team.address,
        logoUrl: team.logo?.[0]?.url || "/placeholder.png",
        isFavorite: false, // Default value
        sport: team.sport,
      }));
      setClubItems(formattedTeams);
    }
  }, [teams]);

  // Skeleton cards for loading state
  const skeletonMatchItems = Array(4)
    .fill(0)
    .map((_, i) => ({
      isLoading: true,
      variant: "upcoming" as const,
      id: `skeleton-${i}`,
    }));

  // Customize the banner based on the recommended sport
  const getBannerContent = () => {
    if (recommendedSportName) {
      return {
        title: `Isprobaj ${recommendedSportName} u klubu blizu tebe!`,
        description:
          "Preporučamo ti ovaj sport na temelju tvojih odgovora iz kviza.",
        buttonText: "Saznaj više",
      };
    }

    return {
      title: "Isprobaj hokej na travi u klubu Dinamo GNK!",
      description: "Klub u tvojoj blizini nudi besplatne probne treninge.",
      buttonText: "Prijavi se",
    };
  };

  const bannerContent = getBannerContent();

  return (
    <div className="flex w-full flex-col gap-10">
      <Header />
      <div className="grid grid-cols-[65%_35%] gap-6">
        <Banner
          title={bannerContent.title}
          description={bannerContent.description}
          buttonText={bannerContent.buttonText}
        />
        <CarouselVertical
          title={`Preporučeni klubovi`}
          items={clubItems}
          sportId={recommendedSportId || ""}
          isLoading={isTeamsLoading}
          suggestedSport={true}
        />
      </div>
      <Carousel
        variant="match"
        title={`Preporučeni događaji`}
        items={isEventsLoading ? skeletonMatchItems : matchItems}
        isLoading={isEventsLoading}
      />
      <Carousel
        variant="tournament"
        title="Otvorena natjecanja"
        items={tournamentItems}
      />
    </div>
  );
}
