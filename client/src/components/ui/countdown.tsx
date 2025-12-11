import React, { useEffect,useState } from "react";

import Timer from "./timer";

interface Timed {
  taskTime: string;
}

const Countdown = ({ taskTime }: Timed) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (taskTime) {
      const countdownInterval = setInterval(() => {
        const [eventHours, eventMins, eventSec] = taskTime
          .split(":")
          .map(Number);
        const d = new Date();
        let remainingTime =
          (eventHours - d.getHours()) * 60 * 60 +
          (eventMins - d.getMinutes()) * 60 +
          (eventSec - d.getSeconds());

        if (remainingTime <= 0) {
          remainingTime = 0;
          clearInterval(countdownInterval);
        }

        setTimeRemaining(remainingTime);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [taskTime, timeRemaining]);

  return (
    <>
      {timeRemaining > 0 ? (
        <div className="m-8 flex flex-col items-center justify-center rounded-xl bg-blue-500 p-3 px-10 font-sans text-white shadow-lg shadow-blue-500/50">
          <h1 className="p-2 font-sans">TIME LEFT</h1>
          <div>{Timer(timeRemaining)}</div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Countdown;
