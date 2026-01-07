import TimetableSlot from "./timetable_slot";

/*
@prop children: ReactElements to render within the column
@prop sticky: Boolean describing if the column should be sticky (used for the
leftmost column containing the labels). Also gives left-0 positioning if true.
@prop day: String to display within the header, also sets id to this value.
*/
interface TimetableColumnProps {
  day: string;
}

/*
A column of the timetable containing 25 TimetableSlots (header + one each hour).
*/
export default function TimetableColumn({ day }: TimetableColumnProps) {
  const now = new Date(Date.now());
  enum DateDay {
    Monday = 1,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
  }
  const current_day = DateDay[now.getDay()];
  const is_current_day = day === current_day;

  return (
    <div
      id={day}
      className="timetable-column flex h-full w-full min-w-32 flex-col bg-slate-500 md:min-w-48"
    >
      <TimetableSlot
        time={day.toLowerCase() + "-header"}
        label={day}
        header={true}
      />
      <TimetableSlot time="00:00:00" highlight={is_current_day} />
      <TimetableSlot time="01:00:00" highlight={is_current_day} />
      <TimetableSlot time="02:00:00" highlight={is_current_day} />
      <TimetableSlot time="03:00:00" highlight={is_current_day} />
      <TimetableSlot time="04:00:00" highlight={is_current_day} />
      <TimetableSlot time="05:00:00" highlight={is_current_day} />
      <TimetableSlot time="06:00:00" highlight={is_current_day} />
      <TimetableSlot time="07:00:00" highlight={is_current_day} />
      <TimetableSlot time="08:00:00" highlight={is_current_day} />
      <TimetableSlot time="09:00:00" highlight={is_current_day} />
      <TimetableSlot time="10:00:00" highlight={is_current_day} />
      <TimetableSlot time="11:00:00" highlight={is_current_day} />
      <TimetableSlot time="12:00:00" highlight={is_current_day} />
      <TimetableSlot time="13:00:00" highlight={is_current_day} />
      <TimetableSlot time="14:00:00" highlight={is_current_day} />
      <TimetableSlot time="15:00:00" highlight={is_current_day} />
      <TimetableSlot time="16:00:00" highlight={is_current_day} />
      <TimetableSlot time="17:00:00" highlight={is_current_day} />
      <TimetableSlot time="18:00:00" highlight={is_current_day} />
      <TimetableSlot time="19:00:00" highlight={is_current_day} />
      <TimetableSlot time="20:00:00" highlight={is_current_day} />
      <TimetableSlot time="21:00:00" highlight={is_current_day} />
      <TimetableSlot time="22:00:00" highlight={is_current_day} />
      <TimetableSlot time="23:00:00" highlight={is_current_day} />
    </div>
  );
}

/*
A TimetableColumn for the time labels. Header has text "Time", all other slots
have text "HH:MM" for time time they represent. Each slot has its id set to its
time prop value.
*/
export function TimetableTimeLabelsColumn() {
  return (
    <div
      id="timetable-time-labels"
      className="timetable-column absolute flex flex-col bg-slate-500"
    >
      <TimetableSlot
        time="time-background-header"
        label="Time"
        header={true}
        time_label={true}
      />
      <TimetableSlot time="00:00:00" label="00:00" time_label={true} />
      <TimetableSlot time="01:00:00" label="01:00" time_label={true} />
      <TimetableSlot time="02:00:00" label="02:00" time_label={true} />
      <TimetableSlot time="03:00:00" label="03:00" time_label={true} />
      <TimetableSlot time="04:00:00" label="04:00" time_label={true} />
      <TimetableSlot time="05:00:00" label="05:00" time_label={true} />
      <TimetableSlot time="06:00:00" label="06:00" time_label={true} />
      <TimetableSlot time="07:00:00" label="07:00" time_label={true} />
      <TimetableSlot time="08:00:00" label="08:00" time_label={true} />
      <TimetableSlot time="09:00:00" label="09:00" time_label={true} />
      <TimetableSlot time="10:00:00" label="10:00" time_label={true} />
      <TimetableSlot time="11:00:00" label="11:00" time_label={true} />
      <TimetableSlot time="12:00:00" label="12:00" time_label={true} />
      <TimetableSlot time="13:00:00" label="13:00" time_label={true} />
      <TimetableSlot time="14:00:00" label="14:00" time_label={true} />
      <TimetableSlot time="15:00:00" label="15:00" time_label={true} />
      <TimetableSlot time="16:00:00" label="16:00" time_label={true} />
      <TimetableSlot time="17:00:00" label="17:00" time_label={true} />
      <TimetableSlot time="18:00:00" label="18:00" time_label={true} />
      <TimetableSlot time="19:00:00" label="19:00" time_label={true} />
      <TimetableSlot time="20:00:00" label="20:00" time_label={true} />
      <TimetableSlot time="21:00:00" label="21:00" time_label={true} />
      <TimetableSlot time="22:00:00" label="22:00" time_label={true} />
      <TimetableSlot time="23:00:00" label="23:00" time_label={true} />
    </div>
  );
}
