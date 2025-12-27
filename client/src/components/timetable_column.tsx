import React, { ReactElement } from "react";

import TimetableSlot from "./timetable_slot";

interface TimetableColumnProps {
  children?: ReactElement[];
  sticky?: boolean;
  label: string;
  day: string;
}

export default function TimetableColumn({
  children,
  day,
  sticky,
}: TimetableColumnProps) {
  let class_name =
    "timetable-column w-full min-w-48 h-full \
    flex flex-col bg-slate-500 border-r-4 border-slate-900";

  if (sticky === true) {
    class_name = class_name + " sticky left-0 z-10";
  } else {
    class_name = class_name + " z-0";
  }

  return (
    <div id={day} className={class_name} data-day={day}>
      {children}
    </div>
  );
}

export function TimetableDayColumn({ label, day }: TimetableColumnProps) {
  return (
    <TimetableColumn day={day} label={label}>
      <TimetableSlot time="Header" label={label} header={true} />
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

export function TimetableTimeColumn() {
  return (
    <TimetableColumn day="Time" label="Time" sticky={true}>
      <TimetableSlot
        time="Header"
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
    </TimetableColumn>
  );
}
