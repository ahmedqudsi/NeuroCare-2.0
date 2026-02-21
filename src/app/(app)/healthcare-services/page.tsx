
import type { Metadata } from 'next';
import { healthcareServicesList } from '@/lib/constants';
import { ServiceCard } from '@/components/features/healthcare-services/ServiceCard';

export const metadata: Metadata = {
  title: 'Home Healthcare Services',
  description: 'Access a range of on-demand healthcare services from the comfort of your home.',
};

export default function HealthcareServicesPage() {
  const pageStaticText = {
    title: 'Home Healthcare Services',
    description: 'Convenient and reliable healthcare solutions tailored to your needs, delivered at your doorstep.',
  };

  return (
    <div className="space-y-8">
      <div className="animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {pageStaticText.title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {pageStaticText.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        {healthcareServicesList.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
