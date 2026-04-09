import Link from "next/link";
import { ArrowRight, BookText, Code2, PenTool, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAllPosts, getFeaturedPosts } from "@/lib/posts";

const writingPrinciples = [
  "用项目复盘代替空泛总结",
  "把踩坑过程写清楚，而不只给结论",
  "让每篇文章都能直接帮助下一次动手",
];

export default function HomePage() {
  const posts = getAllPosts();
  const featuredPosts = getFeaturedPosts();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,1),_rgba(248,250,252,1))] text-slate-900 dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(180deg,_rgba(2,6,23,1),_rgba(15,23,42,1))] dark:text-slate-50">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-6">
          <Badge variant="outline" className="rounded-full border-emerald-200 bg-white/70 px-4 py-1 text-emerald-700 dark:border-emerald-800 dark:bg-slate-900/70 dark:text-emerald-300">
            Snow4a1l · Personal Tech Blog
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              把项目、代码和思考，整理成持续生长的个人博客。
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              这里不再是需要数据库和 API 的管理平台，而是一组可以直接静态部署的文章页面，适合放在 GitHub Pages、Vercel 或任何静态托管环境。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-emerald-600 px-6 hover:bg-emerald-700">
              <Link href={featuredPosts[0] ? `/blog/${featuredPosts[0].slug}` : "/#posts"}>
                阅读精选文章
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="#posts">查看全部文章</Link>
            </Button>
          </div>
        </div>

        <Card className="w-full max-w-md border-white/60 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="size-5 text-emerald-500" />
              博客现状
            </CardTitle>
            <CardDescription>当前这套首页已经完全不依赖 Prisma、SQLite 或 Route Handlers。</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3 sm:gap-3">
            <div className="rounded-2xl bg-slate-950 px-4 py-5 text-white dark:bg-slate-100 dark:text-slate-900">
              <div className="text-3xl font-semibold">{posts.length}</div>
              <div className="mt-1 text-sm opacity-80">篇文章</div>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-5 dark:border-slate-800">
              <div className="text-3xl font-semibold">100%</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">静态导出</div>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-5 dark:border-slate-800">
              <div className="text-3xl font-semibold">0</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">后端依赖</div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 pb-12 md:grid-cols-3">
        <Card className="border-slate-200/80 bg-white/75 dark:border-slate-800 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Code2 className="size-5 text-emerald-500" />代码札记</CardTitle>
            <CardDescription>记录实验、原型和重构时真正遇到的问题。</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-slate-200/80 bg-white/75 dark:border-slate-800 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookText className="size-5 text-sky-500" />学习复盘</CardTitle>
            <CardDescription>把课程、文档和实践串成可回顾的知识线索。</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-slate-200/80 bg-white/75 dark:border-slate-800 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PenTool className="size-5 text-amber-500" />写作原则</CardTitle>
            <CardDescription>每篇文章都尽量兼顾背景、过程和可以复制的结论。</CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Notebook</p>
            <h2 className="mt-2 text-2xl font-semibold">写作偏好</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {writingPrinciples.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-5 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/75 dark:text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="posts" className="mx-auto w-full max-w-6xl px-6 pb-20 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Posts</p>
            <h2 className="mt-2 text-3xl font-semibold">最近文章</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            文章内容目前来自本地静态数据文件，后续你只需要继续新增文章数据，网站就能在构建时自动生成页面。
          </p>
        </div>

        <Separator className="my-8" />

        <div className="grid gap-6 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Card key={post.slug} className={`border-slate-200 bg-white/80 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/75 ${index === 0 ? "lg:col-span-2" : ""}`}>
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readingTime}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>
                  ))}
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl leading-tight">{post.title}</CardTitle>
                  <CardDescription className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {post.summary}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="px-0 text-emerald-600 hover:bg-transparent hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200">
                  <Link href={`/blog/${post.slug}`}>
                    继续阅读
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
