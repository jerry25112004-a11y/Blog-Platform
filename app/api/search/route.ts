import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json({ blogs: [] });

  const blogs = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
        { category: { name: { contains: q } } },
        { author: { user: { name: { contains: q } } } },
      ],
    },
    include: { category: true, author: { include: { user: { select: { name: true } } } } },
    orderBy: { publishedAt: "desc" },
    take: 30,
  });

  return NextResponse.json({ blogs });
}
