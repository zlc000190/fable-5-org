export interface JsonSchemaProperty {
  type: string;
  title: string;
  description?: string;
  default?: any;
  enum?: any[];
  format?: string;
  'x-order'?: number;
  minimum?: number;
  maximum?: number;
  maxItems?: number;
  nullable?: boolean;
  items?: {
    type: string;
    format?: string;
  };
}

export interface JsonSchema {
  type: string;
  title: string;
  required: string[];
  properties: Record<string, JsonSchemaProperty>;
}

export interface ModelConfig {
  id: string;
  name: string;
  modelName: string; // 用于API请求的实际模型名称
  img: string; // 模型图标路径
  schema: JsonSchema;
  parseParams?: (params: Record<string, any>) => Record<string, any>; // 可选的参数转换函数，params 为请求参数
  calculateCredits?: (params: Record<string, any>) => number; // 计算积分消耗的函数
  updateSchema?: (params: Record<string, any>, schema: JsonSchema) => JsonSchema; // 根据当前参数动态更新schema
  getPricingDescription?: (params: Record<string, any>) => string; // 获取定价描述的函数
}

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  hailuo: {
    id: 'hailuo',
    name: 'Hailuo',
    modelName: 'minimax/hailuo-02',
    img: '/imgs/logos/hailuo.svg',
    parseParams: (params: Record<string, any>) => {
      const parsedParams = { ...params };

      if (params.startImageUrl) {
        parsedParams['first_frame_image'] = params.startImageUrl;
      }

      delete parsedParams.startImageUrl;

      return parsedParams;
    },
    calculateCredits: (params: Record<string, any>) => {
      const resolution = params.resolution || '768p';
      const duration = params.duration || 6;

      // 根据图片中的定价表计算积分
      if (resolution === '768p') {
        return duration === 6 ? 9 : 15; // 6秒9积分，10秒15积分
      } else if (resolution === '1080p') {
        return 16; // 1080p只支持6秒，16积分
      }

      return 9; // 默认768p 6秒消耗
    },
    updateSchema: (params: Record<string, any>, schema: JsonSchema) => {
      // 创建 schema 的深拷贝，避免修改原始配置
      const newSchema = JSON.parse(JSON.stringify(schema)) as JsonSchema;

      // 规则1：如果时长是 10 秒，则分辨率只允许是 768p
      if (params.duration === 10) {
        newSchema.properties.resolution.enum = ['768p'];
        newSchema.properties.resolution.description =
          '10 seconds duration is only available for 768p resolution.';
      }

      // 规则2：如果分辨率是 1080p，则时长只允许是 6 秒
      if (params.resolution === '1080p') {
        newSchema.properties.duration.enum = [6];
        newSchema.properties.duration.description =
          '1080p resolution only supports 6 seconds duration.';
      }

      // 规则3：如果分辨率是 768p，则时长可以是 6 或 10 秒
      if (params.resolution === '768p') {
        newSchema.properties.duration.enum = [6, 10];
        newSchema.properties.duration.description =
          '768p resolution supports both 6 and 10 seconds duration.';
      }

      return newSchema;
    },
    getPricingDescription: (params: Record<string, any>) => {
      const resolution = params.resolution || '768p';

      if (resolution === '768p') {
        return '768p: 1.5 credits/second (6s=9, 10s=15)';
      } else if (resolution === '1080p') {
        return '1080p: 2.67 credits/second (6s only=16)';
      }

      return 'Standard pricing: 1.5 credits/second';
    },
    schema: {
      type: 'object',
      title: 'Input',
      required: ['prompt'],
      properties: {
        prompt: {
          type: 'string',
          title: 'Prompt',
          'x-order': 0,
          description: 'Text prompt for generation',
        },
        duration: {
          enum: [6, 10],
          type: 'integer',
          title: 'Duration',
          description:
            'Duration of the video in seconds. 10 seconds is only available for 768p resolution.',
          default: 6,
          'x-order': 2,
        },
        resolution: {
          enum: ['768p', '1080p'],
          type: 'string',
          title: 'Resolution',
          description:
            'Pick between standard 768p, or pro 1080p resolution. The pro model is not just high resolution, it is also higher quality.',
          default: '768p',
          'x-order': 3,
        },
        prompt_optimizer: {
          type: 'boolean',
          title: 'Prompt Optimizer',
          default: true,
          'x-order': 4,
          description: 'Use prompt optimizer',
        },
        first_frame_image: {
          type: 'string',
          title: 'First Frame Image',
          format: 'uri',
          'x-order': 1,
          description:
            'First frame image for video generation. The output video will have the same aspect ratio as this image.',
        },
      },
    },
  },
};
// Helper function to get model configuration
export function getModelConfig(modelId: string): ModelConfig | null {
  return MODEL_CONFIGS[modelId] || null;
}

// Helper function to get default parameters for a model from schema
export function getModelDefaults(modelId: string): Record<string, any> {
  const config = getModelConfig(modelId);
  if (!config) return {};

  const defaults: Record<string, any> = {};

  Object.entries(config.schema.properties).forEach(([key, property]) => {
    if (property.default !== undefined) {
      defaults[key] = property.default;
    }
  });

  return defaults;
}

// Helper function to get schema properties sorted by x-order
export function getSchemaPropertiesSorted(
  schema: JsonSchema
): Array<[string, JsonSchemaProperty]> {
  return Object.entries(schema.properties)
    .filter(
      ([key]) =>
        key !== 'prompt' &&
        key !== 'first_frame_image' &&
        key !== 'start_image' &&
        key !== 'reference_images'
    ) // Exclude prompt and image fields as they're handled separately
    .sort(([, a], [, b]) => (a['x-order'] || 0) - (b['x-order'] || 0));
}

// Helper function to get required parameters for a model
export function getModelRequiredParams(modelId: string): string[] {
  const config = getModelConfig(modelId);
  if (!config) return [];

  return config.schema.required || [];
}

// Helper function to validate required parameters
export function validateRequiredParams(
  modelId: string,
  params: Record<string, any>
): { isValid: boolean; missingParams: string[] } {
  const requiredParams = getModelRequiredParams(modelId);

  const missingParams: string[] = [];

  for (const param of requiredParams) {
    // 特殊处理图片相关参数
    if (
      params[param] === undefined ||
      params[param] === null ||
      params[param] === ''
    ) {
      missingParams.push(param);
    }
  }

  return {
    isValid: missingParams.length === 0,
    missingParams,
  };
}

// Helper function to calculate credits for a model
export function calculateModelCredits(
  modelId: string,
  params: Record<string, any>
): number {
  const config = getModelConfig(modelId);
  if (!config || !config.calculateCredits) {
    return 0; // 如果没有配置积分计算函数，返回0
  }

  return config.calculateCredits(params);
}

// Helper function to get effective schema with dynamic updates
export function getEffectiveSchema(
  modelId: string,
  params: Record<string, any>
): JsonSchema | null {
  const config = getModelConfig(modelId);
  if (!config) return null;

  // 如果模型配置了 updateSchema 函数，就调用它
  if (config.updateSchema) {
    return config.updateSchema(params, config.schema);
  }

  // 否则，返回原始 schema
  return config.schema;
}

// Helper function to get pricing description for a model
export function getModelPricingDescription(
  modelId: string,
  params: Record<string, any>
): string {
  const config = getModelConfig(modelId);
  if (!config || !config.getPricingDescription) {
    return 'Pricing not available';
  }

  return config.getPricingDescription(params);
}
