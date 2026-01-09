import { useEffect, useState } from "react";

import Timetable, {
  getDurationMinutes,
  resizeAndPositionTimetableElements,
} from "@/components/timetable";
import { TimetableTaskProps } from "@/components/timetable_task";
import { useRouter } from "next/router";

/*
Database representation of Time.
*/
interface Time {
  id: number;
  day: number;
  start_time: string;
  end_time: string;
  repeating: boolean;
  task: number;
}

/*
Database representation of Topic.
*/
interface Topic {
  id: number;
  name: string;
  color_hex: number;
  user: number;
}

/*
Database representation of Task.
*/
interface Task {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  user: number;
  topics: Topic[];
  times: Time[];
}

/*
Used to convert database representation of a day to string used by front end.
*/
enum Day {
  Monday = 0,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

/*
Page containing a Timetable to visually represent the times that tasks have been
assigned.
*/
function Schedule() {

  const router = useRouter();
  const [timetableTasksProps, setTimetableTasksProps] = useState<
    TimetableTaskProps[]
  >([]);

  /* 
  This effect runs in an infinte loop IF timetableTasksProps is defined as a
  dependency. To prevent this an empty array has been provided to the 
  dependencies argument.
  */
  useEffect(() => {
    function addEventListeners() {
      window.addEventListener("resize", resizeAndPositionTimetableElements);
    }

    function removeEventListeners() {
      window.removeEventListener("resize", resizeAndPositionTimetableElements);
    }

    /*
    Get the task data from the API and format the tasks into the TimetableTasks
    to be displayed. Sets the timetableTasksProps State variable once finished.
    */
    async function fetchTasks() {
      
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          router.push("/login"); //redirect to login if unauthorised
          return;
        }
        const auth = await fetch(
          "http://localhost:8000/api/planner/protected/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!auth.ok) {
          router.push("/login"); //redirect to login if unauthorised
          return;
        }
        const tasksFetch = await fetch(
          `http://localhost:8000/api/planner/tasks/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await tasksFetch.json();
        let timetable_task_props =
          await formatTaskDataToTimetableTaskProps(data);
        timetable_task_props =
          await formatTimetableClashes(timetable_task_props);
        setTimetableTasksProps(timetable_task_props);
      } catch (error) {
        console.error(error);
      }
    }

    /*
    Format the task data from the API into TimetableTaskProps. Creates a 
    TimetableTaskProps object for each Task x Time where Time is assigned to
    Task (i.e. if a Task has 4 times assigned to it 4 sets of TimetableTaskProps
    are created).
    */
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

    /*
    Convert a time string in format HH:MM:TT to a minute representation where
    0 represents 00:00:00, 60 represents 01:00:00 etc.
    */
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

    /*
    Checks for timetable clashes between TimetableTasks, creates new 
    TimetableTasks for each clash found and fixes the information of the
    clashing tasks to remove the clashing section.
    */
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
  }, [router]);
  /* This should be dependent on timetableTasksProps however doing so causes it
  to run in an infinite loop. */

  return (
    <div className="content-container min-w-screen h-[calc(100vh-64px)] flex w-full flex-row bg-slate-950">
      <div className="timetable-container max-h-[90vh] w-full p-3">
        <Timetable timetable_tasks_props={timetableTasksProps} />
      </div>
    </div>
  );
}

export default Schedule;
