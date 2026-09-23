import { site } from "@/lib/site"
import { theme } from "@/lib/theme"
import { ImageResponse } from "next/og"

export const ogSize = { width: 1200, height: 630 }

/** 使用文字だけ含む Noto Serif JP (ttf) を Google Fonts から取得 */
const loadFont = async (text: string) => {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&text=${encodeURIComponent(text)}`
  ).then((res) => res.text())
  const url = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
  )?.[1]
  if (!url) throw new Error("Failed to load font for OG image")
  return fetch(url).then((res) => res.arrayBuffer())
}

export const renderOgImage = async ({
  heading,
  sub,
}: {
  heading: string
  sub?: string
}) => {
  const text = `${heading}${sub ?? ""}${site.name}レトロニム図鑑`
  return new ImageResponse(
    <div
      style={{
        background: theme.background,
        borderTop: `16px solid ${theme.accent}`,
        color: theme.text,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Noto Serif JP",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 88px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: heading.length > 12 ? 72 : 96,
            lineHeight: 1.3,
          }}
        >
          {heading}
        </div>
        {sub && (
          <div style={{ color: theme.muted, fontSize: 40, lineHeight: 1.5 }}>
            {sub}
          </div>
        )}
      </div>
      <div
        style={{
          alignItems: "baseline",
          borderTop: `2px solid ${theme.border}`,
          display: "flex",
          gap: 24,
          paddingTop: 32,
        }}
      >
        <div style={{ color: theme.accent, fontSize: 40 }}>{site.name}</div>
        <div style={{ color: theme.muted, fontSize: 28 }}>レトロニム図鑑</div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Noto Serif JP", data: await loadFont(text), weight: 700 },
      ],
    }
  )
}
