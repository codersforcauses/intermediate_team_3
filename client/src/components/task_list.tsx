import { TaskItem } from "./task_item";

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

type ListProps = {
  items: Item[];
  onToggleTask?: (id: number) => void;
};

export function TaskList({ items, onToggleTask }: ListProps) {
  if (items.length === 0) {
    return (
      <div>
        <p>No tasks available.</p>
      </div>
    );
  }
  return (
    <div className="mx-auto h-[85vh] w-full max-w-md overflow-y-auto p-2">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <TaskItem item={item} onToggle={onToggleTask} />
          </li>
        ))}
      </ul>
    </div>
  );
}
