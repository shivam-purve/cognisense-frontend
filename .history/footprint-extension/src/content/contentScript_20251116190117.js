// content/contentScript.js
(function () {
  "use strict";

  let engagement = { clicks: 0, keys: 0, scrolls: 0 };
  let timerInterval = null; // We keep this to clear it, just in case
  let uiContainer = null;
  let timeEl = null;
  let tabsEl = null;

  // --- NEW: UI Creation ---

  function formatTime(ms) {
    if (isNaN(ms) || ms < 0) ms = 0;
    
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function createTimerUI() {
    if (document.getElementById('df-timer-ui')) return; // Already exists

    uiContainer = document.createElement('div');
    uiContainer.id = 'df-timer-ui';
    Object.assign(uiContainer.style, {
      position: 'fixed',
      //
      // --- CHANGE LOCATION HERE ---
      //
      bottom: '15px', // e.g., change to 'top'
      right: '15px',  // e.g., change to 'left'
      //
      // --- END LOCATION ---
      //
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '8px',
      zIndex: '9999999',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      textAlign: 'right',
      lineHeight: '1.4'
    });
    
    timeEl = document.createElement('div');
    timeEl.textContent = '00:00:00';
    
    tabsEl = document.createElement('div');
    tabsEl.textContent = '0 tabs opened';
    Object.assign(tabsEl.style, {
      fontSize: '11px',
      opacity: '0.8'
    });
    
    uiContainer.appendChild(timeEl);
    uiContainer.appendChild(tabsEl);
    document.body.appendChild(uiContainer);
  }

  // --- Engagement Listeners (Unchanged) ---
  
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

  document.addEventListener("click", (ev) => {
    if (!isSensitiveInput(ev.target)) engagement.clicks++;
  }, { passive: true });

  document.addEventListener("keydown", (ev) => {
    const active = document.activeElement;
    if (!isSensitiveInput(active) && ev.key?.length === 1) engagement.keys++;
  }, { passive: true });

  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const now = Date.now();
    if (now - lastScroll > 300) {
      engagement.scrolls++;
      lastScroll = now;
    }
  }, { passive: true });
  
  // --- Messaging (Modified) ---

  function safeSendMessage(msg, cb) {
    try {
      chrome.runtime.sendMessage(msg, (resp) => {
        if (chrome.runtime.lastError) {
          cb?.({ ok: false }); return;
        }
        cb?.(resp);
      });
    } catch (err) {
      cb?.({ ok: false });
    }
  }

  function extractPageText() {
    try {
      return document.body?.innerText?.slice(0, 50000) || "";
    } catch {
      return "";
    }
  }

  safeSendMessage({
    type: "page_html",
    text: extractPageText()
  });

  // Listen for background requests
  chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
    if (!msg?.type) return;

    if (msg.type === "request_full_text") {
      sendResp({ 
        text: extractPageText(),
        engagement: engagement
      });
      engagement = { clicks: 0, keys: 0, scrolls: 0 }; 
      return true;
    }

    // MODIFIED: Listen for timer updates
    if (msg.type === "UPDATE_TIMER") {
      createTimerUI(); // Create UI if it doesn't exist
      
      // We only need baseTime and tabCount
      const { baseTime, tabCount } = msg;

      // Update tab count
      tabsEl.textContent = `${tabCount} tabs opened`;
      
      // REMOVED: Active timer logic
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }

      // MODIFIED: Set the static total time. It will not tick.
      // We don't use 'startTime' anymore.
      timeEl.textContent = formatTime(baseTime);
      
      sendResp({ ok: true });
      return true;
    }
  });
})();