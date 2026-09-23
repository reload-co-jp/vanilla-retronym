import {
  filterRetronyms,
  getRelated,
  getRetronym,
  getTags,
  matchesQuery,
  matchesTags,
  newestRetronyms,
  Retronym,
  retronyms,
  sortRetronyms,
} from "@/lib/retronyms"
import { describe, expect, it } from "vitest"

const sample: Retronym[] = [
  {
    id: "a",
    name: "固定電話",
    originalName: "電話",
    trigger: "携帯電話",
    description: "電話機を区別するための名称。",
    tags: ["通信", "テクノロジー"],
    language: "ja",
    status: "confirmed",
    relatedIds: ["b"],
  },
  {
    id: "b",
    name: "フィルムカメラ",
    originalName: "カメラ",
    trigger: "デジタルカメラ",
    description: "銀塩式のカメラ。",
    tags: ["写真", "アナログ"],
    language: "ja",
    status: "confirmed",
  },
  {
    id: "c",
    name: "アナログレコード",
    originalName: "レコード",
    trigger: "CD",
    description: "溝を刻んだ円盤。",
    tags: ["音楽", "アナログ"],
    language: "ja",
    status: "candidate",
  },
]

describe("data/retronyms.json", () => {
  it("必須フィールドが揃っている", () => {
    for (const retronym of retronyms) {
      expect(retronym.id).toBeTruthy()
      expect(retronym.name).toBeTruthy()
      expect(retronym.originalName).toBeTruthy()
      expect(retronym.trigger).toBeTruthy()
      expect(retronym.description).toBeTruthy()
      expect(retronym.tags.length).toBeGreaterThan(0)
      expect(retronym.language).toBeTruthy()
      expect(["confirmed", "disputed", "candidate"]).toContain(retronym.status)
    }
  })

  it("日本語以外の見出し語には翻訳がある", () => {
    for (const retronym of retronyms) {
      if (retronym.language !== "ja") expect(retronym.translation).toBeTruthy()
    }
  })

  it("idが一意", () => {
    const ids = retronyms.map(({ id }) => id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("relatedIdsが実在するidを指す", () => {
    for (const retronym of retronyms) {
      for (const id of retronym.relatedIds ?? []) {
        expect(getRetronym(id), `${retronym.id} -> ${id}`).toBeDefined()
      }
    }
  })
})

describe("matchesQuery", () => {
  it("空文字はすべて通す", () => {
    expect(matchesQuery(sample[0], "")).toBe(true)
  })

  it("name / originalName / trigger / description / tags を部分一致で検索する", () => {
    expect(matchesQuery(sample[0], "固定")).toBe(true)
    expect(matchesQuery(sample[0], "電話")).toBe(true)
    expect(matchesQuery(sample[0], "携帯")).toBe(true)
    expect(matchesQuery(sample[0], "区別")).toBe(true)
    expect(matchesQuery(sample[0], "通信")).toBe(true)
    expect(matchesQuery(sample[0], "写真")).toBe(false)
  })
})

describe("matchesTags", () => {
  it("複数タグはAND条件", () => {
    expect(matchesTags(sample[1], ["写真", "アナログ"])).toBe(true)
    expect(matchesTags(sample[1], ["写真", "音楽"])).toBe(false)
    expect(matchesTags(sample[1], [])).toBe(true)
  })
})

describe("filterRetronyms", () => {
  it("検索語とタグを同時に適用する", () => {
    const result = filterRetronyms(sample, {
      query: "カメラ",
      tags: ["アナログ"],
    })
    expect(result.map(({ id }) => id)).toEqual(["b"])
  })
})

describe("sortRetronyms", () => {
  it("名前順に並べる", () => {
    expect(sortRetronyms(sample, "name").map(({ name }) => name)).toEqual([
      "アナログレコード",
      "フィルムカメラ",
      "固定電話",
    ])
  })

  it("新しい順は記載順の逆", () => {
    expect(sortRetronyms(sample, "newest").map(({ id }) => id)).toEqual([
      "c",
      "b",
      "a",
    ])
  })

  it("元の配列を変更しない", () => {
    sortRetronyms(sample, "name")
    expect(sample.map(({ id }) => id)).toEqual(["a", "b", "c"])
  })
})

describe("getTags", () => {
  it("出現回数の多い順に集計する", () => {
    expect(getTags(sample)[0]).toEqual({ name: "アナログ", count: 2 })
  })
})

describe("getRelated", () => {
  it("relatedIdsをデータ本体から解決し、存在しないidは除外する", () => {
    const base = retronyms[0]
    const target: Retronym = {
      ...base,
      relatedIds: [retronyms[1].id, "missing"],
    }
    expect(getRelated(target).map(({ id }) => id)).toEqual([retronyms[1].id])
  })
})

describe("newestRetronyms", () => {
  it("末尾から指定件数を返す", () => {
    const result = newestRetronyms(3)
    expect(result).toHaveLength(3)
    expect(result[0].id).toBe(retronyms[retronyms.length - 1].id)
  })
})
