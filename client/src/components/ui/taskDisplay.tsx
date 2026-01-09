import React from "react";

export default function TaskDisplay(task_name: string) {
  return (
    <div className="m-3 flex flex-col items-center justify-center rounded-3xl bg-slate-900 p-10 shadow-xl shadow-black/40">
      <h1 className="mb-2 font-inter text-4xl font-semibold">Current Focus</h1>
      <div className="rounded-full bg-indigo-400 p-3 px-8 font-inter text-xl font-semibold">
        {task_name}
      </div>
    </div>
  );
}
