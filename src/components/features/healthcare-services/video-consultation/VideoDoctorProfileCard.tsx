
import type { Doctor } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, MessageSquareText, CheckCircle2, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoDoctorProfileCardProps {
  doctor: Doctor;
}

export function VideoDoctorProfileCard({ doctor }: VideoDoctorProfileCardProps) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full group">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
            <Image
              src={doctor.profilePictureUrl}
              alt={`Photo of ${doctor.fullName}`}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={doctor.imageHint || "doctor profile"}
            />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">{doctor.fullName}</CardTitle>
            <CardDescription className="text-sm text-primary">{doctor.specialty}</CardDescription>
            {doctor.verifiedLicense && (
              <Badge variant="default" className="mt-1 bg-green-500 hover:bg-green-600 text-xs">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2 flex-grow">
        <p className="flex items-center"><Video className="mr-2 h-4 w-4 text-primary" /> Fee: ₹{doctor.videoConsultationFee}</p>
        <p className="flex items-center"><MessageSquareText className="mr-2 h-4 w-4 text-primary" /> Speaks: {doctor.languagesSpoken.join(', ')}</p>
        {doctor.videoAvailabilitySlots && doctor.videoAvailabilitySlots.length > 0 && (
          <div className="flex items-start">
            <CalendarClock className="mr-2 h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <strong>Sample Slots:</strong>
              <ul className="list-disc list-inside pl-1 text-xs">
                {doctor.videoAvailabilitySlots.slice(0, 2).map(slot => <li key={slot}>{slot}</li>)}
                {doctor.videoAvailabilitySlots.length > 2 && <li>And more...</li>}
              </ul>
            </div>
          </div>
        )}
        {doctor.bio && <p className="mt-2 text-xs italic line-clamp-2">{doctor.bio}</p>}
      </CardContent>
       <CardFooter className="pt-2 flex flex-wrap gap-2 justify-between items-center">
       </CardFooter>
    </Card>
  );
}
