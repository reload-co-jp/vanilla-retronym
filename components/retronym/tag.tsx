import { tagPath } from "@/lib/retronyms"
import { theme } from "@/lib/theme"
import Link from "next/link"
import { ComponentProps, FC, ReactNode } from "react"

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

/** タグ別ページを開く。 */
export const TagLink: FC<{ tag: string; children?: ReactNode }> = ({
  tag,
  children = tag,
}) => (
  <Link
    href={tagPath(tag)}
    style={{ textDecoration: "none" }}
  >
    <Tag>{children}</Tag>
  </Link>
)

export const TagToggle: FC<{
  selected: boolean
  onClick: () => void
  children: ReactNode
}> = ({ selected, onClick, children }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
    }}
  >
    <Tag selected={selected}>{children}</Tag>
  </button>
)

export const TagList: FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
    {children}
  </div>
)
