interface TopicTagProps {
  name: string;
  color_hex: number;
}

function numberToHexCode(color_hex: number) {
  let hex = color_hex.toString(16);
  for (let i = 0; i < 5; i++) {
    if (hex.length == 6) break;
    hex = "0" + hex;
  }
  return "#" + hex;
}

function TopicTag({ name, color_hex }: TopicTagProps) {
  const bg_color = " bg-[" + numberToHexCode(color_hex) + "]";
  return (
    <div className="mr-1 flex w-fit flex-row items-center overflow-hidden rounded p-1">
      <div
        className={"aspect-1/1 mr-1 min-h-4 min-w-4 rounded" + bg_color}
      ></div>
      <p className="truncate">{name}</p>
    </div>
  );
}

export default TopicTag;
