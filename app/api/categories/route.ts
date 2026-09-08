import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { name } = await request.json();

  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "Nome da categoria é obrigatório." },
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: { name: name.trim() },
  });

  return NextResponse.json(category, { status: 201 });
}