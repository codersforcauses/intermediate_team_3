import { ReactElement } from "react";

import TimeIndicator, {
  resizeAndPositionTimeIndicator,
} from "@/components/time_indicator";
import {
  TimetableDayColumn,
  TimetableTimeColumn,
} from "@/components/timetable_column";
import { resizeAndPositionTimetableTasks } from "@/components/timetable_task";

export function getVisibleTimetableRect() {
  const time_header = document.getElementById("Header");
  if (time_header == null) return;
  const time_header_rect = time_header.getBoundingClientRect();

  const timetable_barrier = document.getElementById("timetable-barrier");
  if (timetable_barrier == null) return;
  const timetable_barrier_rect = timetable_barrier.getBoundingClientRect();

  const rect = {
    left: time_header_rect.right,
    right: timetable_barrier_rect.left + timetable_barrier.clientWidth,
    top: time_header_rect.bottom,
    bottom: timetable_barrier_rect.top + timetable_barrier.clientHeight,
    width: 0,
    height: 0,
  };
  rect.width = rect.right - rect.left;
  rect.height = rect.bottom - rect.top;

  return rect;
}

interface TimetableProps {
  children: ReactElement[];
}

function Timetable({ children }: TimetableProps) {
  return (
    <div
      id="timetable-border"
      className="h-full w-full rounded-lg bg-slate-900 p-3"
    >
      <div
        id="timetable-barrier"
        className="h-full w-full overflow-auto"
        onScroll={() => {
          resizeAndPositionTimetableTasks();
          resizeAndPositionTimeIndicator();
        }}
      >
        <div id="timetable" className="timetable flex h-full w-full flex-row">
          <TimetableTimeColumn />
          <TimetableDayColumn day="Monday" label="Monday" />
          <TimetableDayColumn day="Tuesday" label="Tuesday" />
          <TimetableDayColumn day="Wednesday" label="Wednesday" />
          <TimetableDayColumn day="Thursday" label="Thursday" />
          <TimetableDayColumn day="Friday" label="Friday" />
          <TimetableDayColumn day="Saturday" label="Saturday" />
          <TimetableDayColumn day="Sunday" label="Sunday" />
          <TimeIndicator />
          <div
            id="timetable-tasks"
            className="timetable-task absolute left-0 top-0"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timetable;
