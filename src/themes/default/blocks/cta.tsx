'use client'

import { Button } from '@/shared/components/ui/button'
import { SmartIcon } from '@/shared/blocks/common/smart-icon'
import { Link } from '@/core/i18n/navigation'
import { Section as SectionType } from '@/shared/types/blocks/landing'
import { cn } from '@/shared/lib/utils'
import CTABg from './cta-bg'

export function Cta({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null
  }

  return (
    <section 
      id={section.id || section.name} 
      className={cn("relative py-16 overflow-hidden bg-black text-white dark", section.className)}
    >
      <CTABg />
      <div className="px-8 relative z-10">
        <div className="flex items-center justify-center rounded-2xl px-8 py-12 text-center md:p-16">
          <div className="mx-auto max-w-(--breakpoint-md)">
            <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl text-white">
              {section.title}
            </h2>
            <p className="text-white/80 md:text-lg">{section.description}</p>
            {section.buttons && (
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                {section.buttons.map((item, idx) => (
                  <Button 
                    key={idx} 
                    variant={item.variant || 'default'} 
                    size="lg"
                    className="rounded-full px-8 py-6 text-lg font-bold"
                  >
                    <Link
                      href={item.url || ''}
                      target={item.target}
                      className="flex items-center justify-center gap-1"
                    >
                      {item.title}
                      {item.icon && (
                        <SmartIcon name={item.icon as string} className="size-6" />
                      )}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
