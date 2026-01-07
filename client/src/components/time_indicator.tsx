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

  const separator_rect = document
    .getElementById("timetable-separator")
    ?.getBoundingClientRect();
  if (separator_rect == undefined) return;

  const content_rect = document
    .getElementById("timetable-content")
    ?.getBoundingClientRect();
  if (content_rect == undefined) return;

  const visible = getVisibleTimetableRect();
  if (visible == undefined) return;

  const now = new Date(Date.now());
  const hour = now.getHours();
  const mins = now.getMinutes();

  const time_top = getTimeTopPosition(hour, mins);
  if (time_top == undefined) return;

  time_indicator.style.left =
    visible.left - separator_rect.width - content_rect.left + "px";
  time_indicator.style.top = time_top - content_rect.top + "px";
  time_indicator.style.width = visible.width + separator_rect.width + "px";

  const now_label_rect = now_label.getBoundingClientRect();
  if (now_label_rect == undefined) return;

  const now_label_left =
    visible.left - now_label_rect.width - separator_rect.width;
  const now_label_top = time_top - now_label_rect.height / 2;

  const parent_rect = time_indicator.parentElement?.getBoundingClientRect();
  if (parent_rect == undefined) return;

  now_label.style.left = now_label_left - parent_rect.left + "px";
  now_label.style.top = now_label_top - parent_rect.top + "px";
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
        className="absolute z-[100] h-fit w-fit rounded-full bg-slate-400 p-1 pl-2 pr-2"
      >
        <p className="text-slate-100">Now</p>
      </div>
      <div
        id="time-indicator"
        className="absolute z-[100] min-h-[2px] bg-slate-200 opacity-75"
      ></div>
    </>
  );
}

export default TimeIndicator;
