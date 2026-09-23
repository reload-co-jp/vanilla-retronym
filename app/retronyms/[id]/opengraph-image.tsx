import { getRetronym, retronyms } from "@/lib/retronyms"
import { ogSize, renderOgImage } from "@/lib/og"

export const dynamic = "force-static"
export const alt = "レトロニム"
export const size = ogSize
export const contentType = "image/png"

export const generateStaticParams = () => retronyms.map(({ id }) => ({ id }))

const Image = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const retronym = getRetronym(id)
  return renderOgImage({
    heading: retronym?.name ?? "レトロニム",
    sub: retronym
      ? `もともとは「${retronym.originalName}」と呼ばれていた`
      : undefined,
  })
}

export default Image
