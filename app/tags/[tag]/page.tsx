import { Breadcrumb } from "@/components/elements/breadcrumb"
import { JsonLd } from "@/components/elements/json-ld"
import { Section, Title } from "@/components/elements/layout"
import { RetronymCardList } from "@/components/retronym/card"
import { TagLink, TagList } from "@/components/retronym/tag"
import {
  getRelatedTags,
  getRetronymsByTag,
  getTags,
  sortRetronyms,
  tagPath,
} from "@/lib/retronyms"
import { openGraphBase, site } from "@/lib/site"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

type Params = { params: Promise<{ tag: string }> }

export const dynamicParams = false

export const generateStaticParams = () =>
  getTags().map(({ name }) => ({ tag: name }))

// 静的書き出しではセグメントがエンコードされたまま渡ることがあるため戻す。
const resolveTag = async (params: Params["params"]) =>
  decodeURIComponent((await params).tag)

const describe = (tag: string, count: number) =>
  `「${tag}」に関するレトロニム${count}件の一覧。${tag}の分野で新しいものが登場したことにより、元のものを区別するために生まれた呼び名を集めた。`

export const generateMetadata = async ({
  params,
}: Params): Promise<Metadata> => {
  const tag = await resolveTag(params)
  const items = getRetronymsByTag(tag)
  if (items.length === 0) return {}

  const title = `${tag}のレトロニム一覧`
  const description = describe(tag, items.length)
  const url = tagPath(tag)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { ...openGraphBase, title, description, url },
  }
}

const Page = async ({ params }: Params) => {
  const tag = await resolveTag(params)
  const items = sortRetronyms(getRetronymsByTag(tag), "name")
  if (items.length === 0) notFound()

  const title = `${tag}のレトロニム一覧`

  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          url: `${site.url}${tagPath(tag)}`,
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: items.length,
            itemListElement: items.map((r, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: r.name,
              url: `${site.url}/retronyms/${r.id}/`,
            })),
          },
        }}
      />
      <Breadcrumb
        items={[
          { name: "レトロニム一覧・検索", href: "/retronyms/" },
          { name: tag, href: tagPath(tag) },
        ]}
      />
      <section style={{ display: "grid", gap: ".375rem" }}>
        <Title style={{ fontSize: "1.875rem" }}>{title}</Title>
        <p style={{ color: theme.muted, fontSize: ".875rem" }}>
          {describe(tag, items.length)}
        </p>
      </section>
      <RetronymCardList retronyms={items} />
      <Section compact heading="関連するカテゴリ">
        <TagList>
          {getRelatedTags(tag).map((name) => (
            <TagLink key={name} tag={name} />
          ))}
        </TagList>
      </Section>
      <p style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <Link href="/retronyms/examples/" style={{ color: theme.accent }}>
          レトロニムの具体例・代表例 →
        </Link>
        <Link href="/about/" style={{ color: theme.accent }}>
          レトロニムとは →
        </Link>
      </p>
    </div>
  )
}

export default Page
