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
  const { description, amount, type, categoryId } = await request.json();

  if (!description || !amount || !type || !categoryId) {
    return NextResponse.json(
      { error: "Preencha todos os campos." },
      { status: 400 }
    );
  }

  const existing = await prisma.transaction.findUnique({ where: { id } });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Transação não encontrada." },
      { status: 404 }
    );
  }

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      description,
      amount: parseFloat(amount),
      type,
      categoryId,
    },
  });

  return NextResponse.json(transaction);
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

  const existing = await prisma.transaction.findUnique({ where: { id } });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Transação não encontrada." },
      { status: 404 }
    );
  }

  await prisma.transaction.delete({ where: { id } });

  return NextResponse.json({ success: true });
}