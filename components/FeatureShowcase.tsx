import React from 'react';
import { motion } from 'framer-motion';
import { Sliders, Maximize, Palette, ShieldCheck, Layout, Info, Play, Aperture } from 'lucide-react';

const features = [
  {
    title: "RAW Editing",
    description: "Full control over exposure, highlights, and shadows in 16-bit space.",
    icon: <Sliders />,
    color: "blue",
    image: "/raw2hdr-hm/images/loading_raw.png"
  },
  {
    title: "HDR Processing",
    description: "Split-screen preview to see exactly how your HDR headroom is used.",
    icon: <Maximize />,
    color: "emerald",
    image: "/raw2hdr-hm/images/processing_hdr.png"
  },
  {
    title: "File Selection",
    description: "Batch-select RAW files from your library for one-tap HDR conversion.",
    icon: <Palette />,
    color: "purple",
    image: "/raw2hdr-hm/images/selecting_files_to_process.png"
  },
  {
    title: "Custom Frames",
    description: "Add elegant borders with aspect ratio controls that act as a luminance reference.",
    icon: <Layout />,
    color: "rose",
    image: "/raw2hdr-hm/images/editor.png"
  },
  {
    title: "EXIF Viewer",
    description: "Deep dive into camera metadata, lens info, and HDR brightness stats.",
    icon: <Info />,
    color: "cyan",
    image: "/raw2hdr-hm/images/exif_view.png"
  },
  {
    title: "Lens Correction",
    description: "Automatic correction for distortion, vignetting, and chromatic aberration.",
    icon: <ShieldCheck />,
    color: "orange",
    image: "/raw2hdr-hm/images/loading_raw.png"
  },
];

const FeatureShowcase: React.FC = () => {
  return (
    <section className="py-24 bg-black" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest">
              <Aperture className="w-3 h-3" /> 07. Professional Tools
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Professional Tools.<br/><span className="text-blue-400">HDR Native.</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">Every feature is built to respect the expanded dynamic range of modern displays.</p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:bg-blue-400 transition-colors">
                <Play className="w-4 h-4 fill-current" /> Watch Demo
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors`}>
                {React.cloneElement(feature.icon as React.ReactElement, { className: "w-6 h-6" })}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              
              {/* App Screenshot */}
              <div className="mt-8 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full object-cover object-top max-h-48 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
