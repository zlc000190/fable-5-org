'use client';

import { CoinsIcon, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  calculateModelCredits,
  getModelDefaults,
  getModelPricingDescription,
  validateRequiredParams,
} from '@/config/model-config';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';

import CreditsDisplay from './credits-display';
import ModelSelect from './model-select';
import ParametersSelect from './parameters-select';
import UploadImage from './upload-image';

interface VideoGenerationFormProps {
  onGenerate: (formData: {
    prompt: string;
    model: string;
    parameters: Record<string, any>;
    startImage?: File;
  }) => void;
  isGenerating: boolean;
  initialData?: {
    prompt?: string;
    model?: string;
    parameters?: Record<string, any>;
    startImageUrl?: string;
  };
  onGenerationSuccess?: () => void;
}

export default function VideoGenerationForm({
  onGenerate,
  isGenerating,
  initialData,
  onGenerationSuccess,
}: VideoGenerationFormProps) {
  const t = useTranslations('video.text_to_video.form');
  const tVideo = useTranslations('video');
  const [prompt, setPrompt] = useState(initialData?.prompt || '');
  const [selectedModel, setSelectedModel] = useState(
    initialData?.model || 'hailuo'
  );
  const [parameters, setParameters] = useState<Record<string, any>>(() => {
    if (initialData?.parameters) {
      return initialData.parameters;
    }
    return getModelDefaults('hailuo');
  });
  const [startImage, setStartImage] = useState<File | null>(null);
  const [creditsRefreshTrigger, setCreditsRefreshTrigger] = useState(0);
  const prevIsGeneratingRef = useRef(isGenerating);

  const calculateCredits = () => {
    try {
      return calculateModelCredits(selectedModel, parameters);
    } catch (error) {
      console.error('Error calculating credits:', error);
      return 0;
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    if (!initialData) {
      setParameters(getModelDefaults(modelId));
    }
  };

  const handleParameterChange = (paramId: string, value: any) => {
    setParameters((prev) => ({
      ...prev,
      [paramId]: value,
    }));
  };

  useEffect(() => {
    if (initialData) {
      if (initialData.prompt !== undefined) setPrompt(initialData.prompt);
      if (initialData.model !== undefined) setSelectedModel(initialData.model);
      if (initialData.parameters !== undefined) {
        setParameters(initialData.parameters);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (prevIsGeneratingRef.current && !isGenerating) {
      setCreditsRefreshTrigger((prev) => prev + 1);
      onGenerationSuccess?.();
    }
    prevIsGeneratingRef.current = isGenerating;
  }, [isGenerating, onGenerationSuccess]);

  const handleSubmit = () => {
    if (!prompt.trim() || isGenerating) return;

    const validation = validateRequiredParams(selectedModel, {
      prompt,
      startImageUrl: startImage,
      ...parameters,
    });

    if (!validation.isValid) {
      toast.error(t('errors.missing_required_params'));
      return;
    }

    onGenerate({
      prompt: prompt.trim(),
      model: selectedModel,
      parameters,
      startImage: startImage || undefined,
    });
  };

  return (
    <div className="h-full space-y-6">
      <div
        className={cn(
          'h-full flex flex-col justify-between',
          'backdrop-blur-xl bg-black/20 dark:bg-white/10 border border-white/20 dark:border-white/20 rounded-2xl px-6 py-4 shadow-2xl'
        )}
      >
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center font-bold text-white">
                <Sparkles className="w-5 inline mr-2" />
                {t('prompt_label')}
              </div>

              <ModelSelect
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
                variant="transparent"
              />
            </div>

            <Textarea
              value={prompt}
              placeholder={t('prompt_placeholder')}
              className={cn(
                'bg-background w-full rounded-xl px-6 py-4 border-none text-white placeholder:text-white/60 resize-none focus-visible:ring-0 focus-visible:ring-offset-0',
                'min-h-[120px] text-base leading-relaxed'
              )}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div>
              <UploadImage
                onImageSelect={setStartImage}
                initialImageUrl={initialData?.startImageUrl}
              />
            </div>

            <div>
              <Label className="mb-2 text-white/80 text-sm font-medium">
                {t('parameters_label')}
              </Label>
              <ParametersSelect
                selectedModel={selectedModel}
                parameters={parameters}
                onParameterChange={handleParameterChange}
                variant="transparent"
                className="max-w-full"
              />
            </div>

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
            t('generating_button')
          ) : (
            <span className="flex items-center gap-2">
              {t('generate_button')}
              <span className="flex items-center gap-1">
                (<CoinsIcon className="w-4 h-4 text-yellow-500" />{' '}
                {calculateCredits()} {tVideo('credits.unit')})
              </span>
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
