import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import CurrentTaskTitle from "@/components/ui/focus/currentTaskTitle";
import TimeDisplay from "@/components/ui/focus/timeDisplay";
import UpcomingTasks from "@/components/ui/focus/upcomingTasks";

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
}

interface Task {
  id: number;
  name: string;
  completed: boolean;
  description: string;
  times: Time[];
  topics: Topic[];
}

function serializeTime(time: string) {
  const [Hours, Mins, Sec] = time.split(":").map(Number);
  return Hours * 60 * 60 + Mins * 60 + Sec;
}

const CountdownTimer = () => {
  const router = useRouter();
  const [times, setTimes] = useState<Time[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTime, setCurrentTime] = useState<Time | null>();
  const [currentTask, setCurrentTask] = useState<Task | null>();
  const [nextTime, setNextTime] = useState<Time | null>();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchTask() {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          router.push("/login"); //redirect to login if unauthorised
          return;
        }
        const auth = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "planner/protected/",
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
          process.env.NEXT_PUBLIC_BACKEND_URL + "planner/tasks/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!tasksFetch.ok) {
          throw new Error(`Response status: ${tasksFetch.status}`);
        }
        const result = await tasksFetch.json();
        console.log("tasks: ", result);
        setTasks(result);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTask();
  }, [router]);

  useEffect(() => {
    function getCurrentTask(ts: Time[]) {
      let upcomingTimes: Time[];

      const d = new Date();
      const cur_time =
        d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();
      const cur_d = d.getDay();

      // filter out finished tasks
      upcomingTimes = ts.filter((time) => {
        return !(
          cur_d == time.day && serializeTime(time.end_time) <= cur_time + 10
        );
      });

      // sort by start time
      upcomingTimes = upcomingTimes.sort((a, b) => {
        return (
          serializeTime(a.start_time) +
          ((a.day + 8 - cur_d) % 8) * 24 * 60 * 60 -
          (serializeTime(b.start_time) +
            ((b.day + 8 - cur_d) % 8) * 24 * 60 * 60)
        );
      });

      // logic for if there are no tasks currently or at all
      if (upcomingTimes.length > 0) {
        if (
          serializeTime(upcomingTimes[0].start_time) < cur_time &&
          upcomingTimes[0].day == cur_d
        ) {
          setCurrentTime(upcomingTimes[0]);

          const cur_task = tasks.filter(
            (task) => task.id === upcomingTimes[0]?.task,
          );
          console.log(tasks, cur_task);
          setCurrentTask(cur_task[0]);
        } else {
          setCurrentTime(null);
          setCurrentTask(null);
          setNextTime(upcomingTimes[0]);
        }
      } else {
        setCurrentTime(null);
        setNextTime(null);
      }
    }

    let task_times: Time[] = [];
    for (let index = 0; index < tasks.length; index++) {
      const task = tasks[index];
      for (let i = 0; i < task.times.length; i++) {
        task_times = task_times.concat(task.times[i]);
        console.log("new time: ", task.times[i]);
      }
    }
    setTimes(task_times);
    console.log("times: ", task_times);
    getCurrentTask(task_times);
  }, [tasks]);

  function getCurrentTask(ts: Time[]) {
    let upcomingTimes: Time[];

    const d = new Date();
    const cur_time =
      d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();
    const cur_d = d.getDay();

    // filter out finished tasks
    upcomingTimes = ts.filter((time) => {
      return !(
        cur_d == time.day && serializeTime(time.end_time) <= cur_time + 10
      );
    });

    // sort by start time
    upcomingTimes = upcomingTimes.sort((a, b) => {
      return (
        serializeTime(a.start_time) +
        ((a.day + 8 - cur_d) % 8) * 24 * 60 * 60 -
        (serializeTime(b.start_time) + ((b.day + 8 - cur_d) % 8) * 24 * 60 * 60)
      );
    });

    // logic for if there are no tasks currently or at all
    if (upcomingTimes.length > 0) {
      if (
        serializeTime(upcomingTimes[0].start_time) < cur_time &&
        upcomingTimes[0].day == cur_d
      ) {
        setCurrentTime(upcomingTimes[0]);

        const cur_task = tasks.filter(
          (task) => task.id === upcomingTimes[0]?.task,
        );
        console.log(tasks, cur_task);
        setCurrentTask(cur_task[0]);
      } else {
        setCurrentTime(null);
        setCurrentTask(null);
        setNextTime(upcomingTimes[0]);
      }
    } else {
      setCurrentTime(null);
      setNextTime(null);
    }
  }

  function onTaskEnd(status: string) {
    if (status == "finished") {
      setRefresh(!refresh);
      getCurrentTask(times);
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center bg-slate-800 font-inter">
      <div className="flex flex-col items-center justify-start rounded-xl bg-slate-800 p-8 font-mono text-white">
        <p className="p-4 font-inter text-4xl font-semibold">Focus</p>
        <div className="flex flex-row justify-center">
          <div className="flex flex-col">
            <div>
              {currentTask ? (
                <div>{CurrentTaskTitle(currentTask.name)}</div>
              ) : (
                <div>{CurrentTaskTitle("none")}</div>
              )}
            </div>
            <div>
              {currentTime ? (
                <TimeDisplay
                  statusSignal={onTaskEnd}
                  time={currentTime.end_time}
                  current={true}
                  day={currentTime.day}
                />
              ) : (
                <>
                  {nextTime ? (
                    <TimeDisplay
                      statusSignal={onTaskEnd}
                      time={nextTime.start_time}
                      current={false}
                      day={nextTime.day}
                    />
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            {times.length > 0 ? (
              <div className="justify-top flex flex-col pl-8">
                <div className="p-4 font-inter text-2xl font-semibold">
                  Tasks
                </div>
                <UpcomingTasks tasks={tasks} times={times} refresh={refresh} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="p-8"></div>
      </div>
    </div>
  );
};

export default CountdownTimer;
