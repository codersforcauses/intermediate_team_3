import { useEffect } from "react";

interface TimetableTaskProps {
  title: string;
  day: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  description?: string;
}

function getVisibleTimetableRect() {
  const time_header = document.getElementById("Header");
  if (time_header == null) return;
  const time_header_rect = time_header.getBoundingClientRect();

  const timetable_barrier = document.getElementById("timetable-barrier");
  if (timetable_barrier == null) return;
  const timetable_barrier_rect = timetable_barrier.getBoundingClientRect();

  return {
    top: time_header_rect.bottom,
    bottom: timetable_barrier_rect.bottom,
    left: time_header_rect.right,
    right: timetable_barrier_rect.right,
  };
}

function getTimetableTaskDataProperties(task: HTMLElement) {
  const day = task.dataset.day;
  if (day == undefined) return;

  const hour = task.dataset.start_hour;
  if (hour == undefined) return;

  const duration_minutes_data = task.dataset.duration_minutes;
  if (duration_minutes_data == undefined) return;
  const duration_hours = Number(duration_minutes_data) / 60;

  const start_offset_data = task.dataset.start_offset;
  if (start_offset_data == undefined) return;
  const start_offset_hours = Number(start_offset_data) / 60;

  return {
    day: day,
    hour: hour,
    duration_hours: duration_hours,
    start_offset_hours: start_offset_hours,
  };
}

export function resizeAndPositionTimetableTask() {
  // Get task
  const task = document.getElementById("test");
  if (task == null) return;
  // Get task data
  const task_data = getTimetableTaskDataProperties(task);
  if (task_data == null) return;
  const { day, hour, duration_hours, start_offset_hours } = task_data;
  // Get visible area
  const visible = getVisibleTimetableRect();
  if (visible == null) return;
  // Get column
  const col = document.getElementById(day);
  if (col == null) return;
  // Get row
  const row = document.getElementById(hour);
  if (row == null) return;
  // Get dimensions of column and row
  const col_rect = col.getBoundingClientRect();
  const row_rect = row.getBoundingClientRect();
  // Check if cell is visible
  const is_visible = !(
    col_rect.right <= visible.left ||
    col_rect.left >= visible.right ||
    row_rect.bottom <= visible.top ||
    row_rect.top >= visible.bottom
  );
  if (is_visible) {
    task.style.display = "inline";
  } else {
    task.style.display = "none";
    return;
  }
  // Calculate dimensions
  const left = col_rect.left > visible.left ? col_rect.left : visible.left;
  const width =
    col_rect.right < visible.right ? row_rect.width : visible.right - left;
  const one_hour_height = row_rect.height;
  const offset_top = row_rect.top + one_hour_height * start_offset_hours;
  const top = offset_top > visible.top ? offset_top : visible.top;
  const duration_height = one_hour_height * duration_hours;
  const height =
    top + duration_height < visible.bottom
      ? duration_height
      : visible.bottom - top;
  // Set dimensions
  task.style.left = left + "px";
  task.style.top = top + "px";
  task.style.width = width + "px";
  task.style.height = height + "px";
}

function TimetableTask({
  title,
  day,
  start_time,
  end_time,
  duration_minutes,
  description,
}: TimetableTaskProps) {
  // remove this useEffect
  useEffect(() => {
    window.addEventListener("resize", resizeAndPositionTimetableTask);

    return () => {
      window.removeEventListener("resize", resizeAndPositionTimetableTask);
    };
  });

  return (
    <div
      id="test"
      className="timetable-task absolute z-[50] min-h-16 w-32 overflow-hidden rounded-lg bg-red-500"
      onClick={resizeAndPositionTimetableTask}
      data-day={day}
      data-start_time={start_time}
      data-start_hour={start_time.substring(0, 2) + ":00:00"}
      data-start_offset={start_time.substring(3, 5)}
      data-end_time={end_time}
      data-duration_minutes={duration_minutes}
    >
      <h1>{title}</h1>
      <p>{start_time.substring(0, 5) + "-" + end_time.substring(0, 5)}</p>
      <p>{description}</p>
    </div>
  );
}

export default TimetableTask;
