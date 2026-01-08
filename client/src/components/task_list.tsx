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
  onDelete: (id: number) => void;
  availableTopics: Topic[];
};

export function TaskList({
  items,
  onToggleTask,
  onUpdate,
  onDelete,
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
    <div className="mx-auto h-[79vh] w-full max-w-md overflow-y-auto p-2">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <TaskItem
              item={item}
              onToggle={onToggleTask}
              onUpdate={onUpdate}
              onDelete={onDelete}
              availableTopics={availableTopics}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
