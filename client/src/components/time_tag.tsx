interface TimeTagProps {
  start_time: string;
  end_time: string;
}

function TimeTag({ start_time, end_time }: TimeTagProps) {
  return (
    <div
      className={
        "flex h-fit w-fit flex-row items-center justify-center rounded-full text-lg font-medium"
      }
    >
      <div className="placeholder-clock aspect-1/1 h-5 w-5 rounded-[50] bg-slate-200"></div>
      <p className="ml-1">
        {start_time.substring(0, 5) + "-" + end_time.substring(0, 5)}
      </p>
    </div>
  );
}

export default TimeTag;
