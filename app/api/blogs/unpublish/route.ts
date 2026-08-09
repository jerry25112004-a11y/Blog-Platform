import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({ id: z.number().int() });

// Admin: toggle a published blog back to unpublished (or republish it).
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const blog = await prisma.blog.findUnique({ where: { id: parsed.data.id } });
  if (!blog) return NextResponse.json({ error: "Blog not found." }, { status: 404 });

  const nextStatus = blog.status === "PUBLISHED" ? "UNPUBLISHED" : "PUBLISHED";
  await prisma.blog.update({
    where: { id: blog.id },
    data: { status: nextStatus, publishedAt: nextStatus === "PUBLISHED" ? new Date() : blog.publishedAt },
  });

  return NextResponse.json({ ok: true, status: nextStatus });
}
