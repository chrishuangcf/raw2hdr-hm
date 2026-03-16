import React, { useRef } from 'react';
import { SmartphoneCharging, ChevronLeft, ChevronRight } from 'lucide-react';

const screenshots = [
  {
    id: 1,
    title: "Import RAW Files",
    alt: "Import RAW files from Photos, Files, or cloud storage",
    src: "/raw2hdr-hm/images/loading_raw.png"
  },
  {
    id: 2,
    title: "Batch Select",
    alt: "Select multiple RAW files for batch HDR processing",
    src: "/raw2hdr-hm/images/selecting_files_to_process.png"
  },
  {
    id: 3,
    title: "HDR Processing",
    alt: "Processing RAW files to 10-bit BT.2100 HLG HEIC",
    src: "/raw2hdr-hm/images/processing_hdr.png"
  },
  {
    id: 4,
    title: "SDR vs HDR Compare",
    alt: "Side-by-side SDR and HDR comparison view",
    src: "/raw2hdr-hm/images/sdr_hdr.png"
  },
  {
    id: 5,
    title: "Advanced Editor",
    alt: "Full editor with histogram, exposure, and tonal controls",
    src: "/raw2hdr-hm/images/editor.png"
  },
  {
    id: 6,
    title: "Film Simulation LUTs",
    alt: "50+ film simulation LUTs — Fujifilm, Panasonic, Leica, cinematic grades",
    src: "/raw2hdr-hm/images/lut_mode.png"
  },
  {
    id: 7,
    title: "Frame Designs",
    alt: "8 customisable frame designs with EXIF data overlays",
    src: "/raw2hdr-hm/images/frame_designs.png"
  },
  {
    id: 8,
    title: "Frame Designs Gallery",
    alt: "Gallery of all available frame design options",
    src: "/raw2hdr-hm/images/frame_designs2.png"
  },
  {
    id: 9,
    title: "Crop & Aspect Ratio",
    alt: "Crop tool with preset aspect ratios",
    src: "/raw2hdr-hm/images/crop_mode.png"
  },
  {
    id: 10,
    title: "Diptych Composer",
    alt: "Side-by-side diptych layout for two photos",
    src: "/raw2hdr-hm/images/diptych_mode.png"
  },
  {
    id: 11,
    title: "EXIF & Metadata",
    alt: "Full EXIF metadata display — camera, lens, aperture, ISO, GPS",
    src: "/raw2hdr-hm/images/exif_view.png"
  },
];

const AppScreenshots: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden relative">
      <div className="text-center mb-12 px-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase tracking-widest">
          <SmartphoneCharging className="w-3 h-3" /> 09. Editing Suite
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Complete Workflow. On iPhone.</h2>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Import RAW, edit with a live histogram, apply film simulations, add frames, and export 10-bit BT.2100 HLG HEIC — all without touching a desktop.
        </p>
      </div>

      {/* Scroll controls */}
      <div className="flex justify-center gap-3 mb-8 px-4">
        <button
          onClick={() => scroll('left')}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto pb-16 pt-8 px-4 md:px-8 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex space-x-6 md:space-x-8 w-max mx-auto">
          {screenshots.map((shot) => (
            <div
              key={shot.id}
              className="relative flex-none group"
            >
              {/* Phone Bezel */}
              <div className="w-[240px] md:w-[280px] aspect-[9/19.5] rounded-[3rem] border-8 border-gray-800 bg-gray-950 shadow-2xl overflow-hidden relative transform transition-transform duration-500 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                {/* Dynamic Island */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-28 bg-black rounded-b-3xl z-30 pointer-events-none" />

                {/* Status bar */}
                <div className="absolute top-1.5 left-8 text-[10px] font-bold text-white z-30 font-sans">9:41</div>
                <div className="absolute top-2 right-7 flex gap-1 z-30">
                  <div className="w-4 h-2.5 border border-white/40 rounded-[2px] relative">
                    <div className="bg-white h-full w-[80%]" />
                  </div>
                </div>

                {/* Screenshot */}
                <img
                  src={shot.src}
                  alt={shot.alt}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add('bg-gray-800', 'flex', 'items-center', 'justify-center');
                      const text = document.createElement('div');
                      text.className = 'text-gray-500 text-center px-4 text-xs';
                      text.textContent = shot.src.split('/').pop() ?? '';
                      parent.appendChild(text);
                    }
                  }}
                />

                {/* Gloss */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none z-20 rounded-[2.5rem]" />

                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-30" />
              </div>

              {/* Caption */}
              <div className="mt-4 text-center">
                <p className="text-gray-400 font-medium text-sm tracking-wide">{shot.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppScreenshots;
