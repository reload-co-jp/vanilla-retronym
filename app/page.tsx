import { Title } from "@/components/elements/layout"
import { RetronymCardList } from "@/components/retronym/card"
import { RandomRetronym } from "@/components/retronym/random"
import { Tag, TagList } from "@/components/retronym/tag"
import {
  getTags,
  newestRetronyms,
  pseudoRandom,
  retronyms,
} from "@/lib/retronyms"
import { site } from "@/lib/site"
import { theme } from "@/lib/theme"
import Link from "next/link"
import { FC, ReactNode } from "react"

const Section: FC<{ heading: string; children: ReactNode }> = ({
  heading,
  children,
}) => (
  <section style={{ display: "grid", gap: "1rem" }}>
    <h2
      style={{
        borderBottom: `1px solid ${theme.border}`,
        fontSize: "1.0625rem",
        margin: 0,
        paddingBottom: ".5rem",
      }}
    >
      {heading}
    </h2>
    {children}
  </section>
)

const Page: FC = () => {
  const tags = getTags()
  const newest = newestRetronyms(5)
  // ビルド時の初期表示はデータから決まる。以降はボタンで引き直す。
  const initialRandom = Math.floor(
    pseudoRandom(retronyms.length) * retronyms.length
  )

  return (
    <div style={{ display: "grid", gap: "3rem" }}>
      <section style={{ display: "grid", gap: ".625rem" }}>
        <Title style={{ fontSize: "2.25rem", lineHeight: 1.35 }}>
          {site.name}
        </Title>
        <p style={{ color: theme.muted }}>{site.description}</p>
      </section>

      <Section heading="レトロニムとは">
        <p>
          新しい概念や製品が登場したことで、それまで単独の名前で呼ばれていたものを区別するために、後から付けられた名称のこと。
        </p>
        <p style={{ color: theme.muted, fontSize: ".875rem" }}>
          電話 → 固定電話 / カメラ → フィルムカメラ / 携帯電話 →
          フィーチャーフォン
        </p>
      </Section>

      <Section heading="ランダムなレトロニム">
        <RandomRetronym retronyms={retronyms} initial={initialRandom} />
      </Section>

      <Section heading="新着">
        <RetronymCardList retronyms={newest} />
      </Section>

      <Section heading="タグ">
        <TagList>
          {tags.map(({ name, count }) => (
            <Link
              key={name}
              href={`/retronyms/?tag=${encodeURIComponent(name)}`}
              style={{ textDecoration: "none" }}
            >
              <Tag>
                {name} {count}
              </Tag>
            </Link>
          ))}
        </TagList>
      </Section>

      <p>
        <Link
          href="/retronyms/"
          style={{ color: theme.accent, fontWeight: 700 }}
        >
          レトロニム一覧・検索（全{retronyms.length}件） →
        </Link>
      </p>
    </div>
  )
}

export default Page
