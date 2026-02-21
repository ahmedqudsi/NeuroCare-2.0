
import { MotivationalQuoteCard } from '@/components/features/common/MotivationalQuoteCard';
import { motivationalQuotes } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Brain, Users, ShieldCheck, Clock, Heart, Activity, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site'; 
import type { Metadata } from 'next';
import FeaturedInsights from '@/components/features/FeaturedInsights';
import CreditsSection from '@/components/CreditsSection';


export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Welcome to your NeuroCare dashboard.',
};

export default async function DashboardPage() {
  const appName = siteConfig.appName;

  // For server components, Math.random() is fine as it runs once per render on the server.
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  // Static text, previously from dictionary
  const pageTranslations = {
    welcome: `Welcome to`, 
    description: "Your companion for stroke awareness and recovery."
  };
  const commonTranslations = {
    quickTipsTitle: "Quick Tips",
    quickTipsDescription: "Important reminders for your well-being.",
    tipExploreFAST: `Explore the <span style="color: #87CEEB;">FAST Test</span> to learn about stroke symptoms.`,
    tipRehabExercises: `Check out <span style="color: #87CEEB;">Rehabilitation Exercises</span> to aid your recovery.`,
    // tipSpeechTherapy: "Use the AI Speech Therapy tool to practice your speech.", // Removed as Speech Therapy AI is removed
    tipStayPositive: `Stay healthy and positive by freely utilizing our <span style="color: #87CEEB;">Healthcare Services</span>`
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-8 duration-700">
        {/* Left Side (Main Section) */}
        <div className="space-y-4 mt-4">
          <h1 className="text-6xl font-bold tracking-tight text-foreground">
            <span>Your Digital Ally in </span>
            <span className="text-primary animate-pulse">Brain Stroke Recovery</span>
             <Brain className="inline-block ml-2 h-10 w-10 text-primary animate-pulse" />
          </h1>
          <h2 className="text-lg text-muted-foreground">
            <div className="relative w-full overflow-hidden">
              <p className="animate-marquee-to-left whitespace-nowrap">
                {appName}: Revolutionizing Stroke Recovery
              </p>
            </div>
          </h2>
          <Button className="mt-8">Explore Now</Button>

          {/* Additional Highlights */}
          <div className="mt-4 flex justify-center gap-8 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Cognitive Recovery Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>24/7 Virtual Assistance</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Progress Tracking Tools</span>
            </div>
          </div>
        </div>

        {/* Right Side (Informational Section) */}
        <div className="space-y-4">
          <Card className="hover:scale-105 hover:bg-accent-foreground/10 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-amber-500">Global Impact</CardTitle>
              <Users className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p>15 million people suffer a stroke globally each year</p>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 hover:bg-accent-foreground/10 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-amber-500">Prevention is Possible</CardTitle>
              <ShieldCheck className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p>80% of strokes are preventable</p>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 hover:bg-accent-foreground/10 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-amber-500">The Golden Window</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p>The first 3 months post-stroke are most critical for recovery</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-600 blue-glow">
        <CardHeader>
          <CardTitle className="flex items-center">
             <Lightbulb className="mr-2 h-5 w-5 text-accent" />
            {commonTranslations.quickTipsTitle}
          </CardTitle>
          <CardDescription>
            {commonTranslations.quickTipsDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li className="hover:scale-105 hover:text-foreground/90 transform transition-transform duration-200 ease-in-out origin-left" dangerouslySetInnerHTML={{ __html: commonTranslations.tipExploreFAST }} />
            <li className="hover:scale-105 hover:text-foreground/90 transform transition-transform duration-200 ease-in-out origin-left" dangerouslySetInnerHTML={{ __html: commonTranslations.tipRehabExercises }} />
            {/* <li className="hover:scale-105 hover:text-foreground/90 transform transition-transform duration-200 ease-in-out origin-left">{commonTranslations.tipSpeechTherapy}</li> */}
            <li className="hover:scale-105 hover:text-foreground/90 transform transition-transform duration-200 ease-in-out origin-left" dangerouslySetInnerHTML={{ __html: commonTranslations.tipStayPositive }} />
          </ul>
        </CardContent>
      </Card>
      <FeaturedInsights />
      <CreditsSection />
    </div>
  );
}
