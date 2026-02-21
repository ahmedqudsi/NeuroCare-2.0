
"use client";

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, Star, MessageSquarePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const feedbackOptions = [
  { level: 'Excellent', icon: <Smile className="h-8 w-8 text-green-500" />, value: 5 },
  { level: 'Very Good', icon: <Smile className="h-8 w-8 text-lime-500" />, value: 4 },
  { level: 'Satisfactory', icon: <Meh className="h-8 w-8 text-yellow-500" />, value: 3 },
  { level: 'Poor', icon: <Frown className="h-8 w-8 text-orange-500" />, value: 2 },
  { level: 'Very Poor', icon: <Frown className="h-8 w-8 text-red-500" />, value: 1 },
];

export function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (selectedFeedback === null) {
      toast({
        title: "Selection Required",
        description: "Please select a feedback option.",
        variant: "destructive",
      });
      return;
    }
    // In a real app, you would send this feedback to your backend (e.g., Firestore)
    console.log("Feedback submitted:", selectedFeedback);

    if (selectedFeedback <= 2) { // For "Poor" or "Very Poor"
      toast({
        title: "We Appreciate Your Honesty",
        description: "We're sorry to hear about your experience. Your feedback is valuable, and we'll strive to make necessary improvements. Thank you.",
        variant: "default",
        duration: 7000,
      });
    } else {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your response! We're glad to hear from you.",
      });
    }
    setSelectedFeedback(null); // Reset selection
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
            <MessageSquarePlus className="mr-2 h-4 w-4" /> Feedback
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Share Your Experience</AlertDialogTitle>
          <AlertDialogDescription>
            How would you rate your video consultation? Your feedback helps us improve.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="flex justify-around items-center gap-2">
            {feedbackOptions.map((option) => (
              <button
                key={option.value}
                title={option.level}
                onClick={() => setSelectedFeedback(option.value)}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 ease-in-out",
                  selectedFeedback === option.value
                    ? "border-primary bg-primary/10 scale-110 shadow-lg"
                    : "border-transparent hover:bg-accent hover:border-accent-foreground/30",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
              >
                {option.icon}
                <span className={cn(
                    "mt-2 text-xs font-medium",
                    selectedFeedback === option.value ? "text-primary" : "text-muted-foreground"
                )}>
                    {option.level}
                </span>
              </button>
            ))}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setSelectedFeedback(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={selectedFeedback === null}>
            Submit Feedback
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
