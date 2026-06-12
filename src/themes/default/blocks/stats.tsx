import Icon from '@/shared/components/icon'
import { Badge } from '@/shared/components/ui/badge'
import { Section as SectionType } from '@/shared/types/blocks/landing'

export function Stats({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null
  }

  return (
    <section id={section.id || section.name} className="py-16 bg-black text-white dark">
      <div className="container flex flex-col items-center gap-4">
        {section.label && (
          <Badge className="text-xs font-medium" variant="outline">
            {section.icon && (
              <Icon name={section.icon as string} className="mr-2 h-4 w-4 text-primary" />
            )}
            {section.label}
          </Badge>
        )}
        <h2 className="text-center text-3xl font-semibold lg:text-4xl text-white">
          {section.title}
        </h2>
        <p className="text-center text-muted-foreground lg:text-lg">
          {section.description}
        </p>
        <div className="w-full grid gap-10 md:grid-cols-3 lg:gap-0 mt-8">
          {section.items?.map((item, index) => {
            return (
              <div key={index} className="text-center">
                <p className="text-lg font-semibold text-muted-foreground">
                  {item.description}
                </p>
                <p className="pt-2 text-7xl font-semibold lg:pt-4 text-primary">
                  {item.label}
                </p>
                <p className="text-xl mt-2 font-normal text-white">
                  {item.title}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
