'use client'

import { Play, MoreHorizontal, Download, Share, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn, downloadVideo, shareVideo } from '@/shared/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export type GeneratedVideoStatus =
  | 'pending'
  | 'generating'
  | 'completed'
  | 'failed'

export interface GeneratedVideo {
  id: string
  prompt: string
  model: string
  parameters: Record<string, any>
  videoUrl?: string
  thumbnailUrl?: string
  startImageUrl?: string
  status: GeneratedVideoStatus
  createdAt: Date
}

interface VideoCardProps {
  video: GeneratedVideo
  onVideoSelect?: (video: GeneratedVideo) => void
  onDelete?: (video: GeneratedVideo) => void
  enableNavigation?: boolean // 是否启用路由跳转
  onVideoDeleted?: (videoId: string) => void // 删除成功后的回调
}

export default function VideoCard({
  video,
  onVideoSelect,
  onDelete,
  enableNavigation = true,
  onVideoDeleted,
}: VideoCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    console.log('enableNavigation: ', enableNavigation)
    if (enableNavigation) {
      router.push(`/app/video-generator?id=${video.id}`)
    } else if (onVideoSelect) {
      onVideoSelect(video)
    }
  }

  const handleDownload = async () => {
    if (video.videoUrl) {
      try {
        // 生成视频文件名，包含模型和时间信息
        const timestamp = new Date(video.createdAt).toISOString().slice(0, 10)
        const videoName = `${video.model}-${timestamp}-${video.id.slice(0, 8)}`

        await downloadVideo(videoName, video.videoUrl)
      } catch (error) {
        console.error('Download failed:', error)
        // 可以在这里添加用户友好的错误提示
        alert('Download failed. Please try again.')
      }
    }
  }

  const handleShare = async () => {
    if (video.videoUrl) {
      try {
        const title = 'Generated Video'
        const text = video.prompt || 'Check out this AI-generated video!'

        await shareVideo(title, text, video.videoUrl)
      } catch (error) {
        console.error('Share failed:', error)
      }
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/video/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: video.id }),
      })

      const result = await response.json()

      if (!response.ok || result.code !== 0) {
        throw new Error(result.message || 'Failed to delete video')
      }

      if (result.code === 0) {
        toast.success(
          result.data?.message || result.message || 'Video deleted successfully'
        )
        // 调用回调函数通知父组件
        onVideoDeleted?.(video.id)
        // 如果有传统的 onDelete 回调，也调用它
        onDelete?.(video)
      } else {
        throw new Error(result.message || 'Failed to delete video')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete video'
      )
    }
  }

  const getStatusColor = (status: GeneratedVideo['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'failed':
        return 'text-red-400'
      case 'generating':
        return 'text-yellow-400'
      case 'pending':
        return 'text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: GeneratedVideo['status']) => {
    switch (status) {
      case 'completed':
        return <div className="w-2 h-2 bg-green-400 rounded-full" />
      case 'failed':
        return <div className="w-2 h-2 bg-red-400 rounded-full" />
      case 'generating':
        return (
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        )
      case 'pending':
        return <div className="w-2 h-2 bg-blue-400 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  return (
    <div
      className="group relative bg-black/40 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <div className="relative h-32 bg-gradient-to-br from-purple-900/30 to-pink-900/30">
        {video.status === 'completed' && video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-full object-contain"
          />
        ) : video.status === 'failed' ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 mt-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-red-400 text-sm">⚠</span>
            </div>
          </div>
        ) : video.status === 'generating' ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 mt-8 bg-yellow-500/20 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : video.status === 'pending' ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 mt-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-blue-400 border-dashed rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 mt-8 bg-white/10 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white/60" />
            </div>
          </div>
        )}

        {/* Play Overlay */}
        {video.status === 'completed' && !enableNavigation && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {getStatusIcon(video.status)}
          <span
            className={cn('text-xs font-medium', getStatusColor(video.status))}
          >
            {video.status}
          </span>
        </div>

        {/* Duration Badge */}
        {video.parameters?.duration && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
            {video.parameters.duration}s
          </div>
        )}

        {/* Actions */}
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
              {video.status === 'completed' && (
                <>
                  <DropdownMenuItem
                    className="text-white hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload()
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-white hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare()
                    }}
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                className="text-red-400 hover:bg-red-500/10"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-3">
        <p className="text-white/80 text-sm line-clamp-1 mb-2">
          {video.prompt}
        </p>
        <div className="flex items-center justify-between text-white/60 text-xs">
          <div className="flex items-center gap-2">
            <span>{video.model}</span>
            {video.parameters?.resolution && (
              <>
                <span>•</span>
                <span>{video.parameters.resolution}</span>
              </>
            )}
            {video.parameters?.batchSize && video.parameters.batchSize > 1 && (
              <>
                <span>•</span>
                <span>x{video.parameters.batchSize}</span>
              </>
            )}
          </div>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}
