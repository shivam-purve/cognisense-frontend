// content/contentScript.js
(function () {
  "use strict";

  let engagement = { clicks: 0, keys: 0, scrolls: 0 };

  function isSensitiveInput(el) {
    if (!el) return false;
    const tag = (el.tagName || "").toLowerCase();
    const type = (el.type || "").toLowerCase();
    const ac = (el.autocomplete || "").toLowerCase();

    if (tag === "input" && ["password", "email", "tel", "number"].includes(type))
      return true;
    if (ac.includes("cc-")) return true;
    return false;
  }

  function safeSendMessage(msg, cb) {
    try {
      chrome.runtime.sendMessage(msg, (resp) => {
        if (chrome.runtime.lastError) {
          cb?.({ ok: false, error: chrome.runtime.lastError.message });
          return;
        }
        cb?.(resp);
      });
    } catch (err) {
      cb?.({ ok: false, error: err.message });
    }
  }

  // Engagement listeners
  document.addEventListener(
    "click",
    (ev) => {
      if (!isSensitiveInput(ev.target)) engagement.clicks++;
    },
    { passive: true }
  );

  document.addEventListener(
    "keydown",
    (ev) => {
      const active = document.activeElement;
      if (!isSensitiveInput(active) && ev.key?.length === 1) engagement.keys++;
    },
    { passive: true }
  );

  let lastScroll = 0;
  window.addEventListener(
    "scroll",
    () => {
      const now = Date.now();
      if (now - lastScroll > 300) {
        engagement.scrolls++;
        lastScroll = now;
      }
    },
    { passive: true }
  );

  // REMOVED: The 10-second setInterval flush is no longer needed.
  // The background script now controls when data is flushed.

  // Extract page text
  function extractPageText() {
    try {
      return document.body?.innerText?.slice(0, 50000) || "";
    } catch {
      return "";
    }
  }

  // Auto-send initial page text
  safeSendMessage({
    type: "page_html",
    text: extractPageText()
  });

  // Listen for background requests
  chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
    if (!msg?.type) return;

    if (msg.type === "request_full_text") {
      // CHANGED: Send engagement data along with text
      sendResp({
        text: extractPageText(),
        engagement: engagement
      });
      // Reset engagement after this *final* flush
      engagement = { clicks: 0, keys: 0, scrolls: 0 };
      return true; // Indicates async response
    }
    
    // NEW: Handle interim requests from the background script
    if (msg.type === "request_interim_engagement") {
      const dataToSend = engagement;
      engagement = { clicks: 0, keys: 0, scrolls: 0 }; // Reset
      sendResp({ engagement: dataToSend });
      return true; // Indicates async response
    }
  });
})();