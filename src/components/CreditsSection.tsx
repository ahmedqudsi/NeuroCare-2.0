
import React from 'react';
import { UserCircle2, Github, Linkedin } from 'lucide-react';

const CreditsSection = () => {
  return (
    <div className="bg-[#12161C] text-white min-h-screen py-32">
      <div className="container mx-auto text-center">
        <h2 className="text-6xl font-bold mb-4">Meet the Team</h2>
        <p className="text-lg mb-12 text-gray-400">The minds who designed, built, and brought this project to life.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
          {/* Team Member Cards */}
          <div className="rounded-lg shadow-md p-12 bg-[#161B22]">
            <div className="w-32 h-32 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center">
              <UserCircle2 className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ahmed Qudsi Ghouse Ali Khan</h3>
            <p className="text-blue-400 mb-2">Full-Stack Dev. & Project Visionary</p>
            <div className="flex justify-center mt-2 space-x-4">
              {/* Social Icons */}
              <a href="https://github.com/ahmedqudsi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/in/ahmed-qudsi-ghouse-ali-khan/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="rounded-lg shadow-md p-12 bg-[#161B22]">
            <div className="w-32 h-32 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center">
              <UserCircle2 className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Omar Syed Kaiser</h3>
            <p className="text-blue-400 mb-2">UI/UX Designer & Project Backbone</p>
            <div className="flex justify-center mt-2 space-x-4">
              {/* Social Icons */}
              <a href="https://github.com/OmarSyedK" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/in/omar-syed-kaiser-1337b0368/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsSection;
