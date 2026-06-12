'use client'

import { useState, useEffect } from 'react'
import { CoinsIcon, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useTranslations } from 'next-intl'

interface CreditsDisplayProps {
  requiredCredits: number
  variant?: 'default' | 'transparent'
  className?: string
  onCreditsChange?: (credits: UserCredits | null) => void
  refreshTrigger?: number // 新增：外部触发刷新的计数器
  pricingDescription?: string // 新增：定价描述
}

interface UserCredits {
  remainingCredits: number
  is_pro?: boolean
  is_recharged?: boolean
}

export default function CreditsDisplay({
  requiredCredits,
  variant = 'transparent',
  className,
  onCreditsChange,
  refreshTrigger,
  pricingDescription,
}: CreditsDisplayProps) {
  const t = useTranslations('video.credits')
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserCredits = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/user/get-user-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user credits')
      }

      const result = await response.json()

      if (result.code === 0) {
        setUserCredits(result.data)
        onCreditsChange?.(result.data)
      } else {
        throw new Error(result.message || 'Failed to get user credits')
      }
    } catch (err) {
      console.error('Error fetching user credits:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserCredits()
  }, [])

  // 监听外部刷新触发器
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      fetchUserCredits()
    }
  }, [refreshTrigger])

  const isInsufficientCredits =
    userCredits && userCredits.remainingCredits < requiredCredits
  const remainingAfterGeneration = userCredits
    ? userCredits.remainingCredits - requiredCredits
    : 0

  const containerStyles = {
    default: cn(
      'rounded-lg border bg-card p-4 space-y-3',
      isInsufficientCredits && 'border-destructive/50 bg-destructive/5'
    ),
    transparent: cn(
      'rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm p-4 space-y-3',
      isInsufficientCredits && 'border-red-400/50 bg-red-500/10'
    ),
  }

  const textStyles = {
    default: 'text-foreground',
    transparent: 'text-white',
  }

  const mutedTextStyles = {
    default: 'text-muted-foreground',
    transparent: 'text-white/60',
  }

  if (loading) {
    return (
      <div className={cn(containerStyles[variant], className)}>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className={cn('text-sm', textStyles[variant])}>
            {t('loading')}
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn(containerStyles[variant], className)}>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className={cn('text-sm', textStyles[variant])}>
            Failed to load credits
          </span>
          <button
            onClick={fetchUserCredits}
            className={cn(
              'text-xs underline hover:no-underline',
              variant === 'transparent'
                ? 'text-white/80'
                : 'text-muted-foreground'
            )}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!userCredits) {
    return null
  }

  return (
    <div className={cn(containerStyles[variant], className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CoinsIcon className="w-4 h-4 text-yellow-500" />
          <span className={cn('text-sm font-medium', textStyles[variant])}>
            {t('balance')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {userCredits.is_pro && (
            <span
              className={cn(
                'text-xs px-2 py-1 rounded-full',
                variant === 'transparent'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-green-100 text-green-700 border border-green-200'
              )}
            >
              Pro
            </span>
          )}
          <button
            onClick={fetchUserCredits}
            disabled={loading}
            className={cn(
              'p-1 rounded-md transition-colors',
              variant === 'transparent'
                ? 'hover:bg-white/10 text-white/60 hover:text-white/80'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            )}
            title="Refresh credits"
          >
            <RefreshCw className={cn('w-3 h-3', loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Credits Info */}
      <div className="space-y-2">
        {/* Current Credits */}
        <div className="flex items-center justify-between">
          <span className={cn('text-sm', mutedTextStyles[variant])}>
            {t('balance')}:
          </span>
          <span
            className={cn(
              'text-sm font-medium',
              textStyles[variant],
              isInsufficientCredits && 'text-destructive'
            )}
          >
            {userCredits.remainingCredits}
          </span>
        </div>

        {/* Required Credits */}
        <div className="flex items-center justify-between">
          <span className={cn('text-sm', mutedTextStyles[variant])}>
            {t('required')}:
          </span>
          <span className={cn('text-sm font-medium', textStyles[variant])}>
            -{requiredCredits}
          </span>
        </div>

        {/* Pricing Description */}
        {pricingDescription && (
          <div className="space-y-1">
            <span className={cn('text-xs', mutedTextStyles[variant])}>
              Pricing:
            </span>
            <p
              className={cn(
                'text-xs leading-relaxed',
                mutedTextStyles[variant]
              )}
            >
              {pricingDescription}
            </p>
          </div>
        )}

        {/* Divider */}
        <div
          className={cn(
            'border-t',
            variant === 'transparent' ? 'border-white/20' : 'border-border'
          )}
        />

        {/* Remaining Credits */}
        <div className="flex items-center justify-between">
          <span className={cn('text-sm font-medium', textStyles[variant])}>
            {t('remaining')}:
          </span>
          <span
            className={cn(
              'text-sm font-medium',
              remainingAfterGeneration >= 0
                ? variant === 'transparent'
                  ? 'text-green-400'
                  : 'text-green-600'
                : 'text-destructive'
            )}
          >
            {remainingAfterGeneration}
          </span>
        </div>
      </div>

      {/* Insufficient Credits Warning */}
      {isInsufficientCredits && (
        <div
          className={cn(
            'flex items-start gap-2 p-3 rounded-md',
            variant === 'transparent'
              ? 'bg-red-500/10 border border-red-400/30'
              : 'bg-destructive/10 border border-destructive/30'
          )}
        >
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className={cn('text-sm font-medium', textStyles[variant])}>
              {t('insufficient')}
            </p>
            <p className={cn('text-xs', mutedTextStyles[variant])}>
              {t('need_more', {
                count: requiredCredits - userCredits.remainingCredits,
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
