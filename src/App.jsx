import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={isDarkMode ? "dark dark-mode min-h-screen" : "light-mode min-h-screen"}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab}
              toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              isDarkMode={isDarkMode} />
      {activeTab === "dashboard" && <Dashboard isDarkMode={isDarkMode} />}
      {activeTab === "analytics" && <Analytics isDarkMode={isDarkMode} />}
      {activeTab === "insights" && <div className="p-6">Insights (coming soon)</div>}
      {activeTab === "settings" && <div className="p-6">Settings (coming soon)</div>}
    </div>
  );
}
