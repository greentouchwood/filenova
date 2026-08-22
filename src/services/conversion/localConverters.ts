import { PDFDocument } from 'pdf-lib';
import type { ConversionResult, ConvertParams } from './types';

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_');
const extension = (name: string) => name.split('.').pop()?.toLowerCase();
const outputName = (file: File, ext: string) => `${safeName(file.name.replace(/\.[^.]+$/, ''))}.${ext}`;

export async function imagesToPdf({ files }: ConvertParams): Promise<ConversionResult> {
  const pdf = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const image = extension(file.name) === 'png' ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  const bytes = await pdf.save();
  return { success: true, outputFile: new Blob([bytes as BlobPart], { type: 'application/pdf' }), filename: 'filenova-images.pdf', mimeType: 'application/pdf' };
}

export async function mergePdfs({ files }: ConvertParams): Promise<ConversionResult> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const source = await PDFDocument.load(await file.arrayBuffer());
    const pages = await merged.copyPages(source, source.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  const bytes = await merged.save();
  return { success: true, outputFile: new Blob([bytes as BlobPart], { type: 'application/pdf' }), filename: 'filenova-merged.pdf', mimeType: 'application/pdf' };
}

export async function splitPdf({ files, options = {} }: ConvertParams): Promise<ConversionResult> {
  const file = files[0];
  const source = await PDFDocument.load(await file.arrayBuffer());
  const total = source.getPageCount();
  const indexes = options.pageRange ? parseRange(options.pageRange, total) : Array.from({ length: total }, (_, i) => i);
  if (!indexes.length) return { success: false, error: 'Enter a valid page range.' };
  const resultFiles: { blob: Blob; filename: string }[] = [];
  for (const index of indexes) {
    const pdf = await PDFDocument.create();
    const [page] = await pdf.copyPages(source, [index]);
    pdf.addPage(page);
    resultFiles.push({ blob: new Blob([await pdf.save() as BlobPart], { type: 'application/pdf' }), filename: `${safeName(file.name.replace(/\.[^.]+$/, ''))}-page-${index + 1}.pdf` });
  }
  return { success: true, files: resultFiles, outputFile: resultFiles[0].blob, filename: resultFiles[0].filename, mimeType: 'application/pdf' };
}

export async function compressPdf({ files, options = {} }: ConvertParams): Promise<ConversionResult> {
  const file = files[0];
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const bytes = await pdf.save({ useObjectStreams: options.compression !== 'maximum' });
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
  return { success: true, outputFile: blob, filename: outputName(file, 'pdf'), mimeType: 'application/pdf' };
}

function parseRange(value: string, total: number) {
  const indexes = new Set<number>();
  value.split(',').forEach((part) => {
    const [start, end = start] = part.trim().split('-').map(Number);
    if (Number.isInteger(start) && Number.isInteger(end) && start > 0 && end >= start) {
      for (let n = start; n <= Math.min(end, total); n++) indexes.add(n - 1);
    }
  });
  return [...indexes].sort((a, b) => a - b);
}
