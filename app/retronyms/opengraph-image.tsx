import { ogSize, renderOgImage } from "@/lib/og"
import { retronyms } from "@/lib/retronyms"

export const dynamic = "force-static"
export const alt = "レトロニム一覧・検索"
export const size = ogSize
export const contentType = "image/png"

const Image = () =>
  renderOgImage({
    heading: "レトロニム一覧・検索",
    sub: `収録 ${retronyms.length} 件`,
  })

export default Image
