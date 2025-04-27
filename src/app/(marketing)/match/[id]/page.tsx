"use client";

import { useParams } from "next/navigation";
import { useMatch } from "@/hooks/queries/useMatches";
import { useTeam } from "@/hooks/queries/useTeams";
import { useLocation } from "@/hooks/queries/useLocations";
import { useKategorije } from "@/hooks/queries/useKategorije";
import { useSport } from "@/hooks/queries/useSports";
import { useGeocode } from "@/hooks/use-geocode";
import MatchCardBig from "@/components/landing-page/match-card-big";
import Loader from "@/components/ui/loader";
import { useMemo } from "react";
import Ranking from "@/components/landing-page/ranking";
import MapsMatch from "@/components/landing-page/maps-match";
import Carousel from "@/components/landing-page/carousel";
import { tournamentItems } from "@/utils/mockData";

export default function MatchPage() {
  const params = useParams();
  const matchId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: match, isLoading: matchLoading } = useMatch(matchId as string);

  // Get home and away team data
  const homeTeamId = match?.homeTeam?.[0];
  const awayTeamId = match?.awayTeam?.[0];
  const locationId = match?.location?.[0];
  const leagueId = match?.kategorija?.[0];
  const sportId = match?.sport?.[0];

  const { data: homeTeam } = useTeam(homeTeamId || "");
  const { data: awayTeam } = useTeam(awayTeamId || "");
  const { data: location } = useLocation(locationId || "");
  const { data: allLeagues } = useKategorije();
  const { data: sport } = useSport(sportId || "");

  // Get geocoded coordinates for the location address
  const {
    lat,
    lng,
    success: geocodeSuccess,
    isLoading: geocodeLoading,
  } = useGeocode(location?.address || "");

  // Find the league from all leagues
  const league = useMemo(() => {
    if (!allLeagues || !leagueId) return null;
    return allLeagues.find((league) => league.id === leagueId);
  }, [allLeagues, leagueId]);

  const isLoading = matchLoading || !match;

  const matchData = useMemo(() => {
    if (!match || !homeTeam || !awayTeam) return null;

    return {
      sport: sport?.name || "Nogomet",
      homeTeam: {
        name: homeTeam.name || "Home Team",
        logoUrl: homeTeam.logo?.[0]?.url || "/placeholder.png",
      },
      awayTeam: {
        name: awayTeam.name || "Away Team",
        logoUrl: awayTeam.logo?.[0]?.url || "/placeholder.png",
      },
      venue: location?.venueName || "Venue",
      time: match.matchTime || "00:00",
      date: match.matchDate || "00.00.0000",
      variant: match.matchResult ? ("result" as const) : ("upcoming" as const),
      homeTeamResult: match.homeTeamScore?.toString() || "0",
      awayTeamResult: match.awayTeamScore?.toString() || "0",
    };
  }, [match, homeTeam, awayTeam, location, sport]);

  // Prepare location data for the map
  const locationData = useMemo(() => {
    if (!location) return null;

    return {
      locationName: location.venueName || "Match Venue",
      locationCoordinates: geocodeSuccess
        ? {
            lat,
            lng,
          }
        : {
            // Default coordinates for Zagreb if geocoding fails
            lat: 45.815399,
            lng: 15.966568,
          },
      locationImageUrl: location.photo?.[0]?.url,
    };
  }, [location, lat, lng, geocodeSuccess]);

  if (isLoading || geocodeLoading) {
    return (
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Create an array of team IDs to highlight in the ranking table
  const teamIds = [homeTeamId, awayTeamId].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-10">
      <h1 className="pt-10 text-4xl font-bold text-white">
        Utakmica {league?.name}
      </h1>
      <div className="grid grid-cols-[30%_70%] gap-6">
        {matchData && <MatchCardBig {...matchData} />}
        <Ranking clubIds={teamIds} leagueId={leagueId} />
      </div>
      <MapsMatch
        locationName={locationData?.locationName}
        locationCoordinates={locationData?.locationCoordinates}
        locationImageUrl={locationData?.locationImageUrl}
      />
      <Carousel
        variant="tournament"
        title="Otvorena natjecanja"
        items={tournamentItems}
      />
    </div>
  );
}
