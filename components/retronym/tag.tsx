import { theme } from "@/lib/theme"
import { ComponentProps, FC } from "react"

const baseStyle = {
  backgroundColor: theme.tag,
  border: `1px solid ${theme.border}`,
  borderRadius: ".125rem",
  color: theme.muted,
  display: "inline-block",
  fontSize: ".75rem",
  letterSpacing: ".01em",
  lineHeight: 1.6,
  padding: ".05rem .6rem",
  textDecoration: "none",
} as const

export const Tag: FC<ComponentProps<"span"> & { selected?: boolean }> = ({
  style,
  selected = false,
  children,
  ...props
}) => (
  <span
    style={{
      ...baseStyle,
      ...(selected
        ? {
            backgroundColor: theme.accentSoft,
            borderColor: theme.accent,
            color: theme.accent,
          }
        : {}),
      ...style,
    }}
    {...props}
  >
    {children}
  </span>
)

export const TagList: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
    {children}
  </div>
)
