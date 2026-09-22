import { retronyms } from "@/lib/retronyms"
import { site } from "@/lib/site"
import type { MetadataRoute } from "next"

export const dynamic = "force-static"

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: `${site.url}/`,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${site.url}/retronyms/`,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  ...retronyms.map(({ id }) => ({
    url: `${site.url}/retronyms/${id}/`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })),
]

export default sitemap
