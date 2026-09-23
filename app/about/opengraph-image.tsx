import { ogSize, renderOgImage } from "@/lib/og"

export const dynamic = "force-static"
export const alt = "レトロニムとは"
export const size = ogSize
export const contentType = "image/png"

const Image = () =>
  renderOgImage({
    heading: "レトロニムとは",
    sub: "新しいものの登場で、後から付いた名前",
  })

export default Image
