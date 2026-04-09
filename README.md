# PyCode Hub Blog

一个适合静态部署的个人技术博客模板，基于 Next.js App Router 构建，当前内容以本地静态文章数据为主。

## 现在它是什么

这次改造把原本依赖 Prisma、SQLite 和 `/api/*` 的应用，调整成了更适合 GitHub Pages 和其他静态托管平台的博客站点。

你现在会得到：

- 一个静态首页
- 一个静态文章详情页
- 本地文章数据源 `src/lib/posts.ts`
- 适配静态导出的 `next.config.ts`

## 开发

```bash
bun install
bun run dev
```

或：

```bash
npm install
npm run dev
```

## 构建

```bash
bun run build
```

`next.config.ts` 已启用 `output: "export"`，构建后可以部署到支持静态文件的网站托管平台。

## 内容维护

当前文章数据集中在：

- `src/lib/posts.ts`

你可以继续往这里添加文章对象，网站会在构建时自动生成新的静态页面。

## 部署说明

如果你打算部署到 GitHub Pages，需要注意两点：

- 这个仓库名不是 `username.github.io`，通常意味着它会以项目路径形式部署
- 如果后续你确认要直接挂在仓库子路径下，可能还需要再补 `basePath` 配置

## 技术栈

- Next.js 16
- TypeScript
- Tailwind CSS 4
- shadcn/ui

## 下一步建议

- 把 `src/lib/posts.ts` 迁移成 Markdown 或 MDX 文章目录
- 加一页 About 页面
- 根据你的 GitHub Pages 域名补上 `basePath`
