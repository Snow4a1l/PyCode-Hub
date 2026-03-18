import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 获取所有笔记列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const codeId = searchParams.get('codeId');

    const notes = await db.note.findMany({
      where: codeId ? { codeId } : undefined,
      include: {
        code: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('获取笔记列表失败:', error);
    return NextResponse.json({ error: '获取笔记列表失败' }, { status: 500 });
  }
}

// 创建新笔记
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, tags, codeId } = body;

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    const newNote = await db.note.create({
      data: {
        title,
        content,
        category: category || '其他',
        tags: tags || null,
        codeId: codeId || null,
      },
      include: {
        code: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('创建笔记失败:', error);
    return NextResponse.json({ error: '创建笔记失败' }, { status: 500 });
  }
}
