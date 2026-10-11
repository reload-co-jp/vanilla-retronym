import { StatusBadge } from "@/components/retronym/status-badge"
import { Tag, TagList } from "@/components/retronym/tag"
import { Retronym, retronymPath } from "@/lib/retronyms"
import Link from "next/link"
import { FC } from "react"

export const RetronymCard: FC<{ retronym: Retronym }> = ({ retronym }) => (
  <article className="linkcard rcard">
    <h3>
      <Link href={retronymPath(retronym.id)}>{retronym.name}</Link>
      <span className="arrow" aria-hidden>
        →
      </span>
    </h3>
    <p className="rcard__from">
      {retronym.translation && <>{retronym.translation}／</>}
      {retronym.originalName} → {retronym.name}（{retronym.trigger}の登場）{" "}
      <StatusBadge status={retronym.status} />
    </p>
    <p className="rcard__desc">{retronym.description}</p>
    <div className="tags">
      <TagList>
        {retronym.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </TagList>
    </div>
  </article>
)

export const RetronymCardList: FC<{ retronyms: Retronym[] }> = ({
  retronyms,
}) => (
  <div className="rgrid">
    {retronyms.map((retronym) => (
      <RetronymCard key={retronym.id} retronym={retronym} />
    ))}
  </div>
)
