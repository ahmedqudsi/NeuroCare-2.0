"use client";

import { useState } from "react";
import { PhoneCall, MapPin, BookOpen, X } from "lucide-react";

export default function EmergencyBar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Expanded panel — slides up from the button */}
      <div
        className={`flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-xl shadow-black/10 p-2 transition-all duration-300 ease-in-out origin-bottom-right ${
          expanded
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
      >
        {/* Header label */}
        <div className="flex items-center gap-2 px-2 pt-1 pb-0.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Emergency Actions
          </span>
        </div>

        <div className="h-px bg-border" />

        {/* Call 112 */}
        <button
          onClick={() => (window.location.href = "tel:112")}
          className="group flex items-center gap-3 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 px-4 py-2.5 text-white text-sm font-semibold shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-200 w-full"
        >
          <PhoneCall className="h-4 w-4 group-hover:animate-pulse shrink-0" />
          Call Emergency (112)
        </button>

        {/* Nearby Hospital */}
        <button
          onClick={() =>
            window.open("https://www.google.com/maps/search/hospitals+near+me", "_blank")
          }
          className="group flex items-center gap-3 rounded-xl border border-border bg-card hover:bg-muted active:scale-95 px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 w-full"
        >
          <MapPin className="h-4 w-4 text-blue-500 group-hover:text-blue-600 shrink-0" />
          Nearby Hospital
        </button>

        {/* Stroke Guide */}
        <button
          onClick={() =>
            window.open("https://www.stroke.org/en/about-stroke/stroke-symptoms", "_blank")
          }
          className="group flex items-center gap-3 rounded-xl border border-border bg-card hover:bg-muted active:scale-95 px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 w-full"
        >
          <BookOpen className="h-4 w-4 text-emerald-500 group-hover:text-emerald-600 shrink-0" />
          Stroke Guide
        </button>

        <p className="text-[10px] text-muted-foreground/50 text-center pb-1">
          Every second counts during a stroke
        </p>
      </div>

      {/* Collapsed trigger pill */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className={`group flex items-center gap-2.5 rounded-full shadow-lg transition-all duration-300 active:scale-95 ${
          expanded
            ? "bg-muted border border-border text-muted-foreground px-4 py-2.5 hover:bg-muted/80"
            : "bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 shadow-rose-500/40 hover:shadow-rose-500/60"
        }`}
        aria-label={expanded ? "Close emergency menu" : "Open emergency menu"}
      >
        {expanded ? (
          <>
            <X className="h-4 w-4 shrink-0" />
            <span className="text-sm font-semibold">Close</span>
          </>
        ) : (
          <>
            {/* Pulsing dot */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            <PhoneCall className="h-4 w-4 shrink-0" />
            <span className="text-sm font-semibold">Emergency</span>
          </>
        )}
      </button>

    </div>
  );
}