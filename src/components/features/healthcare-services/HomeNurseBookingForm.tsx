
"use client";

import type { Nurse, NurseBookingFormData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const bookingFormSchema = z.object({
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }),
  selectedNurseId: z.string().min(1, { message: "Please select a nurse." }),
  bookingDate: z.date({
    required_error: "A booking date is required.",
  }),
  bookingTime: z.string().min(1, { message: "Please select a time slot." }), // Example: "10:00 AM - 12:00 PM"
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  notes: z.string().max(500, { message: "Notes cannot exceed 500 characters." }).optional(),
});

interface HomeNurseBookingFormProps {
  nurses: Nurse[];
}

// Sample time slots
const timeSlots = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
];

export function HomeNurseBookingForm({ nurses }: HomeNurseBookingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);


  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      patientName: "",
      selectedNurseId: "",
      address: "",
      notes: "",
      bookingTime: "",
    },
  });

  async function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    setIsSubmitting(true);
    setSubmissionStatus(null);
    console.log("Booking Request Submitted:", values);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you would integrate with Firebase Firestore here.
    // Example:
    // try {
    //   const docRef = await addDoc(collection(db, "nurse_bookings"), {
    //     ...values,
    //     bookingDate: Timestamp.fromDate(values.bookingDate),
    //     status: "pending",
    //     createdAt: serverTimestamp(),
    //   });
    //   console.log("Document written with ID: ", docRef.id);
    //   setSubmissionStatus('success');
    //   form.reset();
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    //   setSubmissionStatus('error');
    // }

    // For now, we just show a toast.
    toast({
      title: "Booking Request Submitted!",
      description: `Thank you, ${values.patientName}. Your request for nurse ${nurses.find(n => n.id === values.selectedNurseId)?.name || ''} on ${format(values.bookingDate, "PPP")} at ${values.bookingTime} has been received. We will contact you shortly to confirm.`,
      duration: 7000,
    });
    setSubmissionStatus('success');
    form.reset(); // Reset form after successful submission
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter patient's full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selectedNurseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Nurse</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={cn("hover:bg-accent hover:text-accent-foreground transition-colors")}>
                    <SelectValue placeholder="Choose a nurse from the list" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {nurses.map((nurse) => (
                    <SelectItem key={nurse.id} value={nurse.id}>
                      {nurse.name} (₹{nurse.hourlyRate}/hr - {nurse.specializations.slice(0,1).join(', ')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="bookingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Preferred Booking Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal hover:bg-accent hover:text-accent-foreground transition-colors",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setDate(new Date().getDate() - 1)) // Disable past dates
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bookingTime"
            render={({ field }) => (
              <FormItem className="flex flex-col"> 
                <FormLabel>Preferred Time Slot</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={cn("hover:bg-accent hover:text-accent-foreground transition-colors")}>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Address for Visit</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter complete address including flat/house number, street, landmark, city, and pincode"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any specific instructions or information for the nurse (e.g., patient condition, allergies)"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submissionStatus === 'success' && (
          <Alert variant="default" className="bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300">
            <AlertTriangle className="h-4 w-4 !text-green-600 dark:!text-green-400" />
            <AlertTitle>Request Sent!</AlertTitle>
            <AlertDescription>
              Your home nurse booking request has been successfully submitted. We will contact you soon.
            </AlertDescription>
          </Alert>
        )}

        {submissionStatus === 'error' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Submission Failed</AlertTitle>
            <AlertDescription>
              There was an error submitting your request. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Submitting Request..." : "Submit Booking Request"}
        </Button>
      </form>
    </Form>
  );
}
