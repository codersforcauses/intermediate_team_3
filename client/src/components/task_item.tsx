import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

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
  onDelete: (id: number) => void;
  availableTopics: Topic[];
};

type TopicSelection =
  | { type: "existing"; id: number }
  | { type: "new"; name: string; color_hex: number };

export function TaskItem({
  item,
  onToggle,
  onUpdate,
  onDelete,
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
    <div className="task flex h-fit w-full max-w-[28rem] flex-col gap-3 rounded-lg bg-slate-400 p-5 text-slate-200 shadow-xl">
      <div className="task-title-container flex w-full flex-row items-center justify-start gap-2 text-3xl font-bold text-slate-100 hover:text-slate-100">
        {/* Task Name and Completion */}
        <input
          className="task-completion mr-3 accent-slate-300"
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle?.(item.id)}
        />
        {isEditing ? (
          <input
            className="task-title-edit w-full rounded-lg bg-slate-400 px-3 py-1 brightness-90 hover:brightness-110"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
        ) : (
          <>
            <span
              className={
                "task-title w-full" + (item.completed ? " line-through" : "")
              }
            >
              {item.name}
            </span>
            <button className="hover:brightness-110" onClick={startEdit}>
              <FaRegEdit className="h-5 w-5" />
            </button>
            <button onClick={() => onDelete(item.id)}>
              <FaRegTrashCan className="h-5 w-5 hover:text-red-600" />
            </button>
          </>
        )}
      </div>

      {/* Task Times */}
      <div className="task-times-container flex flex-col items-start">
        {isEditing ? (
          <TimeInput times={draftTimes} setTimes={setDraftTimes} />
        ) : item.times?.length > 0 ? (
          item.times.map((time) => (
            <div
              key={time.id}
              className="day-time-tags flex w-full flex-row gap-3"
            >
              <DayTag day={formatDay(time.day)} />
              <TimeTag start_time={time.start_time} end_time={time.end_time} />
            </div>
          ))
        ) : (
          "No time set"
        )}
      </div>

      {/* Task Topics */}
      <div className="task-topic-tags flex flex-row flex-wrap gap-1 text-slate-200">
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
      <div
        className="task-description overflow-auto text-justify text-slate-200"
        style={!isEditing ? { maxHeight: "12rem", scrollbarWidth: "thin" } : {}}
      >
        {isEditing ? (
          <div className="task-description-input-container flex flex-col items-center gap-2">
            <h1 className="description-input-title text-xl hover:brightness-110">
              Description
            </h1>
            <textarea
              className="w-full rounded-lg bg-slate-400 p-1 brightness-90 hover:brightness-110"
              value={draftDescription}
              rows={7}
              onChange={(e) => setDraftDescription(e.target.value)}
            />
          </div>
        ) : (
          <span className="block hover:brightness-110">
            {item.description ? item.description : "No Description"}
          </span>
        )}
      </div>

      {/* Edit Button */}

      <div className="task-edit flex gap-2">
        {isEditing ? (
          <div className="flex w-full flex-row justify-center text-lg">
            <button
              className="rounded-full bg-slate-400 px-3 py-1 hover:brightness-110"
              onClick={saveEdit}
              disabled={saving}
            >
              Save
            </button>
            <button
              className="rounded-full bg-slate-400 px-3 py-1 hover:brightness-110"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export function formatDay(day: number): string {
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
