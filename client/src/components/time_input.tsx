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
    const hasEmpty = times.some(t => !t.start_time || !t.end_time);
    if (!hasEmpty) {
      setTimes([
        ...times,
        { id: 0, day: 1, start_time: "", end_time: "", repeating: false },
      ]);
    }
  };

  const updateTime = (index: number, field: keyof Time, value: any) => {
    const newTimes = [...times];
    newTimes[index] = { ...newTimes[index], [field]: value };
    setTimes(newTimes);
  };

  const removeTime = (index: number) => {
    setTimes(times.filter((_, i) => i !== index));
  };

  return (
    <div>
      {times.map((time, index) => (
        <div key={index}>
          <select
            value={time.day}
            onChange={(e) => updateTime(index, "day", parseInt(e.target.value))}
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
            onChange={(e) => updateTime(index, "start_time", e.target.value)}
          />
          <input
            type="time"
            value={time.end_time}
            onChange={(e) => updateTime(index, "end_time", e.target.value)}
          />
          <input
            type="checkbox"
            checked={time.repeating}
            onChange={(e) => updateTime(index, "repeating", e.target.checked)}
          />
          <button
            type="button"
            onClick={() => removeTime(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addTime}
      >
        Add Time
      </button>
    </div>
  );
}
