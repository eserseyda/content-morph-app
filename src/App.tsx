import { useState } from 'react';
import { Header } from '@/components/Header';
import { InputSection } from '@/components/InputSection';
import { OutputDashboard } from '@/components/OutputDashboard';
import { SettingsModal } from '@/components/SettingsModal';
import { generateWithGemini, hasApiKey, getApiKey } from '@/lib/gemini';
import type { Tone, Language, GeneratedContent } from '@/lib/generator';

function App() {
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(hasApiKey());

  const handleGenerate = async (text: string, url: string, tone: Tone, lang: Language) => {
    setIsLoading(true);
    setGenerated(null);
    setError(null);

    try {
      const content = await generateWithGemini(text, url, tone, lang);
      setGenerated(content);
      setTimeout(() => {
        document.getElementById('output-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
    setApiKeySet(getApiKey().length > 0);
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-sky-500/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      <Header onOpenSettings={() => setSettingsOpen(true)} hasApiKey={apiKeySet} />

      <main>
        <InputSection onGenerate={handleGenerate} isLoading={isLoading} />

        {error && (
          <div className="max-w-4xl mx-auto px-6 pb-4 animate-fade-in">
            <div className="glass-card rounded-2xl p-5 border-red-500/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                  <span className="text-red-400 text-sm font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-300 mb-1">Generation failed</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{error}</p>
                  {!apiKeySet && (
                    <button
                      onClick={() => setSettingsOpen(true)}
                      className="mt-2 text-xs text-teal-400 hover:text-teal-300 font-medium"
                    >
      Click here to add your Gemini API key in Settings.
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="max-w-4xl mx-auto px-6 pb-16">
            <div className="glass-card rounded-2xl p-8 gradient-border">
              <div className="space-y-4">
                <div className="h-6 w-48 shimmer-bg rounded-lg" />
                <div className="h-4 w-full shimmer-bg rounded-lg" />
                <div className="h-4 w-3/4 shimmer-bg rounded-lg" />
                <div className="h-4 w-5/6 shimmer-bg rounded-lg" />
                <div className="h-24 w-full shimmer-bg rounded-xl mt-6" />
                <div className="h-4 w-2/3 shimmer-bg rounded-lg" />
              </div>
              <p className="text-center text-teal-400 text-sm font-medium mt-6 animate-pulse">
                {apiKeySet ? 'Crafting your content with AI...' : 'Generating content...'}
              </p>
            </div>
          </div>
        )}

        {generated && !isLoading && (
          <div id="output-section">
            <OutputDashboard content={generated} />
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-[#1e2128] py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center">
          <p className="text-xs text-gray-600">
            ContentMorph — Transform once, publish everywhere
          </p>
        </div>
      </footer>

      <SettingsModal open={settingsOpen} onClose={handleSettingsClose} />
    </div>
  );
}

export default App;
