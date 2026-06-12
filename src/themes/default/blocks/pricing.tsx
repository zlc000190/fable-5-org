'use client'

import { Check, Loader, Star } from 'lucide-react'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import confetti from 'canvas-confetti'

import { Button } from '@/shared/components/ui/button'
import { Switch } from '@/shared/components/ui/switch'
import Icon from '@/shared/components/icon'
import { toast } from 'sonner'
import { useAppContext } from '@/shared/contexts/app'
import { useLocale } from 'next-intl'
import { useMedia } from '@/shared/hooks/use-media'
import { cn } from '@/shared/lib/utils'

// Types
interface PricingItem {
  title?: string
  group?: string
  price?: string
  description?: string
  button?: {
    title: string
    url: string
    icon?: string
  }
  is_featured?: boolean
  feature?: {
    title: string
    list: string[]
  }[]
  product_id?: string
  currency?: string
  original_price?: string
  tip?: string
  label?: string
}

// Transform JSON data to component format
interface TransformedPlan {
  name: string
  price: string
  yearlyPrice: string
  period: string
  features: string[]
  description: string
  buttonText: string
  href: string
  isPopular: boolean
  monthlyItem: PricingItem
  yearlyItem: PricingItem
}

export function Pricing({ section }: { section: any }) {
  const pricing = section
  if (!pricing || pricing.disabled) {
    return null
  }

  const locale = useLocale()
  const { user, setIsShowSignModal } = useAppContext()
  const isDesktop = useMedia('(min-width: 768px)')

  const [isMonthly, setIsMonthly] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [productId, setProductId] = useState<string | null>(null)
  const switchRef = useRef<HTMLButtonElement>(null)

  // Transform JSON data to component format
  const transformedPlans: TransformedPlan[] = []

  if (pricing.items) {
    // Group items by title
    const groupedItems: { [key: string]: PricingItem[] } = {}
    pricing.items.forEach((item: PricingItem) => {
      if (!groupedItems[item.title || '']) {
        groupedItems[item.title || ''] = []
      }
      groupedItems[item.title || ''].push(item)
    })

    // Transform to plan format
    Object.entries(groupedItems).forEach(([title, items]) => {
      const monthlyItem =
        items.find((item) => item.group === 'monthly') || items[0]
      const yearlyItem =
        items.find((item) => item.group === 'yearly') || items[0]

      // Combine features from all sections
      const allFeatures = monthlyItem.feature?.flatMap((f) => f.list) || []

      transformedPlans.push({
        name: title,
        price: monthlyItem.price?.replace('$', '') || '0',
        yearlyPrice: yearlyItem.price?.replace('$', '') || '0',
        period: 'month',
        features: allFeatures,
        description: monthlyItem.description || '',
        buttonText: monthlyItem.button?.title || 'Get Started',
        href: monthlyItem.button?.url || '#',
        isPopular: monthlyItem.is_featured || yearlyItem.is_featured || false,
        monthlyItem,
        yearlyItem,
      })
    })
  }

  const handleCheckout = async (item: PricingItem, cn_pay: boolean = false) => {
    try {
      if (!user) {
        setIsShowSignModal(true)
        return
      }

      const params = {
        product_id: item.product_id,
        currency: cn_pay ? 'cny' : item.currency,
        locale: locale || 'en',
      }

      setIsLoading(true)
      setProductId(item.product_id || null)

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (response.status === 401) {
        setIsLoading(false)
        setProductId(null)
        setIsShowSignModal(true)
        return
      }

      const { code, message, data } = await response.json()
      if (code !== 0) {
        toast.error(message)
        return
      }

      const { checkout_url } = data
      if (!checkout_url) {
        toast.error('checkout failed')
        return
      }

      window.location.href = checkout_url
    } catch (e) {
      console.log('checkout failed: ', e)
      toast.error('checkout failed')
    } finally {
      setIsLoading(false)
      setProductId(null)
    }
  }

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked)
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          'hsl(var(--primary))',
          'hsl(var(--accent))',
          'hsl(var(--secondary))',
          'hsl(var(--muted))',
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['circle'],
      })
    }
  }

  return (
    <section id={pricing.id || pricing.name} className="py-20 bg-black text-white dark">
      <div className="container">
        <div className="text-center space-y-4 my-12">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {pricing.title}
          </h2>
          <p className="text-muted-foreground text-lg whitespace-pre-line">
            {pricing.description}
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 mb-10">
          <span className="font-semibold">Monthly</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <Switch
              ref={switchRef as any}
              checked={!isMonthly}
              onCheckedChange={handleToggle}
              className="relative"
            />
          </label>
          <span className="font-semibold">
            Annual <span className="text-primary">(Save 29%)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {transformedPlans.map((plan, index) => {
            const currentItem = isMonthly ? plan.monthlyItem : plan.yearlyItem
            const currentPrice = isMonthly ? plan.price : plan.yearlyPrice

            return (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 1 }}
                whileInView={
                  isDesktop
                    ? {
                        y: plan.isPopular ? -20 : 0,
                        opacity: 1,
                        x: index === 2 ? -30 : index === 0 ? 30 : 0,
                        scale: index === 0 || index === 2 ? 0.94 : 1.0,
                      }
                    : {}
                }
                viewport={{ once: true }}
                transition={{
                  duration: 1.6,
                  type: 'spring',
                  stiffness: 100,
                  damping: 30,
                  delay: 0.4,
                  opacity: { duration: 0.5 },
                }}
                className={cn(
                  `rounded-xl border-[1px] p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative`,
                  plan.isPopular ? 'border-primary border-2' : 'border-border',
                  'flex flex-col',
                  !plan.isPopular && 'mt-5',
                  index === 0 || index === 2
                    ? 'z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]'
                    : 'z-10',
                  index === 0 && 'origin-right',
                  index === 2 && 'origin-left'
                )}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-primary py-0.5 px-2 rounded-bl-2xl rounded-tr-2xl flex items-center">
                    <Star className="text-primary-foreground h-4 w-4 fill-current" />
                    <span className="text-primary-foreground ml-1 font-sans font-semibold">
                      {currentItem.label || 'Popular'}
                    </span>
                  </div>
                )}

                <div className="flex flex-col">
                  <p className="text-base font-semibold text-muted-foreground">
                    {plan.name}
                  </p>

                  <div className="mt-6 flex items-center justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-foreground">
                      <NumberFlow
                        value={Number(currentPrice)}
                        format={{
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }}
                        transformTiming={{
                          duration: 500,
                          easing: 'ease-out',
                        }}
                        willChange
                        className="font-variant-numeric: tabular-nums"
                      />
                    </span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                      / {plan.period}
                    </span>
                  </div>

                  {currentItem.original_price && (
                    <div className="flex justify-center items-center gap-2 mt-2">
                      <span className="text-lg text-muted-foreground font-semibold line-through">
                        {currentItem.original_price}
                      </span>
                    </div>
                  )}

                  <p className="text-xs leading-5 text-muted-foreground mt-2">
                    {currentItem.tip}
                  </p>

                  <p className="text-sm text-muted-foreground mt-4">
                    {plan.description}
                  </p>

                  {/* Feature Sections */}
                  {currentItem.feature?.map((featureSection, sectionIdx) => (
                    <div
                      key={sectionIdx}
                      className={sectionIdx === 0 ? 'mt-6' : 'mt-4'}
                    >
                      <p className="font-semibold text-sm mb-2">
                        {featureSection.title}
                      </p>
                      <ul className="flex flex-col gap-1">
                        {featureSection.list.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-left">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <hr className="w-full my-6" />

                  <Button
                    className={cn(
                      'group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter',
                      'transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1',
                      plan.isPopular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-background text-foreground hover:bg-primary hover:text-primary-foreground'
                    )}
                    disabled={isLoading}
                    onClick={() => {
                      if (isLoading) return
                      handleCheckout(currentItem)
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {(!isLoading ||
                        (isLoading && productId !== currentItem.product_id)) && (
                        <span>{plan.buttonText}</span>
                      )}
                      {isLoading && productId === currentItem.product_id && (
                        <>
                          <span>{plan.buttonText}</span>
                          <Loader className="ml-2 h-4 w-4 animate-spin" />
                        </>
                      )}
                      {currentItem.button?.icon && (
                        <Icon name={currentItem.button.icon} className="size-4" />
                      )}
                    </span>
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
