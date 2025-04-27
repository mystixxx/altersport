import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "motion";

type HeaderProps = {
  title: string;
  buttonText: string;
  buttonIcon: React.ReactNode;
  onClick?: () => void;
};

const Header = ({ title, buttonText, buttonIcon, onClick }: HeaderProps) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [titleRendered, setTitleRendered] = useState(false);

  useEffect(() => {
    if (titleRef.current && !titleRendered) {
      const characters = title.split("");
      const spans = characters.map((char, i) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.opacity = "0";
        span.style.display = "inline-block";
        return span;
      });

      // Clear and append all spans
      titleRef.current.innerHTML = "";
      spans.forEach((span) => titleRef.current?.appendChild(span));
      setTitleRendered(true);

      animate(
        spans,
        {
          opacity: [0, 1],
          y: [10, 0],
        } as any,
        {
          delay: stagger(0.03),
          duration: 0.6,
          easing: [0.25, 0.1, 0.25, 1],
        } as any,
      );
    }

    if (buttonRef.current) {
      animate(
        buttonRef.current,
        {
          opacity: [0, 1],
          x: [100, 0],
        } as any,
        {
          duration: 0.4,
          easing: [0.25, 0.1, 0.25, 1],
        } as any,
      );
    }
  }, [title, titleRendered]);

  return (
    <div ref={headerRef} className="flex items-center justify-between py-7">
      <div ref={titleRef} className="text-2xl font-bold text-black"></div>
      <Button
        ref={buttonRef}
        className="bg-[#BBFA01] text-black hover:bg-[#99cc00]"
        onClick={onClick}
      >
        <span>{buttonIcon}</span>
        <span>{buttonText}</span>
      </Button>
    </div>
  );
};

export default Header;
