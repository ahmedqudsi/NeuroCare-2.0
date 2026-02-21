
"use client";

import type { LabTestPackage } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Thermometer, FlaskConical, Tag, CheckSquare, CalendarOff } from 'lucide-react';

interface LabTestPackageCardProps {
  testPackage: LabTestPackage;
}

export function LabTestPackageCard({ testPackage }: LabTestPackageCardProps) {
  // Placeholder for selecting test, to be implemented if form interacts with cards
  const handleSelectTest = () => {
    console.log("Selected test:", testPackage.testName);
    // Potentially update a shared state or form context here
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full group">
      {testPackage.imageUrl && (
        <div className="relative w-full h-40 bg-muted group-hover:opacity-90 transition-opacity">
          <Image
            src={testPackage.imageUrl}
            alt={`Image for ${testPackage.testName}`}
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint={testPackage.imageHint || "lab test"}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/400x300.png?text=${encodeURIComponent(testPackage.testName.split(' ')[0])}`;
              (e.target as HTMLImageElement).alt = `${testPackage.testName} image not available`;
            }}
          />
        </div>
      )}
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 h-[3em]">
          {testPackage.testName}
        </CardTitle>
        <CardDescription className="text-xs text-primary uppercase">{testPackage.testType}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-2 text-sm">
        <p className="text-muted-foreground line-clamp-3 h-[3.75em]">{testPackage.description}</p>

        {testPackage.includes && testPackage.includes.length > 0 && (
          <div className="mt-2">
            <h4 className="text-xs font-semibold text-foreground mb-1">Includes:</h4>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              {testPackage.includes.slice(0, 3).map(item => <li key={item}>{item}</li>)}
              {testPackage.includes.length > 3 && <li>+ {testPackage.includes.length - 3} more</li>}
            </ul>
          </div>
        )}

        {testPackage.recommendedFor && testPackage.recommendedFor.length > 0 && (
           <div className="mt-2">
            <h4 className="text-xs font-semibold text-foreground mb-1">Recommended for:</h4>
            <div className="flex flex-wrap gap-1">
                {testPackage.recommendedFor.map(rec => (
                    <Badge key={rec} variant="secondary" className="text-xs">{rec}</Badge>
                ))}
            </div>
           </div>
        )}
        
        <div className="flex items-center pt-1">
          {testPackage.fastingRequired ? (
            <Badge variant="outline" className="text-amber-600 border-amber-500 text-xs">
              <CalendarOff className="mr-1 h-3 w-3" /> Fasting Required
            </Badge>
          ) : (
            <Badge variant="outline" className="text-green-600 border-green-500 text-xs">
               <CheckSquare className="mr-1 h-3 w-3" /> No Fasting
            </Badge>
          )}
        </div>
         <p className="text-lg font-bold text-primary pt-1">₹{testPackage.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4">
        {/* "Select Test" button removed from here */}
      </CardFooter>
    </Card>
  );
}
