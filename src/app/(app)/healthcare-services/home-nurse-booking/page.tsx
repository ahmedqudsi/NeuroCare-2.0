
import type { Metadata } from 'next';
import Image from 'next/image';
import { sampleNurses } from '@/lib/constants';
import type { Nurse } from '@/types';
import { HomeNurseBookingForm } from '@/components/features/healthcare-services/HomeNurseBookingForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, DollarSign, ArrowLeft, BriefcaseMedical, CheckCircle2 } from 'lucide-react'; // XCircle removed as all are verified
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Book a Home Nurse',
  description: 'Schedule professional nursing care at your home.',
};

export default function HomeNurseBookingPage() {
  const pageStaticText = {
    title: "Book a Home Nurse",
    description: "Find and schedule certified nurses for personalized in-home care. Review profiles and book a suitable nurse for your needs.",
    availableNursesTitle: "Available Nurses",
    bookingFormTitle: "Make a Booking Request",
    backButtonText: "Back to Healthcare Services",
  };

  const getNurseImagePath = (nurse: Nurse): string => {
    switch (nurse.id) {
      case 'nurse001': return '/Priya Sharma.jpg';
      case 'nurse002': return '/Amit Singh.avif';
      case 'nurse003': return '/Sunita Reddy.jpg';
      case 'nurse004': return '/Rajesh Kumar.jpg';
      case 'nurse005': return '/Anjali Mehta.webp';
      case 'nurse006': return '/Vikram Patel.webp';
      case 'nurse007': return '/Deepa Iyer.avif';
      case 'nurse008': return '/Mohan Das.jpeg';
      default: return nurse.imageUrl || 'https://placehold.co/300x300.png'; // Fallback if ID not matched
    }
  };

  return (
    <div className="space-y-10">
      <div className="animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {pageStaticText.title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {pageStaticText.description}
        </p>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/healthcare-services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {pageStaticText.backButtonText}
            </Link>
          </Button>
        </div>
      </div>

      <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <h2 className="text-2xl font-semibold text-foreground">{pageStaticText.availableNursesTitle}</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleNurses.map((nurse: Nurse) => (
            <Card key={nurse.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full group">
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                    <Image
                      src={getNurseImagePath(nurse)}
                      alt={`Photo of ${nurse.name}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint={nurse.imageHint || "professional nurse"}
                      // onError prop removed to prevent client component error
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{nurse.name}</CardTitle>
                    {nurse.specializations.length > 0 && (
                      <CardDescription className="text-sm text-primary">{nurse.specializations[0]}</CardDescription>
                    )}
                    {nurse.verifiedLicense && ( // All nurses are now verified
                      <Badge variant="default" className="mt-1 bg-green-500 hover:bg-green-600 text-xs">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {nurse.specializations.slice(1, 3).map(spec => (
                         <Badge key={spec} variant="secondary" className="text-xs">{spec}</Badge>
                      ))}
                      {nurse.specializations.length > 3 && <Badge variant="outline" className="text-xs">+{nurse.specializations.length - 3} more</Badge>}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2 flex-grow">
                <p className="flex items-center"><BriefcaseMedical className="mr-2 h-4 w-4 text-primary" /> {nurse.experienceYears} years experience</p>
                <p className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-primary" /> ₹{nurse.hourlyRate}/hour</p>
                <p><strong>Availability:</strong> {nurse.availability}</p>
                {nurse.bio && <p className="mt-2 text-xs italic line-clamp-3">{nurse.bio}</p>}
              </CardContent>
               <CardFooter>
                 {/* Could add a "Select Nurse" button here if form handles nurse selection directly */}
               </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
        <h2 className="text-2xl font-semibold text-foreground">{pageStaticText.bookingFormTitle}</h2>
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <HomeNurseBookingForm nurses={sampleNurses} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
