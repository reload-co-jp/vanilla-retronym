import { Title } from "@/components/elements/layout"
import { theme } from "@/lib/theme"
import type { Metadata } from "next"
import Link from "next/link"
import { FC } from "react"

// ルートの title・description・og:url を引き継ぐとホームと重複するため上書きする
export const metadata: Metadata = {
  title: "ページが見つかりません",
  description: "お探しのページは見つかりませんでした。",
  openGraph: null,
  robots: { index: false },
}

const NotFound: FC = () => (
  <div style={{ display: "grid", gap: "1rem" }}>
    <Title style={{ fontSize: "1.875rem" }}>ページが見つかりません</Title>
    <p style={{ color: theme.muted }}>
      URLが間違っているか、ページが移動・削除された可能性がある。
    </p>
    <p style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      <Link href="/" style={{ color: theme.accent }}>
        ホーム →
      </Link>
      <Link href="/retronyms/" style={{ color: theme.accent }}>
        レトロニム一覧・検索 →
      </Link>
    </p>
  </div>
)

export default NotFound
