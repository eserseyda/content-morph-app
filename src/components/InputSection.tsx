import { useState } from 'react';
import { Sparkles, Link2, ChevronDown, Loader2, FileText } from 'lucide-react';
import type { Tone, Language } from '@/lib/generator';

interface InputSectionProps {
  onGenerate: (text: string, url: string, tone: Tone, lang: Language) => void;
  isLoading: boolean;
}

export function InputSection({ onGenerate, isLoading }: InputSectionProps) {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');
  const [lang, setLang] = useState<Language>('English');

  const charCount = text.length;
  const maxChars = 5000;
  const canGenerate = text.trim().length > 0 && !isLoading;

  const handleSubmit = () => {
    if (!canGenerate) return;
    onGenerate(text, url, tone, lang);
  };

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-8">
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
          Repurpose your content
          <br />
          <span className="gradient-text">in one click</span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
          Paste your content below and instantly get a LinkedIn post, reel scripts, and a Twitter thread — ready to publish.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-5 sm:p-6 gradient-border animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Textarea */}
        <div className="relative mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <label className="text-sm font-medium text-gray-300">Your Content</label>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxChars))}
            placeholder="Paste your blog post, article, transcript, or any long-form content here..."
            className="w-full h-40 bg-[#0a0b0f] border border-[#262a36] rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all duration-200 font-[15px] leading-relaxed"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-600 pointer-events-none">
            {charCount} / {maxChars}
          </div>
        </div>

        {/* YouTube URL */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-4 h-4 text-teal-400" />
            <label className="text-sm font-medium text-gray-300">
              YouTube URL <span className="text-gray-600 font-normal">(optional)</span>
            </label>
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full bg-[#0a0b0f] border border-[#262a36] rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all duration-200"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Dropdown
            label="Tone of Voice"
            value={tone}
            options={['Professional', 'Casual', 'Punchy']}
            onChange={(v) => setTone(v as Tone)}
          />
          <Dropdown
            label="Output Language"
            value={lang}
            options={['English', 'Turkish']}
            onChange={(v) => setLang(v as Language)}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleSubmit}
          disabled={!canGenerate}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            canGenerate
              ? 'bg-gradient-to-r from-teal-400 to-sky-500 text-[#0a0b0f] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:scale-[1.01] active:scale-[0.99]'
              : 'bg-[#1a1d27] text-gray-600 cursor-not-allowed border border-[#262a36]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Content
            </>
          )}
        </button>
      </div>
    </section>
  );
}

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

function Dropdown({ label, value, options, onChange }: DropdownProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-[#0a0b0f] border border-[#262a36] rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all duration-200 cursor-pointer pr-10"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[#12141a] text-white">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
