// popup.js — Ogosh v1.3

const saveBtn = document.getElementById('saveBtn');
const statusEl = document.getElementById('status');
const langGrid = document.getElementById('langGrid');
const apiKeyEl = document.getElementById('apiKey');
const eyeBtn = document.getElementById('eyeBtn');

async function init() {
  const sync = await chrome.storage.sync.get(['wa_target_lang', 'wa_gemini_key']);
  const local = await chrome.storage.local.get(['ogosh_tracked']);

  setActive(sync.wa_target_lang || 'english');
  if (sync.wa_gemini_key) apiKeyEl.value = sync.wa_gemini_key;
  renderTracked(local.ogosh_tracked || []);
}

function setActive(lang) {
  document.querySelectorAll('.lang-opt').forEach(o => {
    const match = o.dataset.lang === lang;
    o.classList.toggle('active', match);
    o.querySelector('input').checked = match;
  });
}

langGrid.addEventListener('click', e => {
  const o = e.target.closest('.lang-opt');
  if (o) setActive(o.dataset.lang);
});

eyeBtn.addEventListener('click', () => {
  const show = apiKeyEl.type === 'password';
  apiKeyEl.type = show ? 'text' : 'password';
  eyeBtn.textContent = show ? '🙈' : '👁';
});

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
  const lang = document.querySelector('.lang-opt.active')?.dataset.lang || 'english';
  const key = apiKeyEl.value.trim();

  const data = { wa_target_lang: lang };
  if (key) data.wa_gemini_key = key;

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
