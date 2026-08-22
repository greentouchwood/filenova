import type { ConversionResult, ConvertParams, Converter } from './types';
import { imagesToPdf, mergePdfs, splitPdf, compressPdf } from './localConverters';
import { convertViaBackend } from './conversionClient';

const localConverters: Partial<Record<string, Converter>> = {
  'jpg-to-pdf': imagesToPdf,
  'merge-pdf': mergePdfs,
  'split-pdf': splitPdf,
  'compress-pdf': compressPdf,
};

export async function convert(params: ConvertParams): Promise<ConversionResult> {
  const local = localConverters[params.toolId];
  if (local) return local(params);
  return convertViaBackend(params);
}

export type { ConversionResult, ConversionOptions, ConvertParams } from './types';
