import React from 'react';
import { Brain, Heart, Users, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const articles = [
  {
    icon: Brain,
    title: 'Stroke Recovery After Brain Injury',
    desc: "Follow a survivor's personal journey through rehabilitation, relearning life after a hemorrhagic stroke caused by AVM.",
    href: 'https://strokerecoveryrehab.com/',
    readTime: '8 min read',
    accent: 'text-blue-500',
    softBg: 'bg-blue-500/10',
    border: 'border-blue-500/15',
  },
  {
    icon: Heart,
    title: 'How to Cope with Stroke Emotionally',
    desc: 'Powerful insights for managing emotional upheaval and building mental strength post-stroke.',
    href: 'https://www.lifeinastroke.com/',
    readTime: '6 min read',
    accent: 'text-rose-500',
    softBg: 'bg-rose-500/10',
    border: 'border-rose-500/15',
  },
  {
    icon: Users,
    title: 'Young Stroke Survivors: Voices & Stories',
    desc: 'Explore real-life stories from young stroke survivors and how community support shapes recovery.',
    href: 'https://differentstrokes.co.uk/what-we-do/blogs/',
    readTime: '5 min read',
    accent: 'text-emerald-500',
    softBg: 'bg-emerald-500/10',
    border: 'border-emerald-500/15',
  },
];

const FeaturedInsights = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">

      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">
            Curated for You
          </p>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Stroke Recovery Reads
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Carefully curated articles backed by research and expert insights.
          </p>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">3 articles</span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {articles.map(({ icon: Icon, title, desc, href, readTime, accent, softBg, border }) => (
          <Card
            key={title}
            className={`group flex flex-col border ${border} transition-all duration-200 hover:-translate-y-1 hover:shadow-md overflow-hidden`}
          >
            <CardContent className="flex flex-col flex-1 gap-4 p-5">

              {/* Icon + read time */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${softBg}`}>
                  <Icon className={`h-5 w-5 ${accent}`} />
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {readTime}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-foreground text-sm leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>

              {/* CTA */}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 text-sm font-medium ${accent} transition-all duration-200 hover:gap-2.5`}
              >
                Read Article
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedInsights;