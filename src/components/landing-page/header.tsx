"use client";

import { useState } from "react";
import { CalendarLanding } from "@/components/ui/calendar-landing";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SearchInput from "./search-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDate } from "@/lib/utils";

export default function Header() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const goToPreviousDay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (date) {
      const prevDay = new Date(date);
      prevDay.setDate(prevDay.getDate() - 1);
      setDate(prevDay);
    }
  };

  const goToNextDay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (date) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setDate(nextDay);
    }
  };

  return (
    <div className="flex w-full items-center justify-center gap-4 p-4">
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "gap-2 rounded-full border-white/30 bg-[#966498]/10 text-left font-normal text-[#DCE0E3] hover:bg-[#966498]/20 hover:text-white",
              )}
            >
              <ChevronLeft
                className="size-5 cursor-pointer"
                color="white"
                onClick={goToPreviousDay}
              />
              <CalendarIcon className="size-5" color="#F66467" />
              {date ? (
                formatDate(date.toISOString())
              ) : (
                <span>Odaberi datum</span>
              )}
              <ChevronRight
                className="size-5 cursor-pointer"
                color="white"
                onClick={goToNextDay}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto border-none p-0" align="start">
            <CalendarLanding
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <SearchInput />
        <Button className="bg-cta hover:bg-cta/80 w-fit rounded-full px-4 py-2 text-sm font-semibold text-white">
          Pretraži
        </Button>
      </div>
    </div>
  );
}
