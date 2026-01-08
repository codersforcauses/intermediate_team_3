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
        <p className="text-center text-slate-300">No tasks available.</p>
      </div>
    );
  }
  return (
    <ul className="task-list h-fit space-y-3">
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
  );
}
