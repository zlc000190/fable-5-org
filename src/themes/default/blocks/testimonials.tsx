'use client'

import { motion } from 'framer-motion'
import { TestimonialsColumn } from './testimonial-column'
import Icon from '@/shared/components/icon'
import { Section as SectionType } from '@/shared/types/blocks/landing'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'

export function Testimonials({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null
  }

  // Transform section items to testimonial format
  const testimonials =
    section.items?.map((item) => ({
      text: item.description || '',
      image: item.image?.src || '',
      name: item.title || '',
      role: item.label || '',
    })) || []

  // Split testimonials into three columns
  const firstColumn = testimonials.slice(0, Math.ceil(testimonials.length / 3))
  const secondColumn = testimonials.slice(
    Math.ceil(testimonials.length / 3),
    Math.ceil((testimonials.length * 2) / 3)
  )
  const thirdColumn = testimonials.slice(
    Math.ceil((testimonials.length * 2) / 3)
  )

  return (
    <section
      id={section.id}
      className={cn('py-20 relative overflow-hidden', section.className)}
    >
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          {section.label && (
            <Badge className="text-xs font-medium gap-1" variant="outline">
              {section.icon &&
                (typeof section.icon === 'string' ? (
                  <Icon name={section.icon} className="h-4 w-4" />
                ) : (
                  section.icon
                ))}
              {section.label}
            </Badge>
          )}

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-center">
            {section.title}
          </h2>
          <p className="text-center mt-5 opacity-75 text-muted-foreground">
            {section.description}
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  )
}
