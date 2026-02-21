
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { sampleDoctors } from '@/lib/constants';
import type { Doctor } from '@/types';
import { DoctorProfileCard } from '@/components/features/healthcare-services/doctor-visits/DoctorProfileCard';
import { DoctorBookingForm } from '@/components/features/healthcare-services/doctor-visits/DoctorBookingForm';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Doctor Visits at Home',
  description: 'Schedule at-home consultations with qualified doctors.',
};

export default function DoctorVisitsPage() {
  const pageStaticText = {
    mainTitle: 'Doctor Visits at Home',
    mainDescription: 'Find experienced doctors and schedule convenient consultations in the comfort of your home.',
    availableDoctorsTitle: 'Available Doctors for Home Visits',
    bookingFormTitle: 'Request a Doctor Visit',
    backButtonText: "Back to Healthcare Services",
  };

  const verifiedDoctors = sampleDoctors.filter(doctor => doctor.verifiedLicense);

  return (
    <div className="space-y-10">
      <div className="animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {pageStaticText.mainTitle}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {pageStaticText.mainDescription}
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
        <h2 className="text-2xl font-semibold text-foreground">{pageStaticText.availableDoctorsTitle}</h2>
        {verifiedDoctors.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {verifiedDoctors.map((doctor: Doctor) => (
              <DoctorProfileCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No verified doctors available at the moment. Please check back later.</p>
        )}
      </section>

      <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
        <h2 className="text-2xl font-semibold text-foreground">{pageStaticText.bookingFormTitle}</h2>
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <DoctorBookingForm doctors={verifiedDoctors} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
