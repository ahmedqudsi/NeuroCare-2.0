"use client";

import { fastTestSteps } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PhoneCall, AlertTriangle, Camera, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FASTStep } from '@/types';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const stepColors = [
  { accent: 'text-blue-500', softBg: 'bg-blue-500/10', border: 'border-blue-500/20', bar: 'bg-blue-500' },
  { accent: 'text-emerald-500', softBg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'bg-emerald-500' },
  { accent: 'text-amber-500', softBg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'bg-amber-500' },
  { accent: 'text-rose-500', softBg: 'bg-rose-500/10', border: 'border-rose-500/20', bar: 'bg-rose-500' },
];

const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-500'];

export function InteractiveFASTTestClient() {
  const { toast } = useToast();
  const [laptopCameraId, setLaptopCameraId] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getLaptopCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        const laptopCamera =
          videoDevices.find((d) =>
            d.label.toLowerCase().includes('laptop') ||
            d.label.toLowerCase().includes('built-in')
          ) || videoDevices[0];

        if (laptopCamera) setLaptopCameraId(laptopCamera.deviceId);
      } catch (error) {
        console.error('Error enumerating devices', error);
      }
    };
    getLaptopCamera();
  }, []);

  const handleEmergencyCall = () => {
    window.location.href = 'tel:112';
    toast({
      title: 'Emergency Action',
      description: 'Attempting to dial 112. If the call doesn\'t start, please dial your local emergency number manually.',
      variant: 'destructive',
      duration: 7000,
    });
  };

  const handleAIScan = () => {
    toast({
      title: '🚧 Coming Soon',
      description: 'AI Scan Test is currently under development. Stay tuned for this feature!',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-6 duration-700">

      {/* ── Page Header ── */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          F.A.S.T.{' '}
          <span className="text-destructive">Stroke Test</span>
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
          Use the F.A.S.T. test to quickly identify common signs of a stroke.
          If you observe <span className="font-semibold text-foreground">any of these signs</span>, call emergency services immediately.
        </p>

        {/* Urgency strip */}
        <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <Clock className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
            Time is critical — every minute without treatment can cause lasting damage.
          </p>
        </div>
      </div>

      {/* ── FAST Steps Accordion ── */}
      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
        className="space-y-3"
      >
        {fastTestSteps.map((step: FASTStep, index: number) => {
          const IconComponent = step.icon || (() => null);
          const color = stepColors[index % stepColors.length];
          const isOpen = openItem === step.id;

          return (
            <AccordionItem
              value={step.id}
              key={step.id}
              className={cn(
                'rounded-2xl border bg-card overflow-hidden transition-all duration-300',
                'animate-in fade-in slide-in-from-bottom-4',
                delays[index % delays.length],
                isOpen ? `${color.border} shadow-md` : 'border-border hover:border-border/80 hover:shadow-sm'
              )}
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline group">
                <div className="flex items-center gap-4 w-full">
                  {/* Step letter badge */}
                  <div className={cn(
                    'flex items-center justify-center w-11 h-11 rounded-xl shrink-0 transition-colors duration-200',
                    isOpen ? color.softBg : 'bg-muted'
                  )}>
                    <IconComponent className={cn('h-6 w-6 transition-colors duration-200', isOpen ? color.accent : 'text-muted-foreground')} />
                  </div>

                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-xs font-bold uppercase tracking-widest transition-colors duration-200',
                        isOpen ? color.accent : 'text-muted-foreground'
                      )}>
                        {step.id}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  </div>

                  <ChevronRight className={cn(
                    'h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200',
                    isOpen ? 'rotate-90' : 'group-hover:translate-x-0.5'
                  )} />
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-5">
                {/* Colored top bar */}
                <div className={cn('h-0.5 rounded-full mb-4', color.bar, 'opacity-30')} />

                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {step.description}
                </p>

                <ul className="space-y-2 mb-4">
                  {step.checkItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className={cn('mt-1.5 h-1.5 w-1.5 rounded-full shrink-0', color.bar)} />
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className={cn('rounded-xl p-3.5 text-sm text-muted-foreground leading-relaxed', color.softBg)}>
                  {step.details}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* ── Action Buttons ── */}
      <Card className="border-border overflow-hidden">
        <CardHeader className="pb-0 pt-5 px-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Quick Actions
          </p>
        </CardHeader>
        <CardContent className="p-5 space-y-3">

          {/* Emergency Call — full width, prominent */}
          <Button
            size="lg"
            variant="destructive"
            className="w-full gap-3 rounded-xl h-12 text-base font-semibold shadow-md shadow-destructive/20 hover:shadow-destructive/30 hover:-translate-y-0.5 transition-all duration-200"
            onClick={handleEmergencyCall}
          >
            <PhoneCall className="h-5 w-5" />
            Call Emergency (112)
          </Button>

          {/* AI Scan Test — under development */}
          <div className="relative">
            <Button
              size="lg"
              className="w-full gap-3 rounded-xl h-12 text-base font-semibold hover:-translate-y-0.5 transition-all duration-200 opacity-70"
              variant="outline"
              onClick={handleAIScan}
            >
              <Camera className="h-5 w-5" />
              AI Scan Test
              {/* Under dev badge */}
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 text-[10px] font-semibold text-amber-500 uppercase tracking-wide">
                <Sparkles className="h-2.5 w-2.5" />
                Soon
              </span>
            </Button>
          </div>

          {/* AI feature info */}
          <div className="flex items-start gap-3 rounded-xl border border-dashed border-amber-500/25 bg-amber-500/5 px-4 py-3">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-0.5">
                AI Scan Test — Under Development
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our AI-powered facial scan to detect stroke symptoms in real-time is currently being built. It will use your camera to analyze facial drooping, eye movement, and more.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-1">
            If you suspect a stroke, <span className="font-semibold text-foreground">every second counts.</span> Do not delay calling emergency services.
          </p>

        </CardContent>
      </Card>

    </div>
  );
}