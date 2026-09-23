import data from "@/data/retronyms.json"

export type RetronymStatus = "confirmed" | "disputed" | "candidate"

export type Source = {
  title: string
  url: string
}

export type Retronym = {
  id: string
  name: string
  originalName: string
  trigger: string
  description: string
  details?: string[]
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

/** name / originalName / trigger / description / tags を部分一致で検索する。 */
export const matchesQuery = (retronym: Retronym, query: string): boolean => {
  const keyword = query.trim().toLowerCase()
  if (keyword === "") return true
  return [
    retronym.name,
    retronym.originalName,
    retronym.trigger,
    retronym.description,
    ...retronym.tags,
  ].some((field) => field.toLowerCase().includes(keyword))
}

/** 選択したタグをすべて持つものだけを残す（AND検索）。 */
export const matchesTags = (retronym: Retronym, tags: string[]): boolean =>
  tags.every((tag) => retronym.tags.includes(tag))

export const filterRetronyms = (
  items: Retronym[],
  { query = "", tags = [] }: { query?: string; tags?: string[] }
): Retronym[] =>
  items.filter(
    (retronym) => matchesQuery(retronym, query) && matchesTags(retronym, tags)
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
