// background.js — Ogosh v1.5
// Google Translate for ALL languages.
// Groq (primary) / Gemini (fallback) ONLY for Emotion Pulse.

importScripts('hinlang.js');

const ALL_LANGS = {
  afrikaans: { label: 'Afrikaans', code: 'af' },
  albanian: { label: 'Albanian', code: 'sq' },
  amharic: { label: 'Amharic', code: 'am' },
  arabic: { label: 'Arabic', code: 'ar' },
  armenian: { label: 'Armenian', code: 'hy' },
  assamese: { label: 'Assamese', code: 'as' },
  aymara: { label: 'Aymara', code: 'ay' },
  azerbaijani: { label: 'Azerbaijani', code: 'az' },
  bambara: { label: 'Bambara', code: 'bm' },
  basque: { label: 'Basque', code: 'eu' },
  belarusian: { label: 'Belarusian', code: 'be' },
  bengali: { label: 'Bengali', code: 'bn' },
  bhojpuri: { label: 'Bhojpuri', code: 'bho' },
  bosnian: { label: 'Bosnian', code: 'bs' },
  bulgarian: { label: 'Bulgarian', code: 'bg' },
  catalan: { label: 'Catalan', code: 'ca' },
  cebuano: { label: 'Cebuano', code: 'ceb' },
  chinese_simplified: { label: 'Chinese (Simplified)', code: 'zh-CN' },
  chinese_traditional: { label: 'Chinese (Traditional)', code: 'zh-TW' },
  corsican: { label: 'Corsican', code: 'co' },
  croatian: { label: 'Croatian', code: 'hr' },
  czech: { label: 'Czech', code: 'cs' },
  danish: { label: 'Danish', code: 'da' },
  dhivehi: { label: 'Dhivehi', code: 'dv' },
  dogri: { label: 'Dogri', code: 'doi' },
  dutch: { label: 'Dutch', code: 'nl' },
  english: { label: 'English', code: 'en' },
  esperanto: { label: 'Esperanto', code: 'eo' },
  estonian: { label: 'Estonian', code: 'et' },
  ewe: { label: 'Ewe', code: 'ee' },
  filipino: { label: 'Filipino', code: 'tl' },
  finnish: { label: 'Finnish', code: 'fi' },
  french: { label: 'French', code: 'fr' },
  frisian: { label: 'Frisian', code: 'fy' },
  galician: { label: 'Galician', code: 'gl' },
  georgian: { label: 'Georgian', code: 'ka' },
  german: { label: 'German', code: 'de' },
  greek: { label: 'Greek', code: 'el' },
  guarani: { label: 'Guarani', code: 'gn' },
  gujarati: { label: 'Gujarati', code: 'gu' },
  haitian_creole: { label: 'Haitian Creole', code: 'ht' },
  hausa: { label: 'Hausa', code: 'ha' },
  hawaiian: { label: 'Hawaiian', code: 'haw' },
  hebrew: { label: 'Hebrew', code: 'he' },
  hindi: { label: 'Hindi', code: 'hi' },
  hmong: { label: 'Hmong', code: 'hmn' },
  hungarian: { label: 'Hungarian', code: 'hu' },
  icelandic: { label: 'Icelandic', code: 'is' },
  igbo: { label: 'Igbo', code: 'ig' },
  ilocano: { label: 'Ilocano', code: 'ilo' },
  indonesian: { label: 'Indonesian', code: 'id' },
  irish: { label: 'Irish', code: 'ga' },
  italian: { label: 'Italian', code: 'it' },
  japanese: { label: 'Japanese', code: 'ja' },
  javanese: { label: 'Javanese', code: 'jv' },
  kannada: { label: 'Kannada', code: 'kn' },
  kazakh: { label: 'Kazakh', code: 'kk' },
  khmer: { label: 'Khmer', code: 'km' },
  kinyarwanda: { label: 'Kinyarwanda', code: 'rw' },
  konkani: { label: 'Konkani', code: 'gom' },
  korean: { label: 'Korean', code: 'ko' },
  krio: { label: 'Krio', code: 'kri' },
  kurdish_kurmanji: { label: 'Kurdish (Kurmanji)', code: 'ku' },
  kurdish_sorani: { label: 'Kurdish (Sorani)', code: 'ckb' },
  kyrgyz: { label: 'Kyrgyz', code: 'ky' },
  lao: { label: 'Lao', code: 'lo' },
  latin: { label: 'Latin', code: 'la' },
  latvian: { label: 'Latvian', code: 'lv' },
  lingala: { label: 'Lingala', code: 'ln' },
  lithuanian: { label: 'Lithuanian', code: 'lt' },
  luganda: { label: 'Luganda', code: 'lg' },
  luxembourgish: { label: 'Luxembourgish', code: 'lb' },
  macedonian: { label: 'Macedonian', code: 'mk' },
  maithili: { label: 'Maithili', code: 'mai' },
  malagasy: { label: 'Malagasy', code: 'mg' },
  malay: { label: 'Malay', code: 'ms' },
  malayalam: { label: 'Malayalam', code: 'ml' },
  maltese: { label: 'Maltese', code: 'mt' },
  maori: { label: 'Maori', code: 'mi' },
  marathi: { label: 'Marathi', code: 'mr' },
  meiteilon_manipuri: { label: 'Meiteilon (Manipuri)', code: 'mni-Mtei' },
  mizo: { label: 'Mizo', code: 'lus' },
  mongolian: { label: 'Mongolian', code: 'mn' },
  myanmar_burmese: { label: 'Myanmar (Burmese)', code: 'my' },
  nepali: { label: 'Nepali', code: 'ne' },
  norwegian: { label: 'Norwegian', code: 'no' },
  nyanja_chichewa: { label: 'Nyanja (Chichewa)', code: 'ny' },
  odia_oriya: { label: 'Odia (Oriya)', code: 'or' },
  oromo: { label: 'Oromo', code: 'om' },
  pashto: { label: 'Pashto', code: 'ps' },
  persian: { label: 'Persian', code: 'fa' },
  polish: { label: 'Polish', code: 'pl' },
  portuguese: { label: 'Portuguese', code: 'pt' },
  punjabi: { label: 'Punjabi', code: 'pa' },
  quechua: { label: 'Quechua', code: 'qu' },
  romanian: { label: 'Romanian', code: 'ro' },
  russian: { label: 'Russian', code: 'ru' },
  samoan: { label: 'Samoan', code: 'sm' },
  sanskrit: { label: 'Sanskrit', code: 'sa' },
  scots_gaelic: { label: 'Scots Gaelic', code: 'gd' },
  sepedi: { label: 'Sepedi', code: 'nso' },
  serbian: { label: 'Serbian', code: 'sr' },
  sesotho: { label: 'Sesotho', code: 'st' },
  shona: { label: 'Shona', code: 'sn' },
  sindhi: { label: 'Sindhi', code: 'sd' },
  sinhala: { label: 'Sinhala', code: 'si' },
  slovak: { label: 'Slovak', code: 'sk' },
  slovenian: { label: 'Slovenian', code: 'sl' },
  somali: { label: 'Somali', code: 'so' },
  spanish: { label: 'Spanish', code: 'es' },
  sundanese: { label: 'Sundanese', code: 'su' },
  swahili: { label: 'Swahili', code: 'sw' },
  swedish: { label: 'Swedish', code: 'sv' },
  tajik: { label: 'Tajik', code: 'tg' },
  tamil: { label: 'Tamil', code: 'ta' },
  tatar: { label: 'Tatar', code: 'tt' },
  telugu: { label: 'Telugu', code: 'te' },
  thai: { label: 'Thai', code: 'th' },
  tigrinya: { label: 'Tigrinya', code: 'ti' },
  tsonga: { label: 'Tsonga', code: 'ts' },
  turkish: { label: 'Turkish', code: 'tr' },
  turkmen: { label: 'Turkmen', code: 'tk' },
  twi_akan: { label: 'Twi (Akan)', code: 'ak' },
  ukrainian: { label: 'Ukrainian', code: 'uk' },
  urdu: { label: 'Urdu', code: 'ur' },
  uyghur: { label: 'Uyghur', code: 'ug' },
  uzbek: { label: 'Uzbek', code: 'uz' },
  vietnamese: { label: 'Vietnamese', code: 'vi' },
  welsh: { label: 'Welsh', code: 'cy' },
  xhosa: { label: 'Xhosa', code: 'xh' },
  yiddish: { label: 'Yiddish', code: 'yi' },
  yoruba: { label: 'Yoruba', code: 'yo' },
  zulu: { label: 'Zulu', code: 'zu' },
  hinglish: { label: 'Hinglish (HiEn)', code: 'hien' }
};

const LANG_CODE_TO_LABEL = {};
for (const [key, val] of Object.entries(ALL_LANGS)) {
  LANG_CODE_TO_LABEL[val.code] = val.label;
}

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
  if (message.type === 'TRANSLATE_DRAFT') {
    const langObj = ALL_LANGS[message.targetLang] || ALL_LANGS.english;
    translateGoogle(message.text, { code: langObj.code, label: 'Draft' })
      .then(res => {
        let out = res.translation;
        let detectedCode = res.detectedCode || '';
        let detectedLabel = LANG_CODE_TO_LABEL[detectedCode] || detectedCode.toUpperCase() || 'AUTO';

        let isHinglish = false;
        if (typeof hinlang !== 'undefined') {
          const script = hinlang.detect_script(message.text);
          if (script === 'roman' || script === 'mixed') {
            if (detectedCode === 'hi' || isLikelyHinglish(message.text)) {
              isHinglish = true;
            }
          }
        }

        if (isHinglish) {
          detectedLabel = 'HINGLISH';
        }

        if (langObj.code === 'hi' && isHinglish && typeof hinlang !== 'undefined') {
            out = hinlang.to_hindi(message.text);
        }
        
        sendResponse({ text: out, detected: detectedLabel });
      })
      .catch(err => sendResponse({ error: err.message }));
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
  const lang = ALL_LANGS[targetLang] || ALL_LANGS.english;

  let originalIsHinglish = false;

  // Convert ONLY strongly identified Hinglish to Hindi before translation
  if (sourceLangs.includes('hinglish') && typeof hinlang !== 'undefined') {
    if (isLikelyHinglish(text)) {
      text = hinlang.to_hindi(text);
      originalIsHinglish = true;
    }
  }

  const res = await translateGoogle(text, lang);
  if (res.error) return res;

  const detectedCode = res.detectedCode || '';

  // If Google detected Hindi from Roman text, it's also Hinglish
  if (!originalIsHinglish && detectedCode === 'hi' && typeof hinlang !== 'undefined') {
    const script = hinlang.detect_script(text);
    if (script === 'roman' || script === 'mixed') {
      originalIsHinglish = true;
      if (lang.code === 'hi') {
        res.translation = hinlang.to_hindi(text);
      }
    }
  }

  if (originalIsHinglish) {
    res.detectedLang = 'Hinglish';
  }

  // Filter out translations if the detected language is not in the user's interaction languages
  if (sourceLangs.length > 0) {
    const allowedCodes = sourceLangs.map(l => ALL_LANGS[l]?.code).filter(Boolean);
    if (originalIsHinglish) allowedCodes.push('hi', 'hien');

    const detectedCode = res.detectedCode || '';
    const baseCode = detectedCode.split('-')[0].toLowerCase();
    
    const isAllowed = allowedCodes.some(c => {
      const allowedBase = c.split('-')[0].toLowerCase();
      return c === detectedCode || allowedBase === baseCode;
    });

    if (!isAllowed) {
      return { skip: true };
    }
  }

  return res;
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
    detectedCode,
    detectedLang: LANG_CODE_TO_LABEL[detectedCode] || detectedCode.toUpperCase() || 'Auto',
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
