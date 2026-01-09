import { FaRegCalendarAlt,FaRegClock } from "react-icons/fa";
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
  return (
    <div className="text-md flex w-full flex-col items-center justify-center gap-2">
      <h1 className="time-input-title text-xl hover:brightness-110">Times</h1>
      {times.map((time, index) => (
        <div
          key={index}
          className="time-input-wrapper flex w-full flex-row items-center justify-evenly gap-1 rounded-lg bg-slate-400 p-1 brightness-90 hover:brightness-95"
        >
          <div className="day-select-wrapper flex w-[20%] flex-row items-center justify-center gap-1">
            <FaRegCalendarAlt />
            <select
              className="day-select h-full rounded-lg bg-slate-400 p-1 text-center hover:brightness-110"
              value={time.day}
              onChange={(e) => {
                const newTimes = [...times];
                newTimes[index].day = parseInt(e.target.value);
                setTimes(newTimes);
              }}
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
                className="time-input h-full rounded-lg bg-slate-400 hover:brightness-110"
                type="time"
                value={time.start_time}
                onChange={(e) => {
                  const newTimes = [...times];
                  newTimes[index].start_time = e.target.value;
                  setTimes(newTimes);
                }}
              />
              <input
                className="time-input h-full rounded-lg bg-slate-400 hover:brightness-110"
                type="time"
                value={time.end_time}
                onChange={(e) => {
                  const newTimes = [...times];
                  newTimes[index].end_time = e.target.value;
                  setTimes(newTimes);
                }}
              />
            </div>
          </div>
          <div className="repeat-input-wrapper flex w-[25%] flex-row gap-2 rounded-lg bg-slate-400 p-1 hover:brightness-110">
            <span>Repeats?</span>
            <input
              className="repeat-input"
              type="checkbox"
              checked={time.repeating}
              onChange={(e) => {
                const newTimes = [...times];
                newTimes[index].repeating = e.target.checked;
                setTimes(newTimes);
              }}
            />
          </div>
          <button
            className="time-delete"
            type="button"
            onClick={() => setTimes(times.filter((_, i) => i !== index))}
          >
            <FaRegTrashCan className="hover:text-red-500" />
          </button>
        </div>
      ))}
      <button
        className="add-time-button w-12 rounded-full bg-slate-400 text-xl hover:brightness-110"
        type="button"
        onClick={() =>
          setTimes([
            ...times,
            { id: 0, day: 1, start_time: "", end_time: "", repeating: false },
          ])
        }
      >
        +
      </button>
    </div>
  );
}
