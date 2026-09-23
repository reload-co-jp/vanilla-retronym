import { Breadcrumb } from "@/components/elements/breadcrumb"
import { JsonLd } from "@/components/elements/json-ld"
import { Title } from "@/components/elements/layout"
import { RetronymCardList } from "@/components/retronym/card"
import { RetronymSearch } from "@/components/retronym/search"
import { retronyms, sortRetronyms } from "@/lib/retronyms"
import { site } from "@/lib/site"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import { FC, Suspense } from "react"

export const metadata: Metadata = {
  title: "レトロニム一覧・検索",
  description: `収録しているレトロニム全${retronyms.length}件を一覧・検索できる。名前・元の名称・きっかけ・説明・タグから絞り込める。`,
  alternates: { canonical: "/retronyms/" },
  openGraph: {
    title: "レトロニム一覧・検索",
    url: "/retronyms/",
  },
}

const Page: FC = () => (
  <div style={{ display: "grid", gap: "2rem" }}>
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "レトロニム一覧・検索",
        url: `${site.url}/retronyms/`,
        isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
        mainEntity: {
          "@type": "DefinedTermSet",
          name: site.name,
          hasDefinedTerm: retronyms.map((r) => ({
            "@type": "DefinedTerm",
            name: r.name,
            url: `${site.url}/retronyms/${r.id}/`,
          })),
        },
      }}
    />
    <Breadcrumb
      items={[{ name: "レトロニム一覧・検索", href: "/retronyms/" }]}
    />
    <section style={{ display: "grid", gap: ".375rem" }}>
      <Title style={{ fontSize: "1.875rem" }}>レトロニム一覧・検索</Title>
      <p style={{ color: theme.muted, fontSize: ".875rem" }}>
        全{retronyms.length}件。検索と絞り込みはブラウザ上で処理する。
      </p>
    </section>
    {/* 静的HTMLには全件を出力し、ハイドレート後に検索UIへ差し替える。 */}
    <Suspense
      fallback={
        <RetronymCardList retronyms={sortRetronyms(retronyms, "name")} />
      }
    >
      <RetronymSearch retronyms={retronyms} />
    </Suspense>
  </div>
)

export default Page
