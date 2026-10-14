import { Breadcrumb } from "@/components/elements/breadcrumb"
import { Title } from "@/components/elements/layout"
import { articlePath, articles } from "@/lib/articles"
import { openGraphBase } from "@/lib/site"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import Link from "next/link"
import { FC } from "react"

const title = "レトロニムで読む記事一覧"
const description =
  "レトロニムを時代や分野ごとに集め、言葉の変化から技術や社会の移り変わりを読み解く記事の一覧。"
const url = "/articles/"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { ...openGraphBase, title, description, url },
}

const Page: FC = () => (
  <div style={{ display: "grid", gap: "2rem" }}>
    <Breadcrumb items={[{ name: "記事", href: url }]} />
    <section style={{ display: "grid", gap: ".375rem" }}>
      <Title style={{ fontSize: "1.875rem" }}>{title}</Title>
      <p style={{ color: theme.muted, fontSize: ".875rem" }}>{description}</p>
    </section>
    <ul className="related">
      {articles.map(({ slug, title, description }) => (
        <li key={slug} className="linkcard">
          <h2 style={{ fontSize: "1.125rem", margin: 0 }}>
            <Link href={articlePath(slug)}>{title}</Link>
          </h2>
          <p>{description}</p>
        </li>
      ))}
    </ul>
  </div>
)

export default Page
