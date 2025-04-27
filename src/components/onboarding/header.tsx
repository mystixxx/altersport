import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingHeader({
  currentStep,
  totalSteps,
}: OnboardingHeaderProps) {
  // Create an array of steps for rendering
  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  return (
    <header className="flex w-full items-center justify-between px-6 py-4">
      <div className="flex items-center">
        <Link href="/home">
          <Button variant="ghost" className="text-white">
            <ArrowLeft className="size-4" />
            Napusti Kviz
          </Button>
        </Link>
      </div>
      <div className="mx-auto flex gap-1">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`h-1.5 w-24 rounded ${
              step <= currentStep ? "bg-cta" : "bg-white"
            }`}
          />
        ))}
      </div>
      <div className="invisible">
        <Button variant="ghost" className="text-white">
          <ArrowLeft className="size-4" />
          Napusti Kviz
        </Button>
      </div>
    </header>
  );
}
