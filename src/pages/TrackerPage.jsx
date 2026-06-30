import { formatDuration } from "../utils/formatDuration";

function TrackerPage({ activities, timeEntries, runningEntry, startActivity, stopCurrent, deleteEntry }) {
  return (
    <>
      <div className={`now-tracking ${!runningEntry ? "idle" : ""}`}>
        {runningEntry ? (
          <>
            <div className="now-tracking-info">
              <span className="pulse-dot" />
              <span className="now-tracking-name">
                {activities.find((a) => a.id === runningEntry.activityId)?.name ?? "Deleted activity"}
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
              const activity = activities.find((a) => a.id === entry.activityId);
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