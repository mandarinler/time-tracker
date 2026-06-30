import { useState, useEffect } from "react";
import "./App.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);



function App() {
  const [activities, setActivities] = useState([
    { id: 1, name: "Coding", color: "#4f9cff" },
    { id: 2, name: "Watching YouTube", color: "#ff4f4f" },
  ]);
  const [, forceTick] = useState(0);
  const [timeEntries, setTimeEntries] = useState([]);
  const runningEntry = timeEntries.find((e) => e.endTime === null);
  
  function formatDuration(ms) {
  const d = dayjs.duration(ms);
  const hours = Math.floor(d.asHours());
  const minutes = d.minutes();
  const seconds = d.seconds();

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
  function startActivity(activityId) {
    const now = Date.now();

    setTimeEntries((prev) => {
      // close out any currently running entry
      const closed = prev.map((entry) =>
        entry.endTime === null
          ? { ...entry, endTime: now, duration: now - entry.startTime }
          : entry,
      );

      // add the new running entry
      return [
        ...closed,
        { id: now, activityId, startTime: now, endTime: null, duration: null },
      ];
    });
  }

  function stopCurrent() {
    const now = Date.now();
    setTimeEntries((prev) =>
      prev.map((entry) =>
        entry.endTime === null
          ? { ...entry, endTime: now, duration: now - entry.startTime }
          : entry,
      ),
    );
  }

  useEffect(() => {
    const isRunning = timeEntries.some((e) => e.endTime === null);
    if (!isRunning) return;

    const interval = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timeEntries]);

  return (
    <div className="app">
      <h1>Time Tracker</h1>

      <div className="activity-list">
        {activities.map((activity) => {
          const isRunning = runningEntry?.activityId === activity.id;
          return (
            <button
              key={activity.id}
              onClick={() => startActivity(activity.id)}
              style={{ backgroundColor: activity.color }}
              className={isRunning ? "active" : ""}
            >
              {activity.name}
              {isRunning && (
                <span className="timer">
                  {formatDuration(Date.now() - runningEntry.startTime)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {runningEntry && <button onClick={stopCurrent}>Stop</button>}

      <h2>History</h2>
      <ul className="history">
        {timeEntries
          .filter((e) => e.endTime !== null)
          .reverse()
          .map((entry) => {
            const activity = activities.find((a) => a.id === entry.activityId);
            return (
              <li key={entry.id}>
                {activity.name} — {formatDuration(entry.duration)}
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default App;
