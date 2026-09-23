export const site = {
  name: "Vanilla retronym",
  nameJa: "バニラ・レトロニム",
  url: "https://vrn.reload.co.jp",
  description:
    "新しいものが登場したことで、後から名前が付いた「レトロニム」を集めた図鑑。",
} as const

// openGraph はセグメント間で浅くマージされるため、各ページで展開して使う
export const openGraphBase = {
  type: "website",
  siteName: site.name,
  locale: "ja_JP",
} as const
