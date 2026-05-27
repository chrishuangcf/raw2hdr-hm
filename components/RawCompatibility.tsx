import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

/** Curated RAW formats checked by the iOS app (native_bridge.mm `raw2hdr_get_raw_support_info`). */
const RAW_FORMAT_ROWS: { brand: string; ext: string; name: string }[] = [
  { brand: 'Adobe / Generic', ext: 'dng', name: 'DNG (Digital Negative)' },
  { brand: 'Apple', ext: 'raw', name: 'Apple ProRAW' },
  { brand: 'Fujifilm', ext: 'raf', name: 'RAF' },
  { brand: 'Nikon', ext: 'nef', name: 'NEF' },
  { brand: 'Nikon', ext: 'nrw', name: 'NRW' },
  { brand: 'Canon', ext: 'cr2', name: 'CR2' },
  { brand: 'Canon', ext: 'cr3', name: 'CR3' },
  { brand: 'Canon', ext: 'crw', name: 'CRW (legacy)' },
  { brand: 'Sony', ext: 'arw', name: 'ARW' },
  { brand: 'Panasonic', ext: 'rw2', name: 'RW2' },
  { brand: 'Panasonic', ext: 'raw', name: 'RAW (legacy Lumix)' },
  { brand: 'Olympus / OM System', ext: 'orf', name: 'ORF' },
  { brand: 'Leica', ext: 'rwl', name: 'RWL / DNG' },
  { brand: 'Hasselblad', ext: '3fr', name: '3FR' },
  { brand: 'Hasselblad', ext: 'fff', name: 'FFF' },
  { brand: 'Pentax / Ricoh', ext: 'pef', name: 'PEF' },
  { brand: 'Ricoh', ext: 'dng', name: 'DNG / PEF' },
  { brand: 'Samsung', ext: 'srw', name: 'SRW' },
  { brand: 'Phase One', ext: 'iiq', name: 'IIQ (Phase One & Capture One)' },
  { brand: 'Mamiya', ext: 'mef', name: 'MEF' },
  { brand: 'Leaf / Mamiya', ext: 'mos', name: 'MOS' },
  { brand: 'Sigma (Foveon)', ext: 'x3f', name: 'X3F' },
  { brand: 'GoPro', ext: 'gpr', name: 'GPR' },
  { brand: 'Konica Minolta', ext: 'mrw', name: 'MRW' },
  { brand: 'Kodak', ext: 'dcr', name: 'DCR / KDC' },
  { brand: 'Epson', ext: 'erf', name: 'ERF' },
  { brand: 'Casio', ext: 'raw', name: 'RAW' },
];

const RawCompatibility: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = q
      ? RAW_FORMAT_ROWS.filter(
          (r) =>
            r.brand.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q) ||
            r.ext.toLowerCase().includes(q),
        )
      : RAW_FORMAT_ROWS;

    const map = new Map<string, { brand: string; ext: string; name: string }[]>();
    for (const r of rows) {
      const list = map.get(r.brand) ?? [];
      list.push(r);
      map.set(r.brand, list);
    }
    const brands = [...map.keys()].sort((a, b) => a.localeCompare(b));
    return brands.map((b) => ({ brand: b, formats: map.get(b)! }));
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="sticky top-0 bg-gray-950/95 backdrop-blur border-b border-gray-900 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <Link
            to="/"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors hidden sm:inline"
          >
            Home
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">RAW format compatibility</h1>
          <p className="text-gray-400 mt-2 leading-relaxed">
            raw2hdr uses Apple&apos;s <span className="text-gray-200 font-medium">CIRAWFilter</span> / ImageIO pipeline.
            The table below lists every camera-RAW type the app checks against your device. On iPhone, open{' '}
            <span className="text-gray-200">Settings → RAW Compatibility</span> in raw2hdr to see which extensions are
            actually supported on your iOS version (green checkmarks vs. not available on that OS).
          </p>
        </div>

        <div className="rounded-xl border border-blue-500/25 bg-blue-500/5 p-5 space-y-2">
          <div className="text-sm font-semibold text-blue-200">Same chart as in the app</div>
          <p className="text-sm text-gray-400 leading-relaxed">
            This page mirrors the curated format list in the app. Only the live app can query{' '}
            <code className="text-blue-300/90">CGImageSourceCopyTypeIdentifiers()</code> to mark per-format support for
            your phone.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brand or extension…"
            className="w-full rounded-xl bg-gray-900 border border-gray-800 pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600/50"
            aria-label="Filter RAW formats"
          />
        </div>

        {grouped.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No formats match your search.</p>
        ) : (
          <div className="space-y-4">
            {grouped.map(({ brand, formats }) => (
              <div
                key={brand}
                className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/90">
                  <h2 className="text-base font-bold text-white">{brand}</h2>
                  <p className="text-xs text-gray-500 mt-1 font-mono">
                    {formats.map((f) => `.${f.ext}`).join('  ')}
                  </p>
                </div>
                <ul className="divide-y divide-gray-800/80">
                  {formats.map((f, i) => (
                    <li key={`${brand}-${f.ext}-${f.name}-${i}`} className="px-4 py-3 flex flex-wrap items-baseline gap-2 justify-between">
                      <span className="font-mono text-xs font-bold text-blue-300/90 uppercase bg-blue-950/50 border border-blue-900/40 rounded px-2 py-0.5">
                        .{f.ext}
                      </span>
                      <span className="text-sm text-gray-300 text-right flex-1 min-w-[40%]">{f.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-4">
          <h3 className="text-lg font-bold text-amber-100">Can&apos;t find your camera?</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            If your camera is not listed or is unsupported on your iOS version, convert your RAW files to Adobe DNG first
            — DNG is universally supported across Apple RAW decoders.
          </p>
          <div>
            <p className="text-sm font-semibold text-white mb-2">Conversion options</p>
            <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
              <li>
                <a
                  href="https://helpx.adobe.com/photoshop/using/adobe-dng-converter.html"
                  className="text-blue-400 hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Adobe DNG Converter
                </a>{' '}
                — free desktop app (Mac &amp; Windows)
              </li>
              <li>
                <a href="https://lightroom.adobe.com" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                  Lightroom Mobile
                </a>{' '}
                — free tier can convert RAW to DNG on iOS
              </li>
            </ul>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed border-t border-amber-500/20 pt-4">
            After converting, import the <code className="text-amber-100">.dng</code> into raw2hdr for full dynamic
            range processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RawCompatibility;
