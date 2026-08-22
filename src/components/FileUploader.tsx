import { useRef, useState } from 'react';
import { FileUp, X, Plus, AlertCircle } from 'lucide-react';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from '@/config/tools';

type Props = { accept: string[]; multiple?: boolean; files: File[]; onChange: (files: File[]) => void };
const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function FileUploader({ accept, multiple, files, onChange }: Props) {
  const input = useRef<HTMLInputElement>(null); const [error, setError] = useState('');
  const addFiles = (list: FileList | null) => { if (!list) return; const next = [...(multiple ? files : [])]; for (const file of Array.from(list)) { const ext = file.name.split('.').pop()?.toUpperCase() || ''; if (!accept.includes(ext)) { setError(`Please choose a ${accept.join(' or ')} file.`); continue; } if (file.size > MAX_FILE_SIZE) { setError(`Each file must be smaller than ${MAX_FILE_SIZE_MB} MB.`); continue; } if (!next.some((item) => item.name === file.name && item.size === file.size)) next.push(file); } setError(''); onChange(next); };
  return <div className="space-y-4">
    <div className={`dropzone ${files.length ? 'has-files' : ''}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }} onClick={() => input.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}>
      <input ref={input} type="file" className="sr-only" accept={accept.map((type) => `.${type.toLowerCase()}`).join(',')} multiple={multiple} onChange={(e) => addFiles(e.target.files)} />
      <div className="upload-icon"><FileUp size={26} /></div><p className="text-lg font-semibold text-slate-900">{multiple && files.length ? 'Add more files' : 'Drag & drop your file here'}</p><p className="mt-1 text-slate-500">or</p><button type="button" className="button-secondary mt-3" onClick={(e) => { e.stopPropagation(); input.current?.click(); }}><Plus size={17} /> Choose File</button><p className="mt-4 text-xs text-slate-500">Supported format: {accept.join(', ')} · Maximum file size: {MAX_FILE_SIZE_MB} MB</p>
    </div>
    {error && <div className="notice-error"><AlertCircle size={17} />{error}</div>}
    {files.length > 0 && <div className="space-y-2">{files.map((file, index) => <div className="file-row" key={`${file.name}-${file.size}`}><div className="file-badge">{file.name.split('.').pop()?.toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate font-medium text-slate-800">{file.name}</p><p className="text-xs text-slate-500">{formatSize(file.size)}</p></div><button type="button" aria-label={`Remove ${file.name}`} className="icon-button" onClick={() => onChange(files.filter((_, i) => i !== index))}><X size={18} /></button></div>)}</div>}
  </div>;
}
