'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { CoinsIcon, Sparkles } from 'lucide-react'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'

import { Label } from '@/shared/components/ui/label'
import { cn } from '@/shared/lib/utils'
import ModelSelect from '@/shared/components/blocks/model-select'
import ParametersSelect from '@/shared/components/blocks/parameters-select'
import { useTranslations } from 'next-intl'
import {
  getModelDefaults,
  validateRequiredParams,
  calculateModelCredits,
  getModelPricingDescription,
} from '@/config/model-config'
import UploadImage from '@/shared/components/blocks/upload-image'
import CreditsDisplay from '@/shared/components/blocks/credits-display'
import { toast } from 'sonner'

interface UseAutoResizeTextareaProps {
  minHeight: number
  maxHeight?: number
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current
      if (!textarea) return

      if (reset) {
        textarea.style.height = `${minHeight}px`
        return
      }

      textarea.style.height = `${minHeight}px`

      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      )

      textarea.style.height = `${newHeight}px`
    },
    [minHeight, maxHeight]
  )

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = `${minHeight}px`
    }
  }, [minHeight])

  return { textareaRef, adjustHeight }
}

interface VideoGenerationFormProps {
  onGenerate: (formData: {
    prompt: string
    model: string
    parameters: Record<string, any>
    startImage?: File
  }) => void
  isGenerating: boolean
  initialData?: {
    prompt?: string
    model?: string
    parameters?: Record<string, any>
    startImageUrl?: string
  }
  onGenerationSuccess?: () => void // 新增：视频生成成功的回调
}

export default function VideoGenerationForm({
  onGenerate,
  isGenerating,
  initialData,
  onGenerationSuccess,
}: VideoGenerationFormProps) {
  const t = useTranslations('video')
  const [prompt, setPrompt] = useState(initialData?.prompt || '')
  const [selectedModel, setSelectedModel] = useState(
    initialData?.model || 'seedance_2_0'
  )
  const [parameters, setParameters] = useState<Record<string, any>>(() => {
    if (initialData?.parameters) {
      return initialData.parameters
    }
    return getModelDefaults('seedance_2_0')
  })
  const [startImage, setStartImage] = useState<File | null>(null)
  const [creditsRefreshTrigger, setCreditsRefreshTrigger] = useState(0)
  const prevIsGeneratingRef = useRef(isGenerating)

  // 计算当前配置需要的积分
  const calculateCredits = () => {
    try {
      return calculateModelCredits(selectedModel, parameters)
    } catch (error) {
      console.error('Error calculating credits:', error)
      return 0
    }
  }

  // 触发积分刷新的函数
  const refreshCredits = () => {
    setCreditsRefreshTrigger((prev) => prev + 1)
  }

  // 当模型变化时更新参数默认值
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    if (!initialData) {
      setParameters(getModelDefaults(modelId))
    }
  }

  // 更新单个参数
  const handleParameterChange = (paramId: string, value: any) => {
    setParameters((prev) => ({
      ...prev,
      [paramId]: value,
    }))
  }

  // Initialize parameters from initial data on first load
  useEffect(() => {
    if (initialData) {
      if (initialData.prompt !== undefined) setPrompt(initialData.prompt)
      if (initialData.model !== undefined) setSelectedModel(initialData.model)
      if (initialData.parameters !== undefined) {
        setParameters(initialData.parameters)
      }
    }
  }, [initialData])

  // 监听生成状态变化，当从生成中变为非生成中时刷新积分
  useEffect(() => {
    // 如果从 true 变为 false，说明生成完成，刷新积分
    if (prevIsGeneratingRef.current && !isGenerating) {
      refreshCredits()
      onGenerationSuccess?.()
    }

    prevIsGeneratingRef.current = isGenerating
  }, [isGenerating, onGenerationSuccess])

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 120,
    maxHeight: 300,
  })

  const handleSubmit = () => {
    if (!prompt.trim() || isGenerating) return

    // 校验必填参数
    const validation = validateRequiredParams(selectedModel, {
      prompt,
      startImageUrl: startImage,
      ...parameters,
    })

    if (!validation.isValid) {
      const missingParamNames = validation.missingParams.map((param) => {
        // 将参数名转换为用户友好的名称
        console.log('param: ', param)
        switch (param) {
          case 'startImageUrl':
            return 'Image'
          default:
            return (
              param.charAt(0).toUpperCase() + param.slice(1).replace(/_/g, ' ')
            )
        }
      })

      toast.error(
        `Missing required parameters: ${missingParamNames.join(', ')}`
      )
      return
    }

    console.log('Submitting form with:', {
      prompt: prompt.trim(),
      model: selectedModel,
      parameters,
      hasStartImage: !!startImage,
    })

    onGenerate({
      prompt: prompt.trim(),
      model: selectedModel,
      parameters,
      startImage: startImage || undefined,
    })
  }

  const quickPrompts = t.raw('hero_input.quick_prompts') as string[]

  return (
    <div className="h-full space-y-6">
      {/* Main Input Container */}
      <div
        className={cn(
          'h-full flex flex-col justify-between',
          'backdrop-blur-xl bg-black/20 dark:bg-white/10 border border-white/20 dark:border-white/20 rounded-2xl px-6 py-4 shadow-2xl'
        )}
      >
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {/* Prompt Input */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center font-bold">
                <Sparkles className="w-5 inline mr-2" />
                {t('text_to_video.form.prompt_label')}
              </div>

              <ModelSelect
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
                variant="transparent"
              />
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
              <Textarea
                value={prompt}
                placeholder={t('hero_input.placeholder')}
                className={cn(
                  'bg-background w-full rounded-xl px-6 py-4 border-none text-white placeholder:text-white/60 resize-none focus-visible:ring-0 focus-visible:ring-offset-0',
                  'min-h-[120px] text-base leading-relaxed'
                )}
                ref={textareaRef}
                onChange={(e) => {
                  setPrompt(e.target.value)
                  adjustHeight()
                }}
              />
            </div>
            <div className="text-right text-white/40 text-xs mt-1">
              {prompt.length}/2500
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <UploadImage
                onImageSelect={setStartImage}
                initialImageUrl={initialData?.startImageUrl}
              />
            </div>

            {/* Parameters */}
            <div>
              <Label className="mb-2 text-white/80 text-sm font-medium">
                {t('text_to_video.form.parameters_label') || 'Parameters'}
              </Label>
              <ParametersSelect
                selectedModel={selectedModel}
                parameters={parameters}
                onParameterChange={handleParameterChange}
                variant="transparent"
                className="max-w-full"
              />
            </div>

            {/* Credits Display */}
            <div>
              <CreditsDisplay
                requiredCredits={calculateCredits()}
                variant="transparent"
                refreshTrigger={creditsRefreshTrigger}
                pricingDescription={getModelPricingDescription(
                  selectedModel,
                  parameters
                )}
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full mt-8"
          onClick={handleSubmit}
          disabled={!prompt.trim() || isGenerating}
        >
          {isGenerating ? (
            t('text_to_video.form.generating_button')
          ) : (
            <span className="flex items-center gap-2">
              {t('text_to_video.form.generate_button')}
              <span className="flex items-center gap-1">
                (<CoinsIcon className="w-4 h-4 text-yellow-500" />{' '}
                {calculateCredits()} Credits )
              </span>
            </span>
          )}
        </Button>
      </div>

      {/* Quick Prompts */}
      {/* <div className="flex flex-wrap gap-3">
        {quickPrompts.map((quickPrompt, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(quickPrompt)
              adjustHeight()
            }}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm transition-all duration-200 backdrop-blur-sm border border-white/20"
          >
            {quickPrompt}
          </button>
        ))}
      </div> */}
    </div>
  )
}
