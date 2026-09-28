export type Tone = 'Professional' | 'Casual' | 'Punchy';
export type Language = 'Turkish' | 'English';

export interface GeneratedContent {
  linkedin: string;
  reels: string[];
  twitterThread: string[];
}

const TR = {
  hook: 'İşte öğrenmeniz gerekenler:',
  keyPoints: 'Anahtar noktalar:',
  takeaway: 'Alınacak ders:',
  cta: 'Ne düşünüyorsunuz? Aşağıya yorum yapın 👇',
  reel1: 'Reel 1 — Kanca',
  reel2: 'Reel 2 — Derinlemesine',
  reel3: 'Reel 3 — Sonuç & CTA',
  thread1: 'Bu konuyu açıklayalım 🧵',
  thread2: 'Adım adım:',
  threadEnd: 'Umarım bu yardımcı olmuştur. Başka sorularınız varsa, bilet atın!',
};

const EN = {
  hook: "Here's what you need to know:",
  keyPoints: 'Key takeaways:',
  takeaway: 'The big takeaway:',
  cta: 'What do you think? Drop a comment below 👇',
  reel1: 'Reel 1 — The Hook',
  reel2: 'Reel 2 — Deep Dive',
  reel3: 'Reel 3 — Payoff & CTA',
  thread1: "Let's break this down 🧵",
  thread2: 'Step by step:',
  threadEnd: 'Hope this was helpful. Got questions? Hit me up!',
};

function t(lang: Language) {
  return lang === 'Turkish' ? TR : EN;
}

function splitIntoSentences(text: string): string[] {
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function extractKeyPoints(text: string, max: number): string[] {
  const sentences = splitIntoSentences(text);
  const points: string[] = [];
  const step = Math.max(1, Math.floor(sentences.length / max));
  for (let i = 0; i < sentences.length && points.length < max; i += step) {
    points.push(sentences[i]);
  }
  if (points.length === 0 && sentences.length > 0) {
    points.push(sentences[0]);
  }
  return points;
}

function applyTone(text: string, tone: Tone): string {
  if (tone === 'Punchy') {
    return text
      .replace(/\bvery\b/gi, '')
      .replace(/\breally\b/gi, '')
      .replace(/\bjust\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  if (tone === 'Casual') {
    return text;
  }
  return text;
}

export function generateContent(
  inputText: string,
  _youtubeUrl: string,
  tone: Tone,
  lang: Language
): GeneratedContent {
  const L = t(lang);
  const cleanText = inputText.trim() || (lang === 'Turkish' ? 'İçerik girilmedi.' : 'No content provided.');
  const sentences = splitIntoSentences(cleanText);
  const keyPoints = extractKeyPoints(cleanText, 4);
  const firstSentence = sentences[0] || cleanText;
  const toneText = applyTone(firstSentence, tone);

  const linkedin = buildLinkedIn(toneText, keyPoints, tone, lang, L);
  const reels = buildReels(toneText, keyPoints, tone, lang, L);
  const twitterThread = buildTwitterThread(toneText, keyPoints, tone, lang, L);

  return { linkedin, reels, twitterThread };
}

function buildLinkedIn(
  hook: string,
  keyPoints: string[],
  tone: Tone,
  lang: Language,
  L: typeof EN
): string {
  const lines: string[] = [];

  if (tone === 'Punchy') {
    lines.push(hook.toUpperCase());
  } else if (tone === 'Casual') {
    lines.push(`So... ${hook}`);
  } else {
    lines.push(hook);
  }

  lines.push('');
  lines.push(L.keyPoints);
  lines.push('');

  keyPoints.forEach((pt, i) => {
    lines.push(`${i + 1}. ${applyTone(pt, tone)}`);
  });

  lines.push('');
  lines.push(`${L.takeaway} ${applyTone(keyPoints[keyPoints.length - 1] || hook, tone)}`);
  lines.push('');
  lines.push(L.cta);

  if (lang === 'Turkish') {
    lines.push('');
    lines.push('#içerik #üretim #strateji');
  } else {
    lines.push('');
    lines.push('#content #strategy #growth');
  }

  return lines.join('\n');
}

function buildReels(
  hook: string,
  keyPoints: string[],
  tone: Tone,
  lang: Language,
  L: typeof EN
): string[] {
  const reels: string[] = [];

  const reel1 = [
    `🎬 ${L.reel1}`,
    '',
    lang === 'Turkish' ? '[0-3s] Görsel: Ekranda metin belirir' : '[0-3s] Visual: Text pops on screen',
    '',
    lang === 'Turkish' ? 'Ses: ' : 'VO: ',
    applyTone(hook, tone),
    '',
    lang === 'Turkish' ? '[3-7s] Hızlı kesimler, enerji yüksek' : '[3-7s] Fast cuts, high energy',
    '',
    lang === 'Turkish' ? 'Ses: ' : 'VO: ',
    lang === 'Turkish' ? 'Bunu kaçırma!' : "Don't miss this!",
  ].join('\n');
  reels.push(reel1);

  const reel2 = [
    `🎬 ${L.reel2}`,
    '',
    lang === 'Turkish' ? '[0-3s] Önceki reel\'den tekrar' : "[0-3s] Recap from previous reel",
    '',
    lang === 'Turkish' ? 'Ses: ' : 'VO: ',
    applyTone(keyPoints[0] || hook, tone),
    '',
    lang === 'Turkish' ? '[3-10s] Detaylı açıklama, ekran görüntüleri' : '[3-10s] Detailed explanation, screen recordings',
    '',
    lang === 'Turkish' ? 'Ses: ' : 'VO: ',
    applyTone(keyPoints[1] || keyPoints[0] || hook, tone),
    '',
    lang === 'Turkish' ? '[10-15s] Örnek göster' : '[10-15s] Show example',
  ].join('\n');
  reels.push(reel2);

  const reel3 = [
    `🎬 ${L.reel3}`,
    '',
    lang === 'Turkish' ? '[0-3s] Sonuç göster' : '[0-3s] Show the payoff',
    '',
    lang === 'Turkish' ? 'Ses: ' : 'VO: ',
    applyTone(keyPoints[keyPoints.length - 1] || hook, tone),
    '',
    lang === 'Turkish' ? '[3-7s] Özetle' : '[3-7s] Wrap it up',
    '',
    lang === 'Turkish' ? 'Ses: ' : 'VO: ',
    lang === 'Turkish' ? 'Takip et, daha fazlası geliyor!' : 'Follow for more!',
    '',
    lang === 'Turkish' ? '[7-10s] CTA: Yorum yap, beğen, paylaş' : '[7-10s] CTA: Comment, like, share',
  ].join('\n');
  reels.push(reel3);

  return reels;
}

function buildTwitterThread(
  hook: string,
  keyPoints: string[],
  tone: Tone,
  lang: Language,
  L: typeof EN
): string[] {
  const thread: string[] = [];

  thread.push(`${hook}\n\n${L.thread1}`);

  keyPoints.forEach((pt, i) => {
    thread.push(`${i + 2}/${keyPoints.length + 2}\n${applyTone(pt, tone)}`);
  });

  thread.push(`${keyPoints.length + 2}/${keyPoints.length + 2}\n${L.threadEnd}`);

  return thread;
}
