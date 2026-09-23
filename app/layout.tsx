import { Footer, Header, Main } from "@/components/elements/layout"
import { openGraphBase, site } from "@/lib/site"
import { theme } from "@/lib/theme"
import { GoogleAnalytics } from "@next/third-parties/google"
import type { Metadata } from "next"
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google"
import Link from "next/link"
import "./reset.css"

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-serif",
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
    default: `${site.name} - レトロニム図鑑`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    ...openGraphBase,
    title: `${site.name} - レトロニム図鑑`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="ja"
      className={`${notoSerifJP.variable} ${notoSansJP.variable}`}
    >
      <body>
        <Header>
          <nav
            style={{
              alignItems: "baseline",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Link
                href="/"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  letterSpacing: ".01em",
                  textDecoration: "none",
                }}
              >
                {site.name}
              </Link>
            </div>
            <div
              style={{
                alignItems: "baseline",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <Link
                href="/about/"
                style={{
                  color: theme.muted,
                  fontSize: ".8125rem",
                  letterSpacing: ".02em",
                  textDecoration: "none",
                }}
              >
                レトロニムとは
              </Link>

              <Link
                href="/retronyms/"
                style={{
                  color: theme.muted,
                  fontSize: ".8125rem",
                  letterSpacing: ".02em",
                  textDecoration: "none",
                }}
              >
                一覧・検索
              </Link>
            </div>
          </nav>
        </Header>
        <Main>{children}</Main>
        <Footer>
          <p>
            {site.name} — 後から名前が付いたものを集める図鑑。
            <br />
            &copy; Reload
          </p>
        </Footer>
      </body>
      <GoogleAnalytics gaId="G-QX44CQXJVG" />
    </html>
  )
}
export default RootLayout
