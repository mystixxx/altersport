import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Check, X, Slash } from "lucide-react";
import Loader from "@/components/ui/loader";
import { useTeam, useTeamsByCategory } from "@/hooks/queries/useTeams";
import type { TeamRecord } from "@/lib/services/airtable";

interface RankingTableProps {
  clubId?: string;
  clubIds?: string[];
  leagueId?: string;
}

interface TeamWithRankingData extends TeamRecord {
  position: number;
  played: number;
  recentResults: ("win" | "loss" | "draw" | "none")[];
}

const RankingTable: React.FC<RankingTableProps> = ({
  clubId,
  clubIds,
  leagueId,
}) => {
  const [rankedTeams, setRankedTeams] = useState<TeamWithRankingData[]>([]);

  // Support both single clubId and array of clubIds for backward compatibility
  const allClubIds = clubId
    ? clubIds
      ? [...clubIds, clubId]
      : [clubId]
    : clubIds || [];

  // Get first club ID for category detection (if any)
  const firstClubId = allClubIds.length > 0 ? allClubIds[0] : "";

  const { data: currentTeam, isLoading: currentTeamLoading } = useTeam(
    firstClubId || "",
  );

  // Handle different ways of getting the category based on clubId or leagueId
  const categoryId = leagueId || currentTeam?.category?.[0] || "";
  const isLoading =
    allClubIds.length > 0 && !leagueId ? currentTeamLoading : false;

  const { data: categoryTeams, isLoading: categoryTeamsLoading } =
    useTeamsByCategory(categoryId);

  useEffect(() => {
    if (categoryTeams && categoryTeams.length > 0) {
      // Process teams to add ranking data
      const teamsWithRanking = categoryTeams
        .map((team) => {
          // Calculate played matches
          const played =
            (team.wins || 0) + (team.losses || 0) + (team.draws || 0);

          // Generate random recent results for demo
          // In a real app, this would come from match history
          const recentResults: ("win" | "loss" | "draw" | "none")[] = [];
          const resultTypes = ["win", "loss", "draw"] as const;
          for (let i = 0; i < 5; i++) {
            if (played > i) {
              // Ensure index is within bounds and type is correct
              const randomIndex = Math.floor(
                Math.random() * resultTypes.length,
              ) as 0 | 1 | 2;
              recentResults.push(resultTypes[randomIndex]);
            } else {
              recentResults.push("none");
            }
          }

          return {
            ...team,
            position: 0, // Will be calculated below
            played,
            recentResults,
          };
        })
        // Sort by points descending
        .sort((a, b) => (b.points || 0) - (a.points || 0));

      // Assign positions after sorting
      teamsWithRanking.forEach((team, index) => {
        team.position = index + 1;
      });

      setRankedTeams(teamsWithRanking);
    }
  }, [categoryTeams]);

  console.log(currentTeam);

  const getResultIcon = (result: "win" | "loss" | "draw" | "none") => {
    switch (result) {
      case "win":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6A8E00]">
            <Check className="size-4 text-white" />
          </div>
        );
      case "loss":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#AE2718]">
            <X className="size-4 text-white" />
          </div>
        );
      case "draw":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#545270]">
            <Slash className="size-3 text-white" />
          </div>
        );
      default:
        return (
          <div className="h-6 w-6 rounded-full border-2 border-white"></div>
        );
    }
  };

  // Helper function to check if team is one of the highlighted teams
  const isHighlightedTeam = (teamId: string) => {
    return allClubIds.includes(teamId);
  };

  // Define bg color classes for highlighted teams
  const getTeamBgClass = (teamId: string, index: number) => {
    if (!isHighlightedTeam(teamId)) return "bg-[#0E0C28]";

    // If we have multiple teams to highlight, use different colors
    if (allClubIds.length > 1) {
      const teamIndex = allClubIds.indexOf(teamId);
      return teamIndex === 0 ? "bg-[#2F063B]" : "bg-[#063B37]"; // First team purple, second team teal
    }

    return "bg-[#2F063B]"; // Default highlight color
  };

  if (isLoading || categoryTeamsLoading) {
    return (
      <div className="flex h-[460px] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!rankedTeams || rankedTeams.length === 0) {
    return (
      <div className="flex h-[460px] w-full items-center justify-center text-white">
        <p>Nema dostupnih podataka za tablicu</p>
      </div>
    );
  }

  return (
    <div className="no-scrollbar max-h-[460px] w-full overflow-y-auto rounded-lg text-white">
      <div className="w-full">
        <div className="mb-2 grid grid-cols-3 px-4 py-3 text-sm text-white">
          <div className="text-left font-bold">Klub</div>
          <div className="flex justify-between space-x-1 font-medium">
            <span className="w-6 text-center">OU</span>
            <span className="w-6 text-center">POB</span>
            <span className="w-6 text-center">NER</span>
            <span className="w-6 text-center">IZG</span>
            <span className="w-6 text-center">Bod</span>
          </div>
          <div className="text-right font-bold">Posljednjih pet</div>
        </div>

        <div className="space-y-1">
          {rankedTeams.map((team, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-3 rounded-2xl px-4 py-3 transition-colors ${getTeamBgClass(team.id, idx)}`}
            >
              <div className="my-auto">
                <div className="flex items-center">
                  <div className="w-8 text-lg font-bold">{team.position}</div>
                  <div className="mr-3 flex items-center justify-center">
                    <Image
                      src={
                        (team.logo && team.logo[0]?.url) || "/placeholder.svg"
                      }
                      alt={team.name}
                      width={42}
                      height={42}
                      className="mr-2 size-10 object-contain"
                    />
                  </div>
                  <span className="font-medium">{team.name}</span>
                </div>
              </div>
              <div className="my-auto">
                <div className="item flex justify-between space-x-1 font-medium">
                  <span className="w-6 text-center">
                    {team.played.toFixed(0)}
                  </span>
                  <span className="w-6 text-center">
                    {team.wins.toFixed(0)}
                  </span>
                  <span className="w-6 text-center">
                    {team.draws.toFixed(0)}
                  </span>
                  <span className="w-6 text-center">
                    {team.losses.toFixed(0)}
                  </span>
                  <span className="w-6 text-center font-bold">
                    {team.points.toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="my-auto">
                <div className="flex justify-end space-x-1">
                  {team.recentResults.map((result, i) => (
                    <div key={i}>{getResultIcon(result)}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingTable;
