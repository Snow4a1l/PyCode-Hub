import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 获取所有代码列表
export async function GET() {
  try {
    const codes = await db.pythonCode.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(codes);
  } catch (error) {
    console.error('获取代码列表失败:', error);
    return NextResponse.json({ error: '获取代码列表失败' }, { status: 500 });
  }
}

// 创建新代码
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, code, category, tags, fileName } = body;

    if (!title || !code) {
      return NextResponse.json({ error: '标题和代码内容不能为空' }, { status: 400 });
    }

    const newCode = await db.pythonCode.create({
      data: {
        title,
        description: description || null,
        code,
        category: category || '其他',
        tags: tags || null,
        fileName: fileName || null,
      },
    });

    return NextResponse.json(newCode, { status: 201 });
  } catch (error) {
    console.error('创建代码失败:', error);
    return NextResponse.json({ error: '创建代码失败' }, { status: 500 });
  }
}
