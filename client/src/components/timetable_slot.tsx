/*
@prop label: Optional string to display within slot.

@prop header: Optional boolean determining if slot is a header or not. If true,
sets positioning to sticky + top-0, darkens background colour, and
sets id to the label + the suffix "-header".

@prop time_label: Optional boolean determining if slot is a time label or not,
sets id to the time prop value.

@prop time: The time the slot represents, currently unused but intended to be
used by drag and drop functionality.

@prop highlight: Optional boolean determining if the slot should be brighter
(used to highlight slots on the current day).
*/
interface TimetableSlotProps {
  label?: string;
  header?: boolean;
  time_label?: boolean;
  time: string;
  highlight?: boolean;
}

/*
A single slot of the timetable (representing 1 hour of 1 day). Must have a time 
in HH:MM:DD format, all other props are optional.
*/
function TimetableSlot({
  label,
  header,
  time_label,
  time,
  highlight,
}: TimetableSlotProps) {
  let class_name =
    "timetable-slot w-full min-h-16 \
    flex justify-center items-center border-solid ";

  if (header === true) {
    class_name +=
      " timetable-header bg-slate-800 border-b-2 border-b-slate-900 ";
  } else {
    const bg_color = highlight === true ? " bg-slate-500" : " bg-slate-600";
    class_name +=
      bg_color + " border-t border-b border-t-slate-400 border-b-slate-400";
  }

  if (header !== true && time_label !== true) {
    class_name += " hover:brightness-125";
  }

  // There's probably a better way to do this
  if (time_label === true)
    return (
      <div id={time} className={class_name} data-time={time}>
        <p className="text-xl font-semibold text-slate-400">{label}</p>
      </div>
    );
  else
    return (
      <div className={class_name} data-time={time}>
        <p className="text-xl font-semibold text-slate-400">{label}</p>
      </div>
    );
}

export default TimetableSlot;

/*
A slightly modified TimetableSlot designed to be displayed in the foreground
with the styling of a TimetableSlot with header=true.
Has id set to its label + "-header" suffix.
*/
export function TimetableHeader({ label }: TimetableSlotProps) {
  return (
    <div
      id={label + "-header"}
      className="timetable-header absolute z-[200] flex min-h-16 min-w-32 select-none items-center justify-center border-b-2 border-b-slate-900 bg-slate-800 text-slate-300"
    >
      <p className="text-xl font-semibold">{label}</p>
    </div>
  );
}
