import { MotivationalQuoteCard } from '@/components/features/common/MotivationalQuoteCard';
import { motivationalQuotes } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Lightbulb, Brain, Users, ShieldCheck,
  Clock, Heart, Activity, ArrowRight, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';
import FeaturedInsights from '@/components/features/FeaturedInsights';
import CreditsSection from '@/components/CreditsSection';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Welcome to your NeuroCare dashboard.',
};

export default async function DashboardPage() {
  const appName = siteConfig.appName;
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const stats = [
    {
      title: 'Global Impact',
      value: '15M+',
      desc: 'people suffer a stroke globally each year',
      icon: Users,
      accent: 'text-blue-500',
      softBg: 'bg-blue-500/10',
      border: 'border-blue-500/15',
    },
    {
      title: 'Preventable',
      value: '80%',
      desc: 'of strokes can be prevented with early care',
      icon: ShieldCheck,
      accent: 'text-emerald-500',
      softBg: 'bg-emerald-500/10',
      border: 'border-emerald-500/15',
    },
    {
      title: 'Golden Window',
      value: '3 mo',
      desc: 'post-stroke are most critical for recovery',
      icon: Clock,
      accent: 'text-amber-500',
      softBg: 'bg-amber-500/10',
      border: 'border-amber-500/15',
    },
  ];

  const tips = [
    {
      icon: Zap,
      label: 'FAST Test',
      desc: 'Learn to identify stroke symptoms instantly using the proven FAST method.',
      accent: 'text-blue-500',
      softBg: 'bg-blue-500/10',
      href: '/fast-test'
    },
    {
      icon: Activity,
      label: 'Rehab Exercises',
      desc: 'Guided rehabilitation exercises tailored to aid your recovery journey.',
      accent: 'text-emerald-500',
      softBg: 'bg-emerald-500/10',
      href: '/rehabilitation'
    },
    {
      icon: Heart,
      label: 'Healthcare Services',
      desc: 'Stay healthy and positive with our full suite of healthcare tools.',
      accent: 'text-rose-500',
      softBg: 'bg-rose-500/10',
      href: '/healthcare-services'
    },
  ];

  return (
    <div className="space-y-8 py-6 px-1">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-in fade-in slide-in-from-top-6 duration-700">
        {/* Left */}
        <div className="space-y-6">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            Your Digital Ally in{" "}
            <span className="relative inline-block text-primary">
              Brain Stroke
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary/30" />
            </span>{" "}
            Recovery
            <Brain className="inline-block ml-2 h-8 w-8 text-primary align-middle opacity-80" />
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
            {appName} empowers stroke patients and caregivers with smart tools,
            guided exercises, and real-time support — every step of the way.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link href="/healthcare-services">
            <Button className="rounded-full px-7 gap-2 shadow-sm shadow-primary/20 hover:shadow-primary/30 transition-shadow">
              Explore Now <ArrowRight className="h-4 w-4" />
            </Button>
            </Link>
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground pt-1">
            {[
              { icon: Brain, label: "Cognitive Recovery" },
              { icon: Heart, label: "24/7 Assistance" },
              { icon: Activity, label: "Progress Tracking" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Stat cards */}
        <div className="flex flex-col gap-3">
          {stats.map(
            ({ title, value, desc, icon: Icon, accent, softBg, border }) => (
              <div
                key={title}
                className={`flex items-center gap-4 rounded-2xl border ${border} bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${softBg}`}
                >
                  <Icon className={`h-6 w-6 ${accent}`} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {title}
                  </p>
                  <p className={`text-2xl font-bold ${accent}`}>{value}</p>
                  <p className="text-sm text-muted-foreground leading-snug">
                    {desc}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
      <div className="animate-in fade-in duration-700 delay-200">
        <MotivationalQuoteCard quote={randomQuote} />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <Card className="overflow-hidden">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <Lightbulb className="h-4 w-4 text-primary" />
              </div>
              Quick Tips
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                — Important reminders for your well-being
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tips.map(({ icon: Icon, label, desc, accent, softBg, href }) => (
                <Link key={label} href={href}>
                  <div
                    className="group flex flex-col gap-3 rounded-xl border bg-muted/20 p-4
                 hover:bg-muted/40 transition-all duration-200
                 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-lg ${softBg}`}
                    >
                      <Icon className={`h-4 w-4 ${accent}`} />
                    </div>

                    <div className="flex-1">
                      <p className={`text-sm font-semibold mb-1 ${accent}`}>
                        {label}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    <span
                      className={`flex items-center gap-1 text-xs font-medium ${accent}
                        opacity-0 group-hover:opacity-100
                        -translate-x-1 group-hover:translate-x-0
                        transition-all duration-200`}
                    >
                      Learn more <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="animate-in fade-in duration-700 delay-500">
        <FeaturedInsights />
      </div>
      {/* <CreditsSection /> */}
      <div className="animate-in fade-in duration-700 delay-700">
        <Card className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background">
          <CardContent className="py-10 text-center space-y-5">
            <h2 className="text-2xl font-bold tracking-tight">
              Your recovery journey starts today
            </h2>

            <p className="text-muted-foreground max-w-xl mx-auto">
              Small steps every day lead to meaningful progress. Stay
              consistent, stay hopeful, and let NeuroCare guide you toward
              better health.
            </p>

            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/rehabilitation">
                <Button size="lg" className="rounded-full px-7">
                  Start Exercises
                </Button>
              </Link>
              <Link href="/healthcare-services">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-7"
                >
                  Explore health care services
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}