import { useState } from "react";

import { TimeInput } from "@/components/time_input";
import TimeTag, { DayTag } from "@/components/time_tag";
import { TopicInput } from "@/components/topic_input";
import TopicTag from "@/components/topic_tag";

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
    <div className="task flex h-fit w-full max-w-96 flex-col rounded-lg bg-slate-400 p-3 text-slate-300">
      <div className="task-title-container mb-3 flex w-full flex-row items-center justify-start text-slate-200 hover:text-slate-100">
        {/* Task Name and Completion */}
        <input
          className="task-completion mr-3 accent-slate-300"
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle?.(item.id)}
        />
        {isEditing ? (
          <input
            className="task-title-edit rounded border-2 bg-slate-500 p-1 text-slate-300"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
        ) : (
          <span
            className={
              "task-title text-3xl font-bold" +
              (item.completed ? " line-through" : "")
            }
          >
            {item.name}
          </span>
        )}
      </div>
      <div className="task-times-container">
        {/* Task Times */}
        <div className="flex flex-col items-start text-slate-300">
          {isEditing ? (
            <TimeInput times={draftTimes} setTimes={setDraftTimes} />
          ) : item.times?.length > 0 ? (
            item.times.map((time) => (
              <div key={time.id} className="flex flex-row gap-3">
                <DayTag day={formatDay(time.day)} />
                <TimeTag
                  start_time={time.start_time}
                  end_time={time.end_time}
                />
              </div>
            ))
          ) : (
            "No time set"
          )}
        </div>
      </div>

      {/* Task Topics */}
      <div className="task-topic-tags mt-2 flex flex-row flex-wrap gap-1 text-slate-200">
        {isEditing ? (
          <TopicInput
            availableTopics={availableTopics}
            topics={draftTopics}
            setTopics={setDraftTopics}
          />
        ) : item.topics.length > 0 ? (
          item.topics.map((topic) => (
            <TopicTag
              key={topic.id}
              name={topic.name}
              color_hex={topic.color_hex}
            />
          ))
        ) : (
          "No topics"
        )}
      </div>

      {/* Task Description */}
      <div className="task-description mt-2 text-justify text-slate-300 hover:text-slate-100">
        {isEditing ? (
          <textarea
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
            className="mt-2 w-full rounded border-2 bg-slate-600 p-1 text-slate-200"
          />
        ) : item.description ? (
          <span className="block">{item.description}</span>
        ) : (
          <span className="block italic">No description.</span>
        )}
      </div>

      <div className="task-edit mt-2 flex gap-2">
        {isEditing ? (
          <>
            <button
              className="text-slate-300 hover:text-slate-100"
              onClick={saveEdit}
              disabled={saving}
            >
              Save
            </button>
            <button
              className="text-slate-300 hover:text-slate-100"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="text-slate-300 hover:text-slate-100"
            onClick={startEdit}
          >
            Edit
          </button>
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
