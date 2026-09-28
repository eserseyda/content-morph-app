import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Tone, Language, GeneratedContent } from './generator';
import { generateContent as generateFallback } from './generator';

const STORAGE_KEY = 'contentmorph_gemini_key';

export function getApiKey(): string {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export function setApiKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0;
}

function buildPrompt(text: string, youtubeUrl: string, tone: Tone, lang: Language): string {
  const langInstruction =
    lang === 'Turkish'
      ? 'Tüm çıktıları Türkçe olarak üret.'
      : 'Generate all output in English.';

  const toneInstruction =
    tone === 'Professional'
      ? 'Use a professional, authoritative tone with clear structure.'
      : tone === 'Casual'
        ? 'Use a casual, conversational, friendly tone — like talking to a friend.'
        : 'Use a punchy, high-energy, bold tone. Short sentences. Strong impact. No filler words.';

  const youtubeInstruction = youtubeUrl.trim()
    ? `The user also provided this YouTube video URL as context: ${youtubeUrl.trim()}. Consider that the content may come from or relate to this video.`
    : '';

  return `You are a content repurposing expert. Given the source content below, create three pieces of repurposed content.

${langInstruction}
${toneInstruction}
${youtubeInstruction}

SOURCE CONTENT:
"""
${text}
"""

Respond with ONLY a valid JSON object — no markdown, no code fences, no commentary. The JSON must have exactly this shape:

{
  "linkedin": "<a full LinkedIn post with a hook, key points as a numbered list, a takeaway, a CTA asking for comments, and 3-5 relevant hashtags>",
  "reels": ["<Reel 1 script with scene-by-scene timestamps [0-3s], [3-7s] etc., visual directions, and voiceover text>", "<Reel 2 script — deep dive with details>", "<Reel 3 script — payoff and call to action>"],
  "twitterThread": ["<Tweet 1 — hook + thread indicator>", "<Tweet 2>", "<Tweet 3>", "...", "<Final tweet — wrap up and CTA>"]
}

Requirements:
- LinkedIn post: 150-300 words, engaging, with line breaks between sections.
- Reels: exactly 3 scripts, each with timestamped scenes and voiceover lines.
- Twitter thread: 5-10 tweets, each under 280 characters, numbered as N/total.
- All content must be original, not a copy of the source.
- Do NOT wrap the JSON in markdown code fences.`;
}

function stripCodeFences(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  }
  return cleaned.trim();
}

export async function generateWithGemini(
  text: string,
  youtubeUrl: string,
  tone: Tone,
  lang: Language
): Promise<GeneratedContent> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return generateFallback(text, youtubeUrl, tone, lang);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = buildPrompt(text, youtubeUrl, tone, lang);

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const cleaned = stripCodeFences(raw);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Try to extract JSON from the text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }

    const data = parsed as Partial<GeneratedContent>;

    if (
      typeof data.linkedin !== 'string' ||
      !Array.isArray(data.reels) ||
      !Array.isArray(data.twitterThread)
    ) {
      throw new Error('AI response did not contain the expected content fields');
    }

    return {
      linkedin: data.linkedin,
      reels: data.reels.map((r) => String(r)),
      twitterThread: data.twitterThread.map((t) => String(t)),
    };
  } catch (err) {
    console.error('[ContentMorph] Gemini API error:', err);
    return generateFallback(text, youtubeUrl, tone, lang);
  }
}
