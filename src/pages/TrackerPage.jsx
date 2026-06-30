import { formatDuration } from "../utils/formatDuration";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "./TrackerPage.css";
import AddEntryForm from "../components/AddEntryForm";

function TrackerPage({ activities, timeEntries, setTimeEntries }) {
  const [, forceTick] = useState(0);
  const runningEntry = timeEntries.find((e) => e.endTime === null);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editError, setEditError] = useState("");
  const startOfDay = dayjs().startOf("day");
  const todayTotals = {};

  timeEntries.forEach((entry) => {
    if (dayjs(entry.startTime).isBefore(startOfDay)) return;
    const duration = entry.endTime
      ? entry.duration
      : Date.now() - entry.startTime;
    todayTotals[entry.activityId] =
      (todayTotals[entry.activityId] || 0) + duration;
  });

  useEffect(() => {
    const isRunning = timeEntries.some((e) => e.endTime === null);
    if (!isRunning) return;
    const interval = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timeEntries]);

  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("timeEntries", JSON.stringify(timeEntries));
  }, [timeEntries]);

  function startEditingEntry(entry) {
    setEditingEntryId(entry.id);
    setEditDate(dayjs(entry.startTime).format("YYYY-MM-DD"));
    setEditStart(dayjs(entry.startTime).format("HH:mm"));
    setEditEnd(dayjs(entry.endTime).format("HH:mm"));
    setEditError("");
  }

  function saveEntryEdit(entryId) {
    const start = dayjs(`${editDate}T${editStart}`);
    let end = dayjs(`${editDate}T${editEnd}`);

    if (end.isSame(start) || end.isBefore(start)) {
      end = end.add(1, "day");
    }

    editEntry(entryId, { startTime: start.valueOf(), endTime: end.valueOf() });
    setEditingEntryId(null);
  }

  function addManualEntry(activityId, startTime, endTime) {
    setTimeEntries((prev) => [
      ...prev,
      {
        id: Date.now(),
        activityId,
        startTime,
        endTime,
        duration: endTime - startTime,
        note: null,
      },
    ]);
  }

  function editEntry(entryId, { startTime, endTime }) {
    setTimeEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? { ...entry, startTime, endTime, duration: endTime - startTime }
          : entry,
      ),
    );
  }

  function startActivity(activityId) {
    const now = Date.now();
    setTimeEntries((prev) => {
      const currentlyRunning = prev.find((entry) => entry.endTime === null);
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

  function deleteEntry(entryId) {
    setTimeEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  }

  return (
    <>
      <div className={`now-tracking ${!runningEntry ? "idle" : ""}`}>
        {runningEntry ? (
          <>
            <div className="now-tracking-info">
              <span className="pulse-dot" />
              <span className="now-tracking-name">
                {activities.find((a) => a.id === runningEntry.activityId)
                  ?.name ?? "Deleted activity"}
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
          const todayMs = todayTotals[activity.id] || 0;
          const goalMs = activity.dailyGoalMinutes
            ? activity.dailyGoalMinutes * 60000
            : null;
          const progressPct = goalMs
            ? Math.min((todayMs / goalMs) * 100, 100)
            : null;
          const overGoal = goalMs && todayMs > goalMs;

          return (
            <button
              key={activity.id}
              className={`activity-card ${isRunning ? "is-active" : ""}`}
              style={{ "--activity-color": activity.color }}
              onClick={() => startActivity(activity.id)}
            >
              <div className="activity-card-top">
                <span className="activity-dot" />
                {activity.name}
              </div>
              {goalMs && (
                <>
                  <div className="goal-bar">
                    <div
                      className="goal-bar-fill"
                      style={{
                        width: `${progressPct}%`,
                        background: overGoal
                          ? "var(--color-danger)"
                          : "var(--activity-color)",
                      }}
                    />
                  </div>
                  <span className="goal-label">
                    {Math.round(todayMs / 60000)}m / {activity.dailyGoalMinutes}
                    m
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <p className="section-label">Add a past entry</p>
      <AddEntryForm activities={activities} onAdd={addManualEntry} />

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

              if (editingEntryId === entry.id) {
                return (
                  <li
                    key={entry.id}
                    className="history-item history-item-editing"
                  >
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                    <input
                      type="time"
                      value={editStart}
                      onChange={(e) => setEditStart(e.target.value)}
                    />
                    <input
                      type="time"
                      value={editEnd}
                      onChange={(e) => setEditEnd(e.target.value)}
                    />
                    <button onClick={() => saveEntryEdit(entry.id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingEntryId(null)}>
                      Cancel
                    </button>
                    {editError && <p className="form-error">{editError}</p>}
                  </li>
                );
              }

              return (
                <li key={entry.id} className="history-item">
                  <div className="history-item-info">
                    <span
                      className="activity-dot"
                      style={{ "--activity-color": activity?.color ?? "#666" }}
                    />
                    {activity?.name ?? "Deleted activity"}
                  </div>
                  <div className="history-item-right">
                    <span className="history-item-duration">
                      {formatDuration(entry.duration)}
                    </span>
                    <button
                      className="edit-button"
                      onClick={() => startEditingEntry(entry)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteEntry(entry.id)}
                      aria-label="Delete entry"
                    >
                      ×
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </>
  );
}

export default TrackerPage;
