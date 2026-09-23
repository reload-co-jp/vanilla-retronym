"use client"

import { RetronymCardList } from "@/components/retronym/card"
import { TagList, TagToggle } from "@/components/retronym/tag"
import {
  filterRetronyms,
  getTags,
  Retronym,
  SortOrder,
  sortOrderLabels,
  sortRetronyms,
} from "@/lib/retronyms"
import { theme } from "@/lib/theme"
import { useSearchParams } from "next/navigation"
import { FC, useMemo, useState } from "react"

const sortOrders: SortOrder[] = ["name", "newest"]

export const RetronymSearch: FC<{ retronyms: Retronym[] }> = ({
  retronyms,
}) => {
  const [query, setQuery] = useState("")
  // 未操作のうちは /retronyms/?tag=写真 のようなクエリをタグ選択として引き継ぐ。
  const [pickedTags, setPickedTags] = useState<string[] | null>(null)
  const [order, setOrder] = useState<SortOrder>("name")

  const tagParam = useSearchParams().get("tag")
  const selectedTags = useMemo(
    () => pickedTags ?? (tagParam ? [tagParam] : []),
    [pickedTags, tagParam]
  )

  const tags = useMemo(() => getTags(retronyms), [retronyms])

  const results = useMemo(
    () =>
      sortRetronyms(
        filterRetronyms(retronyms, { query, tags: selectedTags }),
        order
      ),
    [retronyms, query, selectedTags, order]
  )

  const toggleTag = (tag: string) =>
    setPickedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter((selected) => selected !== tag)
        : [...selectedTags, tag]
    )

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <div style={{ display: "grid", gap: ".75rem" }}>
        <label style={{ display: "grid", gap: ".25rem" }}>
          <span style={{ fontSize: ".8125rem", color: theme.muted }}>
            レトロニムを検索
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="名前・元の名称・きっかけ・説明・タグ"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: ".125rem",
              fontSize: "1rem",
              padding: ".55rem .75rem",
              width: "100%",
            }}
          />
        </label>

        <div style={{ display: "grid", gap: ".35rem" }}>
          <span style={{ fontSize: ".8125rem", color: theme.muted }}>
            タグで絞り込む（複数選択でAND検索）
          </span>
          <TagList>
            {tags.map(({ name, count }) => (
              <TagToggle
                key={name}
                selected={selectedTags.includes(name)}
                onClick={() => toggleTag(name)}
              >
                {name} {count}
              </TagToggle>
            ))}
          </TagList>
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: ".5rem",
          }}
        >
          <span style={{ fontSize: ".8125rem", color: theme.muted }}>
            並び順
          </span>
          {sortOrders.map((sortOrder) => (
            <TagToggle
              key={sortOrder}
              selected={order === sortOrder}
              onClick={() => setOrder(sortOrder)}
            >
              {sortOrderLabels[sortOrder]}
            </TagToggle>
          ))}
        </div>
      </div>

      <p style={{ color: theme.muted, fontSize: ".8125rem" }}>
        {results.length}件
        {selectedTags.length > 0 && `（${selectedTags.join(" / ")}）`}
        {(query !== "" || selectedTags.length > 0) && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setPickedTags([])
            }}
            style={{
              background: "none",
              border: "none",
              color: theme.accent,
              cursor: "pointer",
              padding: "0 .5rem",
            }}
          >
            条件をクリア
          </button>
        )}
      </p>

      {results.length > 0 ? (
        <RetronymCardList retronyms={results} />
      ) : (
        <p style={{ color: theme.muted }}>該当するレトロニムがない。</p>
      )}
    </div>
  )
}
