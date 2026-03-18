# PyCode Hub 🐍

<div align="center">

![PyCode Hub](https://img.shields.io/badge/PyCode-Hub-emerald?style=for-the-badge&labelColor=0d9488)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)

**一个简洁优雅的 Python 学习代码与笔记管理平台**

[在线预览](#) · [功能特性](#功能特性) · [快速开始](#快速开始) · [技术栈](#技术栈)

</div>

---

## 📖 项目简介

PyCode Hub 是一个专为 Python 学习者打造的代码与笔记管理平台。它可以帮助你：

- 📁 **管理代码**：上传、分类、收藏你学习过程中编写的 Python 代码
- 📝 **记录笔记**：写下学习心得，关联到具体代码
- 📊 **追踪进度**：通过统计面板查看学习进展

## ✨ 功能特性

### 代码管理

| 功能 | 描述 |
|------|------|
| 📤 上传代码 | 支持 .py 文件上传或直接粘贴代码 |
| 📂 分类管理 | 9 种预设分类：基础语法、数据结构、算法等 |
| ⭐ 收藏功能 | 标记重要代码，快速筛选查看 |
| 🔍 搜索筛选 | 按标题、描述、标签搜索 |
| ✏️ 编辑代码 | 随时修改已上传的代码 |
| 📥 导出代码 | 导出为 .py 文件下载 |
| 🗑️ 批量删除 | 批量管理多个代码 |

### 笔记系统

| 功能 | 描述 |
|------|------|
| 📝 创建笔记 | 记录学习心得和知识点 |
| 🔗 关联代码 | 笔记可关联到具体代码文件 |
| 🏷️ 标签分类 | 与代码统一的分类系统 |
| ⭐ 收藏笔记 | 收藏重要笔记 |

### 统计面板

- 📊 代码数量统计
- 📈 代码行数统计
- 📝 笔记数量统计
- ⭐ 收藏数量统计
- 📅 近7天新增统计
- 📉 分类分布可视化
- 🕐 最近上传记录

### 主题切换

- 🌞 浅色模式
- 🌙 深色模式
- 代码高亮自动适配主题

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- Bun 或 npm/pnpm/yarn

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/your-username/pycode-hub.git
cd pycode-hub
```

2. **安装依赖**

```bash
bun install
# 或
npm install
```

3. **配置环境变量**

```bash
cp .env.example .env
```

4. **初始化数据库**

```bash
bun run db:push
# 或
npm run db:push
```

5. **启动开发服务器**

```bash
bun run dev
# 或
npm run dev
```

6. **访问应用**

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 🛠️ 技术栈

### 前端

- **[Next.js 16](https://nextjs.org/)** - React 框架
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全
- **[Tailwind CSS 4](https://tailwindcss.com/)** - 样式框架
- **[shadcn/ui](https://ui.shadcn.com/)** - UI 组件库
- **[Lucide Icons](https://lucide.dev/)** - 图标库
- **[React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)** - 代码高亮

### 后端

- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - API 服务
- **[Prisma](https://www.prisma.io/)** - ORM 数据库工具
- **[SQLite](https://www.sqlite.org/)** - 数据库

## 📁 项目结构

```
pycode-hub/
├── prisma/
│   └── schema.prisma        # 数据库模型定义
├── public/                  # 静态资源
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── codes/       # 代码相关 API
│   │   │   ├── notes/       # 笔记相关 API
│   │   │   └── stats/       # 统计 API
│   │   ├── globals.css      # 全局样式
│   │   ├── layout.tsx       # 根布局
│   │   └── page.tsx         # 主页面
│   ├── components/ui/       # UI 组件
│   ├── hooks/               # 自定义 Hooks
│   └── lib/
│       ├── db.ts            # 数据库连接
│       └── utils.ts         # 工具函数
├── .env.example             # 环境变量模板
├── package.json             # 项目配置
└── README.md                # 项目文档
```

## 📋 数据模型

### PythonCode (代码)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | String | 唯一标识 |
| title | String | 标题 |
| description | String? | 描述 |
| code | String | 代码内容 |
| category | String | 分类 |
| tags | String? | 标签 |
| fileName | String? | 原始文件名 |
| isFavorite | Boolean | 是否收藏 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### Note (笔记)

| 字段 | 类型 | 描述 |
|------|------|------|
| id | String | 唯一标识 |
| title | String | 标题 |
| content | String | 笔记内容 |
| category | String | 分类 |
| tags | String? | 标签 |
| isFavorite | Boolean | 是否收藏 |
| codeId | String? | 关联代码ID |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

## 🔧 可用脚本

```bash
# 开发
bun run dev          # 启动开发服务器

# 数据库
bun run db:push      # 推送数据库模型
bun run db:generate  # 生成 Prisma Client

# 代码检查
bun run lint         # 运行 ESLint

# 构建
bun run build        # 构建生产版本
bun run start        # 启动生产服务器
```

## 📸 截图

### 代码库页面
![代码库](./screenshots/codes.png)

### 笔记页面
![笔记](./screenshots/notes.png)

### 统计页面
![统计](./screenshots/stats.png)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 💬 联系方式

如有问题或建议，欢迎：

- 提交 [Issue](https://github.com/your-username/pycode-hub/issues)
- 发送邮件至 your-email@example.com

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

Made with ❤️ by [Your Name]

</div>
