import { useState } from "react";
import "./ManageActivitiesPage.css";
function ManageActivitiesPage({ activities, addActivity, updateActivity, deleteActivity }) {
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#4f9cff");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#4f9cff");

  function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    addActivity(newName.trim(), newColor);
    setNewName("");
    setNewColor("#4f9cff");
  }

  function startEditing(activity) {
    setEditingId(activity.id);
    setEditName(activity.name);
    setEditColor(activity.color);
  }

  function saveEdit(id) {
    if (!editName.trim()) return;
    updateActivity(id, { name: editName.trim(), color: editColor });
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
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <p className="section-label">Your activities</p>
      <ul className="manage-list">
        {activities.map((activity) => (
          <li key={activity.id} className="manage-item">
            {editingId === activity.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="color"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                />
                <button onClick={() => saveEdit(activity.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <div className="manage-item-info">
                  <span
                    className="activity-dot"
                    style={{ "--activity-color": activity.color }}
                  />
                  {activity.name}
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