
import type { Doctor } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Languages, MapPin, BriefcaseMedical, CheckCircle2, XCircle } from 'lucide-react'; 

interface DoctorProfileCardProps {
  doctor: Doctor;
}

export function DoctorProfileCard({ doctor }: DoctorProfileCardProps) {
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
            {doctor.verifiedLicense ? (
              <Badge variant="default" className="mt-1 bg-green-500 hover:bg-green-600 text-xs">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="destructive" className="mt-1 text-xs">
                <XCircle className="mr-1 h-3 w-3" /> Not Verified
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2 flex-grow">
        <p className="flex items-center"><BriefcaseMedical className="mr-2 h-4 w-4 text-primary" /> {doctor.yearsOfExperience} years experience</p>
        <p className="flex items-center"><Star className="mr-2 h-4 w-4 text-primary" /> {doctor.ratings}/5.0 Stars</p>
        <p className="flex items-center"><Languages className="mr-2 h-4 w-4 text-primary" /> Speaks: {doctor.languagesSpoken.join(', ')}</p>
        <p className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary" /> {doctor.locationDescription}</p>
        <p><strong>Availability:</strong> {doctor.availability}</p>
        <p><strong>Consultation Fee:</strong> ₹{doctor.consultationFee}</p>
        {doctor.bio && <p className="mt-2 text-xs italic line-clamp-3">{doctor.bio}</p>}
      </CardContent>
      <CardFooter>
        {/* Future: Button to "View Profile" or "Book Now" specific to this doctor */}
      </CardFooter>
    </Card>
  );
}
