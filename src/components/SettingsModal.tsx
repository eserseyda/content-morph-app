import { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Check, Eye, EyeOff } from 'lucide-react';
import { getApiKey, setApiKey } from '@/lib/gemini';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setKey(getApiKey());
      setSaved(false);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    setApiKey(key);
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setApiKey('');
    setKey('');
    setSaved(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-card rounded-2xl p-6 gradient-border animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
              <Key className="w-4.5 h-4.5 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-[#1a1d27] transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Google Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setSaved(false);
              }}
              placeholder="AIza..."
              className="w-full bg-[#0a0b0f] border border-[#262a36] rounded-xl px-4 py-2.5 pr-11 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all duration-200 font-mono"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 leading-relaxed">
            Your API key is stored locally in your browser and is never sent to any server except Google's Gemini API.
            Without a key, ContentMorph falls back to a basic template-based generator.
          </p>
        </div>

        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors mb-5"
        >
          Get a free API key from Google AI Studio
          <ExternalLink className="w-3 h-3" />
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              saved
                ? 'bg-green-500/20 border border-green-500/40 text-green-300'
                : 'bg-gradient-to-r from-teal-400 to-sky-500 text-[#0a0b0f] hover:shadow-[0_0_24px_rgba(45,212,191,0.35)]'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              'Save Key'
            )}
          </button>
          {key && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl bg-[#1a1d27] border border-[#262a36] text-gray-400 text-sm font-medium hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
