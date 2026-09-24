import { ogSize, renderOgImage } from "@/lib/og"

export const dynamic = "force-static"
export const alt = "レトロニムに付く言葉"
export const size = ogSize
export const contentType = "image/png"

const Image = () =>
  renderOgImage({
    heading: "レトロニムに付く言葉",
    sub: "天然・生・有線・アナログ・紙の……",
  })

export default Image
