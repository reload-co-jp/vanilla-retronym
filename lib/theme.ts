export const theme = {
  background: "#faf9f5",
  surface: "#ffffff",
  border: "#d9d4c7",
  text: "#1e2530",
  muted: "#5c6270",
  accent: "#7a2e35",
  accentSoft: "#f6ecea",
  tag: "#f1efe6",
  maxWidth: "48rem",
} as const

export const statusColors = {
  confirmed: { background: "#e6ede4", color: "#2f5233" },
  disputed: { background: "#f2e9dc", color: "#7a5a26" },
  candidate: { background: "#e6e9ee", color: "#3d4a5c" },
} as const
