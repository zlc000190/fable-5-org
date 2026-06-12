'use client';

import { AlertCircle, CoinsIcon, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { cn } from '@/shared/lib/utils';

interface CreditsDisplayProps {
  requiredCredits: number;
  variant?: 'default' | 'transparent';
  className?: string;
  onCreditsChange?: (credits: UserCredits | null) => void;
  refreshTrigger?: number;
  pricingDescription?: string;
}

interface UserCredits {
  remainingCredits: number;
  is_pro?: boolean;
}

export default function CreditsDisplay({
  requiredCredits,
  variant = 'transparent',
  className,
  onCreditsChange,
  refreshTrigger,
  pricingDescription,
}: CreditsDisplayProps) {
  const t = useTranslations('video.credits');
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserCredits = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/user/get-user-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(t('failed_load'));
      }

      const result = await response.json();

      if (result.code === 0) {
        setUserCredits(result.data);
        onCreditsChange?.(result.data);
      } else {
        throw new Error(result.message || t('failed_load'));
      }
    } catch (err) {
      console.error('Error fetching user credits:', err);
      setError(err instanceof Error ? err.message : t('failed_load'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCredits();
  }, []);

  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      fetchUserCredits();
    }
  }, [refreshTrigger]);

  const isInsufficientCredits =
    userCredits && userCredits.remainingCredits < requiredCredits;
  const remainingAfterGeneration = userCredits
    ? userCredits.remainingCredits - requiredCredits
    : 0;

  const containerStyles = {
    default: cn(
      'rounded-lg border bg-card p-4 space-y-3',
      isInsufficientCredits && 'border-destructive/50 bg-destructive/5'
    ),
    transparent: cn(
      'rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm p-4 space-y-3',
      isInsufficientCredits && 'border-red-400/50 bg-red-500/10'
    ),
  };

  const textStyles = {
    default: 'text-foreground',
    transparent: 'text-white',
  };

  const mutedTextStyles = {
    default: 'text-muted-foreground',
    transparent: 'text-white/60',
  };

  if (loading) {
    return (
      <div className={cn(containerStyles[variant], className)}>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-white/60" />
          <span className={cn('text-sm', textStyles[variant])}>
            {t('loading')}
          </span>
        </div>
      </div>
    );
  }

  if (error || !userCredits) {
    return (
      <div className={cn(containerStyles[variant], className)}>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className={cn('text-sm', textStyles[variant])}>
            {t('failed_load')}
          </span>
          <button
            onClick={fetchUserCredits}
            className={cn(
              'text-xs underline hover:no-underline',
              variant === 'transparent' ? 'text-white/80' : 'text-muted-foreground'
            )}
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(containerStyles[variant], className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CoinsIcon className="w-4 h-4 text-yellow-500" />
          <span className={cn('text-sm font-medium', textStyles[variant])}>
            {t('balance')}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            fetchUserCredits();
          }}
          disabled={loading}
          className={cn(
            'p-1 rounded-md transition-colors',
            variant === 'transparent'
              ? 'hover:bg-white/10 text-white/60 hover:text-white/80'
              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
          )}
          title={t('refresh')}
        >
          <RefreshCw className={cn('w-3 h-3', loading && 'animate-spin')} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={cn('text-sm', mutedTextStyles[variant])}>
            {t('available')}
          </span>
          <span
            className={cn(
              'text-sm font-medium',
              textStyles[variant],
              isInsufficientCredits && 'text-red-400'
            )}
          >
            {userCredits.remainingCredits}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className={cn('text-sm', mutedTextStyles[variant])}>
            {t('required')}
          </span>
          <span className={cn('text-sm font-medium', textStyles[variant])}>
            -{requiredCredits}
          </span>
        </div>

        {pricingDescription && (
          <div className="space-y-1">
            <span className={cn('text-xs', mutedTextStyles[variant])}>
              {t('pricing')}
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

        <div
          className={cn(
            'border-t',
            variant === 'transparent' ? 'border-white/20' : 'border-border'
          )}
        />

        <div className="flex items-center justify-between">
          <span className={cn('text-sm font-medium', textStyles[variant])}>
            {t('remaining')}
          </span>
          <span
            className={cn(
              'text-sm font-medium',
              remainingAfterGeneration >= 0
                ? variant === 'transparent'
                  ? 'text-green-400'
                  : 'text-green-600'
                : 'text-red-400'
            )}
          >
            {remainingAfterGeneration}
          </span>
        </div>
      </div>

      {isInsufficientCredits && (
        <div
          className={cn(
            'flex items-start gap-2 p-3 rounded-md',
            variant === 'transparent'
              ? 'bg-red-500/10 border border-red-400/30'
              : 'bg-destructive/10 border border-destructive/30'
          )}
        >
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
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
  );
}
