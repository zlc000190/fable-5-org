import { Play, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { downloadVideo } from '@/shared/lib/utils'
import DemoVideo from './demo-video'
import { GeneratedVideo } from '@/shared/components/blocks/video-card'

interface VideoPreviewProps {
  video: GeneratedVideo | null
  isGenerating: boolean
  generationProgress?: string
  onPromptSelect?: (prompt: string) => void
}

export default function VideoPreview({
  video,
  isGenerating,
  generationProgress,
  onPromptSelect,
}: VideoPreviewProps) {
  // 下载处理函数
  const handleDownload = async () => {
    if (video?.videoUrl) {
      try {
        const timestamp = new Date(video.createdAt).toISOString().slice(0, 10)
        const videoName = `${video.model}-${timestamp}-${video.id.slice(0, 8)}`

        await downloadVideo(videoName, video.videoUrl)
      } catch (error) {
        console.error('Download failed:', error)
        alert('Download failed. Please try again.')
      }
    }
  }

  const handleOpenDirect = async () => {
    if (video?.videoUrl) {
      window.open(video.videoUrl, '_blank')
    }
  }

  return (
    <div className="h-full space-y-6 overflow-x-hidden overflow-y-auto scrollbar-hide backdrop-blur-xl bg-black/20 dark:bg-white/10 border border-white/20 rounded-2xl px-6 py-4 shadow-2xl">
      {/* Generated Video Section */}
      {video || isGenerating ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Generated Video</h3>
            {video?.status === 'completed' && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={handleOpenDirect}
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Direct
                </Button>
              </div>
            )}
          </div>

          <div className="aspect-auto bg-black rounded-xl">
            {video?.status === 'failed' ? (
              // Failed State - 优先显示失败状态，停止loading
              <div className="flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-400 text-2xl">⚠</span>
                  </div>
                  <p className="text-red-400 text-lg font-medium mb-2">
                    Generation failed
                  </p>
                  <p className="text-white/60 text-sm">
                    Please try again with a different prompt
                  </p>
                </div>
              </div>
            ) : isGenerating || video?.status === 'generating' ? (
              // Generating State - 只有在非失败状态时才显示loading
              <div className="flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white text-lg font-medium mb-2">
                    Generating your video...
                  </p>
                  <p className="text-white/60 text-sm">
                    {generationProgress || 'This may take a few moments'}
                  </p>
                </div>
              </div>
            ) : video?.status === 'completed' && video.videoUrl ? (
              // Completed State with actual video
              <div>
                <video
                  key={video.videoUrl} // Force re-render when URL changes
                  className="w-full h-full object-cover"
                  controls
                  poster={video.thumbnailUrl}
                  preload="metadata"
                  playsInline
                  onError={(e) => {
                    console.error('Video load error:', e)
                    console.error('Video URL:', video.videoUrl)
                    console.error('Video element:', e.currentTarget)
                  }}
                  onLoadStart={() =>
                    console.log('Video load started:', video.videoUrl)
                  }
                  onCanPlay={() =>
                    console.log('Video can play:', video.videoUrl)
                  }
                  onLoadedMetadata={() => console.log('Video metadata loaded')}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  <source src={video.videoUrl} type="video/webm" />
                  <source src={video.videoUrl} />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : video?.status === 'completed' ? (
              // Completed State with thumbnail and video link
              <div>
                <img
                  src={video.thumbnailUrl || '/imgs/placeholder.png'}
                  alt="Generated video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  {video.videoUrl ? (
                    <div className="text-center">
                      <Button
                        onClick={() => window.open(video.videoUrl, '_blank')}
                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 mb-2"
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </Button>
                      <p className="text-white text-xs">Click to open video</p>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {}}
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              // Empty State
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-white/60" />
                  </div>
                  <p className="text-white/60 text-lg">
                    Your generated video will appear here
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          {video && (
            <div className="mt-4 space-y-2">
              <p className="text-white/80 text-sm line-clamp-2">
                {video.prompt}
              </p>
              <div className="flex items-center gap-4 text-white/60 text-xs">
                <span>Model: {video.model}</span>
                {/* <span>Duration: {video.duration}</span>
                  <span>Resolution: {video.resolution}</span>
                  {video.batchSize > 1 && <span>Batch: {video.batchSize}</span>} */}
              </div>
            </div>
          )}
        </>
      ) : (
        // Demo Video Section
        <DemoVideo onPromptSelect={onPromptSelect || (() => {})} />
      )}
    </div>
  )
}
