// popup.js — Ogosh v1.4

const saveBtn = document.getElementById('saveBtn');
const statusEl = document.getElementById('status');
const apiKeyEl = document.getElementById('apiKey');
const eyeBtn = document.getElementById('eyeBtn');
const groqApiKeyEl = document.getElementById('groqApiKey');
const groqEyeBtn = document.getElementById('groqEyeBtn');

const targetLangGrid = document.getElementById('targetLangGrid');
const targetLangSelect = document.getElementById('targetLangSelect');

const sourceLangSelect = document.getElementById('sourceLangSelect');
const sourceLangTags = document.getElementById('sourceLangTags');

const ALL_LANGS = {
  english: { label: 'English', flag: '🇬🇧' },
  hindi: { label: 'Hindi', flag: '🇮🇳' },
  hinglish: { label: 'Hinglish (HiEn)', flag: '🇮🇳' },
  french: { label: 'French', flag: '🇫🇷' },
  spanish: { label: 'Spanish', flag: '🇪🇸' },
  portuguese: { label: 'Portuguese', flag: '🇧🇷' },
  marathi: { label: 'Marathi', flag: '🇮🇳' },
  tamil: { label: 'Tamil', flag: '🇮🇳' }
};

let currentTargetLang = 'english';
let top2TargetLangs = ['english', 'hindi'];
let currentSourceLangs = [];

async function init() {
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
        <div class="dot"></div><span class="flag">${info.flag}</span> ${info.label}
      </label>
    `;
  }).join('');

  targetLangSelect.value = "";
}

targetLangGrid.addEventListener('click', e => {
  const o = e.target.closest('.lang-opt');
  if (o) {
    currentTargetLang = o.dataset.lang;
    renderTargetLangs();
  }
});

targetLangSelect.addEventListener('change', e => {
  const selected = e.target.value;
  if (selected && selected !== currentTargetLang) {
    currentTargetLang = selected;
    if (!top2TargetLangs.includes(selected)) {
      top2TargetLangs = [selected, top2TargetLangs[0]];
    }
    renderTargetLangs();
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
  sourceLangSelect.value = "";
}

sourceLangSelect.addEventListener('change', e => {
  const selected = e.target.value;
  if (selected && !currentSourceLangs.includes(selected)) {
    if (currentSourceLangs.length >= 5) {
      showStatus('Maximum 5 source languages allowed.', true);
    } else {
      currentSourceLangs.push(selected);
      renderSourceLangs();
    }
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
