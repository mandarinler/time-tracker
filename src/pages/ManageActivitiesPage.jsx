import { useState } from "react";
import "./ManageActivitiesPage.css";
function ManageActivitiesPage({ activities, setActivities }) {
  const [newName, setNewName] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [newColor, setNewColor] = useState("#4f9cff");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#4f9cff");
  const [editGoal, setEditGoal] = useState("");
  function addActivity(name, color, dailyGoalMinutes) {
    setActivities((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        color,
        dailyGoalMinutes: dailyGoalMinutes || null,
      },
    ]);
  }

  function updateActivity(id, updates) {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, ...updates } : activity,
      ),
    );
  }

  function deleteActivity(id) {
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
  }
  function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    addActivity(newName.trim(), newColor, newGoal ? Number(newGoal) : null);
    setNewName("");
    setNewColor("#4f9cff");
    setNewGoal("");
  }

  function startEditing(activity) {
    setEditingId(activity.id);
    setEditName(activity.name);
    setEditColor(activity.color);
    setEditGoal(activity.dailyGoalMinutes ?? "");
  }

  function saveEdit(id) {
    if (!editName.trim()) return;
    updateActivity(id, {
      name: editName.trim(),
      color: editColor,
      dailyGoalMinutes: editGoal ? Number(editGoal) : null,
    });
    setEditingId(null);
  }

  return (
    <>
      <p className="section-label">Add an activity</p>
      <form className="activity-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Activity name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
        <input
          type="number"
          placeholder="Daily goal (min)"
          className="goal-input"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <p className="section-label">Your activities</p>
      <ul className="manage-list">
        {activities.map((activity) => (
          <li key={activity.id} className={editingId === activity.id ? "manage-item-editing" : "manage-item"}>
            {editingId === activity.id ? (
              <>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                <input type="color" value={editColor} onChange={(e) => setEditColor(e.target.value)} />
                <input
                  type="number"
                  placeholder="Goal (min)"
                  className="goal-input"
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                />
                <button onClick={() => saveEdit(activity.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <div className="manage-item-info">
                  <span className="activity-dot" style={{ "--activity-color": activity.color }} />
                  {activity.name}
                  {activity.dailyGoalMinutes && (
                    <span className="goal-tag">{activity.dailyGoalMinutes}m/day</span>
                  )}
                </div>
                <div className="manage-item-actions">
                  <button onClick={() => startEditing(activity)}>Edit</button>
                  <button
                    className="delete-button"
                    onClick={() => deleteActivity(activity.id)}
                    aria-label={`Delete ${activity.name}`}
                  >
                    ×
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ManageActivitiesPage;
