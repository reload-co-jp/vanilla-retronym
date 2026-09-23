import { Breadcrumb } from "@/components/elements/breadcrumb"
import { JsonLd } from "@/components/elements/json-ld"
import { Section, Title } from "@/components/elements/layout"
import { StatusBadge } from "@/components/retronym/status-badge"
import {
  getRetronym,
  Retronym,
  RetronymStatus,
  retronyms,
} from "@/lib/retronyms"
import { openGraphBase, site } from "@/lib/site"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import Link from "next/link"
import { FC, ReactNode } from "react"

const description =
  "レトロニム（retronym）の意味・語源・生まれる仕組み・パターンを、具体例とともに詳しく解説する。"

export const metadata: Metadata = {
  title: "レトロニムとは",
  description,
  alternates: { canonical: "/about/" },
  openGraph: {
    ...openGraphBase,
    description,
    title: "レトロニムとは",
    url: "/about/",
  },
}

const pick = (ids: string[]): Retronym[] =>
  ids.map(getRetronym).filter((r): r is Retronym => r !== undefined)

const patterns: {
  heading: string
  body: string
  ids: string[]
}[] = [
  {
    heading: "性質を表す言葉を足す",
    body: "最も多い型。新しいものとの違いになる性質（アナログ・固定・有線・紙の など）を前に付けて区別する。",
    ids: ["fixed-phone", "analog-clock", "wired-earphone", "paper-book"],
  },
  {
    heading: "「本来の」「自然の」と言い直す",
    body: "人工物・派生物が登場したことで、元のものを「自然」「生」「対面」などと呼び直す型。",
    ids: ["natural-language", "live-music", "in-person-meeting", "whole-milk"],
  },
  {
    heading: "番号を振る",
    body: "続編や二番目が現れて初めて、最初のものに「第一」「1」が付く型。",
    ids: ["world-war-one", "star-wars-episode-4", "playstation-1", "web-1-0"],
  },
  {
    heading: "後世の視点で名付ける",
    body: "当時の人は別の名前で呼んでいたものに、歴史学などが区別のため後から名前を与えた型。",
    ids: ["byzantine-empire", "old-testament", "traditional-chinese"],
  },
  {
    heading: "新しい言葉に置き換える",
    body: "修飾語を足すのではなく、新旧を対比する別の単語が作られる型。",
    ids: ["feature-phone", "snail-mail", "day-game"],
  },
]

const statusDescriptions: Record<RetronymStatus, string> = {
  confirmed: "辞書や文献などで、レトロニムとして一般に認められているもの。",
  disputed:
    "レトロニムとみなすかどうか、見解が分かれているもの。成り立ちに別の説がある場合も含む。",
  candidate:
    "レトロニムとしての用法が見られるものの、まだ定着しているとは言い切れないもの。",
}

const Paragraphs: FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ display: "grid", gap: ".875rem", lineHeight: 1.9 }}>
    {children}
  </div>
)

const Muted: FC<{ children: ReactNode }> = ({ children }) => (
  <p style={{ color: theme.muted, fontSize: ".875rem" }}>{children}</p>
)

const Flow: FC<{ retronym: Retronym }> = ({ retronym }) => (
  <li>
    <Link
      href={`/retronyms/${retronym.id}/`}
      style={{
        alignItems: "center",
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: ".375rem",
        display: "flex",
        flexWrap: "wrap",
        fontSize: ".875rem",
        gap: ".375rem .625rem",
        padding: ".625rem .875rem",
        textDecoration: "none",
      }}
    >
      <span style={{ color: theme.muted }}>{retronym.originalName}</span>
      <span aria-hidden style={{ color: theme.muted }}>
        →
      </span>
      <span
        style={{
          backgroundColor: theme.tag,
          borderRadius: ".25rem",
          fontSize: ".8125rem",
          padding: ".0625rem .5rem",
        }}
      >
        {retronym.trigger} の登場
      </span>
      <span aria-hidden style={{ color: theme.muted }}>
        →
      </span>
      <strong style={{ color: theme.accent }}>{retronym.name}</strong>
    </Link>
  </li>
)

const FlowList: FC<{ retronyms: Retronym[] }> = ({ retronyms }) => (
  <ul
    style={{
      display: "grid",
      gap: ".5rem",
      listStyle: "none",
      margin: 0,
      padding: 0,
    }}
  >
    {retronyms.map((r) => (
      <Flow key={r.id} retronym={r} />
    ))}
  </ul>
)

const Steps: FC = () => {
  const steps = [
    {
      label: "1. 元の状態",
      text: "「ギター」と言えば、誰もが同じものを思い浮かべる。",
    },
    {
      label: "2. 新しいものの登場",
      text: "電気で音を増幅する「エレキギター」が現れる。",
    },
    {
      label: "3. 呼び分けの必要",
      text: "ただ「ギター」と言うと、どちらのことか曖昧になる。",
    },
    {
      label: "4. レトロニムの誕生",
      text: "元のギターを「アコースティックギター」と呼び直す。",
    },
  ]
  return (
    <ol
      style={{
        display: "grid",
        gap: ".5rem",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {steps.map(({ label, text }) => (
        <li
          key={label}
          style={{
            borderLeft: `3px solid ${theme.accent}`,
            display: "grid",
            gap: ".125rem",
            padding: ".25rem 0 .25rem .875rem",
          }}
        >
          <strong style={{ fontSize: ".875rem" }}>{label}</strong>
          <span>{text}</span>
        </li>
      ))}
    </ol>
  )
}

const Page: FC = () => (
  <article style={{ display: "grid", gap: "3rem" }}>
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "レトロニムとは",
        description,
        url: `${site.url}/about/`,
        inLanguage: "ja",
        publisher: { "@type": "Organization", name: "Reload" },
        isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
      }}
    />
    <Breadcrumb items={[{ name: "レトロニムとは", href: "/about/" }]} />
    <section style={{ display: "grid", gap: ".625rem" }}>
      <Title style={{ fontSize: "2.25rem", lineHeight: 1.35 }}>
        レトロニムとは
      </Title>
      <p style={{ color: theme.muted }}>
        レトロニム（retronym）の意味・語源・生まれる仕組みを、具体例とともに解説する。
      </p>
    </section>

    <Section heading="意味">
      <Paragraphs>
        <p>
          <strong>レトロニム</strong>
          とは、新しいものが登場したことで、それまで単独の名前で呼ばれていたものを区別するために、
          <strong>後から付けられた名前</strong>
          のこと。日本語では「再命名」「後付け名称」などと訳されることもある。
        </p>
        <p>
          たとえば、携帯電話が普及する前は、電話といえば家や公衆電話に据え付けられたものだけだった。携帯電話が当たり前になると、単に「電話」と言っても区別がつかなくなり、元の電話は「固定電話」と呼ばれるようになった。この「固定電話」がレトロニムである。
        </p>
        <p>
          ポイントは、<strong>指しているもの自体は何も変わっていない</strong>
          こと。変わったのは周りの状況であり、新しい仲間が増えたことで、元のものにも名前が必要になった。
        </p>
      </Paragraphs>
    </Section>

    <Section heading="語源">
      <Paragraphs>
        <p>
          英語の <em>retronym</em> は、「後ろへ・さかのぼって」を意味する接頭辞{" "}
          <em>retro-</em> と、「名前」を意味する <em>-onym</em>
          （synonym, antonym などと同じ語根）を組み合わせた造語。
        </p>
        <p>
          1980年にアメリカのジャーナリスト、フランク・マンキーウィッツ（Frank
          Mankiewicz）が作ったとされ、同年、コラムニストのウィリアム・サファイア（William
          Safire）がニューヨーク・タイムズ・マガジンの連載コラム「On
          Language」で紹介したことで広く知られるようになった。
        </p>
      </Paragraphs>
    </Section>

    <Section heading="生まれる仕組み">
      <Paragraphs>
        <p>
          レトロニムは、おおむね次の流れで生まれる。新しいものが「例外」だった間は元の名前のままで困らないが、新しいものが普及して「普通」になるにつれて、元のものを言い分ける必要が出てくる。
        </p>
      </Paragraphs>
      <Steps />
      <Muted>
        新しいものが完全に主流になると、元の名前そのものが新しいものを指すようになることも多い。いま「電話」と言えば、多くの場合スマートフォンを思い浮かべる。
      </Muted>
    </Section>

    <Section heading="レトロニムのパターン">
      <Paragraphs>
        <p>
          レトロニムの作られ方にはいくつかの型がある。以下は本図鑑の収録例から分類したもの。
        </p>
      </Paragraphs>
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

    <Section heading="似ている言葉との違い">
      <dl style={{ display: "grid", gap: "1rem", margin: 0 }}>
        {[
          {
            term: "新語（ネオロジズム）",
            text: "新しく作られた言葉全般。レトロニムも新語の一種だが、指す対象が「昔からあるもの」である点が特徴。「携帯電話」は新語、「固定電話」はレトロニム。",
          },
          {
            term: "言い換え・婉曲表現",
            text: "印象を和らげたり差別的な響きを避けたりするための言い換えは、新しいものの登場がきっかけではないため、レトロニムには含めないのが一般的。",
          },
          {
            term: "略語",
            text: "「スマホ」のように長い名前を縮めたものは、呼び分けのための名前ではないのでレトロニムではない。",
          },
        ].map(({ term, text }) => (
          <div key={term} style={{ display: "grid", gap: ".25rem" }}>
            <dt style={{ fontWeight: 700 }}>{term}</dt>
            <dd style={{ margin: 0 }}>{text}</dd>
          </div>
        ))}
      </dl>
    </Section>

    <Section heading="本図鑑のステータス">
      <Paragraphs>
        <p>
          レトロニムかどうかの判断は、文献や立場によって分かれることがある。本図鑑では各項目に次のステータスを付けている。
        </p>
      </Paragraphs>
      <dl style={{ display: "grid", gap: ".75rem", margin: 0 }}>
        {(Object.keys(statusDescriptions) as RetronymStatus[]).map((status) => (
          <div
            key={status}
            style={{
              alignItems: "baseline",
              display: "grid",
              gap: ".75rem",
              gridTemplateColumns: "5rem 1fr",
            }}
          >
            <dt>
              <StatusBadge status={status} />
            </dt>
            <dd style={{ margin: 0 }}>{statusDescriptions[status]}</dd>
          </div>
        ))}
      </dl>
    </Section>

    <p>
      <Link href="/retronyms/" style={{ color: theme.accent, fontWeight: 700 }}>
        レトロニム一覧・検索（全{retronyms.length}件） →
      </Link>
    </p>
  </article>
)

export default Page
