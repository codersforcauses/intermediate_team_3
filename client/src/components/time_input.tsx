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
    <div>
      {times.map((time, index) => (
        <div key={index}>
          <select
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
          <input
            type="time"
            value={time.start_time}
            onChange={(e) => {
              const newTimes = [...times];
              newTimes[index].start_time = e.target.value;
              setTimes(newTimes);
            }}
          />
          <input
            type="time"
            value={time.end_time}
            onChange={(e) => {
              const newTimes = [...times];
              newTimes[index].end_time = e.target.value;
              setTimes(newTimes);
            }}
          />
          <input
            type="checkbox"
            checked={time.repeating}
            onChange={(e) => {
              const newTimes = [...times];
              newTimes[index].repeating = e.target.checked;
              setTimes(newTimes);
            }}
          />
          <button
            type="button"
            onClick={() => setTimes(times.filter((_, i) => i !== index))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setTimes([
            ...times,
            { id: 0, day: 1, start_time: "", end_time: "", repeating: false },
          ])
        }
      >
        Add Time
      </button>
    </div>
  );
}
