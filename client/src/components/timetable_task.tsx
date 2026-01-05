import TimeTag from "@/components/time_tag";
import { getVisibleTimetableRect } from "@/components/timetable";
import TopicTag from "@/components/topic_tag";

/*
An interface for the data properties of a TimetableTask with numerical times
in hours (rather than minutes as they are stored).
*/
interface timetableTaskDataProperties {
  day: string;
  hour: string;
  duration_hours: number;
  start_offset_hours: number;
}

/*
Returns the data properties of a timetable task element in an object format
with minute data converted to hours.
*/
function getTimetableTaskDataProperties(
  task: HTMLElement,
): undefined | timetableTaskDataProperties {
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
Sets the size and position of the timetable task provided in the task parameter.
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

/*
Sets the size and position of the timetable task tooltip provided in the 
parameter. Will position the tooltip to the side (left/right) with the most
space in the visible timetable area.
*/
function resizeAndPositionTimetableTaskTooltip(tooltip: HTMLElement) {
  const task_id = tooltip.id.slice(0, -"-tooltip".length);
  const task = document.getElementById(task_id);
  if (task == null) return;

  const task_rect = task.getBoundingClientRect();

  tooltip.style.display = "flex";
  const tooltip_rect = tooltip.getBoundingClientRect();

  const visible = getVisibleTimetableRect();
  if (visible == undefined) return;

  const left_space = task_rect.left - visible.left;
  const right_space = visible.right - task_rect.right;

  if (left_space > right_space) {
    tooltip.style.left = task_rect.left - tooltip_rect.width + "px";
    // Tooltip has a max width so won't get too big
    tooltip.style.width = left_space + "px";
  } else {
    tooltip.style.left = task_rect.right + "px";
    // Tooltip has a max width so won't get too big
    tooltip.style.width = right_space + "px";
  }

  if (tooltip_rect.height > visible.height) {
    tooltip.style.height = visible.height + "px";
  }

  const target_pos =
    task_rect.top + task_rect.height / 2 - tooltip_rect.height / 2;

  let tooltip_top = target_pos;

  if (target_pos < visible.top) {
    tooltip_top = visible.top;
  } else if (target_pos > visible.bottom - tooltip_rect.height) {
    tooltip_top = visible.bottom - tooltip_rect.height;
  }

  tooltip.style.top = tooltip_top + "px";
}

/*
Calls resizeAndPositionTimetableTask on each TimetableTask Element.
*/
export function resizeAndPositionTimetableTasks() {
  const tasks = document.getElementsByClassName("timetable-task");
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    resizeAndPositionTimetableTask(task);
  }
}

/*
Database representation of Topic.
*/
export interface Topic {
  id: number;
  name: string;
  color_hex: number;
  user: number;
}

/*
Props for a TimetableTaskContent element.

@prop name: The string to display as the title.
@prop start_time: The string containing the starting time in HH:MM:DD format.
@prop end_time: The string containing the ending time in HH:MM:DD format.
@prop topics: Topic data to display as TopicTags.
@prop description: String containing the description of the task.
@prop time_display: Optional string, controls display mode of the TimeTag, see
TimeTag for more information.
*/
export interface TimetableTaskContentProps {
  name: string;
  start_time: string;
  end_time: string;
  topics?: Topic[];
  description?: string;
  time_display?: string;
}

/*
The contents of a Timetable Task inlcuding title, time tag, topic tags, and
description. Separated into its own component to be reusable for tooltips.
*/
function TimetableTaskContent({
  name,
  start_time,
  end_time,
  topics,
  description,
  time_display,
}: TimetableTaskContentProps) {
  return (
    <div className="timetable-task-content h-full overflow-hidden">
      <h1 className="mb-1 text-2xl font-bold">{name}</h1>
      <TimeTag
        start_time={start_time}
        end_time={end_time}
        display={time_display}
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

/*
The props for a TimetableTask.

@prop id: The id to give the TimetableTask, typically task_id:time_id.
@prop name: The title of the Task.
@topics: The topics assigned to the Task.
@description: The description of the Task.
@completed: The completion status of the Task.
@day: The day (string) the time is on.
@start_time: A string representing the start time in HH:MM:SS format, (used
to calculate position).
@end_time: A string representing the end time in HH:MM:SS format.
@duration_minutes: The duration of the time assigned to the task in minutes
(used to calculate display height).
@clash: A boolean indicating whether the timetable task represents a clash
(time with two overlapping tasks).
@tooltip_props: The props of the TimetableTaskContents to display in the tooltip.

*/
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

/*
A rounded rectangle representing a Time on the timetable which has been assigned
to a Task on a specific day. 

Contains the information of the task as well as a tooltip that displays while 
mouse is over the TimetableTask or tooltip that also displays the task 
information (allows user to view full content of tasks if task does not have
enough space, as well as times that have multiple tasks assigned to them).
*/
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
          time_display={"duration"}
        />
      </div>
      <div
        id={id + "-tooltip"}
        className="timetable-task-tooltip absolute z-[75] max-w-64 rounded-lg bg-slate-800 p-3"
        style={{ display: "none" }}
        onMouseOver={mouseOverHandler}
        onMouseOut={mouseOutHandler}
      >
        <div className="tooltip-content-container flex h-full w-full flex-col gap-3 overflow-auto">
          {tooltip_props.map((props) => (
            <div
              key={id + "-tooltip-" + props.name}
              className="z-[75] h-fit w-full rounded-lg bg-slate-400 p-3 text-slate-100"
            >
              <TimetableTaskContent {...props} time_display="both" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TimetableTask;
