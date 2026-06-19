# Ogosh — WhatsApp Web AI Translator & Emotion Pulse

Ogosh is a powerful Chrome extension for WhatsApp Web that provides seamless translation, live Hinglish transliteration, and AI-powered emotional analysis of your chats.

---

## Features

### 1. Auto-Translation
- Translates incoming WhatsApp messages into your preferred target language.
- Automatically handles **Hinglish (HiEn)** messages by intelligently transliterating them to Hindi before passing them to the translation engine, ensuring highly accurate context preservation.
- Uses Google Translate under the hood (completely free, no API keys needed for translation).

### 2. Composer Panel
- A sleek, injected panel right above your WhatsApp typing area.
- Select your source language toggle buttons.
- Features live **Hinglish -> Hindi** transliteration as you type.
- Click the 📋 button to instantly copy the text to your clipboard, ready to paste into the WhatsApp chat box.

### 3. Emotion Pulse 🧠
- Track the emotional state of specific contacts (up to 3 contacts).
- Analyzes recent message history, tone, slang, and emoji frequency.
- Built with a robust AI fallback chain: **Groq (Llama-3.3-70b-versatile)** as the primary engine for lightning-fast inferences, seamlessly falling back to **Google Gemini** if rate limits are hit.
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
- Messages will be automatically processed. If the detected language differs from your target language, a translation panel will appear inline.

**Composing Messages:**
- Use the Composer Panel above the chat input box.
- Select `HiEn` (Hinglish), type naturally in Roman script, and watch it seamlessly convert to Hindi as you type.
- Hit the 📋 copy button to transfer the text to WhatsApp.

**Emotion Pulse:**
- Click the 🧠 icon in the WhatsApp header for a tracked contact.
- View real-time emotional insights and primary/secondary emotion intensities based on recent chat history.

---

## Known Limitations & Privacy

- **Desktop Only:** Only works on WhatsApp Web via a Chromium-based browser.
- **API Keys:** Emotion Pulse requires your own Groq and/or Gemini API keys. Keys are securely stored in your local browser extension storage.
- **WhatsApp Web Updates:** If WhatsApp changes its DOM structure, the Composer Panel or inline translations might need selector updates in `content.js`.

---

## Architecture / Files

```
├── manifest.json      Extension configuration (Manifest V3).
├── background.js      Service worker: handles translation requests and Emotion Pulse AI calls.
├── content.js         Injected into WhatsApp Web: manages the DOM, Composer Panel, and Emotion UI.
├── hinlang.js         Standalone library for fast, offline Hinglish to Hindi transliteration.
├── styles.css         Dark/Light theme aware CSS for panels and modals.
├── popup/
│   ├── popup.html     Settings UI (API keys, language selection).
│   └── popup.js       Settings logic and storage management.
└── icons/             Extension branding icons.
```
