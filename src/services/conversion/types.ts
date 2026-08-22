import type { ToolId } from '@/config/tools';

export type ConversionResult = {
  success: boolean;
  outputFile?: Blob;
  filename?: string;
  mimeType?: string;
  error?: string;
  files?: { blob: Blob; filename: string }[];
};

export type ConversionOptions = {
  compression?: 'recommended' | 'high' | 'maximum';
  pageRange?: string;
};

export type ConvertParams = {
  toolId: ToolId;
  files: File[];
  options?: ConversionOptions;
};

export type Converter = (params: ConvertParams) => Promise<ConversionResult>;
