import { useEffect } from "react";

import Timetable from "@/components/timetable";
import { resizeAndPositionTimetableTasks } from "@/components/timetable_task";

function Schedule() {
  useEffect(() => {
    window.addEventListener("resize", resizeAndPositionTimetableTasks);

    return () => {
      window.removeEventListener("resize", resizeAndPositionTimetableTasks);
    };
  });

  return (
    <div className="content-container min-w-screen z-[50] flex h-fit min-h-screen w-full flex-row bg-slate-950">
      <div className="timetable-container flex h-screen w-4/5 flex-col items-center justify-center overflow-hidden p-3">
        <Timetable />
      </div>
      <div className="tasklist-container z-[100] flex h-screen w-1/5 flex-col items-center bg-slate-950">
        <h1 className="text-center text-3xl text-white">Tasks</h1>
        <div className="m-2 h-48 w-4/5 bg-slate-500"></div>
        <div className="m-2 h-48 w-4/5 bg-slate-500"></div>
      </div>
    </div>
  );
}

export default Schedule;
