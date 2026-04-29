# LLM Prompt Security Scanner - Browser Extension MVP

✅ **Real-Time Detection** - Shows warnings AS YOU TYPE on ChatGPT, Claude, and other LLM sites!

## How It Works

### 🎯 Two Modes

**Mode 1: Real-Time Detection (PRIMARY)**
- Extension **automatically monitors** ChatGPT, Claude, Gemini as you type
- Shows a colored warning banner in the top-right corner
- No need to copy-paste anything
- Updates live as you type

**Mode 2: Manual Scanning (BACKUP)**
- Click extension icon
- Paste prompt manually
- Useful if auto-detection doesn't catch it

---

## Quick Setup (3 minutes)

1. **Load into Chrome:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked"
   - Select your `LLM Security Bot` folder

2. **Go to ChatGPT or Claude**
   - https://chat.openai.com
   - https://claude.ai

3. **Start typing in the chat box**
   - Watch for colored warnings as you type
   - ✅ Green = safe
   - ⚠️  Yellow = medium risk
   - ⚠️  Orange = high risk  
   - 🚨 Red = critical (don't send!)

---

## Warning Banner Meanings

| Banner Color | Risk Level | What to Do |
|-------------|-----------|-----------|
| 🟢 Green | LOW | Safe to send ✅ |
| 🟡 Yellow | MEDIUM | Review if sensitive |
| 🟠 Orange | HIGH | Edit before sending |
| 🔴 Red | CRITICAL | DO NOT SEND ❌ |

---

## What It Detects

- 🔴 **CRITICAL:** Private encryption keys (`-----BEGIN RSA PRIVATE KEY-----`)
- 🟠 **HIGH:** 
  - API keys (`sk_test_`, `pk_live_`, AKIA...)
  - AWS credentials
  - Database passwords (`password:`, `pwd:`)
  - Social Security Numbers (XXX-XX-XXXX)
  - Credit Cards (XXXX-XXXX-XXXX-XXXX)
  - Database URLs (`mongodb://`, `postgres://`)
- 🟡 **MEDIUM:** Email addresses

---

## Supported Sites

✅ ChatGPT (https://chat.openai.com)
✅ Claude (https://claude.ai)  
✅ Google Gemini (https://gemini.google.com)
✅ ChatGPT.com (https://chatgpt.com)
✅ Perplexity (https://perplexity.ai)

*(More can be easily added)*

---

## How to Use

### Real-Time Monitoring (Automatic)

1. Open ChatGPT or Claude
2. Start typing a prompt
3. If you accidentally type sensitive data, a warning banner appears immediately
4. Edit your prompt before sending
5. Warning disappears when safe text is entered

**Example:**
```
You type: "My API key is sk_test_abc123"
          ↓
Extension shows: 🟠 HIGH RISK: API Key found
          ↓
You edit to: "I have an API key"
          ↓
Warning disappears ✅
```

### Manual Scanning (Backup)

1. Click extension icon in toolbar
2. Paste text into popup
3. Click "Scan Prompt"
4. Review findings
5. Click "Redact" to remove sensitive data

---

## Files

- `manifest.json` - Extension config
- `popup.html` - Popup UI  
- `popup.css` - Styling
- `popup.js` - Popup logic
- `pii-detector.js` - Detection engine (regex patterns)
- `content.js` - **Real-time monitoring on LLM pages**
- `background.js` - Message routing
- `README.md` - This file

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Banner doesn't appear on ChatGPT | Refresh the page after loading extension |
| Banner appears but wrong site detected | Check the `content_scripts` matches in manifest.json |
| Detection too slow | Increase delay in `debounce(func, 500)` in content.js |
| Too many false positives | Edit regex patterns in `pii-detector.js` |
| Extension icon is grey | Add PNG icons to `images/` folder (16x16, 48x48, 128x128) |

---

## Next Steps

1. ✅ Load extension into Chrome
2. ✅ Go to ChatGPT/Claude
3. ✅ Type a test prompt with sensitive data
4. ✅ Watch the warning banner appear
5. Share with your team
6. Collect feedback
7. Phase 2: Add backend logging to MongoDB

---

v0.1.0 - MVP with Real-Time Detection

