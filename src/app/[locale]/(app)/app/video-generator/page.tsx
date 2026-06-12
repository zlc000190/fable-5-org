import { getLocale } from 'next-intl/server'
import { redirect } from '@/core/i18n/navigation'
import { getSignUser } from '@/shared/models/user'
import { getVideo } from '@/shared/services/video'
import VideoGenerator from '@/shared/components/video/video-generator'
import { GeneratedVideo } from '@/shared/components/video/video-card'

interface PageProps {
  searchParams: Promise<{
    id?: string
    type?: string
  }>
}

export default async function TextToVideoPage({ searchParams }: PageProps) {
  const user = await getSignUser()
  const userId = user?.id

  if (!userId) {
    redirect({ href: '/sign-in', locale: await getLocale() })
  }

  const params = await searchParams
  let initialVideo: GeneratedVideo | null = null
  const isNewGeneration = params.type === 'new'

  if (params.id) {
    try {
      const result = await getVideo(params.id)

      if (result.success && result.data) {
        if (result.data.userId === userId) {
          const parsedParameters = result.data.parameters
            ? typeof result.data.parameters === 'string'
              ? JSON.parse(result.data.parameters)
              : result.data.parameters
            : {}

          initialVideo = {
            id: result.data.id,
            prompt: result.data.prompt,
            model: result.data.model,
            parameters: parsedParameters,
            videoUrl:
              result.data.videoUrl ||
              result.data.originalVideoUrl ||
              undefined,
            thumbnailUrl: result.data.firstFrameImageUrl || undefined,
            startImageUrl: result.data.startImageUrl || undefined,
            status: result.data.status as any,
            createdAt: result.data.createdAt
              ? new Date(result.data.createdAt)
              : new Date(),
          }
        }
      }
    } catch (error) {
      console.error('Error loading video details:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <VideoGenerator
        initialVideo={initialVideo}
        isNewGeneration={isNewGeneration}
      />
    </div>
  )
}
