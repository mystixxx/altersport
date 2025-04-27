"use client";

import { useState, useRef, useEffect } from "react";
import ClubCard from "./club-card";
import Loader from "@/components/ui/loader";

interface ClubItem {
  id?: string;
  name: string;
  location: string;
  logoUrl: string;
  isFavorite?: boolean;
  sport?: string[];
}

interface CarouselVerticalProps {
  title?: string;
  items: ClubItem[];
  sportId?: string;
  isLoading?: boolean;
  suggestedSport?: boolean;
}

export default function CarouselVertical({
  title = "Preporučeni klubovi",
  items = [],
  sportId = "",
  isLoading = false,
  suggestedSport = false,
}: CarouselVerticalProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  console.log(sportId);

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

  useEffect(() => {
    // Initial check
    checkScrollButtons();

    // Add scroll event listener
    const currentRef = carouselRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScrollButtons);

      // Check after content might have changed
      setTimeout(checkScrollButtons, 500);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScrollButtons);
      }
    };
  }, [items]);

  // Filter items by sportId if provided
  const displayItems = sportId
    ? items.filter((item) => item.sport && item.sport.includes(sportId))
    : items;

  return (
    <div className="flex w-full flex-col gap-6 overflow-y-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>

      <div
        className={`relative ${
          suggestedSport ? "h-[230px]" : "h-[670px]"
        } w-full overflow-hidden`}
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader />
          </div>
        ) : displayItems.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-white/70">
              Nema dostupnih klubova za odabrani sport
            </p>
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="no-scrollbar flex h-full flex-col gap-4 overflow-y-auto scroll-smooth pr-4"
            style={{ width: "100%", maxWidth: "100%" }}
          >
            {displayItems.map((item, index) => (
              <ClubCard
                key={index}
                name={item.name}
                location={item.location}
                logoUrl={item.logoUrl}
                isFavorite={item.isFavorite}
                sportId={sportId}
                id={item.id || `${index}`}
                onFavoriteToggle={() => {
                  // Handle favorite toggle logic here
                }}
              />
            ))}
          </div>
        )}
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#070314]/70 via-[#070314]/50 via-60% to-transparent transition-opacity duration-300"
          style={{ opacity: scrollPercentage >= 80 ? 0 : 1 }}
        />
      </div>
    </div>
  );
}
