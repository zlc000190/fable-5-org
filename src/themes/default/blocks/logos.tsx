'use client';

// import { LazyImage } from '@/shared/blocks/common';
// import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function Logos({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={cn('pt-24 pb-16 bg-black', section.className, className)}
    >
      <div className="container flex flex-row items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <h2 className="sr-only text-center text-secondary-foreground lg:text-left text-2xl font-bold">
            {section.title}
          </h2>
          <p className="sr-only text-center text-muted-foreground lg:text-left">
            {section.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-4">
            {section.items?.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <img
                  src={item.image?.src ?? ''}
                  alt={item.image?.alt ?? ''}
                  className="h-12"
                />
                <span className="text-sm text-muted-foreground font-medium">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
