import { JsonLd } from "@/components/elements/json-ld"
import { site } from "@/lib/site"
import { theme } from "@/lib/theme"
import Link from "next/link"
import { FC, Fragment } from "react"

export type BreadcrumbItem = { name: string; href: string }

// 先頭にホームを補い、最後の項目は現在のページとして扱う。
export const Breadcrumb: FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const trail = [{ name: "ホーム", href: "/" }, ...items]

  return (
    <nav aria-label="パンくずリスト">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map(({ name, href }, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name,
            item: `${site.url}${href}`,
          })),
        }}
      />
      <ol
        style={{
          color: theme.muted,
          display: "flex",
          flexWrap: "wrap",
          fontSize: ".75rem",
          gap: ".375rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {trail.map(({ name, href }, index) => {
          const current = index === trail.length - 1
          return (
            <Fragment key={href}>
              {index > 0 && <li aria-hidden>/</li>}
              <li>
                {current ? (
                  <span aria-current="page">{name}</span>
                ) : (
                  <Link href={href} style={{ color: theme.muted }}>
                    {name}
                  </Link>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
