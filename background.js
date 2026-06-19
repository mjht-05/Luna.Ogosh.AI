// background.js — Ogosh v1.5
// Google Translate for ALL languages.
// Groq (primary) / Gemini (fallback) ONLY for Emotion Pulse.

importScripts('hinlang.js');

const LANG_CONFIG = {
  english:    { label: 'English',   code: 'en' },
  hindi:      { label: 'Hindi',     code: 'hi' },
  hinglish:   { label: 'Hinglish',  code: 'hi-Latn' },
  french:     { label: 'French',    code: 'fr' },
  spanish:    { label: 'Spanish',   code: 'es' },
  portuguese: { label: 'Português', code: 'pt' },
  marathi:    { label: 'Marathi',   code: 'mr' },
  tamil:      { label: 'Tamil',     code: 'ta' }
};

const LANG_NAMES = {
  en: 'English', hi: 'Hindi', fr: 'French', de: 'German',
  es: 'Spanish', it: 'Italian', pt: 'Portuguese', ar: 'Arabic',
  zh: 'Chinese', ja: 'Japanese', ko: 'Korean', ru: 'Russian',
  mr: 'Marathi', ta: 'Tamil'
};

// ── Hinglish source detection ─────────────────────────────────────────────────
// These words are distinctly Hindi in Latin script and won't appear in plain English/French/etc.
const HINGLISH_PATTERN = /\b(yaar|bhai|kya|nahi|nahin|toh|phir|abhi|bahut|bohot|mast|bindaas|arrey|oye|kadak|ekdum|mujhe|acha|accha|achcha|theek|sahi|iska|uska|woh|lekin|matlab|hoga|chal|bol|hain|karo|dekho|suno)\b/i;

function isLikelyHinglish(text) {
  // Skip text containing Devanagari, Arabic, CJK, Japanese, Korean — those aren't Hinglish
  if (/[\u0900-\u097F\u0600-\u06FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(text)) return false;
  return HINGLISH_PATTERN.test(text);
}

// ── Message listener ──────────────────────────────────────────────────────────

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
  const stored = await chrome.storage.sync.get(['wa_target_lang', 'wa_source_langs']);
  const targetLang = stored.wa_target_lang || 'english';
  const sourceLangs = stored.wa_source_langs || [];
  const lang = LANG_CONFIG[targetLang] || LANG_CONFIG.english;

  // Convert Hinglish to Hindi before translation using hinlang.js
  if (sourceLangs.includes('hinglish') && isLikelyHinglish(text) && typeof hinlang !== 'undefined') {
    text = hinlang.to_hindi(text);
  }

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

// ── Emotion analysis ──────────────────────────────────────────────────────────

async function analyzeEmotion(contactName, messages, patterns) {
  const stored = await chrome.storage.sync.get(['wa_gemini_key', 'wa_groq_key']);
  const groqKey = stored.wa_groq_key?.trim();
  const geminiKey = stored.wa_gemini_key?.trim();
  if (!groqKey && !geminiKey) throw new Error('Add your Groq or Gemini API key in Ogosh settings.');

  const topEmojis = Object.entries(patterns?.emojiFreq || {})
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([e, n]) => `${e}×${n}`).join(' ');

  const msgBlock = messages.slice(-20)
    .map(m => `${m.sender}: ${m.text}`).join('\n');

  const systemPrompt = `You are an emotion analyst for WhatsApp conversations.
Analyse the emotional state of the contact named "${contactName}" from their recent messages.
Use ONLY these emotion tags: Amazed, Amused, Angry, Annoyed, Anxious, Ashamed, Brave, Calm, Content, Disappointed, Discouraged, Disgusted, Drained, Embarrassed, Excited, Frustrated, Grateful, Grieving, Happy, Hopeful, Hopeless, Irritated, Jealous, Joyful, Lonely, Nervous, Overwhelmed, Peaceful, Pleased, Proud, Relieved, Resentful, Sad, Scared, Stressed, Surprised, Thankful, Tired, Uncomfortable, Worried
Consider: word choice, punctuation energy (!!!, ...), emoji patterns, message length, slang.
Output ONLY the following JSON object, no markdown, no explanation, no preamble:
{"primary":{"emotion":"EmotionName","intensity":4},"secondary":{"emotion":"EmotionName","intensity":3},"tertiary":{"emotion":"EmotionName","intensity":2},"insight":"one sentence about their current emotional state","emojiPattern":"brief emoji note or empty string"}`;
  
  const userMessage = `Contact: ${contactName}\n${topEmojis ? `Emoji history: ${topEmojis}\n` : ''}Recent messages:\n${msgBlock}`;

  let result = null;
  let lastErr = null;

  if (groqKey) {
    try {
      result = await callGroq(groqKey, systemPrompt, userMessage, true);
    } catch (err) {
      console.warn('Groq failed, falling back...', err);
      lastErr = err;
    }
  }

  if (!result && geminiKey) {
    try {
      result = await callGemini(geminiKey, systemPrompt, userMessage, true);
    } catch (err) {
      console.warn('Gemini failed...', err);
      lastErr = err;
    }
  }

  if (!result) throw lastErr || new Error('Emotion analysis failed (all providers down or limit reached).');

  return parseEmotionJSON(result);
}

// Robust JSON extractor
function parseEmotionJSON(text) {
  let s = text.replace(/^```json?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  try { return JSON.parse(s); } catch {}
  const match = s.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch {}
  }
  throw new Error('Emotion analysis returned an unexpected format — please try again.');
}

// ── AI Helpers ─────────────────────────────────────────────────────────────

async function callGroq(apiKey, systemPrompt, userMessage, jsonMode = false) {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const body = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]
  };
  
  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error('Invalid Groq API key.');
    if (res.status === 429) throw new Error('Groq rate limit hit.');
    throw new Error(err.error?.message || `Groq error ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function callGemini(apiKey, systemPrompt, userMessage, jsonMode = false) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  const generationConfig = {
    maxOutputTokens: 800,
    thinkingConfig: { thinkingBudget: 0 }
  };

  if (jsonMode) generationConfig.responseMimeType = 'application/json';

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 400) throw new Error('Invalid Gemini API key.');
    if (res.status === 429) throw new Error('Gemini rate limit hit.');
    throw new Error(err.error?.message || `Gemini error ${res.status}`);
  }

  const data = await res.json();

  if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
    throw new Error('Response was truncated.');
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}
