import { useState } from "react";
import dayjs from "dayjs";

function AddEntryForm({ activities, onAdd }) {
  const [activityId, setActivityId] = useState(activities[0]?.id ?? "");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!activityId || !date || !startTime || !endTime) {
      setError("Fill in all fields");
      return;
    }

    const start = dayjs(`${date}T${startTime}`).valueOf();
    const end = dayjs(`${date}T${endTime}`).valueOf();

    if (end <= start) {
      setError("End time must be after start time");
      return;
    }

    onAdd(Number(activityId), start, end);
    setStartTime("");
    setEndTime("");
  }

  return (
    <form className="manual-entry-form" onSubmit={handleSubmit}>
      <select value={activityId} onChange={(e) => setActivityId(e.target.value)}>
        {activities.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      <button type="submit">Add</button>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export default AddEntryForm;