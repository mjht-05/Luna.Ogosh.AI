// content.js — Ogosh v1.3
// Auto-translation + Emotion Pulse with consent + 3-contact limit.

(function () {
  'use strict';

  const PROCESSED  = 'data-ogosh';
  const MAX_TRACKED = 3;
  const QUEUE_DELAY = 120;

  // ═══ TRANSLATION QUEUE ═══════════════════════════════════════════════════════

  const transQueue = [];
  let transRunning = false;

  function enqueueTranslation(item) {
    transQueue.push(item);
    if (!transRunning) runTransQueue();
  }

  async function runTransQueue() {
    transRunning = true;
    while (transQueue.length > 0) {
      const { text, panel } = transQueue.shift();
      await doTranslation(text, panel);
      await sleep(QUEUE_DELAY);
    }
    transRunning = false;
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ═══ TEXT HELPERS ═════════════════════════════════════════════════════════════

  function extractText(el) {
    const clone = el.cloneNode(true);
    clone.querySelectorAll('span, div').forEach(node => {
      const t = node.textContent.trim();
      const label = node.getAttribute('aria-label') || '';
      if (/^\d{1,2}:\d{2}(\s*(AM|PM|am|pm))?$/.test(t)) { node.remove(); return; }
      if (/\d{1,2}:\d{2}/.test(label) && t.length < 20) node.remove();
    });
    clone.querySelectorAll('[data-testid*="receipt"],[data-testid*="status"],[data-icon]')
      .forEach(e => e.remove());
    return clone.textContent.trim();
  }

  function safe(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ═══ TRANSLATION RENDERING ════════════════════════════════════════════════════

  function createLoadingPanel() {
    const p = document.createElement('div');
    p.className = 'ogosh-panel ogosh-loading';
    p.innerHTML = '<span class="ogosh-dots">Translating</span>';
    return p;
  }

  async function doTranslation(text, panel) {
    try {
      const res = await chrome.runtime.sendMessage({ type: 'TRANSLATE', text });
      if (res.error) {
        panel.className = 'ogosh-panel ogosh-error';
        panel.innerHTML = `<span class="ogosh-err">⚠ ${safe(res.error)}</span>`;
        return;
      }
      const src = (res.detectedLang || '').toLowerCase();
      const tgt = (res.targetLang  || '').toLowerCase();
      if (src === tgt || src.startsWith(tgt.split(' ')[0])) { panel.remove(); return; }
      panel.className = 'ogosh-panel';
      panel.innerHTML = `
        <div class="ogosh-meta">
          <span class="ogosh-from">${safe(res.detectedLang)}</span>
          <span class="ogosh-arrow">→</span>
          <span class="ogosh-to">${safe(res.targetLang)}</span>
        </div>
        <div class="ogosh-text">${safe(res.translation)}</div>`;
    } catch { panel.remove(); }
  }

  function injectTranslation(el) {
    if (el.hasAttribute(PROCESSED)) return;
    if (el.parentElement?.closest('[data-pre-plain-text]')) return;
    el.setAttribute(PROCESSED, '1');
    const text = extractText(el);
    if (!text || text.length < 2) return;
    const panel = createLoadingPanel();
    if (el.parentElement) el.parentElement.insertBefore(panel, el.nextSibling);
    enqueueTranslation({ text, panel });
  }

  // ═══ TOAST ════════════════════════════════════════════════════════════════════

  function showToast(msg) {
    document.querySelectorAll('.ogosh-toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = 'ogosh-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('ogosh-toast-hide'), 3000);
    setTimeout(() => toast.remove(), 3400);
  }

  // ═══ CONSENT MODAL ════════════════════════════════════════════════════════════

  function requestConsent(contactName) {
    return new Promise(resolve => {
      const backdrop = document.createElement('div');
      backdrop.className = 'ogosh-backdrop';
      backdrop.innerHTML = `
        <div class="ogosh-consent">
          <div class="ogosh-consent-icon">🧠</div>
          <h3 class="ogosh-consent-title">Track emotion patterns?</h3>
          <div class="ogosh-consent-name">${safe(contactName)}</div>
          <p class="ogosh-consent-body">
            Ogosh will store messages from this contact on <strong>your device only</strong>
            to build an emotion profile over time.
          </p>
          <p class="ogosh-consent-sub">
            Analysis is sent to Google Gemini using your own API key. Nothing else leaves your device.
          </p>
          <div class="ogosh-consent-btns">
            <button class="ogosh-btn-decline">Decline</button>
            <button class="ogosh-btn-allow">Allow</button>
          </div>
        </div>`;

      document.body.appendChild(backdrop);

      backdrop.querySelector('.ogosh-btn-allow').onclick = () => { backdrop.remove(); resolve(true); };
      backdrop.querySelector('.ogosh-btn-decline').onclick = () => { backdrop.remove(); resolve(false); };
      backdrop.addEventListener('click', e => { if (e.target === backdrop) { backdrop.remove(); resolve(false); } });

      const onKey = e => { if (e.key === 'Escape') { backdrop.remove(); resolve(false); document.removeEventListener('keydown', onKey); } };
      document.addEventListener('keydown', onKey);
    });
  }

  // ═══ TRACKED CONTACTS HELPERS ════════════════════════════════════════════════

  async function getTracked() {
    const s = await chrome.storage.local.get(['ogosh_tracked']).catch(() => ({}));
    return s.ogosh_tracked || [];
  }

  async function addTracked(name) {
    const list = await getTracked();
    if (list.includes(name)) return true;
    if (list.length >= MAX_TRACKED) return false;
    await chrome.storage.local.set({ ogosh_tracked: [...list, name] });
    return true;
  }

  // ═══ EMOTION PULSE ════════════════════════════════════════════════════════════

  let emotionEnabled = false;
  let currentContact = null;
  let emotionTimer   = null;

  const EMOTION_COLORS = {
    Amazed:'#FFD700', Amused:'#FF69B4', Angry:'#D32F2F', Annoyed:'#FF5722',
    Anxious:'#FFB74D', Ashamed:'#795548', Brave:'#FF6B35', Calm:'#4FC3F7',
    Content:'#81C784', Disappointed:'#78909C', Discouraged:'#90A4AE',
    Disgusted:'#689F38', Drained:'#9E9E9E', Embarrassed:'#FF8A65',
    Excited:'#FF6B35', Frustrated:'#EF5350', Grateful:'#BA68C8',
    Grieving:'#546E7A', Happy:'#FFD700', Hopeful:'#4DB6AC',
    Hopeless:'#607D8B', Irritated:'#FF7043', Jealous:'#388E3C',
    Joyful:'#FF69B4', Lonely:'#78909C', Nervous:'#FFB300',
    Overwhelmed:'#E53935', Peaceful:'#80CBC4', Pleased:'#AED581',
    Proud:'#7E57C2', Relieved:'#66BB6A', Resentful:'#8D6E63',
    Sad:'#5C9BD1', Scared:'#7B1FA2', Stressed:'#FF7043',
    Surprised:'#26C6DA', Thankful:'#9CCC65', Tired:'#BDBDBD',
    Uncomfortable:'#A1887F', Worried:'#FFA726'
  };

  function getContactName() {
    return (
      document.querySelector('#main header span[title]')?.textContent?.trim() ||
      document.querySelector('#main header span[dir="auto"]')?.textContent?.trim() ||
      null
    );
  }

  function collectMessages(n = 40) {
    const main = document.getElementById('main');
    if (!main) return [];
    const msgs = [];
    main.querySelectorAll('[data-pre-plain-text]').forEach(el => {
      if (el.parentElement?.closest('[data-pre-plain-text]')) return;
      const attr  = el.getAttribute('data-pre-plain-text') || '';
      const match = attr.match(/]\s*(.+?):\s*$/);
      const sender = match ? match[1].trim() : '?';
      const text   = extractText(el);
      if (text && text.length > 1) msgs.push({ sender, text });
    });
    return msgs.slice(-n);
  }

  async function storeMessages(contactName, messages) {
    const key     = `ogosh_data_${contactName}`;
    const stored  = await chrome.storage.local.get([key]).catch(() => ({}));
    const prev    = stored[key] || { messages: [], emojiFreq: {} };
    const allMsgs = [...prev.messages, ...messages].slice(-200);

    const emojiFreq = { ...prev.emojiFreq };
    messages.forEach(m => {
      [...m.text].filter(c => /\p{Emoji_Presentation}/u.test(c))
                 .forEach(e => { emojiFreq[e] = (emojiFreq[e] || 0) + 1; });
    });

    await chrome.storage.local.set({ [key]: { messages: allMsgs, emojiFreq, updated: Date.now() } });
    return { messages: allMsgs, emojiFreq };
  }

  // ── Emotion panel DOM ────────────────────────────────────────────────────────

  function ensurePanel() {
    let p = document.getElementById('ogosh-ep');
    if (!p) {
      p = document.createElement('div');
      p.id = 'ogosh-ep';
      p.className = 'ogosh-ep';
      p.innerHTML = `
        <div class="ogosh-ep-hdr">
          <span class="ogosh-ep-title">🧠 Emotion Pulse</span>
          <button class="ogosh-ep-min" id="ogosh-ep-min">−</button>
        </div>
        <div class="ogosh-ep-body" id="ogosh-ep-body">
          <div class="ogosh-ep-spin">Analysing…</div>
        </div>`;
      document.body.appendChild(p);

      document.getElementById('ogosh-ep-min').addEventListener('click', () => {
        const body = document.getElementById('ogosh-ep-body');
        const btn  = document.getElementById('ogosh-ep-min');
        const hide = body.style.display !== 'none';
        body.style.display = hide ? 'none' : 'block';
        btn.textContent    = hide ? '+' : '−';
      });
    }
    return p;
  }

  function removePanel() { document.getElementById('ogosh-ep')?.remove(); }

  function renderEmotion(result) {
    const body = document.getElementById('ogosh-ep-body');
    if (!body) return;

    const rows = [result.primary, result.secondary, result.tertiary]
      .filter(Boolean)
      .map(e => {
        const color  = EMOTION_COLORS[e.emotion] || '#00a884';
        const filled = Math.min(5, Math.max(1, Math.round(e.intensity || 3)));
        const dots   = Array.from({ length: 5 }, (_, i) =>
          `<span class="ogosh-dot${i < filled ? ' ogosh-dot-on' : ''}"
                 style="${i < filled ? `background:${color}` : ''}"></span>`
        ).join('');
        return `<div class="ogosh-erow">
          <span class="ogosh-ename" style="color:${color}">${safe(e.emotion)}</span>
          <div class="ogosh-dots-row">${dots}</div>
          <span class="ogosh-eint">${e.intensity}/5</span>
        </div>`;
      }).join('');

    body.innerHTML = `
      <div class="ogosh-ect">${safe(currentContact || '')}</div>
      ${rows}
      ${result.insight      ? `<div class="ogosh-insight">"${safe(result.insight)}"</div>` : ''}
      ${result.emojiPattern ? `<div class="ogosh-emoji-note">${safe(result.emojiPattern)}</div>` : ''}`;
  }

  async function runEmotionAnalysis() {
    if (!emotionEnabled || !currentContact) return;

    const tracked = await getTracked();
    if (!tracked.includes(currentContact)) return;

    const messages = collectMessages(40);
    if (!messages.length) return;

    const patterns = await storeMessages(currentContact, messages);
    ensurePanel();

    const result = await chrome.runtime.sendMessage({
      type: 'ANALYZE_EMOTION',
      contact: currentContact,
      messages,
      patterns
    }).catch(() => null);

    if (result && !result.error) {
      renderEmotion(result);
    } else {
      const body = document.getElementById('ogosh-ep-body');
      if (body) body.innerHTML = `<div class="ogosh-ep-err">⚠ ${safe(result?.error || 'Analysis failed')}</div>`;
    }
  }

  // ── Toggle button ────────────────────────────────────────────────────────────

  function injectToggle() {
    if (document.getElementById('ogosh-toggle')) return;
    const header = document.querySelector('#main header');
    if (!header) return;

    const btn = document.createElement('button');
    btn.id        = 'ogosh-toggle';
    btn.className = 'ogosh-toggle-btn';
    btn.title     = 'Emotion Pulse';
    btn.textContent = '🧠';
    (header.querySelector('div:last-child') || header).prepend(btn);

    // Restore state for current contact
    restoreEmotionState(btn);

    btn.addEventListener('click', async () => {
      const contact = getContactName();
      if (!contact) return;

      // Needs Gemini key
      const { wa_gemini_key } = await chrome.storage.sync.get(['wa_gemini_key']);
      if (!wa_gemini_key) {
        showToast('Add your Gemini API key in Ogosh settings to use Emotion Pulse.');
        return;
      }

      if (emotionEnabled) {
        // Toggle off
        emotionEnabled = false;
        btn.classList.remove('ogosh-toggle-active');
        await chrome.storage.local.set({ [`ogosh_ep_on_${contact}`]: false });
        removePanel();
        return;
      }

      // Toggle on — check tracking
      const tracked = await getTracked();

      if (!tracked.includes(contact)) {
        if (tracked.length >= MAX_TRACKED) {
          showToast(`Tracking limit reached (${MAX_TRACKED} contacts). Remove one in Ogosh settings.`);
          return;
        }
        // Ask consent
        const ok = await requestConsent(contact);
        if (!ok) return;
        const added = await addTracked(contact);
        if (!added) { showToast('Could not add contact. Try again.'); return; }
      }

      emotionEnabled = true;
      btn.classList.add('ogosh-toggle-active');
      await chrome.storage.local.set({ [`ogosh_ep_on_${contact}`]: true });
      runEmotionAnalysis();
    });
  }

  async function restoreEmotionState(btn) {
    const contact = getContactName();
    if (!contact) return;
    const s = await chrome.storage.local.get([`ogosh_ep_on_${contact}`]).catch(() => ({}));
    emotionEnabled = !!s[`ogosh_ep_on_${contact}`];
    btn.classList.toggle('ogosh-toggle-active', emotionEnabled);
    if (emotionEnabled) runEmotionAnalysis();
  }

  // ═══ SCANNER + BOOT ══════════════════════════════════════════════════════════

  function scan() {
    const main = document.getElementById('main');
    if (!main) return;

    // Translation
    main.querySelectorAll('[data-pre-plain-text]').forEach(injectTranslation);

    // Detect contact switch
    const contact = getContactName();
    if (contact !== currentContact) {
      currentContact = contact;
      removePanel();
      document.getElementById('ogosh-toggle')?.remove();
      setTimeout(injectToggle, 200);
    }

    // Debounced emotion re-analysis when new messages arrive
    if (emotionEnabled) {
      clearTimeout(emotionTimer);
      emotionTimer = setTimeout(runEmotionAnalysis, 3000);
    }
  }

  function waitFor(sel, t = 20000) {
    return new Promise((res, rej) => {
      const el = document.querySelector(sel);
      if (el) return res(el);
      const obs = new MutationObserver(() => {
        const found = document.querySelector(sel);
        if (found) { obs.disconnect(); res(found); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); rej(); }, t);
    });
  }

  waitFor('#main').then(main => {
    setTimeout(() => { scan(); injectToggle(); }, 1200);

    const obs = new MutationObserver(() => {
      clearTimeout(window._ogoshT);
      window._ogoshT = setTimeout(scan, 250);
    });
    obs.observe(main, { childList: true, subtree: true });

    document.addEventListener('click', () => setTimeout(scan, 900), { passive: true });
  }).catch(() => {
    const t = setInterval(() => {
      if (document.getElementById('main')) { clearInterval(t); scan(); injectToggle(); }
    }, 3000);
  });

})();
