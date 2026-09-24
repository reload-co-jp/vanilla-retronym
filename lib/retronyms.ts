import data from "@/data/retronyms.json"

export type RetronymStatus = "confirmed" | "disputed" | "candidate"

export type Source = {
  title: string
  url: string
}

export type RetronymDetails = {
  /** 単語の意味・語構成 */
  meaning: string
  /** 語源・語構成・初出 */
  etymology?: string
  /** 成立の歴史・経緯・背景 */
  history: string
  /** 用法・使われる場面 */
  usage: string
}

export const detailLabels: Record<keyof RetronymDetails, string> = {
  meaning: "意味",
  etymology: "語源",
  history: "歴史・経緯",
  usage: "用法",
}

export type Retronym = {
  id: string
  name: string
  /** 同じものを指す別名 */
  aliases?: string[]
  /** 日本語以外の見出し語の日本語訳 */
  translation?: string
  originalName: string
  /** 付け足された言葉。省略時は name と originalName から抽出する */
  modifier?: string
  trigger: string
  description: string
  details?: RetronymDetails
  tags: string[]
  language: string
  period?: string
  status: RetronymStatus
  relatedIds?: string[]
  sources?: Source[]
}

export const statusLabels: Record<RetronymStatus, string> = {
  confirmed: "確定",
  disputed: "議論あり",
  candidate: "候補",
}

export const statusSymbols: Record<RetronymStatus, string> = {
  confirmed: "◎",
  disputed: "△",
  candidate: "？",
}

export const languageLabels: Record<string, string> = {
  ja: "日本語",
  en: "英語",
  fr: "フランス語",
  de: "ドイツ語",
  es: "スペイン語",
}

export const languageLabel = (language: string): string =>
  languageLabels[language] ?? language

/** JSONの記載順を「登録順」とみなし、後ろにあるものほど新しい。 */
export const retronyms: Retronym[] = data as Retronym[]

export const getRetronym = (id: string): Retronym | undefined =>
  retronyms.find((retronym) => retronym.id === id)

export const getRelated = (retronym: Retronym): Retronym[] =>
  (retronym.relatedIds ?? [])
    .map((id) => getRetronym(id))
    .filter((related): related is Retronym => related !== undefined)

/** 出現回数の多い順にタグを並べる。 */
export const getTags = (
  items: Retronym[] = retronyms
): { name: string; count: number }[] => {
  const counts = new Map<string, number>()
  for (const { tags } of items) {
    for (const tag of tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ja"))
}

/** name / aliases / translation / originalName / trigger / description / tags を部分一致で検索する。 */
export const matchesQuery = (retronym: Retronym, query: string): boolean => {
  const keyword = query.trim().toLowerCase()
  if (keyword === "") return true
  return [
    retronym.name,
    ...(retronym.aliases ?? []),
    retronym.translation ?? "",
    retronym.originalName,
    retronym.trigger,
    retronym.description,
    ...retronym.tags,
  ].some((field) => field.toLowerCase().includes(keyword))
}

/** 選択したタグをすべて持つものだけを残す（AND検索）。 */
export const matchesTags = (retronym: Retronym, tags: string[]): boolean =>
  tags.every((tag) => retronym.tags.includes(tag))

/** 言語の出現回数が多い順に並べる。 */
export const getLanguages = (
  items: Retronym[] = retronyms
): { language: string; count: number }[] => {
  const counts = new Map<string, number>()
  for (const { language } of items) {
    counts.set(language, (counts.get(language) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language))
}

/** 言語が未指定ならすべて残す。 */
export const matchesLanguage = (
  retronym: Retronym,
  language: string | null
): boolean => language === null || retronym.language === language

export const filterRetronyms = (
  items: Retronym[],
  {
    query = "",
    tags = [],
    language = null,
  }: { query?: string; tags?: string[]; language?: string | null }
): Retronym[] =>
  items.filter(
    (retronym) =>
      matchesQuery(retronym, query) &&
      matchesTags(retronym, tags) &&
      matchesLanguage(retronym, language)
  )

export type SortOrder = "name" | "newest"

export const sortOrderLabels: Record<SortOrder, string> = {
  name: "名前順",
  newest: "新しい順",
}

export const sortRetronyms = (
  items: Retronym[],
  order: SortOrder
): Retronym[] => {
  const sorted = [...items]
  switch (order) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "ja"))
    case "newest":
      return sorted.reverse()
  }
}

export const newestRetronyms = (count: number): Retronym[] =>
  [...retronyms].reverse().slice(0, count)
