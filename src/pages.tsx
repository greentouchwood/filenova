import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Download, FileOutput, HelpCircle, LoaderCircle, LockKeyhole, RotateCcw, Search, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react';
import { tools, getTool, type Tool, type ToolId } from '@/config/tools';
import { FileUploader } from '@/components/FileUploader';
import { AdBanner } from '@/components/Layout';
import { convert, type ConversionOptions } from '@/services/conversion';

export function Home() { return <><section className="hero"><div className="shell hero-grid"><div className="hero-copy"><div className="eyebrow"><Sparkles size={15}/> 100% Free <i/> No Registration</div><h1>Convert, Compress &<br/><em>Manage Your Files</em> Online</h1><p>Fast and simple online tools for PDF, Word, Excel, PowerPoint and image files.</p><div className="hero-actions"><Link to="/tools" className="button-primary">Choose a Tool <ArrowRight size={18}/></Link><Link to="/tools" className="button-ghost">Explore All Tools</Link></div><div className="trust-row"><span><ShieldCheck size={17}/> Private by design</span><span><LockKeyhole size={16}/> No account needed</span></div></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-file"><FileOutput size={42}/><span>FILE<br/><strong>NOVA</strong></span></div><div className="float-chip chip-top"><UploadCloud size={17}/> Drop & convert</div><div className="float-chip chip-bottom"><CheckCircle2 size={17}/> Simple & free</div></div></div></section><div className="shell"><AdBanner/><section className="section"><SectionHeading kicker="START HERE" title="Popular Tools" text="Everything you need to make everyday file work feel effortless."/><ToolGrid items={tools}/></section><AdBanner variant="rectangle"/></div></>; }

function SectionHeading({ kicker, title, text }: { kicker: string; title: string; text: string }) { return <div className="section-heading"><div><span className="kicker">{kicker}</span><h2>{title}</h2></div><p>{text}</p></div>; }
function ToolCard({ tool }: { tool: Tool }) { const Icon = tool.icon; return <Link to={tool.route} className="tool-card"><div className="tool-icon"><Icon size={22}/></div><div className="tool-card-body"><div className="tool-card-top"><h3>{tool.name}</h3><span className="arrow"><ArrowRight size={17}/></span></div><p>{tool.description}</p><span className="tool-meta">{tool.inputTypes.join(' / ')} <b>→</b> {tool.outputType}</span></div></Link>; }
function ToolGrid({ items }: { items: Tool[] }) { return <div className="tool-grid">{items.map((tool) => <ToolCard key={tool.id} tool={tool}/>)}</div>; }

export function ToolsPage({ category }: { category?: 'PDF'|'Office'|'Images' }) { const [query, setQuery] = useState(''); const list = category ? tools.filter((tool) => tool.category === category || (category === 'PDF' && tool.inputTypes.includes('PDF'))) : tools; const filtered = list.filter((tool) => `${tool.name} ${tool.description}`.toLowerCase().includes(query.toLowerCase())); const title = category ? `${category === 'PDF' ? 'Free PDF' : category} Tools` : 'All File Tools'; return <div className="shell page-space"><div className="page-intro"><span className="kicker">FILE WORKFLOWS</span><h1>{title}</h1><p>{category === 'PDF' ? 'Free tools to convert, organize, and optimize your PDF documents.' : 'Explore simple, focused tools for your everyday documents and images.'}</p></div><div className="tool-toolbar"><label className="search-box"><Search size={18}/><input aria-label="Search tools" placeholder="Search tools" value={query} onChange={(e) => setQuery(e.target.value)}/></label><div className="filter-pills">{['All','PDF','Office','Images'].map((item) => <Link key={item} className={(!category && item === 'All') || category === item ? 'filter-pill active' : 'filter-pill'} to={item === 'All' ? '/tools' : `/${item.toLowerCase()}-tools`}>{item}</Link>)}</div></div>{filtered.length ? <ToolGrid items={filtered}/> : <div className="empty-state">No tools match that search.</div>}{category === 'PDF' && <div className="content-card"><h2>Free PDF Tools</h2><p>FileNova keeps common PDF tasks clear and approachable. Choose a tool above to begin without creating an account.</p></div>}</div>; }

export function ToolPage() { const { slug = '' } = useParams(); const tool = getTool(slug); if (!tool) return <NotFound/>; return <ConverterPage tool={tool}/>; }
function ConverterPage({ tool }: { tool: Tool }) { const [files, setFiles] = useState<File[]>([]); const [status, setStatus] = useState<'idle'|'processing'|'complete'|'error'>('idle'); const [result, setResult] = useState<Awaited<ReturnType<typeof convert>> | null>(null); const [error, setError] = useState(''); const [compression, setCompression] = useState<ConversionOptions['compression']>('recommended'); const [pageRange, setPageRange] = useState(''); const [pages, setPages] = useState<number | null>(null);
 useEffect(() => { document.title = `${tool.name} Converter - Free Online | FileNova`; const meta = document.querySelector('meta[name="description"]'); if (meta) meta.setAttribute('content', `${tool.description} Use FileNova online for free with no registration.`); }, [tool]);
 const submit = async () => { if (!files.length || status === 'processing') { if (!files.length) setError('Choose a file to continue.'); return; } setStatus('processing'); setError(''); setResult(null); try { const output = await convert({ toolId: tool.id as ToolId, files, options: { compression, pageRange } }); if (!output.success) throw new Error(output.error); setResult(output); setStatus('complete'); } catch (e) { setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.'); setStatus('error'); } };
 const reset = () => { setFiles([]); setResult(null); setError(''); setStatus('idle'); setPages(null); };
 const onFiles = async (next: File[]) => { setFiles(next); setResult(null); setStatus('idle'); if (next[0]?.type === 'application/pdf') { try { const { PDFDocument } = await import('pdf-lib'); const doc = await PDFDocument.load(await next[0].arrayBuffer()); setPages(doc.getPageCount()); } catch { setPages(null); } } };
 const ToolIcon = tool.icon; return <div className="shell page-space"><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to={tool.category === 'PDF' ? '/pdf-tools' : `/${tool.category.toLowerCase()}-tools`}>{tool.category} Tools</Link><span>/</span><strong>{tool.name}</strong></div><div className="tool-hero"><div><span className="kicker">{tool.category.toUpperCase()} TOOL</span><h1>{tool.name} Converter</h1><p>{tool.intro}</p></div><div className="tool-hero-mark"><ToolIcon size={34}/></div></div><AdBanner/><div className="converter-layout"><section className="converter-card"><div className="converter-card-head"><div><h2>Upload your {tool.inputTypes.join(' / ')} file{tool.multiple ? 's' : ''}</h2><p>Files are processed temporarily and are not saved to an account or conversion history.</p></div><span className="secure-label"><LockKeyhole size={15}/> Private</span></div><FileUploader accept={tool.inputTypes} multiple={tool.multiple} files={files} onChange={onFiles}/>{pages && <p className="info-line">Your PDF contains <strong>{pages} pages</strong>.</p>}{tool.id === 'compress-pdf' && <div className="option-box"><h3>Compression level</h3><div className="option-grid">{[['recommended','Recommended','Balanced size and quality'],['high','High Compression','Smaller file, good quality'],['maximum','Maximum Compression','Smallest file, quality may vary']].map(([value,label,desc]) => <label key={value} className={compression === value ? 'option selected' : 'option'}><input type="radio" checked={compression === value} onChange={() => setCompression(value as ConversionOptions['compression'])}/><span><b>{label}</b><small>{desc}</small></span></label>)}</div></div>}{tool.id === 'split-pdf' && <div className="option-box"><h3>Page selection <span>Optional</span></h3><input className="text-input" placeholder="Example: 1-3, 4-7" value={pageRange} onChange={(e) => setPageRange(e.target.value)}/><small className="field-help">Leave blank to create one file per page.</small></div>}{error && <div className="notice-error"><HelpCircle size={17}/>{error}</div>}{status === 'processing' && <div className="progress-box"><LoaderCircle className="spin" size={21}/><div><b>Processing your file</b><span>Preparing your result securely…</span></div></div>}{status === 'complete' && result && <Result result={result} original={files[0]} onReset={reset}/>} {status !== 'complete' && <button className="button-primary submit-button" disabled={status === 'processing'} onClick={submit}>{status === 'processing' ? 'Processing…' : tool.id === 'merge-pdf' ? 'Merge PDFs' : tool.id === 'split-pdf' ? 'Split PDF' : tool.id === 'jpg-to-pdf' ? 'Create PDF' : `Convert to ${tool.outputType}`} <ArrowRight size={18}/></button>}</section><aside className="converter-aside"><div className="aside-card"><ShieldCheck size={23}/><h3>Simple and private</h3><p>No login, no permanent storage, and no conversion history. Your browser handles supported operations directly.</p></div><AdBanner variant="rectangle"/></aside></div><ToolContent tool={tool}/></div>; }
function Result({ result, original, onReset }: { result: Awaited<ReturnType<typeof convert>>; original: File; onReset: () => void }) { const download = (blob: Blob, name: string) => { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); }; return <div className="result-box"><CheckCircle2 className="success-icon" size={30}/><h2>Conversion Complete</h2><p>Your file is ready to download.</p>{result.files && result.files.length > 1 ? <div className="result-files">{result.files.map((item) => <button key={item.filename} className="download-row" onClick={() => download(item.blob, item.filename)}><span>{item.filename}</span><Download size={17}/></button>)}</div> : <div className="result-file"><div><small>Original file</small><b>{original.name}</b></div><div><small>Output file</small><b>{result.filename}</b></div></div>}<div className="result-actions"><button className="button-primary" onClick={() => download(result.outputFile!, result.filename!)}><Download size={18}/> Download File</button><button className="button-ghost" onClick={onReset}><RotateCcw size={17}/> Convert Another</button></div></div>; }
function ToolContent({ tool }: { tool: Tool }) { const related = tools.filter((item) => item.id !== tool.id && (item.category === tool.category || item.inputTypes.some((x) => tool.inputTypes.includes(x)))).slice(0,4); return <section className="tool-content"><div><h2>How to use our {tool.name.toLowerCase()} converter</h2><ol><li>Upload your {tool.inputTypes.join(' or ')} file{tool.multiple ? 's' : ''}.</li><li>Start the conversion and let FileNova process your files.</li><li>Download your {tool.outputType} result when it is ready.</li></ol><h2>Why use FileNova?</h2><p>FileNova makes everyday file work straightforward: clear tools, no registration, and no account history. Operations that need a server conversion engine are labeled honestly rather than producing an unreliable placeholder file.</p><h2>Frequently Asked Questions</h2><details><summary>Is FileNova free to use?</summary><p>Yes. The first release is designed as a free, no-account file utility platform.</p></details><details><summary>Are my files saved?</summary><p>No user account or permanent file history is created. Browser-side operations stay in the current session.</p></details></div><div className="related"><h3>Related Tools</h3>{related.map((item) => <Link key={item.id} to={item.route}>{item.name}<ArrowRight size={16}/></Link>)}</div></section>; }

export function SimplePage({ type }: { type: 'about'|'privacy'|'terms'|'contact' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const content = {
    about: [
      'About FileNova',
      'FileNova provides simple online tools for converting and managing documents without requiring registration. Our goal is to make routine file tasks feel clear, focused, and approachable.'
    ],
    privacy: [
      'Privacy',
      'FileNova does not create user accounts or conversion history. Files processed in your browser remain available only to the current session. Future server processing will use temporary files and should remove inputs and outputs after the operation completes. Do not upload confidential material until the relevant server processing is connected and independently reviewed.'
    ],
    terms: [
      'Terms',
      'FileNova is provided as a free utility platform. You are responsible for the files you choose to process and for checking the output before relying on it. Tools that require a server conversion engine may be unavailable until that service is connected.'
    ],
    contact: [
      'Contact',
      'We would like to hear from you. Send us a message and we will receive it at our support email.'
    ]
  }[type];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (sending) return;

    setSending(true);
    setSent(false);
    setError('');

    try {
      await emailjs.send(
        'service_4n8g6jv',
        'template_brxkyyf',
        {
          name,
          email,
          message,
          title: 'FileNova Contact',
          time: new Date().toLocaleString()
        },
        {
          publicKey: '9QLN3rOjWkC-xp_uL'
        }
      );

      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('EmailJS error:', err);
      setError('Sorry, your message could not be sent. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="shell page-space narrow-page">
      <span className="kicker">FILENOVA</span>
      <h1>{content[0]}</h1>
      <p className="lead">{content[1]}</p>

      {type === 'contact' && (
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              className="text-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              className="text-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Message
            <textarea
              className="text-input"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>

          {sent && (
            <p className="field-help" style={{ color: '#16a34a' }}>
              Message sent successfully. Thank you for contacting FileNova.
            </p>
          )}

          {error && (
            <p className="field-help" style={{ color: '#dc2626' }}>
              {error}
            </p>
          )}

          <button
            className="button-primary"
            type="submit"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Message'}
            {!sending && <ArrowRight size={17} />}
          </button>
        </form>
      )}
    </div>
  );
}
function NotFound() {
  return (
    <div className="shell page-space narrow-page">
      <h1>Page not found</h1>
      <p className="lead">
        The page you are looking for does not exist.
      </p>
      <Link to="/tools" className="button-primary">
        Browse all tools
      </Link>
    </div>
  );
}