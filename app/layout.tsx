import { Footer, Header, Main } from "@/components/elements/layout"
import { openGraphBase, site } from "@/lib/site"
import { articlePath, articles } from "@/lib/articles"
import { getTags, tagPath } from "@/lib/retronyms"
import { GoogleAnalytics } from "@next/third-parties/google"
import type { Metadata } from "next"
import {
  Instrument_Serif,
  Inter,
  Noto_Sans_JP,
  Noto_Serif_JP,
} from "next/font/google"
import Link from "next/link"
import Script from "next/script"
import "./reset.css"

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-serif",
  display: "swap",
})

// 英字の見出し・ロゴ用セリフ体
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
})

// 英字のラベル・ナビゲーション用サンセリフ体
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
})

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `レトロニム図鑑 - ${site.name}`,
    // 「〇〇 レトロニム」検索に合わせ、カタカナ表記を全ページのタイトルに含める
    template: `%s | ${site.nameJa}`,
  },
  description: site.description,
  openGraph: {
    ...openGraphBase,
    title: `レトロニム図鑑 - ${site.name}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
  },
}

const Logo = () => (
  <Link href="/" className="logo" aria-label={`${site.name} ホーム`}>
    <span className="logo__mark" aria-hidden>
      VRN
    </span>
    <span className="logo__text">
      <span className="logo__name">Vanilla Retronym</span>
      <span className="logo__ja">{site.nameJa}</span>
    </span>
  </Link>
)

const navItems = [
  { href: "/retronyms/", label: "Retronyms" },
  { href: "/#categories", label: "Categories" },
  { href: "/about/", label: "About" },
  { href: "/retronyms/#search", label: "Search" },
]

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const topTags = getTags().slice(0, 8)
  return (
    <html
      lang="ja"
      className={`${notoSerifJP.variable} ${notoSansJP.variable} ${instrumentSerif.variable} ${inter.variable}`}
    >
      <body>
        <Header>
          <Logo />
          <nav aria-label="メインメニュー">
            <ul className="site-nav">
              {navItems.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </Header>
        <Main>{children}</Main>
        <Footer>
          <div className="site-footer__about">
            <Logo />
            <p style={{ marginTop: "1rem", maxWidth: "22rem" }}>
              {site.nameJa}
              は、新しいものの登場によって後から名前が付いた言葉「レトロニム」を集める図鑑。
            </p>
          </div>
          <nav aria-label="サイトについて">
            <h2>About</h2>
            <ul>
              <li>
                <Link href="/about/">レトロニムとは</Link>
              </li>
              <li>
                <Link href="/about-site/">このサイトについて</Link>
              </li>
              <li>
                <Link href="/modifiers/">付け足された言葉</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="カテゴリ">
            <h2>Categories</h2>
            <ul>
              {topTags.map(({ name }) => (
                <li key={name}>
                  <Link href={tagPath(name)}>{name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="レトロニム">
            <h2>Retronyms</h2>
            <ul>
              <li>
                <Link href="/retronyms/">一覧・検索</Link>
              </li>
              <li>
                <Link href="/retronyms/examples/">具体例・代表例</Link>
              </li>
              <li>
                <Link href="/articles/">記事一覧</Link>
              </li>
              {articles.map(({ slug, title }) => (
                <li key={slug}>
                  <Link href={articlePath(slug)}>{title.split("｜")[0]}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="site-footer__copy">&copy; Reload</p>
        </Footer>
      </body>
      <GoogleAnalytics gaId="G-QX44CQXJVG" />
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6542845006087970"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </html>
  )
}
export default RootLayout
