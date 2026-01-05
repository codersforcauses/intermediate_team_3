interface TimetableSlotProps {
  label?: string;
  header?: boolean;
  time_label?: boolean;
  time: string;
  highlight?: boolean;
}

function TimetableSlot({
  label,
  header,
  time_label,
  time,
  highlight,
}: TimetableSlotProps) {
  let class_name =
    "timetable-slot w-full h-full min-h-16 \
    flex justify-center items-center border-solid ";

  if (header === true) {
    class_name +=
      " timetable-header bg-slate-800 sticky top-0 z-10 \
        border-b-2 border-b-slate-900";
  } else {
    const bg_color = highlight === true ? " bg-slate-500" : " bg-slate-600";
    class_name +=
      bg_color +
      " border-t border-b \
    border-t-slate-400 border-b-slate-400";
  }

  if (header !== true && time_label !== true) {
    class_name += " hover:bg-slate-500";
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
