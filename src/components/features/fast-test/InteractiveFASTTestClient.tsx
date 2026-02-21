
"use client";

import { fastTestSteps } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneOutgoing, AlertTriangle, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FASTStep } from '@/types';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';


export function InteractiveFASTTestClient() {
  const { toast } = useToast();
  const [laptopCameraId, setLaptopCameraId] = useState<string | null>(null);

  useEffect(() => {
    const getLaptopCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');

        // Attempt to identify the laptop camera based on the label
        let laptopCamera = videoDevices.find((device) =>
          device.label.toLowerCase().includes('laptop') ||
          device.label.toLowerCase().includes('built-in')
        );

        // If no specific laptop camera is found, use the first video input device
        if (!laptopCamera && videoDevices.length > 0) {
          laptopCamera = videoDevices[0];
        }

        if (laptopCamera) {
          setLaptopCameraId(laptopCamera.deviceId);
        } else {
          console.warn("No camera found");
          toast({
            title: "No Camera Found",
            description: "No camera was found on this device.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error enumerating devices", error);
        toast({
          title: "Camera Error",
          description: "Error accessing camera devices: " + (error as any).message,
          variant: "destructive",
        });
      }
    };

    getLaptopCamera();
  }, [toast]);

  // Static text, previously from dictionary
  const pageStaticText = {
    title: "F.A.S.T. Stroke Test",
    description: "Use the F.A.S.T. test to quickly check for common signs of a stroke. If you see any of these signs, call emergency services immediately.",
    emergencyCallButton: "Emergency Services",
    emergencyCallMessage: "Attempting to dial 112. If the call doesn't start, please dial your local emergency number manually.",
    emergencyCallToastTitle: "Emergency Action"
  };

  const handleEmergencyCall = () => {
    // Attempt to initiate a call to the emergency number for India
    window.location.href = 'tel:112';

    toast({
      title: pageStaticText.emergencyCallToastTitle,
      description: pageStaticText.emergencyCallMessage,
      variant: "destructive",
      duration: 7000, // Keep toast visible for 7 seconds
    });
  };

  // Defines specific delays for each accordion item to achieve a staggered animation
  const itemAnimationDelays = ['delay-300', 'delay-[450ms]', 'delay-600', 'delay-[750ms]'];

  return (
    <Card className="shadow-lg animate-in fade-in slide-in-from-top-8 duration-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <AlertTriangle className="mr-2 h-10 w-10 text-destructive animate-pulse" />
          {pageStaticText.title}
        </CardTitle>
        <CardDescription>
          {pageStaticText.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion 
          type="single" 
          collapsible 
          className="w-full space-y-4"
        >
          {fastTestSteps.map((step: FASTStep, index: number) => {
            const IconComponent = step.icon || (() => null);
            return (
              <AccordionItem
                value={step.id}
                key={step.id}
                className={cn(
                  "relative border bg-card rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]",
                  "animate-in fade-in-0 slide-in-from-bottom-4 duration-500", 
                  itemAnimationDelays[index % itemAnimationDelays.length],
                  "will-change-transform will-change-opacity"
                )}
              >
                <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline">
                  <div className="flex items-center">
                    <IconComponent className="mr-3 h-7 w-7 text-primary" />
                    <span>{step.id} - {step.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  <ul className="list-disc space-y-1 pl-5 mb-3">
                    {step.checkItems.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                  <p className="text-sm bg-secondary p-3 rounded-md">{step.details}</p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-8 delay-[900ms] duration-700">
          <Button
            size="lg"
            variant="destructive"
            className="w-full max-w-md shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out transform"
            onClick={handleEmergencyCall}
            aria-label={pageStaticText.emergencyCallButton}
          >
            <PhoneOutgoing className="mr-2 h-5 w-5" />
            {pageStaticText.emergencyCallButton}
          </Button>
          <Button
            size="lg"
            className="ml-4 w-full max-w-md shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out transform"
            style={{ backgroundColor: '#87CEFA', color: 'black' }}
            onClick={() => {
              const constraints: MediaStreamConstraints = {
                video: laptopCameraId ? { deviceId: { exact: laptopCameraId } } : true,
                audio: false,
              };

              navigator.mediaDevices.getUserMedia(constraints)
                .then((stream) => {
                  // Handle the stream (e.g., display it in a video element)
                  console.log("Camera access granted", stream);
                  // You can add a video element to the page and set its source to the stream
                  // For example:
                  // const video = document.createElement('video');
                  // video.srcObject = stream;
                  // video.play();
                  // document.body.appendChild(video);
                  toast({
                    title: "Camera Access",
                    description: "Laptop camera access granted. The camera stream is now available.",
                  });
                })
                .catch((error) => {
                  // Handle errors
                  console.error("Error accessing camera", error);
                  toast({
                    title: "Camera Access Error",
                    description: "Error accessing laptop camera: " + error.message,
                    variant: "destructive",
                  });
                });
            }}
            aria-label="Start AI Scan Test"
          >
            <Camera className="mr-2 h-5 w-5" />
            AI Scan Test
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            If you suspect a stroke, every second counts. Do not delay.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
