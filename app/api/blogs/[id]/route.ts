import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { calcReadingTime } from "@/lib/utils";

const updateSchema = z.object({
  title: z.string().min(4).max(200).optional(),
  description: z.string().min(10).max(500).optional(),
  content: z.string().min(20).optional(),
  categoryId: z.number().int().optional(),
  featuredImage: z.string().optional(),
  references: z.string().optional(),
  action: z.enum(["draft", "submit"]).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    return NextResponse.json({ error: "Only drafts or rejected blogs can be edited." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data." }, { status: 400 });
  const data = parsed.data;

  const status = data.action === "submit" ? "PENDING" : "DRAFT";

  const updated = await prisma.blog.update({
    where: { id: blog.id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.content && { content: data.content, readingTime: calcReadingTime(data.content) }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.featuredImage !== undefined && { featuredImage: data.featuredImage || null }),
      ...(data.references !== undefined && { references: data.references || null }),
      status,
      rejectReason: status === "PENDING" ? null : blog.rejectReason,
      submittedAt: status === "PENDING" ? new Date() : blog.submittedAt,
    },
  });

  if (status === "PENDING") {
    await prisma.blogSubmission.create({ data: { blogId: blog.id, decision: "PENDING" } });
  }

  return NextResponse.json({ ok: true, blog: { id: updated.id, slug: updated.slug } });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
  await prisma.blog.delete({ where: { id: blog.id } });
  return NextResponse.json({ ok: true });
}
