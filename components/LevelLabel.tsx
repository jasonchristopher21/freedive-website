const getColor = (label: string) => {
  label = label.trim();
  label = label.toLowerCase();
  switch (label) {
    case "beginner":
      return "bg-green-500";
    case "intermediate":
      return "bg-orange-500";
    case "advanced":
      return "bg-red-500";
    default:
      return "bg-blue-500";
  }
};

const getSecondaryColor = (label: string) => {
  label = label.trim();
  label = label.toLowerCase();
  switch (label) {
    case "beginner":
      return "bg-green-100 text-green-500";
    case "intermediate":
      return "bg-orange-100 text-orange-500";
    case "advanced":
      return "bg-red-100 text-red-500";
    default:
      return "bg-blue-100 text-blue-500";
  }
}

export default function LevelLabel({ label }: { label: string }) {
  return (
    <div className={`${getSecondaryColor(label)} py-0.25 px-1.5 rounded-[4px] text-[12px] my-auto`}>
      <span className=" font-bold font-heading">
        {label.toUpperCase()}
      </span>
    </div>
  );
}
