import Charts from "./Charts";
import WebsitesTable from "./WebsiteTable";
import { analyticsData } from "../data/analyticsData";

export default function Dashboard({ isDarkMode }) {
  return (
    <div className="p-6 fade-in">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          ["Total Screen Time", "8h 7m", "↑ 12% vs yesterday", "border-blue-500"],
          ["Productive Time", "3h 54m", "↑ 15% vs yesterday", "border-green-500"],
          ["Social Media", "1h 40m", "↓ 8% vs yesterday", "border-purple-500"],
          ["Entertainment", "2h 33m", "↑ 5% vs yesterday", "border-orange-500"]
        ].map(([title, time, trend, border]) => (
          <div key={title} className={`card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 ${border}`}>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <h3 className="text-3xl font-bold mt-2 dark:text-white">{time}</h3>
            <p className="text-sm mt-2">{trend}</p>
          </div>
        ))}
      </div>

      <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Weekly Screen Time Overview</h2>
        <div className="h-[300px]"><Charts data={analyticsData} isDarkMode={isDarkMode} /></div>
      </div>

      <WebsitesTable websites={analyticsData.top_websites} />
    </div>
  );
}
