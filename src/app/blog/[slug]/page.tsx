import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllPosts, getPostBySlug, type BlogPost } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

function renderSection(section: BlogPost["sections"][number]) {
  switch (section.type) {
    case "paragraph":
      return <p className="text-base leading-8 text-slate-700 dark:text-slate-300">{section.text}</p>;
    case "list":
      return (
        <ul className="list-disc space-y-3 pl-5 text-base leading-8 text-slate-700 dark:text-slate-300">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="rounded-2xl border-l-4 border-emerald-500 bg-emerald-50 px-5 py-4 text-base leading-8 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
          {section.text}
        </blockquote>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-100">
          <code>{section.code}</code>
        </pre>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_rgba(248,250,252,1),_rgba(255,255,255,1))] px-6 py-12 text-slate-900 dark:bg-[linear-gradient(180deg,_rgba(2,6,23,1),_rgba(15,23,42,1))] dark:text-slate-50">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <Button asChild variant="ghost" className="w-fit px-0 text-slate-500 hover:bg-transparent hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          <Link href="/">
            <ArrowLeft className="size-4" />
            返回首页
          </Link>
        </Button>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>
            ))}
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
            <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">{post.summary}</p>
          </div>
        </div>

        <Card className="border-slate-200 bg-white/85 dark:border-slate-800 dark:bg-slate-900/80">
          <CardContent className="space-y-6 pt-6">
            {post.sections.map((section, index) => (
              <div key={`${post.slug}-${index}`}>{renderSection(section)}</div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
