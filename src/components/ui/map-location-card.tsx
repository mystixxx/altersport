import { Globe, MapPin, Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface Location {
  id: string;
  label: string;
  imageUrl?: string;
  sport: string[];
  address: string;
  position: { lat: number; lng: number };
  website?: string;
}

interface MapLocationCardProps {
  location: Location;
  favorite: boolean;
  handleToggleFavorite: () => void;
}

export const MapLocationCard = ({
  location,
  favorite,
  handleToggleFavorite,
}: MapLocationCardProps) => {
  const name = location.label;
  const address = location.address;
  const logoImage = location.imageUrl;
  const website = location.website;

  // Get the first sport ID for the club (if available)
  // The club page expects a sport ID, so we'll use the first one
  const sportId =
    location.sport && location.sport.length > 0 ? location.sport[0] : "default";

  return (
    <div className="absolute top-2 left-4 z-30 min-w-80">
      <div className="flex flex-col gap-6 rounded-md bg-[#13091B] p-4">
        <header className="flex flex-row items-center justify-between gap-16">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <Star
            size={24}
            color={favorite ? "var(--selected)" : "white"}
            opacity={favorite ? 1 : 0.8}
            fill={favorite ? "var(--selected)" : "none"}
            className="cursor-pointer transition-colors duration-300 ease-in-out"
            onClick={handleToggleFavorite}
          />
        </header>

        <div className="relative h-48 w-full overflow-visible">
          <Image
            src={"/placeholder.svg"}
            alt={name}
            fill
            className="rounded-sm object-cover"
          />
          <div className="absolute -bottom-10 left-6 z-10">
            {logoImage && (
              <Image src={logoImage} alt={name} width={74} height={74} />
            )}
          </div>
        </div>

        <div className="mt-8 mb-4 flex flex-col gap-2">
          {website && (
            <div className="flex flex-row items-center gap-2 text-sm text-white">
              <Link
                href={website || ""}
                target="_blank"
                className="flex flex-row items-center gap-2 underline underline-offset-4"
              >
                <Globe className="text-selected size-4" />
                {website}
              </Link>
            </div>
          )}
          <div className="flex flex-row items-center gap-2 text-sm text-white">
            <MapPin className="text-selected size-4" />
            {address}
          </div>
        </div>

        <div className="mb-2 flex justify-end">
          <Link href={`/sports/${sportId}/club/${location.id}`}>
            <Button className="bg-cta hover:bg-cta/80 w-fit rounded-full px-4 py-2 text-sm font-semibold text-white">
              Pogledaj profil
              <ArrowRight className="size-4" color="white" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MapLocationCard;
