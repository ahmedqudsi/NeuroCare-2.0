import type { HealthcareService } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: HealthcareService;
  isLive?: boolean;
}

export function ServiceCard({ service, isLive = false }: ServiceCardProps) {
  const IconComponent = service.icon;

  const card = (
    <Card className={cn(
      'flex flex-col h-full transition-all duration-300',
      isLive
        ? 'hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 cursor-pointer'
        : 'border-dashed border-amber-500/30 bg-amber-500/[0.02]',
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          {/* Icon */}
          <div className={cn(
            'flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-200',
            isLive ? 'bg-primary/10 group-hover:bg-primary/20' : 'bg-amber-500/10',
          )}>
            <IconComponent className={cn('h-6 w-6', isLive ? 'text-primary' : 'text-amber-500/70')} />
          </div>

          {/* Badge */}
          {isLive ? null : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider shrink-0">
              <Wrench className="h-2.5 w-2.5" />
              In Development
            </span>
          )}
        </div>

        <CardTitle className={cn(
          'text-base font-semibold transition-colors duration-200',
          isLive ? 'group-hover:text-primary' : 'text-foreground',
        )}>
          {service.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-3 space-y-3">
        <CardDescription className="text-sm leading-relaxed">
          {service.description}
        </CardDescription>

        {/* Under-dev note */}
        {!isLive && (
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80 font-medium leading-relaxed">
            We&apos;re actively building this — it will be available soon.
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        {isLive ? (
          <Button variant="outline"
            className="w-full gap-2 rounded-xl h-9 text-sm font-medium transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary">
            {service.cta}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        ) : (
          <Button variant="outline" disabled
            className="w-full gap-2 rounded-xl h-9 text-sm font-medium border-amber-500/20 text-amber-600/60 dark:text-amber-400/60 cursor-not-allowed opacity-70">
            <Wrench className="h-3.5 w-3.5" />
            Coming Soon
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  if (!isLive) return <div className="h-full">{card}</div>;

  return (
    <Link href={service.href} className="block h-full group">
      {card}
    </Link>
  );
}