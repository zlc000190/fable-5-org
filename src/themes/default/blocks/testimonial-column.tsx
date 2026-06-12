'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LazyImage } from '@/shared/blocks/common'

interface Testimonial {
  text: string
  image: string
  name: string
  role: string
}

interface TestimonialsColumnProps {
  className?: string
  testimonials: Testimonial[]
  duration?: number
}

export function TestimonialsColumn({
  className,
  testimonials,
  duration = 15,
}: TestimonialsColumnProps) {
  return (
    <div className={className}>
      <motion.div
        animate={{
          translateY: '-50%',
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="p-6 rounded-2xl border shadow-lg shadow-primary/10 max-w-xs w-full bg-card"
                  key={i}
                >
                  <q className="text-sm leading-6 text-muted-foreground block mb-4">
                    {text}
                  </q>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full ring-1 ring-input overflow-hidden">
                      <LazyImage src={image} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <div className="font-medium text-sm leading-5">
                        {name}
                      </div>
                      <div className="text-xs leading-4 text-muted-foreground">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  )
}
