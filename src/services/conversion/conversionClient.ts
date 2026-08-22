import type { ConversionResult, ConvertParams } from './types';

const API_URL = import.meta.env.VITE_CONVERSION_API_URL ?? '';

export function isBackendConfigured(): boolean {
  return Boolean(API_URL);
}

export async function convertViaBackend({ toolId, files, options = {} }: ConvertParams): Promise<ConversionResult> {
  if (!isBackendConfigured()) {
    return {
      success: false,
      error: 'Conversion service is currently unavailable. Please try again later.',
    };
  }

  const formData = new FormData();
  formData.append('toolId', toolId);
  for (const file of files) {
    formData.append('files', file, file.name);
  }
  if (options.compression) formData.append('compression', options.compression);
  if (options.pageRange) formData.append('pageRange', options.pageRange);

  try {
    const response = await fetch(`${API_URL}/api/convert`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const message = await response.text().catch(() => '');
      return {
        success: false,
        error: message || `Conversion failed (HTTP ${response.status}). Please try again later.`,
      };
    }

    const blob = await response.blob();
    const filename = response.headers.get('X-Output-Filename') || 'converted-file';
    const mimeType = response.headers.get('Content-Type') || 'application/octet-stream';

    return {
      success: true,
      outputFile: blob,
      filename,
      mimeType,
    };
  } catch {
    return {
      success: false,
      error: 'Conversion service is currently unavailable. Please try again later.',
    };
  }
}
