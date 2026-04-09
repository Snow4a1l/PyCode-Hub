import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PyCode Hub Blog",
  description: "Snow4a1l 的个人技术博客，记录 Python、前端和学习过程中的思考。",
  keywords: ["blog", "python", "next.js", "frontend", "learning notes"],
  authors: [{ name: "Snow4a1l" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
