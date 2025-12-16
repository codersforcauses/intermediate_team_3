import { ReactElement } from "react";

interface TimetableSlotProps {
  label?: string;
  header?: boolean;
  time_label?: boolean;
  time: string;
}

interface TimetableColumnProps {
  children?: ReactElement[];
  sticky?: boolean;
  label: string;
  day: string;
}

function TimetableSlot({
  label,
  header,
  time_label,
  time,
}: TimetableSlotProps) {
  let class_name =
    "timetable-slot w-full h-full min-h-16 \
    flex justify-center items-center";

  if (header === true) {
    class_name = class_name + " bg-slate-800 sticky top-0 z-10";
  } else {
    class_name =
      class_name +
      " bg-slate-600 \
        border-solid border-t border-b border-t-slate-400 border-b-slate-400";
  }

  if (header !== true && time_label !== true) {
    class_name = class_name + " hover:bg-slate-500";
  }

  return (
    <div className={class_name} time={time}>
      <p className="text-xl font-semibold text-slate-400">{label}</p>
    </div>
  );
}

function TimetableColumn({ children, day, sticky }: TimetableColumnProps) {
  let class_name =
    "timetable-column w-full min-w-48 h-full \
    flex flex-col bg-slate-500 border-r-4 border-slate-900";

  if (sticky === true) {
    class_name = class_name + " sticky left-0 z-10";
  } else {
    class_name = class_name + " z-0";
  }

  return (
    <div className={class_name} day={day}>
      {children}
    </div>
  );
}

function TimetableDayColumn({ label, day }: TimetableColumnProps) {
  return (
    <TimetableColumn day={day} label={label}>
      <TimetableSlot time="" label={label} header={true} />
      <TimetableSlot time="00:00:00" />
      <TimetableSlot time="01:00:00" />
      <TimetableSlot time="02:00:00" />
      <TimetableSlot time="03:00:00" />
      <TimetableSlot time="04:00:00" />
      <TimetableSlot time="05:00:00" />
      <TimetableSlot time="06:00:00" />
      <TimetableSlot time="07:00:00" />
      <TimetableSlot time="08:00:00" />
      <TimetableSlot time="09:00:00" />
      <TimetableSlot time="10:00:00" />
      <TimetableSlot time="11:00:00" />
      <TimetableSlot time="12:00:00" />
      <TimetableSlot time="13:00:00" />
      <TimetableSlot time="14:00:00" />
      <TimetableSlot time="15:00:00" />
      <TimetableSlot time="16:00:00" />
      <TimetableSlot time="17:00:00" />
      <TimetableSlot time="18:00:00" />
      <TimetableSlot time="19:00:00" />
      <TimetableSlot time="20:00:00" />
      <TimetableSlot time="21:00:00" />
      <TimetableSlot time="22:00:00" />
      <TimetableSlot time="23:00:00" />
    </TimetableColumn>
  );
}

function TimetableTimeColumn() {
  return (
    <TimetableColumn day="" label="Time" sticky={true}>
      <TimetableSlot time="" label="Time" header={true} time_label={true} />
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
    </TimetableColumn>
  );
}

export default function Timetable() {
  return (
    <div className="timetable-border h-full w-full rounded-lg bg-slate-900 p-3">
      <div className="timetable-barrier h-full w-full overflow-auto">
        <div id="timetable" className="timetable flex h-full w-full flex-row">
          <TimetableTimeColumn />
          <TimetableDayColumn day="Monday" label="Monday" />
          <TimetableDayColumn day="Tuesday" label="Tuesday" />
          <TimetableDayColumn day="Wednesday" label="Wednesday" />
          <TimetableDayColumn day="Thursday" label="Thursday" />
          <TimetableDayColumn day="Friday" label="Friday" />
          <TimetableDayColumn day="Saturday" label="Saturday" />
          <TimetableDayColumn day="Sunday" label="Sunday" />
        </div>
      </div>
    </div>
  );
}
