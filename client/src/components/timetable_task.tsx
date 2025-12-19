function getVisibleTimetableRect() {
  const time_header = document.getElementById("Header");
  if (time_header == null) return;
  const time_header_rect = time_header.getBoundingClientRect();

  const timetable_barrier = document.getElementById("timetable-barrier");
  if (timetable_barrier == null) return;
  const timetable_barrier_rect = timetable_barrier.getBoundingClientRect();

  return {
    left: time_header_rect.right,
    right: timetable_barrier_rect.left + timetable_barrier.clientWidth,
    top: time_header_rect.bottom,
    bottom: timetable_barrier_rect.top + timetable_barrier.clientHeight,
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

/*
NOTE: there is a small issue with this code which causes the TimetableTask to
expand to the size of the column + border while the next column is offscreen
before returning to just the size of the column (no border) once the next
column becomes visible.

Pretty sure the issue is because the client rect.right includes the border
which I don't want it to.
*/
export function resizeAndPositionTimetableTask(task: HTMLElement) {
  // Get task
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

  // Calculate dimensions
  let left, top, width, height;

  let left_width_reduction = 0;
  if (col_rect.left > visible.left) {
    left = col_rect.left;
  } else {
    left = visible.left;
    left_width_reduction = visible.left - col_rect.left;
  }

  width =
    col_rect.right < visible.right ? row_rect.width : visible.right - left;
  width -= left_width_reduction;

  const one_hour_height = row_rect.height;
  const duration_height = one_hour_height * duration_hours;
  const offset_top = row_rect.top + one_hour_height * start_offset_hours;

  let top_height_reduction = 0;
  if (offset_top > visible.top) {
    top = offset_top;
  } else {
    top = visible.top;
    top_height_reduction = visible.top - offset_top;
  }

  height =
    top + duration_height < visible.bottom
      ? duration_height
      : visible.bottom - top;
  height -= top_height_reduction;

  // Set dimensions
  task.style.left = left + "px";
  task.style.top = top + "px";
  task.style.width = width + "px";
  task.style.height = height + "px";

  // Hide elements not in the visible area
  const right = left + width;
  const bottom = top + height;
  const is_visible = !(
    right <= visible.left ||
    left >= visible.right ||
    bottom <= visible.top ||
    top >= visible.bottom
  );
  if (is_visible) {
    task.style.visibility = "visible";
  } else {
    task.style.visibility = "hidden";
  }
}

export function resizeAndPositionTimetableTasks() {
  const task_container = document.getElementById("timetable-tasks");
  if (task_container == null) return;

  const tasks = task_container.children;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    resizeAndPositionTimetableTask(task);
  }
}

interface TimetableTaskProps {
  title: string;
  day: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  description?: string;
}

function TimetableTask({
  title,
  day,
  start_time,
  end_time,
  duration_minutes,
  description,
}: TimetableTaskProps) {
  return (
    <div
      id="test"
      className="timetable-task absolute z-[50] overflow-hidden rounded-lg bg-red-500"
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
