# Privacy Policy for Ogosh

**Effective Date: 23 June 2025**
**Last Updated: 23 June 2025**

---

Ogosh ("the Extension") is a Chrome browser extension developed by an independent developer ("we," "us," or "our"). Ogosh enhances WhatsApp Web communication across language barriers by providing real-time auto-translation of messages and optional AI-powered emotional tone analysis of conversations.

This Privacy Policy describes how Ogosh collects, uses, stores, shares, and protects user data. By installing and using Ogosh, you agree to the practices described in this policy.

---

## 1. Data We Collect

Ogosh collects and processes the following categories of data:

### 1.1 User Preferences (Stored Locally)

| Data | Purpose |
|------|---------|
| Selected WhatsApp interaction languages | Determines which messages to translate |
| Chosen translation target language | Specifies the language to translate messages into |
| Top 2 preferred target languages | Enables quick language switching in the popup |

### 1.2 API Keys (Stored Locally)

| Data | Purpose |
|------|---------|
| Groq API key (user-provided) | Authenticates requests for Emotion Pulse analysis (primary provider) |
| Gemini API key (user-provided) | Authenticates requests for Emotion Pulse analysis (fallback provider) |

API keys are provided voluntarily by the user. If no API keys are entered, the Emotion Pulse feature simply does not function. Translation works without any API key.

### 1.3 WhatsApp Message Content (Processed Locally)

Ogosh reads the text content of messages displayed in the WhatsApp Web interface. This data is:

- Read directly from the browser DOM (Document Object Model)
- Used for real-time translation and, when enabled, emotion analysis
- **Never stored on any external server operated by us**

### 1.4 Emotion Pulse Data (Stored Locally, Opt-In Only)

When a user explicitly enables Emotion Pulse for a specific contact (via an in-product consent dialog), the following data is stored **locally on the user's device only**:

| Data | Purpose |
|------|---------|
| Tracked contact display names (up to 3 contacts) | Identifies which contacts have Emotion Pulse enabled |
| Message history (up to 200 messages per tracked contact) | Provides context for emotional tone analysis |
| Emoji usage frequency per tracked contact | Enhances accuracy of emotional tone analysis |
| Emotion Pulse on/off state per contact | Remembers user preference across sessions |

This data collection requires **explicit, affirmative user consent** via an in-product dialog before any tracking begins.

---

## 2. How We Use Your Data

All data is used exclusively in service of Ogosh's single core purpose — facilitating WhatsApp Web communication across language barriers:

| Data Type | Use |
|-----------|-----|
| User language preferences | To determine which messages to translate and into which language |
| Message text | To translate messages into the user's preferred language, and to analyse emotional tone when Emotion Pulse is enabled |
| API keys | To authenticate requests to AI services (Groq and Gemini) on the user's behalf for Emotion Pulse analysis |
| Tracked contact data | To build and display emotional tone analysis over time for selected contacts |
| Emoji frequency data | To improve the accuracy of emotional tone analysis |

We do **not** use any data for advertising, analytics, profiling, marketing, or any purpose unrelated to the Extension's core functionality.

---

## 3. Data Sharing and Third-Party Services

### 3.1 Third-Party Services We Use

Ogosh transmits data to the following third-party services. All transmissions use HTTPS encryption and are made **directly from the user's browser** — data never passes through our servers:

| Service | Data Transmitted | Purpose | Authentication |
|---------|-----------------|---------|---------------|
| **Google Translate API** (`translate.googleapis.com`) | Message text (plain text) | Real-time message translation | No API key required (public endpoint) |
| **Groq API** (`api.groq.com`) | Contact name, last 20 messages (sender name + message text), emoji frequency patterns | Emotion Pulse emotional tone analysis (primary) | User's own Groq API key |
| **Google Gemini API** (`generativelanguage.googleapis.com`) | Contact name, last 20 messages (sender name + message text), emoji frequency patterns | Emotion Pulse emotional tone analysis (fallback) | User's own Gemini API key |

### 3.2 Important Notes on Third-Party Data Sharing

- Data sent to Groq and Gemini is authenticated using **your own personally-created API keys**, not ours. You maintain your own relationship with these providers.
- We encourage you to review the privacy policies of these services:
  - [Groq Privacy Policy](https://groq.com/privacy-policy/)
  - [Google Privacy Policy](https://policies.google.com/privacy)
- Google Translate requests are made to a public translation endpoint and do not include any API key or user-identifying information.
- Emotion Pulse data is only transmitted when the user has (a) provided an API key and (b) explicitly enabled tracking for a contact.

### 3.3 Parties We Do NOT Share Data With

- We do **not** share user data with data brokers or information resellers.
- We do **not** share user data with advertisers or advertising networks.
- We do **not** share, sell, rent, or trade user data with any other third party not listed above.
- We do **not** operate any servers that receive, process, or store user data.

---

## 4. Data Storage and Retention

### 4.1 Storage Location

All data is stored **locally on your device** using Chrome's built-in extension storage APIs:

| Storage Type | Data Stored | Scope |
|-------------|-------------|-------|
| `chrome.storage.sync` | Language preferences, API keys | Syncs across your Chrome instances (if Chrome Sync is enabled) |
| `chrome.storage.local` | Tracked contacts, message history, emoji frequency, UI state | Local to the device only |

### 4.2 Retention Period

- **User preferences and API keys**: Retained until the user changes them or uninstalls the Extension.
- **Tracked contact data (message history, emoji frequency)**: Retained until the user removes the tracked contact via the Extension's settings, or uninstalls the Extension.
- **Message history cap**: A maximum of 200 messages per tracked contact are stored. Older messages are automatically deleted when the cap is reached.

### 4.3 Data Deletion

- **Remove a tracked contact**: Open the Ogosh popup → Tracked Contacts → click the remove (✕) button. This permanently deletes the contact's stored message history and emoji data.
- **Uninstall the Extension**: Uninstalling Ogosh from Chrome automatically deletes all locally stored data, including preferences, API keys, and tracked contact data.
- **No server-side data exists**: Because we do not operate any servers, there is no remote data to delete.

---

## 5. Data Security

We implement the following security measures to protect your data:

- **HTTPS encryption**: All data transmitted to third-party services (Google Translate, Groq, Gemini) is sent over HTTPS, ensuring data is encrypted in transit.
- **Local-only storage**: All persistent data is stored in Chrome's extension storage, which is sandboxed and inaccessible to other extensions or websites.
- **No remote storage**: We do not operate any servers, databases, or cloud services that store user data.
- **No remote code execution**: All JavaScript, HTML, and CSS assets are fully bundled within the Extension package. No external scripts are fetched or evaluated at runtime.
- **User-controlled API keys**: AI service authentication uses API keys that you create and control. You can revoke these keys at any time through the respective provider's dashboard.
- **No human access**: We do not read, view, or access your data in any form. The developer has no mechanism to access data stored locally on your device.

---

## 6. User Rights and Choices

You have full control over your data:

| Right | How to Exercise |
|-------|----------------|
| **View your settings** | Open the Ogosh popup to see your current language preferences and tracked contacts |
| **Modify your settings** | Change languages, API keys, or tracked contacts at any time via the Ogosh popup |
| **Delete tracked contact data** | Remove any tracked contact from the Ogosh popup settings to permanently delete their stored data |
| **Revoke Emotion Pulse consent** | Click the 🧠 toggle button in WhatsApp Web or the ✕ button on the Emotion Pulse panel to disable tracking for a contact |
| **Opt out of Emotion Pulse entirely** | Simply do not provide API keys; the feature will not activate |
| **Delete all data** | Uninstall the Ogosh extension from Chrome to remove all stored data |
| **Revoke third-party API access** | Delete or regenerate your API keys in the Groq Console or Google AI Studio at any time |

---

## 7. Prohibited Uses and Limited Use Compliance

### 7.1 Prohibited Uses

We affirm that Ogosh does **not**:

- Sell user data to third parties
- Use or transfer user data for personalised advertising
- Use or transfer user data for creditworthiness determination or lending purposes
- Use or transfer user data to any data brokers or information resellers
- Use user data for any purpose unrelated to the Extension's single core purpose

### 7.2 Limited Use Disclosure

The use of information received from Google APIs will adhere to the [Chrome Web Store User Data Policy](https://developer.chrome.com/docs/webstore/program_policies/), including the Limited Use requirements.

---

## 8. Children's Privacy

Ogosh is not directed at children under the age of 13 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect personal information from children. If you believe a child under 13 has used this Extension, please contact us and we will take steps to address the concern.

---

## 9. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. When we do:

- The "Last Updated" date at the top of this policy will be revised.
- For material changes, we will update the Extension's listing on the Chrome Web Store.
- Continued use of the Extension after changes constitutes acceptance of the updated policy.

We encourage you to review this policy periodically for any changes.

---

## 10. Contact Us

If you have any questions, concerns, or requests regarding this Privacy Policy or Ogosh's data practices, please contact us at:

📧 **yadav.shashank05@gmail.com**

---

*This privacy policy applies solely to the Ogosh browser extension and does not cover any other products or services.*
