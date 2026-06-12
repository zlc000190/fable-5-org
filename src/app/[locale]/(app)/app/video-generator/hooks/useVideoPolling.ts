import { GeneratedVideo } from '@/shared/components/blocks/video-card'
import { useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'

interface UseVideoPollingOptions {
  onCompleted?: (video: GeneratedVideo) => void
  onFailed?: (error?: string) => void
  onProgressUpdate?: (message: string) => void
  pollingInterval?: number
}

interface UseVideoPollingReturn {
  isPolling: boolean
  startPolling: (videoId: string) => void
  stopPolling: () => void
}

export function useVideoPolling({
  onCompleted,
  onFailed,
  onProgressUpdate,
  pollingInterval = 3000,
}: UseVideoPollingOptions = {}): UseVideoPollingReturn {
  const [isPolling, setIsPolling] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    setIsPolling(false)
  }, [])

  const startPolling = useCallback(
    (videoId: string) => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }

      setIsPolling(true)
      onProgressUpdate?.('Checking generation status...')

      pollingIntervalRef.current = setInterval(async () => {
        try {
          console.log(`Polling video status for ID: ${videoId}`)

          const response = await fetch('/api/video/status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoId }),
          })

          const result = await response.json()

          if (result.success && result.data) {
            const status = result.data.status

            if (status === 'completed') {
              console.log('Video generation completed via polling')

              // 转换数据格式以匹配前端期望的接口
              const completedVideo: GeneratedVideo = {
                id: result.data.id,
                prompt: result.data.prompt,
                model: result.data.model,
                parameters:
                  typeof result.data.parameters === 'string'
                    ? JSON.parse(result.data.parameters)
                    : result.data.parameters || {},
                videoUrl: result.data.videoUrl || result.data.originalVideoUrl,
                thumbnailUrl: result.data.thumbnailUrl,
                startImageUrl: result.data.startImageUrl,
                status: 'completed',
                createdAt: result.data.createdAt
                  ? new Date(result.data.createdAt)
                  : new Date(),
              }

              stopPolling()
              onCompleted?.(completedVideo)
            } else if (status === 'failed') {
              console.log('Video generation failed via polling')
              stopPolling()
              onFailed?.('Video generation failed')
              toast('Video generation failed')
            } else if (status === 'generating') {
              onProgressUpdate?.('Video is being generated...')
            }
            // 如果还在生成中，继续轮询
          } else {
            console.warn('Polling response missing data:', result)
          }
        } catch (error) {
          console.error('Polling error:', error)
          // 继续轮询，不中断流程
          // 可以选择在连续失败多次后停止轮询
        }
      }, pollingInterval)
    },
    [onCompleted, onFailed, onProgressUpdate, pollingInterval, stopPolling]
  )

  // 清理函数
  const cleanup = useCallback(() => {
    stopPolling()
  }, [stopPolling])

  return {
    isPolling,
    startPolling,
    stopPolling: cleanup,
  }
}
