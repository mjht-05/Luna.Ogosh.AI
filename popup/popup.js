// popup.js — Ogosh v1.4

const saveBtn = document.getElementById('saveBtn');
const statusEl = document.getElementById('status');
const apiKeyEl = document.getElementById('apiKey');
const eyeBtn = document.getElementById('eyeBtn');
const groqApiKeyEl = document.getElementById('groqApiKey');
const groqEyeBtn = document.getElementById('groqEyeBtn');

const targetLangGrid = document.getElementById('targetLangGrid');
const targetLangInput = document.getElementById('targetLangInput');

const sourceLangInput = document.getElementById('sourceLangInput');
const sourceLangTags = document.getElementById('sourceLangTags');

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

// Populate the selects dynamically
function populateSelects() {
  const optionsHTML = Object.keys(ALL_LANGS).map(k => `<option value="${ALL_LANGS[k].label}">`).join('');
  
  document.getElementById('sourceLangsData').innerHTML = optionsHTML;
  document.getElementById('targetLangsData').innerHTML = optionsHTML;
}

function getLangKeyByLabel(label) {
  return Object.keys(ALL_LANGS).find(k => ALL_LANGS[k].label === label);
}

let currentTargetLang = 'english';
let top2TargetLangs = ['english', 'hindi'];
let currentSourceLangs = [];

async function init() {
  populateSelects();
  
  const sync = await chrome.storage.sync.get(['wa_target_lang', 'wa_target_top2', 'wa_source_langs', 'wa_gemini_key', 'wa_groq_key']);
  const local = await chrome.storage.local.get(['ogosh_tracked']);

  currentTargetLang = sync.wa_target_lang || 'english';
  if (sync.wa_target_top2 && sync.wa_target_top2.length === 2) {
    top2TargetLangs = sync.wa_target_top2;
  }
  if (!top2TargetLangs.includes(currentTargetLang)) {
    top2TargetLangs = [currentTargetLang, top2TargetLangs[0]];
  }

  currentSourceLangs = sync.wa_source_langs || [];

  if (sync.wa_gemini_key) apiKeyEl.value = sync.wa_gemini_key;
  if (sync.wa_groq_key) groqApiKeyEl.value = sync.wa_groq_key;

  renderTargetLangs();
  renderSourceLangs();
  renderTracked(local.ogosh_tracked || []);
}

function renderTargetLangs() {
  targetLangGrid.innerHTML = top2TargetLangs.map(lang => {
    const info = ALL_LANGS[lang] || { label: lang, flag: '🌍' };
    const isActive = lang === currentTargetLang;
    return `
      <label class="lang-opt ${isActive ? 'active' : ''}" data-lang="${lang}">
        <input type="radio" name="lang" value="${lang}" ${isActive ? 'checked' : ''}>
        <div class="dot"></div><span class="flag">${info.flag || '🌍'}</span> ${info.label}
      </label>
    `;
  }).join('');

  targetLangInput.value = "";
}

targetLangGrid.addEventListener('click', e => {
  const o = e.target.closest('.lang-opt');
  if (o) {
    currentTargetLang = o.dataset.lang;
    renderTargetLangs();
  }
});

targetLangInput.addEventListener('change', e => {
  const label = e.target.value;
  const key = getLangKeyByLabel(label);
  if (key && key !== currentTargetLang) {
    currentTargetLang = key;
    if (!top2TargetLangs.includes(key)) {
      top2TargetLangs = [key, top2TargetLangs[0]];
    }
    renderTargetLangs();
    e.target.value = '';
  }
});

function renderSourceLangs() {
  sourceLangTags.innerHTML = currentSourceLangs.map(lang => {
    const info = ALL_LANGS[lang] || { label: lang };
    return `
      <div class="ogosh-tag">
        ${info.label} <span class="ogosh-tag-remove" data-lang="${lang}">✕</span>
      </div>
    `;
  }).join('');
  sourceLangInput.value = "";
}

sourceLangInput.addEventListener('change', e => {
  const label = e.target.value;
  const key = getLangKeyByLabel(label);
  if (key && !currentSourceLangs.includes(key)) {
    if (currentSourceLangs.length >= 5) {
      showStatus('Maximum 5 source languages allowed.', true);
    } else {
      currentSourceLangs.push(key);
      renderSourceLangs();
    }
    e.target.value = '';
  }
});

sourceLangTags.addEventListener('click', e => {
  if (e.target.classList.contains('ogosh-tag-remove')) {
    const lang = e.target.dataset.lang;
    currentSourceLangs = currentSourceLangs.filter(l => l !== lang);
    renderSourceLangs();
  }
});

function setupEyeBtn(btn, input) {
  btn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? '🙈' : '👁';
  });
}
setupEyeBtn(eyeBtn, apiKeyEl);
setupEyeBtn(groqEyeBtn, groqApiKeyEl);

function renderTracked(tracked) {
  const list = document.getElementById('trackedList');
  const slots = [0, 1, 2].map(i => document.getElementById(`slot${i}`));

  slots.forEach((s, i) => s.classList.toggle('used', i < tracked.length));

  if (!tracked.length) {
    list.innerHTML = '<span class="tracked-empty">No contacts tracked yet.</span>';
    return;
  }

  list.innerHTML = tracked.map(name => `
    <div class="tracked-item">
      <span class="tracked-name">${escHtml(name)}</span>
      <button class="tracked-remove" data-name="${escHtml(name)}">✕ Remove</button>
    </div>`).join('');

  list.querySelectorAll('.tracked-remove').forEach(btn => {
    btn.addEventListener('click', async () => {
      const name = btn.dataset.name;
      const stored = await chrome.storage.local.get(['ogosh_tracked']);
      const updated = (stored.ogosh_tracked || []).filter(n => n !== name);
      await chrome.storage.local.remove([`ogosh_data_${name}`, `ogosh_ep_on_${name}`]);
      await chrome.storage.local.set({ ogosh_tracked: updated });
      renderTracked(updated);
      showStatus(`Removed ${name} and deleted their data.`);
    });
  });
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

saveBtn.addEventListener('click', async () => {
  const geminiKey = apiKeyEl.value.trim();
  const groqKey = groqApiKeyEl.value.trim();

  const data = { 
    wa_target_lang: currentTargetLang,
    wa_target_top2: top2TargetLangs,
    wa_source_langs: currentSourceLangs
  };
  
  data.wa_gemini_key = geminiKey || '';
  data.wa_groq_key = groqKey || '';

  await chrome.storage.sync.set(data);
  showStatus('✓ Saved. Reload WhatsApp Web to apply.');
});

let timer;
function showStatus(msg, isErr = false) {
  statusEl.textContent = msg;
  statusEl.className = 'status show' + (isErr ? ' err' : '');
  clearTimeout(timer);
  timer = setTimeout(() => statusEl.className = 'status', 4000);
}

// Listen for tracked list changes from content script
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.ogosh_tracked) {
    renderTracked(changes.ogosh_tracked.newValue || []);
  }
});

init();
