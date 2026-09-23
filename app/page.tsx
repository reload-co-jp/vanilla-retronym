import { Section, Title } from "@/components/elements/layout"
import { RetronymCardList } from "@/components/retronym/card"
import { TagLink, TagList } from "@/components/retronym/tag"
import { getTags, newestRetronyms, retronyms } from "@/lib/retronyms"
import { site } from "@/lib/site"
import { theme } from "@/lib/theme"
import Link from "next/link"
import { FC } from "react"

const Page: FC = () => {
  const tags = getTags()
  const newest = newestRetronyms(5)

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
        <p>
          <Link
            href="/about/"
            style={{ color: theme.accent, fontSize: ".875rem" }}
          >
            レトロニムについて詳しく →
          </Link>
        </p>
      </Section>

      <Section heading="新着">
        <RetronymCardList retronyms={newest} />
      </Section>

      <Section heading="タグ">
        <TagList>
          {tags.map(({ name, count }) => (
            <TagLink key={name} tag={name}>
              {name} {count}
            </TagLink>
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
