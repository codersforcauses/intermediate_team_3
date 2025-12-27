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
    </div>
  );
}
