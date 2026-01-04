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

type ItemProps = {
  item: Item;
  onToggle?: (id: number) => void;
  onUpdate: (item: Item) => void;
};

export function TaskItem({ item, onToggle, onUpdate }: ItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(item.name);
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setDraftName(item.name);
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setDraftName(item.name);
  }

  async function saveEdit() {
    setSaving(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/planner/tasks/${item.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: draftName,
            description: item.description,
            completed: item.completed,
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

  return (
    <label className="m-1 flex w-96 flex-col rounded-md border-2 border-zinc-200 bg-zinc-700 p-2">
      <div className="flex items-center justify-between">
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
        <div className="flex flex-col items-end text-sm text-zinc-300">
          {item.times?.length > 0
            ? item.times.map((t) => (
                <span key={t.id}>
                  {formatDay(t.day)} {t.start_time.slice(0, 5)} -{" "}
                  {t.end_time.slice(0, 5)}
                </span>
              ))
            : "No time set"}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 text-sm text-zinc-300">
        {item.topics?.length > 0
          ? item.topics.map((topic) => (
              <span
                key={topic.id}
                className="flex items-center gap-1 rounded-lg border-2 border-zinc-500 px-2 py-0.5 text-zinc-100"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: `#${topic.color_hex.toString(16).padStart(6, "0")}`,
                  }}
                />
                {topic.name}
              </span>
            ))
          : "No topics"}
      </div>
      <div>
        {item.description ? (
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
    </label>
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
