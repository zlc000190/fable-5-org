import { useTranslations } from 'next-intl';
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export function useVideoPolling({
  onCompleted,
  onFailed,
  onProgressUpdate,
  pollingInterval = 3000,
}: {
  onCompleted?: (video: any) => void;
  onFailed?: (error?: string) => void;
  onProgressUpdate?: (message: string) => void;
  pollingInterval?: number;
} = {}) {
  const t = useTranslations('video.text_to_video.polling');
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const startPolling = useCallback(
    (videoId: string) => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      setIsPolling(true);
      onProgressUpdate?.(t('checking'));

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await fetch('/api/video/status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoId }),
          });

          const result = await response.json();

          if (result.success && result.data) {
            const status = result.data.status;

            if (status === 'completed' || status === 'succeeded') {
              const completedVideo = {
                ...result.data,
                parameters:
                  typeof result.data.parameters === 'string'
                    ? JSON.parse(result.data.parameters)
                    : result.data.parameters || {},
                createdAt: result.data.createdAt ? new Date(result.data.createdAt) : new Date(),
              };

              stopPolling();
              onCompleted?.(completedVideo);
            } else if (status === 'failed') {
              stopPolling();
              onFailed?.(t('failed'));
              toast.error(t('failed'));
            } else if (
              status === 'generating' ||
              status === 'pending' ||
              status === 'uploading'
            ) {
              onProgressUpdate?.(t('generating'));
            }
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, pollingInterval);
    },
    [onCompleted, onFailed, onProgressUpdate, pollingInterval, stopPolling, t]
  );

  return {
    isPolling,
    startPolling,
    stopPolling,
  };
}
