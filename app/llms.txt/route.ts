import { retronyms, statusLabels, statusSymbols } from "@/lib/retronyms"
import { site } from "@/lib/site"

export const dynamic = "force-static"

const statusLegend = Object.entries(statusLabels)
  .map(
    ([status, label]) =>
      `${statusSymbols[status as keyof typeof statusSymbols]} ${label}`,
  )
  .join(" / ")

const body = `# ${site.name}（${site.nameJa}）

> ${site.description}

レトロニムとは、新しいものの登場によって、従来のものを区別するために後から付けられた名前（例: 携帯電話の登場による「固定電話」）。各項目は見出し語・元の呼び名・きっかけとなった新しいもの・解説・ステータス（${statusLegend}）を持つ。

## ページ

- [トップ](${site.url}/): サイトのトップページ
- [レトロニム一覧](${site.url}/retronyms/): 収録しているレトロニムの一覧
- [このサイトについて](${site.url}/about/): サイトの趣旨・レトロニムの説明

## レトロニム

${retronyms
  .map(
    ({ id, name, originalName, trigger }) =>
      `- [${name}](${site.url}/retronyms/${id}/): 元の呼び名「${originalName}」、きっかけ「${trigger}」`,
  )
  .join("\n")}
`

export const GET = () =>
  new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
