import {
  getTimeTopPosition,
  getVisibleTimetableRect,
} from "@/components/timetable";

/*
Resizes the time indicator to the correct width and positions it at the 
y-position corresponding to the current time.
*/
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
  const mins = now.getMinutes();

  const top = getTimeTopPosition(hour, mins);
  if (top == undefined) return;
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

/*
Component consisting of a rounded label containing the text "Now" and a 2px
thick line stretching across the visible area of the timetable.

There should only be one TimeIndicator per page.
*/
function TimeIndicator() {
  return (
    <>
      <div
        id="time-indicator-label"
        className="absolute z-[75] h-fit w-fit rounded-full bg-slate-400 p-1 pl-2 pr-2"
      >
        <p className="text-slate-100">Now</p>
      </div>
      <div
        id="time-indicator"
        className="absolute z-[75] min-h-[2px] bg-slate-200 opacity-75"
      ></div>
    </>
  );
}

export default TimeIndicator;
