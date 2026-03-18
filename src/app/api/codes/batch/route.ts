import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 批量删除代码
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '请选择要删除的代码' }, { status: 400 });
    }

    await db.pythonCode.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({ message: `成功删除 ${ids.length} 个代码` });
  } catch (error) {
    console.error('批量删除失败:', error);
    return NextResponse.json({ error: '批量删除失败' }, { status: 500 });
  }
}
