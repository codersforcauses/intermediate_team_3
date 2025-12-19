import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { TaskList } from "@/components/task_list";

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
          `http://localhost:8000/api/planner/tasks/`,
        );
        const data = await response.json();
        setItems(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [id]);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  function handleToggleTask(id: number) {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  }

  return (
    <div className="m-4 h-fit w-fit rounded-xl bg-zinc-700 p-4 text-center">
      <h1 className="mb-4 text-3xl font-bold text-zinc-300">Task List</h1>
      <TaskList items={items} onToggleTask={handleToggleTask} />
    </div>
  );
}
