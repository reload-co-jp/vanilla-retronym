import { Breadcrumb } from "@/components/elements/breadcrumb"
import { JsonLd } from "@/components/elements/json-ld"
import { Section, Title } from "@/components/elements/layout"
import { StatusBadge } from "@/components/retronym/status-badge"
import { TagLink, TagList } from "@/components/retronym/tag"
import { getModifier } from "@/lib/modifiers"
import {
  getRelatedWithReason,
  getRetronym,
  languageLabel,
  Retronym,
  retronymDescription,
  retronymPath,
  retronyms,
  retronymTitle,
  statusLabels,
  tagPath,
} from "@/lib/retronyms"
import { openGraphBase, site } from "@/lib/site"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FC, ReactNode } from "react"

type Params = { params: Promise<{ id: string }> }

export const dynamicParams = false

export const generateStaticParams = () => retronyms.map(({ id }) => ({ id }))

export const generateMetadata = async ({
  params,
}: Params): Promise<Metadata> => {
  const { id } = await params
  const retronym = getRetronym(id)
  if (!retronym) return {}

  const title = retronymTitle(retronym)
  const description = retronymDescription(retronym)
  const url = retronymPath(retronym.id)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...openGraphBase,
      type: "article",
      title: `${title} | ${site.name}`,
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

const Paragraphs: FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ display: "grid", gap: ".875rem", lineHeight: 1.9 }}>
    {children}
  </div>
)

/** 元の名称 → きっかけ → 呼び分け → レトロニム の流れを示す。 */
const NamingFlow: FC<{ retronym: Retronym }> = ({ retronym }) => {
  const steps: { label: string; text: ReactNode }[] = [
    { label: "元の名称", text: `「${retronym.originalName}」` },
    { label: "新しく登場したもの", text: retronym.trigger },
    {
      label: "呼び分けの必要",
      text: `元の「${retronym.originalName}」を区別する必要が生まれる`,
    },
    {
      label: "レトロニム",
      text: (
        <strong style={{ color: theme.accent }}>「{retronym.name}」</strong>
      ),
    },
  ]
  return (
    <ol
      aria-label={`${retronym.name}が生まれた流れ`}
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: ".375rem",
        display: "grid",
        gap: ".25rem",
        listStyle: "none",
        margin: 0,
        padding: ".875rem 1rem",
      }}
    >
      {steps.map(({ label, text }, index) => (
        <li key={label} style={{ display: "grid", gap: ".25rem" }}>
          {index > 0 && (
            <span aria-hidden style={{ color: theme.muted }}>
              ↓
            </span>
          )}
          <span>
            <span
              style={{
                color: theme.muted,
                display: "block",
                fontSize: ".75rem",
              }}
            >
              {label}
            </span>
            {text}
          </span>
        </li>
      ))}
    </ol>
  )
}

const Page = async ({ params }: Params) => {
  const { id } = await params
  const retronym = getRetronym(id)
  if (!retronym) notFound()

  const { name, originalName, trigger, details } = retronym
  const url = retronymPath(retronym.id)
  const related = getRelatedWithReason(retronym)
  const modifier = getModifier(retronym)
  const [mainTag] = retronym.tags
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name,
    alternateName: [
      ...(retronym.aliases ?? []),
      ...(retronym.translation ? [retronym.translation] : []),
      originalName,
    ],
    description: retronym.description,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: site.name,
      url: `${site.url}/retronyms/`,
    },
    url: `${site.url}${url}`,
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
          ...(mainTag ? [{ name: mainTag, href: tagPath(mainTag) }] : []),
          { name, href: url },
        ]}
      />

      <header style={{ display: "grid", gap: ".625rem" }}>
        <Title style={{ fontSize: "2.25rem", lineHeight: 1.35 }}>
          {name}とは？
          <span
            style={{
              color: theme.muted,
              display: "block",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            意味・{details?.etymology ? "語源・" : ""}「{name}
            」と呼ばれるようになった理由
          </span>
        </Title>
        {retronym.translation && (
          <p style={{ color: theme.muted, fontSize: "1.125rem" }}>
            {retronym.translation}
          </p>
        )}
        <div>
          <StatusBadge status={retronym.status} />
        </div>
      </header>

      <Section compact heading="概要">
        <NamingFlow retronym={retronym} />
        <Paragraphs>
          <p>{retronym.description}</p>
        </Paragraphs>
      </Section>

      {details?.meaning && (
        <Section compact heading={`${name}とは`}>
          <Paragraphs>
            <p>{details.meaning}</p>
          </Paragraphs>
        </Section>
      )}

      <Section compact heading={`なぜ「${name}」と呼ばれるようになった？`}>
        <Paragraphs>
          <p>
            「{trigger}」が登場したことで、それまでの「{originalName}
            」と区別する必要が生まれ、
            {modifier
              ? `「${modifier.label}」を付けた「${name}」`
              : `「${name}」`}
            という呼び名が使われるようになった。
          </p>
          {details?.etymology && <p>{details.etymology}</p>}
        </Paragraphs>
      </Section>

      <Section compact heading="元々は何と呼ばれていた？">
        <Paragraphs>
          <p>
            {trigger}が登場する前は、単に「{originalName}」と呼ばれていた。
          </p>
          {retronym.aliases && retronym.aliases.length > 0 && (
            <p>
              「{name}」のほか、
              {retronym.aliases.map((alias) => `「${alias}」`).join("")}
              と呼ばれることもある。
            </p>
          )}
        </Paragraphs>
      </Section>

      {details?.history && (
        <Section compact heading={`${name}が必要になった背景`}>
          <Paragraphs>
            <p>{details.history}</p>
          </Paragraphs>
        </Section>
      )}

      {details?.usage && (
        <Section compact heading={`${name}の具体例・使われ方`}>
          <Paragraphs>
            <p>{details.usage}</p>
          </Paragraphs>
        </Section>
      )}

      <Section compact heading="レトロニムとしての特徴">
        <dl
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
            margin: 0,
          }}
        >
          <Field label="元の名称">{originalName}</Field>
          <Field label="新しく登場したもの">{trigger}</Field>
          {modifier && (
            <Field label="付け足された言葉">
              <Link href="/modifiers/" style={{ color: theme.accent }}>
                {modifier.label}
              </Link>
            </Field>
          )}
          {retronym.period && <Field label="成立時期">{retronym.period}</Field>}
          <Field label="主に使われる言語">
            {languageLabel(retronym.language)}
          </Field>
          <Field label="ステータス">{statusLabels[retronym.status]}</Field>
        </dl>
        <TagList>
          {retronym.tags.map((tag) => (
            <TagLink key={tag} tag={tag} />
          ))}
        </TagList>
      </Section>

      {related.length > 0 && (
        <Section compact heading="関連するレトロニム">
          <ul style={{ display: "grid", gap: ".5rem", lineHeight: 1.6 }}>
            {related.map(({ retronym: item, reason }) => (
              <li key={item.id}>
                <Link
                  href={retronymPath(item.id)}
                  style={{ color: theme.accent }}
                >
                  {item.name}
                </Link>
                <span style={{ color: theme.muted, fontSize: ".8125rem" }}>
                  {" "}
                  — {item.originalName} → {item.name}／{reason}
                </span>
              </li>
            ))}
          </ul>
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

      <p style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <Link href="/retronyms/" style={{ color: theme.accent }}>
          ← レトロニム一覧・検索へ
        </Link>
        <Link href="/about/" style={{ color: theme.accent }}>
          レトロニムとは →
        </Link>
      </p>
    </article>
  )
}

export default Page
