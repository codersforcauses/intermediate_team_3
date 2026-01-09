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
    fetch("http://localhost:8000/api/planner/topic/")
      .then((res) => res.json())
      .then((data) => setAvailableTopics(data))
      .catch((err) => console.error("Failed to load topics:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const existing_topic_ids = topics
        .filter((t) => t.type === "existing")
        .map((t) => t.id);

      const new_topics = topics
        .filter((t) => t.type === "new")
        .map((t) => ({ name: t.name, color_hex: t.color_hex }));
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
          times: times,
          existing_topic_ids: existing_topic_ids,
          new_topics: new_topics,
        }),
      });

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
      <TimeInput times={times} setTimes={setTimes} />
      <TopicInput
        availableTopics={availableTopics}
        topics={topics}
        setTopics={setTopics}
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
