import { Sparkles, Zap, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export function Header({ onOpenSettings, hasApiKey }: HeaderProps) {
  return (
    <header className="relative z-30 border-b border-[#1e2128] bg-[#0a0b0f]/80 backdrop-blur-xl sticky top-0">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center accent-glow">
              <Zap className="w-5 h-5 text-[#0a0b0f]" fill="#0a0b0f" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Content<span className="gradient-text">Morph</span>
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              Turn one idea into many formats
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-medium text-teal-300">AI-Powered Repurposing</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-[#12141a] border border-[#262a36] text-gray-400 hover:text-teal-300 hover:border-teal-500/30 transition-all duration-200"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-medium">Settings</span>
            <span
              className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-teal-400' : 'bg-amber-400'}`}
              title={hasApiKey ? 'API key set' : 'No API key — using fallback'}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
