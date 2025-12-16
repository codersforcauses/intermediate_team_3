import Timetable from "@/components/timetable";

function Schedule() {
  return (
    <div className="content-container min-w-screen flex h-fit min-h-screen w-full flex-row bg-slate-950">
      <div className="timetable-container flex h-screen w-4/5 flex-col items-center justify-center overflow-hidden p-2">
        <Timetable />
      </div>
      <div className="content-separator ml-2 mr-2 h-screen w-0 border border-slate-500"></div>
      <div className="tasklist-container flex h-screen w-1/5 flex-col items-center">
        <h1 className="text-center text-3xl text-white">Tasks</h1>
        <div className="m-2 h-48 w-4/5 bg-slate-500"></div>
        <div className="m-2 h-48 w-4/5 bg-slate-500"></div>
      </div>
    </div>
  );
}

export default Schedule;
