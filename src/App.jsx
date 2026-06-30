import { useState} from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import TrackerPage from "./pages/TrackerPage";
import ManageActivitiesPage from "./pages/ManageActivitiesPage";
import "./App.css";
import StatsPage  from "./pages/StatsPage";

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
              setTimeEntries={setTimeEntries}
            />
          }
        />
        <Route
          path="/manage"
          element={
            <ManageActivitiesPage
              activities={activities}
              setActivities={setActivities}
            />
          }
        />
        <Route
          path="/stats"
          element={
            <StatsPage activities={activities} timeEntries={timeEntries} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
