import { useEffect, useState } from "react";

import TaskDisplay from "./taskDisplay";

interface Task {
  id: number;
  name: string;
  description: string;
}

interface Time {
  id: number;
  day: number;
  start_time: string;
  end_time: string;
  repeating: boolean;
  task: number;
}

interface Tasks {
  tasks: Task[];
  times: Time[];
}

function serializeTime(time: string) {
  const [Hours, Mins, Sec] = time.split(":").map(Number);
  return Hours * 60 * 60 + Mins * 60 + Sec;
}

export default function UpcomingTasks({ tasks, times }: Tasks) {
  const [upcomingTimes, setUpcomingTimes] = useState<Time[]>([]);

  useEffect(() => {
    function sortTimes() {
      const d = new Date();
      const cur_time =
        d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();
      const cur_d = d.getDay();
      let ut = times.filter(
        (time) =>
          !(cur_d == time.day && serializeTime(time.end_time) <= cur_time),
      );

      ut = ut.sort((a, b) => {
        return (
          serializeTime(a.start_time) +
          ((a.day + 8 - cur_d) % 8) * 24 * 60 * 60 -
          (serializeTime(b.start_time) +
            ((b.day + 8 - cur_d) % 8) * 24 * 60 * 60)
        );
      });
      setUpcomingTimes(ut);
    }

    sortTimes();
  }, [times, tasks]);

  return (
    <div className="rounded-2xl bg-slate-900 p-2 py-3 shadow-xl shadow-black/40">
      <div className="w-100 scrollbar h-[285px] overflow-y-auto">
        {upcomingTimes.map((time: Time) => (
          <TaskDisplay
            task={tasks.filter((task) => task.id === time.task)[0]}
            time={time}
            key={time.id}
          />
        ))}
      </div>
    </div>
  );
}
