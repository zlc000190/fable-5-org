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
import UploadImage from '../upload-image'
import { TagInput, Tag } from 'emblor'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('video.model_params')
  const [isOpen, setIsOpen] = useState(false)
  const modelConfig = getModelConfig(selectedModel)

  // 使用 useMemo 来获取动态更新后的 schema
  // 当 selectedModel 或 parameters 变化时，它会自动重新计算
  const effectiveSchema = useMemo(() => {
    return getEffectiveSchema(selectedModel, parameters)
  }, [selectedModel, parameters])

  // Helper to translate property title/description
  const translateProperty = (key: string, type: 'title' | 'description') => {
    const value = t(`schema.${key}.${type}`)
    // If translation not found, fallback to original title from schema (or key name)
    if (value && !value.includes(`schema.${key}.${type}`)) {
      return value
    }
    const prop = effectiveSchema?.properties[key]
    return prop?.[type] || key
  }

  // 参数值自动修正逻辑
  useEffect(() => {
    if (!effectiveSchema) return

    // 遍历当前所有参数
    Object.entries(parameters).forEach(([key, value]) => {
      const property = effectiveSchema.properties[key]

      // 检查：如果参数是枚举类型，并且当前的值已经不在有效的枚举列表里了
      if (
        property &&
        property.enum &&
        value !== undefined &&
        !property.enum.includes(value)
      ) {
        // 将这个无效的参数值重置为它的默认值
        console.log(
          `Parameter ${key} value ${value} is invalid, resetting to default.`
        )
        const defaultValue =
          property.default !== undefined ? property.default : property.enum[0]
        onParameterChange(key, defaultValue)
      }
    })
  }, [effectiveSchema, parameters, onParameterChange])

  if (!modelConfig || !effectiveSchema) return null

  // Get all parameters excluding those handled in the main form
  const getAllParameters = (): Array<[string, JsonSchemaProperty]> => {
    return Object.entries(effectiveSchema.properties)
      .filter(([key]) => {
        // Exclude parameters handled in the main video generation form
        return (
          key !== 'prompt' &&
          key !== 'first_frame_image' &&
          key !== 'start_image' &&
          key !== 'image'
        )
      })
      .sort(([, a], [, b]) => (a['x-order'] || 0) - (b['x-order'] || 0))
  }

  // Check if parameter is an image type
  const isImageParameter = (property: JsonSchemaProperty): boolean => {
    return (
      property.format === 'uri' ||
      (property.type === 'array' && property.items?.format === 'uri')
    )
  }

  // Check if parameter needs text input
  const isInputParameter = (property: JsonSchemaProperty): boolean => {
    return (
      (property.type === 'string' &&
        !property.enum &&
        property.format !== 'uri') ||
      (property.type === 'number' && !property.enum) ||
      (property.type === 'integer' && !property.enum)
    )
  }

  // Check if parameter is an array of strings (for TagInput)
  const isArrayStringParameter = (property: JsonSchemaProperty): boolean => {
    return (
      property.type === 'array' &&
      property.items?.type === 'string' &&
      property.items?.format !== 'uri'
    )
  }

  // 生成参数摘要文本
  const getParametersSummary = () => {
    if (!effectiveSchema) return 'Default'

    const parts: string[] = []
    const allParameters = getAllParameters()

    allParameters.forEach(([key, property]) => {
      const value = parameters[key]
      if (value !== undefined && value !== null) {
        if (property.type === 'boolean') {
          const title = translateProperty(key, 'title')
          parts.push(value ? title : t('no', { title }))
        } else if (isImageParameter(property)) {
          const title = translateProperty(key, 'title')
          if (property.type === 'array') {
            const images = Array.isArray(value) ? value : []
            if (images.length > 0) {
              parts.push(`${images.length} ${title}`)
            }
          } else {
            parts.push(t('set', { title }))
          }
        } else if (isArrayStringParameter(property)) {
          const title = translateProperty(key, 'title')
          const items = Array.isArray(value) ? value : []
          if (items.length > 0) {
            parts.push(`${items.length} ${title}`)
          }
        } else if (isInputParameter(property)) {
          const title = translateProperty(key, 'title')
          if (property.type === 'string' && value.length > 20) {
            parts.push(`${title}: ${String(value).substring(0, 20)}...`)
          } else {
            parts.push(`${title}: ${String(value)}`)
          }
        } else {
          parts.push(String(value))
        }
      }
    })

    return parts.length > 0 ? parts.join(' • ') : t('default')
  }

  const buttonStyles = {
    default:
      'flex items-center gap-2 h-10 px-3 text-sm rounded-lg hover:bg-accent focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary border',
    transparent:
      'flex items-center gap-2 h-10 px-3 text-sm rounded-lg text-white hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary border border-white/20',
  }

  const dropdownStyles = {
    default: cn(
      'min-w-[20rem] w-80 max-h-[50vh] overflow-y-auto',
      'border backdrop-blur-xl'
    ),
    transparent: cn(
      'min-w-[20rem] w-80 max-h-[50vh] overflow-y-auto',
      'border-white/20 backdrop-blur-xl',
      'bg-black/80 dark:bg-black/80'
    ),
  }

  const itemStyles = {
    default: 'flex items-center justify-between gap-2 hover:bg-accent',
    transparent:
      'flex items-center justify-between gap-2 text-white hover:bg-white/10',
  }

  const labelStyles = {
    default: 'text-foreground/80 text-sm font-medium',
    transparent: 'text-white/80 text-sm font-medium',
  }

  const subLabelStyles = {
    default: 'text-foreground/60 text-xs font-medium px-2 py-1',
    transparent: 'text-white/60 text-xs font-medium px-2 py-1',
  }

  const separatorStyles = {
    default: 'bg-border',
    transparent: 'bg-white/20',
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
        sideOffset={4}
        collisionPadding={8}
      >
        <DropdownMenuLabel className={labelStyles[variant]}>
          {t('title')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className={separatorStyles[variant]} />

        {/* Render parameters from schema */}
        {getAllParameters().map(([key, property], index) => (
          <div key={key}>
            {index > 0 && (
              <DropdownMenuSeparator className={separatorStyles[variant]} />
            )}

            <DropdownMenuLabel className={subLabelStyles[variant]}>
              {translateProperty(key, 'title')}
              {translateProperty(key, 'description') && (
                <div
                  className={cn(
                    'text-xs font-normal mt-1',
                    variant === 'transparent'
                      ? 'text-white/50'
                      : 'text-foreground/50'
                  )}
                >
                  {translateProperty(key, 'description')}
                </div>
              )}
            </DropdownMenuLabel>

            {/* Handle enum properties (dropdown options) */}
            {property.enum &&
              property.enum.map((enumValue) => (
                <DropdownMenuItem
                  key={`${key}-${enumValue}`}
                  onSelect={() => onParameterChange(key, enumValue)}
                  className={itemStyles[variant]}
                >
                  <span>{String(enumValue)}</span>
                  {parameters[key] === enumValue && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}

            {/* Handle boolean properties */}
            {property.type === 'boolean' && (
              <>
                <DropdownMenuItem
                  onSelect={() => onParameterChange(key, true)}
                  className={itemStyles[variant]}
                >
                  <span>{t('enable', { title: translateProperty(key, 'title') })}</span>
                  {parameters[key] === true && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => onParameterChange(key, false)}
                  className={itemStyles[variant]}
                >
                  <span>{t('disable', { title: translateProperty(key, 'title') })}</span>
                  {parameters[key] === false && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </DropdownMenuItem>
              </>
            )}

            {/* Handle image upload parameters */}
            {isImageParameter(property) && (
              <div className="p-2">
                {property.type === 'array' ? (
                  // Handle array of images (reference_images)
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
                  // Handle single image (start_image, first_frame_image)
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

            {/* Handle array string parameters (TagInput) */}
            {isArrayStringParameter(property) && (
              <div className="p-2">
                <TagInput
                  placeholder={t('add_tag', { title: translateProperty(key, 'title') })}
                  tags={
                    Array.isArray(parameters[key])
                      ? parameters[key].map((item: string) => ({
                          id: item,
                          text: item,
                        }))
                      : []
                  }
                  setTags={(newTags) => {
                    const resolvedTags =
                      typeof newTags === 'function'
                        ? newTags(
                            Array.isArray(parameters[key])
                              ? parameters[key].map((item: string) => ({
                                  id: item,
                                  text: item,
                                }))
                              : []
                          )
                        : newTags
                    const stringArray = resolvedTags.map((tag) => tag.text)
                    onParameterChange(key, stringArray)
                  }}
                  activeTagIndex={null}
                  setActiveTagIndex={() => {}}
                  className={cn(
                    'text-sm',
                    variant === 'transparent'
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50'
                      : ''
                  )}
                />
              </div>
            )}

            {/* Handle text/number input parameters */}
            {isInputParameter(property) && (
              <div className="p-2">
                {property.type === 'string' ? (
                  property.title.toLowerCase().includes('prompt') ? (
                    <Textarea
                      value={parameters[key] || ''}
                      onChange={(e) => onParameterChange(key, e.target.value)}
                      placeholder={
                        translateProperty(key, 'description') ||
                        t('enter', { title: translateProperty(key, 'title') })
                      }
                      className={cn(
                        'min-h-[80px] text-sm',
                        variant === 'transparent'
                          ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50'
                          : ''
                      )}
                    />
                  ) : (
                    <Input
                      type="text"
                      value={parameters[key] || ''}
                      onChange={(e) => onParameterChange(key, e.target.value)}
                      placeholder={
                        translateProperty(key, 'description') ||
                        t('enter', { title: translateProperty(key, 'title') })
                      }
                      className={cn(
                        'text-sm',
                        variant === 'transparent'
                          ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50'
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
                      translateProperty(key, 'description') ||
                      t('enter', { title: translateProperty(key, 'title') })
                    }
                    min={property.minimum}
                    max={property.maximum}
                    step={property.type === 'integer' ? 1 : 0.1}
                    className={cn(
                      'text-sm',
                      variant === 'transparent'
                        ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50'
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
