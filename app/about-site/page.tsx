import { Breadcrumb } from "@/components/elements/breadcrumb"
import { Section, Title } from "@/components/elements/layout"
import { openGraphBase } from "@/lib/site"
import type { Metadata } from "next"
import { FC, ReactNode } from "react"

const title = "このサイトについて"
const description =
  "レトロニムを通じて、身の回りで起きてきた環境の変化、新しい技術、新しい文化を感じられる、プレーンなサイトを目指している。"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about-site/" },
  openGraph: {
    ...openGraphBase,
    description,
    title,
    url: "/about-site/",
  },
}

const Paragraphs: FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ display: "grid", gap: ".875rem", lineHeight: 1.9 }}>
    {children}
  </div>
)

const Page: FC = () => (
  <article style={{ display: "grid", gap: "3rem" }}>
    <Breadcrumb items={[{ name: title, href: "/about-site/" }]} />
    <Title style={{ fontSize: "2.25rem", lineHeight: 1.35 }}>{title}</Title>

    <Section heading="言葉から、変化を感じる">
      <Paragraphs>
        <p>
          このサイトでは、レトロニムを通じて、私たちの身の回りで起きてきた
          <strong>環境の変化、新しい技術、新しい文化</strong>
          を感じられるような体験を目指しています。
        </p>
        <p>
          レトロニムとは、もともと一つの名前で呼ばれていたものに、新しいものとの区別のため、後から付けられた名前のことです。
        </p>
        <p>
          何気ない言葉の中にも、「なぜこの言葉が必要になったのか」をたどると、その背景にある時代の変化が見えてきます。
        </p>
      </Paragraphs>
    </Section>

    <Section heading="Vanilla">
      <Paragraphs>
        <p>
          「vanilla」は、素のまま、標準の、手を加えていないものを表す言葉として使われます。
        </p>
        <p>
          レトロニムの世界でも、後から生まれたものに対して、
          <strong>もともとのもの、そのままのもの</strong>
          を指す言葉として使われています。
        </p>
        <p>このサイトも、そんな「vanilla」のように。</p>
        <p>
          余計なものを加えず、レトロニムそのものをそのまま眺められる、
          <strong>プレーンなサイト</strong>を目指しています。
        </p>
        <p>言葉を眺めることで、少しだけ時代の変化が見えてくる。</p>
        <p>そんな体験を届けられればと思っています。</p>
      </Paragraphs>
    </Section>

    <Section heading="運営会社">
      <Paragraphs>
        <p>
          <a href="https://reload.co.jp" target="_blank" rel="noopener noreferrer">
            株式会社リロード
          </a>
        </p>
      </Paragraphs>
    </Section>
  </article>
)

export default Page
