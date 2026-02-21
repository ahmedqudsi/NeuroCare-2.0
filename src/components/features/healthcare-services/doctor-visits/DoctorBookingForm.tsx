
"use client";

import type { Doctor, DoctorBookingFormData } from '@/types';
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

const doctorBookingFormSchema = z.object({
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }),
  patientAge: z.coerce.number().min(0, { message: "Age must be a positive number."}).max(120, {message: "Age seems too high."}),
  patientGender: z.enum(['male', 'female', 'other'], {
    required_error: "Please select patient's gender.",
  }),
  symptoms: z.string().min(10, {
    message: "Please describe symptoms/reason for visit (min 10 characters).",
  }).max(500, { message: "Symptoms description cannot exceed 500 characters."}),
  preferredDate: z.date({
    required_error: "A preferred date is required.",
  }),
  preferredTime: z.string().min(1, { message: "Please select a time slot." }),
  visitAddress: z.string().min(10, {
    message: "Visit address must be at least 10 characters.",
  }),
  // In future, could add selectedDoctorId if form is used for specific doctor booking
});

interface DoctorBookingFormProps {
  doctors: Doctor[]; // Potentially used later for doctor selection or matching
}

// Sample time slots for doctor visits (can be dynamic later)
const doctorTimeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

export function DoctorBookingForm({ doctors }: DoctorBookingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  const form = useForm<z.infer<typeof doctorBookingFormSchema>>({
    resolver: zodResolver(doctorBookingFormSchema),
    defaultValues: {
      patientName: "",
      patientAge: undefined, // Use undefined for number inputs to show placeholder
      symptoms: "",
      preferredTime: "",
      visitAddress: "",
    },
  });

  async function onSubmit(values: z.infer<typeof doctorBookingFormSchema>) {
    setIsSubmitting(true);
    setSubmissionStatus(null);
    console.log("Doctor Visit Request Submitted:", values);

    // Simulate API call (e.g., to Firebase Firestore)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, integrate with Firestore here.
    // Example:
    // try {
    //   const docRef = await addDoc(collection(db, "doctor_visits"), {
    //     ...values,
    //     preferredDate: Timestamp.fromDate(values.preferredDate),
    //     status: "pending",
    //     requestedAt: serverTimestamp(),
    //   });
    //   setSubmissionStatus('success');
    //   form.reset();
    // } catch (e) {
    //   setSubmissionStatus('error');
    // }

    toast({
      title: "Doctor Visit Request Submitted!",
      description: `Thank you, ${values.patientName}. Your request for a doctor visit on ${format(values.preferredDate, "PPP")} around ${values.preferredTime} has been received. We will contact you shortly to confirm.`,
      duration: 7000,
    });
    setSubmissionStatus('success');
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
              name="patientAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 65" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientGender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={cn("hover:bg-accent hover:text-accent-foreground transition-colors")}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symptoms / Reason for Visit</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Briefly describe the patient's symptoms or the reason for the doctor's visit."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="preferredDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Preferred Visit Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                           "hover:bg-accent hover:text-accent-foreground transition-colors"
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
                        date < new Date(new Date().setDate(new Date().getDate() -1)) // Disable past dates
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
            name="preferredTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Preferred Time Slot</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={cn("hover:bg-accent hover:text-accent-foreground transition-colors")}>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctorTimeSlots.map((slot) => (
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
          name="visitAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Address for Visit</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter complete address including flat/house number, street, landmark, city, and pincode for the doctor's visit."
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
            <AlertTriangle className="h-4 w-4 !text-green-600 dark:!text-green-400" /> {/* Adjusted icon color */}
            <AlertTitle>Request Sent!</AlertTitle>
            <AlertDescription>
              Your doctor visit request has been successfully submitted. We will contact you soon to confirm details and doctor availability.
            </AlertDescription>
          </Alert>
        )}

        {submissionStatus === 'error' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Submission Failed</AlertTitle>
            <AlertDescription>
              There was an error submitting your request. Please try again or contact support.
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Submitting Request..." : "Submit Doctor Visit Request"}
        </Button>
      </form>
    </Form>
  );
}
