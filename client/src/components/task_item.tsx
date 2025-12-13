type Item = {
  id: number;
  name: string;
  completed: boolean;
};

type ItemProps = {
  item: Item;
  onToggle?: (id: number) => void;
};

export function TaskItem({ item, onToggle }: ItemProps) {
  return (
    <label style={{ textDecoration: item.completed ? "line-through" : "none" }}>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={() => onToggle?.(item.id)}
      />
      {item.name}
    </label>
  );
}
