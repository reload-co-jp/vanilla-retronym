import {
  getModifier,
  getModifierGroups,
  getModifiers,
  getSuffixModifiers,
} from "@/lib/modifiers"
import { Retronym } from "@/lib/retronyms"
import { describe, expect, it } from "vitest"

const make = (
  id: string,
  name: string,
  originalName: string,
  modifier?: string
): Retronym => ({
  id,
  name,
  originalName,
  modifier,
  trigger: "",
  description: "",
  tags: [],
  language: "ja",
  status: "confirmed",
})

describe("getModifier", () => {
  it("name の前に付け足された言葉を抜き出す", () => {
    expect(getModifier(make("a", "固定電話", "電話"))).toEqual({
      label: "固定",
      position: "prefix",
    })
  })

  it("大文字小文字を区別せず、空白を除く", () => {
    expect(getModifier(make("a", "Hard cider", "Cider"))?.label).toBe("Hard")
  })

  it("originalName の括弧書きを無視する", () => {
    expect(
      getModifier(make("a", "第一次世界大戦", "世界大戦（大戦）"))?.label
    ).toBe("第一次")
  })

  it("後ろに付け足された言葉を抜き出す", () => {
    expect(getModifier(make("a", "Chocolat chaud", "Chocolat"))).toEqual({
      label: "chaud",
      position: "suffix",
    })
  })

  it("modifier の指定を優先する", () => {
    expect(getModifier(make("a", "実店舗", "店", "実"))?.label).toBe("実")
  })

  it("抜き出せないときは undefined を返す", () => {
    expect(getModifier(make("a", "実写", "映画"))).toBeUndefined()
  })
})

describe("getModifierGroups", () => {
  const items = [
    make("a", "天然ゴム", "ゴム"),
    make("b", "天然水", "水"),
    make("c", "謎の石", "石"),
    make("d", "Pavo real", "Pavo"),
  ]

  it("同じ言葉をまとめる", () => {
    expect(getModifiers(items)[0]).toMatchObject({ label: "天然" })
    expect(getModifiers(items)[0].retronyms).toHaveLength(2)
  })

  it("対応表にない言葉は「その他」に入る", () => {
    const other = getModifierGroups(items).find((g) => g.heading === "その他")
    expect(other?.modifiers.map((m) => m.label)).toEqual(["謎の"])
  })

  it("後ろに付く言葉はグループに含めない", () => {
    const labels = getModifierGroups(items).flatMap((g) =>
      g.modifiers.map((m) => m.label)
    )
    expect(labels).not.toContain("real")
    expect(getSuffixModifiers(items).map((m) => m.label)).toEqual(["real"])
  })
})
