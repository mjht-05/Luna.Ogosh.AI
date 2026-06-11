# LinguaWA — WhatsApp Web Translator

Translate WhatsApp Web messages into Hindi, Hinglish, Casual Hinglish (with slang), French, and Casual French — directly inside the chat. Powered by Claude Haiku via the Anthropic API.

---

## What it does

A small "🌐 Translate" button appears below each message in WhatsApp Web. Click it and the message is translated into your chosen language in about a second. Click "🔼 Hide" to collapse it again. Works on both sent and received messages.

**Supported output languages:**
- English
- Hindi (हिंदी, Devanagari script)
- Hinglish (Roman script, natural mix)
- Casual Hinglish with real slang (yaar, bhai, khatarnak, ekdum, etc.)
- French (standard)
- Casual French with youth slang (ouf, chelou, wesh, carrément, etc.)

Auto-detects the source language — no need to tell it whether the message is in French, Hindi, or Hinglish.

---

## Install in Chrome (or any Chromium browser)

1. Download and unzip `whatsapp-translator.zip`
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `whatsapp-translator` folder (the one containing `manifest.json`)
6. The LinguaWA icon (🌐) will appear in your toolbar

---

## Setup

1. Get a free Anthropic API key at [console.anthropic.com/keys](https://console.anthropic.com/keys)
2. Click the 🌐 LinguaWA icon in your Chrome toolbar
3. Paste your API key
4. Choose your preferred target language
5. Click **Save Settings**
6. Open (or reload) [web.whatsapp.com](https://web.whatsapp.com)

---

## Cost

Uses `claude-haiku-4-5` — the fastest and cheapest Claude model.
A typical WhatsApp message translation costs less than $0.0001.
You'd need to translate tens of thousands of messages to spend a dollar.

---

## Usage

- Open any chat on WhatsApp Web
- Each message will have a **🌐 Translate** button below it
- Click it → translation appears with a "detected → target" language badge
- Click **🔼 Hide** to collapse it
- Click again to show it (no extra API call — it's cached)
- Change your target language anytime via the extension popup

---

## Known limitations

**Desktop only.** There's no way to inject UI into the native WhatsApp iOS or Android app. This only works in a browser.

**Both users don't need the extension.** Only the person reading the message needs LinguaWA installed. Your friend in France doesn't need to do anything.

**WhatsApp may update their DOM.** WhatsApp Web occasionally changes its internal HTML structure. If buttons stop appearing, the selectors in `content.js` may need updating. The key selector to check is `span.selectable-text.copyable-text` — if WhatsApp renames these classes, update line ~90 in `content.js`.

**Messages loaded before the extension.** On first load there's a ~1.2 second delay before buttons appear on already-visible messages. New messages get buttons immediately.

**End-to-end encryption.** When you click translate, the message text is sent from your browser to the Anthropic API. It leaves the E2E encrypted environment at that point. This is the same tradeoff as using Google Translate on any text — use your judgment on sensitive conversations.

**WhatsApp ToS.** This extension modifies the WhatsApp Web interface without Meta's endorsement. It won't get you banned (it's a read-only enhancement — no message sending, no automation), but it's technically outside their Terms of Service. Use at your own discretion.

---

## Files

```
whatsapp-translator/
├── manifest.json      Extension config (Manifest V3)
├── background.js      Service worker — handles Anthropic API calls
├── content.js         Injected into WhatsApp Web — adds translate buttons
├── styles.css         Button and result box styles
├── popup/
│   ├── popup.html     Settings UI
│   └── popup.js       Settings logic (chrome.storage read/write)
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## Customising slang

The translation prompts are in `background.js` under the `LANG_CONFIG` object. Each language has a `prompt` string with examples and slang word lists. You can edit these freely to tune the style — add regional slang, change the tone, etc.
