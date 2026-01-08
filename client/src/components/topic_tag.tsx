/*
@prop name: The String to display within the topic tag.
@prop color_hex: The integer representing the hex code of the color to display
within the circle in the tag.
*/
interface TopicTagProps {
  name: string;
  color_hex: number;
}

/* 
A small rounded label containing the topic's name and a circle of the colour
stored in color_hex.
*/
function TopicTag({ name, color_hex }: TopicTagProps) {
  const color_hex_code = "#" + color_hex.toString(16).padStart(6, "0");
  return (
    <div className="topic-tag flex w-fit flex-row items-center overflow-hidden rounded-full bg-slate-500/50 p-1 pl-2 pr-2 text-sm text-slate-300 hover:brightness-110">
      <div
        className="topic-tag-color aspect-1/1 mr-1 min-h-2 min-w-2 rounded-full"
        style={{ backgroundColor: color_hex_code }}
      ></div>
      <p className="topic-tag-text truncate">{name}</p>
    </div>
  );
}

export default TopicTag;
