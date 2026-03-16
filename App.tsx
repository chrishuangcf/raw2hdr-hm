import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Aperture, Share2, Eye, Zap, Image as ImageIcon, Sliders, ShieldCheck, FileCode, Monitor, Palette } from 'lucide-react';
import Hero from './components/Hero';
import HdrDemo from './components/HdrDemo';
import HdrSlider from './components/HdrSlider';
import { FeatureCard } from './components/FeatureCard';
import ThreeHistogram from './components/ThreeHistogram';
import BitDepthVisualizer from './components/BitDepthVisualizer';
import GamutGraph from './components/GamutGraph';
import FeatureShowcase from './components/FeatureShowcase';
import ComparisonSection from './components/ComparisonSection';
import AppScreenshots from './components/AppScreenshots';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';

const App: React.FC = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  if (showPrivacyPolicy) {
    return <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />;
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-blue-500 selection:text-white">
      {/* Original Hero Section */}
      <Hero />
      
      {/* Original HDR Demo & Stats */}
      <section id="visualization" className="px-4 -mt-12 relative z-20 scroll-mt-24 pb-20">
         <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
            {/* Nits Slider */}
            <HdrSlider />
            
         </div>
      </section>

      {/* NEW EDUCATION SECTIONS START HERE */}

      {/* 2. The 3D Histogram - Dynamic Range Visualization */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-widest">
              <Monitor className="w-3 h-3" /> 01. Dynamic Range
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Visualizing <span className="italic text-emerald-400">Headroom</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              These particles represent the distribution of light in an image. In SDR, the "cloud" is squashed—anything brighter than 100 nits is lost. In HDR, the cloud expands vertically, preserving the intense highlights of the real world.
            </p>
            <div className="space-y-4">
               <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <div className="text-sm text-gray-400"><span className="text-white font-bold">SDR:</span> Clipped at 100 nits. Highlights look like flat white patches.</div>
               </div>
               <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <div className="text-sm text-gray-400"><span className="text-blue-400 font-bold">HDR:</span> Reaches 1000+ nits. Highlights glow with color and detail.</div>
               </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 gap-4">
            <ThreeHistogram mode="SDR" />
            <ThreeHistogram mode="HDR" />
          </div>
        </div>
        <HdrDemo />
      </section>

      {/* 3. Bit Depth */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-zinc-900/50 rounded-3xl p-8 md:p-16 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent" />
          <div className="grid lg:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono uppercase tracking-widest">
                <Sliders className="w-3 h-3" /> 02. Bit Depth
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">From 16.7 Million to <span className="text-blue-400">1.07 Billion</span> Colors</h2>
              
              <div className="space-y-12">
                <BitDepthVisualizer bits={8} />
                <BitDepthVisualizer bits={10} />
              </div>

              <p className="text-gray-400 leading-relaxed">
                Bit depth determines the precision of color steps. 8-bit only provides 256 steps per channel, leading to visible banding in gradients. 10-bit HDR provides 1,024 steps, creating the seamless, lifelike transitions required for true realism.
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4">
               <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm group hover:border-blue-500/30 transition-colors">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" /> 16-bit RAW Processing
                  </h4>
                  <p className="text-sm text-gray-500">
                    We process your images in 16-bit precision (65,536 steps), ensuring zero data loss during tone mapping before exporting to 10-bit HDR HEIC.
                  </p>
               </div>
               <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm group hover:border-emerald-500/30 transition-colors">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" /> Gain Map Technology
                  </h4>
                  <p className="text-sm text-gray-500">
                    Our HEIC files store an SDR base + HDR Gain Map, allowing the same file to display perfectly on both SDR and HDR screens.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. True vs. Traditional HDR */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono uppercase tracking-widest">
              <Zap className="w-3 h-3" /> 03. True vs. Traditional
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Contrast is <span className="italic text-orange-400">Reality</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Traditional HDR (Tone Mapping) compresses brightness to fit SDR limits, often looking "flat" or "fake". True HDR allows shadows to stay dark and highlights to truly glow. This stronger contrast reflects real-world lighting more accurately.
            </p>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
               {/* Base Image (Traditional/Flat) */}
               <img 
                 src="https://picsum.photos/seed/hdr-comp/800/450?blur=2" 
                 alt="Traditional HDR" 
                 className="w-full h-full object-cover grayscale opacity-50"
                 referrerPolicy="no-referrer"
               />
               {/* Overlay Image (True HDR/Vibrant) */}
               <motion.div 
                 className="absolute inset-0 overflow-hidden border-l-2 border-orange-400"
                 initial={{ width: "50%" }}
                 whileInView={{ width: ["50%", "100%", "50%"] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               >
                  <img 
                    src="https://picsum.photos/seed/hdr-comp/800/450" 
                    alt="True HDR" 
                    className="absolute inset-0 w-[800px] h-full object-cover max-w-none"
                    referrerPolicy="no-referrer"
                  />
               </motion.div>
               <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/60 rounded text-[8px] font-mono text-white">TRADITIONAL (FLAT)</div>
               <div className="absolute bottom-4 right-4 px-2 py-1 bg-orange-500/80 rounded text-[8px] font-mono text-white">TRUE HDR (VIBRANT)</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Color Spaces */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase tracking-widest">
              <Palette className="w-3 h-3" /> 04. Color Spaces
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Wider Gamut. Richer Life.</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Color spaces define the palette available to an image. HDR uses Rec.2020, capturing colors that sRGB simply cannot represent—like the deep neon of a city at night or the intense saturation of a sunset.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'sRGB', desc: 'Standard web color. Misses 60% of visible color.', color: 'bg-red-500' },
                { name: 'Display P3', desc: 'Modern Apple/Android devices. Richer reds/greens.', color: 'bg-emerald-500' },
                { name: 'Rec.2020', desc: 'The HDR standard. Captures nearly all visible color.', color: 'bg-blue-500' },
              ].map((space, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className={`w-3 h-3 rounded-full ${space.color}`} />
                  <div>
                    <div className="text-sm font-bold text-white">{space.name}</div>
                    <div className="text-xs text-gray-500">{space.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <GamutGraph />
        </div>
      </section>

      {/* 6. Gain Map Architecture */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-zinc-900 rounded-3xl p-8 md:p-16 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-transparent" />
          <div className="grid lg:grid-cols-2 gap-12 relative z-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest">
                <Layers className="w-3 h-3" /> 05. Gain Map
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">One File. <span className="text-blue-400">Two Worlds.</span></h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                HDR HEIC is a hybrid format. It stores a standard SDR image for compatibility and a high-resolution "Gain Map" that tells HDR displays exactly how much to brighten each pixel.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-1 rounded bg-white/10 text-white"><ShieldCheck className="w-4 h-4" /></div>
                  <div>
                    <div className="font-bold text-white">SDR Base Layer</div>
                    <div className="text-sm text-gray-500">Ensures your photo looks great on older screens and social media.</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-1 rounded bg-blue-500/20 text-blue-400"><Zap className="w-4 h-4" /></div>
                  <div>
                    <div className="font-bold text-blue-400">HDR Gain Map</div>
                    <div className="text-sm text-gray-500">Unlocks the peak brightness of OLED and Mini-LED displays.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl bg-black/40 border border-white/10 p-4 flex items-center justify-center overflow-hidden group">
               <div className="flex gap-4 items-center">
                  {/* SDR Layer */}
                  <motion.div 
                    className="w-24 h-36 md:w-32 md:h-48 rounded-lg bg-zinc-800 border border-white/20 relative overflow-hidden"
                    whileHover={{ y: -10 }}
                  >
                     <img src="https://picsum.photos/seed/gainmap-demo/200/300" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                     <div className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-mono font-bold text-white bg-black/20">SDR BASE</div>
                  </motion.div>
                  <div className="text-xl font-bold text-gray-500">+</div>
                  {/* Gain Map Layer */}
                  <motion.div 
                    className="w-24 h-36 md:w-32 md:h-48 rounded-lg bg-zinc-900 border border-white/20 relative overflow-hidden"
                    whileHover={{ y: -10 }}
                  >
                     <img src="https://picsum.photos/seed/gainmap-demo/200/300?grayscale" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                     <div className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-mono font-bold text-white bg-black/40 text-center px-2">GAIN MAP</div>
                  </motion.div>
                  <div className="text-xl font-bold text-gray-500">=</div>
                  {/* Final HDR */}
                  <motion.div 
                    className="w-24 h-36 md:w-32 md:h-48 rounded-lg bg-white border border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                     <img src="https://picsum.photos/seed/gainmap-demo/200/300" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                     <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30" />
                     <div className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-mono font-bold text-blue-600">TRUE HDR</div>
                  </motion.div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why SDR Falls Short */}
      <section className="py-24 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest">
              <Eye className="w-3 h-3" /> 06. Why SDR Falls Short
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Why Standard Photos Feel Flat</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
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

      {/* 8. Professional Tools */}
      <FeatureShowcase />

      {/* 9. Traditional vs. True Pipeline */}
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
