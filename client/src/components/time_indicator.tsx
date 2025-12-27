import { getVisibleTimetableRect } from "@/components/timetable";

export function resizeAndPositionTimeIndicator() {
  const time_indicator = document.getElementById("time-indicator");
  if (time_indicator == null) return;

  const now_label = document.getElementById("time-indicator-label");
  if (now_label == null) return;

  const visible = getVisibleTimetableRect();
  if (visible == undefined) return;

  time_indicator.style.width = visible.width + "px";
  time_indicator.style.left = visible.left + "px";

  const now = new Date(Date.now());
  const hour = now.getHours();
  const min = now.getMinutes();

  const hour_label = document.getElementById(hour + ":00:00");
  if (hour_label == null) return;
  const hour_rect = hour_label.getBoundingClientRect();
  if (hour_rect == undefined) return;

  const offset = (min / 60) * hour_rect.height;
  const top = hour_rect.top + offset;
  time_indicator.style.top = top + "px";

  const now_label_rect = now_label.getBoundingClientRect();
  if (now_label_rect == undefined) return;

  const now_label_left = visible.left - now_label_rect.width;
  const now_label_top = top - now_label_rect.height / 2;
  now_label.style.left = now_label_left + "px";
  now_label.style.top = now_label_top + "px";

  if (top < visible.top || top > visible.bottom) {
    time_indicator.style.display = "none";
    now_label.style.display = "none";
  } else {
    time_indicator.style.display = "inline";
    now_label.style.display = "inline";
  }
}

function TimeIndicator() {
  return (
    <>
      <div
        id="time-indicator-label"
        className="absolute z-[1000] h-fit w-fit rounded bg-slate-400 p-1"
      >
        <p className="text-slate-100">Now</p>
      </div>
      <div
        id="time-indicator"
        className="absolute z-[100] min-h-[2px] bg-slate-300"
      ></div>
    </>
  );
}

export default TimeIndicator;
