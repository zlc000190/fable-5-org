'use client';

import { WandSparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useUrlParams } from '@/app/[locale]/(landing)/video/hooks/useUrlParams';
import { useVideoPolling } from '@/app/[locale]/(landing)/video/hooks/useVideoPolling';

import { GeneratedVideo } from './video-card';
import { getVideoStatusKey } from './utils';
import VideoGallery from './video-gallery';
import VideoGenerationForm from './video-generation-form';
import VideoPreview from './video-preview';

interface VideoGeneratorProps {
  initialVideo?: GeneratedVideo | null;
  isNewGeneration?: boolean;
}

export default function VideoGenerator({
  initialVideo,
  isNewGeneration = false,
}: VideoGeneratorProps) {
  const t = useTranslations('video.text_to_video');
  const tVideo = useTranslations('video');
  const [currentVideo, setCurrentVideo] = useState<GeneratedVideo | null>(
    initialVideo || null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const hasAutoTriggered = useRef(false);

  const { removeParam } = useUrlParams();

  const { startPolling, stopPolling } = useVideoPolling({
    onCompleted: (completedVideo) => {
      setCurrentVideo(completedVideo);
      setIsGenerating(false);
      setGenerationProgress('');
      toast.success(t('polling.completed'));
    },
    onFailed: () => {
      setCurrentVideo((prev) => (prev ? { ...prev, status: 'failed' } : null));
      setIsGenerating(false);
      setGenerationProgress('');
    },
    onProgressUpdate: (message) => {
      setGenerationProgress(message);
    },
  });

  useEffect(() => {
    if (initialVideo) {
      setCurrentVideo(initialVideo);
    }
  }, [initialVideo]);

  useEffect(() => {
    if (initialVideo && !hasAutoTriggered.current) {
      hasAutoTriggered.current = true;

      if (isNewGeneration) {
        removeParam('type');
      }

      const initialStatus = getVideoStatusKey(initialVideo.status);

      if (initialStatus === 'generating') {
        setIsGenerating(true);
        startPolling(initialVideo.id);
      } else if (initialStatus === 'pending' && isNewGeneration) {
        handleVideoGeneration(
          {
            prompt: initialVideo.prompt,
            model: initialVideo.model,
            parameters: initialVideo.parameters,
          },
          initialVideo.id
        );
      }
    }
  }, [initialVideo, isNewGeneration, removeParam, startPolling]);

  const handleVideoGeneration = async (
    formData: {
      prompt: string;
      model: string;
      parameters: Record<string, any>;
      startImage?: File;
    },
    existingVideoId?: string
  ) => {
    const previousVideo = currentVideo;

    setIsGenerating(true);

    const newVideo: GeneratedVideo = {
      id: existingVideoId || Date.now().toString(),
      prompt: formData.prompt,
      model: formData.model,
      parameters: formData.parameters,
      status: 'generating',
      createdAt: new Date(),
    };

    setCurrentVideo(newVideo);

    try {
      let response: Response;

      if (formData.startImage) {
        const apiFormData = new FormData();
        apiFormData.append('prompt', formData.prompt);
        apiFormData.append('model', formData.model);
        apiFormData.append('parameters', JSON.stringify(formData.parameters));
        apiFormData.append('startImage', formData.startImage);
        if (existingVideoId) apiFormData.append('videoId', existingVideoId);

        response = await fetch('/api/video/ai', {
          method: 'POST',
          body: apiFormData,
        });
      } else {
        response = await fetch('/api/video/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: formData.prompt,
            model: formData.model,
            parameters: formData.parameters,
            ...(existingVideoId && { videoId: existingVideoId }),
          }),
        });
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (response.status === 402) {
          const count =
            typeof result.required_credits === 'number' &&
            typeof result.available_credits === 'number'
              ? Math.max(result.required_credits - result.available_credits, 0)
              : null;

          throw new Error(
            count !== null
              ? tVideo('credits.need_more', { count })
              : tVideo('credits.insufficient')
          );
        }

        throw new Error(result.error || t('errors.generate_failed'));
      }

      const status = result.data.status;
      if (status === 'completed' || status === 'succeeded') {
        setCurrentVideo({
          ...newVideo,
          id: result.data.id || newVideo.id,
          videoUrl: result.data.videoUrl || result.data.originalVideoUrl,
          thumbnailUrl: result.data.firstFrameImageUrl,
          startImageUrl: result.data.startImageUrl,
          status: 'completed',
          createdAt: result.data.createdAt ? new Date(result.data.createdAt) : new Date(),
        });
        setIsGenerating(false);
        setGenerationProgress('');
        toast.success(t('polling.completed'));
        return;
      }

      if (
        status === 'generating' ||
        status === 'pending' ||
        status === 'uploading'
      ) {
        startPolling(result.data.id || existingVideoId || newVideo.id);
        return;
      }

      throw new Error(t('errors.generate_failed'));
    } catch (error) {
      console.error('Video generation error:', error);
      setCurrentVideo(previousVideo ?? null);
      toast.error(
        error instanceof Error ? error.message : t('errors.generate_failed')
      );
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-8">
      <div className="flex items-center gap-2 text-xl font-bold text-white">
        <WandSparkles className="w-6 h-6 text-purple-400" />
        {t('title')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
        <VideoGenerationForm
          onGenerate={handleVideoGeneration}
          isGenerating={isGenerating}
          initialData={
            currentVideo
              ? {
                  prompt: currentVideo.prompt,
                  model: currentVideo.model,
                  parameters: currentVideo.parameters,
                  startImageUrl: currentVideo.startImageUrl,
                }
              : undefined
          }
        />

        <VideoPreview
          video={currentVideo}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
        />
      </div>

      <VideoGallery onVideoSelect={setCurrentVideo} />
    </div>
  );
}
