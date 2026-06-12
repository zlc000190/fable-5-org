'use client';

import { Download, ExternalLink, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { downloadVideo } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';

import { getVideoStatusKey } from './utils';
import { FEATURED_WORKFLOW_DEMO } from './sample-videos';
import { GeneratedVideo } from './video-card';

interface VideoPreviewProps {
  video: GeneratedVideo | null;
  isGenerating: boolean;
  generationProgress?: string;
  onPromptSelect?: (prompt: string) => void;
}

export default function VideoPreview({
  video,
  isGenerating,
  generationProgress,
}: VideoPreviewProps) {
  const t = useTranslations('video.text_to_video.preview');
  const statusKey = getVideoStatusKey(video?.status);

  const handleDownload = async () => {
    if (video?.videoUrl) {
      try {
        const timestamp = new Date(video.createdAt).toISOString().slice(0, 10);
        const videoName = `${video.model}-${timestamp}-${video.id.slice(0, 8)}`;
        await downloadVideo(videoName, video.videoUrl);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };

  const handleOpenDirect = () => {
    if (video?.videoUrl) {
      window.open(video.videoUrl, '_blank');
    }
  };

  return (
    <div className="h-full space-y-6 overflow-x-hidden overflow-y-auto scrollbar-hide backdrop-blur-xl bg-black/20 dark:bg-white/10 border border-white/20 rounded-2xl px-6 py-4 shadow-2xl">
      {video || isGenerating ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">{t('generated_video')}</h3>
            {statusKey === 'completed' && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('download')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={handleOpenDirect}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('open_direct')}
                </Button>
              </div>
            )}
          </div>

          <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
            {statusKey === 'failed' ? (
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400 text-2xl">
                  ⚠
                </div>
                <p className="text-red-400 text-lg font-medium">{t('failed_message')}</p>
                <p className="text-white/60 text-sm">{t('failed_subtitle')}</p>
              </div>
            ) : isGenerating || statusKey === 'generating' || statusKey === 'pending' ? (
              <div className="text-center p-4">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white text-lg font-medium">{t('generating_message')}</p>
                <p className="text-white/60 text-sm">
                  {generationProgress || t('generating_subtitle')}
                </p>
              </div>
            ) : statusKey === 'completed' && video?.videoUrl ? (
              <video
                key={video.videoUrl}
                className="w-full h-full object-contain"
                controls
                poster={video.thumbnailUrl}
                playsInline
              >
                <source src={video.videoUrl} type="video/mp4" />
                {t('unsupported_video')}
              </video>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white/60" />
                </div>
                <p className="text-white/60">{t('empty_message')}</p>
              </div>
            )}
          </div>

          {video && (
            <div className="mt-4 space-y-2">
              <p className="text-white/80 text-sm line-clamp-2">{video.prompt}</p>
              <div className="flex items-center gap-4 text-white/60 text-xs">
                <span>
                  {t('model_label')} {video.model}
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="h-full flex flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-white font-medium">{t('ready_title')}</h3>
            <span className="text-xs text-white/50">Sample preview</span>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-xl bg-black">
            <video
              key={FEATURED_WORKFLOW_DEMO.videoUrl}
              className="h-full w-full object-cover"
              src={FEATURED_WORKFLOW_DEMO.videoUrl}
              poster={FEATURED_WORKFLOW_DEMO.posterUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4">
              <p className="text-sm text-white/90 line-clamp-2">
                {FEATURED_WORKFLOW_DEMO.prompt}
              </p>
              <p className="mt-1 text-xs text-white/60">{t('ready_subtitle')}</p>
            </div>
            <div className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/80">
              Demo
            </div>
            {FEATURED_WORKFLOW_DEMO.originalImage && (
              <div className="pointer-events-none absolute top-3 right-3 flex items-center gap-2 rounded-lg bg-black/60 p-1.5 backdrop-blur-sm">
                <img
                  src={FEATURED_WORKFLOW_DEMO.originalImage}
                  alt="source"
                  className="h-10 w-10 rounded object-cover"
                />
                <div className="pr-2 text-[10px] leading-tight text-white/80">
                  <div className="font-semibold">Source image</div>
                  <div className="opacity-70">animated →</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
