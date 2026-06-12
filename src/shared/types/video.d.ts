export interface Video {
  id: string;
  userId: string;
  prompt: string;
  model: string;
  parameters: VideoGenerationParameters;
  status: VideoStatus;
  originalVideoUrl?: string;
  videoUrl?: string;
  startImageUrl?: string;
  firstFrameImageUrl?: string;
  fileSize?: number;
  duration?: string;
  resolution?: string;
  replicatePredictionId?: string;
  generationTime?: number;
  creditsUsed: number;
  isDeleted: number;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
}

export interface VideoGenerationParameters {
  prompt: string;
  model: string;
  duration: string;
  resolution: string;
  batchSize: number;
  [key: string]: any;
}

export type VideoStatus = 'generating' | 'completed' | 'failed' | 'uploading';

export interface VideoGenerationRequest {
  prompt: string;
  model: string;
  duration: string;
  resolution: string;
  batchSize: number;
}

export interface VideoGenerationResponse {
  success: boolean;
  data?: {
    id: string;
    status: string;
    videoUrl?: string;
    originalVideoUrl?: string;
    completedAt?: string;
    generationTime?: number;
  };
  error?: string;
}
