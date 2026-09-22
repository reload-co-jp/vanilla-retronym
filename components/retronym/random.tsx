"use client"

import { RetronymCard } from "@/components/retronym/card"
import { Retronym } from "@/lib/retronyms"
import { theme } from "@/lib/theme"
import { FC, useState } from "react"

/** 初期表示はサーバー生成分をそのまま使い、ボタンで引き直す。 */
export const RandomRetronym: FC<{ retronyms: Retronym[]; initial: number }> = ({
  retronyms,
  initial,
}) => {
  const [index, setIndex] = useState(initial)

  const draw = () => {
    if (retronyms.length < 2) return
    let next = index
    while (next === index) {
      next = Math.floor(Math.random() * retronyms.length)
    }
    setIndex(next)
  }

  return (
    <div style={{ display: "grid", gap: ".5rem" }}>
      <RetronymCard retronym={retronyms[index]} />
      <div>
        <button
          type="button"
          onClick={draw}
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.text}`,
            borderRadius: ".125rem",
            cursor: "pointer",
            fontSize: ".8125rem",
            padding: ".4rem .85rem",
          }}
        >
          別のレトロニムを引く
        </button>
      </div>
    </div>
  )
}
