export function isVideoListSuccess(result: any) {
  return !!result && !!result.data && (result.success === true || result.code === 0)
}

export function getVideoListErrorMessage(
  result: any,
  fallback = 'Failed to fetch videos'
) {
  return result?.error || result?.message || fallback
}

export function buildVideoSignInHref(callbackUrl = '/video') {
  return `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
}

export function buildAppVideoDetailHref(videoId: string) {
  return `/app/video-generator?id=${encodeURIComponent(videoId)}`
}

export function buildAppMyVideosHref(page = 1) {
  return page > 1
    ? `/app/my-videos?page=${encodeURIComponent(String(page))}`
    : '/app/my-videos'
}

export function getVideoStatusKey(status?: string) {
  switch (status) {
    case 'queued':
    case 'pending':
      return 'pending'
    case 'uploading':
    case 'processing':
    case 'generating':
      return 'generating'
    case 'succeeded':
    case 'completed':
      return 'completed'
    case 'failed':
      return 'failed'
    default:
      return 'pending'
  }
}

export function shouldPollVideos(
  videos: Array<{ status?: string }> | null | undefined
) {
  return !!videos?.some((video) => {
    const status = getVideoStatusKey(video?.status)
    return status === 'pending' || status === 'generating'
  })
}
