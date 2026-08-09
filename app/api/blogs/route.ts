import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { uniqueSlug, calcReadingTime } from "@/lib/utils";

const createSchema = z.object({
  title: z.string().min(4).max(200),
  description: z.string().min(10).max(500),
  content: z.string().min(20),
  categoryId: z.number().int(),
  featuredImage: z.string().url().optional().or(z.literal("")),
  references: z.string().optional(),
  tags: z.array(z.string()).optional(),
  action: z.enum(["draft", "submit"]).default("draft"),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "AUTHOR") {
    return NextResponse.json({ error: "You must be logged in as an author." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }
  const data = parsed.data;

  const author = await prisma.author.findUnique({ where: { userId: session.userId } });
  if (!author) return NextResponse.json({ error: "Author profile not found." }, { status: 404 });

  const slug = await uniqueSlug(data.title, async (s) => {
    const found = await prisma.blog.findUnique({ where: { slug: s } });
    return !!found;
  });

  const status = data.action === "submit" ? "PENDING" : "DRAFT";

  const blog = await prisma.blog.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      content: data.content,
      categoryId: data.categoryId,
      authorId: author.id,
      featuredImage: data.featuredImage || null,
      references: data.references || null,
      readingTime: calcReadingTime(data.content),
      status,
      submittedAt: status === "PENDING" ? new Date() : null,
      ...(data.tags && data.tags.length > 0
        ? {
            tags: {
              create: await Promise.all(
                data.tags.map(async (name) => {
                  const slugified = name.toLowerCase().trim().replace(/\s+/g, "-");
                  const tag = await prisma.tag.upsert({
                    where: { slug: slugified },
                    update: {},
                    create: { name, slug: slugified },
                  });
                  return { tagId: tag.id };
                })
              ),
            },
          }
        : {}),
    },
  });

  if (status === "PENDING") {
    await prisma.blogSubmission.create({ data: { blogId: blog.id, decision: "PENDING" } });
  }

  return NextResponse.json({ ok: true, blog: { id: blog.id, slug: blog.slug } });
}
