---
name: add-retronym
description: data/retronyms.json にレトロニムを追加する。「レトロニム追加」「〇〇を追加して」「/add-retronym <語>」で起動。
---

# レトロニム追加

引数: 追加する語（複数可）。未指定なら聞く。

## 手順

1. **重複確認**: `data/retronyms.json` で `name` / `aliases` / `originalName` を grep。既存なら追加せず、別名なら既存項目の `aliases` に足す。
2. **ルール確認**: `README.md` の「4.2 フィールド仕様」〜「4.6 details（概要）」を読み、書き分け・文体・事実確認のルールに従う。
3. **調査**: WebSearch / WebFetch で出典を集める。
   - 一次資料・辞書（コトバンク等）優先、Wikipedia は補助。
   - 呼称の由来を明記した出典が無ければ `status` を `disputed` / `candidate` にし、本文で断定しない。
   - `sources` の URL は実際にアクセスできたものだけ登録。
4. **追加**: 配列末尾に追記。既存項目と同じフィールド順・2スペースインデント。
   - `id`: 英語 kebab-case か ローマ字（例 `silent-film`, `hirushoku`）。一意。
   - `language` が `ja` 以外なら `translation` 必須。
   - `tags` は既存タグを優先（下の「既存タグ集計」で確認）。
   - 関連項目があれば `relatedIds` を相互に張る（相手側にも追加）。
5. **検証**: `pnpm prettier --write data/retronyms.json && pnpm test`。
6. **報告**: 追加した語・status・出典数を1行ずつ。コミットは頼まれた時だけ（メッセージは `Add retronym`）。

## 既存タグ集計

```sh
node -e 'const c={};for(const r of require("./data/retronyms.json"))for(const t of r.tags)c[t]=(c[t]||0)+1;console.log(Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([t,n])=>t+":"+n).join(" "))'
```
