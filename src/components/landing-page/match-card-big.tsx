"use client";

import { Star, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TeamProps {
  name: string;
  logoUrl: string;
}

interface MatchProps {
  sport: string;
  homeTeam: TeamProps;
  awayTeam: TeamProps;
  venue: string;
  time: string;
  date: string;
  isFavorite?: boolean;
  variant?: "result" | "upcoming";
  homeTeamResult?: string;
  awayTeamResult?: string;
}

function TeamDisplay({ name, logoUrl }: TeamProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-12">
        <Image src={logoUrl} alt={name} fill className="object-contain" />
      </div>
      <h3 className="font-regular mt-1.5 text-center text-sm text-white">
        {name}
      </h3>
    </div>
  );
}

export default function MatchCardBig({
  sport = "Nogomet",
  homeTeam = {
    name: "NK Kralj Tomislav",
    logoUrl:
      "https://v5.airtableusercontent.com/v3/u/40/40/1745668800000/u328ZhzqyE0rUPsnT80PWw/0ioqiEZjH9r_mzTQzL5BrZ7sulTQPeEbOJ3F04WYvQMRt8VBhrGgQCeebsmB8xTq5DjYJSK-6YT-pkrFRLe-ODejlBIvlqFMvv4BQPjKtN6Pj72uuoU4_Q4AjTAkpki0Pg_5Ulp4Tr2PoupnvmUS1w/3u0nTEGrihNOU5FMMwA1-y0d3khzuZHWPV9Qnlj0lH0",
  },
  awayTeam = {
    name: "NK Studentski grad",
    logoUrl:
      "https://v5.airtableusercontent.com/v3/u/40/40/1745668800000/wUaZfCoqNqdn2G7mIE19FA/y0HDRhev0lQHfG20G5J_ra9ZOJkTJ54qu_22Id_lUGAmWWjEpdTPwGVATNAmQl-bRgZ2IbOv_UwpwJywQnCjT0Cso4icRVrn0h_6vbUJ2t20yg9Apb6UfrVay5YShCc9LqJz6fcDD3WIVlj9CQ16ew/hNGNFp8LvprJpqinIj0okwXJ3FiyowHG2bQZqogzQpo",
  },
  venue = "SC Savica",
  time = "18:30",
  date = "11.9.2024.",
  isFavorite = true,
  variant = "upcoming",
  homeTeamResult = "1",
  awayTeamResult = "2",
}: Partial<MatchProps>) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleToggleFavorite = () => {
    setFavorite(!favorite);
  };

  return (
    <div className="flex min-h-96 min-w-80 flex-col justify-between rounded-2xl bg-gradient-to-r from-[#0E0C28] via-[#0E0C28] via-50% to-[#B8252A]/20 p-4">
      <div className="flex items-center justify-between">
        <p className="text-white">{sport}</p>
        <Star
          size={24}
          color={favorite ? "var(--selected)" : "white"}
          opacity={favorite ? 1 : 0.8}
          fill={favorite ? "var(--selected)" : "none"}
          className="cursor-pointer transition-colors duration-300 ease-in-out"
          onClick={handleToggleFavorite}
        />
      </div>

      <div className="flex items-center justify-around">
        <TeamDisplay name={homeTeam.name} logoUrl={homeTeam.logoUrl} />
        {variant === "upcoming" ? (
          <div className="mb-7 h-12 w-[1px] bg-[#FAFAFA]" />
        ) : (
          <p className="mb-7 text-4xl font-semibold tracking-[5px] text-white">
            {homeTeamResult}:{awayTeamResult}
          </p>
        )}
        <TeamDisplay name={awayTeam.name} logoUrl={awayTeam.logoUrl} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col text-white">
          <p className="text-xl font-bold">
            {venue} · {time}
          </p>
          <p className="text-base font-normal">{date}</p>
        </div>
      </div>
    </div>
  );
}
