"use client";

import { Wrench, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface UnderProgressProps {
  title?: string;
  description?: string;
  showBack?: boolean;
}

export default function UnderProgress({
  title = "Under Construction",
  description = "We're working hard to bring this feature to life. Check back soon!",
  showBack = true,
}: UnderProgressProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">

      {/* Animated icon */}
      <div className="relative mb-8">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-40 scale-110" />
        {/* Middle ring */}
        <div className="absolute inset-0 rounded-full bg-primary/5 scale-125" />
        {/* Icon container */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border border-primary/20">
          <Wrench className="h-10 w-10 text-primary animate-[wiggle_2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden mb-8">
        <div className="h-full rounded-full bg-primary animate-[progress_2.5s_ease-in-out_infinite]" />
      </div>

      {/* Text */}
      <div className="space-y-2 max-w-sm">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            In Progress
          </span>
        </div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>

      {/* Back button */}
      {showBack && (
        <Button
          variant="outline"
          className="mt-8 rounded-full gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      )}

      {/* Inline keyframe styles */}
      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes progress {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>

    </div>
  );
}