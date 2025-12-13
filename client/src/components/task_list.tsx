import { TaskItem } from "./task_item";

type Item = {
  id: number;
  name: string;
  completed: boolean;
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
    <div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <TaskItem item={item} onToggle={onToggleTask} />
          </li>
        ))}
      </ul>
    </div>
  );
}
