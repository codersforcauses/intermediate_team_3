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
  current,
}: {
  task: Task;
  time: Time;
  current: boolean;
}) {
  return (
    <div
      className={
        current
          ? "px-auto outline-3 m-3 flex flex-auto flex-col rounded-3xl bg-indigo-500 p-4 shadow-md shadow-black/40 outline outline-slate-50"
          : "px-auto m-3 flex flex-auto flex-col rounded-3xl bg-indigo-700 p-4 shadow-md shadow-black/40"
      }
    >
      <div className="font-bold">{task.name}</div>
      <div>
        {time.day === 1
          ? "Mon"
          : time.day === 2
            ? "Tue"
            : time.day === 3
              ? "Wed"
              : time.day === 4
                ? "Thu"
                : time.day === 5
                  ? "Fri"
                  : time.day === 6
                    ? "Sat"
                    : time.day === 7
                      ? "Sun"
                      : ""}{" "}
        - {time.start_time} - {time.end_time}
      </div>
      <div className="italic">{task.description}</div>
    </div>
  );
}
