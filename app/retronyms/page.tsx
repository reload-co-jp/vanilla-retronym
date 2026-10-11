import { Breadcrumb } from "@/components/elements/breadcrumb"
import { JsonLd } from "@/components/elements/json-ld"
import { Title } from "@/components/elements/layout"
import { RetronymCardList } from "@/components/retronym/card"
import { RetronymSearch } from "@/components/retronym/search"
import { retronyms, sortRetronyms } from "@/lib/retronyms"
import { openGraphBase, site } from "@/lib/site"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import { FC, Suspense } from "react"

const description = `収録しているレトロニム全${retronyms.length}件を一覧・検索できる。名前・元の名称・きっかけ・説明・タグから絞り込める。`

export const metadata: Metadata = {
  title: "レトロニム一覧・検索",
  description,
  alternates: { canonical: "/retronyms/" },
  openGraph: {
    ...openGraphBase,
    description,
    title: "レトロニム一覧・検索",
    url: "/retronyms/",
  },
}

const Page: FC = () => (
  <div className="wide" style={{ display: "grid", gap: "2.5rem" }}>
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
    <section className="pagehead">
      <p className="en-label" style={{ color: theme.accent }}>
        Retronyms — Index
      </p>
      <Title className="pagehead__title" style={{ fontSize: undefined }}>
        レトロニム一覧・検索
      </Title>
      <p className="pagehead__lead">
        後から名前が付いた言葉、全{retronyms.length}
        件。キーワード・タグ・言語で絞り込み、気になる言葉から変化の背景を読む。
      </p>
    </section>
    <div id="search" style={{ scrollMarginTop: "1.5rem" }}>
      {/* 静的HTMLには全件を出力し、ハイドレート後に検索UIへ差し替える。 */}
      <Suspense
        fallback={
          <RetronymCardList retronyms={sortRetronyms(retronyms, "name")} />
        }
      >
        <RetronymSearch retronyms={retronyms} />
      </Suspense>
    </div>
  </div>
)

export default Page
