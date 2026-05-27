import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Sliders, Film, Crosshair, ScanLine, Layout, Layers,
  Eye, Aperture, Zap, Camera, FileImage, Cpu, Star, ChevronDown, ChevronUp, ArrowRight,
} from 'lucide-react';

const ExpandBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed space-y-3 border-t border-white/10 pt-4">
          {children}
        </div>
      )}
    </div>
  );
};

const Tag: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-white/5 border-white/10 text-gray-400' }) => (
  <span className={`inline-flex px-3 py-1 rounded-full text-xs border font-mono ${color}`}>{children}</span>
);

const Raw2HdrSection: React.FC = () => {
  const navigate = useNavigate();

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
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">raw2hdr</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-24">

        {/* ── Hero ── */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest">
            <Camera className="w-3 h-3" /> raw2hdr
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            RAW editing. HDR output.<br />
            <span className="text-blue-400">No subscription.</span>
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed max-w-3xl">
            raw2hdr is a full RAW photo editor for iPhone that converts your camera's RAW files into true 10-bit HDR images — no desktop required, no monthly fee, and no prior expertise needed. It hands beginners the same processing pipeline that professional software guards behind expensive subscriptions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Tag color="bg-blue-500/10 border-blue-500/20 text-blue-400">iPhone</Tag>
            <Tag color="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">One-time Pro purchase</Tag>
            <Tag color="bg-violet-500/10 border-violet-500/20 text-violet-400">No subscription</Tag>
            <Tag color="bg-amber-500/10 border-amber-500/20 text-amber-400">RAW → HDR HEIC</Tag>
          </div>
        </div>

        {/* ── What is raw2hdr ── */}
        <div className="space-y-8">
          <div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">What is raw2hdr?</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Designed for photographers who want power without the complexity</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-5 text-gray-300 leading-relaxed">
              <p>
                Professional RAW editors like Adobe Lightroom and Capture One are built for full-time working photographers who need every conceivable option, live tethering, client delivery, and complex cataloguing systems. That power comes with a cost: subscriptions that run tens of dollars every month and interfaces so feature-dense they take months to learn.
              </p>
              <p>
                raw2hdr is built on a different premise. It takes the handful of controls that actually matter most for a great image — exposure, tone, color, noise, sharpness — and wraps them in a workflow that is fast to learn and completely on-device. You pick a RAW file, make your adjustments, and export a genuine 10-bit HDR image. That's the entire loop.
              </p>
              <p>
                Critically, the output format sets raw2hdr apart from every other mobile editor. Rather than saving a JPEG or a tone-mapped flat file, raw2hdr exports <strong className="text-white">BT.2100 HLG HEIC</strong> — the same HDR standard used in broadcast television and natively supported by iPhones, iPads, and Apple TV. On a modern OLED display, highlights genuinely glow above standard white. On an older screen, the same file looks like a perfectly exposed photo. One export, every device.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-zinc-900 border border-white/10 p-6 space-y-4">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Who it's for</div>
                {[
                  { icon: <Camera className="w-4 h-4 text-blue-400" />, label: 'Beginners', desc: 'No prior RAW experience needed. Smart defaults get you a great result in seconds.' },
                  { icon: <Sliders className="w-4 h-4 text-emerald-400" />, label: 'Enthusiasts', desc: 'Full manual control over every parameter, with real-time feedback at every step.' },
                  { icon: <Film className="w-4 h-4 text-amber-400" />, label: 'Film & Cinema fans', desc: 'Apply cinematic color grades to RAW sensor data, not a processed JPEG.' },
                  { icon: <FileImage className="w-4 h-4 text-violet-400" />, label: 'HDR adopters', desc: 'Anyone who wants their photos to look stunning on a modern iPhone or Apple TV.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                    <div>
                      <div className="text-sm font-bold text-white">{item.label}</div>
                      <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-blue-500/5 border border-blue-500/20 p-5 space-y-2">
                <div className="text-xs font-mono text-blue-400 uppercase tracking-widest">vs. subscription software</div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Lightroom and Capture One charge ongoing monthly fees to access the RAW processing engine. raw2hdr's core HDR workflow is free, and a single one-time Pro purchase unlocks full resolution and film simulation grades. Your access never expires.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Color Science article ── */}
        <div className="rounded-3xl bg-zinc-900/60 border border-white/8 p-8 md:p-14 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase tracking-widest mb-4">
              <Cpu className="w-3 h-3" /> Understanding Color Science
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
              "Color science" is mostly software — and that's actually good news
            </h2>
          </div>

          <div className="space-y-6 text-gray-300 leading-relaxed text-[15px]">
            <p>
              Digital image sensors fundamentally measure light intensity rather than color itself. Most modern sensors use a color filter array where each photosite records brightness information through a red, green, or blue filter. RAW files preserve these original sensor measurements with minimal processing, functioning more like a high-data digital negative than a finished image.
            </p>

            <p>
              Sensor technologies such as microlenses, back-side illuminated architectures, and stacked sensor designs mainly improve light collection efficiency, readout speed, dynamic range, and signal-to-noise performance rather than directly determining a camera's perceived color character. Their influence on color is mostly indirect: cleaner sensor data leads to smoother tonal transitions, less chroma noise, improved shadow detail, and more stable color separation.
            </p>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-6 py-5 text-amber-200 text-sm leading-relaxed">
              <strong>The key insight:</strong> The final appearance of color in a digital image is overwhelmingly shaped by the image processing pipeline — including the ISP, firmware, demosaicing algorithms, white balance calculations, tone mapping, LUTs, and color curves. As processors become more powerful, cameras can perform increasingly sophisticated real-time rendering, leading to better HDR reconstruction, more accurate white balance, cleaner noise reduction, and smoother tonal gradation.
            </div>

            <p>
              Because of this, cameras using the same sensor generally do not have fundamentally different "color science" baked into the hardware itself. What people often perceive as brand-specific color science is largely the result of software tuning, firmware decisions, and rendering preferences applied to the same underlying sensor data. If two cameras used the same sensor and lens under controlled conditions, the RAW data would usually be far more similar than most users expect.
            </p>

            <p>
              Hardware differences still exist and can matter at the margins — spectral filter design, analog circuitry, dynamic range, read noise, and ADC precision all play a role — but their contribution to the final perceived color signature is often smaller than marketing narratives suggest. In many cases, the rendering pipeline dominates the visual character of the image.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-2">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">What hardware actually determines</div>
                <ul className="text-sm text-gray-400 space-y-1.5">
                  {[
                    'Dynamic range and highlight headroom',
                    'Read noise and shadow performance',
                    'ADC precision and quantization',
                    'Spectral filter transmission curves',
                    'Readout speed and rolling shutter',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-5 space-y-2">
                <div className="text-xs font-mono text-blue-400 uppercase tracking-widest">What the pipeline determines</div>
                <ul className="text-sm text-gray-300 space-y-1.5">
                  {[
                    'Perceived color signature and "look"',
                    'Tonal curve shape and contrast',
                    'White balance behavior and accuracy',
                    'Noise reduction character',
                    'How highlights roll off and clip',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p>
              This is also why preserving RAW files is so valuable. A RAW image is not a final interpretation — it is stored sensor data that can be reinterpreted later using better processing technology. A RAW file captured years ago may produce dramatically better results when processed through today's advanced rendering pipelines, denoise algorithms, and color mapping tools than what was possible when the photo was originally taken.
            </p>

            <p>
              In that sense, "color science" is less a fixed property of the camera hardware and more an evolving interpretation layer applied to sensor data. Much of what users identify as brand color science ultimately comes down to tonal curves, white balance behavior, and processing choices. With sufficient control over color grading and RAW processing, a skilled editor can reproduce or closely emulate the rendering styles associated with many different camera brands.
            </p>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-5 text-emerald-200 text-sm leading-relaxed">
              <strong>Why this matters for raw2hdr:</strong> Because color is pipeline-driven, raw2hdr can apply the same high-quality processing to sensor data from any supported camera — Fujifilm, Sony, Canon, Nikon, Panasonic, Olympus, and others — and deliver results that rival or surpass what the camera's own JPEG engine produces, with the added advantage of genuine HDR output.
            </div>
          </div>
        </div>

        {/* ── Features ── */}
        <div className="space-y-10">
          <div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">App Features</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What makes raw2hdr different</h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
              Professional RAW editors give you everything — including complexity you'll never use. raw2hdr strips that back to a focused, powerful set of tools, each built to work natively in HDR from the first pixel to the final export.
            </p>
          </div>

          {/* Feature: RAW Decode Engine */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
            <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Professional RAW Decoding</h3>
                <p className="text-gray-400 leading-relaxed">
                  raw2hdr uses Apple's native RAW decode engine — the same pipeline that Apple's own Camera app and Photos library rely on. This isn't a third-party approximation or a compressed thumbnail upscale. Every RAW file is decoded at full bit depth, with the camera's embedded color profile applied, directly from the original sensor mosaic data.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  The result is that your RAW file is treated with the same respect as it would be on a desktop workstation — except the entire process runs on-device, with no file transfer, no waiting for a cloud service, and no dependency on a desktop machine.
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Supported RAW formats</div>
                <div className="flex flex-wrap gap-2">
                  {['.RAF', '.CR2', '.CR3', '.ARW', '.RW2', '.ORF', '.DNG', '.NEF', '.NRW'].map(fmt => (
                    <Tag key={fmt} color="bg-indigo-500/10 border-indigo-500/20 text-indigo-300">{fmt}</Tag>
                  ))}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed pt-2">
                  Fujifilm, Canon, Sony, Panasonic, Olympus, Nikon, and any camera producing standard DNG files are supported through Apple's RAW decode framework.
                </p>
                <Link
                  to="/raw-compatibility"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors pt-1"
                >
                  View full compatibility chart <ArrowRight className="w-3 h-3" />
                </Link>
                <div className="mt-4 rounded-xl bg-black/40 border border-white/10 p-4 space-y-2">
                  <div className="text-xs font-mono text-gray-600 uppercase tracking-widest">What this means in practice</div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Other mobile apps often decode RAW files using embedded JPEG previews or lossy approximations. raw2hdr decodes the actual sensor data, preserving the full dynamic range and bit depth that your camera captured. This is the foundation that makes genuine HDR output possible.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature: Advanced Editor */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
            <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Advanced Editor with Live Histogram</h3>
                <p className="text-gray-400 leading-relaxed">
                  The editing controls are designed around the physics of light rather than arbitrary sliders. Every adjustment — exposure, contrast, highlights, shadows, black point, white balance, saturation, and vibrance — is applied in linear light, before any color transform or tone curve is applied. This is how professional color scientists work, and it's what separates accurate color grading from the guesswork of editing a JPEG.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  The live histogram doesn't just show a brightness distribution — it actively indicates when highlights are being clipped or shadows are being crushed, in real time as you drag. This is the kind of feedback loop that makes even complex adjustments predictable.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Editor controls</div>
                <div className="space-y-2">
                  {[
                    { label: 'Exposure', detail: 'Wide range in either direction — enough to rescue underexposed shots or pull back blown highlights without introducing posterization.' },
                    { label: 'Contrast', detail: 'Affects the midtone pivot of the tone curve without touching the absolute endpoints, preserving shadow and highlight structure.' },
                    { label: 'Highlights & Shadows', detail: 'Independent control of the bright and dark regions of the image. Recover detail from overexposed skies or lift texture from deep shadows — separately, without affecting each other.' },
                    { label: 'Black Point', detail: 'Sets the absolute darkest point of the image. Useful for adding depth and richness to shadows, or for matching the base tone of a scene.' },
                    { label: 'White Balance', detail: 'Full color temperature and tint control. Corrects mixed lighting, neutralizes color casts, or deliberately warms or cools the scene.' },
                    { label: 'Saturation & Vibrance', detail: 'Saturation applies uniformly. Vibrance intelligently boosts muted colors while protecting already-saturated tones and skin-toned areas from oversaturation.' },
                  ].map((ctrl, i) => (
                    <ExpandBox key={i} title={ctrl.label}>
                      <p>{ctrl.detail}</p>
                    </ExpandBox>
                  ))}
                </div>
                <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4 text-xs text-blue-300 leading-relaxed">
                  One-tap auto exposure analyzes the image histogram and applies a balanced starting point — useful for shots that need only minor refinement.
                </div>
              </div>
            </div>
          </div>

          {/* Feature: Film Simulation */}
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/3 overflow-hidden">
            <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Film className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Film Simulation & Color Grading <span className="text-amber-400 text-base font-normal ml-1">Pro</span></h3>
                <p className="text-gray-400 leading-relaxed">
                  A curated collection of color grade profiles — drawn from classic film camera rendering styles, cinematic looks, and log-format conversions — can be applied directly to your RAW sensor data. Unlike applying a filter to a JPEG, these grades are applied to the full-precision, wide-gamut linear data from your sensor before any output conversion happens. The grade is working with the actual color information your camera captured, not a already-compressed approximation of it.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  A scrollable live preview strip lets you see every grade applied to your actual image simultaneously, so you can compare looks at a glance without committing to one and exporting to check the result.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">What makes this different</div>
                <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
                  <p>
                    Desktop software like Lightroom applies LUTs after its own rendering pipeline has already processed the RAW data. raw2hdr applies color grades to the decoded, unrendered sensor data in the appropriate input color space — meaning the grade shapes the image from its raw state, not from a pre-processed interpretation.
                  </p>
                  <p>
                    This matters because different cameras encode their sensor data in different log or linear profiles. raw2hdr correctly identifies and handles the input profile for each camera's RAW data, so the grade lands the same way regardless of which camera body you shot with. The visual result is consistent, predictable, and cinematically accurate.
                  </p>
                </div>
                <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 text-xs text-amber-300 leading-relaxed">
                  The collection includes neutral rendering profiles, cinematic tonal curves, high-contrast looks, muted film-stock grades, and high-clarity styles. Grades are previewed in real time on your actual image, not on a test swatch.
                </div>
              </div>
            </div>
          </div>

          {/* Feature: Noise Reduction */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
            <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Crosshair className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">ISO-Aware Noise Reduction</h3>
                <p className="text-gray-400 leading-relaxed">
                  Noise reduction in raw2hdr is aware of the conditions under which your photo was taken. It reads the ISO value embedded in your RAW file's metadata and uses it to suggest an appropriate starting point for noise reduction strength — high-ISO shots get more aggressive defaults, low-ISO shots default to minimal processing to preserve detail.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Separate luminance and chrominance controls let you address the two types of sensor noise independently. Luminance noise is the grainy, textured kind that affects sharpness. Chrominance noise appears as random color speckles in smooth areas. These behave differently and respond to different treatment, which is why controlling them separately produces cleaner results than a single all-in-one slider.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Loupe inspector</div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  A magnified loupe view overlays an edge-detection indicator on top of a pixel-level crop of your image. This lets you see exactly where fine detail is being retained and where noise is being smoothed away — at the pixel level, in real time, while adjusting NR strength.
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Most mobile editors apply noise reduction as a fixed post-process that you can't verify. The loupe in raw2hdr gives you a precise view of the tradeoff between noise removal and detail preservation, so you can set the threshold exactly where you want it rather than accepting a preset.
                </p>
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 text-xs text-emerald-300 leading-relaxed">
                  Noise reduction operates at the RAW decode stage, before color transforms and tone curves are applied. This is the most effective point to address sensor noise — processing it earlier in the pipeline produces cleaner results than applying NR to a finished image.
                </div>
              </div>
            </div>
          </div>

          {/* Feature: Lens Correction */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
            <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <ScanLine className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Automatic Lens Correction</h3>
                <p className="text-gray-400 leading-relaxed">
                  Every lens distorts the image to some degree — straight lines bow outward or inward, the corners darken, and wide-angle shots suffer barrel distortion that makes architecture look warped. raw2hdr corrects all of this automatically using a built-in lens database that matches your camera and lens combination from the EXIF metadata in your RAW file.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  For lenses not in the database, full manual control is provided via distortion coefficients and vignetting parameters. This is the same mathematical model used in professional correction software — not a simplified approximation. If your lens behaves unusually, you can dial in exactly the right correction for it.
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Corrections applied</div>
                {[
                  { label: 'Barrel & Pincushion Distortion', detail: 'Wide-angle and telephoto lenses introduce opposite types of distortion. The built-in database applies the correct inverse transform for each lens profile, straightening lines that should be straight.' },
                  { label: 'Vignetting', detail: 'The natural light falloff toward the corners of the frame is measured per lens and corrected for even brightness across the full image. Correction strength is adjustable — some photographers prefer a slight natural vignette.' },
                  { label: 'Manual Override', detail: 'For lenses not in the database, A/B/C polynomial distortion coefficients and K1/K2/K3 vignetting parameters can be entered directly. These are the industry-standard models used by optical correction tools.' },
                ].map((item, i) => (
                  <ExpandBox key={i} title={item.label}>
                    <p>{item.detail}</p>
                  </ExpandBox>
                ))}
              </div>
            </div>
          </div>

          {/* Feature: Frame Designs */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
            <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <Layout className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Frame Designs</h3>
                <p className="text-gray-400 leading-relaxed">
                  raw2hdr includes a set of presentation frame layouts that wrap your photo in contextual metadata and visual styling. These go well beyond adding a simple white border — each design surfaces real data from your RAW file in a composed, readable format.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Borderless and EXIF-overlay layouts keep metadata readable without heavy chrome — subtle bottom bars or gradient strips composited at full HDR precision. The journal layout pulls live weather and reverse-geocoded GPS to annotate where and when the shot was taken. Palette layouts extract dominant colours from your image and present them as swatch panels beside the photo.
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Available designs</div>
                {[
                  { label: 'Borderless', detail: 'A minimal bottom bar over the image with maker logo and EXIF line — always an inside overlay so the photograph stays edge-to-edge while metadata stays legible at HDR reference white.' },
                  { label: 'Classic', detail: 'Camera maker and exposure data on a bordered strip below the image, with adjustable border width and inside/outside placement where supported.' },
                  { label: 'Split', detail: 'Maker and lens on one side of an outside border, aperture / shutter / ISO on the other — a clean split for sharing technical context beside the picture.' },
                  { label: 'Journal', detail: 'Timestamp, reverse-geocoded place name, optional weather stamp, and togglable EXIF — a moment-in-time record with live weather when enabled.' },
                  { label: 'Palette', detail: 'Dominant-colour swatches with camera info in a fixed layout; two alternate palette compositions are available for different visual balance.' },
                  { label: 'EXIF Overlay', detail: 'Gradient strip at the bottom of the image with a custom title, key shooting parameters, and an icon row — auto light/dark styling, composited inside the HDR buffer.' },
                ].map((item, i) => (
                  <ExpandBox key={i} title={item.label}>
                    <p>{item.detail}</p>
                  </ExpandBox>
                ))}
              </div>
            </div>
          </div>

          {/* Feature: Batch Processing */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
            <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Batch Processing & Flexible Import</h3>
                <p className="text-gray-400 leading-relaxed">
                  Shooting sessions rarely produce a single image. raw2hdr supports importing and processing multiple RAW files in a single operation, applying the same settings across a batch and exporting the full set without manual repetition.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Files can be imported from the iPhone's native Photos library, the Files app, iCloud Drive, Dropbox, and Google Drive. This means RAW files transferred from a camera card reader, shared via a cloud service, or already on-device are all equally accessible without requiring a specific import workflow.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Export resolution control <span className="text-cyan-400">Pro</span></div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  The Pro tier allows export at 25%, 50%, 75%, or full resolution. This is practically useful: sharing-optimized exports at reduced resolution are smaller and faster to upload without a separate resize step, while full-resolution exports preserve the complete output for archiving or print.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Photos', desc: 'iPhone native library' },
                    { label: 'Files', desc: 'iOS Files app & local storage' },
                    { label: 'iCloud Drive', desc: 'Cross-device sync' },
                    { label: 'Dropbox / GDrive', desc: 'Third-party cloud services' },
                  ].map((src, i) => (
                    <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3">
                      <div className="text-xs font-bold text-white">{src.label}</div>
                      <div className="text-xs text-gray-600 leading-relaxed">{src.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature: HDR Compare */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
            <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">HDR Preview, Compare & Gallery</h3>
                <p className="text-gray-400 leading-relaxed">
                  Before you export, raw2hdr shows you exactly what the HDR version of your image looks like on your current display. On an HDR-capable iPhone, this is a genuine HDR preview — not a simulated thumbnail, not a tone-mapped proxy. The actual BT.2100 HLG signal is being rendered by the display in real time.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  A split-screen comparison mode overlays the HDR version against the unprocessed SDR version with a draggable divider, so you can scan across the image and see exactly what changed in any specific area — how highlights recovered, how shadows deepened, how color became richer.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Viewer capabilities</div>
                <div className="space-y-2 text-sm text-gray-400 leading-relaxed">
                  <p>
                    Full-screen gallery mode with pinch-to-zoom and pan lets you inspect fine detail at 100% view — useful for verifying noise reduction results or checking focus before committing to an export.
                  </p>
                  <p>
                    Image rotation is non-destructive and persists to EXIF metadata in the exported file, so your intended orientation is preserved when the file is opened in other applications.
                  </p>
                  <p>
                    Slideshow mode cycles through your processed images in full-screen HDR — useful for reviewing a shoot as a sequence rather than one image at a time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature: EXIF Preservation */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
            <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Aperture className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Complete EXIF Preservation</h3>
                <p className="text-gray-400 leading-relaxed">
                  Every piece of technical metadata captured by your camera is carried through the entire processing pipeline and written into the exported HEIC file. Camera make and model, lens identity, focal length, aperture, shutter speed, ISO, GPS coordinates, and the original capture timestamp are all present in the final file.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  This matters because many image processing tools — particularly mobile editors and social sharing flows — strip or corrupt EXIF data during conversion. raw2hdr treats the metadata as part of the image, not an afterthought. Your processed HDR file remains a complete photographic record, not just a visual output.
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Metadata preserved</div>
                <div className="flex flex-wrap gap-2">
                  {['Camera make & model', 'Lens identity', 'Focal length', 'Aperture (f-stop)', 'Shutter speed', 'ISO', 'GPS coordinates', 'Capture timestamp', 'Orientation', 'Color profile tag'].map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <div className="rounded-xl bg-violet-500/5 border border-violet-500/20 p-4 text-xs text-violet-300 leading-relaxed mt-2">
                  The BT.2100 HLG color space descriptor is written as part of the HEIC output's ICC metadata. This is what tells the operating system — and downstream apps like Instagram, iMessage, and Apple Photos — that the file contains HDR content and should be rendered with the full EDR headroom.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Free vs Pro ── */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden">
          <div className="px-8 md:px-12 pt-10 pb-8 border-b border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-4">
              <Star className="w-3 h-3" /> Free vs Pro
            </div>
            <h2 className="text-3xl font-bold text-white">Start free. Upgrade once.</h2>
            <p className="text-gray-400 mt-2 leading-relaxed max-w-2xl">
              The free tier includes genuine HDR HEIC export with the full processing pipeline. Pro unlocks full-resolution output and the film simulation library — as a one-time purchase, not a subscription.
            </p>
          </div>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
            <div className="px-8 md:px-12 py-8 space-y-4">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Free</div>
              <ul className="space-y-2">
                {[
                  'True HDR HEIC export (BT.2100 HLG)',
                  'Full RAW editing controls',
                  'Live histogram with clipping indicators',
                  'ISO-aware noise reduction',
                  'Automatic lens correction',
                  'All frame designs',
                  'HDR/SDR split comparison',
                  'EXIF metadata preservation',
                  'Export at reduced resolution',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-8 md:px-12 py-8 space-y-4 bg-amber-500/3">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-widest">Pro — one-time purchase</div>
              <ul className="space-y-2">
                {[
                  'Everything in Free',
                  'Full-resolution export',
                  'Export at 25% / 50% / 75% / 100%',
                  'Full film simulation & color grade library',
                  'Live grade preview strip across all profiles',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-300 leading-relaxed">
                No subscription, no annual renewal, no feature gating by usage. Pro is a single payment that unlocks permanently.
              </div>
            </div>
          </div>
          <div className="px-8 md:px-12 py-8 border-t border-white/5">
            <a
              href="https://apps.apple.com/us/app/raw2hdr/id6758991441"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors"
            >
              Download on the App Store
              <Zap className="w-4 h-4" />
            </a>
            <p className="text-xs text-gray-600 mt-3">iOS 26+ · iPhone · iPad compatible</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Raw2HdrSection;
