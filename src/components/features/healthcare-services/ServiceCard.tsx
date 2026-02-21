
import type { HealthcareService } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: HealthcareService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = service.icon;

  return (
    <Link href={service.href} passHref legacyBehavior>
      <a className="block h-full group">
        <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.03] transform transition-all duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <IconComponent className="h-10 w-10 text-primary group-hover:animate-pulse" />
            <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
              {service.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <CardDescription>{service.description}</CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {service.cta}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
}
