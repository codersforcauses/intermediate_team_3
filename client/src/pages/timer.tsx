import React, { useState } from "react";

import Countdown from "@/components/ui/countdown";

const CountdownTimer = () => {
  const [tasks, setTasks] = useState([]);

  interface Tasks {
    id: number;
    end_time: string;
  }

  async function refreshTasks() {
    try {
      const response = await fetch("http://localhost:8000/api/planner/time/");
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      setTasks(result);
      console.log(tasks);
    } catch (error) {
      console.error(error);
    }
  }

  // check for tasks
  // direct to make task page if no tasks
  // refresh timer to check for tasks
  // play timer if there is a current task

  // lonk in button
  // lonk out

  return (
    <div className="m-8 flex flex-col items-center justify-center rounded-xl bg-slate-700 p-8 font-mono text-white shadow-2xl">
      <button
        onClick={refreshTasks}
        className="rounded-full bg-indigo-400 p-3 px-8"
      >
        refresh
      </button>
      <ul>
        {tasks.map((task: Tasks) => (
          <li key={task.id}>
            <Countdown taskTime={task.end_time} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountdownTimer;
