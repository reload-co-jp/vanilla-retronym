import { RetronymStatus, statusLabels, statusSymbols } from "@/lib/retronyms"
import { statusColors } from "@/lib/theme"
import { FC } from "react"

export const StatusBadge: FC<{ status: RetronymStatus }> = ({ status }) => (
  <span
    aria-label={statusLabels[status]}
    title={statusLabels[status]}
    style={{
      ...statusColors[status],
      borderRadius: ".125rem",
      display: "inline-block",
      fontSize: ".6875rem",
      letterSpacing: ".02em",
      lineHeight: 1.6,
      padding: ".05rem .5rem",
    }}
  >
    {statusSymbols[status]}
  </span>
)
