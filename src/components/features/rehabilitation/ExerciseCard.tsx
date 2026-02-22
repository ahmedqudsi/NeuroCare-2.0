"use client";

import type { Exercise } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, PlayCircle, Play, Clock, RotateCcw } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const handleWatchVideo = () => {
    if (exercise.videoUrl) {
      window.open(exercise.videoUrl, '_blank', 'noopener,noreferrer');
    } else {
      const searchQuery = `${exercise.name} stroke rehabilitation exercise guide`;
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <Card className="group overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

      {/* Video thumbnail area */}
      <div
        className="relative w-full h-44 bg-muted flex items-center justify-center cursor-pointer overflow-hidden shrink-0"
        onClick={handleWatchVideo}
        aria-label={`Watch video guide for ${exercise.name}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleWatchVideo()}
      >
        {/* Subtle animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted to-primary/10 transition-all duration-300 group-hover:from-primary/10 group-hover:to-primary/20" />

        {/* Play button */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-background/90 border border-border shadow-md transition-all duration-200 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary">
          <Play className="h-7 w-7 text-primary group-hover:text-primary-foreground ml-0.5 transition-colors duration-200" fill="currentColor" />
        </div>

        {/* Watch label */}
        <span className="absolute bottom-3 right-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground bg-background/80 backdrop-blur-sm rounded-full px-2.5 py-1 border border-border/50">
          Watch Guide
        </span>
      </div>

      {/* Header */}
      <CardHeader className="pb-2 pt-4 px-4">
        <h3 className="font-semibold text-base text-foreground leading-snug">
          {exercise.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
          {exercise.description}
        </p>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 px-4 pb-4">
        <div className="h-px bg-border mb-3" />

        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
          <ListChecks className="h-3.5 w-3.5 text-primary" />
          Instructions
        </div>

        <ul className="space-y-2">
          {exercise.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="text-muted-foreground leading-relaxed">{instruction}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 pb-4 pt-0">
        <Button
          variant="outline"
          className="w-full gap-2 rounded-xl h-9 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
          onClick={handleWatchVideo}
        >
          <PlayCircle className="h-4 w-4" />
          Watch Video Guide
        </Button>
      </CardFooter>

    </Card>
  );
}