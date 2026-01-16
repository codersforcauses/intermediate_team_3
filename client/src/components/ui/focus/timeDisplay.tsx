import React, { useEffect, useState } from "react";

import Timer from "./timer";

interface TimeDisplayProps {
  statusSignal: (data: string) => void;
  time: string;
  current: boolean;
  day: number;
}

export default function TimeDisplay({
  statusSignal,
  time,
  current,
  day,
}: TimeDisplayProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const getTimeRemaining = setInterval(() => {
      const [Hours, Mins, Sec] = time.split(":").map(Number);

      const d = new Date();
      const time_serial = Hours * 60 * 60 + Mins * 60 + Sec;
      const day_diff = ((day - d.getDay() + 8) % 8) * 24 * 60 * 60;

      const cur_time =
        d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();

      let remaining_time = 0;

      remaining_time = time_serial - cur_time + day_diff;
      if (remaining_time <= 1) {
        clearInterval(getTimeRemaining);
      }

      setTimeRemaining(remaining_time);
    }, 1000);

    return () => clearInterval(getTimeRemaining);
  }, [time, timeRemaining, day]);

  useEffect(() => {
    if (timeRemaining <= 1) {
      statusSignal("finished");
    }
  }, [timeRemaining, statusSignal]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-slate-900 p-10 shadow-xl shadow-black/40">
      {current ? (
        <>
          <h1 className="font-inter text-4xl font-semibold">Time Remaining</h1>
        </>
      ) : (
        <>
          <h1 className="font-inter text-4xl font-semibold">Next Task In</h1>
        </>
      )}
      <div className="time_left">{Timer(timeRemaining)}</div>
    </div>
  );
}
