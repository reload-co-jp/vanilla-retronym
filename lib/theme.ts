// 値は app/reset.css の CSS 変数と揃える
export const theme = {
  background: "#f7f5ef",
  surface: "#fbfaf6",
  border: "#d6d2c7",
  text: "#171717",
  muted: "#5a5750",
  accent: "#2f4f8f",
  accentSoft: "#e6eaf2",
  tag: "#ece8dd",
  maxWidth: "48rem",
} as const

export const statusColors = {
  confirmed: { background: "#e3e9df", color: "#2c4d30" },
  disputed: { background: "#efe6d6", color: "#6e5020" },
  candidate: { background: "#e3e6ec", color: "#38455a" },
} as const
