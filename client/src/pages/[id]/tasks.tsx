import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { TaskForm } from "@/components/task_form";
import { TaskList } from "@/components/task_list";

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

export default function TasksPage() {
  const router = useRouter();
  const { id } = router.query;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);

  useEffect(() => {
    if (!id) return;

    async function fetchTasks() {
      try {
        // Remove the query bit when authentication is added.
        const response = await fetch(
          `http://localhost:8000/api/planner/tasks/?user_id=${id}`,
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

  useEffect(() => {
    fetch("http://localhost:8000/api/planner/topic/")
      .then((res) => res.json())
      .then((data) => setAvailableTopics(data))
      .catch((err) => console.error("Failed to load topics", err));
  }, []);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  const handleTaskCreated = (task: Item) => {
    setItems((prev) => [...prev, task]);
  };

  async function handleToggleTask(id: number) {
    const task = items.find((t) => t.id === id);
    if (!task) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/planner/tasks/${id}/toggle_complete/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: !task.completed }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? updatedTask : item)),
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  function handleTaskUpdated(updated: Item) {
    setItems((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  return (
    <div className="content-container min-w-screen flex h-[85vh] flex-row items-center justify-center bg-slate-950 p-3">
      <div className="task-list-border h-full w-full rounded-lg bg-slate-900 p-3">
        <div className="task-list-container h-full w-full overflow-hidden">
          <div className="task-list-content flex h-full w-full flex-col items-center justify-center rounded-lg bg-slate-500 text-slate-200">
            <div className="task-list-top mb-3 h-[10%] w-full rounded-t-lg p-3">
              <h1 className="task-list-title border-b-2 border-b-slate-400 p-3 text-center text-3xl font-bold text-slate-100">
                My Tasks
              </h1>
            </div>
            <div className="task-list-bottom flex h-[90%] w-full flex-row justify-center gap-6 p-3">
              <div
                className="task-list-wrapper flex w-fit flex-row justify-center overflow-auto"
                style={{ scrollbarWidth: "thin", scrollbarColor: "grey white" }}
              >
                <TaskList
                  items={items}
                  onToggleTask={handleToggleTask}
                  onUpdate={handleTaskUpdated}
                  availableTopics={availableTopics}
                />
              </div>
              <div className="add-task-container flex h-full flex-col items-center justify-start rounded-lg bg-slate-400 p-3">
                <h1 className="text-3xl font-bold text-slate-100">Add Task</h1>
                <div className="task-form-wrapper h-full overflow-auto">
                  <TaskForm
                    userId={Number(id)}
                    onTaskCreated={handleTaskCreated}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
