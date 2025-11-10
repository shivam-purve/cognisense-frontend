import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

export default function Charts({ data, isDarkMode }) {
  const weeklyRef = useRef(null);
  const emotionalRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    const textColor = isDarkMode ? "#F9FAFB" : "#1F2937";
    const gridColor = isDarkMode ? "#374151" : "#E5E7EB";

    const weeklyChart = new Chart(weeklyRef.current, {
      type: "bar",
      data: {
        labels: data.weekly_data.map(d => d.day),
        datasets: [
          { label: "Productive", data: data.weekly_data.map(d => d.productive), backgroundColor: "#10B981", borderRadius: 6 },
          { label: "Social", data: data.weekly_data.map(d => d.social), backgroundColor: "#3B82F6", borderRadius: 6 },
          { label: "Entertainment", data: data.weekly_data.map(d => d.entertainment), backgroundColor: "#F59E0B", borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: textColor } },
          y: { stacked: true, beginAtZero: true, ticks: { color: textColor, callback: v => `${v}m` } }
        },
        plugins: { legend: { labels: { color: textColor } } }
      }
    });

    const emotionalChart = new Chart(emotionalRef.current, {
      type: "doughnut",
      data: {
        labels: ["Positive", "Neutral", "Negative", "Biased"],
        datasets: [{ data: Object.values(data.emotional_balance), backgroundColor: ["#10B981", "#6B7280", "#EF4444", "#F59E0B"] }]
      },
      options: { responsive: true, plugins: { legend: { labels: { color: textColor } } } }
    });

    const timelineChart = new Chart(timelineRef.current, {
      type: "line",
      data: {
        labels: data.weekly_data.map(d => d.day),
        datasets: [
          { label: "Productive Hours", data: data.weekly_data.map(d => (d.productive / 60).toFixed(1)), borderColor: "#10B981", fill: true },
          { label: "Distracting Hours", data: data.weekly_data.map(d => ((d.social + d.entertainment) / 60).toFixed(1)), borderColor: "#EF4444", fill: true }
        ]
      },
      options: { responsive: true, scales: { y: { ticks: { color: textColor } } } }
    });

    return () => {
      weeklyChart.destroy();
      emotionalChart.destroy();
      timelineChart.destroy();
    };
  }, [data, isDarkMode]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
      <canvas ref={weeklyRef}></canvas>
      <canvas ref={emotionalRef}></canvas>
      <canvas ref={timelineRef} className="col-span-2"></canvas>
    </div>
  );
}
