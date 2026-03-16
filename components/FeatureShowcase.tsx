import React from 'react';
import { motion } from 'framer-motion';
import { Sliders, Aperture, Film, Crosshair, Layout, Layers, ScanLine, Wand2 } from 'lucide-react';

const features = [
  {
    title: "Film Simulation LUTs",
    description: "50+ curated color profiles tuned for Fujifilm (PROVIA, Velvia, ASTIA, Classic Chrome, ACROS…), Panasonic V-Log, Leica, classic film stocks, and cinematic grades. Pro feature.",
    icon: <Film />,
    color: "amber",
  },
  {
    title: "Advanced Editor",
    description: "Exposure (±3 EV), contrast, highlights, shadows, black point, white balance, saturation, and vibrance — all with a live histogram showing when highlights clip.",
    icon: <Sliders />,
    color: "blue",
  },
  {
    title: "Noise Reduction",
    description: "ISO-aware auto NR suggestions. Loupe magnifier for pixel-level inspection with an edge-detection overlay to see exactly where detail is preserved vs. smoothed.",
    icon: <Crosshair />,
    color: "emerald",
  },
  {
    title: "Lens Correction",
    description: "Automatic distortion and vignetting correction from a built-in lens database. Manual override with A/B/C distortion and K1/K2/K3 vignetting coefficients.",
    icon: <ScanLine />,
    color: "purple",
  },
  {
    title: "Frame Designs",
    description: "8 customisable overlays — EXIF card, film strip with sprocket holes, journal with live weather & GPS, palette with dominant colour swatches, and more.",
    icon: <Layout />,
    color: "rose",
  },
  {
    title: "Batch Processing",
    description: "Select and process multiple RAW files in one tap. Pick from Photos, Files, iCloud Drive, Dropbox, or Google Drive. Export at 25%, 50%, 75%, or full resolution.",
    icon: <Layers />,
    color: "cyan",
  },
  {
    title: "HDR Preview & Compare",
    description: "Side-by-side split-screen comparison of your processed HDR versus the original SDR. Pinch to zoom, pan, and inspect every detail in the full-screen viewer.",
    icon: <Wand2 />,
    color: "orange",
  },
  {
    title: "EXIF Preservation",
    description: "Camera make/model, lens, focal length, aperture, shutter speed, ISO, GPS coordinates, and timestamp all carried through to every exported file.",
    icon: <Aperture />,
    color: "violet",
  },
];

const colorMap: Record<string, string> = {
  amber: "group-hover:bg-amber-500",
  blue: "group-hover:bg-blue-500",
  emerald: "group-hover:bg-emerald-500",
  purple: "group-hover:bg-purple-500",
  rose: "group-hover:bg-rose-500",
  cyan: "group-hover:bg-cyan-500",
  orange: "group-hover:bg-orange-500",
  violet: "group-hover:bg-violet-500",
};

const FeatureShowcase: React.FC = () => {
  return (
    <section className="py-24 bg-black" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest">
              <Aperture className="w-3 h-3" /> 07. Professional Tools
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Professional Tools.<br /><span className="text-blue-400">HDR Native.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Every feature is built around Apple's RAW engine and the expanded dynamic range of modern iPhone, iPad, and Apple TV displays.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group p-7 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-5 transition-colors ${colorMap[feature.color]} group-hover:text-white`}>
                {React.cloneElement(feature.icon as React.ReactElement, { className: "w-5 h-5" })}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
