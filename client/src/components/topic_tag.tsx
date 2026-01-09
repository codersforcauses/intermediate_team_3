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

function getHexColorValues(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  return { r: r, g: g, b: b };
}

function modifyBrightness(hex: string, brightness: number): string {
  const { r, g, b } = getHexColorValues(hex);

  const brightness_modifier = Math.floor((256 * (brightness - 100)) / 100);

  const new_r = Math.min(255, Math.max(0, r + brightness_modifier));
  const new_g = Math.min(255, Math.max(0, g + brightness_modifier));
  const new_b = Math.min(255, Math.max(0, b + brightness_modifier));

  const r_str = new_r.toString(16).padStart(2, "0");
  const g_str = new_g.toString(16).padStart(2, "0");
  const b_str = new_b.toString(16).padStart(2, "0");

  return "#" + r_str + g_str + b_str;
}

export function TopicTagAlt({ name, color_hex }: TopicTagProps) {
  const color_hex_code = "#" + color_hex.toString(16).padStart(6, "0");

  const foreground_hex_code = modifyBrightness(color_hex_code, 125);
  const background_hex_code = modifyBrightness(color_hex_code, 60);

  return (
    <div
      className="topic-tag flex w-fit flex-row items-center overflow-hidden rounded-full border px-2 py-1 text-sm hover:brightness-110"
      style={{
        borderColor: foreground_hex_code,
        color: foreground_hex_code,
        backgroundColor: background_hex_code,
      }}
    >
      <p className="topic-tag-text truncate">{name}</p>
    </div>
  );
}
