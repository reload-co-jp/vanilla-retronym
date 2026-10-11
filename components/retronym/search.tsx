"use client"

import { RetronymCardList } from "@/components/retronym/card"
import { TagList, TagToggle } from "@/components/retronym/tag"
import {
  filterRetronyms,
  getLanguages,
  getTags,
  languageLabel,
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
  const [language, setLanguage] = useState<string | null>(null)
  const [order, setOrder] = useState<SortOrder>("name")

  const tagParam = useSearchParams().get("tag")
  const selectedTags = useMemo(
    () => pickedTags ?? (tagParam ? [tagParam] : []),
    [pickedTags, tagParam]
  )

  const tags = useMemo(() => getTags(retronyms), [retronyms])
  const languages = useMemo(() => getLanguages(retronyms), [retronyms])

  const results = useMemo(
    () =>
      sortRetronyms(
        filterRetronyms(retronyms, { query, tags: selectedTags, language }),
        order
      ),
    [retronyms, query, selectedTags, language, order]
  )

  const toggleTag = (tag: string) =>
    setPickedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter((selected) => selected !== tag)
        : [...selectedTags, tag]
    )

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div
        style={{
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          display: "grid",
          gap: "1rem",
          padding: "clamp(1rem, 3vw, 1.75rem)",
        }}
      >
        <label style={{ display: "grid", gap: ".375rem" }}>
          <span className="en-label" style={{ color: theme.muted }}>
            Search — レトロニムを検索
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="名前・元の名称・きっかけ・説明・タグ"
            style={{
              backgroundColor: "transparent",
              border: "none",
              borderBottom: `2px solid ${theme.text}`,
              borderRadius: 0,
              fontFamily: "var(--serif-ja)",
              fontSize: "1.375rem",
              padding: ".375rem 0",
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

        <div style={{ display: "grid", gap: ".35rem" }}>
          <span style={{ fontSize: ".8125rem", color: theme.muted }}>
            言語で絞り込む
          </span>
          <TagList>
            <TagToggle
              selected={language === null}
              onClick={() => setLanguage(null)}
            >
              すべて
            </TagToggle>
            {languages.map(({ language: code, count }) => (
              <TagToggle
                key={code}
                selected={language === code}
                onClick={() => setLanguage(language === code ? null : code)}
              >
                {languageLabel(code)} {count}
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
        {(selectedTags.length > 0 || language !== null) &&
          `（${[
            ...(language !== null ? [languageLabel(language)] : []),
            ...selectedTags,
          ].join(" / ")}）`}
        {(query !== "" || selectedTags.length > 0 || language !== null) && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setPickedTags([])
              setLanguage(null)
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
