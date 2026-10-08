# Evan 的个人网站

这个仓库里有两代网站，各占一个文件夹：

| 文件夹 | 内容 | 状态 |
|---|---|---|
| [`002/`](002/) | 现在的网站：一张桌子，十个宇宙。Blender 渲染 + WebGL，纯静态站 | 在用 |
| [`001/`](001/) | 上一代网站：Next.js 15 作品集（博客、项目、摄影、新闻） | 存档，不再更新 |

怎么跑、怎么重新出图、怎么改成你自己的，见 [`002/README.md`](002/README.md)。
`002/` 的创意来自抖音 @硕哥，梦想哭了 的个人网站，用 Claude + Blender 做的。
`002/` 里的摄影、新闻、博客、项目数据是从 `001/` 导入的，导入脚本在 `002/pipeline/import_legacy.mjs`。

## 只想要现在这个站

`001/` 里存着一千多张原图，整个仓库有 1.7 GB。只要 `002/` 的话，这样拉：

```sh
git clone --filter=blob:none --sparse https://github.com/EdwinjJ1/personal-website.git
cd personal-website
git sparse-checkout set 002
```

## 许可

代码以 [MIT](LICENSE) 协议开源。两个文件夹里的摄影作品、文字内容和个人形象不在此列，版权归作者所有。
