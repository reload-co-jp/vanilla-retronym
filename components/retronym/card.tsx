import { StatusBadge } from "@/components/retronym/status-badge"
import { Tag, TagList } from "@/components/retronym/tag"
import { Retronym } from "@/lib/retronyms"
import { theme } from "@/lib/theme"
import Link from "next/link"
import { FC } from "react"

export const RetronymCard: FC<{ retronym: Retronym }> = ({ retronym }) => (
  <article
    style={{
      backgroundColor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: ".125rem",
      padding: "1.125rem 1.25rem",
    }}
  >
    <div
      style={{
        alignItems: "baseline",
        display: "flex",
        flexWrap: "wrap",
        gap: ".5rem",
      }}
    >
      <h3 style={{ fontSize: "1.125rem", margin: 0 }}>
        <Link
          href={`/retronyms/${retronym.id}/`}
          style={{ textDecoration: "none" }}
        >
          {retronym.name}
        </Link>
      </h3>
      <StatusBadge status={retronym.status} />
    </div>
    <p
      style={{
        color: theme.muted,
        fontSize: ".8125rem",
        margin: ".25rem 0 .5rem",
      }}
    >
      {retronym.originalName} → {retronym.name}（{retronym.trigger}の登場）
    </p>
    <TagList>
      {retronym.tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </TagList>
  </article>
)

export const RetronymCardList: FC<{ retronyms: Retronym[] }> = ({
  retronyms,
}) => (
  <div style={{ display: "grid", gap: ".75rem" }}>
    {retronyms.map((retronym) => (
      <RetronymCard key={retronym.id} retronym={retronym} />
    ))}
  </div>
)
