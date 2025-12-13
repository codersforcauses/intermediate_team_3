import { useRouter } from "next/router";
import { useEffect,useState } from "react";

import { TaskList } from "@/components/task_list";

type Item = {
  id: number;
  name: string;
  completed: boolean;
};

export default function TasksPage() {
  const router = useRouter();
  const { id } = router.query;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    async function fetchTasks() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/planner/tasks/user/${id}/`,
        );
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [id]);

  if (loading) {
    return <p>Loading tasks…</p>;
  }

  function handleToggleTask(id: number) {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  }

  return (
    <div>
      <h1>Task List</h1>
      <TaskList items={items} onToggleTask={handleToggleTask} />
    </div>
  );
}
