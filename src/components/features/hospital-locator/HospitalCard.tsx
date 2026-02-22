"use client";

import type { Hospital as HospitalType } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Phone, Stethoscope, MapPin, Navigation } from 'lucide-react';

interface HospitalCardProps {
  hospital: HospitalType;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  const handleGetDirections = () => {
    const encodedAddress = encodeURIComponent(hospital.address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const getImagePath = () => {
    const imageMap: Record<string, string> = {
      'Olive Hospital - Hyderabad': '/olive.webp',
      'Premier Hospital - Hyderabad': '/premier.jpeg',
      'Sarojini Devi Hospital - Hyderabad': '/sarojini.avif',
      'Ayaan Hospital - Hyderabad': '/ayaan.png',
      'Bombay Hospital & Medical Research Centre - Mumbai': '/bombay.jpg',
      'Max Healthcare Saket - Delhi': '/max hospital.jpg',
      'Kokilaben Dhirubhai Ambani Hospital - Mumbai': '/kokila.avif',
      'Lilavati Hospital and Research Centre - Mumbai': '/lilavita.jpg',
      'Breach Candy Hospital Trust - Mumbai': '/breach.avif',
      'Indraprastha Apollo Hospitals - Delhi': '/indraprastha.avif',
      'Fortis Escorts Heart Institute - Delhi': '/fortis.jpg',
      'Sir Ganga Ram Hospital - Delhi': '/sir ganga.jpeg',
    };
    return imageMap[hospital.name] ?? hospital.imageUrl;
  };

  return (
    <Card className="group overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

      {/* Image */}
      {hospital.imageUrl && (
        <div className="relative w-full h-44 bg-muted overflow-hidden shrink-0">
          <Image
            src={getImagePath()}
            alt={`${hospital.name}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={hospital.imageHint || 'hospital building'}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/600x400.png?text=${encodeURIComponent(
                hospital.name.split(' ')[0]
              )}`;
              (e.target as HTMLImageElement).alt = `Image not found`;
            }}
          />
          {/* Subtle gradient overlay at bottom for text legibility if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Header */}
      <CardHeader className="pb-2 pt-4 px-4">
        <h3 className="font-semibold text-base text-foreground leading-snug">
          {hospital.name}
        </h3>
        <div className="flex items-start gap-1.5 text-sm text-muted-foreground mt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
          <span className="leading-snug">{hospital.address}</span>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 px-4 pb-4 space-y-3">

        {/* Phone */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 shrink-0">
            <Phone className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-foreground/80">{hospital.phone}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Services */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            <Stethoscope className="h-3.5 w-3.5 text-primary" />
            Services
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hospital.services.map((service, index) => (
              <span
                key={index}
                className="inline-block rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 pb-4 pt-0">
        <Button
          variant="outline"
          className="w-full gap-2 rounded-xl h-9 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
          onClick={handleGetDirections}
        >
          <Navigation className="h-4 w-4" />
          Get Directions
        </Button>
      </CardFooter>

    </Card>
  );
}