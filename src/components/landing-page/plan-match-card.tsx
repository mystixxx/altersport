import { Star } from "lucide-react";
import Image from "next/image";

interface TeamProps {
  name: string;
  logoUrl: string;
}

function TeamDisplay({ name, logoUrl }: TeamProps) {
  return (
    <div className="flex h-full w-32 flex-col items-center justify-between gap-2">
      <div className="relative size-12">
        <Image
          src={logoUrl || "/placeholder.svg"}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="font-regular mt-1.5 max-w-full text-center text-xs text-white">
        {name}
      </h3>
    </div>
  );
}

export interface PlanMatchCardProps {
  variant: "upcoming" | "finished";
  homeTeam: {
    name: string;
    logoUrl: string;
  };
  awayTeam: {
    name: string;
    logoUrl: string;
  };
  homeTeamResult?: number;
  awayTeamResult?: number;
  matchDate?: string;
  matchTime?: string;
  locationName?: string;
}

export default function PlanMatchCard({
  variant = "upcoming",
  homeTeam,
  awayTeam,
  homeTeamResult = 0,
  awayTeamResult = 0,
  matchDate,
  matchTime,
  locationName,
}: PlanMatchCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#0E0C28] p-4">
      <div className="flex flex-col gap-1">
        <p className="text-base font-bold text-white">
          {locationName || "Venue TBD"} · {matchTime || "TBD"}
        </p>
        <p className="text-sm text-white/80">{matchDate || "Date TBD"}</p>
      </div>
      <div className="flex items-center gap-10">
        <div className="flex items-stretch">
          <TeamDisplay name={homeTeam.name} logoUrl={homeTeam.logoUrl} />
          {variant === "upcoming" ? (
            <div className="mb-7 h-12 w-[1px] bg-[#FAFAFA]" />
          ) : (
            <p className="mt-3.5 text-4xl font-semibold tracking-[5px] text-white">
              {homeTeamResult}:{awayTeamResult}
            </p>
          )}
          <TeamDisplay name={awayTeam.name} logoUrl={awayTeam.logoUrl} />
        </div>
        <Star
          size={24}
          color="white"
          opacity={0.8}
          fill="none"
          className="cursor-pointer transition-colors duration-300 ease-in-out"
        />
      </div>
    </div>
  );
}
