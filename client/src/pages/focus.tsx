import React, { useEffect, useState } from "react";

import CurrentTaskTitle from "@/components/ui/focus/currentTaskTitle";
import TimeDisplay from "@/components/ui/focus/timeDisplay";
import UpcomingTasks from "@/components/ui/focus/upcomingTasks";
import Refresh from "@/components/ui/refresh";

interface Time {
  id: number;
  day: number;
  start_time: string;
  end_time: string;
  repeating: boolean;
  task: number;
}

interface Task {
  id: number;
  name: string;
  description: string;
}

function serializeTime(time: string) {
  const [Hours, Mins, Sec] = time.split(":").map(Number);
  return Hours * 60 * 60 + Mins * 60 + Sec;
}

const CountdownTimer = () => {
  const [times, setTimes] = useState<Time[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTime, setCurrentTime] = useState<Time | null>();
  const [currentTask, setCurrentTask] = useState<Task | null>();
  const [nextTime, setNextTime] = useState<Time | null>();
  const [loading, setLoading] = useState(false);

  async function refreshTimes() {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/planner/time/");
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      setTimes(result);
      getCurrentTask(result);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchTask() {
      try {
        const response = await fetch("http://localhost:8000/api/planner/task/");
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        setTasks(result);
        const cur_task = tasks.filter((task) => task.id === currentTime?.task);
        setCurrentTask(cur_task[0]);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTask();
  }, [tasks, currentTime]);

  function getCurrentTask(ts: Time[]) {
    console.log(times);
    let upcomingTimes: Time[];

    const d = new Date();
    const cur_time =
      d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();

    // filter out finished tasks
    upcomingTimes = ts.filter((time) => {
      const end_time = serializeTime(time.end_time);
      return end_time > cur_time;
    });

    // sort by start time
    upcomingTimes = upcomingTimes.sort((a, b) => {
      return serializeTime(a.start_time) - serializeTime(b.start_time);
    });

    // logic for if there are no tasks currently or at all
    if (upcomingTimes.length > 0) {
      if (serializeTime(upcomingTimes[0].start_time) < cur_time) {
        setCurrentTime(upcomingTimes[0]);
      } else {
        setCurrentTime(null);
        setNextTime(upcomingTimes[0]);
      }
    } else {
      setCurrentTime(null);
      setNextTime(null);
    }
  }

  function onTaskEnd(status: string) {
    if (status == "finished") {
      getCurrentTask(times);
    }
  }

  // check for tasks
  // direct to make task page if no tasks
  // refresh timer to check for tasks
  // play timer if there is a current task

  // lonk in button
  // lonk out

  return (
    <div className="h-screen bg-slate-800 p-8 font-inter">
      <div className="flex flex-col items-center justify-start rounded-xl bg-slate-700 p-8 font-mono text-white shadow-inner shadow-slate-900">
        <p className="p-4 font-inter text-4xl font-semibold">focus</p>
        <div className="flex flex-row justify-center">
          <div className="flex flex-col">
            <div>
              {currentTime ? (
                <div>
                  <TimeDisplay
                    statusSignal={onTaskEnd}
                    time={currentTime.end_time}
                    current={true}
                  />
                </div>
              ) : (
                <>
                  {nextTime ? (
                    <div>
                      <TimeDisplay
                        statusSignal={onTaskEnd}
                        time={nextTime.start_time}
                        current={false}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
            <div>
              {currentTask ? (
                <div>{CurrentTaskTitle(currentTask.name)}</div>
              ) : (
                <div>{CurrentTaskTitle("none")}</div>
              )}
            </div>
          </div>
          <div className="justify-top flex flex-col pl-8">
            <div className="p-4 font-inter text-xl font-semibold">upcoming</div>
            <div>
              {times.length > 0 ? (
                <>
                  <UpcomingTasks tasks={tasks} times={times} />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="p-8">
          <Refresh loading={loading} update={refreshTimes} />
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
