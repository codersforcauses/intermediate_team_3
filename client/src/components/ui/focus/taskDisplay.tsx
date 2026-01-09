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

export default function TaskDisplay({
  task,
  time,
  current
}: {
  task: Task;
  time: Time;
  current: Boolean;
}) {
  return (
    <div className={current ? "px-auto m-3 flex flex-auto flex-col rounded-3xl bg-indigo-500 p-4 shadow-md shadow-black/40 outline-3 outline outline-slate-50" : "px-auto m-3 flex flex-auto flex-col rounded-3xl bg-indigo-400 p-4 shadow-md shadow-black/40"}>
      <div className="flex flex-auto flex-row gap-4 px-3">
        <div>{task.name}:</div>
        <div>
          {time.start_time} - {time.end_time}
        </div>
      </div>
      <div className="px-3 italic">{task.description}</div>
    </div>
  );
}
