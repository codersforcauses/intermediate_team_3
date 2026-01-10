import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RxCross2, RxPlus } from "react-icons/rx";

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
  const [userId, setUserId] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);

  const [showAddTask, setShowAddTask] = useState(false);

  function toggleShowAddTask() {
    setShowAddTask(!showAddTask);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          router.push("/login"); //redirect to login if unauthorised
          return;
        }
        const auth = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "planner/protected/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!auth.ok) {
          router.push("/login"); //redirect to login if unauthorised
          return;
        }

        const user = await auth.json();
        setUserId(user.user_id);
        const tasksFetch = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + `planner/tasks/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await tasksFetch.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        //setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const token = localStorage.getItem("access");
        if (!token) return;

        const res = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "planner/topic/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to load topics");
        }

        const data = await res.json();
        setAvailableTopics(data);
      } catch (err) {
        console.error("Failed to load topics", err);
      }
    }

    fetchTopics();
  }, []);

  //if (loading) {
  //  return <p>Loading tasks...</p>;
  //}

  const handleTaskCreated = (task: Item) => {
    setItems((prev) => [...prev, task]);
  };

  async function handleToggleTask(id: number) {
    const task = items.find((t) => t.id === id);
    if (!task) return;

    const token = localStorage.getItem("access");

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL +
          `planner/tasks/${id}/toggle_complete/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  async function handleTaskDeleted(id: number) {
    if (!window.confirm("Delete this task?")) return;

    const token = localStorage.getItem("access");

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `planner/tasks/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  return (
    <div className="content-container min-w-screen relative flex min-h-[calc(100vh-64px)] flex-row items-center justify-center bg-slate-800">
      <div className="task-list-container h-full w-full">
        <div className="task-list-content flex h-full w-full flex-col items-center justify-center rounded-lg p-3 text-slate-200">
          <h1 className="task-list-title border-b-slate-400 p-3 text-center text-4xl font-bold text-slate-100">
            Tasks
          </h1>
          <div className="task-list-bottom flex w-full flex-row justify-center gap-6">
            <div
              className="task-list-wrapper flex w-fit flex-row justify-center"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "grey white",
                display: !(showAddTask && items.length === 0) ? "flex" : "none",
              }}
            >
              <TaskList
                items={items}
                onToggleTask={handleToggleTask}
                onUpdate={handleTaskUpdated}
                onDelete={handleTaskDeleted}
                availableTopics={availableTopics}
              />
            </div>
            <div
              className="add-task-container sticky top-3 flex h-full flex-col items-center justify-start rounded-lg bg-slate-900 p-3 shadow-xl"
              style={{ display: showAddTask ? "flex" : "none" }}
            >
              <h1 className="text-3xl font-bold text-slate-100">Add Task</h1>
              <button
                className="minimise-add-task-btn absolute right-3 top-3 h-7 w-7 text-lg hover:brightness-110"
                onClick={toggleShowAddTask}
              >
                <RxCross2 />
              </button>
              <div className="task-form-wrapper h-full overflow-auto">
                <TaskForm
                  userId={Number(userId)}
                  onTaskCreated={handleTaskCreated}
                />
              </div>
            </div>
            <button
              className="toggle-add-task-button fixed bottom-9 right-9 flex h-12 w-12 items-center justify-center rounded-full border bg-indigo-400 text-xl brightness-90 hover:brightness-110"
              onClick={toggleShowAddTask}
            >
              {!showAddTask ? <RxPlus /> : <RxCross2 />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
