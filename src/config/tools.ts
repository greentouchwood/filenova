import { FileSpreadsheet, FileText, FileImage, Layers3, Split, Minimize2, Presentation } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ToolCategory = 'PDF' | 'Office' | 'Images';
export type ToolId = 'pdf-to-word' | 'word-to-pdf' | 'pdf-to-excel' | 'excel-to-pdf' | 'pdf-to-jpg' | 'jpg-to-pdf' | 'compress-pdf' | 'merge-pdf' | 'split-pdf' | 'pdf-to-powerpoint';
export type Tool = { id: ToolId; name: string; slug: string; category: ToolCategory; inputTypes: string[]; outputType: string; description: string; intro: string; icon: LucideIcon; route: string; serverOnly?: boolean; multiple?: boolean };

export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

export const tools: Tool[] = [
  { id: 'pdf-to-word', name: 'PDF to Word', slug: 'pdf-to-word', category: 'Office', inputTypes: ['PDF'], outputType: 'DOCX', description: 'Convert PDF documents into editable Word files.', intro: 'Turn a PDF into an editable Word document while keeping your content ready for changes.', icon: FileText, route: '/pdf-to-word', serverOnly: true },
  { id: 'word-to-pdf', name: 'Word to PDF', slug: 'word-to-pdf', category: 'Office', inputTypes: ['DOCX', 'DOC'], outputType: 'PDF', description: 'Convert Word documents into PDF files.', intro: 'Create a shareable PDF from a Word document with a clean, reliable workflow.', icon: FileText, route: '/word-to-pdf', serverOnly: true },
  { id: 'pdf-to-excel', name: 'PDF to Excel', slug: 'pdf-to-excel', category: 'Office', inputTypes: ['PDF'], outputType: 'XLSX', description: 'Convert PDF tables and data into Excel.', intro: 'Extract tables and structured data from PDF files into an Excel-ready workbook.', icon: FileSpreadsheet, route: '/pdf-to-excel', serverOnly: true },
  { id: 'excel-to-pdf', name: 'Excel to PDF', slug: 'excel-to-pdf', category: 'Office', inputTypes: ['XLSX', 'XLS'], outputType: 'PDF', description: 'Convert Excel spreadsheets into PDF documents.', intro: 'Turn a spreadsheet into a polished PDF document for sharing and printing.', icon: FileSpreadsheet, route: '/excel-to-pdf', serverOnly: true },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', slug: 'pdf-to-jpg', category: 'Images', inputTypes: ['PDF'], outputType: 'JPG', description: 'Convert PDF pages into JPG images.', intro: 'Export PDF pages as crisp JPG images for presentations, websites, and sharing.', icon: FileImage, route: '/pdf-to-jpg', serverOnly: true },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', slug: 'jpg-to-pdf', category: 'Images', inputTypes: ['JPG', 'JPEG'], outputType: 'PDF', description: 'Convert JPG images into PDF documents.', intro: 'Combine one or more images into a single PDF in the order you choose.', icon: FileImage, route: '/jpg-to-pdf', multiple: true },
  { id: 'compress-pdf', name: 'Compress PDF', slug: 'compress-pdf', category: 'PDF', inputTypes: ['PDF'], outputType: 'PDF', description: 'Reduce PDF file size while keeping good quality.', intro: 'Make a PDF easier to share by reducing its file size with a compression profile.', icon: Minimize2, route: '/compress-pdf', serverOnly: true },
  { id: 'merge-pdf', name: 'Merge PDF', slug: 'merge-pdf', category: 'PDF', inputTypes: ['PDF'], outputType: 'PDF', description: 'Combine multiple PDF files into one document.', intro: 'Bring several PDF files together into one organized document.', icon: Layers3, route: '/merge-pdf', multiple: true },
  { id: 'split-pdf', name: 'Split PDF', slug: 'split-pdf', category: 'PDF', inputTypes: ['PDF'], outputType: 'PDF', description: 'Split PDF documents into separate files or page ranges.', intro: 'Separate pages from a PDF using individual pages or flexible page ranges.', icon: Split, route: '/split-pdf' },
  { id: 'pdf-to-powerpoint', name: 'PDF to PowerPoint', slug: 'pdf-to-powerpoint', category: 'Office', inputTypes: ['PDF'], outputType: 'PPTX', description: 'Convert PDF pages into PowerPoint presentations.', intro: 'Prepare PDF content for an editable PowerPoint presentation.', icon: Presentation, route: '/pdf-to-powerpoint', serverOnly: true },
];

export const getTool = (idOrSlug: string) => tools.find((tool) => tool.id === idOrSlug || tool.slug === idOrSlug);
