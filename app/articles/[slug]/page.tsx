import { Breadcrumb } from "@/components/elements/breadcrumb"
import { JsonLd } from "@/components/elements/json-ld"
import { Section, Title } from "@/components/elements/layout"
import { FlowList, pick } from "@/components/retronym/flow"
import { TagLink, TagList } from "@/components/retronym/tag"
import { articlePath, articles, getArticle } from "@/lib/articles"
import { retronymPath } from "@/lib/retronyms"
import { openGraphBase, site } from "@/lib/site"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

type Params = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export const generateStaticParams = () => articles.map(({ slug }) => ({ slug }))

export const generateMetadata = async ({
  params,
}: Params): Promise<Metadata> => {
  const article = getArticle((await params).slug)
  if (!article) return {}

  const { title, description } = article
  const url = articlePath(article.slug)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...openGraphBase,
      type: "article",
      title: `${title} | ${site.nameJa}`,
      description,
      url,
      publishedTime: article.datePublished,
    },
  }
}

const Page = async ({ params }: Params) => {
  const article = getArticle((await params).slug)
  if (!article) notFound()

  const url = articlePath(article.slug)
  const sections = article.sections.map((section) => ({
    ...section,
    retronyms: pick(section.ids),
  }))
  const mentioned = sections.flatMap(({ retronyms }) => retronyms)
  const others = articles.filter(({ slug }) => slug !== article.slug)

  return (
    <article style={{ display: "grid", gap: "3rem" }}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          url: `${site.url}${url}`,
          datePublished: article.datePublished,
          inLanguage: "ja",
          publisher: {
            "@type": "Organization",
            name: "Reload",
            url: "https://reload.co.jp",
          },
          mentions: mentioned.map((r) => ({
            "@type": "DefinedTerm",
            name: r.name,
            url: `${site.url}${retronymPath(r.id)}`,
          })),
        }}
      />
      <Breadcrumb
        items={[
          { name: "記事", href: "/articles/" },
          { name: article.title, href: url },
        ]}
      />

      <header style={{ display: "grid", gap: ".75rem" }}>
        <p className="en-label" style={{ color: theme.accent }}>
          Article
        </p>
        <Title style={{ fontSize: "2rem", lineHeight: 1.4 }}>
          {article.title}
        </Title>
        <p style={{ color: theme.muted, fontSize: ".875rem" }}>
          取り上げるレトロニム：{mentioned.length}語
        </p>
      </header>

      <div className="prose">
        {article.lead.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>

      {sections.map(({ heading, paragraphs, retronyms }) => (
        <Section key={heading} compact heading={heading}>
          <div className="prose">
            {paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <FlowList retronyms={retronyms} />
        </Section>
      ))}

      <Section compact heading="まとめ">
        <div className="prose">
          {article.conclusion.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <p style={{ color: theme.muted, fontSize: ".75rem" }}>
          ※各語の成立時期は目安。詳しい経緯と出典は各項目のページに記載している。
        </p>
      </Section>

      <Section compact heading="関連するカテゴリ">
        <TagList>
          {article.tags.map((tag) => (
            <TagLink key={tag} tag={tag} />
          ))}
        </TagList>
      </Section>

      {others.length > 0 && (
        <Section compact heading="ほかの記事">
          <ul className="related">
            {others.map((other) => (
              <li key={other.slug} className="linkcard">
                <h3>
                  <Link href={articlePath(other.slug)}>{other.title}</Link>
                </h3>
                <p>{other.description}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <p style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <Link href="/retronyms/examples/" className="textlink">
          レトロニムの具体例・代表例 <span className="arrow">→</span>
        </Link>
        <Link href="/about/" className="textlink">
          レトロニムとは <span className="arrow">→</span>
        </Link>
      </p>
    </article>
  )
}

export default Page
