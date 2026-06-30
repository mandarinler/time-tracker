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

    const start = dayjs(`${date}T${startTime}`);
    let end = dayjs(`${date}T${endTime}`);

    // if end is at or before start, assume it rolled into the next day
    if (end.isSame(start) || end.isBefore(start)) {
      end = end.add(1, "day");
    }

    onAdd(Number(activityId), start.valueOf(), end.valueOf());
    setStartTime("");
    setEndTime("");
  }

  return (
    <form className="manual-entry-form" onSubmit={handleSubmit}>
      <select
        value={activityId}
        onChange={(e) => setActivityId(e.target.value)}
      >
        {activities.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <button type="submit">Add</button>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export default AddEntryForm;
