
import { InteractiveFASTTestClient } from '@/components/features/fast-test/InteractiveFASTTestClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAST Stroke Test',
  description: 'Learn to recognize stroke symptoms using the FAST test.',
};

export default async function FASTTestPage() {
  // Dictionary removed
  return (
    <div className="container mx-auto py-8">
      <InteractiveFASTTestClient /> {/* Dictionary prop removed */}
    </div>
  );
}
