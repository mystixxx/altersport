import LandingTabs from "./landing-tabs";
import { useState, useEffect, useRef } from "react";
import PlanMatchCard from "./plan-match-card";
import type { MatchRecord } from "@/lib/services/airtable";
import Loader from "@/components/ui/loader";

interface ResultsProps {
  clubMatches: MatchRecord[];
  currentClubId?: string;
  leagueView?: boolean;
}

export default function Results({
  clubMatches = [],
  currentClubId,
  leagueView = false,
}: ResultsProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [filteredMatches, setFilteredMatches] = useState<MatchRecord[]>([]);
  const [teamData, setTeamData] = useState<Record<string, any>>({});
  const [locationData, setLocationData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Vertical carousel state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  // Function to check scroll position and update buttons/gradient visibility
  const checkScrollButtons = () => {
    if (!carouselRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = carouselRef.current;
    const maxScrollHeight = scrollHeight - clientHeight;

    setCanScrollUp(scrollTop > 0);
    setCanScrollDown(scrollTop < maxScrollHeight - 10);

    // Calculate scroll percentage
    setScrollPercentage(
      maxScrollHeight > 0 ? (scrollTop / maxScrollHeight) * 100 : 0,
    );
  };

  // Add scroll event listener
  useEffect(() => {
    checkScrollButtons();

    const currentRef = carouselRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScrollButtons);
      setTimeout(checkScrollButtons, 500);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScrollButtons);
      }
    };
  }, [filteredMatches]);

  // Filter matches based on active tab
  useEffect(() => {
    if (!clubMatches.length) {
      setIsLoading(false);
      return;
    }

    const today = new Date();

    if (activeTab === "all") {
      setFilteredMatches(clubMatches);
    } else if (activeTab === "upcoming") {
      // Filter for upcoming matches
      const upcoming = clubMatches.filter((match) => {
        const matchDate = parseMatchDate(match.matchDate);
        return matchDate && matchDate >= today;
      });
      setFilteredMatches(upcoming);
    } else if (activeTab === "previous") {
      // Filter for previous matches
      const previous = clubMatches.filter((match) => {
        const matchDate = parseMatchDate(match.matchDate);
        return (
          matchDate &&
          matchDate < today &&
          match.homeTeamScore !== undefined &&
          match.awayTeamScore !== undefined
        );
      });
      setFilteredMatches(previous);
    }
  }, [activeTab, clubMatches]);

  // Helper function to parse date from Croatian format "dd.mm.yyyy."
  const parseMatchDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;

    // Remove the trailing dot if it exists
    const cleanDateStr = dateStr.endsWith(".") ? dateStr.slice(0, -1) : dateStr;
    const parts = cleanDateStr.split(".");

    if (parts.length < 3) return null;

    // Ensure we have strings before parsing
    const day = parseInt(parts[0] || "1", 10);
    const month = parseInt(parts[1] || "0", 10) - 1;
    const year = parseInt(parts[2] || "2000", 10);

    return new Date(year, month, day);
  };

  // Load team and location data for all matches
  useEffect(() => {
    if (!clubMatches.length) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Collect all team and location IDs
    const teamIds = new Set<string>();
    const locationIds = new Set<string>();

    clubMatches.forEach((match) => {
      if (match.homeTeam && match.homeTeam.length) {
        match.homeTeam.forEach((id) => teamIds.add(id));
      }
      if (match.awayTeam && match.awayTeam.length) {
        match.awayTeam.forEach((id) => teamIds.add(id));
      }
      if (match.location && match.location.length) {
        match.location.forEach((id) => locationIds.add(id));
      }
    });

    // Function to fetch team data
    const fetchTeamData = async (id: string) => {
      try {
        const response = await fetch(`/api/airtable/teams?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch team");
        const data = await response.json();
        return { id, data };
      } catch (error) {
        console.error(`Error fetching team ${id}:`, error);
        return { id, data: null };
      }
    };

    // Function to fetch location data
    const fetchLocationData = async (id: string) => {
      try {
        const response = await fetch(`/api/airtable/locations?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch location");
        const data = await response.json();
        return { id, data };
      } catch (error) {
        console.error(`Error fetching location ${id}:`, error);
        return { id, data: null };
      }
    };

    // Fetch teams and locations in parallel
    Promise.all([
      ...Array.from(teamIds).map(fetchTeamData),
      ...Array.from(locationIds).map(fetchLocationData),
    ])
      .then((results) => {
        const newTeamData: Record<string, any> = {};
        const newLocationData: Record<string, any> = {};

        results.forEach(({ id, data }) => {
          if (!data) return;

          // Check if this is a team or location by looking at properties
          if (data.venueName) {
            newLocationData[id] = data;
          } else if (data.name) {
            newTeamData[id] = data;
          }
        });

        setTeamData(newTeamData);
        setLocationData(newLocationData);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [clubMatches]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const getTeamInfo = (teamId: string | undefined) => {
    if (!teamId) return { name: "Unknown Team", logoUrl: "" };

    const team = teamData[teamId];
    if (!team) return { name: "Loading...", logoUrl: "" };

    return {
      name: team.name,
      logoUrl:
        team.logo && team.logo.length > 0 && team.logo[0].url
          ? team.logo[0].url
          : "",
    };
  };

  const getLocationName = (locationId: string | undefined) => {
    if (!locationId) return undefined;

    const location = locationData[locationId];
    if (!location) return undefined;

    return location.venueName;
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-white">Rezultati</h2>

      <LandingTabs
        tabs={[
          { label: "Sve", id: "all" },
          { label: "Nadolazeće", id: "upcoming" },
          { label: "Prethodno", id: "previous" },
          { label: "Omiljeno", id: "favorites" },
        ]}
        defaultActiveTab="all"
        onTabChange={handleTabChange}
      />

      <div className="relative h-[382px] w-full overflow-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader />
          </div>
        ) : (activeTab === "all" ||
            activeTab === "upcoming" ||
            activeTab === "previous") &&
          filteredMatches.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-white/70">
              {activeTab === "upcoming"
                ? "Nema nadolazećih utakmica"
                : activeTab === "previous"
                  ? "Nema prethodnih utakmica"
                  : "Nema utakmica za prikaz"}
            </p>
          </div>
        ) : activeTab === "favorites" ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-white/70">Omiljeni rezultati</p>
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="no-scrollbar flex h-full flex-col gap-4 overflow-y-auto scroll-smooth pr-4"
            style={{ width: "100%", maxWidth: "100%" }}
          >
            {filteredMatches.map((match) => {
              const homeTeamId =
                match.homeTeam && match.homeTeam.length > 0
                  ? match.homeTeam[0]
                  : undefined;
              const awayTeamId =
                match.awayTeam && match.awayTeam.length > 0
                  ? match.awayTeam[0]
                  : undefined;
              const locationId =
                match.location && match.location.length > 0
                  ? match.location[0]
                  : undefined;

              const homeTeam = getTeamInfo(homeTeamId);
              const awayTeam = getTeamInfo(awayTeamId);
              const locationName = getLocationName(locationId);

              const isPastMatch =
                match.homeTeamScore !== undefined &&
                match.awayTeamScore !== undefined;

              // Check if current club is the away team
              const isCurrentClubAway =
                currentClubId &&
                match.awayTeam &&
                match.awayTeam.includes(currentClubId);

              // If the current club is the away team, swap the teams and scores for display
              if (isCurrentClubAway) {
                return (
                  <PlanMatchCard
                    key={match.id}
                    variant={isPastMatch ? "finished" : "upcoming"}
                    // Swap teams to show current club first
                    homeTeam={awayTeam}
                    awayTeam={homeTeam}
                    // Swap scores too if it's a past match
                    homeTeamResult={match.awayTeamScore}
                    awayTeamResult={match.homeTeamScore}
                    matchDate={match.matchDate}
                    matchTime={match.matchTime}
                    locationName={locationName}
                  />
                );
              }

              // Default display when current club is home team or if currentClubId isn't provided
              return (
                <PlanMatchCard
                  key={match.id}
                  variant={isPastMatch ? "finished" : "upcoming"}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  homeTeamResult={match.homeTeamScore}
                  awayTeamResult={match.awayTeamScore}
                  matchDate={match.matchDate}
                  matchTime={match.matchTime}
                  locationName={locationName}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
