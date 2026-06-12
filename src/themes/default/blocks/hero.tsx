'use client';

import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/core/i18n/navigation';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { AnimatedGradientText } from '@/shared/components/ui/animated-gradient-text';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';
import HeroInput from '@/shared/components/video/hero-input';
import HeroBg from './hero-bg';

export function Hero({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const highlightText = section.highlight_text ?? 'AI Video Generator';
  let texts: string[] = ['', ''];
  
  if (section.title) {
     if (section.title.includes(highlightText)) {
       texts = section.title.split(highlightText, 2);
     } else {
       texts = [section.title, ''];
     }
  }

  return (
      <section
        id={section.id}
        className={cn(
          `relative pt-24 dark`,
          section.className,
          className
        )}
      >
        <HeroBg />
        <div className="container relative z-10 px-4">
          <div className="text-center">
            {/* Announcement Badge */}
            {section.announcement && (
              <Link
                href={section.announcement.url || ''}
                className="mx-auto mb-3 inline-flex items-center gap-3"
              >
                <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
                  <span
                    className={cn(
                      'absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]'
                    )}
                    style={{
                      WebkitMask:
                        'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'destination-out',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'subtract',
                      WebkitClipPath: 'padding-box',
                    }}
                  />
                  {section.announcement.badge && (
                    <Badge>{section.announcement.badge}</Badge>
                  )}
                  <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500/50" />
                  <AnimatedGradientText className="text-sm font-medium tracking-tight">
                    {section.announcement.title}
                  </AnimatedGradientText>
                  <ChevronRight
                    className="ml-1 size-3.5 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            )}

            {/* Main Title */}
            <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold !text-white lg:mb-7 lg:text-7xl">
              {texts[0]}
              <span className="bg-linear-to-r from-[#9c40ff] via-[#8fdfff] to-[#9c40ff] bg-clip-text text-transparent">
                {highlightText}
              </span>
              {texts[1]}
            </h1>

            <p
              className="mx-auto max-w-3xl text-muted-foreground lg:text-xl"
              dangerouslySetInnerHTML={{ __html: section.description || '' }}
            />

            {/* CTAs - Hidden if show_hero_input is true, matching Hailuo design */}
            {!section.show_hero_input && section.buttons && (
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                {section.buttons.map((item, i) => (
                  <Button
                    key={i}
                    asChild
                    size="lg"
                    variant={item.variant || 'default'}
                    className="rounded-full px-8"
                  >
                    <Link href={item.url ?? ''}>{item.title}</Link>
                  </Button>
                ))}
              </div>
            )}

            {/* Tip */}
            {!section.show_hero_input && section.tip && (
              <p className="mt-8 text-md text-neutral-500">{section.tip}</p>
            )}

            {section.show_hero_input && <HeroInput />}
          </div>
        </div>
      </section>
  );
}
