import { useEffect, useState } from "react";

import { TimeInput } from "@/components/time_input";
import { TopicInput } from "@/components/topic_input";

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

type TopicSelection =
  | { type: "existing"; id: number }
  | { type: "new"; name: string; color_hex: number };

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
  const [times, setTimes] = useState<Time[]>([]);
  const [topics, setTopics] = useState<TopicSelection[]>([]);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No access token");
      return;
    }

    try {
      const existing_topic_ids = topics
        .filter((t) => t.type === "existing")
        .map((t) => t.id);

      const new_topics = topics
        .filter((t) => t.type === "new")
        .map((t) => ({ name: t.name, color_hex: t.color_hex }));

      const validTimes = times.filter((t) => t.start_time && t.end_time);

      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "planner/tasks/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: taskName,
            description: description,
            completed: false,
            user_id: userId,
            times: validTimes,
            existing_topic_ids: existing_topic_ids,
            new_topics: new_topics,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();
      onTaskCreated(newTask);
      setTaskName("");
      setDescription("");
      setTimes([]);
      setTopics([]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="task-form flex h-full w-full flex-col items-center justify-between gap-2 rounded-lg p-4 text-slate-200"
    >
      <input
        className="title-input w-full rounded-lg bg-indigo-600 px-3 py-1 text-3xl font-bold text-slate-100 brightness-100 placeholder:text-slate-300 hover:brightness-110"
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Task name"
        required
      />
      <div className="description-wrapper flex w-full flex-col items-center">
        <h1 className="description-input-title text-xl hover:brightness-110">
          Description
        </h1>
        <textarea
          className="description-input w-full rounded-lg bg-indigo-600 p-2 brightness-100 placeholder:text-slate-300 hover:brightness-110"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={7}
          placeholder="Add description here..."
        />
      </div>
      <TopicInput
        availableTopics={availableTopics}
        topics={topics}
        setTopics={setTopics}
      />
      <TimeInput times={times} setTimes={setTimes} />
      <button
        className="w-fit rounded-full border bg-indigo-600 px-3 py-1 text-xl brightness-110 hover:brightness-125"
        type="submit"
      >
        Save
      </button>
    </form>
  );
}
