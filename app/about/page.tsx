import { Breadcrumb } from "@/components/elements/breadcrumb"
import { JsonLd } from "@/components/elements/json-ld"
import { Section, Title } from "@/components/elements/layout"
import { FlowList, patterns, pick } from "@/components/retronym/flow"
import { StatusBadge } from "@/components/retronym/status-badge"
import { TagLink, TagList } from "@/components/retronym/tag"
import {
  getTags,
  RetronymStatus,
  retronyms,
  statusLabels,
} from "@/lib/retronyms"
import { openGraphBase, site } from "@/lib/site"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import Link from "next/link"
import { FC, ReactNode } from "react"

const title = "レトロニムとは？意味・語源・具体例をわかりやすく解説"
const description =
  "レトロニム（retronym）の意味・語源・生まれる仕組み・パターンを、固定電話やアナログ時計などの具体例とともにわかりやすく解説する。"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about/" },
  openGraph: {
    ...openGraphBase,
    description,
    title,
    url: "/about/",
  },
}

const statusDescriptions: Record<RetronymStatus, string> = {
  confirmed: "辞書や文献などで、レトロニムとして一般に認められているもの。",
  disputed:
    "レトロニムとみなすかどうか、見解が分かれているもの。成り立ちに別の説がある場合も含む。",
  candidate:
    "レトロニムとしての用法が見られるものの、まだ定着しているとは言い切れないもの。",
}

// FAQPage のリッチリザルトは 2023 年以降、政府・医療系の権威あるサイトに限定されたため構造化データは付けない。
const faqs: { question: string; answer: string }[] = [
  {
    question: "レトロニムとは何ですか？",
    answer:
      "新しいものが登場したことで、それまで単独の名前で呼ばれていたものを区別するために、後から付けられた名前のこと。",
  },
  {
    question: "レトロニムの具体例は？",
    answer:
      "携帯電話の普及で生まれた「固定電話」、デジタル時計の登場で生まれた「アナログ時計」、電子書籍の登場で生まれた「紙の本」などがある。",
  },
  {
    question: "レトロニムと新語の違いは？",
    answer:
      "新語は新しく作られた言葉全般を指す。レトロニムも新語の一種ですが、指す対象が昔からあるものである点が特徴。「携帯電話」は新語、「固定電話」はレトロニム。",
  },
  {
    question: "なぜレトロニムが生まれるのですか？",
    answer:
      "新しいものが普及して「普通」になると、元の名前だけではどちらを指すのか曖昧になるため。そこで元のものを言い分けるための名前が必要になる。",
  },
  {
    question: "レトロニムと対義語の違いは？",
    answer:
      "対義語は意味が反対の関係にある言葉。レトロニムは新しいものと区別するために、元からあるものを呼び直した名前で、指しているもの自体は変わっていない。",
  },
  {
    question: "英語ではレトロニムを何と呼びますか？",
    answer:
      "英語では retronym という。「さかのぼって」を意味する retro- と「名前」を意味する -onym を組み合わせた語。",
  },
]

const Paragraphs: FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ display: "grid", gap: ".875rem", lineHeight: 1.9 }}>
    {children}
  </div>
)

const Muted: FC<{ children: ReactNode }> = ({ children }) => (
  <p style={{ color: theme.muted, fontSize: ".875rem" }}>{children}</p>
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
        headline: title,
        description,
        url: `${site.url}/about/`,
        inLanguage: "ja",
        publisher: {
          "@type": "Organization",
          name: "Reload",
          url: "https://reload.co.jp",
        },
        isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
      }}
    />
    <Breadcrumb items={[{ name: "レトロニムとは", href: "/about/" }]} />
    <section style={{ display: "grid", gap: ".625rem" }}>
      <Title style={{ fontSize: "2.25rem", lineHeight: 1.35 }}>
        レトロニムとは？
      </Title>
      <p style={{ color: theme.muted }}>
        レトロニム（retronym）の意味・語源・生まれる仕組みを、具体例とともに解説する。
      </p>
    </section>

    <Section heading="レトロニムの意味">
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

    <Section heading="レトロニムの語源">
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

    <Section heading="レトロニムの生まれる仕組み">
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
      <p>
        <Link
          href="/modifiers/"
          style={{ color: theme.accent, fontSize: ".875rem" }}
        >
          レトロニムに付く言葉の一覧 →
        </Link>
      </p>
    </Section>

    <Section heading="レトロニムと似た言葉">
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

    <Section heading="レトロニムの具体例">
      <Paragraphs>
        <p>
          代表的なレトロニムを、作られ方のパターン別・分野別にまとめている。
        </p>
      </Paragraphs>
      <FlowList
        retronyms={pick(["fixed-phone", "analog-clock", "paper-book"])}
      />
      <p>
        <Link
          href="/retronyms/examples/"
          style={{ color: theme.accent, fontSize: ".875rem" }}
        >
          レトロニムの具体例・代表例一覧 →
        </Link>
      </p>
    </Section>

    <Section heading="レトロニムの一覧">
      <Paragraphs>
        <p>
          本図鑑には{retronyms.length}
          件のレトロニムを収録している。名前・元の名称・きっかけから検索したり、分野ごとに見たりできる。
        </p>
      </Paragraphs>
      <TagList>
        {getTags()
          .slice(0, 10)
          .map(({ name }) => (
            <TagLink key={name} tag={name} />
          ))}
      </TagList>
      <p>
        <Link
          href="/retronyms/"
          style={{ color: theme.accent, fontSize: ".875rem" }}
        >
          レトロニム一覧・検索 →
        </Link>
      </p>
    </Section>

    <Section heading="よくある質問">
      <dl style={{ display: "grid", gap: "1.25rem", margin: 0 }}>
        {faqs.map(({ question, answer }) => (
          <div key={question} style={{ display: "grid", gap: ".25rem" }}>
            <dt style={{ fontWeight: 700 }}>{question}</dt>
            <dd style={{ lineHeight: 1.9, margin: 0 }}>{answer}</dd>
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
              gridTemplateColumns: "7rem 1fr",
            }}
          >
            <dt>
              <StatusBadge status={status} /> {statusLabels[status]}
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
