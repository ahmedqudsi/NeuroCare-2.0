import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Github, Linkedin } from 'lucide-react';

const TeamCredits = () => {
  const teamMembers = [
    {
      name: 'Ahmed Qudsi Ghouse Ali Khan',
      role: 'Full Stack Dev. and Project Visionary',
      linkedin: 'https://www.linkedin.com/', // Placeholder
      github: 'https://github.com/', // Placeholder
      image: '/public/Amit Singh.avif', // Placeholder
    },
    {
      name: 'Omar Syed Kaiser',
      role: 'UI/UX Designer and Project Backbone',
      linkedin: 'https://www.linkedin.com/', // Placeholder
      github: 'https://github.com/', // Placeholder
      image: '/public/Anjali Mehta.webp', // Placeholder
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Built by the Minds Behind the Magic</h2>
        <p className="text-muted-foreground">
          Meet the creative and technical team who brought this project to life with vision, design, and code.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {teamMembers.map((member, index) => (
          <Card key={index} className="p-6">
            <CardContent className="flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardTitle className="text-2xl font-semibold">{member.name}</CardTitle>
              <p className="text-lg text-muted-foreground flex items-center justify-center">
                {member.role}
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="ml-2">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="ml-2">
                  <Github className="h-4 w-4" />
                </a>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamCredits;
