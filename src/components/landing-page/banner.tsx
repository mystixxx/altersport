import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function Banner({
  title = "Otkrij novi sport za sebe!",
  description = "Odgovori na kratke pitalice i predložimo ti sportove u blizini.",
  buttonText = "Ispuni Kviz",
  imageSrc = "/banner_sport.png",
  imageAlt = "Banner Image",
}: BannerProps = {}) {
  return (
    <div className="relative flex flex-col gap-20 overflow-hidden rounded-2xl bg-[url('/banner_gradinet.svg')] bg-cover bg-center px-6 py-8">
      <div className="flex max-w-lg flex-col gap-3">
        <h2 className="text-4xl font-bold text-white">{title}</h2>
        <p className="text-base font-medium text-white">{description}</p>
      </div>
      <Link href="/onboarding">
        <button className="bg-cta hover:bg-cta/80 flex w-fit cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm text-white transition-all duration-300">
          {buttonText}
          <ArrowRight size={16} color="white" />
        </button>
      </Link>
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={420}
        height={360}
        priority
        className="absolute top-3 right-20"
      />
    </div>
  );
}
