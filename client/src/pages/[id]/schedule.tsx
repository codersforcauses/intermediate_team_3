import { useEffect, useState } from "react";

import Timetable, {
  getDurationMinutes,
  resizeTimetableElements,
} from "@/components/timetable";
import TimetableTask, { TimetableTaskProps } from "@/components/timetable_task";

interface Time {
  id: number;
  day: number;
  start_time: string;
  end_time: string;
  repeating: boolean;
  task: number;
}

interface Topic {
  id: number;
  name: string;
  color_hex: number;
  user: number;
}

interface Task {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  user: number;
  topics: Topic[];
  times: Time[];
}

enum Day {
  Monday = 0,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

function Schedule() {
  const [timetableTaskProps, setTimetableTaskProps] = useState<
    TimetableTaskProps[]
  >([]);

  /* This effect runs in an infinte loop if timetableTaskProps is defined as a
  dependency */
  useEffect(() => {
    function addEventListeners() {
      window.addEventListener("resize", resizeTimetableElements);
    }

    function removeEventListeners() {
      window.removeEventListener("resize", resizeTimetableElements);
    }

    async function fetchTasks() {
      const API_URL = "http://localhost:8000/api/planner/task/";
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        let timetable_task_props =
          await formatTaskDataToTimetableTaskProps(data);
        timetable_task_props =
          await formatTimetableClashes(timetable_task_props);
        setTimetableTaskProps(timetable_task_props);
      } catch (error) {
        console.error(error);
      }
    }

    async function formatTaskDataToTimetableTaskProps(data: Task[]) {
      const timetable_task_props: TimetableTaskProps[] = [];
      for (let i = 0; i < data.length; i++) {
        const task = data[i];
        for (let j = 0; j < task.times.length; j++) {
          const time = task.times[j];
          const props = {
            id: task.id + ":" + time.id,
            name: task.name,
            topics: task.topics,
            description: task.description,
            completed: task.completed,
            day: Day[time.day],
            start_time: time.start_time,
            end_time: time.end_time,
            duration_minutes: getDurationMinutes(
              time.start_time,
              time.end_time,
            ),
            tooltip_props: [
              {
                name: task.name,
                start_time: time.start_time,
                end_time: time.end_time,
                topics: task.topics,
                description: task.description,
              },
            ],
          };
          timetable_task_props.push(props);
        }
      }
      return timetable_task_props;
    }

    function timeToMins(time: string) {
      const hours = Number(time.substring(0, 2));
      const mins = Number(time.substring(3, 5));
      return hours * 60 + mins;
    }

    /*
    Returns null if no clash exists, otherwise returns clash_props as a 
    TimetableTaskProps and alters the parameters to not clash anymore.

    NOTE: If there is a clash between two tasks that have the same start_time
    or the same end_time one or both of them will be given a duration of 0.
    */
    function checkForTimetableClash(
      task_a: TimetableTaskProps,
      task_b: TimetableTaskProps,
    ): null | TimetableTaskProps {
      if (task_a.day !== task_b.day) return null;
      if (task_a.duration_minutes === 0 || task_b.duration_minutes === 0)
        return null;

      const start_a = timeToMins(task_a.start_time);
      const end_a = timeToMins(task_a.end_time);
      const start_b = timeToMins(task_b.start_time);
      const end_b = timeToMins(task_b.end_time);

      let first_task, second_task;
      // First start is commented out to avoid a linting error (unused variable)
      let /*first_start,*/ first_end, second_start, second_end;
      if (start_a <= start_b) {
        first_task = task_a;
        /*first_start = start_a;*/ first_end = end_a;
        second_task = task_b;
        second_start = start_b;
        second_end = end_b;
      } else {
        first_task = task_b;
        /*first_start = start_b;*/ first_end = end_b;
        second_task = task_a;
        second_start = start_a;
        second_end = end_a;
      }

      if (second_start < first_end) {
        const clash_props = {
          id: first_task.id + "/" + second_task.id,
          name: "Multiple Tasks",
          topics: [],
          description: "Hover for more details...",
          completed: false,
          day: first_task.day,
          start_time: second_task.start_time,
          end_time: first_task.end_time,
          duration_minutes: 0, // Set just below
          clash: true,
          tooltip_props: first_task.tooltip_props.concat(
            second_task.tooltip_props,
          ),
        };
        clash_props.duration_minutes = getDurationMinutes(
          clash_props.start_time,
          clash_props.end_time,
        );

        /* Second task is contained within first task so is replaced completely
        by the clash, the first task in then split into 2 using a deep copy */
        if (second_end < first_end) {
          second_task = JSON.parse(JSON.stringify(first_task)); // Deep copy
          second_task.id += ".2"; // Make the ID unique again
        }

        first_task.end_time = clash_props.start_time;
        first_task.duration_minutes = getDurationMinutes(
          first_task.start_time,
          first_task.end_time,
        );
        second_task.start_time = clash_props.end_time;
        second_task.duration_minutes = getDurationMinutes(
          second_task.start_time,
          second_task.end_time,
        );

        return clash_props;
      } else {
        return null;
      }
    }

    async function formatTimetableClashes(
      timetable_task_props: TimetableTaskProps[],
    ) {
      for (let i = 0; i < timetable_task_props.length; i++) {
        const current_prop = timetable_task_props[i];

        for (let j = i + 1; j < timetable_task_props.length; j++) {
          const compare_prop = timetable_task_props[j];

          const clash_props = checkForTimetableClash(
            current_prop,
            compare_prop,
          );
          if (clash_props === null) continue;

          timetable_task_props.push(clash_props);
        }
      }

      // Remove tasks that are contained within a clash
      timetable_task_props = timetable_task_props.filter(
        (props) => props.duration_minutes > 0,
      );
      return timetable_task_props;
    }

    addEventListeners();
    fetchTasks();

    return () => {
      removeEventListeners();
    };
  }, []);
  /* This should be dependent on timetableTaskProps however doing so causes it
  to run in an infinite loop. */

  return (
    <div className="content-container min-w-screen z-[50] flex h-[85vh] w-full flex-row bg-slate-950">
      <div className="timetable-container flex h-[85vh] w-4/5 flex-col items-center justify-center overflow-hidden p-3">
        <Timetable>
          {timetableTaskProps.map((props) => (
            <TimetableTask key={props.id} {...props} />
          ))}
        </Timetable>
      </div>
      <div className="tasklist-container z-[100] flex h-[85vh] w-1/5 flex-col items-center bg-slate-950 pt-5">
        <h1 className="text-center text-3xl text-white">Tasks</h1>
        <div className="m-2 h-48 w-4/5 bg-slate-500"></div>
        <div className="m-2 h-48 w-4/5 bg-slate-500"></div>
      </div>
    </div>
  );
}

export default Schedule;
