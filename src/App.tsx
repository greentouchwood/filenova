import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shell } from '@/components/Layout';
import { Home, ToolsPage, ToolPage, SimplePage } from '@/pages';

export default function App() {
  return <BrowserRouter><Shell><Routes><Route path="/" element={<Home/>}/><Route path="/tools" element={<ToolsPage/>}/><Route path="/pdf-tools" element={<ToolsPage category="PDF"/>}/><Route path="/office-tools" element={<ToolsPage category="Office"/>}/><Route path="/image-tools" element={<ToolsPage category="Images"/>}/><Route path="/about" element={<SimplePage type="about"/>}/><Route path="/privacy" element={<SimplePage type="privacy"/>}/><Route path="/terms" element={<SimplePage type="terms"/>}/><Route path="/contact" element={<SimplePage type="contact"/>}/><Route path="/:slug" element={<ToolPage/>}/></Routes></Shell></BrowserRouter>;
}
