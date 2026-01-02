import TimeTag from "@/components/time_tag";
import { getVisibleTimetableRect } from "@/components/timetable";
import TopicTag from "@/components/topic_tag";

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
    task.style.display = "inline";
  } else {
    task.style.display = "none";
  }
}

function resizeAndPositionTimetableTaskTooltip(tooltip: HTMLElement) {
  const task_id = tooltip.id.slice(0, -"-tooltip".length);
  const task = document.getElementById(task_id);
  if (task == null) return;

  const task_rect = task.getBoundingClientRect();
  if (task_rect == undefined) return;

  tooltip.style.display = "flex";
  const tooltip_rect = tooltip.getBoundingClientRect();
  if (tooltip_rect == undefined) return;

  const visible = getVisibleTimetableRect();
  if (visible == undefined) return;

  if (task_rect.left - visible.left > visible.right - task_rect.right) {
    tooltip.style.right = task_rect.left + "px";
  } else {
    tooltip.style.left = task_rect.right + "px";
  }

  const target_pos =
    task_rect.top + task_rect.height / 2 - tooltip_rect.height / 2;

  let tooltip_top = target_pos;
  if (target_pos < visible.top) {
    tooltip_top = visible.top;
  } else if (target_pos > visible.bottom) {
    tooltip_top = visible.bottom - tooltip_rect.height;
  }

  tooltip.style.top = tooltip_top + "px";
}

export function resizeAndPositionTimetableTasks() {
  const tasks = document.getElementsByClassName("timetable-task");
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    resizeAndPositionTimetableTask(task);
  }
}

export interface Topic {
  id: number;
  name: string;
  color_hex: number;
  user: number;
}

export interface TimetableTaskContentProps {
  name: string;
  start_time: string;
  end_time: string;
  topics?: Topic[];
  description?: string;
}

function TimetableTaskContent({
  name,
  start_time,
  end_time,
  topics,
  description,
}: TimetableTaskContentProps) {
  return (
    <div className="timetable-task-content h-full overflow-hidden">
      <h1 className="mb-1 text-2xl font-bold">{name}</h1>
      <TimeTag
        start_time={start_time}
        end_time={end_time}
        display={"duration"}
      />
      <div className="topic-tags mt-2 flex flex-row flex-wrap justify-between text-slate-200">
        {topics?.map((topic) => (
          <TopicTag
            key={topic.name}
            name={topic.name}
            color_hex={topic.color_hex}
          />
        ))}
      </div>
      <div className="description mt-1 flex flex-col text-slate-200">
        <p className="">{description}</p>
      </div>
    </div>
  );
}

export interface TimetableTaskProps {
  id: string;
  name: string;
  topics?: Topic[];
  description?: string;
  completed: boolean;
  day: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  clash?: boolean;
  tooltip_props: TimetableTaskContentProps[];
}

function TimetableTask({
  id,
  name,
  topics,
  description,
  completed,
  day,
  start_time,
  end_time,
  duration_minutes,
  clash,
  tooltip_props,
}: TimetableTaskProps) {
  let additional_style = " ";

  if (completed === true) {
    additional_style += "opacity-75 ";
  }

  if (clash === true) {
    additional_style += "bg-slate-700 hover:bg-slate-500 ";
  } else {
    additional_style += "bg-slate-400 hover:bg-slate-300 ";
  }

  const mouseOverHandler = () => {
    const tooltip = document.getElementById(id + "-tooltip");
    if (tooltip == null) return;
    resizeAndPositionTimetableTaskTooltip(tooltip); // Also sets display
  };

  const mouseOutHandler = () => {
    const tooltip = document.getElementById(id + "-tooltip");
    if (tooltip == null) return;
    tooltip.style.display = "none";
  };

  return (
    <>
      <div
        id={id}
        className={
          "timetable-task absolute z-[50] overflow-hidden rounded-lg p-3 text-slate-100" +
          additional_style
        }
        data-completed={completed}
        data-day={day}
        data-start_time={start_time}
        data-start_hour={start_time.substring(0, 2) + ":00:00"}
        data-start_offset={start_time.substring(3, 5)}
        data-end_time={end_time}
        data-duration_minutes={duration_minutes}
        onMouseOver={mouseOverHandler}
        onMouseOut={mouseOutHandler}
      >
        <TimetableTaskContent
          name={name}
          start_time={start_time}
          end_time={end_time}
          topics={topics}
          description={description}
        />
      </div>
      <div
        id={id + "-tooltip"}
        className="timetable-task-tooltip absolute z-[75] flex w-64 flex-col items-center justify-center gap-3 overflow-auto rounded-lg bg-slate-800 p-3"
        style={{ display: "none" }}
        onMouseOver={mouseOverHandler}
        onMouseOut={mouseOutHandler}
      >
        {tooltip_props.map((props) => (
          <div
            key={id + "-tooltip-" + props.name}
            className="z-[75] h-fit w-full rounded-lg bg-slate-400 p-3 text-slate-100"
          >
            <TimetableTaskContent {...props} />
          </div>
        ))}
      </div>
    </>
  );
}

export default TimetableTask;
