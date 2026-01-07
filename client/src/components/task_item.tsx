import { useState } from "react";

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

interface Item {
  id: number;
  name: string;
  completed: boolean;
  description: string;
  times: Time[];
  topics: Topic[];
}

type ItemProps = {
  item: Item;
  onToggle?: (id: number) => void;
  onUpdate: (item: Item) => void;
  availableTopics: Topic[];
};

type TopicSelection =
  | { type: "existing"; id: number }
  | { type: "new"; name: string; color_hex: number };

export function TaskItem({
  item,
  onToggle,
  onUpdate,
  availableTopics,
}: ItemProps) {
  {
    /* Editing Functionality */
  }
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(item.name);
  const [draftDescription, setDraftDescription] = useState(item.description);
  const [draftTopics, setDraftTopics] = useState<TopicSelection[]>([]);
  const [draftTimes, setDraftTimes] = useState<Time[]>([]);
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setDraftName(item.name);
    setDraftDescription(item.description);
    setDraftTopics(
      item.topics.map((t) => ({
        type: "existing",
        id: t.id,
      })),
    );
    setDraftTimes(item.times.map((t) => ({ ...t })));
    setIsEditing(true);
  }

  function cancelEdit() {
    setDraftName(item.name);
    setDraftDescription(item.description);
    setDraftTopics(item.topics.map((t) => ({ type: "existing", id: t.id })));
    setDraftTimes(item.times.map((t) => ({ ...t })));
    setIsEditing(false);
  }

  async function saveEdit() {
    setSaving(true);
    try {
      const existing_topic_ids = draftTopics
        .filter((t) => t.type === "existing")
        .map((t) => t.id);

      const new_topics = draftTopics
        .filter((t) => t.type === "new")
        .map((t) => ({
          name: t.name,
          color_hex: t.color_hex,
        }));

      const response = await fetch(
        `http://localhost:8000/api/planner/tasks/${item.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: draftName,
            description: draftDescription,
            completed: item.completed,
            existing_topic_ids: existing_topic_ids,
            new_topics: new_topics,
            times: draftTimes,
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      const updatedItem = await response.json();
      onUpdate(updatedItem);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setSaving(false);
    }
  }

  {
    /* Item Display */
  }
  return (
    <div className="m-1 flex w-96 flex-col rounded-md border-2 border-zinc-200 bg-zinc-700 p-2">
      <div className="flex items-center justify-between">
        {/* Task Name and Completion */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => onToggle?.(item.id)}
            className="w-xl h-xl accent-zinc-600"
          />
          {isEditing ? (
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="rounded border-2 bg-zinc-600 p-1 text-zinc-200"
            />
          ) : (
            <span
              className={
                item.completed ? "text-zinc-400 line-through" : "text-zinc-300"
              }
            >
              {item.name}
            </span>
          )}
        </div>

        {/* Task Times */}
        <div className="flex flex-col items-end text-sm text-zinc-300">
          {isEditing ? (
            <TimeInput times={draftTimes} setTimes={setDraftTimes} />
          ) : item.times?.length > 0 ? (
            item.times.map((t) => (
              <span key={t.id}>
                {formatDay(t.day)} {t.start_time.slice(0, 5)} -{" "}
                {t.end_time.slice(0, 5)}
              </span>
            ))
          ) : (
            "No time set"
          )}
        </div>
      </div>

      {/* Task Topics */}
      <div className="flex flex-wrap gap-1 text-sm text-zinc-300">
        {isEditing ? (
          <TopicInput
            availableTopics={availableTopics}
            topics={draftTopics}
            setTopics={setDraftTopics}
          />
        ) : item.topics.length > 0 ? (
          item.topics.map((topic) => (
            <span
              key={topic.id}
              className="flex items-center gap-1 rounded-lg border-2 border-zinc-500 px-2 py-0.5 text-zinc-100"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: `#${topic.color_hex
                    .toString(16)
                    .padStart(6, "0")}`,
                }}
              />
              {topic.name}
            </span>
          ))
        ) : (
          "No topics"
        )}
      </div>

      {/* Task Description */}
      <div>
        {isEditing ? (
          <textarea
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
            className="mt-2 w-full rounded border-2 bg-zinc-600 p-1 text-zinc-200"
          />
        ) : item.description ? (
          <span className="mt-2 block text-zinc-300">{item.description}</span>
        ) : (
          <span className="mt-2 block italic text-zinc-500">
            No description.
          </span>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        {isEditing ? (
          <>
            <button onClick={saveEdit} disabled={saving}>
              Save
            </button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <button onClick={startEdit}>Edit</button>
        )}
      </div>
    </div>
  );
}

function formatDay(day: number): string {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days[day - 1] || "Unknown";
}
