import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import TrackerPage from "./pages/TrackerPage";
import ManageActivitiesPage from "./pages/ManageActivitiesPage";
import "./App.css";

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
          : entry
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
          : entry
      )
    );
  }

  function deleteEntry(entryId) {
    setTimeEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  }

  function addActivity(name, color) {
    setActivities((prev) => [...prev, { id: Date.now(), name, color }]);
  }

  function updateActivity(id, updates) {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, ...updates } : activity
      )
    );
  }

  function deleteActivity(id) {
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
  }

  const runningEntry = timeEntries.find((e) => e.endTime === null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Time Tracker</h1>
        <span className="tagline">Track where your day goes</span>
      </header>

      <Nav />

      <Routes>
        <Route
          path="/"
          element={
            <TrackerPage
              activities={activities}
              timeEntries={timeEntries}
              runningEntry={runningEntry}
              startActivity={startActivity}
              stopCurrent={stopCurrent}
              deleteEntry={deleteEntry}
            />
          }
        />
        <Route
          path="/manage"
          element={
            <ManageActivitiesPage
              activities={activities}
              addActivity={addActivity}
              updateActivity={updateActivity}
              deleteActivity={deleteActivity}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;