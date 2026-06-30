import { useState, useEffect } from "react";
import "./App.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

function App() {
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem("activities");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "Coding", color: "#4f9cff" },
          { id: 2, name: "Watching YouTube", color: "#ff4f4f" },
        ];
  });

  const [timeEntries, setTimeEntries] = useState(() => {
    const saved = localStorage.getItem("timeEntries");
    return saved ? JSON.parse(saved) : [];
  });
  const [, forceTick] = useState(0);

  const runningEntry = timeEntries.find((e) => e.endTime === null);
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("timeEntries", JSON.stringify(timeEntries));
  }, [timeEntries]);
  useEffect(() => {
    const isRunning = timeEntries.some((e) => e.endTime === null);
    if (!isRunning) return;

    const interval = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timeEntries]);

  function deleteEntry(entryId) {
    setTimeEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  }
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
      const currentlyRunning = prev.find((entry) => entry.endTime === null);

      // already tracking this exact activity — do nothing
      if (currentlyRunning && currentlyRunning.activityId === activityId) {
        return prev;
      }

      const closed = prev.map((entry) =>
        entry.endTime === null
          ? { ...entry, endTime: now, duration: now - entry.startTime }
          : entry,
      );

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Time Tracker</h1>
        <span className="tagline">Track where your day goes</span>
      </header>

      <div className={`now-tracking ${!runningEntry ? "idle" : ""}`}>
        {runningEntry ? (
          <>
            <div className="now-tracking-info">
              <span className="pulse-dot" />
              <span className="now-tracking-name">
                {activities.find((a) => a.id === runningEntry.activityId)?.name}
              </span>
            </div>
            <span className="now-tracking-time">
              {formatDuration(Date.now() - runningEntry.startTime)}
            </span>
            <button className="stop-button" onClick={stopCurrent}>
              Stop
            </button>
          </>
        ) : (
          "Nothing tracked yet — pick an activity below"
        )}
      </div>

      <p className="section-label">Activities</p>
      <div className="activity-grid">
        {activities.map((activity) => {
          const isRunning = runningEntry?.activityId === activity.id;
          return (
            <button
              key={activity.id}
              className={`activity-card ${isRunning ? "is-active" : ""}`}
              style={{ "--activity-color": activity.color }}
              onClick={() => startActivity(activity.id)}
            >
              <span className="activity-dot" />
              {activity.name}
            </button>
          );
        })}
      </div>

      <p className="section-label">History</p>
      {timeEntries.filter((e) => e.endTime !== null).length === 0 ? (
        <p className="empty-state">No completed sessions yet</p>
      ) : (
        <ul className="history">
          {timeEntries
            .filter((e) => e.endTime !== null)
            .reverse()
            .map((entry) => {
              const activity = activities.find(
                (a) => a.id === entry.activityId,
              );
              return (
                <li key={entry.id} className="history-item">
                  <div className="history-item-info">
                    <span
                      className="activity-dot"
                      style={{ "--activity-color": activity.color }}
                    />
                    {activity.name}
                  </div>
                  <div className="history-item-right">
                    <span className="history-item-duration">
                      {formatDuration(entry.duration)}
                    </span>
                    <button
                      className="delete-button"
                      onClick={() => deleteEntry(entry.id)}
                      aria-label={`Delete ${activity.name} entry`}
                    >
                      ×
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}

export default App;
