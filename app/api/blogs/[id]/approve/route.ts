import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });
  if (!blog) return NextResponse.json({ error: "Blog not found." }, { status: 404 });
  if (blog.status !== "PENDING") {
    return NextResponse.json({ error: "Only pending blogs can be approved." }, { status: 403 });
  }

  const now = new Date();
  await prisma.$transaction([
    prisma.blog.update({
      where: { id: blog.id },
      data: { status: "PUBLISHED", reviewedAt: now, publishedAt: now, rejectReason: null },
    }),
    prisma.blogSubmission.updateMany({
      where: { blogId: blog.id, decision: "PENDING" },
      data: { decision: "APPROVED", reviewedBy: session.userId, reviewedAt: now },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
