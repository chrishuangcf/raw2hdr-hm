import React from 'react';
import selecting from '../public/images/selecting_files_to_process.png';
import processing from '../public/images/processing_hdr.png';
import exif from '../public/images/exif_view.png';
import editor from '../public/images/editor.png';
import loading from '../public/images/loading_raw.png';

const screenshots = [
  { 
    id: 1, 
    title: "Batch Selection",
    alt: "Gallery View showing RAW selection", 
    src: selecting
  },
  { 
    id: 2, 
    title: "Smart Processing",
    alt: "Processing queue status", 
    src: processing
  },
  { 
    id: 3, 
    title: "Deep Metadata",
    alt: "EXIF metadata display", 
    src: exif
  },
  { 
    id: 4, 
    title: "Precision Edit",
    alt: "Editing interface with sunset", 
    src: editor
  },
  { 
    id: 5, 
    title: "Loading Raws",
    alt: "Loading screen share with Apple Photos Albums", 
    src: loading
  },
];

const AppScreenshots: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden relative">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Professional Editing Suite</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          From detailed metadata inspection to 10-bit export. A complete workflow in your pocket.
        </p>
      </div>
      
      {/* Scroll Container */}
      <div className="w-full overflow-x-auto pb-16 pt-8 px-4 md:px-0 no-scrollbar">
        {/* Inner wrapper: widths set to center content if it fits, or scroll if it overflows */}
        <div className="flex px-4 md:px-8 space-x-6 md:space-x-10 w-max mx-auto">
          {screenshots.map((shot) => (
            <div 
              key={shot.id}
              className="relative flex-none group"
            >
               {/* Phone Bezel/Container */}
              <div className="w-[260px] md:w-[300px] aspect-[9/19.5] rounded-[3rem] border-8 border-gray-800 bg-gray-950 shadow-2xl overflow-hidden relative transform transition-transform duration-500 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-28 bg-black rounded-b-3xl z-30 pointer-events-none"></div>
                
                {/* Status Bar Time (Fake) */}
                <div className="absolute top-1.5 left-8 text-[10px] font-bold text-white z-30 font-sans">9:41</div>
                
                {/* Status Bar Icons (Fake) */}
                <div className="absolute top-2 right-7 flex gap-1 z-30">
                    <div className="w-4 h-2.5 border border-white/40 rounded-[2px] relative">
                         <div className="bg-white h-full w-[80%]"></div>
                    </div>
                </div>

                {/* Content Image */}
                <img 
                  src={shot.src} 
                  alt={shot.alt} 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  onError={(e) => {
                    // Fallback visual if image is missing
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement?.classList.add('bg-gray-800', 'flex', 'items-center', 'justify-center');
                    const text = document.createElement('div');
                    text.className = 'text-gray-500 text-center px-4';
                    text.innerHTML = `Add <b>${shot.src.split('/').pop()}</b><br/>to public/images/`;
                    target.parentElement?.appendChild(text);
                  }}
                />
                
                {/* Screen Gloss/Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none z-20 rounded-[2.5rem]"></div>
                
                {/* Bottom Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-30"></div>
              </div>

              {/* Caption */}
              <div className="absolute -bottom-10 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
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