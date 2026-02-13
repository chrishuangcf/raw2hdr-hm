import React, { useState } from 'react';
import { Layers, Aperture, Share2, Eye, Zap, Image as ImageIcon } from 'lucide-react';
import Hero from './components/Hero';
import HdrDemo from './components/HdrDemo';
import HdrSlider from './components/HdrSlider';
import ComparisonSection from './components/ComparisonSection';
import AppScreenshots from './components/AppScreenshots';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import { FeatureCard } from './components/FeatureCard';

const App: React.FC = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  if (showPrivacyPolicy) {
    return <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />;
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-blue-500 selection:text-white">
      <Hero />
      
      {/* HDR Demo & Stats */}
      <section id="visualization" className="px-4 -mt-12 relative z-20 scroll-mt-24 pb-20">
         <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
            {/* New Nits Slider */}
            <HdrSlider />
            
            {/* Divider */}
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>

            {/* Histogram Visualization */}
            <HdrDemo />
         </div>
      </section>

      {/* Main Value Prop */}
      <section className="py-24 px-4 bg-gray-950" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why standard photos feel flat</h2>
            <p className="text-lg text-gray-400">
              Standard SDR photos are limited to just 16 million colors. 
              <span className="text-white font-semibold"> 10-bit HDR unlocks over 1 billion colors</span>, 
              bringing back the depth, luminance, and presence of the moment you captured.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              title="Brighter Whites" 
              description="Whites that truly shine without washing out, just like viewing a slide projector."
              icon={<Zap className="w-6 h-6" />}
            />
            <FeatureCard 
              title="Deeper Shadows" 
              description="Visible detail in the darkest areas instead of crushed pure black pixels."
              icon={<Eye className="w-6 h-6" />}
            />
            <FeatureCard 
              title="Richer Colors" 
              description="64x more color information matches what your eyes actually saw."
              icon={<Aperture className="w-6 h-6" />}
            />
            <FeatureCard 
              title="Perfect for Social" 
              description="Instagram, Threads, and iMessage now support HDR. Stop the scroll with glowing images."
              icon={<Share2 className="w-6 h-6" />}
            />
            <FeatureCard 
              title="Luminous B&W" 
              description="Transform photos into glowing monochrome masterpieces that look like backlit prints."
              icon={<Layers className="w-6 h-6" />}
            />
            <FeatureCard 
              title="Gallery Frames" 
              description="Add elegant borders that create a reference point, making HDR content appear to emit light."
              icon={<ImageIcon className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      <ComparisonSection />
      
      <AppScreenshots />

      {/* CTA Strip */}
      <section className="py-20 bg-blue-600 text-white text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Single RAW. Zero Loss.</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Don't let your camera's potential go to waste. Modern sensors capture 14-bit data. 
            Stop compressing it down to 8-bit.
          </p>
        </div>
      </section>

      <Footer onPrivacyPolicyClick={() => setShowPrivacyPolicy(true)} />
    </div>
  );
};

export default App;