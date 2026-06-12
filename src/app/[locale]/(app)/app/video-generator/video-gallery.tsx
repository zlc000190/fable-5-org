'use client'

import { useState, useEffect } from 'react'
import { Play, ChevronRight, RefreshCw, Video } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import VideoCard, { GeneratedVideo } from '@/shared/components/blocks/video-card'
import {
  getVideoListErrorMessage,
  isVideoListSuccess,
} from '@/shared/components/video/utils'
import { useRouter } from 'next/navigation'

interface VideoGalleryProps {
  onVideoSelect?: (video: GeneratedVideo) => void
  refreshTrigger?: number // 用于触发刷新
  enableNavigation?: boolean // 是否启用路由跳转
}

export default function VideoGallery({
  onVideoSelect,
  refreshTrigger,
  enableNavigation = true,
}: VideoGalleryProps) {
  const [videos, setVideos] = useState<GeneratedVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 获取视频历史记录
  const fetchVideoHistory = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/video/my-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: 1,
          limit: 10,
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(getVideoListErrorMessage(result))
      }

      if (isVideoListSuccess(result)) {
        // 过滤掉generating和pending状态的视频，只显示completed和failed的视频
        const filteredVideos = (result.data.videos || [])
          .filter(
            (video: any) =>
              video.status === 'completed' || video.status === 'failed'
          )
          .map((video: any) => ({
            ...video,
            // 确保 parameters 是对象格式
            parameters: video.parameters
              ? typeof video.parameters === 'string'
                ? JSON.parse(video.parameters)
                : video.parameters
              : {},
            createdAt: new Date(video.created_at || video.createdAt),
        }))
        setVideos(filteredVideos)
      } else {
        throw new Error(getVideoListErrorMessage(result))
      }
    } catch (error) {
      console.error('Error fetching video history:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  // 初始加载和刷新触发
  useEffect(() => {
    fetchVideoHistory()
  }, [refreshTrigger])

  // 视频操作处理函数
  const handleDelete = async (videoId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        // 临时从本地状态中移除
        setVideos((prev) => prev.filter((v) => v.id !== videoId))
      } catch (error) {
        console.error('Failed to delete video:', error)
        alert('Failed to delete video')
      }
    }
  }

  return (
    <div className="backdrop-blur-xl bg-black/20 dark:bg-white/10 border border-white/20 rounded-2xl px-6 py-4 shadow-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center font-bold">
          <Video className="w-5 inline mr-2" />
          My Videos
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={fetchVideoHistory}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
            disabled={loading}
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>

          {videos.length >= 3 && (
            <Button
              onClick={() => router.push('/app/my-videos')}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              More
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.slice(0, 4).map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onVideoSelect={onVideoSelect}
            onVideoDeleted={handleDelete}
            enableNavigation={enableNavigation}
          />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading videos...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠</span>
          </div>
          <p className="text-red-400 text-lg mb-2">Failed to load videos</p>
          <p className="text-white/40 text-sm mb-4">{error}</p>
          <Button
            onClick={fetchVideoHistory}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && videos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-white/60" />
          </div>
          <p className="text-white/60 text-lg mb-2">No videos yet</p>
          <p className="text-white/40 text-sm">
            Generate your first video to see your history
          </p>
        </div>
      )}
    </div>
  )
}
