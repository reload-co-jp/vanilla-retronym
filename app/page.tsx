import { JsonLd } from "@/components/elements/json-ld"
import { Section, Title } from "@/components/elements/layout"
import { RetronymCardList } from "@/components/retronym/card"
import { TagLink, TagList } from "@/components/retronym/tag"
import { getTags, newestRetronyms, retronyms } from "@/lib/retronyms"
import { openGraphBase, site } from "@/lib/site"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import Link from "next/link"
import { FC } from "react"

// 一覧・検索できる図鑑であることを検索結果で伝える。件数はデータから生成する
const title = `レトロニム図鑑｜後から名前が付いた言葉の一覧・検索 - ${site.name}`
const description = `${site.description}固定電話・フィルムカメラなど全${retronyms.length}件を、タグやキーワードで一覧・検索できる。`

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { ...openGraphBase, title, description, url: "/" },
}

const Page: FC = () => {
  const tags = getTags()
  const newest = newestRetronyms(6)

  return (
    <div style={{ display: "grid", gap: "3rem" }}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          alternateName: [site.nameJa, "レトロニム図鑑"],
          url: site.url,
          description: site.description,
          inLanguage: "ja",
          publisher: {
            "@type": "Organization",
            name: "Reload",
            url: "https://reload.co.jp",
          },
        }}
      />
      <section style={{ display: "grid", gap: ".625rem" }}>
        <Title style={{ fontSize: "2.25rem", lineHeight: 1.35 }}>
          {site.name}
          {/* 日本語の検索意図に合わせ、見出しに「レトロニム図鑑」を含める */}
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
              fontWeight: 400,
              letterSpacing: "normal",
              lineHeight: 1.8,
              marginTop: ".625rem",
            }}
          >
            {site.nameJa}｜レトロニム図鑑
          </span>
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
        <p>
          <Link
            href="/retronyms/examples/"
            style={{ color: theme.accent, fontSize: ".875rem" }}
          >
            レトロニムの具体例・代表例一覧 →
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
