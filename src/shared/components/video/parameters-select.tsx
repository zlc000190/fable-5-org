'use client'

import { useState, useMemo, useEffect } from 'react'
import { ChevronDown, Settings, Check } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/shared/components/ui/dropdown-menu'
import { cn } from '@/shared/lib/utils'
import {
  getModelConfig,
  getEffectiveSchema,
  JsonSchemaProperty,
} from '@/config/model-config'
import UploadImage from './upload-image'

interface ParametersSelectProps {
  selectedModel: string
  parameters: Record<string, any>
  onParameterChange: (paramId: string, value: any) => void
  variant?: 'default' | 'transparent'
  className?: string
}

export default function ParametersSelect({
  selectedModel,
  parameters,
  onParameterChange,
  variant = 'transparent',
  className,
}: ParametersSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const modelConfig = getModelConfig(selectedModel)

  const effectiveSchema = useMemo(() => {
    return getEffectiveSchema(selectedModel, parameters)
  }, [selectedModel, parameters])

  useEffect(() => {
    if (!effectiveSchema) return

    Object.entries(parameters).forEach(([key, value]) => {
      const property = effectiveSchema.properties[key]
      if (
        property &&
        property.enum &&
        value !== undefined &&
        !property.enum.includes(value)
      ) {
        const defaultValue =
          property.default !== undefined ? property.default : property.enum[0]
        onParameterChange(key, defaultValue)
      }
    })
  }, [effectiveSchema, parameters, onParameterChange])

  if (!modelConfig || !effectiveSchema) return null

  const getAllParameters = (): Array<[string, JsonSchemaProperty]> => {
    return Object.entries(effectiveSchema.properties)
      .filter(([key]) => {
        return (
          key !== 'prompt' &&
          key !== 'first_frame_image' &&
          key !== 'start_image' &&
          key !== 'image'
        )
      })
      .sort(([, a], [, b]) => (a['x-order'] || 0) - (b['x-order'] || 0))
  }

  const isImageParameter = (property: JsonSchemaProperty): boolean => {
    return (
      property.format === 'uri' ||
      (property.type === 'array' && property.items?.format === 'uri')
    )
  }

  const isInputParameter = (property: JsonSchemaProperty): boolean => {
    return (
      (property.type === 'string' &&
        !property.enum &&
        property.format !== 'uri') ||
      (property.type === 'number' && !property.enum) ||
      (property.type === 'integer' && !property.enum)
    )
  }

  const getParametersSummary = () => {
    if (!effectiveSchema) return 'Default'

    const parts: string[] = []
    const allParameters = getAllParameters()

    allParameters.forEach(([key, property]) => {
      const value = parameters[key]
      if (value !== undefined && value !== null) {
        if (property.type === 'boolean') {
          parts.push(value ? property.title : `No ${property.title}`)
        } else if (isImageParameter(property)) {
          if (property.type === 'array') {
            const images = Array.isArray(value) ? value : []
            if (images.length > 0) {
              parts.push(`${images.length} ${property.title}`)
            }
          } else {
            parts.push(`${property.title} Set`)
          }
        } else if (isInputParameter(property)) {
          if (property.type === 'string' && typeof value === 'string' && value.length > 20) {
            parts.push(
              `${property.title}: ${String(value).substring(0, 20)}...`
            )
          } else {
            parts.push(`${property.title}: ${String(value)}`)
          }
        } else {
          parts.push(String(value))
        }
      }
    })

    return parts.length > 0 ? parts.join(' • ') : 'Default'
  }

  const buttonStyles = {
    default:
      'flex items-center gap-2 h-10 px-3 text-sm rounded-full hover:bg-accent focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary border',
    transparent:
      'flex items-center gap-2 h-10 px-3 py-2 text-sm rounded-full text-white hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary border border-white/20',
  }

  const dropdownStyles = {
    default: cn(
      'min-w-[20rem] w-80 max-h-[50vh] overflow-y-auto',
      'border backdrop-blur-xl'
    ),
    transparent: cn(
      'min-w-[20rem] w-80 max-h-[50vh] overflow-y-auto',
      'border-white/20 backdrop-blur-xl',
      'bg-black/90 dark:bg-black/90'
    ),
  }

  const itemStyles = {
    default: 'flex items-center justify-between gap-2 focus:bg-accent cursor-pointer rounded-lg mx-1',
    transparent:
      'flex items-center justify-between gap-2 text-white focus:!text-white focus:!bg-white/10 cursor-pointer py-2 px-3 rounded-lg mx-1',
  }

  const labelStyles = {
    default: 'text-foreground/80 text-sm font-medium',
    transparent: 'text-white/80 text-sm font-medium',
  }

  const subLabelStyles = {
    default: 'text-foreground/60 text-xs font-medium px-2 py-1',
    transparent: 'text-white/60 text-xs font-medium px-2 py-1 mt-1',
  }

  const separatorStyles = {
    default: 'bg-border',
    transparent: 'bg-white/10',
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(buttonStyles[variant], 'max-w-[200px]', className)}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="truncate text-sm">{getParametersSummary()}</span>
          <ChevronDown className="w-4 h-4 opacity-70 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={dropdownStyles[variant]}
        align="start"
        sideOffset={8}
        collisionPadding={8}
      >
        <DropdownMenuLabel className={labelStyles[variant]}>
          Parameters
        </DropdownMenuLabel>
        <DropdownMenuSeparator className={separatorStyles[variant]} />

        {getAllParameters().map(([key, property], index) => (
          <div key={key}>
            {index > 0 && (
              <DropdownMenuSeparator className={separatorStyles[variant]} />
            )}

            <DropdownMenuLabel className={subLabelStyles[variant]}>
              <span className="font-bold">{property.title}</span>
              {property.description && (
                <div
                  className={cn(
                    'text-[10px] font-normal mt-0.5 leading-tight',
                    variant === 'transparent'
                      ? 'text-white/40'
                      : 'text-foreground/40'
                  )}
                >
                  {property.description}
                </div>
              )}
            </DropdownMenuLabel>

            {property.enum &&
              property.enum.map((enumValue) => (
                <DropdownMenuItem
                  key={`${key}-${enumValue}`}
                  onSelect={() => {
                    onParameterChange(key, enumValue);
                  }}
                  className={itemStyles[variant]}
                >
                  <span className="text-[13px]">{String(enumValue)}</span>
                  {parameters[key] === enumValue && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}

            {property.type === 'boolean' && (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    onParameterChange(key, true);
                  }}
                  className={itemStyles[variant]}
                >
                  <span className="text-[13px]">Enable {property.title}</span>
                  {parameters[key] === true && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    onParameterChange(key, false);
                  }}
                  className={itemStyles[variant]}
                >
                  <span className="text-[13px]">Disable {property.title}</span>
                  {parameters[key] === false && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </DropdownMenuItem>
              </>
            )}

            {isImageParameter(property) && (
              <div className="p-2">
                {property.type === 'array' ? (
                  <div className="space-y-2">
                    <UploadImage
                      size="compact"
                      variant={variant}
                      showHeader={false}
                      enableDragDrop={false}
                      multiple={true}
                      maxItems={property.maxItems}
                      initialImages={
                        Array.isArray(parameters[key]) ? parameters[key] : []
                      }
                      onImagesSelect={(files) => {
                        onParameterChange(key, files)
                      }}
                    />
                  </div>
                ) : (
                  <UploadImage
                    size="compact"
                    variant={variant}
                    showHeader={false}
                    enableDragDrop={false}
                    onImageSelect={(file) => onParameterChange(key, file)}
                    initialImageUrl={
                      typeof parameters[key] === 'string'
                        ? parameters[key]
                        : undefined
                    }
                  />
                )}
              </div>
            )}

            {isInputParameter(property) && (
              <div className="p-2">
                {property.type === 'string' ? (
                  property.title.toLowerCase().includes('prompt') ? (
                    <Textarea
                      value={parameters[key] || ''}
                      onChange={(e) => onParameterChange(key, e.target.value)}
                      placeholder={
                        property.description ||
                        `Enter ${property.title.toLowerCase()}`
                      }
                      className={cn(
                        'min-h-[80px] text-xs',
                        variant === 'transparent'
                          ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30'
                          : ''
                      )}
                    />
                  ) : (
                    <Input
                      type="text"
                      value={parameters[key] || ''}
                      onChange={(e) => onParameterChange(key, e.target.value)}
                      placeholder={
                        property.description ||
                        `Enter ${property.title.toLowerCase()}`
                      }
                      className={cn(
                        'text-xs h-8',
                        variant === 'transparent'
                          ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30'
                          : ''
                      )}
                    />
                  )
                ) : (
                  <Input
                    type="number"
                    value={parameters[key] || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      if (property.type === 'integer') {
                        onParameterChange(key, parseInt(value) || 0)
                      } else {
                        onParameterChange(key, parseFloat(value) || 0)
                      }
                    }}
                    placeholder={
                      property.description ||
                      `Enter ${property.title.toLowerCase()}`
                    }
                    min={property.minimum}
                    max={property.maximum}
                    step={property.type === 'integer' ? 1 : 0.1}
                    className={cn(
                      'text-xs h-8',
                      variant === 'transparent'
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30'
                        : ''
                    )}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
