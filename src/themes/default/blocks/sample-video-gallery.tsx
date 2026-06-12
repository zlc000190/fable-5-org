'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Play, Wand2 } from 'lucide-react';

import { SAMPLE_VIDEOS, FEATURED_WORKFLOW_DEMO } from '@/shared/components/video/sample-videos';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface SampleVideoGalleryProps {
  className?: string;
}

/**
 * Landing-page demo — modelled after seedream4-video's animate flow:
 *
 *   ┌─────────────────┐  ┌─────────────────┐
 *   │  Start Image    │  │  Output Video   │
 *   │  (placeholder)  │  │  (autoplay)     │
 *   └─────────────────┘  └─────────────────┘
 *
 *   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
 *   │ mp4  │ │ mp4  │ │ mp4  │ │ mp4  │ │ mp4  │ │ mp4  │
 *   └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
 *
 * Click any sample tile → both the input image and the output video swap to
 * that sample. The strip below is the navigation; the pair above is the
 * preview. No featured/special slot — the active sample IS what's shown.
 */
export function SampleVideoGallery({ className }: SampleVideoGalleryProps) {
  const [activeId, setActiveId] = useState<string>(FEATURED_WORKFLOW_DEMO.id);
  const active = SAMPLE_VIDEOS.find((s) => s.id === activeId) ?? FEATURED_WORKFLOW_DEMO;

  const videoRef = useRef<HTMLVideoElement>(null);

  // Restart the preview video when the selection changes so the swap is
  // visually obvious instead of waiting for the previous clip to finish.
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    void videoRef.current.play().catch(() => {});
  }, [activeId]);

  const handlePickSample = (id: string) => {
    setActiveId(id);
  };

  const handleLoadInGenerator = () => {
    window.location.href = `/animate?sample=${encodeURIComponent(active.id)}`;
  };

  return (
    <section
      id="sample-videos"
      className={cn('relative w-full py-16 md:py-24', className)}
    >
      <div className="container px-4">
        <motion.div
          className="mx-auto mb-10 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 inline-block rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-xs uppercase tracking-widest text-teal-100">
            Live demo — Hailuo image-to-video
          </p>
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
            Image in. Cinematic video out.
          </h2>
          <p className="text-base text-white/60">
            Pick a sample below — the start image and the generated video
            update together so you see the full input → output flow.
          </p>
        </motion.div>

        {/* Image ⇄ Video pair — mirrors seedream4-video's animate layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          {/* Left: input image (the user-uploaded start frame) */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
            {active.originalImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={active.id + '-img'}
                src={active.originalImage}
                alt={active.prompt}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/40">
                <ImageIcon className="h-12 w-12" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4">
              <p className="mb-1 text-[10px] uppercase tracking-widest text-white/50">
                Start image
              </p>
              <p className="line-clamp-2 text-sm text-white/85">
                {active.prompt}
              </p>
            </div>
            <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/70 backdrop-blur-sm">
              <ImageIcon className="h-3 w-3" />
              Input
            </div>
          </div>

          {/* Right: generated video preview */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-teal-300/30 bg-black">
            <video
              key={active.id + '-vid'}
              ref={videoRef}
              className="h-full w-full object-cover"
              src={active.videoUrl}
              poster={active.posterUrl}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              controls
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4">
              <p className="mb-1 text-[10px] uppercase tracking-widest text-teal-200">
                Output — generated by Hailuo
              </p>
              <p className="line-clamp-2 text-sm text-white/85">
                {active.prompt}
              </p>
            </div>
            <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-teal-300/20 px-2.5 py-1 text-[10px] uppercase tracking-wider text-teal-100 backdrop-blur-sm">
              <Play className="h-3 w-3 fill-current" />
              Output
            </div>
          </div>
        </div>

        {/* CTA under the pair: load this sample into the actual generator */}
        <div className="mt-5 flex flex-col items-center gap-3">
          <Button
            onClick={handleLoadInGenerator}
            className="h-11 rounded-full bg-teal-300 px-6 text-sm font-semibold text-zinc-950 transition hover:bg-teal-200"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Use this prompt + image in the generator
          </Button>
          <p className="max-w-xl text-center text-xs text-white/40">
            Independent project. Not affiliated with Hailuo AI, MiniMax,
            海螺, or any similarly named organization. Clips shown are sample
            output for product preview only.
          </p>
        </div>

        {/* Sample strip — pick any to swap the pair above */}
        <div className="mt-10">
          <p className="mb-4 text-center text-xs uppercase tracking-widest text-white/40">
            Try another sample
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {SAMPLE_VIDEOS.map((sample) => {
              const isActive = sample.id === active.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handlePickSample(sample.id)}
                  className={cn(
                    'group relative aspect-video w-full overflow-hidden rounded-lg border bg-black transition',
                    isActive
                      ? 'border-teal-300 ring-2 ring-teal-300/40'
                      : 'border-white/10 hover:border-white/30'
                  )}
                  title={sample.prompt}
                >
                  <video
                    className="h-full w-full object-cover"
                    src={sample.videoUrl}
                    poster={sample.posterUrl}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="none"
                  />
                  {isActive && (
                    <div className="pointer-events-none absolute inset-0 bg-teal-300/10" />
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                    <p className="line-clamp-2 text-[10px] text-white/85">
                      {sample.prompt}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SampleVideoGallery;