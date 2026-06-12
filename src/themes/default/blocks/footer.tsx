'use client'

import { Footer as FooterType } from '@/shared/types/blocks/landing'
import Icon from '@/shared/components/icon'
import { Link } from '@/core/i18n/navigation'
import { cn } from '@/shared/lib/utils'

export function Footer({ footer }: { footer: FooterType }) {
  if (footer.disabled) {
    return null
  }

  return (
    <section 
      id={footer.id || footer.name} 
      className={cn("py-16 bg-black text-white dark border-t border-white/5", footer.className)}
    >
      <div className="container mx-auto">
        <footer>
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              {footer.brand && (
                <div>
                  <div className="flex items-center justify-center gap-2 lg:justify-start">
                    {footer.brand.logo && (
                      <img
                        src={footer.brand.logo.src}
                        alt={footer.brand.logo.alt || footer.brand.title}
                        className="h-11"
                      />
                    )}
                    {footer.brand.title && (
                      <p className="text-3xl font-semibold">
                        {footer.brand.title}
                      </p>
                    )}
                  </div>
                  {footer.brand.description && (
                    <p className="mt-6 text-md text-muted-foreground">
                      {footer.brand.description}
                    </p>
                  )}
                </div>
              )}
              {footer.social && (
                <ul className="flex items-center space-x-6 text-muted-foreground">
                  {footer.social.items?.map((item, i) => (
                    <li key={i} className="font-medium hover:text-white transition-colors">
                      <a href={item.url || ""} target={item.target}>
                        {item.icon && (
                          <Icon name={item.icon as string} className="size-5" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:gap-20">
              {footer.nav?.items?.map((item, i) => (
                <div key={i}>
                  <p className="mb-6 font-bold">{item.title}</p>
                  <ul className="space-y-4 text-sm text-muted-foreground">
                    {item.children?.map((iitem, ii) => {
                      const isAnchor = iitem.url?.startsWith('#')
                      
                      const handleClick = (e: React.MouseEvent) => {
                        if (isAnchor && iitem.url) {
                          e.preventDefault()
                          const element = document.querySelector(iitem.url)
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                        }
                      }
                      
                      return (
                        <li key={ii} className="font-medium hover:text-white transition-colors">
                          {isAnchor ? (
                            <a 
                              href={iitem.url || ""} 
                              onClick={handleClick}
                              className="cursor-pointer"
                            >
                              {iitem.title}
                            </a>
                          ) : (
                            <Link href={iitem.url || ""} target={iitem.target}>
                              {iitem.title}
                            </Link>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left">
            {footer.copyright && (
              <p>
                {footer.copyright}
                {process.env.NEXT_PUBLIC_SHOW_POWERED_BY === "false" ? null : (
                  <a
                    href="https://hailuo2.ai"
                    target="_blank"
                    className="px-2 text-primary hover:underline transition-all"
                  >
                    built with hailuo2
                  </a>
                )}
              </p>
            )}

            {footer.agreement && (
              <ul className="flex justify-center gap-4 lg:justify-start">
                {footer.agreement.items?.map((item: any, i: number) => (
                  <li key={i} className="hover:text-white transition-colors">
                    <a href={item.url || ""} target={item.target}>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </footer>
      </div>
    </section>
  )
}
