import React from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Aperture, Share2, Eye, Zap, Image as ImageIcon, Sliders, ShieldCheck, FileCode, Monitor, Palette, BookOpen, ArrowRight } from 'lucide-react';
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
import EducationGuide from './components/EducationGuide';
import TechnicalDeepDive from './components/TechnicalDeepDive';
import SdrConstraintDiagram from './components/SdrConstraintDiagram';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black min-h-screen text-white selection:bg-blue-500 selection:text-white">
      {/* Original Hero Section */}
      <Hero />
      
      {/* Original HDR Demo & Stats */}
      <section id="visualization" className="px-6 -mt-12 relative z-20 scroll-mt-24 pb-24">
         <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
            <HdrSlider />
         </div>
      </section>

      {/* NEW EDUCATION SECTIONS START HERE */}

      {/* 2. The 3D Histogram - Dynamic Range Visualization */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-widest">
            <Monitor className="w-3 h-3" /> 01. Dynamic Range
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Visualizing <span className="italic text-emerald-400">Headroom</span></h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            These particles represent the distribution of light in an image. In SDR, the "cloud" is squashed — anything brighter than 100 nits is lost. In HDR, the cloud expands vertically, preserving the intense highlights of the real world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 flex-1">
              <div className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
              <div className="text-sm text-gray-400"><span className="text-white font-bold">SDR:</span> Clipped at 100 nits. Highlights look like flat white patches.</div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 flex-1">
              <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <div className="text-sm text-gray-400"><span className="text-blue-400 font-bold">HDR:</span> Reaches 1000+ nits. Highlights glow with color and detail.</div>
            </div>
          </div>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-6">
          <ThreeHistogram mode="SDR" />
          <ThreeHistogram mode="HDR" />
        </div>
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
                    <Layers className="w-4 h-4 text-emerald-400" /> BT.2100 HLG Output
                  </h4>
                  <p className="text-sm text-gray-500">
                    Output uses the HLG (Hybrid Log-Gamma) transfer function with Rec.2020 colour space — the same HDR standard used by broadcast TV and modern Apple devices. One file, every screen.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience the HDR difference */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono uppercase tracking-widest">
              <Zap className="w-3 h-3" /> 03. True vs. Traditional
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Experience the <span className="italic text-orange-400">HDR Difference</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Traditional HDR (Tone Mapping) compresses brightness to fit SDR limits, often looking "flat" or "fake". True HDR allows shadows to stay dark and highlights to truly glow. This stronger contrast reflects real-world lighting more accurately.
            </p>
            <div className="space-y-3">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Traditional HDR (Tone Mapped)</div>
                <p className="text-sm text-gray-400">Shadows are lifted. Highlights are pulled down. Everything looks evenly exposed — often appearing flat or artificially "painted."</p>
              </div>
              <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/20 space-y-2">
                <div className="text-xs font-mono text-orange-400 uppercase tracking-widest">True HDR (Display HDR)</div>
                <p className="text-sm text-gray-300">Shadows remain genuinely dark. Highlights truly glow above SDR white. High contrast is preserved — looks like a window, not a photo.</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <HdrDemo />
          </motion.div>
        </div>
      </section>

      {/* 5. Color Spaces */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase tracking-widest">
              <Palette className="w-3 h-3" /> 04. Color Spaces
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Wider Gamut. Richer Life.</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Colour spaces define the palette an image can contain. raw2hdr transforms your RAW's colour data all the way to <strong className="text-white">Rec.2020</strong> (BT.2020) — the wide-gamut standard used in HDR broadcast. Those are the vivid reds, neon blues, and saturated greens your sensor captured but JPEG discards.
            </p>
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: 'sRGB', desc: 'Covers ~35% of visible colour. The standard for JPEG and the web — vivid colours are mapped down or clipped.', color: 'bg-red-500' },
                { name: 'Display P3', desc: 'iPhone native display gamut. ~25% wider than sRGB. Richer reds and greens on Apple screens.', color: 'bg-emerald-500' },
                { name: 'Rec.2020 (BT.2020)', desc: "raw2hdr's output colour space. ~75% of visible colour. Paired with BT.2100 HLG for true HDR on Apple devices.", color: 'bg-blue-500' },
              ].map((space, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${space.color}`} />
                  <div>
                    <div className="text-sm font-bold text-white">{space.name}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{space.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GamutGraph />
          </motion.div>
        </div>
      </section>

      {/* 6. Gain Map Architecture */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-zinc-900/50 rounded-3xl p-8 md:p-16 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-transparent" />
          <div className="grid lg:grid-cols-2 gap-12 relative z-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest">
                <Layers className="w-3 h-3" /> 05. HLG Format
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">One File. <span className="text-blue-400">Every Screen.</span></h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                raw2hdr outputs HEIC encoded with <strong className="text-white">BT.2100 HLG</strong> (Hybrid Log-Gamma) — the broadcast HDR standard. HLG's clever curve design means the same file looks correct on SDR screens and stunning on HDR screens, with no conversion or separate export needed.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-1 rounded bg-white/10 text-white"><ShieldCheck className="w-4 h-4" /></div>
                  <div>
                    <div className="font-bold text-white">On any screen</div>
                    <div className="text-sm text-gray-500">Apple's OS tone-maps the HLG signal to SDR on older devices — your photo looks like a perfectly exposed HEIC everywhere.</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-1 rounded bg-blue-500/20 text-blue-400"><Zap className="w-4 h-4" /></div>
                  <div>
                    <div className="font-bold text-blue-400">On iPhone 12 Pro+ / iPad Pro / Apple TV</div>
                    <div className="text-sm text-gray-500">The full HLG headroom renders above SDR white — highlights glow, shadows deepen, and Rec.2020 colours come alive.</div>
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
                     <div className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-mono font-bold text-white bg-black/20">RAW DECODE</div>
                  </motion.div>
                  <div className="text-xl font-bold text-gray-500">→</div>
                  {/* HLG Layer */}
                  <motion.div
                    className="w-24 h-36 md:w-32 md:h-48 rounded-lg bg-zinc-900 border border-white/20 relative overflow-hidden"
                    whileHover={{ y: -10 }}
                  >
                     <img src="https://picsum.photos/seed/gainmap-demo/200/300?grayscale" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                     <div className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-mono font-bold text-white bg-black/40 text-center px-2">HLG CURVE</div>
                  </motion.div>
                  <div className="text-xl font-bold text-gray-500">=</div>
                  {/* Final HDR */}
                  <motion.div 
                    className="w-24 h-36 md:w-32 md:h-48 rounded-lg bg-white border border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                     <img src="https://picsum.photos/seed/gainmap-demo/200/300" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                     <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30" />
                     <div className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-mono font-bold text-blue-600">BT.2100 HLG</div>
                  </motion.div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why HDR photos are better */}
      <section className="max-w-7xl mx-auto px-6 py-24">

          {/* WHY standard photos feel flat */}
          <div className="mb-20 space-y-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest">
                <Eye className="w-3 h-3" /> 06. Why SDR Falls Short
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Why standard photos feel flat</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                The photos your camera saves as JPEG — and every image you see on most websites — are encoded in SDR: Standard Dynamic Range. SDR was designed for CRT monitors from the 1990s. It has hard technical limits baked in that make modern photos look less vivid than the moment you actually captured.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <SdrConstraintDiagram />

              <div className="space-y-3">
                {[
                  {
                    label: 'Highlights clip at 100 nits',
                    detail: 'The sky, a lamp, sunlight on water — anything brighter than 100 nits becomes a flat, featureless white patch. The gradation that makes a highlight look like light, not paper, is permanently discarded.',
                    color: 'border-amber-500/30 bg-amber-500/5',
                    dot: 'bg-amber-400',
                  },
                  {
                    label: 'Shadows crush to pure black',
                    detail: 'Dark areas get pushed to pure black. The texture, colour, and depth that your camera actually captured in the shadows is gone — not compressed, gone.',
                    color: 'border-gray-600/40 bg-gray-800/30',
                    dot: 'bg-gray-500',
                  },
                  {
                    label: 'Colours squeezed into a narrow box',
                    detail: 'sRGB covers only 35% of what the human eye can see. Those vivid Fujifilm greens and deep ocean blues your sensor captured get mapped down or clipped to fit within an arbitrary 1990s boundary.',
                    color: 'border-rose-500/30 bg-rose-500/5',
                    dot: 'bg-rose-400',
                  },
                  {
                    label: 'Gradients band instead of flow',
                    detail: '256 steps per colour channel is not enough for smooth sky gradients, skin tones, or out-of-focus backgrounds. You get visible stepping where there should be silky transitions — this is called banding.',
                    color: 'border-purple-500/30 bg-purple-500/5',
                    dot: 'bg-purple-400',
                  },
                  {
                    label: 'No HDR metadata — OS defaults to SDR',
                    detail: 'JPEG, PNG, and even 16-bit TIFF carry no HLG or BT.2100 colour space tag. The OS has no signal to unlock HDR rendering, so every image is treated as SDR regardless of how much dynamic range the original sensor captured.',
                    color: 'border-cyan-500/30 bg-cyan-500/5',
                    dot: 'bg-cyan-400',
                  },
                  {
                    label: 'Locked out of HDR social sharing',
                    detail: 'Instagram, Threads, and iMessage detect the BT.2100 HLG colour space tag to preserve HDR on compatible screens. Without it — as with any JPEG or PNG — the platform treats the image as SDR and the glow is gone permanently.',
                    color: 'border-teal-500/30 bg-teal-500/5',
                    dot: 'bg-teal-400',
                  },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border ${item.color}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.dot}`} />
                    <div>
                      <div className="text-sm font-bold text-white mb-1">{item.label}</div>
                      <div className="text-sm text-gray-400 leading-relaxed">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why HDR is better */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Why HDR photos are better</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              10-bit HDR removes each of those limits.{' '}
              <span className="text-white font-semibold">Over 1 billion colours</span>, real luminance that genuinely glows, and shadows that hold their depth — bringing back the full presence of the moment you captured.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Glowing Highlights"
              description="SDR whites clip at 100 nits and look flat. raw2hdr's HLG output lets highlights reach 1,000+ nits — they appear to emit light on modern iPhone OLED screens."
              icon={<Zap className="w-6 h-6" />}
            />
            <FeatureCard
              title="Deeper Shadows"
              description="Standard JPEGs crush shadow detail to pure black. A 16-bit RAW pipeline retains every step, so your darkest areas still hold texture and colour."
              icon={<Eye className="w-6 h-6" />}
            />
            <FeatureCard
              title="Rec.2020 Colour"
              description="The Rec.2020 wide gamut captures nearly all visible colour. Your Fujifilm Velvia reds and deep ocean blues — that sRGB simply cannot represent — are now preserved."
              icon={<Aperture className="w-6 h-6" />}
            />
            <FeatureCard
              title="Instagram & Threads HDR"
              description="Instagram, Threads, and iMessage support BT.2100 HLG natively. Share your raw2hdr export and the HDR glow is preserved — no re-encoding, no quality loss."
              icon={<Share2 className="w-6 h-6" />}
            />
            <FeatureCard
              title="Film Looks in HDR (Pro)"
              description="50+ curated LUTs — Fujifilm ACROS, Velvia, Panasonic Teal Orange, classic Kodak Portra and more — combined with HDR output. You get the analogue feel and the full tonal range."
              icon={<Layers className="w-6 h-6" />}
            />
            <FeatureCard
              title="Frame Designs"
              description="Film strip, EXIF card, journal with live weather and GPS, colour palette swatches — fully customisable borders that make HDR content appear to emit light on a wall."
              icon={<ImageIcon className="w-6 h-6" />}
            />
          </div>

      </section>

      {/* 8. Professional Tools */}
      <FeatureShowcase />

      {/* 9. Traditional vs. True Pipeline */}
      <ComparisonSection />
      
      <AppScreenshots />

      {/* CTA Strip */}
      <section className="py-20 bg-blue-600 text-white text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 opacity-80" />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.08)_0%,transparent_60%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Single RAW. Zero Loss.</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Your Fujifilm, Sony, or Canon sensor captures 12–14 bits of light data. raw2hdr
            preserves every stop and exports true 10-bit BT.2100 HLG — directly on iPhone.
          </p>
          <a
            href="https://apps.apple.com/us/app/raw2hdr/id6758991441"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-blue-700 font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl"
          >
            Download free on the App Store
          </a>
          <p className="text-sm opacity-60 mt-4">iOS 14+ · One-time Pro purchase · No subscription</p>
        </div>
      </section>

      {/* HDR Education Guide Summary */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 md:px-14 pt-12 pb-8 border-b border-white/5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-6">
                <BookOpen className="w-3 h-3" /> Education Guide
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                The Science Behind the&nbsp;Image
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                HDR photography isn't a filter — it's a fundamentally different way of encoding light. This guide explains the technology raw2hdr uses: from your camera sensor to BT.2100 HLG on your iPhone screen.
              </p>
            </div>

            {/* Three-pillar summary */}
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
              {[
                {
                  color: 'text-emerald-400',
                  dot: 'bg-emerald-400',
                  title: 'Dynamic Range',
                  summary: 'Your camera captures 12–14 stops of light. A standard screen shows only 8. raw2hdr preserves the full sensor headroom and maps it to BT.2100 HLG — so highlights truly glow.',
                  topics: ['What is a "stop" of light?', 'Why SDR clips highlights', 'How Apple EDR renders HLG headroom'],
                },
                {
                  color: 'text-rose-400',
                  dot: 'bg-rose-400',
                  title: 'Colour Space',
                  summary: 'sRGB covers 35% of visible colour. raw2hdr outputs Rec.2020 — the BT.2020 wide gamut used by HDR broadcast. Those extra colours are the vivid ones your sensor actually captured.',
                  topics: ['sRGB vs Display P3 vs Rec.2020', 'Why sunsets look flat in JPEG', 'The sRGB → XYZ → Rec.2020 colour transform'],
                },
                {
                  color: 'text-blue-400',
                  dot: 'bg-blue-400',
                  title: 'Bit Depth',
                  summary: '8-bit photos have 256 steps per channel (16.7 million colours). 10-bit HDR has 1,024 steps (1.07 billion). raw2hdr processes at 16-bit and exports 10-bit — zero banding.',
                  topics: ['Why gradients band in standard photos', '8-bit vs 10-bit vs 16-bit precision', 'How HLG encodes HDR headroom above SDR white'],
                },
              ].map((pillar, i) => (
                <div key={i} className="px-8 md:px-10 py-8 space-y-3">
                  <div className={`w-2 h-2 rounded-full ${pillar.dot}`} />
                  <div className={`text-sm font-bold ${pillar.color}`}>{pillar.title}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">{pillar.summary}</p>
                  <ul className="space-y-1 pt-2">
                    {pillar.topics.map((t, j) => (
                      <li key={j} className="text-xs text-gray-600 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Also covered — two columns */}
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
              <div className="px-8 md:px-14 py-6 bg-white/[0.02]">
                <div className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-3">Also covered in the full guide</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Traditional tone-mapped HDR vs true HDR',
                    'BT.2100 HLG — the HDR standard raw2hdr uses',
                    'CIRAWFilter — Apple\'s native RAW engine',
                    'RAW vs in-camera HDR mode',
                    'Why a single RAW beats bracketing',
                    'Film sims, noise reduction & lens correction',
                  ].map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-8 md:px-14 py-6 bg-white/[0.02]">
                <div className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-3">Also covered in the technical deep dive</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'CIRAWFilter — full decode pipeline internals',
                    'Synthetic log encoding from linear RAW',
                    'LUT cache — 9× render speedup',
                    'HLG headroom extension algorithm',
                    'HDR compositing in native float context',
                    'Exposure metering formula & EV curve',
                    'Lens correction in linear light',
                    'Cross-manufacturer LUT compatibility',
                  ].map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="px-8 md:px-14 py-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-gray-500 text-sm max-w-sm">
                Written for both photographers and developers. Every section includes plain-English explanations and optional technical deep-dives.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  to="/education-guide"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
                >
                  Read the Full Guide
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/technical-deep-dive"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  Technical Deep Dive
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer onPrivacyPolicyClick={() => navigate('/privacy-policy')} />
    </div>
  );
};

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/education-guide" element={<EducationGuide onClose={() => null} />} />
    <Route path="/technical-deep-dive" element={<TechnicalDeepDive onClose={() => null} />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy onClose={() => null} />} />
  </Routes>
);

export default App;
