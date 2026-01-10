import { useEffect } from "react";

import TimeIndicator, {
  resizeAndPositionTimeIndicator,
} from "@/components/time_indicator";
import TimetableColumn, {
  TimetableTimeLabelsColumn,
} from "@/components/timetable_column";
import { TimetableHeader } from "@/components/timetable_slot";
import TimetableTask, {
  resizeAndPositionTimetableTasks,
  TimetableTaskProps,
} from "@/components/timetable_task";

/*
Returns a rect {left, right, top, bottom, width, height} of the visible area of
the timetable where timetable tasks are to be rendered.

Visible area is the area: 
- Within timetable-content's bounding client rect
- Right of timetable-separator (right of time labels)
- Below Time-header(s))

Returns nothing if any of the required elements are not found (that is, elements
with id: Time-header, timetable-content, timetable-separator, and 
timetable-content).
*/
export function getVisibleTimetableRect() {
  const time_header = document.getElementById("Time-header");
  if (time_header == null) return;
  const time_header_rect = time_header.getBoundingClientRect();

  const time_labels = document.getElementById("timetable-time-labels");
  if (time_labels == null) return;
  const time_labels_rect = time_labels.getBoundingClientRect();

  const timetable_content = document.getElementById("timetable-content");
  if (timetable_content == null) return;
  const timetable_content_rect = timetable_content.getBoundingClientRect();

  const timetable_separator = document.getElementById("timetable-separator");
  if (timetable_separator == null) return;
  const timetable_separator_rect = timetable_separator.getBoundingClientRect();

  const rect = {
    left: time_labels_rect.right + timetable_separator_rect.width,
    right: timetable_content_rect.left + timetable_content.clientWidth,
    top: time_header_rect.bottom,
    bottom: timetable_content_rect.top + timetable_content.clientHeight,
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
  const hour_id = (hour + ":00:00").padStart(8, "0");
  const hour_label = document.getElementById(hour_id);
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
Sync the timetable-foreground element's position and size with the 
timetable-content element. Ensures foreground elements inhabit the same area
as the background elements.
*/
function resizeAndPositionTimetableForeground() {
  const foreground = document.getElementById("timetable-foreground");
  if (foreground == null) return;

  const content = document.getElementById("timetable-content");
  if (content == null) return;
  const content_rect = content.getBoundingClientRect();

  foreground.style.top = content_rect.top + "px";
  foreground.style.left = content_rect.left + "px";
  foreground.style.width = content.clientWidth + "px";
  foreground.style.height = content.clientHeight + "px";
}

/*
Sync the left position of the TimetableHeaders in the foreground with their
respective columns, set the top position to 0px, ensures Time-header remains
in the top left corner. 

Also resizes the timetable-headers container to the width of timetable-content 
element and height of Time-header to prevent underlying elements from showing
through the gaps between headers.
*/
function resizeAndPositionTimetableHeaders() {
  const timetable_headers = document.getElementById("timetable-headers");
  if (timetable_headers == null) return;
  const headers = timetable_headers.children;

  const time_header = document.getElementById("Time-header");
  if (time_header == null) return;

  const content_rect = document
    .getElementById("timetable-content")
    ?.getBoundingClientRect();
  if (content_rect == undefined) return;

  timetable_headers.style.width = content_rect.width + "px";
  timetable_headers.style.height =
    time_header.getBoundingClientRect().height + "px";

  for (let i = 0; i < headers.length; i++) {
    const header_id = headers[i].id;
    const header = document.getElementById(header_id);
    if (header == null) continue;

    const col_id = header.id.slice(0, -"-Header".length);
    const col = document.getElementById(col_id);
    if (col == null) continue;
    const col_rect = col.getBoundingClientRect();

    const parent_rect = header.parentElement?.getBoundingClientRect();
    if (parent_rect == undefined) continue;

    header.style.top = "0px";
    header.style.left = col_rect.left - parent_rect.left + "px";
    header.style.width = col_rect.width + "px";
  }

  time_header.style.left = "0px";
  time_header.style.top = "0px";
  time_header.style.zIndex = "1000";
}

/*
Sync the TimeLabels column top position with the underlying Time column and set
the left position to 0px.
*/
function resizeAndPositionTimetableTimeLabels() {
  const time_labels = document.getElementById("timetable-time-labels");
  if (time_labels == null) return;

  const time_col = document.getElementById("Time");
  if (time_col == null) return;
  const time_col_rect = time_col.getBoundingClientRect();

  const parent_rect = time_labels.parentElement?.getBoundingClientRect();
  if (parent_rect == undefined) return;

  time_labels.style.top = time_col_rect.top - parent_rect.top + "px";
  time_labels.style.left = "0px";

  time_labels.style.width = time_col_rect.width + "px";
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

  const time_col = document.getElementById("timetable-time-labels");
  if (time_col == null) return;
  const col_rect = time_col.getBoundingClientRect();

  const time_header = document.getElementById("Time-header");
  if (time_header == null) return;
  const header_rect = time_header.getBoundingClientRect();

  const parent_rect = separator.parentElement?.getBoundingClientRect();
  if (parent_rect == undefined) return;

  separator.style.top = header_rect.top - parent_rect.top + "px";
  separator.style.left = col_rect.right - parent_rect.left + "px";
  separator.style.height = col_rect.height + "px";
}

/*
Sync the timetable-tasks element's size and position with the visible area of
the timetable (area returned by getVisibleTimetableRect() ). Allows overflowing
TimetableTasks to be hidden.
*/
function resizeAndPositionTimetableTaskArea() {
  const task_container = document.getElementById("timetable-tasks");
  if (task_container == null) return;

  const parent_rect = task_container.parentElement?.getBoundingClientRect();
  if (parent_rect == undefined) return;

  const visible = getVisibleTimetableRect();
  if (visible == undefined) return;

  task_container.style.top = visible.top - parent_rect.top + "px";
  task_container.style.left = visible.left - parent_rect.left + "px";
  task_container.style.width = visible.width + "px";
  task_container.style.height = visible.height + "px";
}

/*
Calls all of the resizeAndPosition functions. Syncs the foreground elements of
the timetable with the background elements.
*/
export function resizeAndPositionTimetableElements() {
  resizeAndPositionTimetableForeground();
  resizeAndPositionTimetableHeaders();
  resizeAndPositionTimetableTimeLabels();
  resizeAndPositionTimetableSeparator();
  resizeAndPositionTimetableTaskArea();
  resizeAndPositionTimetableTasks();
  resizeAndPositionTimeIndicator();
}

/*
Sets the vertical scroll of the timetable-content to make the current time
visible.

@param align: An optional string argument indicating where the now position
should be aligned to in the visible area of the timetable. By default,
sets the now position to the center of the visible area, can additionally be 
specified "top" or "bottom".
*/
export function scrollToCurrentTime(align?: string) {
  const timetable_content = document.getElementById("timetable-content");
  if (timetable_content == null) return;
  const content_rect = timetable_content.getBoundingClientRect();

  const visible = getVisibleTimetableRect();
  if (visible == undefined) return;

  const timetable = document.getElementById("timetable-background");
  if (timetable == null) return;

  const now = new Date(Date.now());
  const now_top = getTimeTopPosition(now.getHours(), now.getMinutes());
  if (now_top == undefined) return;

  let target_top;
  if (align === "top") target_top = visible.top;
  else if (align === "bottom") target_top = visible.bottom;
  else target_top = content_rect.top + content_rect.height / 2;

  const scroll_amount = now_top - target_top;
  timetable_content.scrollTop += scroll_amount;
}

/*
Sets the horizontal scroll position of the timetable-content to display the 
column of the current day positioned in the center/left/right specified by
align argument.

@param align: An optional String argument that controls whether the scroll
position should be set to align the current day to the left, right or center
of the visible timetable area. By default center, otherwise can be specified
"left" or "right".
*/
export function scrollToCurrentDay(align?: string) {
  const timetable_content = document.getElementById("timetable-content");
  if (timetable_content == null) return;

  const visible = getVisibleTimetableRect();
  if (visible == undefined) return;

  const timetable = document.getElementById("timetable-background");
  if (timetable == null) return;

  const time_header = document.getElementById("Time-header");
  if (time_header == null) return;
  const time_header_width = time_header.getBoundingClientRect().width;
  const row_width = time_header_width; // easier to read later

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

  const scroll_amount = today_left - target_left;
  timetable_content.scrollLeft += scroll_amount;
}

/*
Scrolls the vertical and horizonal scroll of timetable-content to position
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
    resizeAndPositionTimetableElements();
    scrollToCurrentTimeAndDay();
  });

  return (
    <div
      id="timetable-border"
      className="h-full w-full rounded-lg bg-slate-900 p-3 shadow-xl shadow-black/40"
    >
      <div
        id="timetable-content"
        className="h-full w-full overflow-auto overscroll-none scrollbar"
        onScroll={resizeAndPositionTimetableElements}
      >
        <div
          id="timetable-background"
          className="timetable-background flex h-full w-full flex-row gap-[4px]"
        >
          <TimetableColumn day="Time" />
          <TimetableColumn day="Monday" />
          <TimetableColumn day="Tuesday" />
          <TimetableColumn day="Wednesday" />
          <TimetableColumn day="Thursday" />
          <TimetableColumn day="Friday" />
          <TimetableColumn day="Saturday" />
          <TimetableColumn day="Sunday" />
        </div>
        <div
          id="timetable-foreground"
          className="pointer-events-none absolute overflow-hidden"
        >
          <div
            id="timetable-headers"
            className="absolute left-0 top-0 z-[200] bg-slate-900"
          >
            {[
              "Time",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((header) => (
              <TimetableHeader key={header} time="header" label={header} />
            ))}
          </div>
          <TimetableTimeLabelsColumn />
          <div
            id="timetable-separator"
            className="absolute z-[250] w-[4px] bg-slate-900"
          ></div>
          <div
            id="timetable-tasks"
            className="timetable-tasks absolute overflow-hidden"
          >
            {timetable_tasks_props.map((props) => (
              <TimetableTask key={props.id} {...props} />
            ))}
          </div>
          <TimeIndicator />
        </div>
      </div>
    </div>
  );
}

export default Timetable;
