type IconName =
  "left" | "right" | "close" | "plus" | "minus" | "fit" | "info" | "external";
const paths: Record<IconName, string> = {
  left: "m14 6-6 6 6 6",
  right: "m10 6 6 6-6 6",
  close: "m6 6 12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  fit: "M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5",
  info: "M12 11v6m0-10v.01",
  external: "M7 17 17 7M7 7h10v10",
};
export default function Icon({ name }: { name: IconName }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
