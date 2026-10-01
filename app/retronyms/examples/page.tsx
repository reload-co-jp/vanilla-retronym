import { Breadcrumb } from "@/components/elements/breadcrumb"
import { Section, Title } from "@/components/elements/layout"
import { FlowList, patterns, pick } from "@/components/retronym/flow"
import { getRetronymsByTag, getTags, retronyms, tagPath } from "@/lib/retronyms"
import { openGraphBase } from "@/lib/site"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import Link from "next/link"
import { FC } from "react"

const title = "レトロニムの具体例・代表例一覧"
const description =
  "固定電話・アナログ時計・紙の本など、レトロニムの代表的な具体例を作られ方のパターン別・分野別に紹介する。"
const url = "/retronyms/examples/"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { ...openGraphBase, title, description, url },
}

// 分野別に載せるタグ数と、各分野の掲載数。確定済みの項目を優先する。
const fields = getTags()
  .slice(0, 8)
  .map(({ name }) => ({
    name,
    items: getRetronymsByTag(name)
      .filter((r) => r.status === "confirmed")
      .slice(0, 4),
  }))

const Page: FC = () => (
  <article style={{ display: "grid", gap: "3rem" }}>
    <Breadcrumb
      items={[
        { name: "レトロニム一覧・検索", href: "/retronyms/" },
        { name: "具体例", href: url },
      ]}
    />
    <section style={{ display: "grid", gap: ".625rem" }}>
      <Title style={{ fontSize: "2.25rem", lineHeight: 1.35 }}>{title}</Title>
      <p style={{ color: theme.muted }}>{description}</p>
    </section>

    <Section heading="レトロニムとは">
      <p style={{ lineHeight: 1.9 }}>
        新しいものが登場したことで、それまで単独の名前で呼ばれていたものを区別するために、後から付けられた名前のこと。
      </p>
      <p>
        <Link
          href="/about/"
          style={{ color: theme.accent, fontSize: ".875rem" }}
        >
          レトロニムの意味・語源を詳しく →
        </Link>
      </p>
    </Section>

    <Section heading="代表的なレトロニム">
      <div style={{ display: "grid", gap: "1.75rem" }}>
        {patterns.map(({ heading, body, ids }) => (
          <section key={heading} style={{ display: "grid", gap: ".625rem" }}>
            <h3 style={{ fontSize: "1rem", margin: 0 }}>{heading}</h3>
            <p style={{ fontSize: ".9375rem" }}>{body}</p>
            <FlowList retronyms={pick(ids)} />
          </section>
        ))}
      </div>
    </Section>

    <Section heading="分野別のレトロニム">
      <div style={{ display: "grid", gap: "1.75rem" }}>
        {fields.map(({ name, items }) => (
          <section key={name} style={{ display: "grid", gap: ".625rem" }}>
            <h3 style={{ fontSize: "1rem", margin: 0 }}>{name}のレトロニム</h3>
            <FlowList retronyms={items} />
            <Link
              href={tagPath(name)}
              style={{ color: theme.accent, fontSize: ".875rem" }}
            >
              {name}のレトロニムをすべて見る →
            </Link>
          </section>
        ))}
      </div>
    </Section>

    <p>
      <Link href="/retronyms/" style={{ color: theme.accent, fontWeight: 700 }}>
        レトロニム一覧・検索（全{retronyms.length}件） →
      </Link>
    </p>
  </article>
)

export default Page
