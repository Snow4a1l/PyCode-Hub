import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 获取单个笔记详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const note = await db.note.findUnique({
      where: { id },
      include: {
        code: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json({ error: '笔记不存在' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('获取笔记详情失败:', error);
    return NextResponse.json({ error: '获取笔记详情失败' }, { status: 500 });
  }
}

// 删除笔记
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除笔记失败:', error);
    return NextResponse.json({ error: '删除笔记失败' }, { status: 500 });
  }
}

// 更新笔记
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, category, tags, isFavorite, codeId } = body;

    const updatedNote = await db.note.update({
      where: { id },
      data: {
        title,
        content,
        category: category || '其他',
        tags: tags || null,
        ...(typeof isFavorite === 'boolean' && { isFavorite }),
        codeId: codeId === '' ? null : codeId,
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

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('更新笔记失败:', error);
    return NextResponse.json({ error: '更新笔记失败' }, { status: 500 });
  }
}

// 切换收藏状态
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === 'toggleFavorite') {
      const currentNote = await db.note.findUnique({
        where: { id },
        select: { isFavorite: true },
      });

      const updatedNote = await db.note.update({
        where: { id },
        data: {
          isFavorite: !currentNote?.isFavorite,
        },
      });

      return NextResponse.json(updatedNote);
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 });
  } catch (error) {
    console.error('操作失败:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}
