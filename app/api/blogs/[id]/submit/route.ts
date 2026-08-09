import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Submit an existing draft/rejected blog for review without editing its content.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "AUTHOR") {
    return NextResponse.json({ error: "You must be logged in as an author." }, { status: 401 });
  }

  const author = await prisma.author.findUnique({ where: { userId: session.userId } });
  const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });
  if (!blog || !author || blog.authorId !== author.id) {
    return NextResponse.json({ error: "Blog not found." }, { status: 404 });
  }
  if (!["DRAFT", "REJECTED"].includes(blog.status)) {
    return NextResponse.json({ error: "This blog can't be submitted right now." }, { status: 403 });
  }

  await prisma.blog.update({
    where: { id: blog.id },
    data: { status: "PENDING", submittedAt: new Date(), rejectReason: null },
  });
  await prisma.blogSubmission.create({ data: { blogId: blog.id, decision: "PENDING" } });

  return NextResponse.json({ ok: true });
}
