import { Retronym, retronyms } from "@/lib/retronyms"
import { FC } from "react"

export type PlateTone = "paper" | "ink" | "cobalt"

/** 登録順の通し番号。JSONの記載順を登録順とみなす。 */
export const entryNumber = (retronym: Retronym): number =>
  retronyms.indexOf(retronym) + 1

/** 図版の代わりに「元の名称 → レトロニム」を活字で見せる。 */
export const Plate: FC<{
  retronym: Retronym
  tone?: PlateTone
  compact?: boolean
}> = ({ retronym, tone = "paper", compact = false }) => (
  <div className={`plate plate--${tone}`} aria-hidden>
    {!compact && (
      <span className="plate__no">
        NO.{String(entryNumber(retronym)).padStart(3, "0")}
      </span>
    )}
    {!compact && <span className="plate__old">{retronym.originalName}</span>}
    <span className="plate__new">
      {compact ? retronym.name.slice(0, 2) : retronym.name}
    </span>
  </div>
)
