interface Topic {
  id: number;
  name: string;
  color_hex: number;
}

type TopicSelection =
  | { type: "existing"; id: number }
  | { type: "new"; name: string; color_hex: number };

interface TopicInputProps {
  availableTopics: Topic[];
  topics: TopicSelection[];
  setTopics: React.Dispatch<React.SetStateAction<TopicSelection[]>>;
}

export function TopicInput({
  availableTopics,
  topics,
  setTopics,
}: TopicInputProps) {
  return (
    <div className="mb-4">
      {/* Existing Topic Selection */}
      <select
        className="w-full rounded border-2 bg-zinc-700 p-2 text-zinc-200"
        onChange={(e) => {
          const id = Number(e.target.value);
          if (!id) return;
          if (!topics.some((t) => t.type === "existing" && t.id === id)) {
            setTopics([...topics, { type: "existing", id }]);
          }
          e.target.value = "";
        }}
      >
        <option value="">Select Existing Topic</option>
        {availableTopics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.name}
          </option>
        ))}
      </select>

      {/* Selected Topics Display */}
      {topics.map((topic, index) => {
        if (topic.type === "existing") {
          const topicData = availableTopics.find((t) => t.id === topic.id);
          if (!topicData) return null;
          return (
            <div
              key={index}
              className="mt-2 flex items-center justify-between rounded bg-zinc-600 p-2 text-zinc-200"
            >
              <span>{topicData.name}</span>
              <button
                type="button"
                onClick={() => setTopics(topics.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          );
        }

        return (
          <div key={index} className="mt-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="New Topic Name"
              value={topic.name}
              onChange={(e) => {
                const newTopics = [...topics];
                newTopics[index] = { ...topic, name: e.target.value };
                setTopics(newTopics);
              }}
            />
            <input
              type="color"
              value={`#${topic.color_hex.toString(16).padStart(6, "0")}`}
              onChange={(e) => {
                const hex = parseInt(e.target.value.replace("#", ""), 16);
                const copy = [...topics];
                copy[index] = { ...topic, color_hex: hex };
                setTopics(copy);
              }}
            />
            <button
              type="button"
              onClick={() => setTopics(topics.filter((_, i) => i !== index))}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        );
      })}

      <button
        type="button"
        className="mt-3 rounded bg-green-700 px-2 py-1 text-zinc-200"
        onClick={() =>
          setTopics([...topics, { type: "new", name: "", color_hex: 0xffffff }])
        }
      >
        + Create New Topic
      </button>
    </div>
  );
}
