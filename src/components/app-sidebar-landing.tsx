"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  ChevronRightIcon,
  Dumbbell,
  Trophy,
  ArrowLeftIcon,
} from "lucide-react";
import {
  IconBallAmericanFootball,
  IconChessQueen,
  IconSoccerField,
  IconBallVolleyball,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useSports } from "@/hooks/queries/useSports";
import { useKategorijeBySport } from "@/hooks/queries/useKategorije";
import SearchInput from "./landing-page/search-input";
import FieldHockey from "./icons/FieldHockey";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Function to get the appropriate icon based on sport's icon field
const getSportIcon = (iconName: string) => {
  const size = 24;

  switch (iconName) {
    case "rugby":
      return <IconBallAmericanFootball size={size} />;
    case "chess":
      return <IconChessQueen size={size} />;
    case "soccer":
      return <IconSoccerField size={size} />;
    case "volleyball":
      return <IconBallVolleyball size={size} />;
    case "field_hockey":
      return <FieldHockey />;
    default:
      return <Dumbbell size={size} />;
  }
};

// Props for the AppSidebarLanding component
interface AppSidebarLandingProps extends React.ComponentProps<typeof Sidebar> {
  viewType?: "sport" | "league";
  selectedSportId?: string;
}

export function AppSidebarLanding({
  viewType = "sport",
  selectedSportId,
  ...props
}: AppSidebarLandingProps) {
  const { data: sports, isLoading: sportsLoading } = useSports();
  const { data: leagues, isLoading: leaguesLoading } =
    useKategorijeBySport(selectedSportId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Set selected sport when sportId changes
  useEffect(() => {
    if (selectedSportId && sports) {
      const sport = sports.find((s) => s.id === selectedSportId);
      if (sport) {
        setSelectedSport({ id: sport.id, name: sport.name });
      }
    }
  }, [selectedSportId, sports]);

  // Filter sports based on search query
  const filteredSports = sports?.filter((sport) =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter leagues based on search query
  const filteredLeagues = leagues?.filter((league) =>
    league.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isLoading = viewType === "sport" ? sportsLoading : leaguesLoading;
  const items = viewType === "sport" ? filteredSports : filteredLeagues;

  return (
    <Sidebar {...props} innerClassName="bg-[#1B0E28]">
      <SidebarHeader className="px-4">
        <Link href="/home">
          <h1 className="mt-6 text-2xl font-bold text-white">ALTERSPORT</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="mt-3">
        {/* Leagues/Sports Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <SidebarMenuItem key={`skeleton-${index}`}>
                      <SidebarMenuButton variant="landing">
                        <div className="h-6 w-6 animate-pulse rounded-full bg-white/20" />
                        <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
              ) : (
                <div className="flex flex-col gap-2">
                  <SearchInput
                    className="w-fit pr-7"
                    outerClassName="mb-2"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder={
                      viewType === "sport"
                        ? "Pretraži sportove..."
                        : "Pretraži lige..."
                    }
                  />
                  {viewType === "league" && (
                    <div className="flex flex-col gap-2">
                      <Link href="/home">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start py-4 text-white hover:bg-[#0E0C28] hover:text-white"
                        >
                          <ArrowLeftIcon className="size-4" />
                          Natrag na sportove
                        </Button>
                      </Link>
                      <Separator className="bg-white/50" />
                    </div>
                  )}
                  {items && items.length > 0 ? (
                    viewType === "sport" &&
                    filteredSports &&
                    filteredSports.length > 0 ? (
                      filteredSports.map((sport) => (
                        <SidebarMenuItem key={sport.id}>
                          <SidebarMenuButton asChild variant="landing">
                            <a href={`/sports/${sport.id}`}>
                              {getSportIcon(sport.icon)}
                              {sport.name}
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    ) : viewType === "league" ? (
                      <>
                        <h2 className="mt-2 pl-1 text-lg font-semibold text-white">
                          {selectedSport?.name || ""}
                        </h2>
                        {filteredLeagues && filteredLeagues.length > 0 ? (
                          filteredLeagues.map((league) => (
                            <SidebarMenuItem key={league.id}>
                              <SidebarMenuButton asChild variant="landing">
                                <a
                                  href={`/sports/${selectedSport?.id}/league/${league.id}`}
                                >
                                  <Trophy size={20} />
                                  {league.name}
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))
                        ) : (
                          <SidebarMenuItem>
                            <SidebarMenuButton variant="landing">
                              <span className="text-white/60">
                                Nema dostupnih liga
                              </span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )}
                      </>
                    ) : (
                      <SidebarMenuItem>
                        <SidebarMenuButton variant="landing">
                          <span className="text-white/60">
                            {viewType === "sport"
                              ? "Nema dostupnih sportova"
                              : "Nema dostupnih liga"}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton variant="landing">
                        <span className="text-white/60">
                          {viewType === "sport"
                            ? "Nema dostupnih sportova"
                            : "Nema dostupnih liga"}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 px-2 pb-5">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback className="bg-[#401146] text-white">
                IP
              </AvatarFallback>
            </Avatar>
            <div className="text-text-whiteish">
              <p className="text-sm font-semibold">Ilija Popović</p>
              <p className="text-xs">ilija.popovic@gmail.com</p>
            </div>
          </div>
          <ChevronRightIcon className="size-4 cursor-pointer" color="#F8F5F9" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
