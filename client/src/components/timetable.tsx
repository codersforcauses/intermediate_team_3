import { ReactElement, useEffect } from "react";

import TimeIndicator, {
  resizeAndPositionTimeIndicator,
} from "@/components/time_indicator";
import {
  TimetableDayColumn,
  TimetableTimeColumn,
} from "@/components/timetable_column";
import { resizeAndPositionTimetableTasks } from "@/components/timetable_task";

export function getVisibleTimetableRect() {
  const time_header = document.getElementById("time-header");
  if (time_header == null) return;
  const time_header_rect = time_header.getBoundingClientRect();

  const timetable_barrier = document.getElementById("timetable-barrier");
  if (timetable_barrier == null) return;
  const timetable_barrier_rect = timetable_barrier.getBoundingClientRect();

  const rect = {
    left: time_header_rect.right,
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

export function getDurationMinutes(start_time: string, end_time: string) {
  const start_hour: number = +start_time.substring(0, 2);
  const start_minute: number = +start_time.substring(3, 5);
  const end_hour: number = +end_time.substring(0, 2);
  const end_minute: number = +end_time.substring(3, 5);
  return 60 * (end_hour - start_hour) + (end_minute - start_minute);
}

export function getTimeTopPosition(hour: number, mins: number) {
  const hour_label = document.getElementById(hour + ":00:00");
  if (hour_label == null) return;

  const hour_rect = hour_label.getBoundingClientRect();
  if (hour_rect == undefined) return;

  const offset = (mins / 60) * hour_rect.height;
  const top = hour_rect.top + offset;

  return top;
}

export function getDayLeftPosition(day: string) {
  const day_label = document.getElementById(day);
  if (day_label == null) return;
  return day_label.getBoundingClientRect().left;
}

export function resizeTimetableElements() {
  resizeAndPositionTimetableTasks();
  resizeAndPositionTimeIndicator();
}

export function scrollToCurrentTime(align?: string) {
  const timetable_barrier = document.getElementById("timetable-barrier");
  if (timetable_barrier == null) return;

  const visible = getVisibleTimetableRect();
  if (visible == undefined) return;

  const timetable = document.getElementById("timetable");
  if (timetable == null) return;

  const time_header = document.getElementById("time-header");
  if (time_header == undefined) return;
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

export function scrollToCurrentTimeAndDay(
  time_align?: string,
  day_align?: string,
) {
  scrollToCurrentTime(time_align);
  scrollToCurrentDay(day_align);
}

interface TimetableProps {
  children: ReactElement[];
}

function Timetable({ children }: TimetableProps) {
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
          className="timetable flex h-full w-full flex-row gap-1"
        >
          <TimetableTimeColumn />
          <TimetableDayColumn day="Monday" label="Monday" />
          <TimetableDayColumn day="Tuesday" label="Tuesday" />
          <TimetableDayColumn day="Wednesday" label="Wednesday" />
          <TimetableDayColumn day="Thursday" label="Thursday" />
          <TimetableDayColumn day="Friday" label="Friday" />
          <TimetableDayColumn day="Saturday" label="Saturday" />
          <TimetableDayColumn day="Sunday" label="Sunday" />
          <TimeIndicator />
          <div
            id="timetable-tasks"
            className="timetable-tasks absolute left-0 top-0"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timetable;
