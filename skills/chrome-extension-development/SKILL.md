---
name: chrome-extension-development
description: Chrome extension patterns — manifest V3, content scripts, background workers, messaging
triggers: [Chrome extension, browser extension, manifest V3, content script, background worker]
---

# SKILL: Chrome Extension Development

## Manifest V3

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0.0",
  "description": "Extension description",
  
  "permissions": [
    "storage",
    "tabs",
    "activeTab"
  ],
  
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  
  "background": {
    "service_worker": "background.js"
  },
  
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}
```

## Content Script (Inject into pages)

```javascript
// content.js - Runs on web pages
console.log('Content script loaded')

// Modify DOM
document.body.style.backgroundColor = 'lightblue'

// Send message to background
chrome.runtime.sendMessage({
  type: 'PAGE_LOADED',
  url: window.location.href
})
```

## Background Worker

```javascript
// background.js - Runs in background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_LOADED') {
    console.log('Page loaded:', message.url)
    
    // Store in chrome.storage
    chrome.storage.local.set({ lastUrl: message.url })
  }
})
```

## Popup UI

```html
<!-- popup.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { width: 300px; padding: 10px; }
  </style>
</head>
<body>
  <h1>My Extension</h1>
  <button id="action">Click me</button>
  <script src="popup.js"></script>
</body>
</html>
```

```javascript
// popup.js
document.getElementById('action').addEventListener('click', async () => {
  // Get active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  
  // Execute script in tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => alert('Hello from extension!')
  })
})
```

## Quality Checks
- [ ] Manifest V3 (not V2)
- [ ] Permissions minimal (only what's needed)
- [ ] Content Security Policy configured
- [ ] Storage API for persistence
- [ ] Messaging between scripts working
- [ ] Extension tested in Chrome
- [ ] Published to Chrome Web Store
- [ ] Auto-update configured
