type ParagraphSection = {
  type: "paragraph";
  text: string;
};

type ListSection = {
  type: "list";
  items: string[];
};

type QuoteSection = {
  type: "quote";
  text: string;
};

type CodeSection = {
  type: "code";
  code: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readingTime: string;
  tags: string[];
  featured: boolean;
  sections: Array<ParagraphSection | ListSection | QuoteSection | CodeSection>;
};

const posts: BlogPost[] = [
  {
    slug: "from-app-to-static-blog",
    title: "把一个全栈应用改造成静态个人博客，我会先拆掉什么",
    summary:
      "这篇文章记录这次改造的核心判断：什么时候应该继续维护数据库应用，什么时候应该反过来拥抱纯静态站点。",
    date: "2026-04-09",
    readingTime: "5 min read",
    tags: ["Next.js", "Static Export", "Architecture"],
    featured: true,
    sections: [
      {
        type: "paragraph",
        text: "原项目最大的障碍并不是 UI，而是它默认依赖 API Route、Prisma 和 SQLite。这种架构很适合做在线应用，但不适合直接丢进 GitHub Pages。",
      },
      {
        type: "list",
        items: [
          "先识别所有动态入口，比如 /api/*、数据库初始化、环境变量。",
          "把数据来源从运行时查询，改成构建时可读取的本地静态数据。",
          "再决定要保留哪些页面和视觉资产，避免把整个项目推倒重来。",
        ],
      },
      {
        type: "quote",
        text: "如果目标只是稳定展示内容，静态站往往比继续维护一套小型后端更可靠。",
      },
      {
        type: "code",
        code: "const nextConfig = {\n  output: 'export',\n  images: { unoptimized: true },\n  trailingSlash: true,\n};",
      },
    ],
  },
  {
    slug: "writing-notes-for-learning",
    title: "为什么我更想写可复用的学习笔记，而不是零散收藏夹",
    summary:
      "当文章能同时回答背景、过程和结论时，它才会在几周后重新帮到我。",
    date: "2026-04-07",
    readingTime: "4 min read",
    tags: ["Writing", "Learning", "Notes"],
    featured: true,
    sections: [
      {
        type: "paragraph",
        text: "我越来越不喜欢只保存链接。链接会过期，截图会失去上下文，而真正能留下来的往往是自己重新组织过的一段说明。",
      },
      {
        type: "list",
        items: [
          "记录问题是怎么出现的。",
          "写下自己最初错误的判断。",
          "补上最后真正有效的修正方式。",
        ],
      },
      {
        type: "paragraph",
        text: "这样一来，笔记不是用来证明自己学过，而是用来缩短下一次重新进入状态的时间。",
      },
    ],
  },
  {
    slug: "small-projects-build-confidence",
    title: "小项目真正有价值的地方，是它们会累积你的判断力",
    summary:
      "很多时候我们以为自己需要更大的项目，其实更需要的是更完整地做完几个小项目。",
    date: "2026-04-02",
    readingTime: "3 min read",
    tags: ["Projects", "Growth", "Frontend"],
    featured: false,
    sections: [
      {
        type: "paragraph",
        text: "一个完整的小项目会逼着人面对结构、命名、取舍、部署和复盘，而这些环节正是成长最快的地方。",
      },
      {
        type: "quote",
        text: "完成闭环，比堆积半成品更能建立长期信心。",
      },
      {
        type: "paragraph",
        text: "对个人博客来说尤其如此。哪怕只有三篇文章，只要页面能上线、结构清晰、能持续新增，它就已经开始发挥价值了。",
      },
    ],
  },
];

export function getAllPosts() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedPosts() {
  return getAllPosts().filter((post) => post.featured);
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}
