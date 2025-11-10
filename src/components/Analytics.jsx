import Heatmap from "./Heatmap";
import Charts from "./Charts";
import { analyticsData } from "../data/analyticsData";

export default function Analytics({ isDarkMode }) {
  return (
    <div className="p-6 fade-in">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <div className="card bg-white dark:bg-gray-800 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-4">Weekly Activity Heatmap</h2>
        <Heatmap />
      </div>
      <div className="card bg-white dark:bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Productivity vs Distraction</h2>
        <div className="h-[300px]"><Charts data={analyticsData} isDarkMode={isDarkMode} /></div>
      </div>
    </div>
  );
}
