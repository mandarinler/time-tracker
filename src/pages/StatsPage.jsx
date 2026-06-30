import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatDuration } from "../utils/formatDuration";
import "./StatsPage.css";
const PERIODS = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
];

export function StatsPage({ activities, timeEntries }) {
  const [periodType, setPeriodType] = useState("day");
  const [offset, setOffset] = useState(0);

  const { rangeStart, rangeEnd, rangeLabel } = useMemo(() => {
    const base = dayjs().add(offset, periodType);
    const start = base.startOf(periodType);
    const end = base.endOf(periodType);

    let label;
    if (periodType === "day") {
      label = start.format("dddd, MMM D");
    } else if (periodType === "week") {
      label = `${start.format("MMM D")} – ${end.format("MMM D")}`;
    } else {
      label = start.format("MMMM YYYY");
    }

    return { rangeStart: start, rangeEnd: end, rangeLabel: label };
  }, [periodType, offset]);

  const chartData = useMemo(() => {
    const totals = {};

    timeEntries.forEach((entry) => {
      if (entry.endTime === null) return;
      const entryStart = dayjs(entry.startTime);
      if (entryStart.isBefore(rangeStart) || entryStart.isAfter(rangeEnd)) return;

      totals[entry.activityId] = (totals[entry.activityId] || 0) + entry.duration;
    });

    return Object.entries(totals)
      .map(([activityId, duration]) => {
        const activity = activities.find((a) => a.id === Number(activityId));
        return {
          name: activity?.name ?? "Deleted activity",
          value: duration,
          color: activity?.color ?? "#666666",
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [timeEntries, activities, rangeStart, rangeEnd]);

  const totalTracked = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <>
      <p className="section-label">View by</p>
      <div className="period-toggle">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            className={periodType === p.key ? "active" : ""}
            onClick={() => {
              setPeriodType(p.key);
              setOffset(0);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="range-nav">
        <button onClick={() => setOffset((o) => o - 1)} aria-label="Previous period">
          ‹
        </button>
        <span className="range-label">{rangeLabel}</span>
        <button
          onClick={() => setOffset((o) => Math.min(o + 1, 0))}
          disabled={offset >= 0}
          aria-label="Next period"
        >
          ›
        </button>
      </div>

      {chartData.length === 0 ? (
        <p className="empty-state">No tracked time in this period</p>
      ) : (
        <>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#242B35",
                    border: "1px solid #3A4351",
                    borderRadius: 8,
                    fontFamily: "Manrope, sans-serif",
                    fontSize: 13,
                  }}
                  formatter={(value) => formatDuration(value)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-total">
              <span className="chart-total-value">{formatDuration(totalTracked)}</span>
              <span className="chart-total-label">total</span>
            </div>
          </div>

          <ul className="stats-breakdown">
            {chartData.map((d) => (
              <li key={d.name} className="stats-breakdown-item">
                <div className="history-item-info">
                  <span className="activity-dot" style={{ "--activity-color": d.color }} />
                  {d.name}
                </div>
                <span className="history-item-duration">{formatDuration(d.value)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
