interface TimeTagProps {
  start_time: string;
  end_time: string;
}

function TimeTag({ start_time, end_time }: TimeTagProps) {
  return (
    <div className="flex h-fit w-fit flex-row items-center justify-center overflow-hidden rounded p-1">
      <div className="aspect-1/1 mr-1 h-5 w-5 rounded-[50] bg-slate-200"></div>
      <p>{start_time.substring(0, 5) + "-" + end_time.substring(0, 5)}</p>
    </div>
  );
}

export default TimeTag;
