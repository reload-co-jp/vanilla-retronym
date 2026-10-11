import { JsonLd } from "@/components/elements/json-ld"
import { pick } from "@/components/retronym/flow"
import { entryNumber, Plate, PlateTone } from "@/components/retronym/plate"
import {
  getTags,
  newestRetronyms,
  retronymPath,
  retronyms,
  tagPath,
} from "@/lib/retronyms"
import { openGraphBase, site } from "@/lib/site"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

// 一覧・検索できる図鑑であることを検索結果で伝える。件数はデータから生成する
const title = `レトロニム図鑑｜後から名前が付いた言葉の一覧・検索 - ${site.name}`
const description = `${site.description}固定電話・フィルムカメラなど全${retronyms.length}件を、タグやキーワードで一覧・検索できる。`

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { ...openGraphBase, title, description, url: "/" },
}

const featured: { id: string; tone: PlateTone }[] = [
  { id: "fixed-phone", tone: "cobalt" },
  { id: "film-camera", tone: "ink" },
  { id: "paper-book", tone: "paper" },
]

const Page: FC = () => {
  const tags = getTags()
  const newest = newestRetronyms(6)
  const featuredItems = pick(featured.map(({ id }) => id))

  return (
    <div className="wide home">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          alternateName: [site.nameJa, "レトロニム図鑑"],
          url: site.url,
          description: site.description,
          inLanguage: "ja",
          publisher: {
            "@type": "Organization",
            name: "Reload",
            url: "https://reload.co.jp",
          },
        }}
      />

      <section className="hero">
        <div>
          <h1>
            {/* 日本語の検索意図に合わせ、見出しに「レトロニム図鑑」を含める */}
            <span className="hero__kicker">
              {site.name}｜{site.nameJa}｜レトロニム図鑑
            </span>
            <span className="hero__copy">
              言葉が変わる。
              <br />
              <em>世界の見え方</em>が
              <wbr />
              変わる。
            </span>
          </h1>
          <p className="hero__lead">
            携帯電話が生まれて、電話は「固定電話」になった。新しいものの登場によって、後から名前が付いた言葉を「レトロニム」と呼ぶ。
            {site.nameJa}は、全{retronyms.length}
            語のレトロニムから、技術・文化・社会の変化を読み解くアーカイブ。
          </p>
          <p className="hero__actions">
            <Link href="/about-site/" className="textlink">
              VRNについて <span className="arrow">→</span>
            </Link>
            <Link href="/about/" className="textlink">
              レトロニムとは <span className="arrow">→</span>
            </Link>
          </p>
        </div>
        <Image
          src="/hero.webp"
          alt="タイプライター、スマートフォン、カセットテープ、街の古い写真を重ねたコラージュ。紙片に「retrospective → re + synonym → retronym」「telephone → smartphone」と書かれている"
          width={1600}
          height={902}
          sizes="(max-width: 52rem) 100vw, 55vw"
          preload
          className="hero__image"
        />
      </section>

      <section aria-labelledby="featured">
        <div className="section-head">
          <h2 id="featured">Featured Words</h2>
          <p>注目のレトロニム</p>
        </div>
        <ul className="featured">
          {featuredItems.map((retronym, index) => (
            <li key={retronym.id} className="linkcard">
              <Plate retronym={retronym} tone={featured[index].tone} />
              <span className="en-label linkcard__meta">
                <span>{retronym.id.replaceAll("-", " ")}</span>
                <span>{retronym.tags[0]}</span>
              </span>
              <h3>
                <Link href={retronymPath(retronym.id)}>{retronym.name}</Link>
              </h3>
              <p className="linkcard__desc">{retronym.description}</p>
              <span className="textlink" aria-hidden>
                読む <span className="arrow">→</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="concept" aria-labelledby="concept">
        <p className="en-label concept__label">Concept</p>
        <h2 id="concept" className="concept__quote">
          言葉は、
          <br />
          社会の変化を
          <br />
          映す鏡だ。
        </h2>
        <div className="concept__body">
          <p>
            ふつうの「電話」が「固定電話」に、ただの「カメラ」が「フィルムカメラ」に。新しい技術や習慣が現れるたび、それまで当たり前だったものは、名前を付け直されて区別される。
          </p>
          <p>
            レトロニムをたどることは、何が新しく、何が当たり前でなくなったのかを見つけること。言葉の小さな変化から、技術と文化の大きな移り変わりが見えてくる。
          </p>
          <p>
            <Link href="/retronyms/examples/" className="textlink">
              レトロニムの具体例・代表例一覧 <span className="arrow">→</span>
            </Link>
          </p>
        </div>
      </section>

      <section className="index" aria-label="新着">
        <div>
          <h2>New Entries — 新着</h2>
          <ul className="newslist">
            {newest.map((retronym, index) => (
              <li key={retronym.id} className="linkcard">
                <Plate
                  retronym={retronym}
                  tone={index % 3 === 0 ? "cobalt" : "paper"}
                  compact
                />
                <div>
                  <h3>
                    <Link href={retronymPath(retronym.id)}>
                      {retronym.name}
                    </Link>
                  </h3>
                  <p className="en-label linkcard__meta">
                    <span>
                      No.{String(entryNumber(retronym)).padStart(3, "0")}
                    </span>
                    <span>{retronym.tags[0]}</span>
                    <span>{retronym.originalName} →</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: "1.5rem" }}>
            <Link href="/retronyms/" className="textlink">
              レトロニム一覧・検索（全{retronyms.length}件）{" "}
              <span className="arrow">→</span>
            </Link>
          </p>
        </div>

        <aside className="aboutbox" aria-labelledby="about-vrn">
          <h2 id="about-vrn">About VRN</h2>
          <p
            className="en-serif"
            style={{ fontSize: "1.75rem", lineHeight: 1.2 }}
          >
            Vanilla Retronym
          </p>
          <p>{site.description}</p>
          <p>
            新しいものとの区別のために「固定」「アナログ」「紙の」などが付け足された言葉を、背景や使われ方とともに記録している。
          </p>
          <p>
            <Link href="/about-site/" className="textlink">
              このサイトについて <span className="arrow">→</span>
            </Link>
          </p>
        </aside>
      </section>

      <nav id="categories" aria-labelledby="categories-heading">
        <div className="section-head">
          <h2 id="categories-heading">Categories</h2>
          <p>カテゴリ一覧</p>
        </div>
        <ul className="catlist">
          {tags.map(({ name, count }) => (
            <li key={name}>
              <Link href={tagPath(name)}>
                {name}
                <span>{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Page
