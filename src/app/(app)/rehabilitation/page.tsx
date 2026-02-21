
import { ExerciseCard } from '@/components/features/rehabilitation/ExerciseCard';
import { rehabilitationExercises } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rehabilitation Exercises',
  description: 'Guided physical therapy exercises to aid in stroke recovery.',
};

export default async function RehabilitationPage() {
  // Static text, previously from dictionary
  const pageStaticText = {
    title: 'Rehabilitation Exercises',
    subTitle: 'Follow these exercises to help regain strength and mobility. Consult your doctor or therapist before starting any new exercise program.',
    noExercises: 'No exercises available at the moment. Please check back later.'
  };

  return (
    <div className="space-y-8">
      <div className="animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {pageStaticText.title}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {pageStaticText.subTitle}
        </p>
      </div>
      
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        {rehabilitationExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rehabilitationExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            {pageStaticText.noExercises}
          </p>
        )}
      </div>
    </div>
  );
}
