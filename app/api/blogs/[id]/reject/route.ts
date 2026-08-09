import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({ reason: z.string().min(3).max(500) });

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a rejection reason." }, { status: 400 });
  }

  const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });
  if (!blog) return NextResponse.json({ error: "Blog not found." }, { status: 404 });
  if (blog.status !== "PENDING") {
    return NextResponse.json({ error: "Only pending blogs can be rejected." }, { status: 403 });
  }

  const now = new Date();
  await prisma.$transaction([
    prisma.blog.update({
      where: { id: blog.id },
      data: { status: "REJECTED", reviewedAt: now, rejectReason: parsed.data.reason },
    }),
    prisma.blogSubmission.updateMany({
      where: { blogId: blog.id, decision: "PENDING" },
      data: { decision: "REJECTED", reviewedBy: session.userId, reviewedAt: now, note: parsed.data.reason },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
