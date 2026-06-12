'use client'

import { Clapperboard } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { TextToVideoShowcase } from '@/shared/components/blocks/showcase/text-to-video-showcase'

interface ShowcaseVideoItem {
  prompt: string
  videoSrc: string
}

interface DemoVideoProps {
  onPromptSelect: (prompt: string) => void
}

export default function DemoVideo({ onPromptSelect }: DemoVideoProps) {
  const t = useTranslations('video.text_to_video.preview')
  const showcaseT = useTranslations('pages.index.page.sections.showcase')

  // Get demo video items from showcase configuration
  const showcaseItems = showcaseT.raw(
    'textToVideo.items'
  ) as ShowcaseVideoItem[]

  // Convert showcase items to the format expected by TextToVideoShowcase
  const slides = (showcaseItems || []).map((item) => ({
    prompt: item.prompt,
    src: item.videoSrc,
  }))

  // Create a minimal section object for TextToVideoShowcase
  const section = {
    textToVideo: {
      buttons: [], // No buttons needed for demo carousel
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center font-bold">
          <Clapperboard className="w-5 inline mr-2" />
          {t('demo_video')}
        </div>
      </div>

      {/* Use TextToVideoShowcase with custom props */}
      <TextToVideoShowcase
        slides={slides}
        section={section}
        showCTA={false}
        onPromptClick={onPromptSelect}
      />
    </div>
  )
}
