import { getRetronym, Retronym, retronymPath } from "@/lib/retronyms"
import { theme } from "@/lib/theme"
import Link from "next/link"
import { FC } from "react"

/** 存在しない id はビルドを失敗させ、リンク切れを防ぐ。 */
export const pick = (ids: string[]): Retronym[] =>
  ids.map((id) => {
    const retronym = getRetronym(id)
    if (!retronym) throw new Error(`Unknown retronym id: ${id}`)
    return retronym
  })

export const patterns: {
  heading: string
  body: string
  ids: string[]
}[] = [
  {
    heading: "性質を表す言葉を足す",
    body: "最も多い型。新しいものとの違いになる性質（アナログ・固定・有線・紙の など）を前に付けて区別する。",
    ids: ["fixed-phone", "analog-clock", "wired-earphone", "paper-book"],
  },
  {
    heading: "「本来の」「自然の」と言い直す",
    body: "人工物・派生物が登場したことで、元のものを「自然」「生」「対面」などと呼び直す型。",
    ids: ["natural-language", "live-music", "in-person-meeting", "whole-milk"],
  },
  {
    heading: "番号を振る",
    body: "続編や二番目が現れて初めて、最初のものに「第一」「1」が付く型。",
    ids: ["world-war-one", "star-wars-episode-4", "playstation-1", "web-1-0"],
  },
  {
    heading: "後世の視点で名付ける",
    body: "当時の人は別の名前で呼んでいたものに、歴史学などが区別のため後から名前を与えた型。",
    ids: ["byzantine-empire", "old-testament", "traditional-chinese"],
  },
  {
    heading: "新しい言葉に置き換える",
    body: "修飾語を足すのではなく、新旧を対比する別の単語が作られる型。",
    ids: ["feature-phone", "snail-mail", "day-game"],
  },
]

const Flow: FC<{ retronym: Retronym }> = ({ retronym }) => (
  <li>
    <Link
      href={retronymPath(retronym.id)}
      style={{
        alignItems: "center",
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: ".375rem",
        display: "flex",
        flexWrap: "wrap",
        fontSize: ".875rem",
        gap: ".375rem .625rem",
        padding: ".625rem .875rem",
        textDecoration: "none",
      }}
    >
      <span style={{ color: theme.muted }}>{retronym.originalName}</span>
      <span aria-hidden style={{ color: theme.muted }}>
        →
      </span>
      <span
        style={{
          backgroundColor: theme.tag,
          borderRadius: ".25rem",
          fontSize: ".8125rem",
          padding: ".0625rem .5rem",
        }}
      >
        {retronym.trigger} の登場
      </span>
      <span aria-hidden style={{ color: theme.muted }}>
        →
      </span>
      <strong style={{ color: theme.accent }}>{retronym.name}</strong>
    </Link>
  </li>
)

export const FlowList: FC<{ retronyms: Retronym[] }> = ({ retronyms }) => (
  <ul
    style={{
      display: "grid",
      gap: ".5rem",
      listStyle: "none",
      margin: 0,
      padding: 0,
    }}
  >
    {retronyms.map((r) => (
      <Flow key={r.id} retronym={r} />
    ))}
  </ul>
)
