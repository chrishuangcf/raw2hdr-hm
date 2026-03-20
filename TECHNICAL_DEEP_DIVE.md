# raw2hdr — Technical Deep Dive

> **Audience:** Engineers and technically curious photographers who want to understand the design decisions, novel approaches, and underlying concepts behind every feature in raw2hdr. This document explains *what* the system does and *why* at a deep technical level, without describing specific implementation mechanics.

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Centralized RAW Demosaic — A Manufacturer-Agnostic Baseline](#2-centralized-raw-demosaic--a-manufacturer-agnostic-baseline)
3. [The Unified Color Pipeline: Linear RGB as the Universal Handshake](#3-the-unified-color-pipeline-linear-rgb-as-the-universal-handshake)
4. [Exposure Metering — Center-Weighted Metering in Software](#4-exposure-metering--center-weighted-metering-in-software)
5. [3D LUT Engine — Cross-Manufacturer Compatibility](#5-3d-lut-engine--cross-manufacturer-compatibility)
6. [The HDR LUT Problem: Reverse-Engineering SDR LUTs into 10-Bit](#6-the-hdr-lut-problem-reverse-engineering-sdr-luts-into-10-bit)
7. [SDR + Gain Map vs. Raw-Native HDR: Why They Are Fundamentally Different](#7-sdr--gain-map-vs-raw-native-hdr-why-they-are-fundamentally-different)
8. [TIFF as a Scene-Referred Intermediate — Containers vs. Output Formats](#8-tiff-as-a-scene-referred-intermediate--containers-vs-output-formats)
9. [HLG Encoding — Perceptual HDR Without Metadata Fragility](#9-hlg-encoding--perceptual-hdr-without-metadata-fragility)
10. [HDR Canvas Problem: Why Traditional Effects Break at 10-Bit](#10-hdr-canvas-problem-why-traditional-effects-break-at-10-bit)
11. [Filmic F/X — Creative Effects Natively in HDR](#11-filmic-fx--creative-effects-natively-in-hdr)
12. [Frame Design System — Compositing Without HDR Degradation](#12-frame-design-system--compositing-without-hdr-degradation)
13. [LUT Thumbnail Cache Architecture](#13-lut-thumbnail-cache-architecture)
14. [Log Profile System — Data-Driven Per-Manufacturer Calibration](#14-log-profile-system--data-driven-per-manufacturer-calibration)
15. [Lens Correction — Radial Distortion and Vignetting in Linear Light](#15-lens-correction--radial-distortion-and-vignetting-in-linear-light)

---

## 1. Architectural Overview

raw2hdr is a Flutter mobile application targeting iOS as its primary platform. The processing stack is divided into two distinct layers with a deliberate, hard boundary between them.

```
┌──────────────────────────────────────────────────────────┐
│                   UI + Orchestration Layer                 │
│  File selection · LUT picker · Frame config · Export UI   │
│  Passes: file paths + parameters only — never pixel data  │
└────────────────────────┬─────────────────────────────────┘
                         │  file paths + config params
                         ▼
┌──────────────────────────────────────────────────────────┐
│              Native Processing Layer (compiled)           │
│                                                           │
│  RAW decode → Linear sRGB                                 │
│  Lens correction (in linear light)                        │
│  Exposure scale → Gamut convert → Log encode              │
│  3D LUT lookup (trilinear interpolation)                  │
│  Post-LUT normalization + calibration                     │
│  Highlight extension → Rec.2020 → HLG encode              │
│  Creative FX (grain, light leaks, lens flare)             │
│  Frame compositing (borders, text, logos — all in HDR)    │
│  File encode: HEIC / JPEG / PNG + embedded color space    │
└──────────────────────────────────────────────────────────┘
```

The **UI and orchestration layer** manages everything the user interacts with: selecting RAW files, browsing LUT previews, configuring frame designs and effects, triggering exports. It coordinates the sequencing of operations and observes results, but never operates on pixel data directly.

The **native processing layer** handles all pixel mathematics. Every computation — RAW decoding, gamut conversion, log encoding, LUT lookup, HDR encoding, creative effects, and compositing — runs as compiled native code on background threads. The UI layer remains fully responsive throughout, no matter how long processing takes.

Communication between layers is limited to file paths and configuration parameters. The native layer reads a RAW file from disk, processes it entirely in memory using floating-point precision, and writes the output back to disk. This boundary is not just architectural preference — it is a hard requirement of the iOS platform. iOS prohibits mobile applications from spawning child processes, which eliminates the common desktop approach of shelling out to command-line tools like `dcraw`, `rawtherapee-cli`, or `exiftool`. Every processing step that on desktop could be delegated to an external CLI tool must instead be compiled directly into the application binary and called through the native function interface. This constraint ultimately drove the choice of a self-contained compiled native layer rather than a script-orchestrated pipeline.

---

## 2. Centralized RAW Demosaic — A Manufacturer-Agnostic Baseline

### The Industry Standard Problem

A RAW file is not an image. It is a grid of single-channel sensor readings — one brightness measurement per photosite — interleaved in a color filter pattern (usually Bayer RGGB, or X-Trans in Fujifilm's case). Converting that grid into a viewable RGB image requires demosaicing: estimating the missing color values at each pixel by examining its spatial neighborhood, applying the camera's color matrix to transform from sensor-native to a standard color space, and white-balancing to a reference illuminant.

Most professional RAW development software — Lightroom, Capture One, DxO PhotoLab — ties this decoding step tightly to **manufacturer-provided camera profiles**: per-camera color matrices tuned under controlled illuminants, tone curves calibrated against the camera's own JPEG engine, ICC profiles encoding the camera's gamut, and the proprietary color science that drives each brand's creative rendering. Canon Picture Style, Fujifilm Film Simulation, Nikon Picture Control — all of these are baked into the decode step.

The consequence is that the same RAW file produces subtly different results in each tool, because each tool applies a different interpretation of the manufacturer's color science. There is no "ground truth" rendering — only different flavors of the manufacturer's intent.

More importantly for raw2hdr's goals: this profile-per-camera approach makes it **impossible to write a single downstream pipeline that works correctly for all cameras.** A pipeline calibrated for Fujifilm's color science will be wrong for Leica, and vice versa. LUTs designed for Fujifilm footage cannot be applied to Leica RAW files without manual recalibration for each camera-LUT combination — a combinatorial maintenance problem.

### The raw2hdr Approach: A Single Universal Decoder

raw2hdr uses Apple's native RAW decoding engine — the same engine that powers RAW rendering inside iOS Photos — as the sole demosaic path. This engine maintains Apple's own camera database covering hundreds of camera bodies across all major manufacturers. It correctly handles both Bayer and X-Trans sensor patterns, applies the correct per-body color matrix, and neutralizes white balance to the standard D65 reference illuminant.

Crucially, this decoder outputs to a single, precisely defined color space: **linear scene-referred RGB in the sRGB primaries, stored as 16-bit half-float values.** It performs the neutral physical decode and stops there. It applies no Film Simulation, no V-Log encoding, no manufacturer tone curve, no creative picture profile. What comes out is a physically accurate, linear representation of scene luminance — nothing more and nothing less.

### Why This Creates a Universal Baseline

Once this linear decode is complete, every camera — regardless of brand, sensor generation, or RAW format — has produced data with the same encoding contract. A Fujifilm GFX 100S, a Panasonic S5 II, a Leica M11, a Sony A7R V, a Xiaomi 15 Ultra — all of them are now the same thing: a floating-point linear RGB buffer in the sRGB primaries. Their actual color values differ because the scenes they captured differ. But the *contract* is identical, and a single downstream pipeline can operate on all of them uniformly.

This is the foundational architectural decision. Every other capability in raw2hdr — cross-manufacturer LUT compatibility, unified HDR encoding, consistent exposure metering, universal lens correction — is a downstream consequence of this single choice: **decode neutral, decode linear, decode once.**

---

## 3. The Unified Color Pipeline: Linear RGB as the Universal Handshake

Once the neutral linear RGB buffer exists, the pipeline applies a deterministic sequence of transforms to produce any desired output. The full conceptual chain:

```
RAW file on disk
     │
     ▼
[Demosaic + White Balance]
     │  linear scene-referred sRGB (half-float)
     ▼
[Lens Correction: distortion warp + vignetting]
     │  still linear — correction is physically correct only in linear light
     ▼
[Exposure Scaling]  ← EV from center-metering
     │  linear scaled to LUT's expected 18%-grey level
     ▼
[Gamut Matrix: sRGB → LUT working gamut]
     │  e.g., sRGB primaries → F-Gamut / V-Gamut / L-Gamut
     ▼
[Log OETF Encoding]
     │  e.g., linear → F-Log2 / V-Log / L-Log / Mi-Log
     ▼
[3D LUT Lookup — trilinear interpolation]
     │  creative rendering applied: Film Simulation / grade / film stock
     ▼
[Post-LUT Normalization + Per-Channel Calibration]
     │
     ├─── SDR output path ───────────────────────────────────────┐
     │    sRGB gamma encode → JPEG / PNG                         │
     │                                                           │
     └─── HDR output path ───────────────────────────────────────┤
          │                                                       │
          ▼                                                       │
     [Linearize LUT output]                                       │
          │                                                       │
          ▼                                                       │
     [Highlight extension from scene-linear data]                 │
          │  pixels above SDR white are soft-log extended         │
          ▼                                                       │
     [Gamut matrix: sRGB → Rec.2020]                              │
          │                                                       │
          ▼                                                       │
     [HLG OETF encode]                                            │
          │  ~79% of signal = SDR range; ~21% = HDR headroom      │
          ▼                                                       │
     [Creative FX: grain, light leaks, lens flare]  ←────────────┘
          │  applied to HLG pixel buffer directly
          ▼
     [Frame compositing: borders, text, logos]
          │  rendered into floating-point HDR context
          ▼
     [HEIC encode + BT.2100 HLG color space embedded]
```

Every stage operates in floating-point arithmetic. There is no integer quantization step until the final file encode. Precision accumulated across 10 stages of processing is never lost to rounding until the very last moment.

### The Significance of the Pipeline Order

The ordering of stages is not arbitrary. Lens correction must happen in linear light before any non-linear transform, because geometric distortion and vignetting are physical phenomena that exist in scene-linear space — applying them after gamma encoding or log encoding would introduce systematic errors. Exposure scaling must happen before gamut conversion because the gamut matrices assume a specific luminance range. Calibration must happen after the LUT because the LUT's output characteristics are only knowable after the fact. The HLG encode must be the last color transform before effects and compositing so that all subsequent operations occur in a coordinate system the output display understands.

---

## 4. Exposure Metering — Center-Weighted Metering in Software

### Physical Camera Analogy

Camera metering modes differ in which pixels of the scene they use to estimate the "correct" exposure. Evaluative/matrix metering divides the frame into zones and applies a weighted formula. Spot metering uses only the central 1–5% of the frame. **Center-weighted metering** concentrates 60–80% of the calculation on a circular central region, under the assumption that the primary subject is positioned there.

Center-weighted metering dates to the earliest generation of automatic-exposure SLRs in the 1970s — the Canon AE-1, the Nikon F2S, the Olympus OM-1 — and has remained a standard metering mode in every professional camera since. Its longevity reflects its practical reliability: for the vast majority of photographic compositions, the subject is in or near the center, and metering that region correctly exposes the subject regardless of what the background or periphery is doing.

### The Software Implementation

When the user opens the LUT editor to browse film simulation previews, the app performs a lightweight one-time RAW decode at reduced resolution — roughly one-quarter scale — and holds the resulting linear RGB buffer in memory. This buffer is reused across all LUT preview generations for that image, avoiding redundant decode operations.

The center-metering analysis then isolates a square region at the center of this buffer — approximately the central 30% in each dimension — and computes the luminance-weighted average across all pixels in that square. Luminance is computed using the standard Rec.709 perceptual coefficients that weight green most heavily, then red, then blue, matching the relative sensitivity of human vision to each primary.

That average is compared to the photographic reference for 18% middle gray in linear light — the established standard for "correctly exposed midtone." The ratio between the measured average and the reference, expressed in exposure value stops, becomes the EV compensation applied to every subsequent LUT preview and to the final export.

```
Center square (~30% of dimensions)
┌────────────────────────────┐
│                            │
│   ┌──────────────┐         │
│   │  Metered     │         │  → average luminance Y
│   │  region      │         │  → compare to 0.18 (18% grey in linear)
│   │              │         │  → EV = log₂(0.18 / Y)
│   └──────────────┘         │
│                            │
└────────────────────────────┘
```

A positive EV result means the center is underexposed relative to middle gray and the pipeline will brighten. A negative result means the center is overexposed and the pipeline will pull down. The magnitude is typically in the range of ±1.5 stops for well-lit subjects; extreme high-key or low-key scenes will produce values at the edges of that range.

### Why Center Metering Instead of Global Average

Global average metering is highly susceptible to compositional bias. A portrait against a bright sky will produce a global average dominated by sky luminance, causing the subject's face to be dark in the LUT preview. A snowy landscape will push the average far above middle gray, making every LUT preview appear dark. Center-weighted metering assumes the photographer aimed the camera at their subject — a safe assumption for the majority of compositions — and produces consistently usable LUT previews without requiring manual exposure adjustment in most cases.

For exceptions — wide landscapes where the subject spans the full frame, or deliberately periphery-focused compositions — the manual exposure slider in the editor provides adjustment. But the center-metered default eliminates the need for manual adjustment in the cases that matter most.

### Why Consistent Metering Across LUT Thumbnails Matters

The EV value derived from center metering is applied identically to every LUT preview generated for that RAW image. This is what makes the LUT selection grid visually coherent: all 60+ previews are at the same exposure level, so the difference a viewer sees between thumbnails reflects only the LUT's color science and tonal character. Without this consistent baseline, some LUT previews would be brighter or darker than others for reasons that have nothing to do with the LUT itself, making comparison unreliable.

---

## 5. 3D LUT Engine — Cross-Manufacturer Compatibility

### The Manufacturer Log Problem

Every major camera manufacturer ships a proprietary log profile that is mathematically and perceptually incompatible with every other manufacturer's:

| Manufacturer | Log Format | Color Gamut |
|---|---|---|
| Fujifilm | F-Log2 | F-Gamut |
| Panasonic | V-Log | V-Gamut |
| Sony | S-Log3 | S-Gamut3.Cine |
| Nikon | N-Log | N-Gamut |
| Canon | C-Log3 | Cinema Gamut |
| Leica | L-Log | L-Gamut |
| Xiaomi | Mi-Log | ACES-derived |

None of these are standardized. Each manufacturer chose a different midpoint placement for 18% gray in the log signal, a different mathematical shape for the log curve, different color primaries for their expanded gamut, and a different exposure headroom ratio. They are not interchangeable.

LUTs are authored for one specific input format. A Fujifilm PROVIA LUT, for example, was built to receive F-Log2-encoded signal in F-Gamut color space. If you feed it V-Log encoded signal instead, every value in the LUT table is indexed by the wrong input coordinate. The LUT will execute without error — it will produce output — but the output will be wrong in every dimension: wrong tonality, wrong contrast, wrong colors. There is no "close enough" in 3D color science; a wrong input encoding propagates through the entire 3D table in a non-recoverable way.

This constraint is the traditional reason why camera brand and LUT brand must match. A Panasonic shooter using Panasonic V-Log LUTs, a Fujifilm shooter using Fujifilm F-Log2 LUTs, and never the twain shall meet.

### The raw2hdr Solution: Synthetic Log Encoding from Linear

Because every RAW file emerges from the demosaic step as neutral linear sRGB (Section 2), the pipeline is not constrained to use log signal from the camera. It can synthesize the log signal from scratch. For any chosen LUT, the pipeline:

1. Converts the linear sRGB values to the gamut that LUT expects — F-Gamut for Fujifilm LUTs, V-Gamut for Panasonic LUTs, L-Gamut for Leica LUTs, sRGB for film stock and creative LUTs
2. Applies the mathematical log transfer function for that manufacturer, producing a signal that is, from the LUT's perspective, indistinguishable from signal encoded natively in-camera

The result: a Leica RAW file can be fed into a Fujifilm PROVIA LUT. The pipeline synthesizes F-Log2/F-Gamut from the Leica's linear data and presents that to the LUT exactly as if a Fujifilm camera had shot the frame. The PROVIA LUT then applies its color science on top of that correctly-encoded input, and produces output that represents how Fujifilm PROVIA film simulation would have rendered the Leica's scene.

```
Any RAW file → Linear sRGB (universal)
                    │
         ┌──────────┼──────────┬──────────┐
         ▼          ▼          ▼          ▼
    F-Gamut    V-Gamut    L-Gamut    sRGB
    F-Log2     V-Log      L-Log    (film stocks)
         │          │          │          │
         ▼          ▼          ▼          ▼
  Fujifilm     Panasonic    Leica    Any sRGB-input
    LUTs          LUTs       LUTs       LUT
         │          │          │          │
         └──────────┴──────────┴──────────┘
                    │
              Post-LUT output
```

### The Calibration Methodology

The parameters governing each synthetic log encode are determined empirically, not theoretically. The procedure:

1. Shoot a controlled scene — gray card, color checker, neutral-lit subjects — on each target camera at base ISO
2. Decode the RAW through the universal demosaic to obtain the neutral linear baseline
3. Apply the synthetic log encode with initial parameters and compare the result to the camera's own SOOC JPEG using color measurement tools
4. Iteratively adjust the exposure scale, log midpoint placement, tonal contrast factor, and per-channel color balance gains until the synthetic encode and the SOOC JPEG match as closely as possible across the full tonal range — with no LUT applied

The word "match" here means perceptual alignment of the tonality, midtones, and color balance before any creative rendering. The goal is for the synthetic log encode to represent the same starting point that the camera manufacturer intended as the neutral baseline from which their creative picture profiles depart.

Because the calibration is done against the SOOC JPEG rather than against theoretical log curves, the synthetic encode absorbs any idiosyncratic offset that the manufacturer baked into their camera's RAW-to-log pipeline. The result is that when a LUT designed for that manufacturer is applied, it performs the same creative transform it was designed to perform — just supplied from a universally-consistent source rather than from a camera-native encoded signal.

This is why the cross-manufacturer LUT compatibility is genuinely useful, not approximate: the calibration process bridges the gap between the theoretical log curve and the practical camera rendering, ensuring the LUT's intent is faithfully expressed regardless of which camera captured the source RAW.

---

## 6. The HDR LUT Problem: Reverse-Engineering SDR LUTs into 10-Bit

### The Fundamental Challenge

All commercially distributed film simulation LUTs — Fujifilm's official packs, Panasonic's official V-Log packs, every third-party film stock emulation available — are designed to produce **8-bit SDR output**. Their output encoding is sRGB or Rec.709, mapping the entire scene luminance range into the signal interval that maps to 0–255 on an 8-bit display. This is universal because the entire professional color grading ecosystem has historically targeted SDR displays: cinema, broadcast, post-production — all SDR.

The consequence is that sRGB has no headroom. The maximum value is the maximum. Any scene element brighter than display white — a sunlit sky, a window, a specular highlight on metal, a light source in frame — is clipped to the maximum code value and the sensor information in those regions is permanently discarded. The LUT produces a beautiful SDR rendering, but the dynamic range advantage of shooting RAW is spent entirely by the LUT's output constraint.

### Reframing: SDR Output as Scene Intent, Not Display Output

raw2hdr resolves this by treating the LUT's SDR output not as a final display-referred result, but as a **compressed statement of the photographer's tonal and color intent** — one that happens to be expressed in a range too narrow to contain all the scene's luminance information.

The mathematical insight: a pixel at SDR white in the LUT output does not mean "this is the brightest displayable value." It means "this is the boundary of the LUT's range." The scene-linear value at that pixel might have been 1.5× scene white, or 3×, or 8×. The LUT silently clamped those values because it had nowhere to put them. But crucially — in this pipeline, the original scene-linear value was never discarded. It was carried through the pipeline in parallel with the log-encoded signal that was fed into the LUT.

### The Reverse Engineering Process

After the 3D LUT produces its SDR-encoded result, the pipeline:

1. **Linearizes the LUT output** — removes the sRGB gamma encoding to recover linear-light representation of all values below SDR white. This step restores full floating-point precision to the sub-white tonal range, reversing the compression that the LUT's output gamma applied.

2. **Extends highlights using scene-linear data** — for pixels where the original scene-linear value was above SDR white, the pipeline applies a soft logarithmic extension. Each stop of scene luminance above SDR white receives a progressively smaller boost. This rolloff is not a hard clip and not a linear stretch — it is a smooth compression curve that mirrors the shoulder characteristic of photographic film. The visual effect: "bright" reads as genuinely bright; "brilliant specular" reads as something distinctly more intense; but neither ever becomes a harsh edge or an abrupt cutoff.

3. **Converts to Rec.2020 wide gamut** — the HDR container format requires wide-gamut primaries. Rec.2020 encompasses the full gamut of human vision and provides the necessary color volume to represent extended HDR content without gamut clipping.

4. **Applies HLG encoding** — the HLG transfer function maps the extended linear range to the HDR signal space, allocating approximately 79% of the signal range to SDR-equivalent content and reserving the upper 21% for the recovered highlight extension.

```
           Scene-linear value
                  │
     ─────────────┼─────────────────────────────
           1.0 ── │ ── SDR white (LUT clips here)
                  │   ↑
                  │   LUT output range
                  │   (has no representation for this)
           3.2 ── ┤
                  │   Scene data above SDR white
                  │   was never discarded —
                  │   it flows through the pipeline
                  │   alongside the LUT output
     ─────────────┼─────────────────────────────
                  ▼
     After linearizing LUT output + highlight extension:

     HLG signal 0.75 ── SDR reference white
     HLG signal 0.85 ── 2× scene white (recovered)
     HLG signal 0.93 ── 4× scene white (recovered)
     HLG signal 1.00 ── ceiling (12× scene white)
```

### What "SDR LUT to 10-Bit HDR" Means in Practice

On an HDR display — any current iPhone Pro model, iPad Pro with XDR display, Apple ProDisplay XDR — the recovered highlights render with genuine physical luminance. A blown sky becomes a luminous sky with perceptible gradation. A specular highlight on a surface has presence and intensity that SDR cannot reproduce. The difference is not subtle on a capable display; it is the defining perceptual characteristic of HDR photography.

On an SDR display, the same HLG HEIC file degrades gracefully. The 21% HDR extension region maps to display white and above, which an SDR display simply ignores. The remaining 79% of the signal renders identically to a well-exposed SDR image. No adaptation or SDR fallback export is needed.

---

## 7. SDR + Gain Map vs. Raw-Native HDR: Why They Are Fundamentally Different

### How SDR + Gain Map Works

The gain map approach — used by Apple in HEIC gain map format and by Google in Ultra HDR JPEG — achieves HDR through a two-layer composition:

**Layer 1 (SDR base):** A standard 8-bit sRGB image serves as the primary layer. This is typically the camera's own SOOC JPEG, carrying the camera's full proprietary rendering stack: in-camera noise reduction, sharpening, tone curves, picture profiles, color matrices.

**Layer 2 (Gain map):** A secondary grayscale (or sometimes per-channel) image encodes, per pixel, how many stops brighter the HDR reconstruction should be compared to the SDR base. This map is derived from a separate analysis of the scene's dynamic range — in the best case, computed alongside the SDR base from the same RAW data; in the problematic case, derived independently from a separate RAW decode or tone-map estimate.

**HDR reconstruction at display time:**

```
HDR display rendering:

SDR pixel value
      ×
2^(gain_map_value × display_headroom_weight)
      =
HDR reconstructed pixel

where display_headroom_weight ∈ [0, 1]
based on the display's HDR capability
```

When both layers originate from the same unified pipeline — as they do in Apple's iPhone Photonic Engine, where both the SDR JPEG and the gain map are computed simultaneously from the same RAW sensor data — this is a coherent system and works correctly.

The problem arises when a photographer tries to construct UHDR from **two separately-rendered sources**: the camera's SOOC JPEG as the SDR base, and the RAW file processed independently to generate the gain map. These two sources were never computed together, and their pixel-level relationship is inconsistent in ways that produce a range of artifacts.

---

### Problem 1: Two-Pipeline Color Science Discontinuity

The SOOC JPEG carries the camera's entire proprietary rendering stack applied sequentially: sensor linearization, camera-specific color matrix (often updated per firmware revision, tuned under controlled illuminants), spatially-adaptive multi-pass noise reduction that smooths chroma noise aggressively while preserving luminance edges, unsharp masking or frequency-domain sharpening, the manufacturer's proprietary highlight rolloff and shadow tone curves, picture profile encoding (Film Simulation, Picture Style, Picture Control), and finally sRGB gamma.

Each step modifies the pixel values in ways that have no systematic inverse. The color matrix transforms the gamut. The NR removes high-frequency texture. The sharpening adds synthetic edge contrast. The tone curves non-linearly reshape the tonal distribution. The picture profile applies a 3D color transform across the entire signal range.

The RAW-derived gain map is computed from linear sensor data that passed through **none** of this. The gain map represents the physical scene luminance ratio between extended range and SDR white. The SOOC JPEG represents the manufacturer's creative and technical interpretation of that scene.

These two representations disagree at every pixel where the camera's tone operator made a decision. The disagreement is most significant in highlights — exactly the region the gain map is trying to extend.

Consider: a bright sky. The camera's highlight tone curve rolls off the sky from clipping, placing it at, say, 90% of SDR white in the JPEG. The scene-linear value at those same pixels might be 3× scene white. The gain map computes a 1.74-stop boost for those pixels. On an HDR display, the reconstruction produces the right luminance. But the **color** of that reconstructed HDR sky is determined by whatever hue the JPEG's color matrix and picture profile assigned to it — not by the physical spectral content of the sky. If Fujifilm Film Simulation shifted that sky toward cool cyan (which PROVIA and Velvia both do to varying degrees), the gain map amplifies that cinematically-shifted cyan into the HDR extension region. The sky glows at the correct luminance but in a color that carries the JPEG's creative interpretation into the HDR domain.

In raw2hdr, the LUT's color decision for the sky is made once, in one consistent mathematical framework, and that same decision extends into the HDR range through the same computation. The SDR rendering and the HDR extension are not two separately-computed things that need to match — they are two parts of the same single-pass output.

---

### Problem 2: JPEG Compression Artifacts Amplified in HDR

JPEG encoding divides the image into 8×8 pixel blocks and applies a discrete cosine transform to each block independently. The DCT coefficients are then quantized to integer values — the step that causes irreversible information loss. In smooth areas — sky gradients, out-of-focus backgrounds, plain walls, subtle shadow gradients — this quantization produces two types of artifact: rounding noise within each block from the integer quantization of DCT coefficients, and block boundary discontinuities where adjacent 8×8 regions have slightly different DC offset values.

These artifacts are often below the threshold of visibility in the SDR base image. But the gain map multiplies each pixel's luminance. In a sky region where the map instructs a 2× brightness boost for HDR rendering, the multiplicative operation amplifies the JPEG's DCT noise by the same factor. A smooth, continuous blue sky gradient in SDR becomes a bright blue sky with subtle rectangular tiling structure in the HDR reconstruction — precisely the opposite of what high-quality HDR imagery should look like.

raw2hdr operates on uncompressed floating-point pixel data from RAW decode through to the final HEIC encode. No JPEG compression step occurs anywhere in the pipeline. A smooth gradient in the input produces a numerically smooth gradient in the output.

---

### Problem 3: Gain Map Spatial Resolution and Upsampling

Gain maps are stored at sub-resolution — typically one-quarter or one-eighth of the primary image dimensions in each direction — to keep file sizes manageable. The full-resolution HDR map is reconstructed at decode time through bilinear upsampling.

This means the gain map is inherently a low-spatial-frequency field. It can represent large-area luminance differences — a bright sky region versus a darker foreground, a lamp versus a wall — but it cannot accurately represent high-frequency HDR content at pixel scale:

- **Specular highlights on surfaces** (sharp, isolated bright clusters of a few pixels)
- **Eye catchlights** (often one or two pixels at 3–5× scene white that define the life in a portrait)
- **Christmas lights, city lights at distance, bokeh highlight cores**
- **Lens flare streaks and sun stars with fine radial structure**
- **Water surface sparkle** (individual specular reflections at high intensity)

For all of these, the upsampled gain map distributes the HDR boost over a softened neighborhood around the true position. A catchlight that should be a brilliant pinpoint becomes a soft glow centered approximately at the right location. The spatial precision that makes these elements visually compelling — the "micro-contrast" of HDR — is lost to the upsampling blur.

raw2hdr computes the HDR extension independently for every single pixel based on that pixel's own scene-linear luminance value. There is no spatial averaging, no blur, no upsampling. A two-pixel specular at 5× scene white receives the correct logarithmic extension for those exact two pixels only. The HDR rendering is full-resolution by construction.

---

### Problem 4: In-Camera Noise Reduction Conflicts with the RAW Gain Map

At ISO 1600 and above, in-camera noise reduction becomes visually significant. The SOOC JPEG at high ISO has smooth, processed shadows and midtones where the camera's multi-pass NR has replaced sensor noise with interpolated smooth values — a deliberate and generally desirable aesthetic choice that the camera's engineering team tuned for years.

The gain map, derived from the unprocessed RAW, contains the original sensor noise. In shadow areas where the gain map value is small (SDR and HDR shadow levels are approximately equal), the RAW noise is encoded as fine spatial variation in the gain map values. When applied to the already-smooth NR'd JPEG shadows, this variation reintroduces luminance texture that is:

- Not resolved photographic detail (the NR removed that)
- Not authentic film grain (it is a gain-map-warped version of the RAW sensor noise pattern)
- Not spatially coherent with the JPEG's block structure

The result in shadow and lower-midtone regions is a heterogeneous artifact that looks like neither the clean NR'd JPEG nor like intentional grain. It is specifically an artifact of the two-pipeline mismatch.

raw2hdr's NR behavior is determined entirely by the native RAW decoder, which applies its own quality-level NR during demosaic. If the user adds film grain via the creative effects system (Section 10), that grain is a deliberate procedurally-generated texture applied at a known intensity to the final HLG pixel buffer. There is no accidental noise reinjection from pipeline mismatch.

---

### Problem 5: Creative Grading After the Fact Breaks the Gain Map

If a photographer wants to apply a color grade — a LUT, an exposure adjustment, a color curve — to a SOOC JPEG + gain map UHDR image:

1. The grade operates on the 8-bit JPEG base layer — immediately truncating to 8-bit precision for all subsequent operations
2. The gain map was computed relative to the **ungraded** JPEG. Every tone the grading operation moves changes the luminance values in the base image, which means the gain map values no longer correctly represent the ratio between SDR and HDR luminance at those pixels
3. Correcting this requires recomputing the gain map against the graded JPEG, which in turn requires access to both the original RAW and a pipeline capable of aligning all three layers simultaneously

No standard consumer or prosumer software handles this three-way recomputation. In practice, the gain map becomes permanently inconsistent with the graded base the moment any non-identity tone operation is applied.

In raw2hdr, the LUT choice is the first decision in the pipeline. The creative rendering, the HDR extension, and the final encode are all computed together in one unified pass. Changing the LUT re-runs the complete pipeline from linear RAW data. There is no "stale secondary layer" to reconcile because there is no secondary layer.

---

### Problem 6: In-Camera Sharpening Amplification at Edges

SOOC JPEGs include sharpening — a spatial high-pass filter that increases local contrast at edges and fine texture. The sharpening is calibrated by the camera manufacturer to look correct at SDR display white. When the gain map multiplies an already-sharpened edge by the HDR boost factor, the edge becomes more contrasty than the scene's physical content justifies. Luminance halos around subjects and fine detail are a well-documented HDR rendering artifact, and pre-sharpened source material makes them substantially worse in any gain-map reconstruction.

raw2hdr's RAW decoder outputs unsharpened linear data. The HDR extension at edges reflects actual scene edge contrast, not enhancement that the camera pre-applied.

---

### Problem 7: Lens Correction Spatial Misalignment

Modern cameras apply lens corrections in-camera before writing the SOOC JPEG. These corrections include geometric distortion correction (straightening barrel or pincushion distortion), vignetting correction (brightening corners to compensate for optical light falloff), and sometimes transverse chromatic aberration correction. The corrections are applied by the camera's ISP at the time of JPEG generation, using lens profile data stored in the camera firmware.

The RAW file, by contrast, stores the uncorrected sensor data. The RAW pixels represent the scene as physically imaged by the lens — with barrel distortion pulling edge pixels outward, with vignetting darkening corners, with chromatic fringing at high-contrast edges. When a gain map is computed from this uncorrected RAW data, its pixel positions correspond to the uncorrected sensor geometry.

When that gain map is applied to the geometrically-corrected SOOC JPEG, the spatial correspondence between gain map pixels and JPEG pixels is systematically wrong:

```
Corrected JPEG:                 RAW (uncorrected):
┌──────────────────┐            ┌──────────────────┐
│  ·               │            │·                  │
│    subject       │            │   subject         │
│         edge ─── │──────────→ │──── edge (moved)  │
│              ·   │            │              ·    │
└──────────────────┘            └──────────────────┘

Corner pixel in JPEG            Same corner's position
has been moved inward           in RAW is different —
by distortion correction.       gain map was computed
                                at the RAW coordinate.
```

The error is small near the image center (where distortion correction displaces pixels by only a few pixels) and grows progressively toward the corners (where barrel distortion can displace pixels by 2–5% of image width). The result is a spatial fringe artifact in the HDR reconstruction: at image corners and edges, the HDR boost is applied at the wrong pixel position, creating luminance and color inconsistencies that are invisible in SDR but visible under HDR amplification.

Additionally, vignetting correction compounds the problem. The SOOC JPEG has had its corners brightened by in-camera vignetting correction — the camera added luminance to compensate for the lens's natural corner falloff. The gain map was computed from the uncorrected RAW where corners are darker. The gain map therefore sees a large luminance difference between RAW corners (dark, uncorrected) and SDR JPEG corners (bright, corrected) and encodes a large positive gain value for those pixels. When applied to the already-brightened JPEG corners, this over-boosts the corners in the HDR reconstruction, creating a brightness inversion at the frame edges — the corners become disproportionately bright rather than the expected neutral or slightly-darkened characteristic.

In raw2hdr, lens correction is applied at the linear-light stage of the pipeline, before log encoding, before LUT application, and before HDR extension. Geometric correction, vignetting correction, and chromatic aberration correction all operate on the same uncompressed floating-point pixel buffer in the same coordinate system. When the HDR extension later uses scene-linear pixel values, those values already reflect the corrected geometry and corrected luminance distribution. There is no coordinate mismatch because correction and HDR extension are computed in the same pipeline, on the same data, at the same resolution.

---

### Summary Comparison

| Characteristic | SOOC JPEG + RAW Gain Map | raw2hdr Single-Pass HLG |
|---|---|---|
| **Color science source** | Two separate pipelines — camera engine + RAW linear | One unified pipeline from RAW to HLG output |
| **Chroma in HDR highlights** | Shaped by camera's creative profile; gain map amplifies it | Shaped by chosen LUT; consistent through SDR and HDR range |
| **Intermediate compression** | JPEG-compressed 8-bit base carries DCT artifacts | Floating-point precision throughout — no compression until final encode |
| **Spatial HDR resolution** | Reduced-resolution gain map, upsampled to full size | Per-pixel exact — full resolution at every stage |
| **NR / sharpening interaction** | Gain map reintroduces sensor noise onto NR'd JPEG; sharpening amplified | No NR or sharpening applied by the pipeline; clean linear data |
| **Lens correction geometry** | Gain map derived from uncorrected RAW; JPEG uses corrected coordinates — spatial mismatch at edges | Correction applied once, in linear light, before any subsequent operation |
| **Vignetting and gain map** | In-camera vignetting correction on JPEG + uncorrected gain map = corner over-boost | Vignetting correction in linear light, same coordinate space as HDR extension |
| **LUT / grade application** | Invalidates existing gain map; requires full recomputation from RAW | Grade is the first pipeline step; full system self-consistent |
| **Point-source specular HDR** | Blurred by gain map upsampling | Per-pixel exact, full spatial fidelity |
| **Pipeline complexity** | Two separate renders + gain map computation + composite | Single render, single output |

---

### Where SOOC + Gain Map Genuinely Wins

The gain map approach has real legitimate advantages in specific cases:

- **Camera-native rendering is the artistic target:** If the photographer specifically wants the camera's JPEG color science and only wants to add HDR highlight recovery on top of it, the gain map correctly extends highlights while preserving the camera's rendering below SDR white. For photographers who love their camera's JPEG look but want HDR capability, this is a valid and coherent workflow.

- **RAW file no longer available:** When only the SOOC JPEG exists and HDR reconstruction is still desired, a gain map estimated from luminance analysis of the JPEG itself is the only available path. This is a real use case for archival images and shared JPEGs.

- **Android / cross-platform requirements:** Google Ultra HDR JPEG is specifically designed for broad compatibility across Android hardware that may not support HEIC HDR. For photographers who distribute primarily to Android-first ecosystems, the format compatibility argument is real.

raw2hdr makes a different trade-off: full pipeline control, mathematical consistency, and per-pixel spatial precision — in exchange for requiring the original RAW file to be present. Since raw2hdr is a RAW processing application, the RAW is always available, making the gain map trade-off unnecessary.

---

## 8. TIFF as a Scene-Referred Intermediate — Containers vs. Output Formats

### The Misunderstood Reputation of TIFF

TIFF (Tagged Image File Format) was designed in 1986 by Aldus Corporation as a flexible, extensible container for image data. The specification imposes no constraints on bit depth, color space, or display intent. It supports 8-bit integer, 16-bit integer, 32-bit integer, 16-bit half-float, and 32-bit float per channel — all equally valid within the same container format. It can store any number of channels, any ICC-characterized color space, linear or gamma-encoded data, and metadata of arbitrary type.

The widespread belief that "TIFF means SDR output" is a **workflow convention, not a technical constraint**. It arose because the most common use of TIFF in photography and prepress has been as a high-quality SDR archive — the intermediate between a RAW converter and a print or display workflow. That conventional use shaped how the format is perceived. The format itself never imposed it.

The formats that are genuinely constrained to SDR display output are the delivery formats:

```
Delivery / output formats — SDR ceiling is structural:

  JPEG:   8-bit, sRGB, lossy DCT compression
          Maximum value = display white. No metadata path for HDR.
          Values above SDR white: clipped at encode time, unrecoverable.

  PNG:    8-bit or 16-bit, sRGB or indexed
          No standardised HDR metadata container.
          A 16-bit PNG can store wide values but no viewer interprets
          them as HDR — they are treated as display-referred sRGB.

  These are output terminals. They express a rendering decision.
  They cannot be used as scene-referred intermediates.

Container / intermediate formats — no SDR ceiling:

  TIFF:   Any bit depth, any color space, linear or encoded
          No semantic white ceiling in the specification.
          A 16-bit linear TIFF is a data container, not a display promise.

  OpenEXR: 16-bit half-float or 32-bit float, scene-linear by design
          Values above 1.0 are normal and expected.
          Explicitly designed as a scene-referred intermediate.

  DNG:    Adobe's digital negative container — RAW data with metadata.
          A linearised DNG is a 16-bit linear container in all but name.
```

The constraint people attribute to TIFF belongs to the delivery formats, not to TIFF itself.

---

### When a 16-bit TIFF Acts Like a RAW File

A 16-bit TIFF becomes a scene-referred intermediate — functionally equivalent to a processed RAW for HDR purposes — when it satisfies three conditions:

**1. Linear encoding, no gamma applied.**
Gamma encoding (sRGB, gamma 2.2, gamma 1.8) reallocates code values non-uniformly, concentrating precision in shadows and compressing highlights. More critically, the gamma encode is typically paired with a **white ceiling** — the encoder clips anything above reference white before applying gamma. A linear TIFF carries no such ceiling. Code value 40,000 out of 65,535 simply means "this many photons were recorded at this pixel," with no implicit display mapping.

**2. Wide or scene-referred color space — no highlight clip.**
An sRGB export clips any scene value above sRGB display white before writing. An AdobeRGB export extends the gamut but still clips at its own white ceiling. A linear ProPhoto RGB or ACES export uses a primary set wide enough to contain essentially the full range of scene luminance, and does not apply a clipping tone curve. Under these conditions, highlights that would blow out in sRGB — a sky at 3× scene white, a specular at 8× — remain proportionally represented in the TIFF's code values.

**3. A known or recoverable scene-white reference.**
The HDR encoding step requires knowing where "scene white" sits in the code value range — the calibration reference that distinguishes "SDR midtone" from "HDR highlight." In a SilverFast scan, this is derivable from the scanner's characterization data. In a camera RAW exported to linear ProPhoto, it is derivable from the ICC profile's white point and the known relationship between 18% grey and the working space's encoding. Without this reference, the HLG scale factor cannot be correctly set — the encoder does not know how much headroom to allocate.

When all three conditions are met:

```
16-bit linear TIFF (wide gamut, no clip, known white reference)

  Code value 0       → black (scene minimum)
  Code value ~12,000 → 18% grey (scene midtone)
  Code value ~41,000 → scene white (SDR ceiling equivalent)
  Code value 65,535  → ~1.6× scene white (highlight headroom)

  ↓  normalise: divide by scene-white code value

  0.0  → black
  0.29 → 18% grey
  1.0  → scene white
  1.6  → brightest recoverable highlight

  ↓  apply HLG OETF (same as raw2hdr's pipeline)

  Valid HLG-encoded HDR output.
  Values above 1.0 map into the HLG headroom region.
```

This is the same pipeline raw2hdr uses, applied to a different source. The demosaic has already been performed; the scene-linear reference is established from the characterisation data; the rest of the pipeline is identical.

---

### What a Viewer Actually Shows When You Open a 16-bit TIFF

Even if all three conditions above are met — linear encoding, no highlight clip, known scene-white reference — and the file genuinely contains HDR luminance data above scene white, opening it in any standard viewer renders it as **SDR**. The data is physically present in the file. The viewer simply never reads it as HDR.

Here is the exact chain of events:

```
16-bit TIFF opened in a standard viewer
(macOS Preview, Windows Photos, Lightroom, Photoshop, iOS Photos)

        │
        ▼
Viewer reads embedded ICC profile
(e.g., "Adobe RGB (1998)", "ProPhoto RGB", "sRGB IEC61966-2.1")
        │
        ▼
ICC color management applies rendering intent
(perceptual or relative colorimetric — both treat ICC white point = display white)
        │
        ▼
ICC white point mapped to display reference white
Code value 65,535 → display white, regardless of what it represents in scene luminance
        │
        ▼
Converted to display color space (Display P3, sRGB)
Rendered at 8 or 10-bit SDR
        │
        ▼
Highlight headroom above scene white: invisible
The data is in the file — unread, uncorrupted, unrendered
```

The viewer is not broken. It is doing exactly what the ICC color management specification dictates. ICC was designed for SDR reproduction — its architecture assumes the goal is to map a device's color space onto a bounded-range output medium. The ICC white point is defined as the maximum luminance the output medium can produce. There is no mechanism in a traditional ICC workflow to express "some values in this file exceed the reproduction medium's white — map them to HDR headroom." That concept does not exist in the ICC framework.

The result: a 16-bit linear TIFF with a highlight at 1.6× scene white and a highlight at 1.0× scene white look identical when rendered by a standard viewer. Both map to display white. The 60% of extra luminance in the brighter highlight is discarded at the ICC rendering step, not because the data was lost, but because the viewer had no instruction to do anything other than clip it to white.

**This is why dedicated HDR formats use non-ICC metadata paths.** HEIC with BT.2100 HLG uses an NCLX color box — a completely separate metadata structure from ICC, defined by ITU-R — that tells the viewer explicitly: "this signal uses HLG transfer, reference white is at 75% of the signal range, values above that are extended highlights, map them to HDR luminance on the display." OpenEXR communicates it by industry convention rather than file metadata: every OpenEXR-aware tool understands that `1.0 = scene white` and values above it are HDR content. Neither format relies on ICC.

The 16-bit TIFF with HDR data inside it is analogous to a film negative held up to an ordinary lamp: the full tonal information is physically there on the film, but you need a properly calibrated enlarger to print it correctly. A standard viewer is the wrong enlarger. raw2hdr, an OpenEXR-aware compositor, or an HLG-native viewer is the right one.

---

### Why Not Just Use a Better ICC Profile?

The natural follow-up question: if classic ICC clips at display white, can't a higher-capability ICC profile fix this? The answer is yes in specification, and no in practice.

**iccMAX (ICC.2:2019)** is the HDR-capable extension of the ICC standard. It was designed explicitly to address the display-referred limitation:

- Supports scene-referred workflows where values above 1.0 are valid
- Can encode values above display white with defined semantics
- Supports complex tone-mapping operators embedded directly in the profile
- Technically capable of HDR round-tripping inside a TIFF container

So a 16-bit linear TIFF with an iccMAX profile is, in specification, a valid HDR container. The problem is entirely on the consumption side:

```
iccMAX Support Matrix

┌────────────────────────────┬──────────────────────────────────┐
│ Software                   │ iccMAX Support                   │
├────────────────────────────┼──────────────────────────────────┤
│ macOS Preview              │ None — falls back to sRGB        │
│ Windows Photos             │ None — falls back to sRGB        │
│ iOS Photos                 │ None                             │
│ Adobe Photoshop            │ None (ICC.1 only)                │
│ Adobe Lightroom            │ None (ICC.1 only)                │
│ Capture One                │ None (ICC.1 only)                │
│ Final Cut Pro / DaVinci    │ None — use OpenEXR instead       │
│ Specialized ICC tools      │ Partial (profiling software only)│
└────────────────────────────┴──────────────────────────────────┘
```

When a viewer encounters an iccMAX profile it doesn't understand, it does one of two things: silently falls back to sRGB (most common), or refuses to open the file. Either way, the HDR data in the TIFF is not rendered.

**The deeper architectural tension:** ICC was built around the premise that a profile's job is to get content reliably onto a display. iccMAX tried to retrofit scene-referred thinking onto that foundation — extending an SDR-first architecture to handle HDR. The industry examined this path and concluded it was easier to walk away from ICC for HDR use cases than to extend it.

The result is the split that exists today:

```
HDR Metadata Paths — Industry Divergence

ICC path (SDR-first):
  Classic ICC → iccMAX → high implementation complexity, near-zero adoption

Non-ICC paths (HDR-native):
  NCLX box     → HLG/PQ HEIC — defined by ITU-R, used by Apple/Android
  EXR header   → OpenEXR scene-linear convention — used by VFX/cinema
  Gain map     → JPEG/HEIC HDR — used by Google, Apple for camera output
```

This is why raw2hdr encodes HDR via NCLX, not via an ICC profile. NCLX was designed for video and HDR from the beginning — it has explicit fields for transfer function (HLG or PQ), color primaries (BT.2020), and matrix coefficients, with no concept of "display white as ceiling." It does not carry any of the display-referred legacy that makes ICC unsuitable for HDR.

---

### OpenEXR — What TIFF Would Have Been, Designed for HDR from the Start

When Industrial Light & Magic built their own digital compositing infrastructure in the early 2000s, they faced the same problem: existing formats were either lossy (JPEG), limited to 8-bit (TIFF in common use), or lacked standardised scene-linear semantics. In 2003 they released **OpenEXR** as an open standard, designed explicitly for scene-referred linear image data.

OpenEXR and 16-bit TIFF are expressions of the same underlying concept — a high-precision container for scene-linear data — but OpenEXR was designed with that purpose explicitly in mind from the beginning:

```
Comparison: 16-bit TIFF vs. OpenEXR

┌─────────────────────┬─────────────────────────────┬─────────────────────────────┐
│ Property            │ 16-bit Integer TIFF          │ OpenEXR 16-bit Half-Float   │
├─────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ Data type           │ Integer (0–65,535)           │ IEEE 754 half-float          │
│ Value range         │ 0.0 – 1.0 after normalise   │ 0.0 – 65,504 (no ceiling)   │
│ Values above 1.0    │ Possible but need mapping    │ Native — 1.5, 8.0, 100.0    │
│ Scene white = 1.0   │ Requires calibration step   │ Convention, built into spec  │
│ Precision in darks  │ High (linear codes)          │ High (float exponent)        │
│ Precision in bright │ Degrades at extremes         │ Consistent across range      │
│ HDR semantics       │ Implicit, requires agreement │ Explicit in the standard     │
│ Industry adoption   │ Photography, prepress, scan  │ VFX, animation, cinema, HDR  │
│ Compression         │ LZW, ZIP, uncompressed       │ PIZ, ZIP, B44, DWAA/DWAB    │
│ Channels            │ RGB, RGBA, CMYK, custom      │ RGB, RGBA, multi-pass, deep  │
└─────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

The fundamental difference is semantic. In OpenEXR, the value `1.0` means "scene white" by convention across the entire industry — every VFX tool, every compositing application, every renderer that writes OpenEXR uses this convention. Values of `3.0` or `12.0` naturally represent pixels that are 3× or 12× brighter than scene white; they are stored in the half-float number naturally without any special treatment. In a 16-bit integer TIFF, the value `1.0` (i.e., code value 65,535) has no inherent scene-luminance meaning — it means "maximum code value," which maps to scene white only if the export pipeline was set up that way.

OpenEXR is what every major VFX production uses as its working format. Every frame of every major film rendered with CGI for the past two decades has existed as OpenEXR files at some point in the pipeline — linear light, values above 1.0 for specular and emissive elements, then tone-mapped or encoded to PQ/HLG for cinema or home release. The bridge from scene-linear to display HDR is the last step in the chain, and it maps directly onto what raw2hdr does at the output stage.

---

### Bridging 16-bit TIFF and OpenEXR

The conversion between a properly-exported 16-bit linear TIFF and OpenEXR requires only two operations:

**Step 1: Integer-to-float normalisation**

The 16-bit integer values (0–65,535) must be divided by the scene-white code value to produce normalised float values where `1.0 = scene white`. The scene-white code value comes from the characterisation data:
- For a SilverFast HDRi scan: derivable from the scanner's D-max calibration and the film stock's density reference
- For a camera RAW exported to linear ProPhoto RGB: derivable from the ProPhoto white point definition and the RAW converter's exposure calibration
- For a DNG linearised export: available from the DNG metadata's `WhiteLevel` tag, which explicitly records the code value corresponding to sensor saturation

```
16-bit TIFF → OpenEXR normalisation:

  scene_white_code = known from characterisation (e.g., 41,000)

  For each pixel:
    openexr_value = tiff_integer_value / scene_white_code

  Code value 0       → OpenEXR 0.0   (black)
  Code value 20,500  → OpenEXR 0.5   (midtone)
  Code value 41,000  → OpenEXR 1.0   (scene white)
  Code value 65,535  → OpenEXR 1.598 (highlight headroom)
```

**Step 2: Color space conversion**

If the TIFF is in ProPhoto RGB linear, the primaries must be converted to the target working space (ACES, linear Rec.709, linear Rec.2020, etc.) using the standard chromatic adaptation + matrix multiplication. If the TIFF is already in ACES linear, no conversion is needed. OpenEXR supports arbitrary color space descriptors via its metadata, and ACES-linear OpenEXR is the most common industry standard.

After these two steps, the OpenEXR file is fully interoperable with the VFX and HDR display pipeline. Values above 1.0 are correctly represented as brighter-than-white scene content, ready for tone-mapping or direct HLG/PQ encoding.

**From OpenEXR to HLG HEIC** — the final bridge to display HDR:

```
OpenEXR (scene-linear, scene white = 1.0)
        │
        ▼
Convert primaries to Rec.2020 (ITU-R BT.2087 matrix)
        │
        ▼
Apply HLG scale factor (~0.32 pre-scale)
  → maps scene white (1.0) to HLG signal ~0.75
  → leaves upper 25% of signal range for HDR headroom
        │
        ▼
Apply HLG OETF per ITU-R BT.2100
  → 0.0 to 1.0 linear → 0.0 to 0.75 HLG signal (SDR zone)
  → 1.0 to ~3× white linear → 0.75 to 1.0 HLG signal (HDR zone)
        │
        ▼
Write HEIC with BT.2100 HLG color space embedded
        ↓
Valid display HDR — identical pipeline to raw2hdr's output stage
```

This path — OpenEXR scene-linear to HLG HEIC — is exactly the pipeline raw2hdr executes, with the difference that raw2hdr starts from a camera RAW file rather than an OpenEXR. The output stage is identical. The HDR display compatibility is identical.

---

### Why raw2hdr Still Starts From Camera RAW

Given that a properly-exported 16-bit TIFF or OpenEXR can feed the same HDR pipeline, why does raw2hdr anchor on the camera RAW file as its starting point?

**The scene-linear reference is intrinsic, not derived.** When CIRAWFilter decodes a RAW file, the output is calibrated scene-referred linear sRGB by definition — no external characterisation file is needed to establish where scene white is. In a 16-bit TIFF workflow, the scene-white reference must be recovered from metadata, ICC data, or prior knowledge of the export settings. This introduces a dependency that can fail if the metadata is missing, the export was done with non-standard settings, or the file has been passed through multiple tools that each made different assumptions.

**No intermediate processing decisions are locked in.** A camera RAW file is the purest possible starting point: no demosaic decision, no noise reduction choice, no colour rendering preference has been baked in yet. A 16-bit TIFF has already committed to one demosaic algorithm, one NR setting, one initial colour rendering. These decisions may or may not suit the subsequent HDR processing.

**The full creative pipeline is available.** Because raw2hdr works from the unprocessed linear decode, it can apply synthetic log encoding for any manufacturer's LUT format, calibrate to any film simulation, and extend highlights using scene-linear data that has never been through any prior tone operation. A 16-bit TIFF that went through Lightroom's default rendering before export has already had Lightroom's tone curve applied — the highlight data above SDR white may have been compressed or partially clipped depending on the export settings.

The camera RAW file is the most reliable form of what all three scene-referred intermediate formats — linear TIFF, OpenEXR, and DNG — are trying to preserve: an uncorrupted, calibrated record of scene luminance that can feed any downstream creative or display-encoding pipeline.

---

## 9. HLG Encoding — Perceptual HDR Without Metadata Fragility

### Why HLG Over PQ (HDR10)

Two transfer functions dominate the HDR landscape: **PQ (Perceptual Quantizer, SMPTE ST 2084)** and **HLG (Hybrid Log-Gamma, ITU-R BT.2100)**. They represent fundamentally different philosophies about how HDR should be encoded.

**PQ** encodes absolute display luminance in candelas per square meter. A PQ signal value of 50% encodes a specific nit level regardless of the display it is shown on. This precision is valuable in controlled cinema post-production environments where the mastering display characteristics are known and the distribution chain is tightly managed. The cost is dependency: PQ content requires external metadata — static MaxCLL/MaxFALL values or frame-level dynamic metadata — to tell each display what the content's peak brightness is so it can tone-map correctly for its own capabilities. A 600-nit phone display and a 2000-nit reference monitor need different tone-map curves applied to the same PQ signal. Without that metadata correctly matching the content, PQ material either appears washed out (if the display assumes higher peak than the content) or crushes the highlights (if it assumes lower). For user-generated photographs shared casually across the full spectrum of viewer devices, this metadata dependency is a meaningful fragility.

**HLG** encodes luminance relative to the display's own reference white level, not in absolute nits. The critical property: the HLG signal value that maps to reference white (the standard white of an SDR display) is identical to the reference white of any SDR-compatible display. This means **HLG is natively backward compatible with SDR displays without any tone-mapping step.** A display that knows nothing about HDR simply renders the HLG signal as a slightly bright-looking image — acceptable, not broken. An HDR-capable display uses the extended signal range above reference white to show genuine HDR luminance. No metadata is required to make this work; the transfer function itself encodes the necessary information.

```
PQ signal:          Absolute nit value — needs metadata to render
                    ├─ Without metadata → display guesses → usually wrong
                    └─ Requires MaxCLL / MaxFALL or dynamic metadata

HLG signal:         Relative to display reference white
                    ├─ SDR display: renders 0–0.75 as standard SDR ✓
                    └─ HDR display: 0.75–1.0 = extended highlight region ✓
                         No metadata needed
```

For raw2hdr — where HEIC images are shared via iMessage, AirDrop, email, social platforms, and cloud storage to devices spanning from older SDR phones to ProDisplay XDR — HLG's self-describing nature and SDR backward compatibility are decisive. The same HEIC file works correctly on every viewer. No version management, no SDR export, no metadata maintenance.

### The HLG Transfer Function: Two Regimes of Human Vision

The HLG OETF (Opto-Electronic Transfer Function) is a piecewise mathematical function with two segments, each corresponding to a different regime of the human visual system:

**Square root segment (low luminance, shadows to lower midtones):** In this region the function behaves like a square root — a power function with exponent 0.5. This is a relatively rapid compression that allocates many signal codes to the subtle tonal variations in dark areas. Human vision is most sensitive to relative contrast in dark regions; this segment matches that sensitivity by providing fine tonal resolution in the shadows.

**Logarithmic segment (midtones to highlights):** Above the segment knee, the function transitions to a logarithmic response. The logarithm naturally matches the logarithmic sensitivity of human vision to brightness (the Weber-Fechner law) and also matches the characteristic shoulder curve of photographic film. This segment allocates signal codes at a rate that corresponds to how much tonal distinction a viewer can actually perceive — compressing highlights more aggressively than midtones because the perceptual difference between "2× white" and "2.1× white" is far smaller than the difference between "18% grey" and "19% grey."

The boundary between the two segments is set at 1/12 of scene white — approximately the luminance of a dark but not-black shadow area. The transition is smooth, with the square root and logarithmic segments meeting tangentially (matching in both value and derivative) so there is no perceptual discontinuity.

A scale factor applied to the linear signal before HLG encoding determines where scene white maps in the HLG signal range. The chosen scale places reference white at approximately 75% of the HLG signal range, leaving the upper 25% available for extended highlights. In terms of signal codes in a 10-bit file, this means roughly 750 codes for SDR-equivalent content (shadows through reference white) and 274 codes for highlights brighter than reference white — sufficient resolution for smooth HDR gradients without visible banding.

### How HDR Metadata Is Embedded — Not as a Sidecar, But as Identity

HEIC (High Efficiency Image Container) stores color space information intrinsically as part of the image's data structure. When the HLG-encoded pixel buffer is assigned the BT.2100 HLG color space before HEIC encoding, the container format embeds the corresponding NCLX (Non-Constant Luminance Extended) color description box directly in the file:

- **Color primaries:** BT.2020 (the wide-gamut primaries, same as Rec.2100)
- **Transfer characteristics:** HLG (as distinct from sRGB gamma, PQ, or BT.2020's gamma 2.4)
- **Matrix coefficients:** BT.2020 non-constant luminance

These three values are what iOS Photos, macOS Preview, Safari, and any HEIC-capable viewer read to determine: (a) the HDR rendering path should be activated, (b) the BT.2100 HLG tone curve should be applied to the signal, and (c) the HDR badge should appear in the Photos UI.

The HDR designation is not a flag. It is not a sidecar. It is not a layer. It is an intrinsic property of the image's color space descriptor, embedded in the same container as the pixel data. The image cannot be stripped of its HDR metadata without reprocessing the pixel data — they are structurally unified.

---

## 10. HDR Canvas Problem: Why Traditional Effects Break at 10-Bit

### The 8-Bit Default in Every Standard Graphics System

Every standard 2D graphics system in the mobile and desktop software ecosystem defaults to 8-bit sRGB compositing:

- **iOS / macOS:** Core Graphics bitmap contexts, UIKit image renderers, SwiftUI canvas
- **Android:** Android Canvas, Bitmap API
- **Flutter:** The `dart:ui` Canvas and Paint system
- **Web:** HTML5 Canvas 2D context

This default exists for good reasons: 8-bit sRGB is sufficient for UI rendering, icon compositing, text display, and standard photography at consumer quality. It is memory-efficient (3 or 4 bytes per pixel vs. 8 bytes for 16-bit float). It is GPU-accelerated across all hardware. And the vast majority of software use cases — displaying a button, rendering a label, drawing a chart — have no need for extended precision or dynamic range.

The consequence for HDR photography is severe. Any compositing operation performed through these standard systems — adding a border, overlaying text, compositing a logo, drawing a shape fill — runs at 8-bit precision and produces 8-bit sRGB output. Even if the input is a 16-bit HDR HEIC, the standard context discards the precision immediately. The HLG encoding is gone. The Rec.2020 wide gamut is gone. The recovered highlights are gone. The output is a standard 8-bit sRGB image that happens to contain the same scene content but carries no HDR information.

```
Standard 8-bit compositing path:

HDR HEIC (16-bit, HLG, Rec.2020)
          │
          ▼
  Standard CGContext (8-bit, sRGB)
          │ ← all HDR data silently discarded here
          ▼
  Add border pixels (8-bit sRGB)
  Composite text (8-bit sRGB)
  Composite logo (8-bit sRGB)
          │
          ▼
  Output: 8-bit sRGB
  (HDR metadata: gone)
```

This is not a software bug. It is the designed behavior of these systems. Solving it requires bypassing the standard graphics path entirely.

### The Native Floating-Point Compositing Approach

raw2hdr moves all compositing into the native processing layer where the pixel format and color space are explicitly controlled at the level of the compositing context's creation.

Rather than using the standard 8-bit graphics context, the frame compositing stage creates a bitmap context that is explicitly configured for 16-bit half-float pixel storage and the BT.2100 HLG color space. This is a different context type at the operating system level — one that the standard UI rendering systems never create by default. Every drawing operation performed in this context inherits the floating-point precision and HDR color space:

```
raw2hdr native HDR compositing path:

HDR HEIC (16-bit, HLG, Rec.2020)
          │
          ▼
  Native 16-bit float context (BT.2100 HLG)
          │
          ├─ Draw border fill (color value in HLG signal space)
          │   → alpha blending at float precision
          │
          ├─ Composite image into context
          │   → no color space conversion; same space
          │
          ├─ Rasterize text via CoreText
          │   → sub-pixel antialiasing at float precision
          │   → fractional alpha values blend against HDR background
          │
          ├─ Composite logos (PNG / vector)
          │   → transparency at float precision
          │
          ▼
  Output CGImage: 16-bit, BT.2100 HLG preserved
          │
          ▼
  HEIC encode: BT.2100 HLG color space embedded in container
```

The result: the output HEIC file is a fully valid BT.2100 HLG HDR image that includes the photograph, the border, the text, and the logos — all composited at floating-point precision in the same HDR signal space. The border color is expressed in HLG signal units so it maps to the correct reference white on HDR displays. Text anti-aliasing blends against the HDR background without quantization error. Logo transparency composites at the full dynamic range available.

### Why This Matters Perceptually

On an HDR display, the visual consequence is that the entire framed output — image and decorative elements together — is a coherent HDR composition. A white border appears at the HDR reference white level, not at a sRGB 255 value that might accidentally appear as a different luminance relative to the image content. Text has the same perceptual brightness relationship to the image as the designer intended. A film strip frame's sprocket holes and edge markings are rendered at HDR precision, matching the photographic grain and tone of the bordered image.

On an SDR display, everything looks exactly like a standard photograph with a standard frame. HLG's backward compatibility ensures that the 8-bit pathway is not "degraded HDR" — it is genuinely correct SDR rendering of the HLG signal.

The phrase "every creative operation available in HDR format at 10-bit precision" means precisely this: no operation in the post-processing stack — effects, borders, text, logos — forces a downgrade to 8-bit. The dynamic range of the photograph is preserved from RAW decode to final composited HEIC output without interruption.

---

## 11. Filmic F/X — Creative Effects Natively in HDR

### Why the Staging of Effects Matters

Creative effects like film grain, light leaks, and lens flare are not applied at any intermediate stage of the color pipeline. They are applied at the end, after the complete HDR encoding is done — directly onto the floating-point HLG pixel buffer, before the final HEIC write. This staging is a deliberate design decision with significant consequences.

If effects were applied before the HLG encode — to the linear Rec.2020 buffer, for example — they would need to be designed in linear light, where the luminance distribution is highly non-uniform and the signal codes are concentrated in bright areas. Grain applied in linear light would appear extremely faint in dark regions and disproportionately coarse in bright regions.

If effects were applied after SDR tone-mapping — as virtually all traditional photography apps and editing software do — they would operate on 8-bit sRGB values. The effect would be limited to the SDR tonal range (0–255), meaning that grain or light leak elements could never exceed SDR paper white. Bright creative elements would clip at white. The HDR headroom that was so carefully recovered through the pipeline would be untouched by the creative layer.

By applying effects to the HLG-encoded signal, raw2hdr operates in the same perceptually-uniform space that the HLG transfer function was designed to create: tonal steps in shadows, midtones, and highlights are all represented at roughly equal perceptual weight. An effect at a given intensity level produces a visually consistent result across the full tonal range.

### What Traditional 8-Bit Editing Cannot Do

Standard image editing applications — mobile and desktop — apply creative effects in 8-bit sRGB. This has several fundamental limitations that the raw2hdr approach avoids:

**Hard ceiling at SDR white.** Any effect element that should be brighter than paper white — an overexposed light leak, a brilliant sun flare, a specular reflection on a rain-wet surface — clips to 255. The effect looks correct on SDR but loses the physical intensity that makes it convincing. On an HDR display, SDR-applied effects look flat because their brightest elements are capped below what the display is capable of showing.

**Perceptual non-uniformity in 8-bit space.** sRGB allocates more code values to dark tones than to bright tones (due to the gamma encode). Procedural effects like grain that are designed to be uniform across the tonal range appear coarser in shadows and finer in highlights when applied in sRGB, because the granularity of the underlying signal is not perceptually uniform. Correcting for this in 8-bit space requires explicit gamma compensation that most tools do not implement.

**Irreversible precision loss.** Once an effect has been composited into an 8-bit buffer, the precision of the underlying image in that region is reduced to 8 bits regardless of what was there before. The HLG encoding, the Rec.2020 gamut, the sub-bit precision of the color grading — all of it is permanently lost in the regions where effects were composited.

**No HDR-native element representation.** A traditional light leak consists of an RGB color pattern whose maximum values clip at sRGB 255. In raw2hdr's HLG buffer, the same light leak's color values can be set above SDR reference white — representing a genuinely overexposed, transparently burned-through quality that actual film light leaks produce. The leak "glows" in the HDR region above what a standard display can show, which is precisely how physical overexposure looks when correctly represented.

### The Effect Design Philosophy

The three effects in raw2hdr — film grain, light leaks, and lens flare — are each parameterized to cover the physical dimension of their real-world analog. Grain size maps to emulsion grain character (from fine-grain slow films to coarse pushed high-speed stocks). Grain type maps to the physical grain structure difference between silver halide monochrome film and dye-cloud color film. Light leak positioning maps to the physical geometry of where light enters a film camera body relative to the film gate. Lens flare ghost count maps to the number of optical elements in a compound lens that produce secondary internal reflections.

The goal is not simulation for its own sake but the preservation of the physical relationships that make these effects feel authentic — and the HDR compositing space is what makes the luminance relationships physically plausible, rather than clipped approximations.

---

## 12. Frame Design System — Compositing Without HDR Degradation

### The Traditional Frame Addition Problem

Adding a border to a photograph seems like a trivially simple operation. In practice, for HDR images it is one of the most fragile operations in a processing pipeline. The standard approach in virtually every mobile photo app and desktop editing tool is:

1. Create a new canvas in the standard graphics context (8-bit sRGB)
2. Fill the border region with the chosen color
3. Composite the image into the center of the canvas
4. Save the result

Step 1 irreversibly converts the pipeline to 8-bit sRGB. The HDR HEIC's floating-point pixel values are decoded, mapped through the color space, and deposited into an 8-bit integer buffer. The HLG transfer function, the Rec.2020 gamut, the recovered highlights — all discarded at the moment the standard canvas is created. The photograph may look identical on an SDR screen, but the output is no longer an HDR image in any meaningful technical sense.

Every subsequent operation — adding text, compositing a logo, drawing frame elements — compounds the problem. The more "post-processing" that happens after the initial HDR degradation, the further the output drifts from the original radiometric fidelity.

### The raw2hdr Approach: Compositing in Native HDR Space

raw2hdr solves this by performing all frame compositing in the native processing layer, in the same floating-point HDR context that holds the processed photograph (as described architecturally in Section 9). The compositing context is configured for 16-bit half-float precision and the BT.2100 HLG color space from the moment it is created, and it remains in that state through every compositing operation until the final HEIC encode.

This means that adding a border, rendering metadata text, compositing a camera logo, drawing film strip sprocket holes, sampling color swatches from the image — all of these operations happen in the HDR signal space. Border fills are specified as HLG signal values, not as sRGB byte values. Text anti-aliasing blends at float precision against the HDR background. Logo transparency composites without any signal space conversion. The output is a single coherent HEIC file where the photograph, the border, and all decorative elements are unified in one HDR-native composition.

### What the Frame System Provides

Eight compositional frame layouts are offered, ranging from borderless watermark overlays to asymmetric wide borders with metadata panels to film strip emulations with sprocket hole graphics. The designs vary in how they allocate space between photographic content and decorative frame elements, and in what metadata they surface — camera and lens identification, exposure parameters, GPS and temporal stamps, color palette swatches sampled from the image content itself.

All eight designs share the same architecture: they are described once as native compositing operations and rendered once into the HDR context. None of them route through the standard 8-bit graphics system at any point. The choice of how much border to add, what text to display, or which layout to use has no effect on the HDR fidelity of the output.

### Custom Typography Without HDR Compromise

Text rendering in frame designs uses the platform's CoreText engine, which provides professional-grade glyph rasterization with sub-pixel anti-aliasing. When rendered into the 16-bit HDR compositing context, this anti-aliasing produces fractional alpha values (the partial pixel coverage at character edges) that blend against the HDR image background at full floating-point precision. In a standard 8-bit context, these same fractional alpha values would be quantized to 8-bit, producing visible staircasing at glyph edges when viewed at high magnification or displayed on a high-DPI screen. In the 16-bit HDR context, they are preserved at full precision and produce visually smooth character edges even at extreme zoom.

### Camera Logo Intelligence

The frame system includes matched logo assets for 38 camera brands — covering essentially all manufacturers whose RAW files the app can process. Rather than a simple brand-name text field, the system attempts to match the camera's make and model strings to a logo asset, falling back to text only when no match is found. Logo colorization adapts to the border luminance: logos appear in white on dark borders and dark on light borders, with exceptions for brand logos that require specific colors for trademark integrity. All logo compositing happens in the same HDR context as the image, maintaining the consistent signal space throughout.

### EXIF Override System

Every metadata field displayed in frame designs has a user-configurable text override. This precedence system — explicit user text above EXIF-extracted values — serves legitimate creative and privacy use cases. A photographer can relabel their camera body, customize the displayed lens name, change the ISO shown, or add a custom title that does not appear in any EXIF field. These overrides are purely cosmetic: the underlying image processing — which was completed before frame compositing began — is unaffected by any metadata display choice.

---

## 13. LUT Thumbnail Cache Architecture

Generating visual preview thumbnails for 60+ LUT profiles from a RAW file would take an unacceptably long time if each LUT required an independent full RAW decode. At even reduced-scale processing, a full pipeline run from RAW decode through LUT application takes on the order of 1–3 seconds on a current iPhone. 60 LUTs × 3 seconds = 3 minutes of waiting before the user can evaluate any film simulation options. The thumbnail cache architecture is designed specifically to eliminate this bottleneck.

### The Single-Decode Strategy

The foundational insight is that all LUT previews for a given RAW image share exactly the same input: the neutral linear RGB decode of that RAW at reduced resolution. The decode step does not care which LUT will be applied; its output is identical regardless. Therefore, the decode should happen exactly once, and the resulting buffer should be held in memory and reused across all subsequent LUT applications.

The system performs one RAW decode at 25% scale (one-quarter dimensions in each direction, one-sixteenth total pixels) and stores the resulting linear half-float buffer in native memory, referenced by an integer handle. Every LUT preview generation for that image reads from this cached buffer. The expensive portion of the pipeline — sensor demosaic, color matrix application, white balance neutralization — runs once. The fast portion — log encode, LUT lookup, post-LUT processing — runs once per LUT.

```
Without caching (naive):
  LUT 1: [RAW decode (3s)] + [LUT apply (0.3s)] = 3.3s
  LUT 2: [RAW decode (3s)] + [LUT apply (0.3s)] = 3.3s
  LUT 3: [RAW decode (3s)] + [LUT apply (0.3s)] = 3.3s
  ...
  60 LUTs × 3.3s = ~3.3 minutes total

With linear cache:
  Initial: [RAW decode once (3s)] → cache handle
  LUT 1:  [cache read + LUT apply (0.3s)]
  LUT 2:  [cache read + LUT apply (0.3s)]
  LUT 3:  [cache read + LUT apply (0.3s)]
  ...
  3s + (60 × 0.3s) = ~21 seconds total — 9× faster
```

The exposure metering analysis (Section 4) also reads from the same cached buffer, so the EV value used to normalize all 60 thumbnails is computed from the same data without any additional decode overhead.

### Two-Level Persistence

The cache operates at two levels:

**In-memory cache:** Generated thumbnail images — rendered to PNG at approximately 750px maximum dimension — are held in a keyed in-memory store indexed by RAW file basename and LUT identifier. A cache hit here is instantaneous: the thumbnail bytes are already in RAM and are handed directly to the display layer without any I/O or processing.

**On-disk cache:** Generated thumbnails are also written to the application's temporary directory in a folder hierarchy organized by RAW file basename. A disk cache hit requires a file read (fast, typically under 10ms for a 750px PNG) but avoids any processing. Disk cache entries persist across app launches and across sessions, meaning thumbnails generated in a previous session are immediately available the next time the same RAW is opened.

When the user explicitly requests cache regeneration — after a LUT pack update, or after changing the processing parameters for a specific RAW — both cache levels are cleared and the full generation cycle runs again from the linear decode.

### Thumbnail Quality and Sizing

The 750px maximum dimension target was chosen to satisfy three competing constraints simultaneously:

- **Visual fidelity:** 750px is large enough that the LUT's characteristic color rendering, highlight treatment, shadow density, and tonal contrast are clearly visible in the selection grid at 3× retina screen density. A smaller target would make fine differences between similar LUTs indistinguishable.
- **Memory efficiency:** At 750×500 pixels with 4 bytes per pixel as PNG, each thumbnail occupies roughly 300KB in memory. 60 thumbnails for a single RAW image require approximately 18MB — well within the memory budget of current devices without triggering pressure.
- **Retina alignment:** 750px corresponds to 250 logical points at 3× display scale — matching the standard iPhone screen width in landscape for current Pro models — so the thumbnails can be displayed at native resolution without upsampling.

---

## 14. Log Profile System — Data-Driven Per-Manufacturer Calibration

The mathematical relationship between a neutral linear RAW decode and the log signal each manufacturer designed their LUTs to receive is not simple and not universal. Each manufacturer made independent choices about where 18% gray should fall in the log signal, what mathematical shape the log curve should have, how much headroom to allocate for highlights above scene white, and what tonal contrast the mid-range should carry. None of these choices were coordinated across manufacturers. The result is a parameter space that is both complex and highly manufacturer-specific.

Rather than hardcoding these relationships for a fixed set of manufacturers, raw2hdr implements a fully data-driven log profile system. Each supported log format is described by a structured profile containing every parameter needed to characterize the synthetic encoding from linear. Adding support for a new log format requires only defining a new profile — the pipeline that reads and applies profiles is format-agnostic.

### The Parameter Dimensions of a Log Profile

Each profile encodes:

**Exposure scale** — a multiplicative factor applied to linear values before log encoding. This scalar aligns the linear 18% gray value to the position in the log curve where the LUT expects to receive midtone input. Every manufacturer chose a different placement; without this calibration, all LUT outputs would have systematically wrong midtone brightness.

**Log curve shape** — the mathematical parameters that define the specific log OETF for that manufacturer's format. F-Log2, V-Log, L-Log, and Mi-Log each have a different curve shape characterized by different coefficients. The profile stores these coefficients in a form that the log encoding function can apply directly.

**Log midpoint** — the log-encoded value corresponding to 18% gray after the log OETF is applied. This value is the reference around which tonal contrast expansion is performed.

**Contrast scale** — a factor that expands or contracts the tonal range around the log midpoint. Some LUTs expect input that covers the full log range at standard contrast; others expect a compressed or expanded tonal range. The contrast scale calibrates for this.

**Per-channel calibration gains** — three independent multiplicative corrections for red, green, and blue channels that compensate for systematic color balance offsets. These arise because the manufacturer's native decode may apply different per-channel adjustments than Apple's RAW decoder does. Without per-channel calibration, the synthetic log encode may produce output with a systematic color cast relative to the camera's native rendering.

**Saturation scale** — an optional saturation multiplier applied during the post-LUT stage. Some LUT packs, particularly those designed for video grading workflows, produce output with slightly desaturated midtones as a stylistic default. This parameter compensates for that offset when the LUT is applied to still photograph content.

**Output normalization strategy** — a selector controlling how the LUT's output range is mapped to the final signal range. This is discussed in detail below.

**HDR highlight extension gain** — a scale factor that controls the aggressiveness of the logarithmic highlight extension for HDR output. Different LUT aesthetics have different highlight character; a LUT designed for high-key portraiture should extend highlights more gently than a LUT designed for wide-dynamic-range landscapes.

### Output Normalization: Three Strategies

LUTs from different sources embed different assumptions about their output range. A Fujifilm-official LUT produced in professional post-production software is designed with full range normalization built in. A community-authored V-Log LUT may have its black point slightly above true zero or its white point slightly below the maximum. Without normalization, these systematic offsets would cause the processed output to appear systematically lighter, darker, lower-contrast, or higher-contrast than intended.

The profile system supports three normalization strategies:

**Pass-through (no normalization):** The LUT output is used directly without range adjustment. This is appropriate for professionally-authored LUT packs that are already self-normalizing — most manufacturer-official distribution packs (Fujifilm's official F-Log2 pack, Panasonic's official V-Log pack) fall into this category. Applying normalization to already-normalized LUTs would double-correct and introduce systematic errors.

**Endpoint normalization:** The LUT is probed at two known reference points — the log-encoded value corresponding to scene black (zero luminance) and the log-encoded value corresponding to the maximum expected highlight level. The resulting output values at those probe points establish the actual min and max of the LUT's output range. The pipeline then linearly rescales all output values to fill a consistent output range, with a deliberate 5% headroom reserved at the top. This reserved headroom is what the HDR highlight extension step occupies — without it, the extension would push values above the normalized maximum and produce clipping at the top of the SDR range.

Endpoint normalization handles LUTs that have systematic range offsets — a common occurrence with community-authored LUT packs and with manufacturer packs designed for video workflows where the output range conventions differ from photography conventions.

**Midpoint gamma normalization:** This strategy applies endpoint normalization first, and then checks whether the normalized midtone (the log-encoded 18% gray passed through the LUT and normalized) lands at the expected midtone target level. If the normalized midtone is systematically darker or brighter than the target, a power-function correction is applied to bring the midtone into alignment.

This handles a specific class of LUT behavior common with Panasonic V-Log packs: the 18% gray midtone target in V-Log's conventions falls at a different normalized position than Fujifilm's conventions. Without midpoint gamma correction, V-Log LUT output would have a systematically offset midtone that makes photographs appear consistently too bright or too dark even after endpoint normalization.

```
LUT output range scenarios:

Case 1 (manufacturer official, self-normalizing):
  Input 0.0 → LUT → Output 0.0 (true black)
  Input 1.0 → LUT → Output 1.0 (white)
  → No normalization needed; use pass-through

Case 2 (range offset — endpoint normalization):
  Input 0.0 → LUT → Output 0.04 (black not at zero)
  Input 1.0 → LUT → Output 0.92 (white not at ceiling)
  → Rescale: (output - 0.04) / (0.92 - 0.04)
  → 0.95 ceiling preserved for HDR extension headroom

Case 3 (midtone offset — midpoint gamma):
  After endpoint normalization:
  18% gray input → output = 0.38 (should be 0.44 for this profile)
  → Apply gamma: pow(output, log(0.44)/log(0.38))
  → Brings midtone into alignment without affecting endpoints
```

---

## 15. Lens Correction — Radial Distortion and Vignetting in Linear Light

Lens correction in raw2hdr is applied at the linear-light stage of the pipeline — after demosaic but before log encoding, LUT application, or HDR extension. This staging decision is not incidental; it reflects the physical reality of what lens distortions are and where they are mathematically correct to correct.

### Why Linear Light Is the Correct Stage for Lens Correction

Lens optical aberrations — barrel distortion, pincushion distortion, vignetting — are physical phenomena that occur in linear scene luminance space. Vignetting is a multiplicative attenuation of light: the corner of the frame receives less photons than the center because the lens barrel physically blocks off-axis light. The attenuation factor is a function of position only — it has the same multiplier relationship to the true scene luminance at every tonal level.

Correcting vignetting by multiplying by the inverse of the attenuation factor is physically exact only when the signal is in linear light. If the signal has been log-encoded or gamma-encoded, the multiplicative correction in linear light becomes a non-multiplicative operation in the encoded space. Applying it in the encoded space introduces systematic tonal errors — the correction is wrong for highlights and wrong for shadows relative to the linear case.

Geometric distortion correction involves remapping pixel positions. A pixel that was displaced by barrel distortion to position (x', y') needs to be sampled from position (x, y) in the source buffer. This remapping is a geometric operation that is independent of tonal encoding — it can be applied at any stage. But doing it in linear light means the subsequent bilinear interpolation between neighboring pixels is performed in a physically meaningful radiometric space: averaging two neighboring linear values produces the physically correct intermediate value. Averaging two neighboring gamma-encoded or log-encoded values produces a value that is systematically different from the physically correct interpolation, by an amount that grows with the local gradient.

### Radial Distortion Correction

All photographic lenses exhibit some degree of radial distortion: the scale of the image changes as a function of distance from the optical axis. Barrel distortion (more scale at the center than at the edges) is characteristic of wide-angle lenses, zoom lenses at their shortest focal lengths, and most smartphone lenses. Pincushion distortion (more scale at the edges than the center) is characteristic of telephoto lenses. Moderate zoom lenses often show complex distortion that is barrel-type at short focal lengths and pincushion at long, with a "wavy" or "mustache" distortion characteristic of some ranges.

The correction is applied as an inverse warp: for each pixel position in the output image, compute the corresponding position in the source (undistorted) image, and sample that position using bilinear interpolation. The inverse direction — output to source, not source to output — is necessary to avoid holes in the corrected image (every output pixel has exactly one source sample; the forward direction would leave some output pixels with no source mapping).

The mathematical model used — a polynomial radial model with three to four coefficients — is the standard model employed by the Lensfun open database, which provides the distortion coefficients for thousands of lens-camera combinations. The correction polynomial is applied in normalized image coordinates, making it independent of image resolution and correctly applicable at any output scale.

### Vignetting Correction

Natural vignetting produces a characteristic circular darkening centered on the optical axis, with the darkening increasing monotonically toward the corners. The profile of the falloff varies with lens design, aperture, and focal length.

The correction is a multiplicative brightening applied in polar-coordinate space: for each pixel, compute its distance from the image center normalized to the half-diagonal, evaluate the correction polynomial at that radius, and multiply the pixel value by the correction factor. The correction is the reciprocal of the vignetting attenuation function, so applying it in linear light exactly restores the true scene luminance at each position.

The polynomial model for vignetting (typically a fourth- or sixth-order polynomial in radial distance) is also sourced from the Lensfun database. The higher-order polynomial allows the correction to accurately model lenses that have a complex vignetting profile — for example, lenses that vignette moderately at the edges but sharply at the extreme corners due to mechanical vignetting at the lens mount.

Because vignetting correction increases the brightness of corner and edge pixels, it must be applied before HDR encoding to ensure that the recovered highlight values in those regions are correctly placed in the HDR signal range. A corner sky pixel that was 10% darker than the center due to vignetting, when corrected in linear light, may now have a scene-linear value above SDR white — the same highlight extension path that the rest of the sky went through. If vignetting correction were applied after HDR encoding, that pixel would have been incorrectly encoded at the vignetting-darkened level and the correction would attempt to brighten an already-encoded value in HLG space, producing an incorrect and visually inconsistent result.

### GPU Acceleration

Both corrections are executed on the GPU rather than the CPU. The geometric distortion warp (a per-pixel coordinate transformation followed by bilinear sampling) and the vignetting correction (a per-pixel multiplicative factor) are both well-suited to GPU execution — they have no inter-pixel dependencies and parallelise trivially across the millions of pixels in a full-resolution RAW image. The platform's GPU image processing pipeline provides the kernel execution environment; the corrections run as shader programs that operate on the linear half-float pixel buffer in parallel.

---

## Summary: What Makes This Architecture Novel

The core thesis underlying every design decision in raw2hdr is a single principle: **normalize all RAW formats to a manufacturer-agnostic linear-light baseline at the earliest possible stage, and maintain floating-point precision throughout the entire pipeline until the final output file is written.**

This principle cascades into consequences at every level:

**Because all cameras decode to the same linear baseline** — one LUT application pipeline serves every manufacturer. A single synthetic log encoding system, calibrated per manufacturer, enables any LUT to be applied to any RAW regardless of what camera produced it.

**Because the pipeline never leaves floating-point precision** — HDR headroom is always recoverable. Scene luminance above SDR white is never discarded; it is carried through the pipeline alongside the LUT rendering and extended into HLG signal range at the output stage.

**Because lens correction runs in linear light** — the corrections are physically exact, the geometry and HDR extension are spatially consistent, and there is no pipeline-mismatch artifact of the kind that afflicts SOOC JPEG + gain map workflows.

**Because compositing happens in the same floating-point HDR context as the image** — decorative elements do not degrade dynamic range. Borders, text, logos, and effects are HDR-native, not 8-bit overlays that strip the output of its extended tonal information.

**Because creative effects are applied to the HLG-encoded buffer** — they operate in a perceptually uniform signal space where tonal precision is consistent from shadows through highlights, and where effect elements can exceed SDR white to represent physically accurate overexposed qualities.

**Because the HLG transfer function is self-describing** — no external metadata is required for correct rendering across the full range of display capabilities, from SDR phones to ProDisplay XDR.

**Because exposure metering mirrors physical center-weighted camera metering** — LUT previews are calibrated to a consistent exposure reference, making 60+ thumbnails visually comparable on a single grid.

**Because the thumbnail cache decodes the RAW once and reuses the buffer** — the full set of LUT previews is generated in the time it would naively take to run a single full pipeline, maintaining responsiveness as a first-class feature.

The result is an application where any RAW file from any supported camera can be processed with any supported LUT from any manufacturer, decorated with HDR-native creative effects and frame designs, and exported as a self-contained HDR HEIC image — with no stage in the pipeline knowing or caring about camera brand, and with no stage compromising the dynamic range the RAW sensor originally captured.
