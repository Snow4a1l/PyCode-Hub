import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 获取统计数据
export async function GET() {
  try {
    // 获取所有代码
    const codes = await db.pythonCode.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        code: true,
        isFavorite: true,
        createdAt: true,
      },
    });

    // 获取所有笔记
    const notes = await db.note.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        content: true,
        isFavorite: true,
        createdAt: true,
      },
    });

    // 代码统计
    const totalCodes = codes.length;
    const totalLines = codes.reduce((acc, code) => {
      return acc + code.code.split('\n').length;
    }, 0);
    const totalChars = codes.reduce((acc, code) => {
      return acc + code.code.length;
    }, 0);
    const categoryStats = codes.reduce((acc, code) => {
      acc[code.category] = (acc[code.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteCount = codes.filter(c => c.isFavorite).length;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = codes.filter(c => new Date(c.createdAt) >= sevenDaysAgo).length;
    const recentCodes = codes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // 笔记统计
    const totalNotes = notes.length;
    const noteCategoryStats = notes.reduce((acc, note) => {
      acc[note.category] = (acc[note.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const noteFavoriteCount = notes.filter(n => n.isFavorite).length;
    const noteRecentCount = notes.filter(n => new Date(n.createdAt) >= sevenDaysAgo).length;
    const recentNotes = notes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return NextResponse.json({
      // 代码统计
      totalCodes,
      totalLines,
      totalChars,
      categoryStats,
      favoriteCount,
      recentCount,
      recentCodes,
      // 笔记统计
      totalNotes,
      noteCategoryStats,
      noteFavoriteCount,
      noteRecentCount,
      recentNotes,
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 });
  }
}
