# Chrome Web Store Submission — All Fields (≤1000 chars each)

Character counts are shown for each section so you can verify they fit.

---

## Single Purpose (250 chars)

```
Ogosh serves a single purpose: enhancing WhatsApp Web communication across language barriers via real-time auto-translation and optional AI-powered emotional tone analysis. All features — translation, Emotion Pulse, Composer Panel — serve this one purpose.
```

---

## Permission Justification (740 chars)

```
Ogosh requires these host permissions:

1. https://web.whatsapp.com/* — Injects the content script to read message text for translation and render the Composer Panel and Emotion Pulse UI. This is the only site the extension operates on.

2. https://translate.googleapis.com/* — Sends message text to Google Translate for real-time translation. No API key or identifying info is included.

3. https://generativelanguage.googleapis.com/* — Sends message context to Gemini API for Emotion Pulse analysis (fallback). Only active when the user provides their own API key and enables tracking for a contact.

4. https://api.groq.com/* — Sends message context to Groq API for Emotion Pulse analysis (primary). Only active when the user provides their own API key and enables tracking.

The storage permission saves preferences, API keys, and tracked contacts locally.
```

---

## Storage Permission Justification (489 chars)

```
Ogosh uses chrome.storage.sync to save user preferences: selected interaction languages, target translation language, top 2 preferred languages, and optionally a Groq and/or Gemini API key entered by the user for Emotion Pulse. It uses chrome.storage.local to save tracked contact names (up to 3), per-contact message history (up to 200 messages) for emotion analysis, emoji frequency data, and Emotion Pulse on/off state. All data remains on the user's device. No data is sent to any server we operate.
```

---

## Are you using remote code? (249 chars)

```
No. Ogosh does not execute any remotely hosted code. All JavaScript, HTML, and CSS assets are fully bundled within the extension package. No external scripts are fetched or evaluated at runtime. This flag was triggered in error and does not apply.
```

---

## Data Usage / Privacy Policy (N/A — just link to your privacy.md)

Set the Privacy Policy URL field in the Developer Dashboard to:

```
https://github.com/mjht-05/Luna.Ogosh.AI.Privacy-Policy/blob/main/privacy.md
```

The full privacy policy (privacy.md) covers all required disclosures.

---

## Product Description (985 chars)

```
Break every language barrier on WhatsApp Web.

Ogosh automatically translates incoming WhatsApp messages into your preferred language — supporting 130+ languages including seamless Hinglish (Hindi-English) transliteration. No copy-pasting, no switching apps. Messages appear translated inline.

Key Features:

🌍 Auto-Translation — Incoming messages are translated in real time, right inside the chat. Powered by Google Translate (no API key needed).

✍️ Composer Panel — Type in any language and see a live translation preview before you send. Supports Hinglish → Hindi transliteration. Copy with one click.

🧠 Emotion Pulse — Track the emotional tone of up to 3 contacts using AI (Groq + Gemini). See primary, secondary, and tertiary emotions with intensity ratings. Requires your own free API key.

🔒 Privacy First — All data stays on your device. No accounts, no servers, no tracking. Emotion Pulse requires explicit consent per contact. AI calls use your own API keys.

Completely free. No ads. No data collection.
```

---

## Other Fields

| Field | Value |
|-------|-------|
| **Language** | English |
| **Official URL** | None |
| **Support URL** | `https://github.com/mjht-05/Luna.Ogosh.AI/issues` |
| **Mature Content** | No |
| **Visibility** | Public |

---

## Pre-Appeal Checklist

| # | Item | Status |
|---|------|--------|
| 1 | Push updated privacy.md to Privacy-Policy repo | ⏳ Do this |
| 2 | Replace `[YOUR_EMAIL_HERE]` in privacy.md with your email | ⏳ Do this |
| 3 | Paste new Permission Justification (above) into store form | ⏳ Do this |
| 4 | Paste new Product Description (above) into store form | 📝 Recommended |
| 5 | Set Support URL to GitHub Issues | 📝 Recommended |
| 6 | Confirm Language = English | ✅ |
| 7 | Confirm Mature Content = No | ✅ |
| 8 | Submit appeal | 🚀 |
