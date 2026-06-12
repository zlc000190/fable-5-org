'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/core/auth/client'
import { Link, useRouter } from '@/core/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Video, ChevronLeft, ChevronRight } from 'lucide-react'
import VideoCard, { GeneratedVideo } from '@/shared/components/video/video-card'
import { Button } from '@/shared/components/ui/button'
import {
  buildAppMyVideosHref,
  buildVideoSignInHref,
  getVideoListErrorMessage,
  isVideoListSuccess,
  shouldPollVideos,
} from '@/shared/components/video/utils'
import { toast } from 'sonner'

interface MyVideosResponse {
  videos: GeneratedVideo[]
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function MyVideosPage() {
  const t = useTranslations('video.my_videos')
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [videos, setVideos] = useState<GeneratedVideo[]>([])
  const [totalVideos, setTotalVideos] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPrevPage, setHasPrevPage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentPage = Number.parseInt(searchParams.get('page') || '1', 10) || 1
  const videosPerPage = 8

  useEffect(() => {
    if (isPending) return
    if (!session) {
      router.push(buildVideoSignInHref(buildAppMyVideosHref(currentPage)))
    }
  }, [currentPage, isPending, router, session])

  const fetchVideos = useCallback(
    async (
      page: number = currentPage,
      options?: { background?: boolean; silent?: boolean }
    ) => {
      if (!session?.user) return

      const background = options?.background ?? false
      const silent = options?.silent ?? false

      try {
        if (!background) {
          setLoading(true)
          setError(null)
        }

        const response = await fetch('/api/video/my-videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page,
            limit: videosPerPage,
          }),
        })

        const result = await response.json()

        if (!response.ok || !isVideoListSuccess(result)) {
          throw new Error(getVideoListErrorMessage(result, t('load_failed')))
        }

        const data: MyVideosResponse = result.data
        setVideos(data.videos)
        setTotalVideos(data.totalCount)
        setTotalPages(data.totalPages)
        setHasNextPage(data.hasNextPage)
        setHasPrevPage(data.hasPrevPage)
      } catch (error) {
        console.error('Error loading videos:', error)
        if (!silent) {
          const message =
            error instanceof Error ? error.message : t('load_failed')
          setError(message)
          toast.error(message)
        }
      } finally {
        if (!background) {
          setLoading(false)
        }
      }
    },
    [currentPage, session?.user, t]
  )

  useEffect(() => {
    if (session?.user) {
      fetchVideos(currentPage)
    }
  }, [currentPage, fetchVideos, session?.user])

  useEffect(() => {
    if (!session?.user || !shouldPollVideos(videos)) return

    const intervalId = window.setInterval(() => {
      fetchVideos(currentPage, {
        background: true,
        silent: true,
      })
    }, 3000)

    return () => window.clearInterval(intervalId)
  }, [currentPage, fetchVideos, session?.user, videos])

  const handleVideoDeleted = useCallback(
    (videoId: string) => {
      const targetPage = videos.length === 1 && currentPage > 1
        ? currentPage - 1
        : currentPage

      setVideos((prev) => prev.filter((video) => video.id !== videoId))

      if (targetPage !== currentPage) {
        router.push(buildAppMyVideosHref(targetPage))
        return
      }

      fetchVideos(targetPage, {
        background: true,
        silent: true,
      })
    },
    [currentPage, fetchVideos, router, videos.length]
  )

  if (isPending) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Video className="w-8 h-8 text-white/60" />
            </div>
            <p className="text-white/80 text-lg font-medium">{t('auth_loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <div className="text-lg font-bold text-white mb-2">
            <Video className="w-4 h-4 inline mr-2" />
            {t('title')}
          </div>
          <p className="text-white/60 text-sm">
            {totalVideos > 0 && !error
              ? t('description_with_total', { count: totalVideos })
              : t('description')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Video className="w-8 h-8 text-white/60" />
            </div>
            <p className="text-white/80 text-lg font-medium">{t('loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <p className="text-red-400 text-lg font-medium mb-2">
              {t('load_failed')}
            </p>
            <p className="text-white/60 text-sm mb-4">{error}</p>
            <Button onClick={() => fetchVideos(currentPage)}>{t('retry')}</Button>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-white/60" />
            </div>
            <p className="text-white/80 text-lg font-medium mb-2">
              {t('empty_title')}
            </p>
            <p className="text-white/60 text-sm mb-4">{t('empty_subtitle')}</p>
            <Link href="/app/video-generator">
              <Button>{t('create_video')}</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  enableNavigation
                  onVideoDeleted={handleVideoDeleted}
                />
              ))}
            </div>

            {(hasNextPage || hasPrevPage) && (
              <div className="flex items-center justify-center gap-4">
                {hasPrevPage ? (
                  <Link href={buildAppMyVideosHref(currentPage - 1)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      {t('previous')}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {t('previous')}
                  </Button>
                )}

                <span className="text-white/80 text-sm">
                  {t('page_of', { page: currentPage, total: totalPages })}
                </span>

                {hasNextPage ? (
                  <Link href={buildAppMyVideosHref(currentPage + 1)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                    >
                      {t('next')}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    {t('next')}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
