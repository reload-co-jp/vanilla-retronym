import { site } from "@/lib/site"
import type { MetadataRoute } from "next"

export const dynamic = "force-static"

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
  },
  sitemap: `${site.url}/sitemap.xml`,
})

export default robots
