'use client'
import { IconArrowNarrowRight } from '@tabler/icons-react'
import { useState, useRef, useId, useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { Button } from '@/shared/components/ui/button'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/shared/components/ui/resizable'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/shared/components/ui/carousel'
import { cn, handlePromptClick } from '@/shared/lib/utils'
import Image from 'next/image'
import { Link } from '@/core/i18n/navigation'
import Icon from '@/shared/components/icon'

interface ImageToVideoSlideData {
  prompt: string
  originalImage: string
  videoSrc: string
  url?: string
  target?: string
}

interface ImageToVideoShowcaseProps {
  slides: ImageToVideoSlideData[]
  section: any
}

export function ImageToVideoShowcase({
  slides,
  section,
}: ImageToVideoShowcaseProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Handle carousel API and current slide tracking
  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Handle video autoplay when slide changes
  useEffect(() => {
    const currentVideo = videoRefs.current[current]
    if (currentVideo) {
      currentVideo.play().catch(() => {
        // Autoplay failed, which is expected in some browsers
      })
    }
  }, [current])

  const scrollToHeroInput = () => {
    const heroInputElement = document.getElementById('hero-input')
    if (heroInputElement) {
      heroInputElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  const id = useId()

  if (!slides.length) return null

  return (
    <div
      className="relative w-full max-w-6xl mx-auto"
      aria-labelledby={`image-to-video-showcase-heading-${id}`}
    >
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="p-4">
                <ResizablePanelGroup
                  direction="horizontal"
                  className="h-full"
                >
                  {/* Panel Group for Two and Three */}
                  <ResizablePanel defaultSize={35} minSize={30}>
                    <ResizablePanelGroup
                      direction="vertical"
                      className="h-full"
                    >
                      {/* Panel Two - Original Image */}
                      <ResizablePanel defaultSize={60} minSize={40}>
                        <div className="h-full bg-gray-900 rounded-2xl p-6 flex flex-col">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                            <span className="text-sm text-gray-400 font-medium">
                              Original image
                            </span>
                          </div>
                          <div className="flex-1 flex items-center justify-center min-h-0">
                            <div className="relative w-full h-full">
                              {slide.originalImage ? (
                                <Image
                                  src={slide.originalImage}
                                  alt={slide.prompt}
                                  fill
                                  unoptimized
                                  className="object-contain rounded-lg"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600 font-medium text-sm">
                                  No image
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </ResizablePanel>
                      <ResizableHandle className="h-4 bg-transparent" />
                      {/* Panel Three - Prompt */}
                      <ResizablePanel defaultSize={40} minSize={20}>
                        <div className="h-full bg-gray-900 rounded-2xl p-6 flex flex-col">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                            <span className="text-sm text-gray-400 font-medium">
                              Prompt
                            </span>
                          </div>
                          <div className="flex-1 flex items-start">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p
                                  className="text-white/90 text-sm leading-relaxed cursor-pointer hover:text-white transition-colors"
                                  onClick={() =>
                                    handlePromptClick(slide.prompt)
                                  }
                                >
                                  {slide.prompt}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click to use this prompt</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </ResizablePanel>
                  <ResizableHandle className="w-4 bg-transparent" />
                  {/* Panel One - Video (Right side) */}
                  <ResizablePanel defaultSize={65} minSize={50}>
                    <div className="h-full bg-gray-900 rounded-2xl p-6 flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-sm text-gray-400 font-medium">
                          Video
                        </span>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="relative w-full h-full max-w-full max-h-full">
                          <video
                            ref={(el) => {
                              videoRefs.current[index] = el
                            }}
                            className="w-full h-full object-contain rounded-lg"
                            src={slide.videoSrc}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            style={{ maxHeight: '500px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Controls with Slide Indicators */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          className="rotate-180 rounded-full bg-transparent border-white/20 text-white hover:bg-white/10"
          title="Go to previous example"
          onClick={() => api?.scrollPrev()}
          variant="outline"
          size="icon"
        >
          <IconArrowNarrowRight className="text-white" />
        </Button>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                index === current
                  ? 'bg-primary w-6'
                  : 'bg-gray-600 hover:bg-gray-500'
              )}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>

        <Button
          title="Go to next example"
          className="rounded-full bg-transparent border-white/20 text-white hover:bg-white/10"
          onClick={() => api?.scrollNext()}
          variant="outline"
          size="icon"
        >
          <IconArrowNarrowRight className="text-white" />
        </Button>
      </div>

      {/* CTA Button */}
      {section.imageToVideo?.buttons && (
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          {section.imageToVideo.buttons.map((item: any, idx: number) => (
            <Button key={idx} variant={item.variant || 'default'} size="lg" className="rounded-full" asChild>
              <Link
                href={item.url || ''}
                target={item.target}
                className="flex items-center justify-center gap-1"
              >
                <span className="flex items-center justify-center gap-1">
                  {item.title}
                  {item.icon && (
                    <Icon name={item.icon as string} className="size-6" />
                  )}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
