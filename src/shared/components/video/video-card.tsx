'use client';

import {
  Download,
  MoreHorizontal,
  Play,
  Share,
  Trash2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/core/i18n/navigation';
import { toast } from 'sonner';

import { cn, downloadVideo, shareVideo } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { buildAppVideoDetailHref, getVideoStatusKey } from './utils';

export type GeneratedVideoStatus =
  | 'pending'
  | 'generating'
  | 'completed'
  | 'failed';

export interface GeneratedVideo {
  id: string;
  prompt: string;
  model: string;
  parameters: Record<string, any>;
  videoUrl?: string;
  thumbnailUrl?: string;
  startImageUrl?: string;
  status: GeneratedVideoStatus;
  createdAt: Date;
}

interface VideoCardProps {
  video: GeneratedVideo;
  onVideoSelect?: (video: GeneratedVideo) => void;
  onDelete?: (video: GeneratedVideo) => void;
  enableNavigation?: boolean;
  onVideoDeleted?: (videoId: string) => void;
}

export default function VideoCard({
  video,
  onVideoSelect,
  onDelete,
  enableNavigation = true,
  onVideoDeleted,
}: VideoCardProps) {
  const router = useRouter();
  const t = useTranslations('video.text_to_video.gallery');
  const statusKey = getVideoStatusKey(video.status);

  const handleCardClick = () => {
    if (enableNavigation) {
      router.push(buildAppVideoDetailHref(video.id));
    } else if (onVideoSelect) {
      onVideoSelect(video);
    }
  };

  const handleDownload = async () => {
    if (video.videoUrl) {
      try {
        const timestamp = new Date(video.createdAt).toISOString().slice(0, 10);
        const videoName = `${video.model}-${timestamp}-${video.id.slice(0, 8)}`;
        await downloadVideo(videoName, video.videoUrl);
      } catch (error) {
        console.error('Download failed:', error);
        toast.error(t('messages.download_failed'));
      }
    }
  };

  const handleShare = async () => {
    if (video.videoUrl) {
      try {
        await shareVideo(t('messages.share_title'), video.prompt, video.videoUrl);
      } catch (error) {
        console.error('Share failed:', error);
        toast.error(t('messages.share_failed'));
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/video/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: video.id }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || (result?.success !== true && result?.code !== 0)) {
        throw new Error(
          result?.error || result?.message || t('messages.delete_failed')
        );
      }

      toast.success(result?.data?.message || t('messages.delete_success'));
      onVideoDeleted?.(video.id);
      onDelete?.(video);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(
        error instanceof Error ? error.message : t('messages.delete_failed')
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <div className="w-2 h-2 bg-green-400 rounded-full" />;
      case 'failed':
        return <div className="w-2 h-2 bg-red-400 rounded-full" />;
      case 'generating':
        return (
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        );
      case 'pending':
        return <div className="w-2 h-2 bg-blue-400 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'generating':
        return 'text-yellow-400';
      case 'pending':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div
      className="group relative bg-black/40 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-32 bg-gradient-to-br from-purple-900/30 to-pink-900/30">
        {statusKey === 'completed' && video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={t('thumbnail_alt')}
            className="w-full h-full object-contain"
          />
        ) : statusKey === 'failed' ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-red-400 text-sm">⚠ {t('status.failed')}</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white/60" />
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 flex items-center gap-2">
          {getStatusIcon(statusKey)}
          <span className={cn('text-xs font-medium', getStatusColor(statusKey))}>
            {t(`status.${statusKey}`)}
          </span>
        </div>

        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/80 border-white/20 backdrop-blur-xl">
              {statusKey === 'completed' && (
                <>
                  <DropdownMenuItem
                    className="text-white hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('actions.download')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-white hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                  >
                    <Share className="w-4 h-4 mr-2" />
                    {t('actions.share')}
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                className="text-red-400 hover:bg-red-500/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-3">
        <p className="text-white/80 text-sm line-clamp-1 mb-2">{video.prompt}</p>
        <div className="flex items-center justify-between text-white/60 text-xs">
          <span>{video.model}</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
