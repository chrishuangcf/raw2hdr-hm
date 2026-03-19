import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, BookOpen, Monitor, Layers, Sliders, Palette, Zap, Eye, Camera, FileImage, Cpu, Settings } from 'lucide-react';

interface SectionProps {
  number: string;
  icon: React.ReactNode;
  accentColor: string;
  title: string;
  subtitle: string;
  plain: React.ReactNode;
  technical: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ number, icon, accentColor, title, subtitle, plain, technical }) => {
  const [showTech, setShowTech] = useState(false);

  return (
    <div className="border-t border-gray-800 pt-12 pb-4">
      <div className="flex items-start gap-4 mb-6">
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${accentColor}`}>
          {icon}
        </div>
        <div>
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{number}</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{title}</h2>
          <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>
        </div>
      </div>

      {/* Plain language content */}
      <div className="ml-0 md:ml-14 space-y-4 text-gray-300 leading-relaxed">
        {plain}
      </div>

      {/* Technical deep-dive toggle */}
      <div className="ml-0 md:ml-14 mt-6">
        <button
          onClick={() => setShowTech(v => !v)}
          className="flex items-center gap-2 text-sm font-mono text-gray-500 hover:text-white transition-colors group"
        >
          <div className="w-5 h-5 rounded border border-gray-700 group-hover:border-gray-500 flex items-center justify-center transition-colors">
            {showTech ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </div>
          {showTech ? 'Hide' : 'Show'} technical details
        </button>

        {showTech && (
          <div className="mt-4 p-5 rounded-xl bg-zinc-900 border border-zinc-700 space-y-3 text-sm text-gray-400 leading-relaxed font-mono">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3 font-sans">Technical Deep Dive</div>
            {technical}
          </div>
        )}
      </div>
    </div>
  );
};

const Callout: React.FC<{ children: React.ReactNode; variant?: 'info' | 'note' | 'example' }> = ({ children, variant = 'info' }) => {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    note: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    example: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  };
  return (
    <div className={`rounded-xl border px-5 py-4 text-sm leading-relaxed ${styles[variant]}`}>
      {children}
    </div>
  );
};

const CompareRow: React.FC<{ label: string; sdr: string; hdr: string }> = ({ label, sdr, hdr }) => (
  <div className="grid grid-cols-3 gap-2 text-sm py-2 border-b border-gray-800 last:border-0">
    <div className="text-gray-500">{label}</div>
    <div className="text-gray-300">{sdr}</div>
    <div className="text-blue-300 font-medium">{hdr}</div>
  </div>
);

const EducationGuide: React.FC<{ onClose?: () => void }> = () => {
  const navigate = useNavigate();
  const tocItems = [
    { id: 'what-is-hdr', label: 'Understanding HDR' },
    { id: 'dynamic-range', label: 'Dynamic Range' },
    { id: 'sdr-vs-hdr', label: 'SDR vs HDR' },
    { id: 'bit-depth', label: 'Bit Depth' },
    { id: 'traditional-hdr', label: 'Traditional HDR' },
    { id: 'true-hdr', label: 'True HDR Realism' },
    { id: 'color-spaces', label: 'Color Spaces' },
    { id: 'heic-technology', label: 'HDR HEIC Format' },
    { id: 'raw-workflow', label: 'RAW Workflow' },
    { id: 'raw-vs-camera', label: 'RAW vs In-Camera HDR' },
    { id: 'app-features', label: 'App Features' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      {/* Sticky header */}
      <div className="sticky top-0 bg-gray-950/95 backdrop-blur border-b border-gray-900 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">HDR Photography Education Guide</span>
          </div>
          <div className="w-16 text-right text-xs text-gray-600 font-mono">11 topics</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 lg:flex gap-12">

        {/* Sidebar table of contents — desktop only */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-20 space-y-1">
            <div className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-4">Contents</div>
            {tocItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-xs text-gray-500 hover:text-white transition-colors py-1 px-2 rounded hover:bg-white/5"
              >
                {item.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          {/* Hero */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-6">
              <BookOpen className="w-3 h-3" /> Education Guide
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Understanding RAW&nbsp;→&nbsp;HDR&nbsp;HEIC Imaging
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              A guide to modern HDR photography — written for everyone. Whether you just want to know why HDR photos look more vivid, or you want to understand the exact technical pipeline, this guide covers it all.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-400">For photographers</span>
              <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-400">For developers</span>
              <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-400">Plain English + Technical details</span>
            </div>
          </div>

          {/* ── Section 1 ── */}
          <div id="what-is-hdr">
            <Section
              number="01"
              icon={<Eye className="w-5 h-5 text-sky-400" />}
              accentColor="bg-sky-500/10"
              title="Understanding HDR"
              subtitle="What your eyes see that cameras struggle to capture"
              plain={
                <>
                  <p>
                    Think about standing outside on a sunny day. You can look at the dark shadow under a tree and clearly see the bark and leaves. Then shift your gaze to the bright sky and see the clouds in detail. Your eyes continuously adjust, giving you a seamless view of both dark and bright areas at the same time.
                  </p>
                  <p>
                    Cameras and screens are far more limited. They can only capture or display a narrow slice of that brightness range at any moment. When you take a photo, the camera has to choose: expose for the shadows, or expose for the highlights. One will always look wrong.
                  </p>
                  <p>
                    <strong className="text-white">HDR — High Dynamic Range — is the technology designed to close that gap.</strong> It preserves more of the brightness and color information that the real world contains, so images can look closer to how your eyes actually experienced the scene.
                  </p>
                  <Callout variant="example">
                    <strong>Everyday example:</strong> Have you ever taken a photo indoors near a window, and either the room inside looks too dark or the view outside looks completely white? That's the camera's limited dynamic range at work. HDR helps fix exactly that.
                  </Callout>
                </>
              }
              technical={
                <>
                  <p>HDR imaging is defined by two related but distinct capabilities:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
                    <li><span className="text-gray-300">Capture HDR:</span> The sensor's ability to record a wide luminance ratio (typically expressed in stops or EV).</li>
                    <li><span className="text-gray-300">Display HDR:</span> The panel's ability to reproduce that luminance ratio, measured in nits (cd/m²).</li>
                  </ul>
                  <p className="mt-3">Modern camera sensors achieve ~12–15 stops of dynamic range. SDR displays reproduce approximately 6–8 stops (peak ~100–300 nits). HDR displays (HDR10, Dolby Vision) target 1,000–10,000 nits peak with a minimum black level near 0.0005 nits, enabling a contrast ratio exceeding 1,000,000:1.</p>
                  <p className="mt-3">The RAW → HDR pipeline's goal is to bridge capture dynamic range to display dynamic range without the lossy compression required by SDR output.</p>
                </>
              }
            />
          </div>

          {/* ── Section 2 ── */}
          <div id="dynamic-range">
            <Section
              number="02"
              icon={<Monitor className="w-5 h-5 text-emerald-400" />}
              accentColor="bg-emerald-500/10"
              title="Dynamic Range"
              subtitle="The difference between pitch black and blinding white"
              plain={
                <>
                  <p>
                    Dynamic range is simply the gap between the darkest and brightest parts of an image that still show visible detail. When a system's dynamic range is too small, you lose information at both ends: shadows become pure black and highlights become pure white. That information is gone forever.
                  </p>
                  <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <div className="px-4 pt-4 pb-2 text-xs font-mono text-gray-500 uppercase tracking-widest">Approximate dynamic ranges</div>
                    <div className="px-4 pb-4 space-y-0">
                      <CompareRow label="" sdr="System" hdr="Range" />
                      <CompareRow label="Human vision" sdr="~20 stops (adaptive)" hdr="" />
                      <CompareRow label="Camera sensor" sdr="12–15 stops" hdr="" />
                      <CompareRow label="SDR display" sdr="6–8 stops" hdr="" />
                      <CompareRow label="HDR display" sdr="" hdr="12–15 stops" />
                    </div>
                  </div>
                  <p>
                    Notice the mismatch: your camera captures 14 stops, but a standard screen can only show 8. That means roughly half the information your camera recorded is compressed or discarded just to fit on screen. HDR displays close this gap dramatically.
                  </p>
                </>
              }
              technical={
                <>
                  <p>Dynamic range in photography is expressed logarithmically in stops (EV), where each stop represents a doubling of light. A 14-stop sensor captures a luminance ratio of 2¹⁴ = 16,384:1.</p>
                  <p className="mt-2">SDR displays operate within a roughly 100:1 luminance ratio (peak ~100 nits, black level ~1 nit after gamma). This represents approximately 6.6 stops. Any scene data outside this window must be tone-mapped or clipped.</p>
                  <p className="mt-2">HDR10 standardises a peak of 1,000 nits. Dolby Vision allows up to 10,000 nits with a black level near 0.0005 nits — a contrast ratio of ~20,000,000:1, or approximately 24 stops. This exceeds even adapted human vision in absolute terms.</p>
                  <p className="mt-2">The implication: for the first time, display dynamic range exceeds what most camera sensors capture. The limiting factor has shifted from the screen back to the sensor and the processing pipeline.</p>
                </>
              }
            />
          </div>

          {/* ── Section 3 ── */}
          <div id="sdr-vs-hdr">
            <Section
              number="03"
              icon={<Monitor className="w-5 h-5 text-violet-400" />}
              accentColor="bg-violet-500/10"
              title="SDR vs HDR"
              subtitle="The display standards that changed photography"
              plain={
                <>
                  <p>
                    <strong className="text-white">SDR (Standard Dynamic Range)</strong> has been the default for decades. Most TVs, monitors, and phone screens historically operated in SDR. Photos shared online, JPEG files, and most social media images are SDR. They look fine — but they're working within tight limits.
                  </p>
                  <p>
                    <strong className="text-white">HDR displays</strong> — found in modern iPhones, iPads, MacBooks, OLED TVs, and newer Android phones — can go much brighter and much darker at the same time. This means highlights can genuinely glow and shadows can retain deep, rich detail.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Callout variant="note">
                      <strong>SDR:</strong> 8-bit color, ~100 nits peak brightness, limited contrast. Perfect for older screens and broad compatibility.
                    </Callout>
                    <Callout variant="info">
                      <strong>HDR:</strong> 10-bit color, 1,000+ nits peak brightness, deep blacks. Designed for modern displays that can actually show the difference.
                    </Callout>
                  </div>
                  <p>
                    If you view an HDR image on an SDR screen, it still looks great — because HDR files are built to fall back gracefully (more on that in the HEIC section). But on an HDR screen, the image comes alive in a way that's genuinely striking.
                  </p>
                </>
              }
              technical={
                <>
                  <p>Key standards comparison:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
                    <li><span className="text-gray-300">SDR (Rec.709):</span> 8-bit per channel, BT.1886 gamma, 100 cd/m² reference white, sRGB/Rec.709 colour primaries.</li>
                    <li><span className="text-gray-300">HDR10:</span> 10-bit (static metadata, MaxCLL/MaxFALL), ST.2084 PQ EOTF, Rec.2020 primaries, up to 10,000 nits peak.</li>
                    <li><span className="text-gray-300">Dolby Vision:</span> 12-bit, dynamic metadata per frame, up to 10,000 nits.</li>
                    <li><span className="text-gray-300">HLG (Hybrid Log-Gamma):</span> Backwards-compatible broadcast HDR; used in live TV and some camera outputs.</li>
                    <li><span className="text-gray-300">Apple EDR (Extended Dynamic Range):</span> iOS/macOS framework using headroom above SDR white (1.0) to represent HDR values; this is the rendering path used by HDR HEIC on Apple devices.</li>
                  </ul>
                  <p className="mt-3">Apple's EDR model is notable: it doesn't define an absolute peak nit value at the format level. Instead, the OS reserves display headroom above the SDR reference white and maps HDR content into that headroom dynamically, adapting to ambient light and display capability via the system tone-mapping pipeline.</p>
                </>
              }
            />
          </div>

          {/* ── Section 4 ── */}
          <div id="bit-depth">
            <Section
              number="04"
              icon={<Sliders className="w-5 h-5 text-blue-400" />}
              accentColor="bg-blue-500/10"
              title="Bit Depth and Color Precision"
              subtitle="Why more bits means smoother, more lifelike images"
              plain={
                <>
                  <p>
                    Imagine you're painting a sky gradient from deep blue to pale white. With only a box of 256 crayons, you'd have to make visible jumps between shades — you'd see bands instead of a smooth transition. With 1,024 crayons, those jumps become invisible.
                  </p>
                  <p>
                    That's bit depth in a nutshell. Every pixel in a photo stores color values for red, green, and blue. Bit depth determines how many possible values each of those channels can hold.
                  </p>
                  <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <div className="px-4 pt-4 pb-2 text-xs font-mono text-gray-500 uppercase tracking-widest">Bit depth comparison</div>
                    <div className="px-4 pb-4 space-y-0">
                      <CompareRow label="" sdr="Detail" hdr="" />
                      <CompareRow label="8-bit" sdr="256 steps per channel → 16.7M total colors" hdr="" />
                      <CompareRow label="10-bit" sdr="" hdr="1,024 steps per channel → 1.07B total colors" />
                      <CompareRow label="16-bit" sdr="65,536 steps (editing precision)" hdr="" />
                    </div>
                  </div>
                  <p>
                    Standard photos (JPEG) are 8-bit. They're perfectly fine for many uses, but in areas with subtle tonal changes — sunsets, clear skies, skin tones — you may notice faint banding. HDR images use 10-bit, which eliminates this problem and creates the smooth, lifelike gradients that make HDR so compelling.
                  </p>
                </>
              }
              technical={
                <>
                  <p>In an RGB image, each channel is quantised to 2ⁿ discrete levels, where n is the bit depth.</p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
                    <li><span className="text-gray-300">8-bit:</span> 256 levels/channel. Total addressable colours: 256³ = 16,777,216. Sufficient for most SDR content but susceptible to contouring/banding in low-contrast gradients due to quantisation error.</li>
                    <li><span className="text-gray-300">10-bit:</span> 1,024 levels/channel. 1,073,741,824 total colours. The HDR10 and Apple EDR minimum. Quantisation error is reduced ~4× versus 8-bit, eliminating visible banding at typical viewing distances.</li>
                    <li><span className="text-gray-300">16-bit:</span> 65,536 levels/channel. Used internally in RAW processing pipelines (e.g., LibRaw, RawTherapee, Lightroom). Ensures that floating-point operations (exposure, curves, NR) do not accumulate rounding errors before final quantisation to 10-bit.</li>
                  </ul>
                  <p className="mt-3">This application processes in 16-bit linear light before tone-mapping to PQ or EDR headroom, then quantises to 10-bit for the HEIC output. The gain map itself is typically stored at 8-bit per channel because it encodes relative brightness ratios (logarithmic space), not absolute colour values, so 8-bit precision is sufficient for smooth gain reconstruction.</p>
                </>
              }
            />
          </div>

          {/* ── Section 5 ── */}
          <div id="traditional-hdr">
            <Section
              number="05"
              icon={<Camera className="w-5 h-5 text-orange-400" />}
              accentColor="bg-orange-500/10"
              title="Traditional HDR Photography"
              subtitle="The multi-exposure technique photographers used before true HDR displays"
              plain={
                <>
                  <p>
                    Before HDR displays existed, photographers still wanted to capture scenes with extreme brightness differences — a bright window in a dark room, a landscape with deep shadows and bright sky. Their solution was to take multiple photos of the same scene at different exposures, then merge them.
                  </p>
                  <div className="space-y-3">
                    <Callout variant="note">
                      <strong>Step 1 — Exposure bracketing:</strong> Take three (or more) photos. One underexposed to capture highlights without blowing out. One at normal exposure for midtones. One overexposed to reveal shadow detail.
                    </Callout>
                    <Callout variant="note">
                      <strong>Step 2 — Merging:</strong> Software combines the best-exposed areas from each photo into a single image.
                    </Callout>
                    <Callout variant="note">
                      <strong>Step 3 — Tone mapping:</strong> Because the merged image contains more brightness range than any SDR screen can show, it must be compressed. This is called tone mapping — and it's where traditional HDR often looks artificial.
                    </Callout>
                  </div>
                  <p>
                    The compression step is the problem. Tone mapping squeezes extreme brightness values toward the middle, making shadows brighter and highlights darker. The result is often evenly lit in a way that looks nothing like reality. It's the "HDR look" that many people associate with over-processed photography.
                  </p>
                </>
              }
              technical={
                <>
                  <p>The traditional HDR pipeline:</p>
                  <ol className="list-decimal list-inside space-y-2 mt-2 text-gray-400">
                    <li><span className="text-gray-300">Exposure bracketing:</span> Typically ±2 EV in 1 EV steps. AEB sequences captured in-camera or via tethered control.</li>
                    <li><span className="text-gray-300">Radiance map construction:</span> Debevec & Malik (1997) algorithm (or similar) recovers the camera response function and reconstructs a scene-linear HDR radiance map from multiple LDR exposures. Output is a floating-point EXR or HDR file.</li>
                    <li><span className="text-gray-300">Tone mapping operators (TMO):</span> Global operators (Reinhard, gamma) or local operators (Fattal, Durand) compress the radiance map to an 8-bit SDR output. Local TMOs produce the characteristic halo artifacts and compressed local contrast associated with the "HDR look."</li>
                    <li><span className="text-gray-300">Output:</span> SDR JPEG or TIFF at 8 bits, discarding any brightness data above 100 nits.</li>
                  </ol>
                  <p className="mt-3">The fundamental limitation: no matter how sophisticated the TMO, the output is still SDR. The extra dynamic range captured by bracketing is mapped into the same 0–255 range that a single exposure would use, making tone-mapped images structurally indistinguishable from SDR at the format level.</p>
                </>
              }
            />
          </div>

          {/* ── Section 6 ── */}
          <div id="true-hdr">
            <Section
              number="06"
              icon={<Zap className="w-5 h-5 text-yellow-400" />}
              accentColor="bg-yellow-500/10"
              title="Why True HDR Looks More Realistic"
              subtitle="Contrast is reality — not the flat, over-processed look you might expect"
              plain={
                <>
                  <p>
                    Many people expect HDR photos to look evenly lit and hyper-detailed everywhere. That expectation comes from years of seeing badly tone-mapped images. But in the real world, scenes are never evenly lit.
                  </p>
                  <p>
                    When you stand in a forest, the shadows are genuinely dark and the sunlight filtering through the leaves is genuinely bright. Your eyes see the full contrast — they don't smooth it out. True HDR preserves that contrast instead of compressing it.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-2">
                      <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Traditional HDR (Tone Mapped)</div>
                      <p className="text-sm text-gray-400">Shadows are lifted. Highlights are pulled down. Everything looks evenly exposed. Often appears artificial or "painterly."</p>
                    </div>
                    <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4 space-y-2">
                      <div className="text-xs font-mono text-blue-400 uppercase tracking-widest">True HDR (Display HDR)</div>
                      <p className="text-sm text-gray-300">Shadows remain dark. Highlights genuinely glow. High contrast is preserved. Looks like you're looking through a window, not at a photo.</p>
                    </div>
                  </div>
                  <p>
                    This is why true HDR images can look more contrasty than what people expect from "HDR photography." That stronger contrast is not a flaw — it's accuracy.
                  </p>
                </>
              }
              technical={
                <>
                  <p>The perceptual difference stems from how luminance information is encoded and rendered:</p>
                  <ul className="list-disc list-inside space-y-2 mt-2 text-gray-400">
                    <li><span className="text-gray-300">SDR tone mapping</span> applies a global or local compression function to map scene-linear values into [0, 1] SDR range. This necessarily reduces the standard deviation of the luminance histogram — the image becomes "flatter" in an information-theoretic sense.</li>
                    <li><span className="text-gray-300">True HDR output</span> encodes scene-linear or PQ-encoded values that reference the display's actual peak luminance. A value at code level 778/1023 in PQ represents 203 nits (SDR reference white). Values above this — up to 1023 — represent increasingly bright highlights that the display renders with real photons above SDR white.</li>
                    <li><span className="text-gray-300">Perceptual effect:</span> Weber-Fechner and Stevens' power law both describe luminance perception as roughly logarithmic. HDR displays operating above 1,000 nits produce a luminance ratio large enough to trigger the "specular highlight" percept in human vision — the sensation that an object is self-luminous, not just brightly lit.</li>
                  </ul>
                  <p className="mt-3">This is why HDR OLED screens showing sunset photos look different from any SDR rendering: the specular highlights exceed the threshold at which the human visual system switches from "bright surface" to "light source" perception.</p>
                </>
              }
            />
          </div>

          {/* ── Section 7 ── */}
          <div id="color-spaces">
            <Section
              number="07"
              icon={<Palette className="w-5 h-5 text-rose-400" />}
              accentColor="bg-rose-500/10"
              title="Color Spaces Explained"
              subtitle="Not just more colors — the right colors"
              plain={
                <>
                  <p>
                    A color space is like a color palette with boundaries — it defines which colors are possible. Bit depth determines how smoothly you can transition between those colors. Color space determines which colors you have access to in the first place. You need both to get the full picture.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-3 h-3 rounded-full bg-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-white">sRGB</div>
                        <div className="text-sm text-gray-400">The standard for the internet and most photos. It covers a reasonable range of colors, but misses many vivid reds, greens, and blues that modern screens can actually display. Most JPEG images use this.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-white">Display P3</div>
                        <div className="text-sm text-gray-400">Used by iPhones, iPads, MacBooks, and many modern Android devices. About 26% wider than sRGB, capturing richer reds and oranges — the colors of sunsets, skin tones, and autumn leaves that sRGB tends to flatten.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                      <div className="w-3 h-3 rounded-full bg-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-white">Rec.2020</div>
                        <div className="text-sm text-gray-400">The HDR standard. Designed to cover nearly all colors the human eye can perceive. Most current displays can't reproduce the full Rec.2020 range yet, but images encoded in it are future-proof as display technology continues to improve.</div>
                      </div>
                    </div>
                  </div>
                </>
              }
              technical={
                <>
                  <p>Color space specifications (CIE 1931 xy primaries):</p>
                  <div className="mt-3 space-y-2 text-gray-400">
                    <div><span className="text-gray-300">sRGB / Rec.709:</span> R(0.64, 0.33), G(0.30, 0.60), B(0.15, 0.06), D65 white. Covers ~35.9% of CIE 1931 gamut. Identical primaries to Rec.709.</div>
                    <div><span className="text-gray-300">Display P3 (DCI-P3 with D65):</span> R(0.680, 0.320), G(0.265, 0.690), B(0.150, 0.060). Covers ~45.5% of CIE 1931 gamut. ~26% wider than sRGB by area.</div>
                    <div><span className="text-gray-300">Rec.2020:</span> R(0.708, 0.292), G(0.170, 0.797), B(0.131, 0.046). Covers ~75.8% of CIE 1931 gamut. Narrower Rec.2020 primaries are monochromatic (on the spectral locus), which is physically optimal but requires laser-based or quantum-dot display technology for full reproduction.</div>
                  </div>
                  <p className="mt-3">Current best consumer displays (e.g., Apple XDR Pro) achieve ~98% DCI-P3. Wide-gamut quantum-dot OLED panels achieve ~90% Rec.2020. The gap between encoded gamut (Rec.2020) and display capability (P3) is handled by the OS colour management stack (ColorSync on Apple, ICC profiles on Windows), which gamut-maps out-of-gamut Rec.2020 primaries to the display's native gamut.</p>
                  <p className="mt-3">This application outputs HDR HEIC with Display P3 or Rec.2020 primaries depending on the source RAW's colour space metadata, with the gain map encoded in linear light to preserve accuracy across the full tone scale.</p>
                </>
              }
            />
          </div>

          {/* ── Section 8 ── */}
          <div id="heic-technology">
            <Section
              number="08"
              icon={<FileImage className="w-5 h-5 text-cyan-400" />}
              accentColor="bg-cyan-500/10"
              title="HDR HEIC with HLG"
              subtitle="One file that works beautifully on every screen"
              plain={
                <>
                  <p>
                    raw2hdr exports your photos as HEIC files encoded with the <strong className="text-white">BT.2100 HLG (Hybrid Log-Gamma)</strong> colour space — the same HDR standard used by broadcast television and modern Apple devices. HLG is cleverly designed to be backwards compatible without needing two separate images.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-lg">📺</div>
                      <div>
                        <div className="text-sm font-bold text-white">On SDR screens</div>
                        <div className="text-sm text-gray-400">The HLG signal is automatically tone-mapped by the OS to a well-exposed SDR photo. The image looks like any normal, correctly-exposed HEIC — on a laptop, TV, or social media.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                      <div className="text-lg">✨</div>
                      <div>
                        <div className="text-sm font-bold text-cyan-300">On HDR screens (iPhone 12 Pro+, iPad Pro, Apple TV)</div>
                        <div className="text-sm text-gray-400">The full HLG dynamic range is revealed — highlights glow above SDR white, shadows retain detail, and the Rec.2020 gamut delivers colours that sRGB simply cannot show.</div>
                      </div>
                    </div>
                  </div>
                  <Callout variant="info">
                    <strong>The result:</strong> One file. One sharing workflow. The same HEIC looks correct on an old screen and stunning on a new iPhone OLED — with no conversion or special app required.
                  </Callout>
                </>
              }
              technical={
                <>
                  <p>HEIC output with BT.2100 HLG (kCGColorSpaceITUR_2100_HLG) colour space:</p>
                  <ul className="list-disc list-inside space-y-2 mt-2 text-gray-400">
                    <li><span className="text-gray-300">Colour space:</span> ITU-R BT.2020 primaries (Rec.2020 wide gamut), BT.2100 HLG transfer function. Encoded via <code>CGImageDestination</code> with <code>kCGColorSpaceITUR_2100_HLG</code>.</li>
                    <li><span className="text-gray-300">HLG transfer function:</span> A combined logarithmic/gamma curve defined as <code>r(E) = a·ln(12E−b)+c</code> for E &gt; 1/12, and <code>r(E) = √(3E)</code> for E ≤ 1/12. Scene-linear values above 1.0 are preserved in the log segment — these are the HDR highlights.</li>
                    <li><span className="text-gray-300">SDR compatibility:</span> Apple's CoreImage/EDR tone-mapping pipeline automatically maps HLG content to SDR reference white on non-HDR displays. No separate SDR image is stored.</li>
                    <li><span className="text-gray-300">Bit depth:</span> 10-bit HEVC encoding (Main 10 profile) preserves the 1,024 quantisation levels per channel required for smooth HLG gradients.</li>
                  </ul>
                  <p className="mt-3">Apple EDR (Extended Dynamic Range) renders HLG content by mapping the scene-referred HLG signal into EDR headroom above SDR white (1.0), dynamically adjusting for the display's actual peak brightness and ambient light conditions.</p>
                </>
              }
            />
          </div>

          {/* ── Section 9 ── */}
          <div id="raw-workflow">
            <Section
              number="09"
              icon={<Cpu className="w-5 h-5 text-indigo-400" />}
              accentColor="bg-indigo-500/10"
              title="RAW to HDR Workflow"
              subtitle="From sensor data to BT.2100 HLG HEIC — on your iPhone"
              plain={
                <>
                  <p>
                    When your camera saves a JPEG, it's already made hundreds of decisions for you: how to handle highlights, how much noise reduction to apply, what colour profile to use. The file you get is a finished interpretation — convenient, but with many of the original details permanently baked in or discarded.
                  </p>
                  <p>
                    A RAW file is different. It stores the raw sensor measurements, essentially unprocessed. Think of it like a film negative versus a printed photograph. The negative contains everything. The print is one interpretation of it.
                  </p>
                  <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 space-y-3">
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Processing pipeline</div>
                    {[
                      ['Camera sensor', 'Captures light as raw electrical measurements (12–14 bit Bayer/X-Trans mosaic)'],
                      ['RAW file', 'Stores unprocessed sensor data — .RAF, .CR2/.CR3, .ARW, .RW2, .ORF, .DNG'],
                      ['CIRAWFilter', 'Apple\'s native RAW decoder: demosaicing + camera-specific colour profile applied'],
                      ['16-bit linear working space', 'Linear sRGB (from RAW decode) → XYZ (D65) → Rec.2020 linear RGB colour transform'],
                      ['HLG transfer function', 'BT.2100 HLG curve maps linear scene values including HDR highlights above 1.0'],
                      ['HEIC export', '10-bit HEVC-encoded HEIC with kCGColorSpaceITUR_2100_HLG colour space'],
                    ].map(([step, desc], i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                        <div>
                          <div className="text-sm font-bold text-white">{step}</div>
                          <div className="text-xs text-gray-500">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              }
              technical={
                <>
                  <p>The RAW → HDR HEIC pipeline used by raw2hdr:</p>
                  <ol className="list-decimal list-inside space-y-2 mt-2 text-gray-400">
                    <li><span className="text-gray-300">RAW decode via CIRAWFilter:</span> Apple's native <code>CIRAWFilter</code> API decodes the Bayer/X-Trans mosaic, applies the camera's embedded colour profile, and outputs a 16-bit linear CIImage. Supports RAF, CR2/CR3, ARW, RW2, ORF, DNG.</li>
                    <li><span className="text-gray-300">Editor adjustments:</span> Exposure (±3 EV), contrast, highlights, shadows, black point, white balance, saturation, and vibrance are applied in linear light. Noise reduction (luminance &amp; chroma NR via <code>CIRAWFilter</code>) is applied at this stage.</li>
                    <li><span className="text-gray-300">LUT application (optional, Pro):</span> 33-grid 3D cube LUTs (.cube) are applied in the appropriate input colour space (sRGB, F-Log2, V-Log, L-Log, or linear), then converted to Rec.2020 linear for consistency.</li>
                    <li><span className="text-gray-300">Colour transform to Rec.2020:</span> Linear sRGB (CIRAWFilter output) → XYZ (D65) → Rec.2020 linear RGB. CIRAWFilter already outputs linear light — there is no gamma-encoded sRGB step. This preserves the wide-gamut colour information captured by the sensor.</li>
                    <li><span className="text-gray-300">HLG transfer function:</span> BT.2100 HLG curve is applied. Scene-linear values above 1.0 (the highlights beyond SDR white) are preserved in the logarithmic segment of the HLG curve — this is where the HDR headroom lives.</li>
                    <li><span className="text-gray-300">HEIC encoding:</span> <code>CGImageDestination</code> encodes the result as a 10-bit HEVC image with <code>kCGColorSpaceITUR_2100_HLG</code> as the embedded colour space profile. Full EXIF metadata is preserved.</li>
                  </ol>
                </>
              }
            />
          </div>

          {/* ── Section 10 ── */}
          <div id="raw-vs-camera">
            <Section
              number="10"
              icon={<Camera className="w-5 h-5 text-amber-400" />}
              accentColor="bg-amber-500/10"
              title="Why RAW → HDR Can Be Better Than In-Camera HDR"
              subtitle="What your camera's HDR mode doesn't tell you"
              plain={
                <>
                  <p>
                    Most modern cameras have an "HDR mode." It sounds like exactly what you'd want — but it has a significant limitation that most people don't realise.
                  </p>
                  <p>
                    In-camera HDR typically takes two or three quick shots at different exposures, merges them, and saves the result as a JPEG. The problem: a JPEG is an SDR format. All that extra dynamic range that was captured gets compressed back down to standard range. You end up with a tone-mapped image that's still SDR at its core.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-2">
                      <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">In-camera HDR</div>
                      <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                        <li>Multiple exposures merged automatically</li>
                        <li>Output is 8-bit JPEG (SDR)</li>
                        <li>No photographer control over tone mapping</li>
                        <li>Original RAW data often discarded</li>
                        <li>Cannot be re-processed for true HDR later</li>
                      </ul>
                    </div>
                    <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4 space-y-2">
                      <div className="text-xs font-mono text-blue-400 uppercase tracking-widest">RAW → HDR HEIC</div>
                      <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                        <li>Full 12–14 bit sensor data preserved</li>
                        <li>Output is true 10-bit HDR HEIC</li>
                        <li>Full control over tone mapping and grading</li>
                        <li>Works with a single RAW file — no bracketing needed</li>
                        <li>SDR compatibility built in</li>
                      </ul>
                    </div>
                  </div>
                  <Callout variant="info">
                    A single RAW file from a modern camera sensor contains enough dynamic range to produce a genuine HDR image without any exposure bracketing. The data was always there — it just needed the right processing to bring it out.
                  </Callout>
                </>
              }
              technical={
                <>
                  <p>Key technical advantages of RAW-based HDR over in-camera processing:</p>
                  <ul className="list-disc list-inside space-y-2 mt-2 text-gray-400">
                    <li><span className="text-gray-300">Sensor headroom utilisation:</span> Modern sensors have ~12–14 stops of DR. In-camera JPEG output is quantised to 8-bit with a fixed tone curve, discarding the upper 4–6 stops of highlight data. RAW processing can recover this headroom and remap it to the HDR gain map.</li>
                    <li><span className="text-gray-300">No motion artifacts:</span> In-camera bracketing (even at 1/1000s between frames) introduces ghosting for any subject movement. Single-RAW processing avoids this entirely.</li>
                    <li><span className="text-gray-300">16-bit processing chain:</span> RAW workflows maintain 16-bit precision throughout, avoiding the rounding errors that accumulate in 8-bit JPEG editing.</li>
                    <li><span className="text-gray-300">Non-destructive gain map generation:</span> The relationship between the SDR tone-mapped image and the original linear data is deterministic. The gain map accurately captures what was lost in SDR conversion, enabling precise HDR reconstruction on compatible displays.</li>
                    <li><span className="text-gray-300">Camera HDR output formats:</span> Sony, Fujifilm, and others produce RAW+JPEG bracketed pairs or in-camera tone-mapped JPEGs. None produce HDR HEIC or HDR10 output natively as of 2025 — that step requires desktop or mobile post-processing.</li>
                  </ul>
                </>
              }
            />
          </div>

          {/* ── Section 11 ── */}
          <div id="app-features">
            <Section
              number="11"
              icon={<Settings className="w-5 h-5 text-teal-400" />}
              accentColor="bg-teal-500/10"
              title="raw2hdr — App Features"
              subtitle="A complete on-device RAW processing and HDR authoring tool for iPhone"
              plain={
                <>
                  <p>
                    raw2hdr handles the entire workflow — from importing a RAW file to exporting finished HDR HEIC — without needing any desktop software. Everything runs on your iPhone using Apple's native processing APIs.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { title: 'Film Simulation LUTs (Pro)', desc: '50+ curated 3D LUTs for Fujifilm (PROVIA, Velvia, ASTIA, Classic Chrome, ACROS, ETERNA…), Panasonic V-Log, Leica, classic film stocks, and cinematic grades. Live scrollable preview strip.' },
                      { title: 'Advanced Editor', desc: 'Exposure (±3 EV), contrast, highlights, shadows, black point, white balance, saturation, vibrance. Live histogram shows clipping in real time. One-tap auto exposure.' },
                      { title: 'Noise Reduction', desc: 'ISO-aware: the app reads ISO from your RAW and suggests optimal NR strength. Loupe magnifier for pixel-level inspection with edge-detection overlay.' },
                      { title: 'Lens Correction', desc: 'Automatic distortion and vignetting correction from a built-in lens database. Manual A/B/C distortion and K1/K2/K3 vignetting override for unsupported lenses.' },
                      { title: '8 Frame Designs', desc: 'EXIF card, Split layout, Film strip (35mm sprocket holes), Journal (live weather + GPS), Palette (dominant colour swatches), and more. Fully customisable.' },
                      { title: 'Batch Processing', desc: 'Import from Photos, Files, iCloud Drive, Dropbox, or Google Drive. Process multiple RAW files in one tap. Pro: export at 25%, 50%, 75%, or 100% resolution.' },
                      { title: 'HDR / SDR Compare & Gallery', desc: 'Side-by-side split-screen comparison, full-screen viewer with pinch-to-zoom, slideshow mode, and image rotation saved to EXIF.' },
                      { title: 'EXIF Preservation', desc: 'Camera make/model, lens, focal length, aperture, shutter speed, ISO, GPS, and timestamp carried through to every exported file.' },
                    ].map((f, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <div className="text-sm font-bold text-white">{f.title}</div>
                        <div className="text-xs text-gray-400 leading-relaxed">{f.desc}</div>
                      </div>
                    ))}
                  </div>
                  <Callout variant="note">
                    <strong>Free vs Pro:</strong> The free tier includes HDR HEIC export, editor, histogram, noise reduction, lens correction, and frame designs — at 25% output resolution. <strong>Pro (one-time purchase)</strong> unlocks full-resolution export (25%/50%/75%/100%) and all 50+ Film Simulation LUTs. No subscription.
                  </Callout>
                </>
              }
              technical={
                <>
                  <p>Technical implementation highlights (v0.1.8):</p>
                  <ul className="list-disc list-inside space-y-2 mt-2 text-gray-400">
                    <li><span className="text-gray-300">RAW decode engine:</span> Apple <code>CIRAWFilter</code> — native iOS RAW decoder. Handles demosaicing, camera colour profiles, and white balance. Supports .RAF, .CR2/.CR3, .ARW, .RW2, .ORF, .DNG.</li>
                    <li><span className="text-gray-300">Processing precision:</span> 16-bit CIImage pipeline throughout. All tone adjustments (exposure, contrast, shadows, highlights, black point) operate in linear light before the colour transform.</li>
                    <li><span className="text-gray-300">Colour transform:</span> Linear sRGB (CIRAWFilter output) → XYZ (D65) → Rec.2020 linear RGB. CIRAWFilter decodes the RAW directly to linear light — the transform starts from linear sRGB, not gamma-encoded sRGB. Ensures wide-gamut BT.2020 primaries in the HDR output.</li>
                    <li><span className="text-gray-300">HLG encoding:</span> BT.2100 HLG transfer function applied to Rec.2020 linear values. Output written via <code>CGImageDestination</code> with <code>kCGColorSpaceITUR_2100_HLG</code>. Encoded as 10-bit HEVC (Main 10 profile).</li>
                    <li><span className="text-gray-300">LUT support:</span> 33-grid 3D cube (.cube) files. Multiple input gamma profiles supported: F-Log2, V-Log, L-Log, Mi-Log, sRGB. Real-time preview with cached linear RGB handles.</li>
                    <li><span className="text-gray-300">Noise reduction:</span> Luminance and chrominance NR via <code>CIRAWFilter</code> NR parameters. ISO metadata read from EXIF to auto-suggest strength. Loupe shows edge-detected preview for precise tuning.</li>
                    <li><span className="text-gray-300">Lens correction:</span> Lensfun database for per-lens distortion (A/B/C polynomial) and vignetting (K1/K2/K3) correction. Manual override available for unlisted lenses.</li>
                  </ul>
                </>
              }
            />
          </div>

          {/* Summary */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 space-y-4">
            <h2 className="text-2xl font-bold text-white">Summary</h2>
            <p className="text-gray-300 leading-relaxed">
              Modern HDR imaging improves three fundamental aspects of photography simultaneously:
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Dynamic Range', desc: 'Brighter highlights and deeper shadows — images that match how real scenes look.', color: 'text-emerald-400' },
                { label: 'Color Space', desc: 'A wider palette of colors, capturing the vivid reds, greens, and blues that sRGB misses.', color: 'text-rose-400' },
                { label: 'Bit Depth', desc: 'Smoother gradients with over a billion colors — no more banding in skies and skin tones.', color: 'text-blue-400' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className={`text-sm font-bold ${item.color}`}>{item.label}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed pt-2">
              Together, these technologies allow images to appear much closer to how real scenes look to the human eye — and with RAW files as the starting point, none of the original sensor data is wasted.
            </p>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-800 text-xs text-gray-600 text-center">
            raw2hdr Education Guide · HDR Photography Reference
          </div>

        </main>
      </div>
    </div>
  );
};

export default EducationGuide;
