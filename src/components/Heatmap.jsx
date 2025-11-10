export default function Heatmap() {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const heatmapData = hours.map(() => days.map(() => Math.floor(Math.random() * 60) + 10));
  const maxValue = Math.max(...heatmapData.flat());

  return (
    <div className="overflow-x-auto mt-6">
      <div className="flex mb-2">
        <div className="w-16" />
        {days.map(day => <div key={day} className="w-10 text-center text-xs">{day}</div>)}
      </div>
      {hours.map((hour, i) => (
        <div key={hour} className="flex">
          <div className="w-16 text-right pr-2 text-xs text-gray-500">{hour}:00</div>
          {days.map((day, j) => {
            const val = heatmapData[i][j];
            const intensity = val / maxValue;
            return (
              <div key={day + i} title={`${day} ${hour}:00 - ${val}m`}
                className="w-10 h-8 m-0.5 rounded"
                style={{ backgroundColor: `rgba(59,130,246,${intensity})` }}></div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
