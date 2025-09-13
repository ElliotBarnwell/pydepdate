import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ReleaseHistory } from "./pypihistory";
import { format, parseISO } from "date-fns";

export default function Example({ data }: { data: ReleaseHistory[] }) {
  // Group releases by package name
  const grouped = data.reduce<Record<string, ReleaseHistory[]>>((acc, release) => {
    acc[release.name] = acc[release.name] || [];
    acc[release.name].push(release);
    return acc;
  }, {});

  // Helper to generate a random color
  function randomColor() {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  }
  // Get all unique dates, sorted
  const allDates = Array.from(
    new Set(data.map(r => r.date))
  ).sort();

  // Build chart data: one object per date, with each package as a key
  const chartData = allDates.map(date => {
    const entry: Record<string, any> = { date };
    for (const pkg in grouped) {
      const release = grouped[pkg].find(r => r.date === date);
      entry[pkg] = release ? release.version : null;
    }
    return entry;
  });

// Assign a random color to each package (memoized for stable colors)
  const colorMap = Object.fromEntries(
    Object.keys(grouped).map(pkg => [pkg, randomColor()])
  );

  return (
    <div style={{ backgroundColor: "white", padding: "1rem", borderRadius: "8px", width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={str => {
              try {
                return format(parseISO(str), "yyyy-MM-dd");
              } catch {
                return str;
              }
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(grouped).map(pkg => (
            <Line
              key={pkg}
              type="monotone"
              dataKey={pkg}
              name={pkg}
              stroke={colorMap[pkg]}
              activeDot={{ r: 8 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}