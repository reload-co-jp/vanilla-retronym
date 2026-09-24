import { Retronym, retronyms } from "@/lib/retronyms"

export type ModifierPosition = "prefix" | "suffix"

export type Modifier = {
  /** 付け足された言葉 */
  label: string
  position: ModifierPosition
  retronyms: Retronym[]
}

export type ModifierGroup = {
  heading: string
  body: string
  modifiers: Modifier[]
}

/** 「世界大戦（大戦）」のような補足の括弧書きを除く。 */
const stripNote = (name: string): string =>
  name.replace(/[（(].*?[）)]/g, "").trim()

/** 言葉の前後に残る空白・記号を除く。 */
const trimLabel = (label: string): string =>
  label.replace(/^[\s:：/・-]+|[\s:：/・-]+$/g, "")

/**
 * レトロニムに付け足された言葉を取り出す。
 * `modifier` があればそれを使い、なければ name と originalName の差分から抽出する。
 */
export const getModifier = (
  retronym: Retronym
): { label: string; position: ModifierPosition } | undefined => {
  if (retronym.modifier) {
    return { label: retronym.modifier, position: "prefix" }
  }
  const name = retronym.name.toLowerCase()
  const original = stripNote(retronym.originalName).toLowerCase()
  if (original === "" || name === original) return undefined
  if (name.endsWith(original)) {
    const label = trimLabel(
      retronym.name.slice(0, retronym.name.length - original.length)
    )
    return label === "" ? undefined : { label, position: "prefix" }
  }
  if (name.startsWith(original)) {
    const label = trimLabel(retronym.name.slice(original.length))
    return label === "" ? undefined : { label, position: "suffix" }
  }
  return undefined
}

/** 付け足された言葉ごとにまとめ、該当数の多い順に並べる。 */
export const getModifiers = (items: Retronym[] = retronyms): Modifier[] => {
  const map = new Map<string, Modifier>()
  for (const retronym of items) {
    const modifier = getModifier(retronym)
    if (modifier === undefined) continue
    const key = `${modifier.position}:${modifier.label}`
    const entry = map.get(key) ?? { ...modifier, retronyms: [] }
    entry.retronyms.push(retronym)
    map.set(key, entry)
  }
  return [...map.values()].sort(
    (a, b) =>
      b.retronyms.length - a.retronyms.length ||
      a.label.localeCompare(b.label, "ja")
  )
}

/** 前に付く言葉を、区別のしかたごとに分類するための対応表。 */
const groupDefinitions: { heading: string; body: string; labels: string[] }[] =
  [
    {
      heading: "本物・自然であることを示す",
      body: "人工物・合成品・代用品・バーチャルなものが現れたことで、元のものが「本来の姿」であると言い直す言葉。",
      labels: [
        "天然",
        "自然",
        "本",
        "生",
        "実",
        "リアル",
        "リア",
        "純",
        "正",
        "正規",
        "Real",
        "Raw",
        "Natural",
        "有機",
        "醸造",
        "全粒",
        "Dairy",
      ],
    },
    {
      heading: "物理的な形・素材を示す",
      body: "デジタル化・電子化・使い捨て化などで、元のものが「形のあるもの」「特定の素材でできたもの」として区別される。",
      labels: [
        "紙の",
        "物理",
        "フィジカル",
        "手書き",
        "手書きの",
        "手描き",
        "布",
        "固形",
        "Hard",
        "Hardcover",
        "Over-the-board",
      ],
    },
    {
      heading: "つながり方・置き方を示す",
      body: "無線化・携帯化・配信化で、元のものが「線でつながっている」「決まった場所にある」ことを表す言葉が付く。",
      labels: [
        "有線",
        "ワイヤード",
        "固定",
        "デスクトップ",
        "地上波",
        "Surface",
        "Linear",
      ],
    },
    {
      heading: "人の手・人力であることを示す",
      body: "自動化・電動化・無人化で、元のものが「人が操作する」「人がいる」ものとして区別される。",
      labels: [
        "手動",
        "マニュアル",
        "ハンド",
        "足踏み式",
        "有人",
        "対面",
        "Human",
        "Horse",
        "Hand",
      ],
    },
    {
      heading: "古い技術・方式を示す",
      body: "新しい技術が主流になったことで、元のものの仕組みそのものが名前に入る。",
      labels: [
        "アナログ",
        "フィルム",
        "白黒",
        "モノクロ",
        "サイレント",
        "ブラウン管",
        "白熱",
        "AM",
        "SP",
        "ダイヤル式",
        "機械式",
        "ボール",
        "蒸気",
        "ガソリン",
        "Steam",
        "Tube",
        "Prop",
        "アコースティック",
        "パイプ",
        "ウッド",
        "自然吸気",
        "無誘導",
        "Mainframe",
        "Parallel",
        "Pre-dreadnought",
      ],
    },
    {
      heading: "普通・従来であることを示す",
      body: "新しいものが「特別」ではなくなったとき、元のものを「普通の」「昔からの」と言い直す言葉。",
      labels: [
        "普通",
        "通常",
        "在来",
        "旧",
        "クラシック",
        "Classic",
        "レトロ",
        "レガシー",
        "トラディショナル",
        "オーセンティック",
        "プレーン",
        "Old",
        "旧約",
        "Conventional",
      ],
    },
    {
      heading: "番号・順序を振る",
      body: "二番目や続編が現れて初めて、最初のものに番号が付く。",
      labels: ["第一次", "一次", "初代", "Erste"],
    },
    {
      heading: "状態・用途を示す",
      body: "新しい種類が出てきたことで、元のものの温度・形・用途を言い添える。",
      labels: ["ホット", "長", "雨", "食", "水", "堅焼き"],
    },
    {
      heading: "出自・土地を示す",
      body: "外から似たものが入ってきたことで、元のものに国名や地名が付く。",
      labels: ["日本", "インド", "イギリス", "漢方", "English"],
    },
  ]

/**
 * 前に付く言葉を分類する。対応表にない言葉は「その他」に入るため、
 * レトロニムを追加すればページにも自動で反映される。
 */
export const getModifierGroups = (
  items: Retronym[] = retronyms
): ModifierGroup[] => {
  const prefixes = getModifiers(items).filter((m) => m.position === "prefix")
  const groups = groupDefinitions.map(({ heading, body, labels }) => ({
    heading,
    body,
    modifiers: prefixes.filter((m) => labels.includes(m.label)),
  }))
  const grouped = new Set(groupDefinitions.flatMap(({ labels }) => labels))
  groups.push({
    heading: "その他",
    body: "上のどれにも分類していない言葉。",
    modifiers: prefixes.filter((m) => !grouped.has(m.label)),
  })
  return groups.filter(({ modifiers }) => modifiers.length > 0)
}

export const getSuffixModifiers = (items: Retronym[] = retronyms): Modifier[] =>
  getModifiers(items).filter((m) => m.position === "suffix")
