import { useEffect, useState } from "react";

import Countdown from "./countdown";
import TimeDisplay from "./timeDisplay";

interface Task {
  id: number;
  start_time: string;
  end_time: string;
}

interface Tasks {
  tasks: Task[];
}

const CurrentTask = ({ tasks }: Tasks) => {
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task>(
    {
      id : 1,
      start_time : "00:00:00",
      end_time : "00:00:00"
    }
  );

  useEffect(() => {
    function getCurrentTask() {
      setCurrentTasks([]);
      tasks.forEach((task) => {
        const [startHours, startMins, startSec] = task.start_time
          .split(":")
          .map(Number);
        const [endHours, endMins, endSec] = task.end_time
          .split(":")
          .map(Number);

        const d = new Date();
        const start_time = startHours * 60 * 60 + startMins * 60 + startSec;
        const end_time = endHours * 60 * 60 + endMins * 60 + endSec;
        const cur_time =
          d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();
        console.log(
          startHours,
          " ",
          endHours,
          " ",
          endHours,
          " ",
          endMins,
          " ",
          d.getHours(),
          " ",
          d.getMinutes(),
        );
        console.log(start_time, " ", end_time, " ", cur_time);

        if (start_time <= cur_time && end_time >= cur_time) {
          setCurrentTasks((prevTasks) => [...prevTasks, task]);
        }
      });
      setCurrentTask(currentTasks[0]);
    }

    getCurrentTask();
  }, [tasks]);

  const updateTask = (status : string) => {
    if (status == "finished") {
      setCurrentTask(currentTasks[0]);
    }
  }

  return (
    <>
      <ul>
        {currentTasks.length <= 0 ? (
          <>
            <div className="m-8 flex flex-col items-center justify-center rounded-xl bg-blue-500 p-3 px-10 font-sans text-white shadow-lg shadow-blue-500/50">
              <h1 className="p-2 font-sans">NO CURRENT TASKS</h1>
              <div>MAKE ONE?</div>
            </div>
          </>
        ) : (
          <>
            {currentTasks.map((task: Task) => (
              <li key={task.id}>
                <Countdown taskTime={task.end_time} />
              </li>
            ))}
          </>
        )}
      </ul>
      <div>
        {currentTasks.length > 0 ? (
          <TimeDisplay statusSignal={updateTask} end_time={currentTasks[0].end_time} />
        ):(
          <></>
        )}
      </div>
    </>
  );
};

export default CurrentTask;
