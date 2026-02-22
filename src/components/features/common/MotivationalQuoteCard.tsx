import type { Quote } from '@/types';
import { Quote as QuoteIcon } from 'lucide-react';

interface MotivationalQuoteCardProps {
  quote: Quote;
}

export function MotivationalQuoteCard({ quote }: MotivationalQuoteCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card px-8 py-7 shadow-sm transition-all duration-300 hover:shadow-md group">

      {/* Decorative large background quote mark */}
      <span className="pointer-events-none absolute -top-3 -left-1 select-none text-[9rem] font-serif leading-none text-primary/5 transition-all duration-300 group-hover:text-primary/10">
        &ldquo;
      </span>

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">

        {/* Icon badge */}
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 shrink-0">
          <QuoteIcon className="h-5 w-5 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-2">
            Daily Motivation
          </p>
          <blockquote className="text-base sm:text-lg font-medium text-foreground leading-relaxed italic">
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <p className="mt-3 text-sm text-muted-foreground">
            — <span className="font-medium text-foreground/80">{quote.author}</span>
          </p>
        </div>

      </div>
    </div>
  );
}