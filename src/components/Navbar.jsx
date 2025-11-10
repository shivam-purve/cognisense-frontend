export default function Navbar({ activeTab, setActiveTab, toggleDarkMode, isDarkMode }) {
  const tabs = ["dashboard", "analytics", "insights", "settings"];
  return (
    <nav className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center space-x-2 text-xl font-bold dark:text-white">
          <span>⏱</span><span>Digital Footprint</span>
        </div>
        <div className="hidden md:flex space-x-6">
          {tabs.map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize tab-button ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>
              {tab}
            </button>
          ))}
        </div>
        <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
