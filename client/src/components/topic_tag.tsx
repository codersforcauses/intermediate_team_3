interface TopicTagProps {
  name: string;
  color_hex: number;
}

function TopicTag({ name, color_hex }: TopicTagProps) {
  const bg_color = "#" + color_hex.toString(16).padStart(6, "0");

  return (
    <div className="mb-1 flex w-fit flex-row items-center overflow-hidden rounded-full bg-slate-500/50 p-1 pl-2 pr-2 text-sm">
      <div
        className="aspect-1/1 mr-1 min-h-2 min-w-2 rounded-full"
        style={{ backgroundColor: bg_color }}
      >
        {" "}
      </div>
      <p className="truncate">{name}</p>
    </div>
  );
}

export default TopicTag;
