'use client'

import { IconArrowNarrowRight } from '@tabler/icons-react'
import { useState, useRef, useId, useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { Button } from '@/shared/components/ui/button'
import { cn, handlePromptClick } from '@/shared/lib/utils'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Icon from '@/shared/components/icon'
import { Section as SectionType } from '@/shared/types/blocks/section'

interface VideoSlideData {
  prompt: string
  src: string
  url?: string
  target?: string
}

interface VideoSlideProps {
  slide: VideoSlideData
  index: number
  current: number
  handleSlideClick: (index: number) => void
}

const VideoSlide = ({
  slide,
  index,
  current,
  handleSlideClick,
}: VideoSlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const xRef = useRef(0)
  const yRef = useRef(0)
  const frameRef = useRef<number>(null)

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return

      const x = xRef.current
      const y = yRef.current

      slideRef.current.style.setProperty('--x', `${x}px`)
      slideRef.current.style.setProperty('--y', `${y}px`)

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  // Handle video autoplay when slide becomes active
  useEffect(() => {
    if (videoRef.current) {
      if (current === index) {
        videoRef.current.play().catch(() => {
          // Autoplay failed, which is expected in some browsers
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [current, index])

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current
    if (!el) return

    const r = el.getBoundingClientRect()
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2))
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2))
  }

  const handleMouseLeave = () => {
    xRef.current = 0
    yRef.current = 0
  }

  const videoLoaded = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    event.currentTarget.style.opacity = '1'
  }

  const { src } = slide

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[50vmin] h-[50vmin] mx-[4vmin] z-10 cursor-pointer"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? 'scale(0.98) rotateX(8deg)'
              : 'scale(1) rotateX(0deg)',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: 'bottom',
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? 'translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)'
                : 'none',
          }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-600 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            src={src}
            onLoadedData={videoLoaded}
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      </li>
    </div>
  )
}

interface TextToVideoControlProps {
  type: string
  title: string
  handleClick: () => void
}

const TextToVideoControl = ({
  type,
  title,
  handleClick,
}: TextToVideoControlProps) => {
  return (
    <Button
      className={cn(type === 'previous' ? 'rotate-180' : '')}
      title={title}
      onClick={handleClick}
      variant="outline"
      size="icon"
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </Button>
  )
}

interface TextToVideoShowcaseProps {
  slides: VideoSlideData[]
  section: SectionType
  showCTA?: boolean
  onPromptClick?: (prompt: string) => void
}

export function TextToVideoShowcase({
  slides,
  section,

  showCTA = true,
  onPromptClick,
}: TextToVideoShowcaseProps) {
  const [current, setCurrent] = useState(1)

  const handlePreviousClick = () => {
    const previous = current - 1
    setCurrent(previous < 0 ? slides.length - 1 : previous)
  }

  const handleNextClick = () => {
    const next = current + 1
    setCurrent(next === slides.length ? 0 : next)
  }

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index)
    }
  }

  const id = useId()

  return (
    <div
      className="relative w-[50vmin] h-[50vmin] mx-auto"
      aria-labelledby={`text-to-video-showcase-heading-${id}`}
    >
      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <VideoSlide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      <div className="absolute top-[calc(100%+1rem)] flex items-center justify-center w-full gap-4">
        <TextToVideoControl
          type="previous"
          title="Go to previous video"
          handleClick={handlePreviousClick}
        />

        {
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex-1 max-w-2xl px-4 py-3 bg-black/80 backdrop-blur-sm rounded-full border border-white/10 cursor-pointer hover:bg-black/90 transition-colors"
                onClick={() => {
                  const prompt = slides[current]?.prompt
                  if (prompt) {
                    if (onPromptClick) {
                      onPromptClick(prompt)
                    } else {
                      handlePromptClick(prompt)
                    }
                  }
                }}
              >
                <p className="text-sm text-white/90 line-clamp-1 leading-relaxed">
                  {slides[current]?.prompt}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to use this prompt</p>
            </TooltipContent>
          </Tooltip>
        }

        <TextToVideoControl
          type="next"
          title="Go to next video"
          handleClick={handleNextClick}
        />
      </div>

      {/* CTA Button */}
      {showCTA && section.textToVideo?.buttons && (
        <div className="absolute top-[calc(100%+6rem)] left-1/2 transform -translate-x-1/2 flex flex-col justify-center gap-4 sm:flex-row">
          {section.textToVideo.buttons.map((item, idx) => (
            <Button key={idx} variant={item.variant || 'default'} size="lg">
              <Link
                href={item.url || ''}
                target={item.target}
                className="flex items-center justify-center gap-1"
              >
                {item.title}
                {item.icon && (
                  <Icon name={item.icon as string} className="size-6" />
                )}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
