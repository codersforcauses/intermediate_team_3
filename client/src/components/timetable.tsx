import { useEffect } from "react";

import TimeIndicator, {
  resizeAndPositionTimeIndicator,
} from "@/components/time_indicator";
import {
  TimetableDayColumn,
  TimetableTimeColumn,
} from "@/components/timetable_column";
import TimetableTask, {
  resizeAndPositionTimetableTasks,
  TimetableTaskProps,
} from "@/components/timetable_task";

/*
KNOWN BUGS:
1. Sticky positioning does not work at certain zooms/screen sizes towards the end
of scroll.
2. Using padding on the TimetableTask containers looks the nicest but causes
the resizing width to reach a minimum before disappearing rather than smoothly
resizing until 0. Using margin on the content looks worse but does not have this 
issue.
*/

/*
Returns a rect {left, right, top, bottom, width, height} of the visible area of
the timetable where timetable tasks are to be rendered.

Visible area is the area: 
- Within timetable-barrier's bounding client rect
- Right of timetable-separator (right of time labels)
- Below time-header(s))

Returns nothing if any of the required elements are not found (that is, elements
with id: time-header, timetable-barrier, timetable-separator, and 
timetable-barrier).
*/
export function getVisibleTimetableRect() {
  const time_header = document.getElementById("time-header");
  if (time_header == null) return;
  const time_header_rect = time_header.getBoundingClientRect();

  const timetable_barrier = document.getElementById("timetable-barrier");
  if (timetable_barrier == null) return;
  const timetable_barrier_rect = timetable_barrier.getBoundingClientRect();

  const timetable_separator = document.getElementById("timetable-separator");
  if (timetable_separator == null) return;
  const timetable_separator_rect = timetable_separator.getBoundingClientRect();

  const rect = {
    left: time_header_rect.right + timetable_separator_rect.width,
    right: timetable_barrier_rect.left + timetable_barrier.clientWidth,
    top: time_header_rect.bottom,
    bottom: timetable_barrier_rect.top + timetable_barrier.clientHeight,
    width: 0,
    height: 0,
  };
  rect.width = rect.right - rect.left;
  rect.height = rect.bottom - rect.top;

  return rect;
}

/*
Returns the number of minutes between two strings of format "HH:MM:SS".
*/
export function getDurationMinutes(start_time: string, end_time: string) {
  const start_hour: number = +start_time.substring(0, 2);
  const start_minute: number = +start_time.substring(3, 5);
  const end_hour: number = +end_time.substring(0, 2);
  const end_minute: number = +end_time.substring(3, 5);
  return 60 * (end_hour - start_hour) + (end_minute - start_minute);
}

/*
Returns the y-position (top) of any time on the timetable.

Returns nothing if the hour is not in range [0-23] as time-label with matching
id will not exist.
*/
export function getTimeTopPosition(hour: number, mins: number) {
  const hour_label = document.getElementById(hour + ":00:00");
  if (hour_label == null) return;

  const hour_rect = hour_label.getBoundingClientRect();

  const offset = (mins / 60) * hour_rect.height;
  const top = hour_rect.top + offset;

  return top;
}

/*
Returns the x-position (left) of any day (string) on the timetable.

Returns early if an element with the id corresponding to the day is not found.
*/
export function getDayLeftPosition(day: string) {
  const day_label = document.getElementById(day);
  if (day_label == null) return;
  return day_label.getBoundingClientRect().left;
}

/*
Sets the size and position of the Timetable Separator to directly right of the
time label column and taking up the entire visible vertical space of the 
timetable.

Returns nothing if elements with id: timetable-separator, Time do not exist.
*/
function resizeAndPositionTimetableSeparator() {
  const separator = document.getElementById("timetable-separator");
  if (separator == null) return;

  const time_col = document.getElementById("Time");
  if (time_col == null) return;
  const col_rect = time_col.getBoundingClientRect();

  const corner_cell = document.getElementById("time-header");
  if (corner_cell == null) return;
  const corner_rect = corner_cell.getBoundingClientRect();

  separator.style.left = col_rect.right + "px";
  separator.style.height = col_rect.height + "px";
  separator.style.top = corner_rect.top + "px";
}

/*
Calls all of the resizeAndPosition functions.
*/
export function resizeTimetableElements() {
  resizeAndPositionTimetableSeparator();
  resizeAndPositionTimetableTasks();
  resizeAndPositionTimeIndicator();
}

/*
Sets the vertical scroll of the timetable-barrier to make the current time
visible.

@param align: An optional string argument indicating where the now position
should be aligned to in the visible area of the timetable. By default,
sets the now position to the center of the visible area, can additionally be 
specified "top" or "bottom".
*/
export function scrollToCurrentTime(align?: string) {
  const timetable_barrier = document.getElementById("timetable-barrier");
  if (timetable_barrier == null) return;

  const visible = getVisibleTimetableRect();
  if (visible == undefined) return;

  const timetable = document.getElementById("timetable");
  if (timetable == null) return;

  const time_header = document.getElementById("time-header");
  if (time_header == null) return;
  const time_header_height = time_header.getBoundingClientRect().height;
  if (time_header_height == undefined) return;

  const scroll_height = timetable.scrollHeight - time_header_height;
  const scroll_max = scroll_height - visible.height; // Top row is sticky

  timetable_barrier.scrollTop = 0; // Ensures consistent position

  const now = new Date(Date.now());
  const now_top = getTimeTopPosition(now.getHours(), now.getMinutes());
  if (now_top == undefined) return;

  let target_top;
  if (align === "top") target_top = visible.top;
  else if (align === "bottom") target_top = visible.bottom;
  else target_top = visible.top + visible.height / 2;

  let scroll_amount = now_top - target_top;
  if (scroll_amount < 0) scroll_amount = 0;
  if (scroll_amount > scroll_max) scroll_amount = scroll_max;

  timetable_barrier.scrollTop = scroll_amount;
}

/*
Sets the horizontal scroll position of the timetable-barrier to display the 
column of the current day positioned in the center/left/right specified by
align argument.

@param align: An optional String argument that controls whether the scroll
position should be set to align the current day to the left, right or center
of the visible timetable area. By default center, otherwise can be specified
"left" or "right".
*/
export function scrollToCurrentDay(align?: string) {
  const timetable_barrier = document.getElementById("timetable-barrier");
  if (timetable_barrier == null) return;

  const visible = getVisibleTimetableRect();
  if (visible == undefined) return;

  const timetable = document.getElementById("timetable");
  if (timetable == null) return;

  const time_header = document.getElementById("time-header");
  if (time_header == undefined) return;
  const time_header_width = time_header.getBoundingClientRect().width;
  if (time_header_width == undefined) return;
  const row_width = time_header_width; // easier to read later

  const scroll_width = timetable.scrollWidth - time_header_width; // sticky
  const scroll_max = scroll_width - visible.width;

  timetable_barrier.scrollLeft = 0;

  enum DateDay {
    Monday = 1,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
  }

  const now = new Date(Date.now());
  const today = DateDay[now.getDay()];
  const today_left = getDayLeftPosition(today);
  if (today_left == undefined) return;

  let target_left;
  if (align == "left") target_left = visible.left;
  else if (align == "right") target_left = visible.right - row_width;
  else target_left = visible.left + visible.width / 2 - row_width / 2;

  let scroll_amount = today_left - target_left;
  if (scroll_amount < 0) scroll_amount = 0;
  if (scroll_amount > scroll_max) scroll_amount = scroll_max;

  timetable_barrier.scrollLeft = scroll_amount;
}

/*
Scrolls the vertical and horizonal scroll of timetable-barrier to position
the current time and current day within the visible area of the timetable.

Calls scrollToCurrentTime and scrollToCurrentDay.
*/
export function scrollToCurrentTimeAndDay(
  time_align?: string,
  day_align?: string,
) {
  scrollToCurrentTime(time_align);
  scrollToCurrentDay(day_align);
}

/*
@prop timetable_tasks_props: TimetableTaskProps to be rendered as TimetableTasks
within the timetable.
*/
interface TimetableProps {
  timetable_tasks_props: TimetableTaskProps[];
}

/*
A Timetable composed of 8 columns (header + each day) and 25 rows 
(header + each hour). The header row and leftmost column are sticky to allow
user to scroll without positional information (day and time) disappearing.

Takes 1 prop containing the props for TimetableTasks to be rendered within the
timetable.

There can only be one timetable per page as the logic uses ids.
*/
function Timetable({ timetable_tasks_props }: TimetableProps) {
  useEffect(() => {
    resizeTimetableElements();
    scrollToCurrentTimeAndDay();
  });

  return (
    <div
      id="timetable-border"
      className="h-full w-full rounded-lg bg-slate-900 p-3"
    >
      <div
        id="timetable-barrier"
        className="h-full w-full overflow-auto"
        onScroll={resizeTimetableElements}
      >
        <div
          id="timetable"
          className="timetable flex h-full w-full flex-row gap-[4px]"
        >
          <TimetableTimeColumn />
          <TimetableDayColumn day="Monday" />
          <TimetableDayColumn day="Tuesday" />
          <TimetableDayColumn day="Wednesday" />
          <TimetableDayColumn day="Thursday" />
          <TimetableDayColumn day="Friday" />
          <TimetableDayColumn day="Saturday" />
          <TimetableDayColumn day="Sunday" />
          <div id="timetable-foreground" className="absolute left-0 top-0">
            <TimeIndicator />
            <div
              id="timetable-tasks"
              className="timetable-tasks absolute left-0 top-0"
            >
              {timetable_tasks_props.map((props) => (
                <TimetableTask key={props.id} {...props} />
              ))}
            </div>
            <div
              id="timetable-separator"
              className="absolute z-[10] w-[4px] bg-slate-900"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timetable;
