import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

interface Time {
  id: number;
  day: number;
  start_time: string;
  end_time: string;
  repeating: boolean;
}

interface TimeInputProps {
  times: Time[];
  setTimes: (times: Time[]) => void;
}

const daysOfWeek = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 7 },
];

export function TimeInput({ times, setTimes }: TimeInputProps) {
  const addTime = () => {
    // Add a new empty draft time only if there isn't already an empty one
    const hasEmpty = times.some((t) => !t.start_time || !t.end_time);
    if (!hasEmpty) {
      setTimes([
        ...times,
        { id: 0, day: 1, start_time: "", end_time: "", repeating: false },
      ]);
    }
  };

  const updateTime = (
    index: number,
    field: keyof Time,
    value: string | number | boolean,
  ) => {
    const newTimes = [...times];
    newTimes[index] = { ...newTimes[index], [field]: value };
    setTimes(newTimes);
  };

  const removeTime = (index: number) => {
    setTimes(times.filter((_, i) => i !== index));
  };

  return (
    <div className="text-md flex w-full flex-col items-center justify-center gap-2">
      <h1 className="time-input-title text-xl hover:brightness-110">Times</h1>
      {times.map((time, index) => (
        <div
          key={index}
          className="time-input-wrapper flex w-full flex-row items-center justify-evenly gap-1 rounded-lg bg-indigo-600 p-1 brightness-90 hover:brightness-95"
        >
          <div className="day-select-wrapper flex w-[20%] flex-row items-center justify-center gap-1">
            <FaRegCalendarAlt />
            <select
              className="day-select h-full rounded-lg bg-indigo-600 p-1 text-center hover:brightness-110"
              value={time.day}
              onChange={(e) =>
                updateTime(index, "day", parseInt(e.target.value))
              }
            >
              {daysOfWeek.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
          <div className="time-select-wrapper flex w-[35%] flex-row items-center justify-center gap-1">
            <FaRegClock />
            <div className="time-inputs-wrapper text-md flex flex-col">
              <input
                className="time-input h-full rounded-lg bg-indigo-600 hover:brightness-110"
                type="time"
                value={time.start_time}
                onChange={(e) =>
                  updateTime(index, "start_time", e.target.value)
                }
              />
              <input
                className="time-input h-full rounded-lg bg-indigo-600 hover:brightness-110"
                type="time"
                value={time.end_time}
                onChange={(e) => updateTime(index, "end_time", e.target.value)}
              />
            </div>
          </div>
          <div className="repeat-input-wrapper flex w-[25%] flex-row gap-2 rounded-lg bg-indigo-600 p-1 hover:brightness-110">
            <span>Repeats?</span>
            <input
              className="repeat-input"
              type="checkbox"
              checked={time.repeating}
              onChange={(e) => updateTime(index, "repeating", e.target.checked)}
            />
          </div>

          <button
            className="time-delete"
            type="button"
            onClick={() => removeTime(index)}
          >
            <FaRegTrashCan className="hover:text-red-500" />
          </button>
        </div>
      ))}
      <button
        className="add-time-button w-12 rounded-full bg-indigo-600 text-xl hover:brightness-110"
        type="button"
        onClick={addTime}
      >
        +
      </button>
    </div>
  );
}
