import { TaskItem } from "./task_item";

interface Time {
  id: number;
  day: number;
  start_time: string;
  end_time: string;
  repeating: boolean;
}

interface Topic {
  id: number;
  name: string;
  color_hex: number;
}

interface Item {
  id: number;
  name: string;
  completed: boolean;
  description: string;
  times: Time[];
  topics: Topic[];
}

type ListProps = {
  items: Item[];
  onToggleTask?: (id: number) => void;
  onUpdate: (item: Item) => void;
  availableTopics: Topic[];
};

export function TaskList({
  items,
  onToggleTask,
  onUpdate,
  availableTopics,
}: ListProps) {
  if (items.length === 0) {
    return (
      <div>
        <p className="text-center text-zinc-300">No tasks available.</p>
      </div>
    );
  }
  return (
    <div
      className="task-list h-full w-full overflow-y-auto bg-slate-500 p-3"
      style={{ scrollbarWidth: "none" }}
    >
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <TaskItem
              item={item}
              onToggle={onToggleTask}
              onUpdate={onUpdate}
              availableTopics={availableTopics}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
