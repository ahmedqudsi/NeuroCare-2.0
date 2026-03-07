import type { Metadata } from 'next';
import { healthcareServicesList } from '@/lib/constants';
import { ServiceCard } from '@/components/features/healthcare-services/ServiceCard';
import { HeartPulse, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Healthcare Services',
  description: 'Access a range of on-demand healthcare services from the comfort of your home.',
};

// ← Add IDs here as each service goes live
const LIVE_SERVICE_IDS = new Set([
  'home-nurse-booking',
  'doctor-visits-at-home',
]);

export default function HealthcareServicesPage() {
  const liveServices      = healthcareServicesList.filter(s =>  LIVE_SERVICE_IDS.has(s.id));
  const comingSoonServices = healthcareServicesList.filter(s => !LIVE_SERVICE_IDS.has(s.id));

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-6 duration-700 space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            <HeartPulse className="h-3.5 w-3.5" />
            Home Healthcare
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Home Healthcare Services
          </h1>
          <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed max-w-2xl">
            Convenient and reliable healthcare solutions tailored to your needs, delivered at your doorstep.
          </p>
        </div>

        {/* Stats strip */}
        {/* <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {liveServices.length} service{liveServices.length !== 1 ? 's' : ''} live
            </span>
          </div>
          {comingSoonServices.length > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3.5 py-1.5">
              <Wrench className="h-3 w-3 text-amber-500" />
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                {comingSoonServices.length} coming soon
              </span>
            </div>
          )}
        </div> */}
      </div>

      {/* Live Services */}
      {liveServices.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {liveServices.map((service) => (
              <ServiceCard key={service.id} service={service} isLive={true} />
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Services */}
      {comingSoonServices.length > 0 && (
        <div className="animate-in fade-in duration-700 delay-400 space-y-5">
          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-amber-500/30 bg-amber-500/5">
              <Wrench className="h-3 w-3 text-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Coming Soon
              </span>
            </div>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {comingSoonServices.map((service) => (
              <ServiceCard key={service.id} service={service} isLive={false} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}