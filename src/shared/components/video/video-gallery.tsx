'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';

import { Play } from 'lucide-react';

import { getVideoListErrorMessage, isVideoListSuccess } from './utils';
import VideoCard, { GeneratedVideo } from './video-card';
import { SAMPLE_VIDEOS } from './sample-videos';

interface VideoGalleryProps {
  onVideoSelect?: (video: GeneratedVideo) => void;
  /** Only show image-to-video samples (those with a source image) so every
   *  clicked sample swaps in a matching start image. Used on /animate and the
   *  homepage Studio "Animate Image" card. */
  imageToVideoOnly?: boolean;
}

function SampleGallery({
  onSelect,
  emptyTitle,
  emptySubtitle,
  imageToVideoOnly = false,
}: {
  onSelect?: (video: GeneratedVideo) => void;
  emptyTitle: string;
  emptySubtitle: string;
  imageToVideoOnly?: boolean;
}) {
  const samples = imageToVideoOnly
    ? SAMPLE_VIDEOS.filter((s) => !!s.originalImage)
    : SAMPLE_VIDEOS;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
        <h3 className="text-lg font-medium text-white">{emptyTitle}</h3>
        <p className="mt-1 text-sm text-white/60">{emptySubtitle}</p>
      </div>
      <div className="text-xs uppercase tracking-wider text-white/50">
        Examples to inspire you
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {samples.map((sample) => {
          const demoVideo: GeneratedVideo = {
            id: sample.id,
            prompt: sample.prompt,
            model: sample.model,
            parameters: {},
            status: 'completed',
            videoUrl: sample.videoUrl,
            // Carry the sample's source image so clicking it updates the form's
            // start image (top), keeping the input image ↔ output video paired.
            startImageUrl: sample.originalImage,
            thumbnailUrl: sample.posterUrl,
            createdAt: new Date(),
          };
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelect?.(demoVideo)}
              className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black text-left transition hover:border-white/30"
              title={sample.prompt}
            >
              <video
                className="h-full w-full object-cover"
                src={sample.videoUrl}
                poster={sample.posterUrl}
                muted
                loop
                playsInline
                preload="none"
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  if (el.preload === 'none') el.preload = 'metadata';
                  void el.play().catch(() => {});
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-90">
                <p className="line-clamp-2 text-[11px] leading-snug text-white/90">
                  {sample.prompt}
                </p>
                <Play className="h-4 w-4 shrink-0 text-white/80" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function VideoGallery({
  onVideoSelect,
  imageToVideoOnly = false,
}: VideoGalleryProps) {
  const t = useTranslations('video.text_to_video.gallery');
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchVideos = async (pageToFetch: number) => {
    try {
      if (pageToFetch === 1) setLoading(true);

      const response = await fetch('/api/video/my-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pageToFetch, limit: 12 }),
      });

      const result = await response.json();
      if (!response.ok || !isVideoListSuccess(result)) {
        throw new Error(getVideoListErrorMessage(result));
      }

      if (pageToFetch === 1) {
        setVideos(result.data.videos);
      } else {
        setVideos((prev) => [...prev, ...result.data.videos]);
      }
      setHasMore(result.data.hasNextPage);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(nextPage);
  };

  const handleVideoDeleted = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  if (loading && page === 1) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <SampleGallery
        onSelect={onVideoSelect}
        emptyTitle={t('empty_title')}
        emptySubtitle={t('empty_subtitle')}
        imageToVideoOnly={imageToVideoOnly}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{t('title')}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onVideoSelect={onVideoSelect}
            enableNavigation={!onVideoSelect}
            onVideoDeleted={handleVideoDeleted}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="text-white border-white/20 hover:bg-white/10"
          >
            {t('more')}
          </Button>
        </div>
      )}
    </div>
  );
}
