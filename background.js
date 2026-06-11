// background.js — Ogosh v1.4
// Google Translate (free) for all languages.
// Google Gemini 1.5 Flash (free tier, no card) for Hinglish + Emotion Pulse.

const LANG_CONFIG = {
  english:    { label: 'English',   code: 'en',      ai: false },
  hindi:      { label: 'Hindi',     code: 'hi',      ai: false },
  hinglish:   { label: 'Hinglish',  code: 'hi-Latn', ai: true  },
  french:     { label: 'French',    code: 'fr',      ai: false },
  portuguese: { label: 'Português', code: 'pt',      ai: false }
};

const LANG_NAMES = {
  en: 'English', hi: 'Hindi', fr: 'French', de: 'German',
  es: 'Spanish', it: 'Italian', pt: 'Portuguese', ar: 'Arabic',
  zh: 'Chinese', ja: 'Japanese', ko: 'Korean', ru: 'Russian'
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRANSLATE') {
    translate(message.text).then(sendResponse).catch(err => sendResponse({ error: err.message }));
    return true;
  }
  if (message.type === 'ANALYZE_EMOTION') {
    analyzeEmotion(message.contact, message.messages, message.patterns)
      .then(sendResponse).catch(err => sendResponse({ error: err.message }));
    return true;
  }
});

// ── Translation ───────────────────────────────────────────────────────────────

async function translate(text) {
  const stored = await chrome.storage.sync.get(['wa_target_lang', 'wa_gemini_key']);
  const targetLang = stored.wa_target_lang || 'english';
  const apiKey = stored.wa_gemini_key?.trim();
  const lang = LANG_CONFIG[targetLang] || LANG_CONFIG.english;

  if (lang.ai && apiKey) return translateHinglishAI(text, apiKey);
  return translateGoogle(text, lang);
}

async function translateGoogle(text, lang) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'auto');
  url.searchParams.set('tl', lang.code);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(res.status === 429 ? 'Rate limited — slow down.' : `Translate error ${res.status}`);

  const data = await res.json();
  const translation = data[0].map(c => c[0] || '').join('').trim();
  const detectedCode = data[2] || '';
  return {
    translation,
    detectedLang: LANG_NAMES[detectedCode] || detectedCode.toUpperCase() || 'Auto',
    targetLang: lang.label
  };
}

async function translateHinglishAI(text, apiKey) {
  const result = await callGemini(apiKey,
    `You are a Hinglish translator. Convert the given text to natural Hinglish — the way young urban Indians actually text each other.
Rules:
- Roman script only, no Devanagari
- Natural Hindi-English mix using real slang: yaar, bhai, bro, kya scene hai, bindaas, mast, ekdum, kadak, solid, full on, timepass, sahi hai, ek number, arrey, oye, bas yaar, khatarnak, chill maar
- Match the energy and tone of the original exactly
- Return ONLY the Hinglish translation, nothing else`,
    text
  );
  return {
    translation: result,
    detectedLang: guessLang(text),
    targetLang: 'Hinglish'
  };
}

function guessLang(text) {
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi';
  if (/[àâçèéêëîïôùûü]/i.test(text)) return 'French';
  if (/[ãõáéíóúàâêô]/i.test(text)) return 'Portuguese';
  return 'English';
}

// ── Emotion analysis ──────────────────────────────────────────────────────────

async function analyzeEmotion(contactName, messages, patterns) {
  const stored = await chrome.storage.sync.get(['wa_gemini_key']);
  const apiKey = stored.wa_gemini_key?.trim();
  if (!apiKey) throw new Error('Add your Gemini API key in Ogosh settings.');

  const topEmojis = Object.entries(patterns?.emojiFreq || {})
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([e, n]) => `${e}×${n}`).join(' ');

  const msgBlock = messages.slice(-20)
    .map(m => `${m.sender}: ${m.text}`).join('\n');

  const result = await callGemini(apiKey,
    `You are an emotion analyst specialising in WhatsApp and digital communication patterns.
Analyse the emotional state of "${contactName}" from their recent messages.

Use Apple Health emotion tags only:
Amazed, Amused, Angry, Annoyed, Anxious, Ashamed, Brave, Calm, Content, Disappointed,
Discouraged, Disgusted, Drained, Embarrassed, Excited, Frustrated, Grateful, Grieving,
Happy, Hopeful, Hopeless, Irritated, Jealous, Joyful, Lonely, Nervous, Overwhelmed,
Peaceful, Pleased, Proud, Relieved, Resentful, Sad, Scared, Stressed, Surprised,
Thankful, Tired, Uncomfortable, Worried

Consider: word choice, punctuation energy (!!!  vs ...), emoji patterns, message length, slang.

Return ONLY valid JSON, no markdown:
{"primary":{"emotion":"EmotionName","intensity":4},"secondary":{"emotion":"EmotionName","intensity":3},"tertiary":{"emotion":"EmotionName","intensity":2},"insight":"one sentence about their current emotional state","emojiPattern":"brief emoji note or empty string"}`,
    `Contact: ${contactName}
${topEmojis ? `Emoji history: ${topEmojis}` : ''}
Recent messages:
${msgBlock}`
  );

  return JSON.parse(result.replace(/^```json?\s*|\s*```$/g, '').trim());
}

// ── Gemini helper ─────────────────────────────────────────────────────────────

async function callGemini(apiKey, systemPrompt, userMessage) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: 600 }
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 400) throw new Error('Invalid Gemini API key. Check Ogosh settings.');
    if (res.status === 429) throw new Error('Gemini rate limit hit. Wait a moment.');
    throw new Error(err.error?.message || `Gemini error ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}
