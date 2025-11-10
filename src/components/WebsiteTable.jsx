import { useState, useMemo } from "react";

export default function WebsitesTable({ websites }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [ascending, setAscending] = useState(true);
  const [filter, setFilter] = useState("all");

  const filteredSites = useMemo(() => {
    let list = [...websites];
    if (filter !== "all") list = list.filter(w => w.category === filter);
    if (sortColumn) {
      list.sort((a, b) => {
        let aVal = a[sortColumn], bVal = b[sortColumn];
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        return ascending ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
      });
    }
    return list;
  }, [filter, sortColumn, ascending, websites]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <select className="bg-gray-100 dark:bg-gray-700 rounded-md p-2" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="Productivity">Productivity</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Social Media">Social Media</option>
        </select>
      </div>

      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-gray-500 dark:text-gray-400">
            <th onClick={() => setSortColumn("name")} className="cursor-pointer">Website</th>
            <th onClick={() => setSortColumn("time")} className="cursor-pointer">Time</th>
            <th>Category</th>
            <th>Engagement</th>
          </tr>
        </thead>
        <tbody>
          {filteredSites.map((site, i) => {
            const color = {
              Productivity: "bg-green-100 text-green-700",
              Entertainment: "bg-orange-100 text-orange-700",
              "Social Media": "bg-blue-100 text-blue-700"
            }[site.category];
            return (
              <tr key={i} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                <td className="py-3 px-4">{site.name}</td>
                <td className="py-3 px-4">{site.time}m</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${color}`}>{site.category}</span>
                </td>
                <td className="py-3 px-4">{site.engagement}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
