import { useState } from 'react';
import { Linkedin, Video, Twitter, MessageSquare } from 'lucide-react';
import { OutputCard } from './OutputCard';
import type { GeneratedContent } from '@/lib/generator';

interface OutputDashboardProps {
  content: GeneratedContent;
}

type Tab = 'linkedin' | 'reels' | 'twitter';

const tabs: { id: Tab; label: string; icon: typeof Linkedin }[] = [
  { id: 'linkedin', label: 'LinkedIn Post', icon: Linkedin },
  { id: 'reels', label: '3x Reels Scripts', icon: Video },
  { id: 'twitter', label: 'X (Twitter) Thread', icon: Twitter },
];

export function OutputDashboard({ content }: OutputDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('linkedin');

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 pb-16 animate-fade-in">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-1.5 bg-[#12141a] border border-[#1e2128] rounded-2xl mb-6 sticky top-[73px] z-20 backdrop-blur-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500/20 to-sky-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.id === 'linkedin' ? 'LinkedIn' : tab.id === 'reels' ? 'Reels' : 'Thread'}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'linkedin' && (
        <OutputCard title="LinkedIn Post" content={content.linkedin} index={0} />
      )}

      {activeTab === 'reels' && (
        <div className="space-y-4">
          {content.reels.map((reel, i) => (
            <OutputCard key={i} title={`Reel Script ${i + 1}`} content={reel} index={i} />
          ))}
        </div>
      )}

      {activeTab === 'twitter' && (
        <div className="space-y-3">
          {content.twitterThread.map((tweet, i) => (
            <div key={i} className="relative">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center text-xs font-bold text-[#0a0b0f] shrink-0">
                    {i + 1}
                  </div>
                  {i < content.twitterThread.length - 1 && (
                    <div className="w-0.5 flex-1 bg-[#262a36] mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <OutputCard title={`Tweet ${i + 1}`} content={tweet} index={i} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regenerate hint */}
      <div className="flex items-center justify-center gap-2 mt-8 text-gray-500 text-xs">
        <MessageSquare className="w-3.5 h-3.5" />
        <span>Want a different angle? Update your content above and generate again.</span>
      </div>
    </section>
  );
}
