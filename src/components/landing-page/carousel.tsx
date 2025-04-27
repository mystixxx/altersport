"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MatchCard from "./match-card";
import TournamentCard from "./tournament-card";

interface CarouselProps {
  variant?: "match" | "tournament";
  title?: string;
  items: any[];
  isLoading?: boolean;
}

export default function Carousel({
  variant = "match",
  title = "Preporučeni događaji",
  items = [],
  isLoading = false,
}: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const checkScrollButtons = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const maxScrollWidth = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < maxScrollWidth - 10);

    // Calculate scroll percentage
    setScrollPercentage(
      maxScrollWidth > 0 ? (scrollLeft / maxScrollWidth) * 100 : 0,
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
  }, []);

  // Re-check scroll state when items change
  useEffect(() => {
    checkScrollButtons();
  }, [items]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const scrollAmount = 408; // Width of a card (396px) + gap (12px)
    const currentScroll = carouselRef.current.scrollLeft;
    const newScroll =
      direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

    carouselRef.current.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });
  };

  // Default sample data if no items provided
  const defaultItems =
    variant === "match"
      ? [
          { variant: "upcoming" as const },
          { isFavorite: false, variant: "upcoming" as const },
          { variant: "result" as const },
          { variant: "result" as const },
          { variant: "result" as const },
        ]
      : [
          {
            image: "/natjecanja/maraton.png",
            category: "Trčanje",
            title: "Zagrebački maraton",
            time: "18:30",
            date: "11.9.2024",
            location: "Trg bana Josipa Jelačića",
          },
          {
            image: "/natjecanja/biciklizam.png",
            category: "Biciklizam",
            title: "Zagreb Tour",
            time: "10:00",
            date: "15.9.2024",
            location: "Jarun",
          },
          {
            image: "/natjecanja/plivanje.png",
            category: "Plivanje",
            title: "Plivački miting",
            time: "16:00",
            date: "20.9.2024",
            location: "Mladost",
          },
        ];

  // Use provided items, fall back to defaults if empty and not loading
  const displayItems =
    items.length > 0 ? items : !isLoading ? defaultItems : items;

  // Skeleton card renderer for loading state
  const renderCard = (itemProps: any, index: number) => {
    if (itemProps.isLoading) {
      return (
        <div
          key={itemProps.id || index}
          className="flex min-h-60 min-w-80 animate-pulse flex-col justify-between rounded-2xl bg-[#0E0C28]/50 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-[#1A1744]"></div>
            <div className="h-6 w-6 rounded-full bg-[#1A1744]"></div>
          </div>
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-[#1A1744]"></div>
              <div className="mt-1.5 h-4 w-16 rounded bg-[#1A1744]"></div>
            </div>
            <div className="mb-7 h-12 w-[1px] bg-[#1A1744]"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-[#1A1744]"></div>
              <div className="mt-1.5 h-4 w-16 rounded bg-[#1A1744]"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="h-6 w-32 rounded bg-[#1A1744]"></div>
              <div className="mt-1 h-4 w-20 rounded bg-[#1A1744]"></div>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#1A1744]"></div>
          </div>
        </div>
      );
    }

    return variant === "match" ? (
      <MatchCard key={index} {...itemProps} />
    ) : (
      <TournamentCard key={index} {...itemProps} />
    );
  };

  return (
    <div className="flex h-full w-full flex-col gap-6 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scrollCarousel("left")}
            disabled={!canScrollLeft}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#0E0C28] text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scrollCarousel("right")}
            disabled={!canScrollRight}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#0E0C28] text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <div
          ref={carouselRef}
          className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth"
          style={{ width: "100%", maxWidth: "100%" }}
        >
          {displayItems.map((itemProps, index) => renderCard(itemProps, index))}
        </div>
        <div
          className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#070314]/70 via-[#070314]/50 via-60% to-transparent transition-opacity duration-300"
          style={{ opacity: scrollPercentage >= 80 ? 0 : 1 }}
        />
      </div>
    </div>
  );
}
