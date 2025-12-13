import React, { useState } from "react";

import TimeDisplay from "@/components/ui/timeDisplay";

interface Task {
  id: number;
  start_time: string;
  end_time: string;
}

const CountdownTimer = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task>();
  const [loading, setLoading] = useState(false);

  async function refreshTasks() {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/planner/time/");
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      setTasks(result);
      getCurrentTask();
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  function getCurrentTask() {
    console.log("getting current task");
    let task_time = 1000000;

    tasks.forEach((task) => {
      const [startHours, startMins, startSec] = task.start_time
        .split(":")
        .map(Number);
      const [endHours, endMins, endSec] = task.end_time.split(":").map(Number);

      const d = new Date();
      const start_time = startHours * 60 * 60 + startMins * 60 + startSec;
      const end_time = endHours * 60 * 60 + endMins * 60 + endSec;
      const cur_time =
        d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();

      if (start_time <= cur_time && end_time >= cur_time) {
        if (start_time < task_time) {
          console.log("new time", start_time);
          setCurrentTask(task);
          task_time = start_time;
        }
      }
    });
  }

  function onTaskEnd(status: string) {
    if (status == "finished") {
      console.log("finished");
      getCurrentTask();
    }
  }

  // check for tasks
  // direct to make task page if no tasks
  // refresh timer to check for tasks
  // play timer if there is a current task

  // lonk in button
  // lonk out

  return (
    <div className="h-screen bg-slate-800 p-8">
      <div className="flex h-screen flex-col items-center justify-start rounded-xl bg-slate-700 p-8 font-mono text-white shadow-inner shadow-slate-900">
        {loading ? (
          <div>
            <button
              disabled
              type="button"
              className="focus:ring-brand-medium shadow-xs rounded-base box-border inline-flex items-center rounded-full border border-transparent bg-indigo-500 px-4 py-2.5 text-sm font-medium leading-5 hover:bg-indigo-600 focus:outline-none focus:ring-4"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="me-2 h-4 w-4 animate-spin text-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading...
            </button>
          </div>
        ) : (
          <button
            onClick={refreshTasks}
            className="rounded-full bg-indigo-400 p-3 px-8 hover:bg-indigo-500"
          >
            refresh
          </button>
        )}

        <div>
          {currentTask ? (
            <div>
              <p>{currentTask.end_time}</p>
              <TimeDisplay
                statusSignal={onTaskEnd}
                end_time={currentTask.end_time}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
