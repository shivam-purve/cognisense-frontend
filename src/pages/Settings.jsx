import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Settings = () => {
  const [websites, setWebsites] = useState([
    { name: 'github.com', category: 'Productivity' },
    { name: 'youtube.com', category: 'Entertainment' },
    { name: 'twitter.com', category: 'Social Media' },
  ]);

  const [trackingPrefs, setTrackingPrefs] = useState({
    activeTime: true,
    contentAnalysis: true,
    engagement: true,
    screenshots: false,
  });

  const [notifications, setNotifications] = useState({
    dailySummary: true,
    screenTimeAlerts: true,
    weeklyReport: true,
  });

  const [theme, setTheme] = useState('Dark');
  const [fontSize, setFontSize] = useState(16);
  const [showAddWebsite, setShowAddWebsite] = useState(false);
  const [newWebsiteName, setNewWebsiteName] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme('Dark');
    } else if (savedTheme === 'light') {
      setTheme('Light');
    }

    const savedFontSize = parseInt(localStorage.getItem('fontSize'), 10);
    if (!Number.isNaN(savedFontSize) && savedFontSize >= 12 && savedFontSize <= 20) {
      setFontSize(savedFontSize);
      document.documentElement.style.fontSize = `${savedFontSize}px`;
    }
  }, []);

  const applyTheme = (themeOption) => {
    let effectiveTheme = themeOption;

    if (themeOption === 'Auto' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'Dark' : 'Light';
    }

    setTheme(themeOption);

    const isDark = effectiveTheme === 'Dark';
    const themeValue = isDark ? 'dark' : 'light';

    localStorage.setItem('theme', themeValue);
    document.documentElement.classList.toggle('light', !isDark);
    document.body.style.backgroundColor = isDark ? '#0f1419' : '#f3f4f6';

    window.dispatchEvent(new CustomEvent('df-theme-change', { detail: themeValue }));
  };

  const handleFontSizeChange = (event) => {
    const newSize = Number(event.target.value);
    setFontSize(newSize);
    localStorage.setItem('fontSize', String(newSize));
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const handleAddWebsite = () => {
    if (newWebsiteName.trim()) {
      setWebsites([...websites, { name: newWebsiteName.trim(), category: 'Other' }]);
      setNewWebsiteName('');
      setShowAddWebsite(false);
    }
  };

  const handleDeleteWebsite = (index) => {
    const newWebsites = websites.filter((_, i) => i !== index);
    setWebsites(newWebsites);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Settings</h1>
        <p className="text-gray-400">Customize your tracking preferences and manage your data.</p>
      </div>

      {/* Website Categorization */}
      <div className="bg-[#1a1f2e] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Website Categorization</h2>
        <p className="text-gray-400 text-sm mb-6">Customize how websites are categorized for better insights.</p>
        
        <div className="space-y-4 mb-6">
          {websites.map((site, index) => (
            <div key={index} className="flex items-center justify-between gap-4 bg-[#2d3748] p-4 rounded-lg">
              <span className="text-gray-300 flex-1">{site.name}</span>
              <select
                value={site.category}
                onChange={(e) => {
                  const newWebsites = [...websites];
                  newWebsites[index].category = e.target.value;
                  setWebsites(newWebsites);
                }}
                className="bg-[#1a1f2e] text-gray-300 px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option>Productivity</option>
                <option>Entertainment</option>
                <option>Social Media</option>
                <option>News</option>
                <option>Other</option>
              </select>
              <button
                onClick={() => handleDeleteWebsite(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete website"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        
        {showAddWebsite && (
          <div className="mb-6 flex gap-3">
            <input
              type="text"
              value={newWebsiteName}
              onChange={(e) => setNewWebsiteName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddWebsite()}
              placeholder="Enter website URL (e.g., facebook.com)"
              className="flex-1 bg-[#2d3748] text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <button
              onClick={handleAddWebsite}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddWebsite(false);
                setNewWebsiteName('');
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
        
        <button
          onClick={() => setShowAddWebsite(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Website
        </button>
      </div>

      {/* Tracking Preferences */}
      <div className="bg-[#1a1f2e] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">Tracking Preferences</h2>
        
        <div className="space-y-4">
          {[
            { key: 'activeTime', label: 'Track Active Time', desc: "Monitor when you're actively using websites" },
            { key: 'contentAnalysis', label: 'Content Analysis', desc: 'Analyze emotional tone and content categories' },
            { key: 'engagement', label: 'Engagement Tracking', desc: 'Track clicks and interactions' },
            { key: 'screenshots', label: 'Screenshot Analysis', desc: 'Analyze visual content (Beta)' },
          ].map((pref) => (
            <div key={pref.key} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
              <div>
                <p className="text-gray-200 font-medium">{pref.label}</p>
                <p className="text-gray-500 text-sm">{pref.desc}</p>
              </div>
              <button
                onClick={() => setTrackingPrefs({ ...trackingPrefs, [pref.key]: !trackingPrefs[pref.key] })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  trackingPrefs[pref.key] ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    trackingPrefs[pref.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-[#1a1f2e] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">Notification Preferences</h2>
        
        <div className="space-y-4">
          {[
            { key: 'dailySummary', label: 'Daily Summary Email', desc: 'Receive daily reports via email' },
            { key: 'screenTimeAlerts', label: 'Screen Time Alerts', desc: 'Alert when exceeding time limits' },
            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Comprehensive weekly summary' },
          ].map((notif) => (
            <div key={notif.key} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
              <div>
                <p className="text-gray-200 font-medium">{notif.label}</p>
                <p className="text-gray-500 text-sm">{notif.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [notif.key]: !notifications[notif.key] })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[notif.key] ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[notif.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-[#1a1f2e] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">Theme Settings</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-3">Appearance</p>
            <div className="flex gap-3">
              {['Light', 'Dark', 'Auto'].map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => applyTheme(themeOption)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    theme === themeOption
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#2d3748] text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {themeOption}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-3">Font Size</p>
            <input
              type="range"
              min="12"
              max="20"
              value={fontSize}
              onChange={handleFontSizeChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;