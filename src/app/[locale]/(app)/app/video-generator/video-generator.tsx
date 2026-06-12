'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import VideoGenerationForm from './video-generation-form'
import VideoPreview from './video-preview'
import { WandSparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useVideoPolling } from './hooks/useVideoPolling'
import { GeneratedVideo } from '@/shared/components/blocks/video-card'
import { useUrlParams } from './hooks/useUrlParams'

import { useTranslations } from 'next-intl'

interface TextToVideoGeneratorProps {
  initialVideo?: GeneratedVideo | null
  isNewGeneration?: boolean
}

export default function TextToVideoGenerator({
  initialVideo,
  isNewGeneration = false,
}: TextToVideoGeneratorProps) {
  const t = useTranslations('video.hero_input')
  const [currentVideo, setCurrentVideo] = useState<GeneratedVideo | null>(
    initialVideo || null
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState('')
  const router = useRouter()
  const hasAutoTriggered = useRef(false)
  const [formPrompt, setFormPrompt] = useState('')

  const { removeParam } = useUrlParams()

  // 使用轮询 hook
  const { startPolling, stopPolling } = useVideoPolling({
    onCompleted: (completedVideo) => {
      setCurrentVideo(completedVideo)
      setIsGenerating(false)
      setGenerationProgress('')
    },
    onFailed: (error) => {
      setCurrentVideo((prev) => (prev ? { ...prev, status: 'failed' } : null))
      setIsGenerating(false)
      setGenerationProgress('')
    },
    onProgressUpdate: (message) => {
      setGenerationProgress(message)
    },
  })

  // 当initialVideo变化时更新currentVideo
  useEffect(() => {
    if (initialVideo) {
      setCurrentVideo(initialVideo)
    }
  }, [initialVideo])

  // Clear formPrompt after it's been used
  useEffect(() => {
    if (formPrompt) {
      // Clear after a short delay to ensure the form has processed it
      const timer = setTimeout(() => {
        setFormPrompt('')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [formPrompt])

  // 智能状态检测和处理
  useEffect(() => {
    if (initialVideo && !hasAutoTriggered.current) {
      hasAutoTriggered.current = true

      // 检查是否需要触发新生成
      const shouldGenerate =
        isNewGeneration || initialVideo.status === 'pending'

      // 立即移除 type=new 参数（如果存在）
      if (isNewGeneration) {
        removeParam('type')
      }

      // 根据视频状态决定行为
      console.log('Processing initial video:', {
        id: initialVideo.id,
        status: initialVideo.status,
        isNewGeneration,
        shouldGenerate,
      })

      switch (initialVideo.status) {
        case 'generating':
          console.log(
            'Video is generating, starting polling...',
            initialVideo.id
          )
          setCurrentVideo(initialVideo)
          setIsGenerating(true)
          startPolling(initialVideo.id)
          break

        case 'completed':
          console.log('Video is already completed:', initialVideo.id)
          setCurrentVideo(initialVideo)
          break

        case 'failed':
          console.log('Video generation failed:', initialVideo.id)
          setCurrentVideo(initialVideo)
          break

        case 'pending':
        default:
          if (shouldGenerate) {
            console.log('Starting new video generation:', initialVideo.id)
            handleVideoGeneration(
              {
                prompt: initialVideo.prompt,
                model: initialVideo.model,
                parameters: initialVideo.parameters,
              },
              initialVideo.id
            )
          } else {
            console.log(
              'Setting initial video without generation:',
              initialVideo.id
            )
            setCurrentVideo(initialVideo)
          }
      }
    }
  }, [initialVideo, isNewGeneration])

  const handleVideoGeneration = async (
    formData: {
      prompt: string
      model: string
      parameters: Record<string, any>
      startImage?: File
    },
    existingVideoId?: string // 可选的现有视频ID
  ) => {
    setIsGenerating(true)

    const newVideo: GeneratedVideo = {
      id: existingVideoId || Date.now().toString(), // 使用现有ID或生成新ID
      prompt: formData.prompt,
      model: formData.model,
      parameters: formData.parameters,
      status: 'generating',
      videoUrl: undefined,
      thumbnailUrl: undefined,
      createdAt: new Date(),
    }

    setCurrentVideo(newVideo)

    try {
      console.log('Starting video generation with:', formData)
      setGenerationProgress('Starting video generation...')

      // Call the video generation API (now with polling built-in)
      let response: Response

      if (formData.startImage) {
        // 有图片时使用 FormData
        const apiFormData = new FormData()
        apiFormData.append('prompt', formData.prompt)
        apiFormData.append('model', formData.model)
        apiFormData.append('parameters', JSON.stringify(formData.parameters))
        apiFormData.append('startImage', formData.startImage)
        if (existingVideoId) {
          apiFormData.append('videoId', existingVideoId)
        }

        response = await fetch('/api/video/ai', {
          method: 'POST',
          body: apiFormData,
        })
      } else {
        // 无图片时使用 JSON
        response = await fetch('/api/video/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: formData.prompt,
            model: formData.model,
            parameters: formData.parameters,
            ...(existingVideoId && { videoId: existingVideoId }),
          }),
        })
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate video')
      }

      if (!result.success) {
        throw new Error(result.error || 'Video generation failed')
      }

      console.log('Video generation result:', result.data)

      // 处理已在生成中的情况
      if (
        result.success &&
        result.data.status === 'generating' &&
        result.data.message
      ) {
        console.log('Video already generating, starting polling...')
        setCurrentVideo((prev) =>
          prev ? { ...prev, status: 'generating' } : null
        )
        startPolling(result.data.id)
        return
      }

      // The API now returns only when generation is complete (succeeded or failed)
      const isSuccess = ['succeeded', 'completed'].includes(result.data.status)
      const finalVideoUrl = result.data.output || result.data.videoUrl

      if (result.success && isSuccess && finalVideoUrl) {
        setGenerationProgress('Video generation completed!')

        const completedVideo: GeneratedVideo = {
          ...newVideo,
          id: result.data.id || newVideo.id, // 使用数据库返回的ID
          status: 'completed',
          videoUrl: finalVideoUrl,
          thumbnailUrl: result.data.thumbnailUrl || '/imgs/placeholder.png',
        }

        console.log('Setting completed video:', {
          id: completedVideo.id,
          status: completedVideo.status,
          videoUrl: completedVideo.videoUrl,
          hasVideoUrl: !!completedVideo.videoUrl,
        })

        setCurrentVideo(completedVideo)

        console.log('Video generation completed:', completedVideo.videoUrl)
        console.log('Current video updated to completed state')
      } else {
        // This should not happen with the new polling API, but handle it just in case
        throw new Error(
          result.data.error || `Unexpected status: ${result.data.status}`
        )
      }
    } catch (error) {
      console.error('Video generation error:', error)

      const failedVideo: GeneratedVideo = {
        ...newVideo,
        status: 'failed',
      }

      setCurrentVideo(failedVideo)

      // You might want to show a toast notification here
      toast(
        `Video generation failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    } finally {
      setIsGenerating(false)
      setGenerationProgress('')
    }
  }

  const handlePromptSelect = (prompt: string) => {
    setFormPrompt(prompt)
  }

  // 组件卸载时清理轮询（由 useVideoPolling hook 处理）
  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-lg font-bold text-white mb-2">
        <WandSparkles className="w-4 h-4 inline mr-2" />
        {t('magic_title')}
      </div>

      <div className="h-[calc(100vh-100px)]  grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Generation Form */}
        <VideoGenerationForm
          onGenerate={handleVideoGeneration}
          isGenerating={isGenerating}
          initialData={
            initialVideo
              ? {
                  prompt: initialVideo.prompt,
                  model: initialVideo.model,
                  parameters: initialVideo.parameters,
                  startImageUrl: initialVideo.startImageUrl,
                }
              : formPrompt
              ? {
                  prompt: formPrompt,
                }
              : undefined
          }
        />

        {/* Right Column - Preview */}
        <VideoPreview
          video={currentVideo}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
          onPromptSelect={handlePromptSelect}
        />
      </div>

      {/* Video Gallery */}
      {/* <div className="mt-4">
        <VideoGallery
          onVideoSelect={setCurrentVideo}
          refreshTrigger={refreshTrigger}
        />
      </div> */}
    </div>
  )
}
