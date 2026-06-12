'use client'

import { Bot, Check, ChevronDown } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/shared/lib/utils'
import { MODEL_CONFIGS } from '@/config/model-config'
import { useTranslations } from 'next-intl'

interface ModelSelectProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
  className?: string
  variant?: 'default' | 'transparent'
}

export default function ModelSelect({
  selectedModel,
  onModelChange,
  className,
  variant = 'default',
}: ModelSelectProps) {
  const t = useTranslations('video.hero_input.models')
  // Get models from MODEL_CONFIGS
  const models = Object.values(MODEL_CONFIGS)

  // Create SVG icon component for video models
  const VideoModelIcon = ({
    iconSrc,
    iconName,
  }: {
    iconSrc: string
    iconName: string
  }) => (
    <img
      src={iconSrc}
      alt={iconName}
      className="h-4"
      onError={(e) => {
        // Fallback to a simple colored circle if SVG fails to load
        const target = e.target as HTMLImageElement
        target.style.display = 'none'
        const fallback = target.nextElementSibling as HTMLElement
        if (fallback) fallback.style.display = 'flex'
      }}
    />
  )

  const FallbackIcon = ({ iconName }: { iconName: string }) => (
    <div
      className="w-4 h-4 rounded-sm bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold"
      style={{ display: 'none' }}
    >
      {iconName.charAt(0).toUpperCase()}
    </div>
  )

  const MODEL_ICONS: Record<string, React.ReactNode> = models.reduce(
    (acc, model) => {
      acc[model.id] = (
        <div className="relative w-4 h-4">
          <VideoModelIcon iconSrc={model.img} iconName={model.name} />
          <FallbackIcon iconName={model.name} />
        </div>
      )
      return acc
    },
    {} as Record<string, React.ReactNode>
  )

  const buttonStyles = {
    default:
      'flex items-center gap-2 h-10 px-3 text-sm rounded-lg hover:bg-accent focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary border',
    transparent:
      'flex items-center gap-2 h-10 px-3 text-sm rounded-lg text-white hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary border border-white/20',
  }

  const dropdownStyles = {
    default: cn('min-w-[12rem]', 'border backdrop-blur-xl'),
    transparent: cn(
      'min-w-[12rem]',
      'border-white/20 backdrop-blur-xl',
      'bg-black/80 dark:bg-black/80'
    ),
  }

  const itemStyles = {
    default: 'flex items-center justify-between gap-2 hover:bg-accent',
    transparent:
      'flex items-center justify-between gap-2 text-white hover:bg-white/10',
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(buttonStyles[variant], className)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedModel}
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 5,
              }}
              transition={{
                duration: 0.15,
              }}
              className="flex items-center gap-2"
            >
              {MODEL_ICONS[selectedModel]}
              {(() => {
                try {
                  return t(`${selectedModel}`)
                } catch (e) {
                  return models.find((m) => m.id === selectedModel)?.name || selectedModel
                }
              })()}
              <ChevronDown className="w-4 h-4 opacity-70" />
            </motion.div>
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={dropdownStyles[variant]}>
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onSelect={() => onModelChange(model.id)}
            className={itemStyles[variant]}
          >
            <div className="flex items-center gap-2">
              {MODEL_ICONS[model.id] || <Bot className="w-4 h-4 opacity-50" />}
              <span>{(() => {
                try {
                  return t(`${model.id}`)
                } catch (e) {
                  return model.name
                }
              })()}</span>
            </div>
            {selectedModel === model.id && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
