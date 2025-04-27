import RankingTable from "./ranking-table";

interface RankingProps {
  clubId?: string;
  clubIds?: string[];
  leagueId?: string;
}

export default function Ranking({ clubId, clubIds, leagueId }: RankingProps) {
  // If clubId is provided, add it to clubIds for backward compatibility
  const allClubIds = clubId
    ? clubIds
      ? [...clubIds, clubId]
      : [clubId]
    : clubIds;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-white">Rezultati</h2>
      <RankingTable clubIds={allClubIds} leagueId={leagueId} />
    </div>
  );
}
