let activeTabId = null;
let activeStart = null;
let activeUrl = null;
let paused = false;

// Dummy endpoints
const SESSION_API = "https://dummy.server.com/session";
const HTML_API = "https://dummy.server.com/html";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["events", "settings"], (res) => {
    if (!res.events) chrome.storage.local.set({ events: [] });
    if (!res.settings)
      chrome.storage.local.set({
        settings: { contentScanning: false, excludeList: [] }
      });
  });
});

// Persist local events
function persistEvent(event) {
  chrome.storage.local.get({ events: [] }, (res) => {
    const events = res.events || [];
    const twoWeeks = Date.now() - 14 * 24 * 60 * 60 * 1000;

    const filtered = events.filter((e) => e.ts >= twoWeeks);
    filtered.push(event);

    chrome.storage.local.set({ events: filtered });
  });
}

// Backend POST
async function sendSessionToBackend(url, start, end) {
  const duration = end - start;

  try {
    await fetch(SESSION_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        startTime: start,
        endTime: end,
        duration
      })
    });
  } catch (err) {
    console.warn("SESSION API ERROR", err);
  }
}

async function sendHtmlToBackend(url, htmlText) {
  try {
    await fetch(HTML_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, html: htmlText })
    });
  } catch (err) {
    console.warn("HTML API ERROR", err);
  }
}

// Guaranteed contentScript injection before request
function fetchPageText(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["content/contentScript.js"]
      },
      () => {
        chrome.tabs.sendMessage(
          tabId,
          { type: "request_full_text" },
          (resp) => resolve(resp?.text || "")
        );
      }
    );
  });
}

// Stop active session
async function stopActiveTimer() {
  if (!activeTabId || !activeStart || !activeUrl) return;

  const end = Date.now();
  const tabId = activeTabId;
  const url = activeUrl;

  const htmlText = await fetchPageText(tabId);

  sendSessionToBackend(url, activeStart, end);
  sendHtmlToBackend(url, htmlText);

  persistEvent({
    type: "session_end",
    url,
    duration: end - activeStart,
    ts: end
  });

  activeTabId = null;
  activeStart = null;
  activeUrl = null;
}

// Start new session
function handleSwitch(tab) {
  stopActiveTimer();

  if (!tab || !tab.url) return;
  if (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://"))
    return;

  chrome.storage.local.get({ settings: { excludeList: [] } }, (res) => {
    const excludeList = res.settings.excludeList || [];
    if (excludeList.some((e) => tab.url.includes(e))) return;

    activeTabId = tab.id;
    activeUrl = tab.url;
    activeStart = Date.now();

    persistEvent({
      type: "session_start",
      url: tab.url,
      ts: Date.now()
    });
  });
}

// Listeners
chrome.tabs.onActivated.addListener(async (info) => {
  if (paused) return;
  const tab = await chrome.tabs.get(info.tabId);
  handleSwitch(tab);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (paused) return;

  if (windowId === chrome.windows.WINDOW_ID_NONE) stopActiveTimer();
  else
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs[0]) handleSwitch(tabs[0]);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (paused) return;

  if (tabId === activeTabId && changeInfo.status === "complete")
    handleSwitch(tab);
});

// Message handlers
chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
  if (!msg?.type) return;

  if (msg.type === "pause") {
    paused = true;
    stopActiveTimer();
    sendResp({ paused: true });
    return true;
  }

  if (msg.type === "resume") {
    paused = false;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) handleSwitch(tabs[0]);
    });
    sendResp({ paused: false });
    return true;
  }

  if (msg.type === "getStatus") {
    sendResp({ paused });
    return true;
  }

  if (msg.type === "engagement") {
    persistEvent({
      type: "engagement",
      url: sender.tab?.url || "",
      data: msg.data,
      ts: Date.now()
    });
    sendResp({ ok: true });
    return true;
  }

  // NEW: handle auto-sent page_html
  if (msg.type === "page_html") {
    sendHtmlToBackend(sender.tab?.url || "", msg.text);
    sendResp({ ok: true });
    return true;
  }
});
