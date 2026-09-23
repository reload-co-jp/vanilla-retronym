import { ogSize, renderOgImage } from "@/lib/og"
import { site } from "@/lib/site"

export const dynamic = "force-static"
export const alt = `${site.name} - レトロニム図鑑`
export const size = ogSize
export const contentType = "image/png"

const Image = () =>
  renderOgImage({
    heading: "後から名前が付いたもの",
    sub: "新しいものの登場で生まれた「レトロニム」を集めた図鑑",
  })

export default Image
