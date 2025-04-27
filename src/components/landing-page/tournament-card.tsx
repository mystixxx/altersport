import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface TournamentCardProps {
  image: string;
  category: string;
  title: string;
  time: string;
  date: string;
  location: string;
}

export default function TournamentCard({
  image,
  category,
  title,
  time,
  date,
  location,
}: TournamentCardProps) {
  return (
    <div className="flex min-h-60 min-w-80 cursor-pointer flex-col gap-4 rounded-2xl bg-[#0E0C28] p-4">
      <div className="relative h-full w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="rounded-2xl object-cover object-center"
        />
        <div className="absolute top-0 right-0 left-0 p-2.5">
          <Badge
            variant="destructive"
            className="rounded-full bg-[#BA2D42] px-4 py-0.5"
          >
            <p className="text-sm font-semibold uppercase">{category}</p>
          </Badge>
        </div>
      </div>
      <div className="flex flex-col text-white">
        <h3 className="text-lg font-bold">
          {title} · {time}
        </h3>
        <p className="text-sm font-normal">
          {date} · {location}
        </p>
      </div>
    </div>
  );
}
