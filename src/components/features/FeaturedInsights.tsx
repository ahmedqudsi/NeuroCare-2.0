
import React from 'react';
import { Brain, Heart, Users } from 'lucide-react';

const FeaturedInsights = () => {
  return (
    <div className="bg-veryDarkNavy text-white py-12 w-full min-h-screen animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-4 neon-text">Stroke Recovery Reads</h2>
        <p className="text-center text-gray-400 mb-8">
          Dive into our carefully curated collection of articles, backed by research and expert insights.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {/* Card 1 */}
          <div className="w-full md:w-1/3 p-4">
            <div className="rounded-lg shadow-md bg-darkCard neonBorder p-6 hover:scale-105 transition-transform duration-200 flex flex-col h-full">
              <div className="text-center mb-4">
                <Brain className="h-10 w-10 text-primary mx-auto" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-center">Stroke Recovery After Brain Injury</h3>
                <p className="text-gray-400 text-center mb-4">Follow a survivor’s personal journey through rehabilitation, relearning life after a hemorrhagic stroke caused by AVM.</p>
              </div>
              <div className="mt-auto">
                <a href="https://strokerecoveryrehab.com/" target="_blank" rel="noopener noreferrer" className="block text-primary text-center hover:underline">Read Article →</a>
                <p className="text-gray-500 text-center mt-2">8 min read</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-full md:w-1/3 p-4">
            <div className="rounded-lg shadow-md bg-darkCard neonBorder p-6 hover:scale-105 transition-transform duration-200 flex flex-col h-full">
              <div className="text-center mb-4">
                <Heart className="h-10 w-10 text-primary mx-auto" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-center">How to Cope with Stroke Emotionally</h3>
                <p className="text-gray-400 text-center mb-4">Powerful insights for managing emotional upheaval and building mental strength post-stroke.</p>
              </div>
              <div className="mt-auto">
                <a href="https://www.lifeinastroke.com/" target="_blank" rel="noopener noreferrer" className="block text-primary text-center hover:underline">Read Article →</a>
                <p className="text-gray-500 text-center mt-2">6 min read</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="w-full md:w-1/3 p-4">
            <div className="rounded-lg shadow-md bg-darkCard neonBorder p-6 hover:scale-105 transition-transform duration-200 flex flex-col h-full">
              <div className="text-center mb-4">
                <Users className="h-10 w-10 text-primary mx-auto" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-center">Young Stroke Survivors: Voices &amp; Stories</h3>
                <p className="text-gray-400 text-center mb-4">Explore real-life stories from young stroke survivors and how community support shapes recovery.</p>
              </div>
              <div className="mt-auto">
                <a href="https://differentstrokes.co.uk/what-we-do/blogs/" target="_blank" rel="noopener noreferrer" className="block text-primary text-center hover:underline">Read Article →</a>
                <p className="text-gray-500 text-center mt-2">5 min read</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInsights;
