import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { FeatureGrid } from './components/FeatureGrid';
import { NitExplanation } from './components/NitExplanation';
import { ColorScience } from './components/ColorScience';
import { DownloadSection } from './components/DownloadSection';
import { Navbar } from './components/Navbar';
import { BetaDisclaimer } from './components/BetaDisclaimer';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      <Navbar scrolled={scrolled} />
      
      <main className="flex flex-col gap-24 pb-24">
        <HeroSection />
        
        <div className="container mx-auto px-6 space-y-32">
          <FeatureGrid />
          <NitExplanation />
          <ColorScience />
          <BetaDisclaimer />
        </div>
      </main>

      <DownloadSection />
    </div>
  );
};

export default App;