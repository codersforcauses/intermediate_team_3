import { FaRegTrashCan } from "react-icons/fa6";

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
    <div className="topic-input flex w-full flex-col items-center justify-center gap-2 text-slate-200">
      <h1 className="topic-input-title text-xl hover:brightness-110">Topics</h1>
      {/* Selected Topics Display */}
      <div className="topics-container flex w-full flex-col items-center justify-center gap-2">
        {topics.map((topic, index) => {
          if (topic.type === "existing") {
            const topicData = availableTopics.find((t) => t.id === topic.id);
            if (!topicData) return null;
            return (
              <div
                key={index}
                className="flex w-full items-center justify-evenly gap-2 rounded-lg bg-slate-400 p-2 brightness-90 hover:brightness-95"
              >
                <div
                  className="topic-color aspect-square h-5"
                  style={{
                    backgroundColor:
                      "#" + topicData.color_hex.toString(16).padStart(6, "0"),
                  }}
                ></div>
                <span className="topic-name w-full max-w-[75%] text-justify">
                  {topicData.name}
                </span>
                <button
                  className="hover:brightness-90"
                  type="button"
                  onClick={() =>
                    setTopics(topics.filter((_, i) => i !== index))
                  }
                >
                  <FaRegTrashCan className="hover:text-red-500" />
                </button>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="new-topic-input flex w-full flex-row justify-evenly gap-2 rounded-lg bg-slate-400 p-2 brightness-90 hover:brightness-95"
            >
              <input
                className="color-select h-5 w-5 border-0"
                type="color"
                value={`#${topic.color_hex.toString(16).padStart(6, "0")}`}
                onChange={(e) => {
                  const hex = parseInt(e.target.value.replace("#", ""), 16);
                  const copy = [...topics];
                  copy[index] = { ...topic, color_hex: hex };
                  setTopics(copy);
                }}
              />
              <input
                className="topic-name-input w-[75%] bg-slate-400 text-justify placeholder:text-slate-300 hover:brightness-110"
                type="text"
                placeholder="Topic name..."
                value={topic.name}
                onChange={(e) => {
                  const newTopics = [...topics];
                  newTopics[index] = { ...topic, name: e.target.value };
                  setTopics(newTopics);
                }}
              />

              <button
                className="hover:brightness-90"
                type="button"
                onClick={() => setTopics(topics.filter((_, i) => i !== index))}
              >
                <FaRegTrashCan className="hover:text-red-500" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Existing Topic Selection */}
      <select
        className="topic-select w-full rounded-lg bg-slate-400 p-2 text-center brightness-90 hover:brightness-110"
        onChange={(e) => {
          const id = Number(e.target.value);
          if (!id) return;
          if (!topics.some((t) => t.type === "existing" && t.id === id)) {
            setTopics([...topics, { type: "existing", id }]);
          }
          e.target.value = "";
        }}
      >
        <option value="">Add Existing Topic</option>
        {availableTopics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="add-topic-button w-12 rounded-full bg-slate-400 text-xl hover:brightness-110"
        onClick={() =>
          setTopics([...topics, { type: "new", name: "", color_hex: 0xffffff }])
        }
      >
        +
      </button>
    </div>
  );
}
