import { Breadcrumb } from "@/components/elements/breadcrumb"
import { JsonLd } from "@/components/elements/json-ld"
import { Section, Title } from "@/components/elements/layout"
import { RetronymCardList } from "@/components/retronym/card"
import { StatusBadge } from "@/components/retronym/status-badge"
import { TagLink, TagList } from "@/components/retronym/tag"
import {
  detailLabels,
  getRelated,
  getRetronym,
  RetronymDetails,
  retronyms,
} from "@/lib/retronyms"
import { site } from "@/lib/site"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FC, ReactNode } from "react"

type Params = { params: Promise<{ id: string }> }

export const generateStaticParams = () => retronyms.map(({ id }) => ({ id }))

export const generateMetadata = async ({
  params,
}: Params): Promise<Metadata> => {
  const { id } = await params
  const retronym = getRetronym(id)
  if (!retronym) return {}

  const description = `「${retronym.originalName}」は${retronym.trigger}の登場により「${retronym.name}」と呼ばれるようになった。${retronym.description}`
  const url = `/retronyms/${retronym.id}/`

  return {
    title: retronym.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${retronym.name} | ${site.name}`,
      description,
      url,
    },
  }
}

const Field: FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <div style={{ display: "grid", gap: ".15rem" }}>
    <dt style={{ color: theme.muted, fontSize: ".75rem" }}>{label}</dt>
    <dd style={{ margin: 0 }}>{children}</dd>
  </div>
)

const Page = async ({ params }: Params) => {
  const { id } = await params
  const retronym = getRetronym(id)
  if (!retronym) notFound()

  const related = getRelated(retronym)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: retronym.name,
    description: retronym.description,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: site.name,
      url: `${site.url}/retronyms/`,
    },
    url: `${site.url}/retronyms/${retronym.id}/`,
    inLanguage: retronym.language,
    termCode: retronym.id,
    keywords: retronym.tags.join(", "),
  }

  return (
    <article style={{ display: "grid", gap: "2.25rem" }}>
      <JsonLd data={jsonLd} />
      <Breadcrumb
        items={[
          { name: "レトロニム一覧・検索", href: "/retronyms/" },
          { name: retronym.name, href: `/retronyms/${retronym.id}/` },
        ]}
      />

      <header style={{ display: "grid", gap: ".625rem" }}>
        <Title style={{ fontSize: "2.25rem", lineHeight: 1.35 }}>
          {retronym.name}
        </Title>
        <p style={{ color: theme.muted }}>
          もともとは「{retronym.originalName}」と呼ばれていた。
        </p>
        <div>
          <StatusBadge status={retronym.status} />
        </div>
      </header>

      <dl
        style={{
          borderBottom: `1px solid ${theme.border}`,
          borderTop: `1px solid ${theme.border}`,
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
          margin: 0,
          padding: "1rem 0",
        }}
      >
        <Field label="新しく登場したもの">{retronym.trigger}</Field>
        <Field label="元の名称">{retronym.originalName}</Field>
        {retronym.period && <Field label="成立時期">{retronym.period}</Field>}
        <Field label="主に使われる言語">{retronym.language}</Field>
      </dl>

      <Section compact heading="タグ">
        <TagList>
          {retronym.tags.map((tag) => (
            <TagLink key={tag} tag={tag} />
          ))}
        </TagList>
      </Section>

      <Section compact heading="概要">
        <div style={{ display: "grid", gap: ".875rem", lineHeight: 1.9 }}>
          <p>{retronym.description}</p>
          {retronym.details &&
            (Object.keys(detailLabels) as (keyof RetronymDetails)[]).map(
              (key) => (
                <section key={key} style={{ display: "grid", gap: ".25rem" }}>
                  <h3 style={{ fontSize: ".875rem", margin: 0 }}>
                    {detailLabels[key]}
                  </h3>
                  <p>{retronym.details?.[key]}</p>
                </section>
              )
            )}
        </div>
      </Section>

      {related.length > 0 && (
        <Section compact heading="関連するレトロニム">
          <RetronymCardList retronyms={related} />
        </Section>
      )}

      {retronym.sources && retronym.sources.length > 0 && (
        <Section compact heading="出典">
          <ul style={{ display: "grid", gap: ".25rem" }}>
            {retronym.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} rel="noreferrer noopener" target="_blank">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <p>
        <Link href="/retronyms/" style={{ color: theme.accent }}>
          ← レトロニム一覧・検索へ
        </Link>
      </p>
    </article>
  )
}

export default Page
