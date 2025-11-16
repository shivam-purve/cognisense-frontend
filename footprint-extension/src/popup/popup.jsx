/* eslint-env browser */
/* global chrome */
import React, { useEffect, useState } from "react";
import "./popup.css";

function secToMin(seconds) {
  return Math.round(seconds / 60);
}

const isChrome = typeof chrome !== "undefined" && !!chrome.runtime;

const Popup = () => {
  const [todayMin, setTodayMin] = useState(0);
  const [paused, setPaused] = useState(false);
  const [engScore, setEngScore] = useState(0);

  useEffect(() => {
    // Get paused status (safe-guarded for dev)
    if (isChrome) {
      try {
        chrome.runtime.sendMessage({ type: "getStatus" }, (resp) => {
          if (resp && typeof resp.paused === "boolean") setPaused(resp.paused);
        });
      } catch (e) {
        console.warn("chrome.runtime not available:", e);
      }
    }

    // Get today's minutes and engagement summary
    if (isChrome) {
      try {
        chrome.storage.local.get({ events: [] }, (res) => {
          const events = res.events || [];
          const startDay = new Date();
          startDay.setHours(0, 0, 0, 0);

          let totalSeconds = 0,
            clicks = 0,
            keys = 0,
            scrolls = 0;

          events.forEach((e) => {
            if (e.type === "session_end" && e.ts >= startDay.getTime())
              totalSeconds += e.duration || 0;

            if (e.type === "engagement" && e.ts >= startDay.getTime()) {
              clicks += (e.data && e.data.clicks) || 0;
              keys += (e.data && e.data.keys) || 0;
              scrolls += (e.data && e.data.scrolls) || 0;
            }
          });

          setTodayMin(secToMin(totalSeconds));
          setEngScore(Math.min(100, Math.round((clicks + keys + scrolls) / 10)));
        });
      } catch (e) {
        console.warn("chrome.storage not available:", e);
      }
    } else {
      // Dev fallback: optionally load mock data
      // setTodayMin(12); setEngScore(42);
    }
  }, []);

  const togglePause = () => {
    if (!isChrome) return setPaused((p) => !p);
    const action = paused ? "resume" : "pause";
    try {
      chrome.runtime.sendMessage({ type: action }, (resp) => {
        setPaused(resp?.paused || false);
      });
    } catch (e) {
      console.warn("togglePause failed:", e);
    }
  };

  const openOptions = () => {
  if (!isChrome) {
    window.open('options/index.html', '_blank');
    return;
  }

  try {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage(() => {
        if (chrome.runtime.lastError) {
          window.open(chrome.runtime.getURL('options/index.html'), '_blank');
        }
      });
    } else {
      window.open(chrome.runtime.getURL('options/index.html'), '_blank');
    }
  } catch (err) {
    console.warn('openOptions failed, falling back:', err);
    try { window.open(chrome.runtime.getURL('options/index.html'), '_blank'); } catch (_) {}
  }
};


  const openDashboard = () => {
    if (!isChrome) {
      // dev fallback: open a local page or external dashboard
      window.open("https://example.com/your-dashboard", "_blank");
      return;
    }
    try {
      chrome.tabs.create({ url: "https://example.com/your-dashboard" });
    } catch (e) {
      console.warn("openDashboard failed:", e);
    }
  };

  return (
    <div className="popup">
      <header className="pf-header">
        <div className="logo">🦶</div>
        <h1>Digital Footprint</h1>
      </header>

      <div className="cards">
        <div className="card">
          <div className="title">Today</div>
          <div className="value">{todayMin} min</div>
        </div>
        <div className="card">
          <div className="title">Engagement</div>
          <div className="value">{engScore} / 100</div>
        </div>
      </div>

      <div className="controls">
        <button className="primary" onClick={togglePause}>
          {paused ? "Resume Tracking" : "Pause Tracking"}
        </button>

        <div className="secondary-row">
          <button className="link" onClick={openOptions}>
            Options
          </button>
          <button className="link" onClick={openDashboard}>
            Dashboard
          </button>
        </div>
      </div>

      <footer className="pf-footer">
        <small>Data stored locally. Text scanning off by default.</small>
      </footer>
    </div>
  );
};

export default Popup;
