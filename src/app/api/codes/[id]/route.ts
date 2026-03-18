import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 获取单个代码详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const code = await db.pythonCode.findUnique({
      where: { id },
    });

    if (!code) {
      return NextResponse.json({ error: '代码不存在' }, { status: 404 });
    }

    return NextResponse.json(code);
  } catch (error) {
    console.error('获取代码详情失败:', error);
    return NextResponse.json({ error: '获取代码详情失败' }, { status: 500 });
  }
}

// 删除代码
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.pythonCode.delete({
      where: { id },
    });

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除代码失败:', error);
    return NextResponse.json({ error: '删除代码失败' }, { status: 500 });
  }
}

// 更新代码
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, code, category, tags, isFavorite } = body;

    const updatedCode = await db.pythonCode.update({
      where: { id },
      data: {
        title,
        description: description || null,
        code,
        category: category || '其他',
        tags: tags || null,
        ...(typeof isFavorite === 'boolean' && { isFavorite }),
      },
    });

    return NextResponse.json(updatedCode);
  } catch (error) {
    console.error('更新代码失败:', error);
    return NextResponse.json({ error: '更新代码失败' }, { status: 500 });
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
      const currentCode = await db.pythonCode.findUnique({
        where: { id },
        select: { isFavorite: true },
      });

      const updatedCode = await db.pythonCode.update({
        where: { id },
        data: {
          isFavorite: !currentCode?.isFavorite,
        },
      });

      return NextResponse.json(updatedCode);
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 });
  } catch (error) {
    console.error('操作失败:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}
