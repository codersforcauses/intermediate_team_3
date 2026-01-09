import { getDurationMinutes } from "@/components/timetable";

/*
@prop start_time: string of form HH:MM:SS containing the start time to display
@prop end_time: string of form HH:MM:SS containing the end time to display
@prop display: (optional) string describing what to display in the tag,
defaults to displaying the start and end times, "duration" to display duration,
or "both" to display start and end times with duration in brackets.
*/
interface TimeTagProps {
  start_time: string;
  end_time: string;
  display?: string;
}

/*
A small round tag containing a clock icon and either the start and end times,
the duration, or both, specified by the display prop.
*/
function TimeTag({ start_time, end_time, display }: TimeTagProps) {
  const time_string =
    start_time.substring(0, 5) + "-" + end_time.substring(0, 5);

  const duration_minutes = getDurationMinutes(start_time, end_time);
  const hours = Math.floor(duration_minutes / 60);
  const minutes = duration_minutes % 60;
  const duration_string = hours + "h " + minutes + "m";

  let display_string = time_string; // Default to time string
  if (display != undefined) {
    display = display.toLowerCase();
    if (display == "duration") display_string = duration_string;
    else if (display == "both") display_string += " (" + duration_string + ")";
  }

  return (
    <div
      className={
        "flex h-fit w-fit flex-row items-center justify-center rounded-full text-lg font-medium"
      }
    >
      <div className="placeholder-clock aspect-1/1 h-5 w-5 rounded-[50] bg-slate-200"></div>
      <p className="ml-1">{display_string}</p>
    </div>
  );
}

export default TimeTag;
