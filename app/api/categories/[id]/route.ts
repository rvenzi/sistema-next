import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const { name } = await request.json();

  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "Nome da categoria é obrigatório." },
      { status: 400 }
    );
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name: name.trim() },
  });

  return NextResponse.json(category);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const transactionsCount = await prisma.transaction.count({
    where: { categoryId: id },
  });

  if (transactionsCount > 0) {
    return NextResponse.json(
      {
        error:
          "Não é possível excluir esta categoria porque existem transações vinculadas a ela.",
      },
      { status: 400 }
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}