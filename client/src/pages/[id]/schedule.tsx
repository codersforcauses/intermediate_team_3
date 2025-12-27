import { useEffect, useState } from "react";

import Timetable, { resizeTimetableElements } from "@/components/timetable";
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

function getDuration(start_time: string, end_time: string) {
  const start_hour: number = +start_time.substring(0, 2);
  const start_minute: number = +start_time.substring(3, 5);
  const end_hour: number = +end_time.substring(0, 2);
  const end_minute: number = +end_time.substring(3, 5);
  return 60 * (end_hour - start_hour) + (end_minute - start_minute);
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
            duration_minutes: getDuration(time.start_time, time.end_time),
          };
          timetable_task_props.push(props);
        }
      }
      return timetable_task_props;
    }

    async function fetchTasks() {
      const API_URL = "http://localhost:8000/api/planner/task/";
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        setTimetableTaskProps(await formatTaskDataToTimetableTaskProps(data));
      } catch (error) {
        console.error(error);
      }
    }

    addEventListeners();
    fetchTasks();

    return () => {
      removeEventListeners();
    };
  }, []);
  /* This should be dependent on timetableTaskProps however doing so causes it
  to run in an infinite loop. */

  const timetableTasks = timetableTaskProps.map((props) => (
    <TimetableTask key={props.id} {...props}></TimetableTask>
  ));

  return (
    <div className="content-container min-w-screen z-[50] flex h-[85vh] w-full flex-row bg-slate-950">
      <div className="timetable-container flex h-[85vh] w-4/5 flex-col items-center justify-center overflow-hidden p-3">
        <Timetable>{timetableTasks}</Timetable>
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
