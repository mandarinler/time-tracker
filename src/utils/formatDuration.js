import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export function formatDuration(ms) {
  const d = dayjs.duration(ms);
  const hours = Math.floor(d.asHours());
  const minutes = d.minutes();
  const seconds = d.seconds();
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}