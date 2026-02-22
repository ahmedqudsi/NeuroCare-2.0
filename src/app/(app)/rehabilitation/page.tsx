// ─── RehabilitationPage (page.tsx) ───────────────────────────────────────────

import { ExerciseCard } from '@/components/features/rehabilitation/ExerciseCard';
import { rehabilitationExercises } from '@/lib/constants';
import type { Metadata } from 'next';
import { Dumbbell, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rehabilitation Exercises',
  description: 'Guided physical therapy exercises to aid in stroke recovery.',
};

export default async function RehabilitationPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-6 duration-700 space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            <Dumbbell className="h-3.5 w-3.5" />
            Physical Therapy
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Rehabilitation Exercises
          </h1>
          <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed max-w-2xl">
            Follow these exercises to help regain strength and mobility after a stroke.
          </p>
        </div>

        {/* Doctor advisory banner */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-600 dark:text-amber-400">
            <span className="font-semibold">Medical advice: </span>
            Always consult your doctor or therapist before starting any new exercise program.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        {rehabilitationExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rehabilitationExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-muted">
              <Dumbbell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">No exercises available</p>
            <p className="text-sm text-muted-foreground">Please check back later.</p>
          </div>
        )}
      </div>

    </div>
  );
}