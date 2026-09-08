import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { description, amount, type, categoryId } = await request.json();

  if (!description || !amount || !type || !categoryId) {
    return NextResponse.json(
      { error: "Preencha todos os campos." },
      { status: 400 }
    );
  }

  if (type !== "income" && type !== "expense") {
    return NextResponse.json(
      { error: "Tipo inválido." },
      { status: 400 }
    );
  }

  const transaction = await prisma.transaction.create({
    data: {
      description,
      amount: parseFloat(amount),
      type,
      categoryId,
      userId: session.user.id,
    },
  });

  return NextResponse.json(transaction, { status: 201 });
}