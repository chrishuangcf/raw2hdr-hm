import React from 'react';
import { Button } from './Button';
import { Download, ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative flex flex-col justify-center items-center text-center px-4 pt-32 pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="z-10 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-300 text-sm font-medium mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New Version Available
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-tight">
          Transform RAW <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white">
            into Radiance
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Unlock the 1 billion colors hiding in your camera sensor. 
          Convert RAW files to stunning 10-bit HDR that glows on modern displays.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <a href="#download">
            <Button size="lg" className="group">
              <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Download raw2hdr
            </Button>
          </a>
          <a href="#visualization">
            <Button variant="outline" size="lg" className="group">
              How it Works
              <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;