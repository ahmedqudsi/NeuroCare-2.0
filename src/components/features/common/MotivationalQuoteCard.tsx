
import type { Quote } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote as QuoteIcon } from 'lucide-react';

interface MotivationalQuoteCardProps {
  quote: Quote;
}

export function MotivationalQuoteCard({ quote }: MotivationalQuoteCardProps) {
  return (
    <Card className="shadow-lg group">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <QuoteIcon className="mr-2 h-6 w-6 text-primary" />
          Motivational Quote
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-lg italic group-hover:scale-[1.03] transform transition-transform duration-200 ease-in-out origin-center">
          "{quote.text}"
        </blockquote>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground w-full text-right">- {quote.author}</p>
      </CardFooter>
    </Card>
  );
}
