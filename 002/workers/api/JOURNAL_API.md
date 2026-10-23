# 日记接口（给 AI / 脚本用）

Evan 的私人日记，加密存在 Worker 里。拿到密码的 AI 可以直接读写，不用碰网站代码，也不用提交任何东西。

- 地址：`https://evanlin-api.jiaedwin0605.workers.dev`
- 鉴权：每个请求带 `Authorization: Bearer <密码>`。密码由 Evan 告诉你，**不要写进任何文件、提交或日志**。
- 日期一律 `YYYY-MM-DD`；正文是 Markdown：`#` 题目，`##` 一节，整行加粗是小标题，`-` 列表，其余一行一段。
- 同一个 IP 连错 8 次会被锁 15 分钟，别瞎猜。

| 做什么 | 请求 |
|---|---|
| 列出全部（含正文） | `GET /journal` |
| 读一篇 | `GET /journal/2026-10-12` → `{ date, md }` |
| 整篇替换（没有就新建） | `PUT /journal/2026-10-12`，body `{"md": "..."}` |
| 往某一节末尾加几行 | `POST /journal/2026-10-12/append`，body `{"section": "我的感悟", "text": "..."}`；没有这一节就新开，没有这篇就新建；不写 `section` 就接在文末 |
| 删除 | `DELETE /journal/2026-10-12` |

```sh
curl -H "Authorization: Bearer $JOURNAL_PASSWORD" -H 'Content-Type: application/json' \
  -d '{"section":"我的感悟（Edwin）","text":"今天最大的收获是专注。"}' \
  https://evanlin-api.jiaedwin0605.workers.dev/journal/2026-10-12/append
```

仓库里也有现成的命令行（本地调试设 `JOURNAL_API=http://localhost:8787`）：

```sh
JOURNAL_PASSWORD=... node pipeline/journal.mjs list
JOURNAL_PASSWORD=... node pipeline/journal.mjs append 2026-10-12 "今天很专注" --section "我的感悟（Edwin）"
```

在 Evan 自己的 Mac 上，密码存在钥匙串里（服务名 `evanlin-journal`）。命令行没设 `JOURNAL_PASSWORD` 时会自己去钥匙串取，AI 直接跑 `node pipeline/journal.mjs …` 就行，不用碰密码。换了密码就用同一条命令再存一次：

```sh
security add-generic-password -U -s evanlin-journal -a "$USER" -w
```

改之前先 `GET` 一遍；整篇 `PUT` 会覆盖掉原文，只想补一句就用 `append`。
