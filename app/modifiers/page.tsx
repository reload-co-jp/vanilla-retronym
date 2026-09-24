import { Breadcrumb } from "@/components/elements/breadcrumb"
import { JsonLd } from "@/components/elements/json-ld"
import { Section, Title } from "@/components/elements/layout"
import {
  getModifierGroups,
  getSuffixModifiers,
  Modifier,
} from "@/lib/modifiers"
import { Retronym, retronyms } from "@/lib/retronyms"
import { openGraphBase, site } from "@/lib/site"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import Link from "next/link"
import { FC } from "react"

const title = "レトロニムに付く言葉"
const description =
  "「天然」「生」「有線」「アナログ」「紙の」など、レトロニムを作るときに付け加えられる接頭語・修飾語を、区別のしかたごとに分類して一覧にする。"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/modifiers/" },
  openGraph: {
    ...openGraphBase,
    description,
    title,
    url: "/modifiers/",
  },
}

const RetronymLink: FC<{ retronym: Retronym }> = ({ retronym }) => (
  <li>
    <Link
      href={`/retronyms/${retronym.id}/`}
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: ".375rem",
        display: "inline-flex",
        flexWrap: "wrap",
        fontSize: ".875rem",
        gap: ".375rem",
        padding: ".25rem .625rem",
        textDecoration: "none",
      }}
    >
      <strong style={{ color: theme.accent }}>{retronym.name}</strong>
      <span style={{ color: theme.muted }}>← {retronym.originalName}</span>
    </Link>
  </li>
)

const RetronymLinks: FC<{ retronyms: Retronym[] }> = ({ retronyms }) => (
  <ul
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: ".375rem",
      listStyle: "none",
      margin: 0,
      padding: 0,
    }}
  >
    {retronyms.map((r) => (
      <RetronymLink key={r.id} retronym={r} />
    ))}
  </ul>
)

const ModifierItem: FC<{ modifier: Modifier }> = ({ modifier }) => (
  <div style={{ display: "grid", gap: ".5rem" }}>
    <dt style={{ alignItems: "baseline", display: "flex", gap: ".625rem" }}>
      <span
        style={{
          backgroundColor: theme.tag,
          borderRadius: ".25rem",
          fontWeight: 700,
          padding: ".0625rem .5rem",
        }}
      >
        {modifier.label}
      </span>
      <span style={{ color: theme.muted, fontSize: ".8125rem" }}>
        {modifier.retronyms.length}件
      </span>
    </dt>
    <dd style={{ margin: 0 }}>
      <RetronymLinks retronyms={modifier.retronyms} />
    </dd>
  </div>
)

const Page: FC = () => (
  <article style={{ display: "grid", gap: "3rem" }}>
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url: `${site.url}/modifiers/`,
        inLanguage: "ja",
        publisher: { "@type": "Organization", name: "Reload" },
        isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
      }}
    />
    <Breadcrumb items={[{ name: title, href: "/modifiers/" }]} />
    <section style={{ display: "grid", gap: ".625rem" }}>
      <Title style={{ fontSize: "2.25rem", lineHeight: 1.35 }}>{title}</Title>
      <p style={{ color: theme.muted }}>
        レトロニムの多くは、元の名前に言葉を一つ付け足して作られる。本図鑑の収録例から、付け足される接頭語・修飾語を自動で抜き出し、区別のしかたごとにまとめた。
      </p>
    </section>

    {getModifierGroups().map(({ heading, body, modifiers }) => (
      <Section key={heading} heading={heading}>
        <p style={{ fontSize: ".9375rem" }}>{body}</p>
        <dl style={{ display: "grid", gap: "1.25rem", margin: 0 }}>
          {modifiers.map((modifier) => (
            <ModifierItem key={modifier.label} modifier={modifier} />
          ))}
        </dl>
      </Section>
    ))}

    <Section heading="後ろに付く言葉">
      <p style={{ fontSize: ".9375rem" }}>
        フランス語やスペイン語など、形容詞を名詞の後ろに置く言語では、区別のための言葉も後ろに付く。
      </p>
      <RetronymLinks
        retronyms={getSuffixModifiers().flatMap((m) => m.retronyms)}
      />
    </Section>

    <p>
      <Link href="/retronyms/" style={{ color: theme.accent, fontWeight: 700 }}>
        レトロニム一覧・検索（全{retronyms.length}件） →
      </Link>
    </p>
  </article>
)

export default Page
