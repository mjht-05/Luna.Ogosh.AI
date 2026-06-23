# Ogosh — WhatsApp Web AI Translator & Emotion Pulse

**Break every language barrier on WhatsApp Web.**

Ogosh is a Chrome extension that automatically translates incoming WhatsApp messages into your preferred language — supporting 130+ languages including seamless Hinglish (Hindi-English) transliteration. It also offers optional AI-powered emotional tone analysis of conversations via Emotion Pulse.

No copy-pasting, no switching apps. Just open WhatsApp Web and your messages appear translated inline.

**Completely free. No ads. No data collection. No accounts.**

---

## Features

### 🌍 Auto-Translation
- Translates incoming WhatsApp messages into your preferred target language in real time, right inside the chat.
- Automatically handles **Hinglish (HiEn)** messages by intelligently transliterating them to Hindi before passing them to the translation engine, ensuring highly accurate context preservation.
- Powered by Google Translate (completely free, no API keys needed for translation).

### ✍️ Composer Panel
- A sleek, injected panel right above your WhatsApp typing area.
- Select your source language toggle buttons and see a live translation preview before you send.
- Features live **Hinglish → Hindi** transliteration as you type.
- Click the 📋 button to instantly copy the translated text to your clipboard, ready to paste into the WhatsApp chat box.

### 🧠 Emotion Pulse
- Track the emotional tone of up to 3 specific contacts using AI analysis.
- Analyses recent message history, tone, slang, and emoji frequency.
- Displays primary, secondary, and tertiary emotions with intensity ratings (1–5 scale).
- Built with a robust AI fallback chain: **Groq (Llama-3.3-70b-versatile)** as the primary engine for lightning-fast inferences, seamlessly falling back to **Google Gemini** if rate limits are hit.
- Requires **explicit user consent** per contact before any tracking begins.
- Data stays on your device; only required context is securely sent to the AI providers using your own API keys.

---

## Installation

1. Download and unzip the repository.
2. Open Chrome (or any Chromium browser) and go to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the folder containing `manifest.json`.
5. The Ogosh icon will appear in your toolbar.

---

## Setup & Configuration

1. Click the Ogosh icon in your Chrome toolbar to open the settings.
2. **API Keys:**
   - Add your [Groq API Key](https://console.groq.com/keys) (Primary for Emotion Pulse).
   - Add your [Gemini API Key](https://aistudio.google.com/app/apikey) (Fallback for Emotion Pulse).
3. **Source Languages:** Select up to 5 languages you commonly interact in (e.g., English, Hindi, Hinglish). This helps the extension identify languages accurately.
4. **Target Language:** Select your preferred language for incoming translations. The top 2 most-used languages are pinned as quick-select radio buttons.
5. Click **Save** and reload WhatsApp Web.

---

## Usage

**Translating Incoming Messages:**
- Messages are automatically processed. If the detected language differs from your target language, a translation panel will appear inline.

**Composing Messages:**
- Use the Composer Panel above the chat input box.
- Select `HiEn` (Hinglish), type naturally in Roman script, and watch it seamlessly convert to Hindi as you type.
- Hit the 📋 copy button to transfer the text to WhatsApp.

**Emotion Pulse:**
- Click the 🧠 icon in the WhatsApp header for a contact.
- Grant consent when prompted (first time only).
- View real-time emotional insights and primary/secondary/tertiary emotion intensities based on recent chat history.

---

## Privacy & Data Handling

Ogosh is built with a **privacy-first architecture**. Here's how your data is handled:

| Aspect | Details |
|--------|---------|
| **Data storage** | All data (preferences, API keys, tracked contacts, message history) is stored **locally on your device** using Chrome's extension storage. Nothing is sent to any server we operate. |
| **Translation** | Message text is sent to Google Translate's public API over HTTPS for translation. No API key or user-identifying information is included. |
| **Emotion Pulse** | When enabled, the last 20 messages of a tracked contact are sent to Groq or Gemini for analysis — authenticated with **your own API key**, not ours. |
| **Consent** | Emotion Pulse requires explicit, affirmative consent per contact via an in-product dialog before any tracking begins. |
| **Message retention** | A maximum of 200 messages per tracked contact are stored locally. Older messages are automatically removed. |
| **Data deletion** | Remove a tracked contact in settings to delete their data, or uninstall the extension to remove everything. |
| **Remote code** | None. All JavaScript, HTML, and CSS is bundled in the extension package. No external scripts are fetched or executed. |

📄 **Full Privacy Policy:** [privacy.md](privacy.md)

---

## Permissions

Ogosh requires the following permissions, each the minimum necessary for its core functionality:

| Permission | Why It's Needed |
|-----------|-----------------|
| `storage` | Saves user preferences, API keys, and tracked contact data in Chrome's built-in extension storage. |
| `https://web.whatsapp.com/*` | Injects the content script to read messages for translation and render the Composer Panel and Emotion Pulse UI. This is the only site the extension operates on. |
| `https://translate.googleapis.com/*` | Sends message text to Google Translate for real-time translation. |
| `https://generativelanguage.googleapis.com/*` | Sends message context to Google Gemini for Emotion Pulse analysis (fallback). Only used when the user provides a Gemini API key. |
| `https://api.groq.com/*` | Sends message context to Groq for Emotion Pulse analysis (primary). Only used when the user provides a Groq API key. |

---

## Known Limitations

- **Desktop Only:** Only works on WhatsApp Web via a Chromium-based browser.
- **API Keys:** Emotion Pulse requires your own Groq and/or Gemini API keys (free tiers available).
- **WhatsApp Web Updates:** If WhatsApp changes its DOM structure, the Composer Panel or inline translations might need selector updates in `content.js`.

---

## Architecture / Files

```
├── manifest.json      Extension configuration (Manifest V3).
├── background.js      Service worker: handles translation requests and Emotion Pulse AI calls.
├── content.js         Injected into WhatsApp Web: manages the DOM, Composer Panel, and Emotion UI.
├── hinlang.js         Standalone library for fast, offline Hinglish ↔ Hindi transliteration.
├── styles.css         Dark/Light theme aware CSS for panels and modals.
├── privacy.md         Full privacy policy for Chrome Web Store compliance.
├── popup/
│   ├── popup.html     Settings UI (API keys, language selection, tracked contacts).
│   └── popup.js       Settings logic and storage management.
└── icons/             Extension branding icons.
```

---

## Support

Found a bug or have a feature request? [Open an issue](https://github.com/mjht-05/Luna.Ogosh.AI/issues).

---

## License

This project is developed and maintained by [mjht-05](https://github.com/mjht-05).
