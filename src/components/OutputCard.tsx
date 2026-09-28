import { useState } from 'react';
import { Copy, Check, Pencil, Save, X } from 'lucide-react';

interface OutputCardProps {
  title: string;
  content: string;
  index: number;
}

export function OutputCard({ title, content, index }: OutputCardProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(isEditing ? editedContent : content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = isEditing ? editedContent : content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    <div
      className="glass-card rounded-2xl p-5 sm:p-6 gradient-border animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-teal-300 uppercase tracking-wider">{title}</h4>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-medium hover:bg-teal-500/25 transition-all duration-200"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700/20 border border-gray-600/30 text-gray-400 text-xs font-medium hover:bg-gray-700/30 transition-all duration-200"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700/20 border border-gray-600/30 text-gray-400 text-xs font-medium hover:bg-gray-700/30 hover:text-gray-200 transition-all duration-200"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  copied
                    ? 'bg-green-500/15 border border-green-500/30 text-green-300'
                    : 'bg-teal-500/15 border border-teal-500/30 text-teal-300 hover:bg-teal-500/25'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full min-h-[200px] bg-[#0a0b0f] border border-[#262a36] rounded-xl px-4 py-3 text-sm text-gray-100 resize-y focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all duration-200 font-mono leading-relaxed"
        />
      ) : (
        <div className="bg-[#0a0b0f]/60 border border-[#1e2128] rounded-xl px-4 py-4">
          <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-[15px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}
