import { useState } from "react";

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

interface TaskFormProps {
  userId: number;
  onTaskCreated: (task: Item) => void;
}

export function TaskForm({ userId, onTaskCreated }: TaskFormProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/planner/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: taskName,
          description: description,
          completed: false,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();
      onTaskCreated(newTask);
      setTaskName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto h-[79vh] w-full max-w-md space-y-4 overflow-y-auto rounded-xl bg-zinc-700 p-4"
    >
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Task Name"
        className="w-full rounded border-2 bg-zinc-700 p-2 text-zinc-200"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="h-32 w-full resize-none rounded border-2 bg-zinc-700 p-2 text-zinc-200"
      />
      <button
        type="submit"
        className="rounded border-2 border-zinc-200 bg-blue-600 px-4 py-2 text-zinc-200 hover:bg-blue-700"
      >
        Add Task
      </button>
    </form>
  );
}
