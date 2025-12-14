type Time = {
  id: number;
  day: number;
  start_time: string;
  end_time: string;
  repeating: boolean;
};

type Topic = {
  id: number;
  name: string;
  color_hex: number;
};

type Item = {
  id: number;
  name: string;
  completed: boolean;
  description: string;
  times: Time[];
  topics: Topic[];
};

type ItemProps = {
  item: Item;
  onToggle?: (id: number) => void;
};

export function TaskItem({ item, onToggle }: ItemProps) {
  return (
    <label className="m-1 flex w-96 items-center justify-between space-x-2 rounded-md border-2 border-zinc-200 bg-zinc-700 p-2">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle?.(item.id)}
          className="w-xl h-xl accent-zinc-600"
        />
        <span
          className={
            item.completed ? "text-zinc-400 line-through" : "text-zinc-300"
          }
        >
          {item.name}
        </span>
      </div>
      <div className="flex flex-col items-end text-sm text-zinc-300">
        <span className="text-sm text-zinc-300">
          {item.times.length > 0
            ? item.times.map((t) => (
                <span key={t.id}>
                  {formatDay(t.day)} {t.start_time.slice(0, 5)} -{" "}
                  {t.end_time.slice(0, 5)}
                </span>
              ))
            : "No time set"}
        </span>
      </div>
    </label>
  );
}

function formatDay(day: number): string {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days[day - 1] || "Unknown";
}
