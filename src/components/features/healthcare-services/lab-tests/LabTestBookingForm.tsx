
"use client";

import type { LabTestPackage, LabTestBookingFormData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
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
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CalendarIcon, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from '@/components/ui/alert';

interface LabTestBookingFormProps {
  testPackages: LabTestPackage[];
}

const labTestBookingFormSchema = z.object({
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }),
  selectedTestIds: z.array(z.string()).min(1, { 
    message: "Please select at least one test or package." 
  }),
  preferredDate: z.date({
    required_error: "A preferred booking date is required.",
  }),
  preferredTimeSlot: z.string().min(1, { message: "Please select a time slot." }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  fastingConfirmed: z.boolean().optional(),
  notes: z.string().max(500, { message: "Notes cannot exceed 500 characters." }).optional(),
}).refine(data => {
  const selectedTestsInfo = data.selectedTestIds.map(id => 
    (window as any).__labTestPackages_for_refine?.find((p: LabTestPackage) => p.id === id)
  ).filter(Boolean);

  const anyRequiresFasting = selectedTestsInfo.some(p => p?.fastingRequired);
  if (anyRequiresFasting) {
    return data.fastingConfirmed === true;
  }
  return true;
}, {
  message: "Please confirm you will be fasting as one or more selected tests require it.",
  path: ["fastingConfirmed"], 
});


const sampleTimeSlotsForTests = [
  "07:00 AM - 08:00 AM (Fasting Preferred)",
  "08:00 AM - 09:00 AM (Fasting Preferred)",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
];

export function LabTestBookingForm({ testPackages }: LabTestBookingFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
  const [selectedTestsDetails, setSelectedTestsDetails] = useState<LabTestPackage[]>([]);

  useEffect(() => {
    (window as any).__labTestPackages_for_refine = testPackages;
    return () => {
      delete (window as any).__labTestPackages_for_refine;
    };
  }, [testPackages]);


  const form = useForm<z.infer<typeof labTestBookingFormSchema>>({
    resolver: zodResolver(labTestBookingFormSchema),
    defaultValues: {
      patientName: "",
      selectedTestIds: [],
      address: "",
      notes: "",
      preferredTimeSlot: "",
      fastingConfirmed: false,
    },
  });

  const watchedSelectedTestIds = form.watch("selectedTestIds");

  useEffect(() => {
    if (watchedSelectedTestIds && watchedSelectedTestIds.length > 0) {
      const tests = testPackages.filter(pkg => watchedSelectedTestIds.includes(pkg.id));
      setSelectedTestsDetails(tests);
    } else {
      setSelectedTestsDetails([]);
    }
  }, [watchedSelectedTestIds, testPackages, form]); // Added form to dependencies
  
  const fastingRequiredForAnySelectedTest = selectedTestsDetails.some(test => test.fastingRequired);

  useEffect(() => {
      if (!fastingRequiredForAnySelectedTest) {
          form.setValue("fastingConfirmed", false);
      }
  }, [fastingRequiredForAnySelectedTest, form]);


  async function onSubmit(values: z.infer<typeof labTestBookingFormSchema>) {
    setIsSubmitting(true);
    setSubmissionStatus(null);

    console.log("Lab Test Booking Request Submitted (Simulated):", values);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedTestNames = selectedTestsDetails.map(t => t.testName).join(', ');

    toast({
      title: "Booking Request Submitted!",
      description: `Thank you, ${values.patientName}. Your request for ${selectedTestNames || 'the selected tests'} on ${format(values.preferredDate, "PPP")} at ${values.preferredTimeSlot} has been received. Our team will contact you shortly to confirm.`,
      duration: 7000,
    });
    setSubmissionStatus('success');
    form.reset();
    setSelectedTestsDetails([]);
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
          name="selectedTestIds"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Select Tests or Packages</FormLabel>
                <FormDescription>
                  Choose one or more tests you&apos;d like to book.
                </FormDescription>
              </div>
              <div className="space-y-3 rounded-md border p-4 shadow-sm">
                {testPackages.map((pkg) => {
                  const isSelected = field.value?.includes(pkg.id);
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => {
                         const currentSelected = field.value || [];
                         const newSelected = isSelected
                           ? currentSelected.filter(id => id !== pkg.id)
                           : [...currentSelected, pkg.id];
                         field.onChange(newSelected);
                      }}
                      className={cn(
                        "flex items-center justify-between p-3 border rounded-md cursor-pointer transition-all hover:shadow-md",
                        isSelected ? "bg-primary/10 border-primary ring-2 ring-primary ring-offset-1" : "bg-card hover:bg-accent/50",
                      )}
                    >
                      <div className="flex-1">
                        <span className="font-medium">{pkg.testName}</span> (₹{pkg.price.toFixed(2)})
                        {pkg.fastingRequired && <span className="text-amber-700 text-xs ml-1 font-medium">(Fasting Required)</span>}
                      </div>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-primary ml-3 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {fastingRequiredForAnySelectedTest && (
            <FormField
              control={form.control}
              name="fastingConfirmed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-amber-50 border-amber-200">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="fastingConfirmed"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="fastingConfirmed" className="text-amber-700 cursor-pointer">
                      Confirm Fasting: <span className="font-normal">One or more selected tests require fasting (typically 8-12 hours before sample collection). Please confirm you will adhere to this.</span>
                    </FormLabel>
                    <FormDescription className="text-xs text-amber-600">
                      Do not eat or drink anything other than water for the specified period before your test.
                    </FormDescription>
                     <FormMessage />
                  </div>
                </FormItem>
              )}
            />
        )}


        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="preferredDate"
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
                        date < new Date(new Date().setDate(new Date().getDate() -1)) 
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
            name="preferredTimeSlot"
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
                    {sampleTimeSlotsForTests.map((slot) => (
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
              <FormLabel>Full Address for Sample Collection</FormLabel>
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
                  placeholder="Any specific instructions or information for the phlebotomist (e.g., patient mobility issues, preferred contact person)"
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
            <CheckCircle2 className="h-4 w-4 !text-green-600 dark:!text-green-400" />
            <AlertTitleUi>Request Sent!</AlertTitleUi>
            <AlertDescription>
              Your home lab test booking request has been successfully submitted. We will contact you soon to confirm details.
            </AlertDescription>
          </Alert>
        )}

        {submissionStatus === 'error' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitleUi>Submission Failed</AlertTitleUi>
            <AlertDescription>
              There was an error submitting your request. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full sm:w-auto" 
          disabled={isSubmitting || (fastingRequiredForAnySelectedTest && !form.getValues("fastingConfirmed"))}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Request...
            </>
          ) : (
            "Submit Booking Request"
          )}
        </Button>
      </form>
    </Form>
  );
}

    