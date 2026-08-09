import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { toSlug } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ categories });
}

const schema = z.object({ name: z.string().min(2).max(120), description: z.string().max(500).optional() });

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid category name." }, { status: 400 });

  const category = await prisma.category.create({
    data: { name: parsed.data.name, slug: toSlug(parsed.data.name), description: parsed.data.description || null },
  });
  return NextResponse.json({ ok: true, category });
}
