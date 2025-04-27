import { MailIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import type { TeamRecord } from "@/lib/services/airtable";

interface TitleHeaderProps {
  club?: TeamRecord;
  title?: string;
  subtitle?: string;
}

export default function TitleHeader({
  club,
  title,
  subtitle,
}: TitleHeaderProps) {
  // If club is provided, use club data
  const displayTitle = club ? club.name : title;

  return (
    <div className="flex flex-col gap-6">
      {club && (
        <Image
          src={club.logo?.[0]?.url || "/placeholder.svg"}
          alt={`${club.name} logo`}
          width={116}
          height={116}
          className=""
        />
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold text-white">{displayTitle}</h2>
        <div className="flex items-center gap-3">
          <Image
            src="/social_media/yt.svg"
            alt="Youtube"
            width={46}
            height={46}
            className="cursor-pointer"
          />
          <Image
            src="/social_media/instagram.svg"
            alt="Instagram"
            width={46}
            height={46}
            className="cursor-pointer"
          />
          <Image
            src="/social_media/facebook.svg"
            alt="Facebook"
            width={46}
            height={46}
            className="cursor-pointer"
          />
        </div>
      </div>
      {club ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <MapPinIcon strokeWidth={2} className="size-5 text-white" />
            <p className="font-normal text-white">
              {club.address || "No address available"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <MailIcon strokeWidth={2} className="size-5 text-white" />
            <p className="font-normal text-white">
              {club.website || "No contact available"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="font-normal text-white">{subtitle}</p>
        </div>
      )}
    </div>
  );
}
